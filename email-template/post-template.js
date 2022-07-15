/**
 * DOUHave SES template when posting a new item.
 * @author dassiorleando
*/
module.exports = {
    "Template": {
      "TemplateName": "DOUHAVE_POST_TEMPLATE",
      "SubjectPart": "New Item Posted",
      "HtmlPart": `<html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0;">
         <meta name="format-detection" content="telephone=no">
      
        <style>
@media all and (min-width: 560px) {
  .container {
    border-radius: 8px;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    -khtml-border-radius: 8px;
  }
}
</style>
        <title>New Item Posted</title>
      </head>
      
      <body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="min-width: 100%; border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; background-color: #F0F0F0; color: #000000; width: 100%; height: 100%;" bgcolor="#F0F0F0" text="#000000">
      
      <table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; width: 100%; border-collapse: collapse;" class="background"><tr><td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; border-collapse: collapse;" bgcolor="#F0F0F0">
      
      <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; padding: 0; width: inherit; max-width: 560px; border-collapse: collapse;" class="wrapper">
      
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 20px; padding-bottom: 20px; border-collapse: collapse;" width="87.5%">
      
            <a target="_blank" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; color: #127DB3; text-decoration: none;" href="https://www.douhave.co"><img border="0" vspace="0" hspace="0" src="https://douhave-files.s3.us-east-2.amazonaws.com/Primary+Logo/Primary+Logo-+Gold.png" width="200" style="line-height: 100%; color: #000000; font-size: 10px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"></a>
      
          </td>
        </tr>
      </table>
      
      <table border="0" cellpadding="0" cellspacing="0" align="center" bgcolor="#FFFFFF" width="560" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; padding: 0; width: inherit; max-width: 560px; border-collapse: collapse;" class="container">
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%; padding-top: 25px; color: #000000; font-family: sans-serif; border-collapse: collapse;" class="header" width="87.5%">
              New Item Posted
          </td>
        </tr>
        
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 25px; color: #000000; font-family: sans-serif; border-collapse: collapse;" class="paragraph" width="87.5%">
              {{itemTitle}} | &#36;{{itemBudget}}
          </td>
        </tr>
        
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 25px; color: #000000; font-family: sans-serif; border-collapse: collapse;" class="paragraph" width="87.5%">
              Thank you for Posting on DOUHAVE! Your Free Results will be in your messages in 24 hours!
          </td>
        </tr>
      
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 25px; border-collapse: collapse;" class="line" width="87.5%"><hr color="#e4a62d" align="center" width="100%" size="1" noshade="" style="margin: 0; padding: 0;">
          </td>
        </tr>
      
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%; padding-top: 20px; padding-bottom: 25px; color: #000000; font-family: sans-serif; border-collapse: collapse;" class="paragraph" width="87.5%">
              Have a&nbsp;question? <a href="mailto:team@douhave.co" target="_blank" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; color: #127DB3; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 160%;">Team@DoUhave.co</a>
          </td>
        </tr>
      
      </table>
      <table border="0" cellpadding="0" cellspacing="0" align="center" width="560" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; padding: 0; width: inherit; max-width: 560px; border-collapse: collapse;" class="wrapper">
      
        <tr>
          <td align="center" valign="top" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; padding-top: 25px; border-collapse: collapse;" class="social-icons" width="87.5%"><table width="256" border="0" cellpadding="0" cellspacing="0" align="center" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-spacing: 0; padding: 0; border-collapse: collapse;">
            <tr>
              <td align="center" valign="middle" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-spacing: 0; border-collapse: collapse;"><a target="_blank" href="https://www.facebook.com/DoUhave.co" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; color: #127DB3; text-decoration: none;"><img border="0" vspace="0" hspace="0" style="line-height: 100%; padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block; color: #000000;" alt="F" title="Facebook" width="44" height="44" src="https://douhave-files.s3.us-east-2.amazonaws.com/facebook.png"></a></td>
      
              <td align="center" valign="middle" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-spacing: 0; border-collapse: collapse;"><a target="_blank" href="https://www.instagram.com/douhave.co/" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; color: #127DB3; text-decoration: none;"><img border="0" vspace="0" hspace="0" style="line-height: 100%; padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block; color: #000000;" alt="I" title="Instagram" width="44" height="44" src="https://douhave-files.s3.us-east-2.amazonaws.com/instagram.png"></a></td>
              
              <td align="center" valign="middle" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin: 0; padding: 0; padding-left: 10px; padding-right: 10px; border-spacing: 0; border-collapse: collapse;"><a target="_blank" href="https://www.linkedin.com/company/douhave/" style="-webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; color: #127DB3; text-decoration: none;"><img border="0" vspace="0" hspace="0" style="line-height: 100%; padding: 0; margin: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: inline-block; color: #000000;" alt="G" title="Google Plus" width="44" height="44" src="https://douhave-files.s3.us-east-2.amazonaws.com/linkedin.png"></a></td>
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
