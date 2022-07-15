/**
 * To send emails using SES service + mailing list integrations.
 * @author dassiorleando
 */
const AWS = require("aws-sdk");
const config = require("../config");
const Mailchimp = require("mailchimp-api-v3");
const constant = require("../config/constant");
const mailchimp = new Mailchimp(config.MAILCHIMP_API_KEY);

// Setting up the AWS credentials into the SDK
AWS.config.update({
  region: "us-east-2",
  accessKeyId: config.AWS_ACCESS_KEY,
  secretAccessKey: config.AWS_SECRET_KEY,
});

// SES object
const SES = new AWS.SES();

/**
 * Sends an email to some addresses.
 * @link https://mailchimp.com/developer/transactional/guides/quick-start || https://stackoverflow.com/a/65234912
 * @param {string} emails The email address(es) to send the message to.
 * @param {string} subject The subject to send.
 * @param {string} message The message (or template data) to send.
 * @param {string} template The template to use for the email (optional).
 * @returns {Promise<Object>} A promise that returns to the sending status.
 */
exports.sendEmail = async function (
  subject,
  message,
  emails = [],
  template = ""
) {
  // If it's a string we convert it to an array
  if (typeof emails === "string" || emails instanceof String) {
    emails = [emails];
  }

  // Some validations
  if (!subject || !message || emails.length === 0)
    return Promise.reject({ status: false, data: "Invalid data provided!" });

  // Param to send an email via SES.
  const params = {
    Source: constant.fromEmailAddres,
    // ConfigurationSetName: 'DOUHAVE_CONFIGURATION_SET',
    Destination: {
      ToAddresses: emails,
    },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: message } },
    },
  };

  // Simple email, the template field is not provided.
  if (!template) return SES.sendEmail(params).promise();

  // Properly handling template emails.
  params.Template = template;
  params.TemplateData = JSON.stringify(message);
  delete params.Message;

  return SES.sendTemplatedEmail(params).promise();
};

/**
 * Adding a new user/member to our mailchimp mailing (audience) list.
 * @param {*} user The user details: email, firstName and lastName.
 * @returns {Promise<Object>} The success or error message.
 */
exports.addToMailingList = function (user) {
  return new Promise((resolve, reject) => {
    // Some validations
    if (!user || !user.email)
      return reject({
        success: false,
        message: "Invalid member details provided.",
      });

    mailchimp
      .post(`/lists/${constant.mailchimpListId}/members`, {
        email_address: user.email,
        status: "subscribed",
        merge_fields: {
          FNAME: user.firstName,
          LNAME: user.lastName,
        },
      })
      .then(function (results) {
        resolve({ success: true, message: "Member added to mailchimp list." });
      })
      .catch(function (err) {
        reject(err && err.response && err.response.body);
      });
  });
};
