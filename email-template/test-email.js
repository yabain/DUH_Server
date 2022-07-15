/**
 * Testing AWS-SES html emails sending.
 * @author dassiorleando
 */
const AWS = require("aws-sdk");
const SES = new AWS.SES({ region: "us-east-2" });

// Template data
// const data = { itemTitle: 'Mercedes Benz 505', itemBudget: '50.000'};
const data = { userEmail: "Dassi Orleando" };

// Email params
const params = {
  Source: "team@douhave.co",
  Template: "DOUHAVE_SIGNUP_TEMPLATE", // DOUHAVE_POST_TEMPLATE
  // ConfigurationSetName: 'DOUHAVE_CONFIGURATION_SET',
  Destination: {
    ToAddresses: ["dassimarcel0805@gmail.com"],
  },
  TemplateData: JSON.stringify(data || {}),
};

(async () => {
  const result = await SES.sendTemplatedEmail(params).promise();
})();
