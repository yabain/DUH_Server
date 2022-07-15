/**
 * User service.
 * @author dassiorleando
 */
const Util = require("./util");
const bcrypt = require("bcryptjs");
const config = require("../config");
const User = require("../models/User");
const emailService = require("./email");
const redisClient = require("../lib/redis")();

/**
 * Hashes the password using bcrypt.
 * @param {string} password The passwort do hash.
 * @returns
 */
async function hashPassword(password) {
  // Password validation
  if (!password)
    return Promise.reject({
      success: false,
      message: "Invalid password provided!",
    });

  // The password hash
  const hash = bcrypt.hashSync(password, 10);
  return Promise.resolve(hash);
}
exports.hashPassword = hashPassword;

/**
 * Emailing the password reset link to a user.
 * @param {*} email The targeted user's email.
 * @param {*} resetLink The generated pwd reset link to send.
 * @returns {*} A promise that resolves to a success or bad result.
 */
async function emailResetLink(email, resetLink) {
  if (email && resetLink) {
    // Reset email message
    const message =
      `Hi ${email}, \n\n` +
      `Please, follow the link below to reset your password or copy and paste it into your browser. \n` +
      `Reset link: ${resetLink}. \n\n` +
      `Thank you for using DoUHave. \n\n` +
      `Regards, \n` +
      `DoUHave Team.`;

    // Sending an email explicitly
    const emailResult = await emailService
      .sendEmail(`Reset password email`, message, email)
      .catch(Util.error);

    // Processing the result
    if (!emailResult)
      return Promise.resolve({ success: false, message: "Email not sent!" });
    return Promise.resolve({
      success: true,
      message: "Email sent successfully",
      data: emailResult,
    });
  } else {
    return Promise.reject({
      success: false,
      message: "Invalid parameters provided.",
    });
  }
}

/**
 * Confirmation email sent to the user.
 * @param {*} user The targeted user.
 * @returns {*} A promise that resolves to a success or bad result.
 */
exports.confirmationEmail = async function (user) {
  // Let's perform some validations and verifications
  if (!user) return Promise.reject("Invalid user provided");
  user.userId = user.userId || user._id;
  const { email, userId } = user;

  if (email && userId) {
    const confirmationLink = config.SERVER_URL + "/confirmEmail/" + userId;

    // Reset email message
    const message =
      `Hello ${email}, \n\n` +
      `Please, follow the link below to confirm your email to fully enjoy our services. \n\n` +
      `Confirmation link: ${confirmationLink} \n\n` +
      `Thank you for using DoUHave. \n\n` +
      `Regards, \n` +
      `DoUHave Team.`;

    // Sending an email explicitly
    const emailResult = await emailService
      .sendEmail(`Email confirmation`, message, email)
      .catch(Util.error);

    // Processing the result
    if (!emailResult)
      return Promise.resolve({ success: false, message: "Email not sent!" });
    return Promise.resolve({
      success: true,
      message: "Email sent successfully",
      data: emailResult,
    });
  } else {
    return Promise.reject({
      success: false,
      message: "Invalid parameters provided.",
    });
  }
};

/**
 * Loads one public (or not) user
 * @param {Object} query the query object
 * @param {Object} projection projected fields to add/remove
 * @returns {Promise<Object>} Promise that resolves to the user found
 */
function findOne(query = {}, projection = {}) {
  return User.findOne(query, projection);
}
exports.findOne = findOne;

/**
 * Processes reset pwd logic for a specific user.
 * @param {string} userId The targeted user's id.
 */
exports.initiatePwdReset = async function (userEmail) {
  // Reset pwd token (unique)
  const pwdResetToken = Util.generateUUID("-");

  // Let's save the reset pwd token into the cache, it should expires in 30 minutes.
  const resetPwdKey = `resetPwd:${pwdResetToken}`;
  await redisClient.setAsync(resetPwdKey, userEmail).catch(Util.error);
  redisClient.expire(resetPwdKey, 30 * 60);

  // Let's send the email
  const resetLink = config.WEB_URL + "/forgotPassword/" + pwdResetToken;
  const emailResult = await emailResetLink(userEmail, resetLink);

  if (emailResult && emailResult.success)
    return Promise.resolve({ success: true, message: "Reset email sent." });
  return Promise.reject({
    success: false,
    message: "Could not send the reset password email.",
  });
};

/**
 * Processes the password reset action (explicit).
 * @param {string} pwdResetToken The token generated from the initiation step.
 * @param {string} newPassword The new password to set for the user that the token belongs to.
 * @returns {*} A promise that resolves to a success or error message.
 */
exports.processPasswordReset = async function (pwdResetToken, newPassword) {
  // Some validations
  if (!pwdResetToken || !newPassword)
    return Promise.resolve({
      success: false,
      message: "Invalid token and/or new password.",
    });

  // Let's get the user's email from the cache if the reset key is still valid (it's supposed to expire after 30 minutes)
  const tokenKey = `resetPwd:${pwdResetToken}`;
  const email = await redisClient.getAsync(tokenKey).catch(Util.error);
  if (!email)
    return Promise.resolve({
      success: false,
      message: "Reset token got expired, please initiate again.",
    });

  // Getting the hash of the new password
  const password = await hashPassword(newPassword).catch(Util.error);
  if (!password)
    return Promise.resolve({
      success: false,
      message: "Could not hash the password.",
    });

  // Let's reset the password
  const updatedUser = await User.findOneAndUpdate(
    { email },
    { $set: { password } },
    { new: true }
  ).catch(Util.error);

  // Handle result
  if (!updatedUser)
    return Promise.resolve({
      success: false,
      message: "An error occured while updating the password!",
    });

  await redisClient.delAsync(tokenKey).catch(Util.error);
  return Promise.resolve({
    success: true,
    message: "Password updated successfully.",
  });
};

/**
 * Udpates the user enail confirmed field.
 * @param {*} userId The targeted user's id.
 */
exports.confirmUserEmail = async function (userId) {
  if (!userId) return Promise.reject("Invalid user id provided.");
  return User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: { emailConfirmed: true } },
    { new: true }
  );
};
