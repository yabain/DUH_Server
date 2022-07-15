const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const Util = require("../../services/util");
const constant = require("../../config/constant");
const emailService = require("../../services/email");
const userService = require("../../services/user");
const permGuard = require("../middleware/permissions-guard");
const userCacheService = require("../../services/user-cache");
const recaptchaService = require("../../services/recaptcha");

router.post("/signup", async (req, res) => {
  let { email, password, firstName, lastName, subscribe, captcha } = req.body; // The incoming email & pwd

  if (email) email = email.toLowerCase(); // Lowering the email case
  // Some validations
  const isCaptchaValid =
    (await recaptchaService.verify(captcha).catch(Util.error)) || false; // Captcha verification
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "Invalid data provided!" });
  // if (!isCaptchaValid)
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Invalid captcha!" });

  User.find({ email: email })
    .exec()
    .then(async (users) => {
      if (users.length >= 1) {
        return res.status(409).json({
          message: "Email Exists",
        });
      } else {
        // The password hash.
        const hash = await userService.hashPassword(password).catch(Util.error);
        if (!hash)
          return res
            .status(500)
            .json({ success: false, message: "Could not hash the password" });

        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: email,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          permissions: ["USER"],
        });
        user
          .save()
          .then(async (result) => {
            const userObject = result.toObject();

            // Caching the newly created user
            await userCacheService.saveUser(userObject).catch();

            // Addin the user to the mailing (audience) list.
            if (subscribe == 1) {
              await emailService.addToMailingList(userObject).catch();
            }

            // Sending email confirmation by mail
            const emailConfirmationResult = await userService.confirmationEmail(
              userObject
            );
            console.log(emailConfirmationResult, "emailConfirmationResult");
            const registrationDate = new Date(result.createdAt || Date.now());
            const registrationDateFormatted =
              registrationDate.toLocaleDateString() +
              " " +
              registrationDate.toLocaleTimeString();
            const message =
              `Hi Team, \n\n` +
              `Just to inform you that a new user just registered on DoUHave.co App at ${registrationDateFormatted}. \n` +
              `He’s called ${result.firstName} ${result.lastName} of email ${result.email}. \n\n` +
              `Regards, \n` +
              `DoUHave Notifier Service.`;

            // Sending an email to the admins
            const adminsEmailResult = await emailService
              .sendEmail(
                `New User: ${result.email}`,
                message,
                constant.notificationsReceivers
              )
              .catch();
            // Sending a welcome email to the new user
            const userFullName =
              `${result.firstName} ${result.lastName}`.trim();
            const newUserEmailResult = await emailService
              .sendEmail(
                `Fake title`,
                { userEmail: userFullName ? userFullName : result.email },
                result.email,
                constant.DOUHAVE_SIGNUP_TEMPLATE
              )
              .catch();

            res.status(201).json({ success: true, message: "User Created" });
          })
          .catch((err) => {
            res.status(500).json({
              error: err,
              message: err.message,
            });
          });
      }
    });
});

router.post("/login", (req, res) => {
  const isAdmin = req.query.isAdmin; // Checking admin details

  // Only undeleted users can sign in
  User.find({ email: req.body.email, isDeleted: false })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res
          .status(401)
          .json({ success: false, message: "Unknown account!" });
      }

      // Admin check
      if (isAdmin == 1 && user[0].permissions.indexOf("ADMIN") === -1) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized." });
      }

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Invalid email and/or password.",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
              userName: user[0].userName,
              firstName: user[0].firstName,
              lastName: user[0].lastName,
              permissions: user[0].permissions || [],
              emailConfirmed: user[0].emailConfirmed || false,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "7 days",
            }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token,
            userId: user[0]._id,
            userName: user[0].userName,
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            permissions: user[0].permissions || [],
            emailConfirmed: user[0].emailConfirmed || false,
          });
        }
        res.status(401).json({
          message: "Auth Failed 3",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: err,
      });
    });
});

/**
 * Loads all the users saved into the DB.
 */
router.get("/all", permGuard.check(["MODERATOR", "ADMIN"]), (req, res) => {
  const order = req.query.order === "ascending" ? "ascending" : "descending";
  User.find({})
    .sort({ createdAt: order })
    .select("-password")
    .exec((err, users) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }
      res.status(200).json({ success: true, data: users });
    });
});

router.get(
  "/user/:userId",
  permGuard.check(["USER", "ADMIN"]),
  async (req, res) => {
    try {
      let result = await User.findById({ _id: req.params.userId });
      if (req.params.userId != req.user.userId) {
        return res.status(401).json({
          message: "Auth Failed 5",
        });
      }
      return res.status(200).json({
        message: "User GET",
        userName: result.userName,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        streetAddress: result.streetAddress,
        profilePic: result.profilePic || "",
        city: result.city,
        state: result.state,
        zip: result.zip,
        emailConfirmed: result.emailConfirmed || false,
        // TODO: return back the user's permissions if the request is made by an admin
        // permissions: user[0].permissions || []
      });
    } catch (error) {
      console.log("Error--->", error.message);
      res.status(500).json({ message: error.message });
    }
  }
);

