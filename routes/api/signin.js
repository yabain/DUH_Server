const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = (app) => {
  /*
  app.get('/api/counters', (req, res, next) => {
    Counter.find()
      .exec()
      .then((counter) => res.json(counter))
      .catch((err) => next(err));
  });

  app.post('/api/counters', function (req, res, next) {
    const counter = new Counter();

    counter.save()
      .then(() => res.json(counter))
      .catch((err) => next(err));
*/

  app.post("/api/account/signup", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!firstName) {
      return res.send({
        success: false,
        message: "error: First Name Can't be Blank",
      });
    }
    if (!lastName) {
      return res.send({
        success: false,
        message: "error: Last Name Can't be Blank",
      });
    }
    if (!email) {
      return res.send({
        success: false,
        message: "error: email Can't be Blank",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "error: password Can't be Blank",
      });
    }

    email = email.toLowerCase();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find(
      {
        email: email,
      },
      (err, previousUsers) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: Server Error",
          });
        } else if (previousUsers.length > 0) {
          return res.send({
            success: false,
            message: "Error: Account Already Exists",
          });
        }
        //save new user
        const newUser = new User();

        newUser.email = email;
        newUser.firstName = firstName;
        newUser.lastName = lastName;
        newUser.password = newUser.generateHash(password);
        newUser.save((err, user) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: Server Error",
            });
          }
          return res.send({
            success: true,
            message: "Signed up",
          });
        });
      }
    );
  });

  app.post("/api/account/signin", (req, res, next) => {
    const { body } = req;
    const { firstName, lastName, password } = body;
    let { email } = body;

    if (!email) {
      return res.send({
        success: false,
        message: "error: email Can't be Blank",
      });
    }
    if (!password) {
      return res.send({
        success: false,
        message: "error: password Can't be Blank",
      });
    }
    email = email.toLowerCase();

    User.find(
      {
        email: email,
      },
      (err, users) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error",
          });
        }
        if (users.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid",
          });
        }

        const user = users[0];
        if (!user.validPassword(password)) {
          return res.send({
            success: false,
            message: "Error: Invalid",
          });
        }

        //If correct user
        const userSession = new UserSession();
        userSession.userId = user._id;
        userSession.save((err, doc) => {
          if (err) {
            return res.send({
              success: false,
              message: "Error: server error",
            });
          }

          return res.send({
            success: true,
            message: "Valid Sign In",
            token: doc._id,
          });
        });
      }
    );
  });

  app.get("/api/account/verify", (req, res, next) => {
    //Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    // Verify the token is one of a kind and not isDeleted
    UserSession.find(
      {
        _id: token,
        isDeleted: false,
      },
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error",
          });
        }

        if (sessions.length != 1) {
          return res.send({
            success: false,
            message: "Error: Invalid",
          });
        } else {
          return res.send({
            success: true,
            message: "Verified",
          });
        }
      }
    );
  });

  app.get("/api/account/logout", (req, res, next) => {
    //Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test

    //Verify the token is one of a kind and not isDeleted
    UserSession.findOneAndUpdate(
      {
        _id: token,
        isDeleted: false,
      },
      {
        $set: {
          isDeleted: true,
        },
      },
      null,
      (err, sessions) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error",
          });
        }
        return res.send({
          success: true,
          message: "Verified",
        });
      }
    );
  });
};
