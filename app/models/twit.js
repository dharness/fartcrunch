var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TwitSchema   = new Schema({
	tag: String,
	message: String
});

module.exports = mongoose.model('Twit', TwitSchema);