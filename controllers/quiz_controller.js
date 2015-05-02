var models = require('../models/models.js');
var por = '%';
var search;
var misearch;

//GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build( //Crea un objeto Quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz});
};
// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz);

	if((req.body.quiz.pregunta === "") || (req.body.quiz.respuesta === "")){
		res.redirect('/quizes')
	}else{

	//Guarda en la DB los campos pregunta y respuesta de quiz
	quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
		res.redirect('/quizes');

	}) //REdireccion HTTP (URL relativo) lista e preguntas
	}
};

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			}else { next(new Error('No existe quizId='+ quizId));}
		}
	).catch(function(error) {next(error);});
};

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
	}).catch(function(error){next(error);})
};


//GEt /quizes/:id
exports.show = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show' , {quiz: req.quiz});
	})
};

//GEt /quizes/:id/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
		if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
			resultado = 'Correcto';
		} 
		res.render('quizes/answer',	{quiz: req.quiz, respuesta: resultado});
};