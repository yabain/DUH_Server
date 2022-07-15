/**
 * Create and update SES templates for nicer/better emails.
 * @author dassiorleando
 */
const AWS = require("aws-sdk");
const SES = new AWS.SES({ region: "us-east-2" });

// Let's get the template to create/save
const template = require("./signup-template");
// const template = require('./post-template');

(async () => {
  // const result = await SES.createTemplate(template).promise();
  const result = await SES.updateTemplate(template).promise();
})();
