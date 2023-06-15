let express = require('express');
let app = express();
let bodyParser = require('body-parser');

let assignment = require('./routes/assignments');
let matiere = require('./routes/matieres');
let user = require('./routes/users');
const VerifyToken = require('./auth/VerifyToken');
let mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());

mongoose.Promise = global.Promise;
//mongoose.set('debug', true);

// remplacer toute cette chaine par l'URI de connexion à votre propre base dans le cloud s
//const uri = "mongodb+srv://cedricTsiory:cedricTsiory@cluster0.hr5yrv1.mongodb.net/?retryWrites=true&w=majority";

const uri = "mongodb+srv://cedricTsiory:cedricTsiory@cluster0.hr5yrv1.mongodb.net/?retryWrites=true&w=majority";

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("Connecté à la base MongoDB assignments dans le cloud !");
    console.log("at URI = " + uri);
    console.log("vérifiez with http://localhost:8010/api/assignments que cela fonctionne")
  },
    err => {
      console.log('Erreur de connexion: ', err);
    });

// Pour accepter les connexions cross-domain (CORS)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

// Pour les formulaires
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let port = process.env.PORT || 8010;

// les routes
const prefix = '/api';

app.route(prefix + '/assignments')
  .get(VerifyToken, assignment.getAssignments)
  .post(VerifyToken, assignment.postAssignment)
  .put(VerifyToken, assignment.updateAssignment);

app.route(prefix + '/assignments/filter').post(VerifyToken, assignment.postAssignments)

app.route(prefix + '/assignments/:id')
  .get(VerifyToken, assignment.getAssignment)
  .delete(VerifyToken, assignment.deleteAssignment);

app.route(prefix + '/matieres')
  .get(VerifyToken, matiere.getMatieres)
  .post(VerifyToken, matiere.postMatiere)
  .put(VerifyToken, matiere.updateMatiere);

app.route(prefix + '/matieres/:id')
  .get(VerifyToken, matiere.getMatiere)
  .delete(VerifyToken, matiere.deleteMatiere);

app.route(prefix + '/users')
  .get(VerifyToken, user.getUsers)
  .post(VerifyToken, user.postUser)
  .put(VerifyToken, user.updateUser);

app.route(prefix + '/users/:id')
  .get(VerifyToken, user.getUser)
  .delete(VerifyToken, user.deleteUser);

var AuthController = require('./auth/AuthController');

app.use('/api/auth', AuthController);

// On démarre le serveur
app.listen(port, "0.0.0.0");
console.log('Serveur démarré sur http://localhost:' + port);
app.use('/uploads', express.static('./uploads'));

module.exports = app;


