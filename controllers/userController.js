const session = require('express-session')
const { v4: uuidv4 } = require('uuid');
const alert = require('alert')
const pool = require('../config/database').pool;
const genPassword = require('../lib/passwordUtils').genPassword

exports.postRegister = (req, res, next) => {
    const saltHash = genPassword(req.body.passreg)
    const username = req.body.emailreg
    const salt = saltHash.salt
    const hash = saltHash.hash
    const pass = req.body.passreg

    let  format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; //PREVENT SQL INJECTION
    if(format.test(username)){
        alert('Username only contains A-Z (lowercase and uppercase) and 0-9')
        return res.redirect('/register')
    }

    if(pass.length < 8){
        alert('Password must be at least 8 characters long')
        return res.redirect('/register')
    }

    pool.getConnection(function(err,connection){
        const id = uuidv4().toString()

        connection.query("SELECT username FROM UserTable WHERE username = '"+username+"';INSERT INTO UserTable (_id,username,_hash,_salt) VALUES ('"+id+"','"+username+"','"+hash+"','"+salt+"')", (err, data)=>{
            connection.release()
            if(data[0].length >0){
                alert('Username has already taken, try another one')
                return res.redirect('/register')
            }else{
                if(err) console.log(err)
                else console.log("Your data has been inserted")
                res.redirect('/login')
            }
        })
    })
}

exports.confirmSession = (req,res) => {
    res.render('confirmSession')
}

exports.login  = (req, res) => {
    console.log(`Client Session ID : ${req.session.id}`);
    res.render('login')
}

exports.isAuth = (req, res, next) => {
    if(req.isAuthenticated()) next()
    else res.status(401).json({ mgs: 'You are not authenticated in this section route' })
}

exports.protected = (req, res) => {
    res.send('You made it to the route.');
}

exports.logout = (req, res) => {
    res.redirect('/protected-route');
}

exports.loginSuccess = (req, res) => {
    res.send('<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>');
}

exports.loginFailed = (req, res) => {
    alert('Password must be at least 8 characters long')
    res.redirect('/login')
}