router.delete("/:userId", permGuard.check(["USER", "ADMIN"]), (req, res) => {
  if (req.params.userId != req.user.userId) {
    return res.status(401).json({
      message: "Auth Failed 5",
    });
  } else {
    User.remove({ _id: req.params.userId })
      .exec()
      .then((result) => {
        if (req.params.userId != req.user.userId) {
          return res.status(401).json({
            message: "Auth Failed 5",
          });
        } else {
          res.status(200).json({
            message: "User Deleted",
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
});

router.patch(
  "/edit/:userId",
  permGuard.check(["USER", "ADMIN"]),

  async (req, res) => {
    if (req.params.userId != req.user.userId) {
      return res.status(401).json({
        message: "Auth Failed 5",
      });
    } else {
      const userFound = await User.findById(req.params.userId).catch();
      if (!userFound)
        return res
          .status(404)
          .json({ success: false, message: "User not found!" });
      let uploadedPicture = req.body.profilePic;

      // Let's set some fields to change.
      userFound.userName = req.body.userName;
      userFound.firstName = req.body.firstName;
      userFound.lastName = req.body.lastName;
      userFound.streetAddress = req.body.streetAddress;
      userFound.city = req.body.city;
      userFound.state = req.body.state;
      userFound.zip = req.body.zip;
      userFound.profilePic = uploadedPicture;
      userFound
        .save()
        .then(async (result) => {
          // Caching the newly created user
          await userCacheService.saveUser(result.toObject()).catch();

          res.status(200).json({
            message: "User Updated!",
            request: {
              type: "PATCH",
              url: "/user/" + req.params.userId,
            },
          });
        })
        .catch((err) => {
          console.log(err.message, "err.message");
          res.status(500).json({
            error: err.message,
          });
        });
    }
  }
);

// Verify user
router.get("/verify/:token", (req, res) => {
  const token = req.params.token;
  if (!token) {
    return res.status(401).json({ message: "Must Pass Token" });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        message: "Auth Failed 51",
      });
    }
    User.findById({ _id: user.userId })
      .exec()
      .then((result) => {
        return res.status(200).json({
          user: user,
          token: token,
          userName: result.userName,
          firstName: result.firstName,
          lastName: result.lastName,
          userId: result._id,
          email: result.email,
          permissions: result.permissions || [],
          profilePic: result.profilePic || "",
          emailConfirmed: result.emailConfirmed || false,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  });
});

// Get the current user profile informations.
router.get("/profile", permGuard.check([]), (req, res) => {
  // The current user details
  const user = req.user;
  const isAdmin = req.query.isAdmin; // Checking admin details

  // Let's get his most updated data.
  User.findById({ _id: user.userId })
    .exec()
    .then((result) => {
      const data = {
        userName: result.userName,
        firstName: result.firstName,
        lastName: result.lastName,
        userId: result._id,
        email: result.email,
        permissions: result.permissions || [],
        emailConfirmed: result.emailConfirmed || false,
      };

      if (isAdmin == 1 && data.permissions.indexOf("ADMIN") === -1) {
        return res
          .status(403)
          .json({ success: false, message: "Not authorized." });
      }

      return res.status(200).json({ success: true, data });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err });
    });
});

/**
 * Reset the user email.
 */
router.get("/forgotPassword", async (req, res) => {
  const userEmail = req.query.userEmail;
  if (!userEmail)
    return res
      .status(400)
      .json({ success: false, message: "Invalid email provided!" });

  const userFound = await userService
    .findOne({ email: userEmail })
    .catch(Util.error);
  if (!userFound || !userFound._id)
    return res.status(404).json({
      success: false,
      message:
        "Email address not recognized. Please contact Team@douhave.co for assistance!",
    });

  const result = await userService.initiatePwdReset(userEmail);
  if (!result || !result.success) return res.status(400).json(result);

  res
    .status(200)
    .json({ success: true, message: "Reset email sent successfully." });
});

/**
 * Reset the user email (explicit action).
 */
router.post("/forgotPassword", async (req, res) => {
  const { pwdResetToken, newPassword } = req.body;
  if (!pwdResetToken || !newPassword)
    return res.status(400).json({
      success: false,
      message: "Invalid reset token and/or password provided!",
    });

  const result = await userService.processPasswordReset(
    pwdResetToken,
    newPassword
  );
  if (!result || !result.success) return res.status(400).json(result);

  res
    .status(200)
    .json({ success: true, message: "Password updated successfully." });
});

/**
 * Sends confirmation email.
 */
router.get(
  "/sendConfirmationEmail",
  permGuard.check(["USER", "ADMIN"]),
  async (req, res) => {
    const result = await userService.confirmationEmail(req.user);
    if (!result || !result.success) return res.status(400).json(result);

    res.status(200).json({
      success: true,
      message: "Confirmation email sent successfully.",
    });
  }
);

module.exports = router;
