var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../model/user');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

var VerifyToken = require('./VerifyToken');

router.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role
    },
        function (err, user) {
            if (err) return res.status(500).send("There was a problem registering the user.")
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            const userToSend = JSON.parse(JSON.stringify(user));
            delete userToSend.password
            res.status(200).send({ auth: true, token: token, user: userToSend });
        });
});

router.get('/me', VerifyToken, function (req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user);
    });
});

router.post('/login', function (req, res) {

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send({ message: 'Error on the server.' });
        if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });

        if (!req.body.password) return res.status(401).send({ auth: false, token: null });
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
        const expirationTime = 86400;
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: expirationTime  // expires in 24 hours
        });
        const userToSend = JSON.parse(JSON.stringify(user));
        delete userToSend.password
        res.status(200).send({ auth: true, token: token, user: userToSend, expirationTime });
    });

});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});

// add the middleware function
router.use(function (user, req, res, next) {
    res.status(200).send(user);
});

module.exports = router;