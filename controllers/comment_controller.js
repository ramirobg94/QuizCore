var models = require('../models/models.js');

//GET /quizes/:quizId/comments/new
exports.new = function(req,res) {
	res.render('comments/new.ejs', {quizId: req.params.quizId, errors: []});
};

//POST /quizes/:quizId/comments
exports.create = function(req,res){
	var comment = models.Comment.build(
	{texto: req.body.comment.texto,
	QuizId: req.params.quizId
	});

	comment.validate().then(function(err){
		if(err){
			res.render('comments/new.ejs',{comment: comment, errors: err.errors, quizId: req.params.quizId});
		}else{
			comment.save().then(function(){ //guarda en la BF el campo de texto
				res.redirect('/quizes/'+req.params.quizId)})
		} //redireccion HHTTP a la lista de preguntas
	}
	).catch(function(error){next(error)});
};