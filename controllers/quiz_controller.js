var models = require('../models/models.js');
var por = '%';
var search;
var misearch;
var c = 0;


//MW que permite acciones solamente si el quiz objeto
//pertenece al usuario logeado o si es cuenta admin
exports.ownershipRequired = function(req, res, next){
	var objQuizOwner = req.quiz.UserId;
	var logUser = req.session.user.id;
	var isAdmin = req.session.user.isAdmin;

	if (isAdmin || objQuizOwner === logUser){
		next();
	} else {
		res.redirect('/');
	}
};



//GET /quizes/new
exports.new = function(req,res){
	var quiz = models.Quiz.build( //Crea un objeto Quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
		);

	res.render('quizes/new', {quiz: quiz, errors: []});
};
// POST /quizes/create
exports.create = function(req, res) {
	req.body.quiz.UserId = req.session.user.id;
	if(req.files.image){
		req.body.quiz.image = req.files.image.name;
	}
	var quiz = models.Quiz.build( req.body.quiz);

	quiz
	.validate()
	.then(
		function(err){
			if(err){
				res.render('quizes/new',{quiz: quiz, errors: err.errors});
			}else{
				//Guarda en la DB los campos pregunta y respuesta de quiz
				quiz
				.save({fields: ["pregunta", "respuesta","UserId","image"]})
				.then(function(){res.redirect('/quizes');}) 
				//REdireccion HTTP (URL relativo) lista e preguntas
			}
		}
	).catch(function(error){next.redirect('/quizes')});
};

//POST /quizes/:id/edit
exports.edit = function(req,res){
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
	if(req.files.image){
		req.quiz.image = req.files.image.name;
	}
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function(err){
		if(err) {
			res.render('quizes/edit',{quiz: req.quiz, errors: err.errors});
		}else{
			//Guarda en la DB los campos pregunta y respuesta de quiz
	req.quiz.save({fields: ["pregunta", "respuesta","image"]})
	.then(function(){res.redirect('/quizes');}) 
	//REdireccion HTTP (URL relativo) lista e preguntas
		}
	}
);
};

//DELETE /quizes/:id
exports.destroy = function(req,res){
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};

//Autoload - factoriza el codigo si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: {
			id: Number(quizId)
		},
		include: [{
		 model: models.Comment 
		}]
	}).then(function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			}else { next(new Error('No existe quizId='+ quizId))}
		}
	).catch(function(error) {next(error);});
};

//Get /quizes/index
exports.index = function(req, res, next) {
	misearch = req.query.search;
	search = por;
	var options = {};

	if(req.user){	//req.user es creado por autoload de usuario
					// si la ruta lleva el parametro .quizId
		options.where = {UserId: req.user.id}
	} else {
			if(undefined === req.query.search){
		misearch = '.';

			}else{
				misearch = misearch.replace(/[^\w]/g,por);
				search = search.concat(misearch);
				search = search.concat(por);
				misearch = ' para "' + misearch +'".';
				}

		options.where = ["pregunta ilike ?", search];
		options.order = 'pregunta ASC';
		options.include = [{model: models.Comment}]

	}




	models.Quiz.findAll(
			options
		).then(function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes, errors: [], misearch: misearch, search: search});
	}).catch(function(error){next(error);});
};

//GEt /quizes/:id
exports.show = function(req,res) {
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show' , {quiz: req.quiz, errors: []});
	})
};

//GEt /quizes/:id/answer
exports.answer = function(req,res) {
	var resultado = 'Incorrecto';
		if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()){
			resultado = 'Correcto';
		} 
		res.render('quizes/answer',	{quiz: req.quiz, respuesta: resultado, errors: []});
};

//Get /quizes/statistics
exports.statistics = function(req,res){

/*Funciona en Local 
	----------------------

	models.Quiz.count().then(function(nP){
		 models.Comment.count().then(function(nC){
		 	var media = nC / nP;
		 	models.Quiz.count(
		 		{ distinct:"Comments.QuizId",
		 		  where: ["Comments.QuizId not like ?", "NULL"],
		 		   include: [{model: models.Comment,
		 		  			attributes:["QuizId"]}]}
		 		).then(function(nPcC){
			 		console.log("hay" + nPcC + "con comentarios alsaask");	 		
			 		var nPsC = nP - nPcC;
			 		console.log("hay" + nPsC + "sin comentarios alsaask");
					console.log(media);
	 				res.render('quizes/statistics',{errors: [], nP: nP, nC: nC, media: media.toFixed(2),nPcC: nPcC, nPsC: nPsC});
		 			});
		});
	});

	------------------------
*/


	models.Quiz.findAll({include: [{
		 model: models.Comment 
		}]}).then(function(P){
		 models.Comment.count().then(function(nC){
		 	var nP = P.length;
		 	var media = nC / nP;
		 	var nPcC = 0;
		 	for(index = 0; index < nP; index++){

		 		//console.log(P[index].Comments);
		 		if(P[index].Comments.length > 0){
		 			nPcC++;
		 		}
		 	}
		 	var nPsC = nP - nPcC;


	 		res.render('quizes/statistics',{errors: [], nP: nP, nC: nC, media: media.toFixed(2),nPcC: nPcC, nPsC: nPsC});

		});
	});



};

/*
function contarComentarios(){
	models.Comment.count().then(function(nc){
		 c = nc;
	});
	return c ;
};
function contarPreguntas(){
	models.Quiz.count().then(function(q){
		 c = q;
	});
	return c ;
};
*/