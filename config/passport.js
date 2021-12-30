const LocalStrategy = require('passport-local').Strategy
const alert = require('alert')
const validPassword = require('../lib/passwordUtils').validPassword
const passport = require('passport')
const pool = require('./database').pool

const verifyCallback = (username, password, done) => {

    let  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; //PREVENT SQL INJECTION
    if(format.test(username)){
        alert('Username only contains A-Z (lowercase and uppercase) and 0-9')
        return done(null,false)
    }

    pool.getConnection((err, connection) =>{
        connection.query("SELECT _id,username,_hash,_salt FROM UserTable WHERE username = '"+username+"'",(err, data) => {
            connection.release()
            if(err) return done(err)

            let _id = data.map(item =>  item['_id'])
            let username = data.map(item =>  item['username'])
            let hash = data.map(item =>  item['_hash'])
            let salt = data.map(item =>  item['_salt'])
            
            const isValid = validPassword(password,hash[0],salt[0])
            const user = {
                _id: _id,
                username: username,
                _hash: hash,
                _salt: salt
            }

            if(isValid)return done(null,user)
            else return done(null,false)
        })
    })
}

const strategy = new LocalStrategy(verifyCallback);
passport.use(strategy)

passport.serializeUser(function(user, done) {
    console.log("P")
    done(null, user._id);
});
      
passport.deserializeUser((id, done) => {
    pool.getConnection(function(err, connection) {
        connection.query("SELECT _id FROM UserTable WHERE _id = '"+id+"'",(err, data) => {
            connection.release()
                if(!err) done(null,data[0])
                else done(err)
        })
    })
});