/**
 * DOUHave SES template when signing up.
 * @author dassiorleando
*/
module.exports = {
    "Template": {
      "TemplateName": "DOUHAVE_SIGNUP_TEMPLATE",
      "SubjectPart": "Thanks {{userEmail}} For signing up",
      "HtmlPart": `<html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0;">
         <meta name="format-detection" content="telephone=no"/>
      
        <style>
      /* Reset styles */ 
      body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
      body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
      table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
      #outlook a { padding: 0; }
      .ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
      .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
      
      /* Rounded corners for advanced mail clients only */ 
      @media all and (min-width: 560px) {
        .container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
      }
      
      /* Set color for auto links (addresses, dates, etc.) */ 
      a, a:hover {
        color: #127DB3;
      }
      .footer a, .footer a:hover {
        color: #999999;
      }
      
         </style>
      
        <!-- MESSAGE SUBJECT -->
        <title>Welcome Email</title>
      
      </head>
      
      <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
        background-color: #F0F0F0;
        color: #000000;"
        bgcolor="#F0F0F0"
        text="#000000">
      
      <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
        bgcolor="#F0F0F0">
      
      <table border="0" cellpadding="0" cellspacing="0" align="center"
        width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
        max-width: 560px;" class="wrapper">
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
            padding-top: 20px;
            padding-bottom: 20px;">
      
            <a target="_blank" style="text-decoration: none;"
              href="https://www.douhave.co"><img border="0" vspace="0" hspace="0"
              src="https://douhave-files.s3.us-east-2.amazonaws.com/Primary+Logo/Primary+Logo-+Gold.png"
              width="200"
              style="
              color: #000000;
              font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;" /></a>
      
          </td>
        </tr>
      </table>
      
      <table border="0" cellpadding="0" cellspacing="0" align="center"
        bgcolor="#FFFFFF"
        width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
        max-width: 560px;" class="container">
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
            padding-top: 25px;
            color: #000000;
            font-family: sans-serif;" class="header">
              Welcome {{userEmail}}
          </td>
        </tr>
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
            padding-top: 25px; 
            color: #000000;
            font-family: sans-serif;" class="paragraph">
              Thank you for signing up with DOUHAVE! A marketplace driven by NEEDS!
          </td>
        </tr>
        
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
            padding-top: 25px; 
            color: #000000;
            font-family: sans-serif;" class="paragraph">
              Don't forget to POST what you are looking for and to connect with others!
          </td>
        </tr>
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
            padding-top: 25px;
            padding-bottom: 5px;" class="button"><a
            href="https://www.douhave.co/WhatYouNeed" target="_blank" style="text-decoration: underline;">
              <table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
                bgcolor="#e4a62d"><a target="_blank" style="text-decoration: underline;
                color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
                href="https://www.douhave.co/WhatYouNeed">
                  Post New Item
                </a>
            </td></tr></table></a>
          </td>
        </tr>

        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
            padding-top: 25px;" class="line"><hr
            color="#e4a62d" align="center" width="100%" size="1" noshade style="margin: 0; padding: 0;" />
          </td>
        </tr>
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
            padding-top: 20px;
            padding-bottom: 25px;
            color: #000000;
            font-family: sans-serif;" class="paragraph">
              Have a&nbsp;question? <a href="mailto:team@douhave.co" target="_blank" style="color: #127DB3; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">Team@DoUhave.co</a>
          </td>
        </tr>
      </table>
      
      <table border="0" cellpadding="0" cellspacing="0" align="center"
        width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
        max-width: 560px;" class="wrapper">
      
        <tr>
          <td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
            padding-top: 25px;" class="social-icons"><table
            width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="border-collapse: collapse; border-spacing: 0; padding: 0;">
            <tr>
      
              <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                href="https://www.facebook.com/DoUhave.co"
              style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                color: #000000;"
                alt="F" title="Facebook"
                width="44" height="44"
                src="https://douhave-files.s3.us-east-2.amazonaws.com/facebook.png"></a></td>
      
              <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                href="https://www.instagram.com/douhave.co/"
              style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                color: #000000;"
                alt="I" title="Instagram"
                width="44" height="44"
                src="https://douhave-files.s3.us-east-2.amazonaws.com/instagram.png"></a></td>
              
              <td align="center" valign="middle" style="margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-collapse: collapse; border-spacing: 0;"><a target="_blank"
                href="https://www.linkedin.com/company/douhave/"
              style="text-decoration: none;"><img border="0" vspace="0" hspace="0" style="padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block;
                color: #000000;"
                alt="G" title="Google Plus"
                width="44" height="44"
                src="https://douhave-files.s3.us-east-2.amazonaws.com/linkedin.png"></a></td>
            </tr>
            </table>
          </td>
        </tr>
      </table>
      
      </td></tr></table>
      
      </body>
      </html>`
    }
}
