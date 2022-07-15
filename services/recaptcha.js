/**
 * Recaptcha service.
 * @author dassiorleando
 */
const axios = require("axios");
const config = require("../config");

/**
 * Verifying if a response is coming from a human using Google Re-Captcha service.
 * @param {*} captcha The captcha coming from the UI.
 * @returns {Promise<boolean>} A promise that resolves to a boolean, true (good) or false (bad).
 */
exports.verify = function (captcha) {
  return new Promise(async (resolve, reject) => {
    if (!captcha) return resolve(false);
    try {
      let result = await axios({
        method: "post",
        url: "https://www.google.com/recaptcha/api/siteverify",
        params: {
          secret: config.RECAPTCHA_SECRET,
          response: captcha,
        },
      });
      let data = result.data || {};
      resolve(data.success);
    } catch (err) {
      reject(
        err.response
          ? err.response.data
          : { success: false, error: "recaptcha_error" }
      );
    }
  });
};
