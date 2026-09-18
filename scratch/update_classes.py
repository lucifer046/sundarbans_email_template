import re

with open('Unity_tricolour_mail.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Let's add class="btn-register" to the register buttons and add class="btn-td" to the table
html = html.replace('text-transform: uppercase;">Register Here</a>', 'text-transform: uppercase;" class="btn-register">Register Here</a>')
html = html.replace('text-transform: uppercase;">Registration', 'text-transform: uppercase;" class="btn-register">Registration')
html = html.replace('<td style="padding: 0 30px 30px 30px"', '<td style="padding: 0 30px 30px 30px" class="btn-td"')
html = html.replace('<td style="padding: 0 30px 30px 30px;"', '<td style="padding: 0 30px 30px 30px;" class="btn-td"')

# Also adjust media query for the btn-td class
media_query_old = '.btn-register {\n          padding: 10px 15px !important;\n          font-size: 10px !important;\n        }'
media_query_new = '.btn-td {\n          padding: 0 10px 20px 10px !important;\n        }\n        .btn-register {\n          padding: 10px 15px !important;\n          font-size: 10px !important;\n        }'

if media_query_old in html:
    html = html.replace(media_query_old, media_query_new)

with open('Unity_tricolour_mail.html', 'w', encoding='utf-8') as f:
    f.write(html)

print('Updated classes!')
