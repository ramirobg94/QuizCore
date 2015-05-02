var models = require('../models/models.js');
var por = '%';
var search;
var misearch;

//Get /quizes/index
exports.index = function(req, res) {
	misearch = req.query.search;
	search = por
	if(undefined === req.query.search){

	}else{
	misearch = misearch.replace(/[^\w]/g,por);
	search = search.concat(misearch);
	search = search.concat(por);
	}

	models.Quiz.findAll({
		where:["pregunta like ?", search],
		order:'`pregunta` ASC'
		}).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes});
	})
};


//GEt /quizes/:id
exports.show = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show' , {quiz: quiz});
	})
};

//GEt /quizes/:id/answer
exports.answer = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta){
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Correcto'});
		} else{
			res.render('quizes/answer',
				{quiz: quiz, respuesta: 'Incorrecto'});
		}
	})
};