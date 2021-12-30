const express= require('express')
const session = require('express-session')
const passport = require('passport')
const userController = require('../controllers/userController')
const sessionController = require('../controllers/sessionController')
const router = express.Router()

const sessionStore = sessionController.storeSession()
router.use(session({
    secret: 'topSecret',
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }}))
require('../config/passport')
router.use(passport.initialize());
router.use(passport.session());

router.get('/login', userController.login)
router.post('/login', passport.authenticate('local', {failureRedirect: '/login-failure', successRedirect: 'login-success'}))
router.get('/register', (req, res)=>res.render('register'))
router.post('/register', userController.postRegister)
router.get('/confirmSession', userController.confirmSession)
router.get('/protected-route', userController.isAuth,  userController.protected)
router.get('/logout', userController.logout);
router.get('/login-success', userController.loginSuccess);
router.get('/login-failure', userController.loginFailed);

module.exports = router