const LocalStrategy = require('passport-local').Strategy;

function initialize(passport, getUserByEmail, getUserById) {
   
    const authenticateUser =  (username, password, done) => {
      console.log("aaaaaaaaaaaaaaaaaaaaaaaa")
      console.log(username);
      console.log(password);

      const user = getUserByEmail(username)
      console.log(user)
      if (user == null) {
        return done(null, false, { message: 'No user with that usrname' })
      }
  
      try {
        if (password===user.pass) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    }
  
    passport.use(new LocalStrategy(authenticateUser))

   
    passport.serializeUser((user, done) => done(null, user.user_id))

    passport.deserializeUser((id, done) => {
        console.log(id);
      return done(null, getUserById(id))
    })
  }

  module.exports = initialize;