let mongoose = require('mongoose');

let Schema = mongoose.Schema;
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let MatiereSchema = Schema({
    id: Number,
    nom: String,
    professeur: { type: mongoose.Schema.Types.Object, ref: 'User' },
    imagePath: String,
});

MatiereSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
// le nom de la collection (par défaut matieres) sera au pluriel, 
// soit matieres
// Si on met un nom "proche", Mongoose choisira la collection
// dont le nom est le plus proche
module.exports = mongoose.model('matieres', MatiereSchema);
