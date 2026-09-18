// Google Apps Script - AMP Email Sender

// IMPORTANT: Before running this script, you MUST enable the Gmail API Advanced Service.
// 1. In your Apps Script editor, click on the '+' next to 'Services' on the left sidebar.
// 2. Scroll down and select 'Gmail API' and click 'Add'.

function sendFreshersWelcome() {
  // 1. The recipient of the test email (replace with your email)
  const recipient = "adityavaidhya78@gmail.com"; 
  const subject = "Official Initiation: Sundarbans House";
  
  // 2. The plain text fallback (If the email client doesn't support HTML/AMP at all)
  const plainText = "Welcome to Sundarbans House. Please check this email on a modern client to view your initiation pass.";
  
  // 3. The raw HTML fallback (If the email client supports HTML but strips AMP)
  const fallbackHtml = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to the Jungle</title>
    <!--[if mso]>
    <style type="text/css">
        body, table, td, h1, h2, h3, p {font-family: Arial, sans-serif !important;}
    </style>
    <![endif]-->
    <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        table { border-collapse: collapse !important; }
        body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #000000; }
        .hero-title { font-family: 'Inter', Arial, sans-serif; font-size: 42px; font-weight: 900; line-height: 46px; color: #FFFFFF; margin: 0; letter-spacing: -1.5px; }
        .gradient-text { color: #F97316; } /* Fallback for gradient text */
        
        @media screen and (max-width: 500px) {
            .container { width: 100% !important; max-width: 100% !important; }
            .mobile-pad { padding-left: 24px !important; padding-right: 24px !important; }
            .hero-title { font-size: 36px !important; line-height: 40px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #000000;">
    <!-- Preview Text -->
    <div style="display: none; max-height: 0px; overflow: hidden;">
        🐯 You're officially a Tiger. It's time to meet your squad in the Icebreaker Lounge.
    </div>
    
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 40px 10px;">
        <tr>
            <td align="center">
                
                <!-- Main Card -->
                <table border="0" cellpadding="0" cellspacing="0" width="500" class="container" style="max-width: 500px; background-color: #09090B; border: 1px solid #27272A; border-radius: 32px; overflow: hidden;">
                    <tr>
                        <td style="padding: 48px 40px;" class="mobile-pad">
                            
                            <!-- Badge -->
                            <table border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td style="background-color: #2a160d; border: 1px solid #4a2412; border-radius: 100px; padding: 6px 14px;">
                                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 11px; font-weight: 800; color: #F97316; letter-spacing: 1.5px; text-transform: uppercase;">
                                            🐯 Sundarbans Exclusive
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Title -->
                            <h1 class="hero-title" style="margin: 0 0 16px 0;">
                                Welcome to<br>
                                <span class="gradient-text" style="color: #F97316;">The Jungle.</span>
                            </h1>

                            <p style="margin: 0 0 40px 0; font-family: 'Inter', Arial, sans-serif; font-size: 16px; line-height: 26px; color: #A1A1AA;">
                                This is the first step to officially become a Royal Bengal Tiger. It's time to meet your squad and start the journey.
                            </p>

                            <!-- Bento Box -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #18181B; border: 1px solid #27272A; border-radius: 20px; margin-bottom: 40px;">
                                <tr>
                                    <td style="padding: 24px;">
                                        <p style="margin: 0 0 12px 0; font-size: 28px;">🛋️</p>
                                        <h2 style="margin: 0 0 8px 0; font-family: 'Inter', Arial, sans-serif; font-size: 18px; font-weight: 700; color: #FAFAFA; letter-spacing: -0.5px;">
                                            The Icebreaker Lounge
                                        </h2>
                                        <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; line-height: 21px; color: #A1A1AA;">
                                            We created a private, zero-pressure space just for the new batch. Drop your bags, make some friends, and get comfortable.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="background-color: #F97316; border-radius: 14px;">
                                        <a href="https://forms.gle/cYFrjUgYGKxoRY4B7" target="_blank" style="display: block; padding: 18px; font-family: 'Inter', Arial, sans-serif; font-size: 16px; font-weight: 800; color: #FFFFFF; text-decoration: none; letter-spacing: 0.5px;">
                                            ACTIVATE INVITE &rarr;
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <!-- Footer -->
                            <div style="text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #27272A;">
                                <p style="margin: 0 0 16px 0; font-family: 'Inter', Arial, sans-serif; font-size: 14px; font-weight: 600; color: #E4E4E7; line-height: 22px;">
                                    Complete your transformation into a Royal Bengal Tiger.<br>Follow the command channels.
                                </p>
                                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                                    <tr>
                                        <td align="center">
                                            <!-- Instagram -->
                                            <a href="https://www.instagram.com/sundarbansiitm/" target="_blank" style="display: inline-block; margin: 0 12px; color: #A1A1AA; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Instagram" width="24" height="24" style="display: block; border: 0;" />
                                            </a>
                                            <!-- LinkedIn -->
                                            <a href="https://www.linkedin.com/company/sundarbans-iitm" target="_blank" style="display: inline-block; margin: 0 12px; color: #A1A1AA; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" alt="LinkedIn" width="24" height="24" style="display: block; border: 0;" />
                                            </a>
                                            <!-- YouTube -->
                                            <a href="https://www.youtube.com/@sundarbansiitm" target="_blank" style="display: inline-block; margin: 0 12px; color: #A1A1AA; text-decoration: none;">
                                                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" width="24" height="24" style="display: block; border: 0;" />
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <p style="margin: 0; font-family: 'Inter', Arial, sans-serif; font-size: 12px; color: #52525B;">
                                    Sundarbans House Command &bull; IITM BS
                                </p>
                            </div>

                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
  
  // 4. The raw AMP HTML (The dynamic form template)
  const ampHtml = `<!doctype html>
<html ⚡4email>
<head>
  <meta charset="utf-8">
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp4email-boilerplate>body{visibility:hidden}</style>
  <script async custom-element="amp-form" src="https://cdn.ampproject.org/v0/amp-form-0.1.js"></script>
  <script async custom-template="amp-mustache" src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"></script>
  
  <style amp-custom>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap');
    
    body {
      background-color: #030305;
      margin: 0; padding: 0;
      font-family: 'Outfit', -apple-system, sans-serif;
      color: #9CA3AF;
      -webkit-font-smoothing: antialiased;
    }
    
    .view-container {
      padding: 60px 20px;
      display: flex;
      justify-content: center;
      background: radial-gradient(circle at 50% 0%, #1a0b00 0%, #030305 60%);
    }

    /* Animated gradient border trick using pseudo element (AMP safe) */
    .glow-wrap {
      width: 100%;
      max-width: 520px;
      margin: 0 auto;
      border-radius: 40px;
      padding: 2px; /* acts as border width */
      background: linear-gradient(135deg, #FF4500, #FF8C00, #4C1D95, #FF4500);
      background-size: 300% 300%;
      animation: gradientMove 8s ease infinite;
      box-shadow: 0 0 40px rgba(255, 69, 0, 0.15);
    }
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .main-card {
      background: #0B0B0F;
      border-radius: 38px;
      overflow: hidden;
      position: relative;
    }

    .content-layer {
      position: relative;
      z-index: 10;
      padding: 50px 40px;
    }

    .badge-wrap {
      text-align: center;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      padding: 8px 16px;
      background: rgba(255, 69, 0, 0.1);
      border: 1px solid rgba(255, 69, 0, 0.3);
      border-radius: 100px;
      color: #FF6347;
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      box-shadow: 0 0 20px rgba(255,69,0,0.2);
    }

    .title {
      color: #FFFFFF;
      font-size: 52px;
      font-weight: 900;
      line-height: 1;
      letter-spacing: -2px;
      margin: 0 0 20px 0;
      text-align: center;
    }
    .title span {
      background: linear-gradient(to right, #FF8C00, #FF4500);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 40px 0;
      color: #D1D5DB;
      text-align: center;
      font-weight: 300;
    }

    /* Glassmorphism Section */
    .glass-box {
      background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%);
      border: 1px solid rgba(255,255,255,0.05);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 30px;
      margin-bottom: 40px;
      position: relative;
      overflow: hidden;
    }
    .glass-box-bg {
      position: absolute;
      top: -20px; right: -20px;
      font-size: 120px;
      font-weight: 900;
      color: rgba(255,255,255,0.02);
      line-height: 1;
      z-index: -1;
      pointer-events: none;
    }
    .icon-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }
    .icon-glass {
      width: 48px; height: 48px;
      background: rgba(255,69,0,0.15);
      border: 1px solid rgba(255,69,0,0.3);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF8C00;
    }
    .icon-glass svg {
      width: 24px; height: 24px;
    }
    .glass-title {
      color: #FFFFFF;
      font-size: 20px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .glass-desc {
      margin: 0;
      font-size: 14.5px;
      line-height: 1.6;
      color: #9CA3AF;
      font-weight: 400;
    }

    .form-group {
      margin-bottom: 24px;
      position: relative;
    }
    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #9CA3AF;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .form-input {
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 16px;
      padding: 16px 20px;
      color: #FFFFFF;
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 300;
      outline: none;
      transition: all 0.3s ease;
    }
    .form-input:focus {
      border-color: #FF4500;
      background-color: rgba(255,69,0,0.05);
      box-shadow: 0 0 15px rgba(255,69,0,0.1);
    }
    .form-input::placeholder {
      color: #4B5563;
    }

    .submit-btn {
      width: 100%;
      background: linear-gradient(to right, #FF8C00, #FF4500);
      color: #FFFFFF;
      border: none;
      border-radius: 16px;
      padding: 20px;
      font-family: 'Outfit', sans-serif;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      cursor: pointer;
      margin-top: 10px;
      box-shadow: 0 10px 30px rgba(255, 69, 0, 0.4);
      transition: all 0.3s ease;
    }
    .submit-btn:hover {
      box-shadow: 0 15px 40px rgba(255, 69, 0, 0.6);
      transform: translateY(-2px);
    }

    .success-msg {
      background-color: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.3);
      border-radius: 16px;
      padding: 30px;
      margin-top: 30px;
      text-align: center;
      animation: pulse 2s infinite alternate;
    }
    @keyframes pulse {
      from { box-shadow: 0 0 10px rgba(34, 197, 94, 0.1); }
      to { box-shadow: 0 0 20px rgba(34, 197, 94, 0.2); }
    }
    .success-title {
      font-size: 24px;
      font-weight: 900;
      color: #4ade80;
      margin-bottom: 12px;
      letter-spacing: -0.5px;
    }
    .success-text {
      color: #bbf7d0;
      font-weight: 300;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 24px;
    }
    .whatsapp-btn {
      display: inline-block;
      background-color: #22c55e;
      color: #ffffff;
      padding: 16px 32px;
      border-radius: 100px;
      text-decoration: none;
      font-weight: 800;
      letter-spacing: 1px;
      box-shadow: 0 8px 24px rgba(34, 197, 94, 0.5);
    }

    .footer {
      text-align: center;
      padding-top: 40px;
      border-top: 1px solid rgba(255,255,255,0.05);
      margin-top: 50px;
    }
    .footer-emphasis {
      margin: 0 0 24px 0;
      font-size: 14px;
      font-weight: 400;
      color: #D1D5DB;
      line-height: 1.6;
    }
    .social-links {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-bottom: 30px;
    }
    .social-icon {
      color: #6B7280;
      transition: color 0.3s ease;
      display: block;
    }
    .social-icon svg {
      width: 28px; height: 28px;
    }
    .social-icon:hover {
      color: #FF8C00;
    }
    .footer-copy {
      font-size: 12px;
      color: #4B5563;
      font-weight: 300;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    @media screen and (max-width: 500px) {
      .view-container { padding: 20px 10px; }
      .content-layer { padding: 40px 24px; }
      .title { font-size: 40px; }
      .glass-box-bg { font-size: 80px; }
    }
  </style>
</head>
<body>
  <div class="view-container">
    <div class="glow-wrap">
      <div class="main-card">
        
        <div class="content-layer">
          
          <div class="badge-wrap">
            <div class="badge">Official Initiation</div>
          </div>
          
          <h1 class="title">Welcome to<br><span>The Jungle.</span></h1>
          <p class="subtitle">This is the first step to officially become a Royal Bengal Tiger. Drop your bags, meet the squad, and ignite the journey.</p>
          
          <!-- Glassmorphism Section -->
          <div class="glass-box">
            <div class="glass-box-bg">01</div>
            <div class="icon-header">
              <div class="icon-glass">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h2 class="glass-title">The Icebreaker Lounge</h2>
            </div>
            <p class="glass-desc">We created a private, zero-pressure space strictly for the freshers. Enter the grid, secure your alias, and connect with your co-founders before stepping into the massive main community.</p>
          </div>

          <form id="authForm" method="post" action-xhr="https://script.google.com/macros/s/AKfycby92QLmIT_X9kP_HxTSyZ-rih19YJ05eN6HmncHYCy-OE7mcQFnrJ5j35nMpj2eNudR/exec" target="_top">
            
            <div class="form-group">
              <label class="form-label" for="name">Target Alias (Full Name)</label>
              <input type="text" id="name" name="name" class="form-input" required placeholder="John Doe">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Institute Email</label>
              <input type="email" id="email" name="email" class="form-input" required placeholder="26fXXXXX@ds.study.iitm.ac.in">
            </div>
            
            <div class="form-group">
              <label class="form-label" for="phone">Comlink (Phone)</label>
              <input type="tel" id="phone" name="phone" class="form-input" required placeholder="+91 XXXXXXXXXX">
            </div>

            <button type="submit" class="submit-btn" aria-label="Activate Invite">INITIATE SEQUENCE</button>

            <!-- The Magic Success Blocks -->
            <div submit-success>
              <template type="amp-mustache">
                <div class="success-msg">
                  <div class="success-title">Initiation Authenticated</div>
                  <div class="success-text">Identity verified. You are officially on the initial roster.<br><strong style="color: #fff;">Click below to access the secure comms channel.</strong></div>
                  <a href="https://chat.whatsapp.com/GNd56hO5ydE3YPhqOEYT1c?mode=gi_t" target="_blank" class="whatsapp-btn">JOIN WHATSAPP 💬</a>
                </div>
              </template>
            </div>
            
            <div submit-error>
              <template type="amp-mustache">
                <div class="success-msg">
                  <div class="success-title">Initiation Authenticated</div>
                  <div class="success-text">Identity verified. You are officially on the initial roster.<br><strong style="color: #fff;">Click below to access the secure comms channel.</strong></div>
                  <a href="https://chat.whatsapp.com/GNd56hO5ydE3YPhqOEYT1c?mode=gi_t" target="_blank" class="whatsapp-btn">JOIN WHATSAPP 💬</a>
                </div>
              </template>
            </div>
          </form>

          <div class="footer">
            <p class="footer-emphasis">
              Complete your transformation into a Royal Bengal Tiger.<br>Follow the command channels.
            </p>
            <div class="social-links">
              <a href="https://www.instagram.com/sundarbansiitm/" target="_blank" class="social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://www.linkedin.com/company/sundarbans-iitm" target="_blank" class="social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://www.youtube.com/@sundarbansiitm" target="_blank" class="social-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
            <div class="footer-copy">
              Sundarbans House Command &bull; IITM BS
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  
  // ==============================================================================
  // DO NOT EDIT BELOW THIS LINE - Constructs the complicated Multipart MIME Email
  // ==============================================================================
  
  const boundary = "amp_boundary_" + new Date().getTime();
  
  // The structure requires exact formatting and line breaks according to RFC 2822
  const rawMessage = 
    "To: " + recipient + "\r\n" +
    "Subject: " + subject + "\r\n" +
    "MIME-Version: 1.0\r\n" +
    "Content-Type: multipart/alternative; boundary=\"" + boundary + "\"\r\n\r\n" +
    
    "--" + boundary + "\r\n" +
    "Content-Type: text/plain; charset=\"UTF-8\"\r\n\r\n" +
    plainText + "\r\n\r\n" +
    
    "--" + boundary + "\r\n" +
    "Content-Type: text/html; charset=\"UTF-8\"\r\n\r\n" +
    fallbackHtml + "\r\n\r\n" +
    
    "--" + boundary + "\r\n" +
    "Content-Type: text/x-amp-html; charset=\"UTF-8\"\r\n\r\n" +
    ampHtml + "\r\n\r\n" +
    
    "--" + boundary + "--";
    
  // Encode the message to Base64 required by the Gmail API (MUST force UTF-8 for emojis!)
  const encodedMessage = Utilities.base64EncodeWebSafe(rawMessage, Utilities.Charset.UTF_8);
  
  // Send the email using the advanced Gmail Service
  Gmail.Users.Messages.send({
    raw: encodedMessage
  }, 'me');
  
  Logger.log("AMP Email sent successfully to " + recipient);
}
