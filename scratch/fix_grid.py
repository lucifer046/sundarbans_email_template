import re

with open('Unity_tricolour_mail.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Extract the grid section
grid_start_marker = '<!-- MEETUP GRID START -->'
outro_marker = '<!-- OUTRO -->'

grid_start_idx = html.find(grid_start_marker)
outro_idx = html.find(outro_marker)

grid_html = html[grid_start_idx:outro_idx]

# Extract all cards. Each card is identified by <!-- Card: Name -->
cards = {}
card_names = ['Bhubaneswar', 'Udaipur', 'New Delhi', 'Jammu', 'Ayodhya', 'Lucknow', 'Kota', 'Vrindavan', 'Sirsa', 'Jabalpur']

for name in card_names:
    marker = f'<!-- Card: {name} -->'
    start = grid_html.find(marker)
    # The table starts right after the marker
    table_start = grid_html.find('<table', start)
    # We need to find the matching </table>
    # We can just count <table and </table
    count = 0
    pos = table_start
    while pos < len(grid_html):
        next_open = grid_html.find('<table', pos)
        next_close = grid_html.find('</table', pos)
        
        if next_open != -1 and next_open < next_close:
            count += 1
            pos = next_open + 6
        elif next_close != -1:
            count -= 1
            pos = next_close + 8
            if count == 0:
                break
        else:
            break
            
    card_content = grid_html[start:pos]
    cards[name] = card_content

rows = [
    ('New Delhi', 'Jammu'),
    ('Ayodhya', 'Lucknow'),
    ('Bhubaneswar', 'Udaipur'),
    ('Kota', 'Vrindavan'),
    ('Sirsa', 'Jabalpur')
]

new_grid_html = grid_start_marker + '\n        <tr>\n          <td style="padding: 0 0 40px 0;">\n\n'

for i, (left, right) in enumerate(rows):
    new_grid_html += f'            <!-- ROW {i+1} (Half Width) -->\n'
    new_grid_html += '            <table width="100%" border="0" cellpadding="0" cellspacing="0">\n'
    new_grid_html += '              <tr>\n'
    new_grid_html += '                <td class="stack-col" width="50%" valign="top" style="padding: 10px;">\n'
    
    # Indent the card lines properly
    left_lines = cards[left].strip().split('\n')
    left_indented = '\n'.join('                  ' + line.strip() for line in left_lines)
    new_grid_html += f'                  {left_indented}\n'
    
    new_grid_html += '                </td>\n'
    new_grid_html += '                <td class="stack-col" width="50%" valign="top" style="padding: 10px;">\n'
    
    right_lines = cards[right].strip().split('\n')
    right_indented = '\n'.join('                  ' + line.strip() for line in right_lines)
    new_grid_html += f'                  {right_indented}\n'
    
    new_grid_html += '                </td>\n'
    new_grid_html += '              </tr>\n'
    new_grid_html += '            </table>\n\n'

new_grid_html += '          </td>\n        </tr>\n        \n        '

final_html = html[:grid_start_idx] + new_grid_html + html[outro_idx:]

with open('Unity_tricolour_mail.html', 'w', encoding='utf-8') as f:
    f.write(final_html)

print('Successfully reordered grid rows 1, 2, 3 -> 2, 3, 1.')
