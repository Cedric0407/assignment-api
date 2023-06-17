let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2")

let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let AssignmentSchema = Schema({
    nom: String,
    dateDeRendu: Date,
    rendu: Boolean,
    note: Number,
    remarques: String,
    matiere: { type: mongoose.Schema.Types.Object, ref: 'Matiere' },
    auteur: { type: mongoose.Schema.Types.Object, ref: 'User' },
    filePath: String
});

AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut assignments) sera au pluriel, 
// soit assignments
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('assignments', AssignmentSchema);
