var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var User = require('../model/user');
var config = require('../constant/config');
var bcrypt = require('bcryptjs');

const multer = require('multer');
const cors = require('cors')({ origin: true })

// Configuration de Multer pour gérer l'upload des images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // dossier de destination pour les images
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });


// CREATES A NEW USER
function postUser(req, res) {

    cors(req, res, () => {

        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred during file upload
                return res.status(500).send("There was a problem uploading the file.");
            } else if (err) {
                // An unknown error occurred during file upload
                return res.status(500).send("There was a problem adding the information to the database.");
            }
            const newUser = {
                nom: req.body.nom,
                email: req.body.email,
                role: req.body.role,
                imagePath: req.file.path
            };

            if (req.body.password) {
                newUser.password = bcrypt.hashSync(req.body.password, 8)
            }

            User.create(newUser,
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database.");
                    return res.status(200).send(user);
                });
        })

    })
}
// RETURNS ALL THE USERS IN THE DATABASE
function getUsers(req, res) {
    User.find({}, '-password', function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        return res.status(200).send(users);
    });
}
// GETS A SINGLE USER FROM THE DATABASE
function getUser(req, res) {
    User.findById(req.params.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        return res.status(200).send(user);
    });
}

// DELETES A USER FROM THE DATABASE
function deleteUser(req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        return res.status(200).send("User: " + user.name + " was deleted.");
    });
}
// UPDATES A SINGLE USER IN THE DATABASE
function updateUser(req, res) {

    cors(req, res, () => {

        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred during file upload
                return res.status(500).send("There was a problem uploading the file.");
            } else if (err) {
                // An unknown error occurred during file upload
                return res.status(500).send("There was a problem adding the information to the database.");
            }

            const newUser = {
                nom: req.body.nom,
                email: req.body.email,
                role: req.body.role,

            };
            if (req.file) newUser.imagePath = req.file.path

            if (req.body.password) {
                newUser.password = bcrypt.hashSync(req.body.password, 8)
            }

            User.findByIdAndUpdate(req.body._id, newUser, { new: true }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                return res.status(200).send(user);
            });

        })

    })
}

module.exports = { postUser, getUsers, getUser, deleteUser, updateUser };