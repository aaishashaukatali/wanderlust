const User = require("../models/users.js");

module.exports = {
  signupForm: async (req, res) => {
    res.render("users/signup.ejs");
  },

  signupPost: async (req, res, next) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registredUser = await User.register(newUser, password);
      console.log(registredUser);

      req.login(registredUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Account created successfully.");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  },

  loginForm: async (req, res) => {
    res.render("users/login.ejs");
  },

  loginPost: async (req, res) => {
    req.flash("success", "WELCOME! you are logged In successfully.");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  },

  logout: async (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    });
  },
};
