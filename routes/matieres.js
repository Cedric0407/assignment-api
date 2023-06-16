let Matiere = require('../model/matiere');

var config = require('../constant/config');

const multer = require('multer');

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

const cors = require('cors')({ origin: true })

const upload = multer({ storage: storage });

// Récupérer tous les matieres (GET)
function getMatieres(req, res) {

    var idProfesseur = req.query.idProfesseur; // Valeur du filtre passée dans la requête

    const filter = {};

    if (idProfesseur) {
        filter["professeur._id"] = { $eq: idProfesseur };
    }

    Matiere.find(filter, (err, matieres) => {
        if (err) {
            return res.send(err)
        }

        return res.send(matieres);
    });
}

function getMatieresAvecPagination(req, res) {

    var aggregateQuery = Matiere.aggregate();

    Matiere.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, matieres) => {
            if (err) {
                return res.send(err);
            }
            return res.send(matieres);
        }
    );
}

// Récupérer un matiere par son id (GET)
function getMatiere(req, res) {
    let matiereId = req.params.id;

    Matiere.findById(matiereId, (err, matiere) => {
        if (err) { return res.send(err) }
        return res.json(matiere);
    })
}

// Ajout d'un matiere (POST)
function postMatiere(req, res) {

    upload.single('image')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during file upload
            return res.status(500).send("There was a problem uploading the file.");
        } else if (err) {
            // An unknown error occurred during file upload
            return res.status(500).send("There was a problem adding the information to the database.");
        }

        let matiere = new Matiere();
        matiere.nom = req.body.nom;
        matiere.professeur = JSON.parse(req.body.professeur);
        if (req.file) matiere.imagePath = config.BaseUrl + req.file.path

        matiere.save((err) => {
            if (err) {
                return res.send('cant post matiere ', err);
            }
            return res.json({ message: `${matiere.nom} saved!` })
        })
    });
}

// Update d'un matiere (PUT)
function updateMatiere(req, res) {


    cors(req, res, () => {
        console.log("UPDATE recu matiere : ");


        upload.single('image')(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred during file upload
                return res.status(500).send("There was a problem uploading the file.");
            } else if (err) {
                // An unknown error occurred during file upload
                return res.status(500).send("There was a problem adding the information to the database.");
            }

            let matiere = {};

            matiere.nom = req.body.nom;
            matiere.professeur = JSON.parse(req.body.professeur);
            if (req.file) matiere.imagePath = config.BaseUrl + req.file.path

            Matiere.findByIdAndUpdate(req.body._id, matiere, { new: true }, (err, matiere) => {
                if (err) {
                    console.log(err);
                    return res.send(err)
                } else {
                    return res.json({ message: matiere.nom + 'updated' })
                }

                // console.log('updated ', matiere)
            });
        })

    })

}

// suppression d'un matiere (DELETE)
function deleteMatiere(req, res) {

    Matiere.findByIdAndRemove(req.params.id, (err, matiere) => {
        if (err) {
            return res.send(err);
        }
        return res.json({ message: `${matiere.nom} deleted` });
    })
}



module.exports = { getMatieres, postMatiere, getMatiere, updateMatiere, deleteMatiere };
