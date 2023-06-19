let Assignment = require('../model/assignment');

var config = require('../constant/config');

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


// Récupérer tous les assignments (GET)
function getAssignmentsSansPagination(req, res) {
    Assignment.find((err, assignments) => {
        if (err) {
            return res.send(err)
        }

        return res.send(assignments);
    });
}

function postAssignments(req, res) {

    cors(req, res, () => {
        var aggregateQuery = Assignment.aggregate();

        // Filtrage 

        var renduFilter = req.body.rendu ? JSON.parse(req.body.rendu) : undefined; // Valeur du filtre passée dans la requête
        var idMatieres = req.body.idMatieres;
        var idEtudiant = req.body.idEtudiant;
        console.log(req.body)

        const filter = {};

        if (renduFilter !== undefined) {
            filter.rendu = renduFilter;
        }
        if (idMatieres) {
            filter["matiere._id"] = { $in: idMatieres };
        }
        if (idEtudiant) {
            filter["auteur._id"] = { $eq: idEtudiant };
        }

        if (Object.keys(filter).length) {
            aggregateQuery.match(filter);
        }

        aggregateQuery.sort({ dateDeRendu: -1 });

        Assignment.aggregatePaginate(aggregateQuery,
            {
                page: parseInt(req.body.page) || 1,
                limit: parseInt(req.body.limit) || 10,
            },
            (err, assignments) => {
                if (err) {
                    return res.send(err);
                }
                return res.send(assignments);
            }
        );
    });
}

function getAssignments(req, res) {

    var aggregateQuery = Assignment.aggregate();

    // Filtrage 

    var renduFilter = req.query.rendu ? JSON.parse(req.query.rendu) : undefined; // Valeur du filtre passée dans la requête
    var idMatiere = req.query.idMatiere;
    var idEtudiant = req.query.idEtudiant;

    const filter = {};

    if (renduFilter !== undefined) {
        filter.rendu = renduFilter;
    }
    if (idMatiere) {
        filter["matiere._id"] = { $in: idMatieres };
    }
    if (idEtudiant) {
        filter["auteur._id"] = { $eq: idEtudiant };
    }

    if (Object.keys(filter).length) {
        aggregateQuery.match(filter);
    }

    console.log('filter', filter)
    console.log('page', parseInt(req.query.page) || 1)
    console.log('limit', parseInt(req.query.limit) || 10)

    Assignment.aggregatePaginate(aggregateQuery,
        {
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 10,
        },
        (err, assignments) => {
            if (err) {
                return res.send(err);
            }
            return res.send(assignments);
        }
    );
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res) {
    let assignmentId = req.params.id;

    Assignment.findById(assignmentId, (err, assignment) => {
        if (err) { return res.send(err) }
        return res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res) {

    upload.single('file')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred during file upload
            return res.status(500).send("There was a problem uploading the file.");
        } else if (err) {
            // An unknown error occurred during file upload
            return res.status(500).send("There was a problem adding the information to the database.");
        }

        let assignment = new Assignment();
        assignment.id = req.body.id;
        assignment.nom = req.body.nom;
        assignment.dateDeRendu = req.body.dateDeRendu;
        assignment.rendu = req.body.rendu;
        assignment.matiere = JSON.parse(req.body.matiere);
        assignment.auteur = JSON.parse(req.body.auteur);
        assignment.filePath = req.file.path

        console.log("POST assignment reçu :");
        console.log(assignment)

        assignment.save((err, saved) => {
            if (err) {
                return res.send('cant post assignment ', err);
            }
            return res.json({ message: `${assignment.nom} saved!`, data: saved })
        })

    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);

    Assignment.findByIdAndUpdate(req.body._id, req.body, { new: true }, (err, assignment) => {
        if (err) {
            console.log(err);
            return res.send(err)
        } else {
            return res.json({ message: assignment.nom + 'updated' })
        }

        // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            return res.send(err);
        }
        return res.json({ message: `${assignment.nom} deleted` });
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, postAssignments, getAssignmentsSansPagination };

