var path = require('path');
var pg = require('pg');

//Postgress DATABAS_URL = postgress://user:passwd@host:port/database
//Sqlite DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user  = (url[2] || null);
var pwd  = (url[3] || null);
var protocol  = (url[1] || null);
var dialect = (url[1] || null);
var port = (url[5] || null);
var host = (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//CARGAR modelo ORM
var Sequelize = require('sequelize');

//USAR BBDD SQlite o  Postgres
var sequelize = new Sequelize(DB_name,user,pwd,
						{dialect: dialect,
						protocol: protocol,
						port: port,
						host: host, 
						storage: storage,
						omitNull: true
					}
				);

//Importar la definicion de la tabla quiz en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//Importar la definicion de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

exports.Quiz = Quiz; //exportar definicion de la tabla Quiz
exports.Comment = Comment;

//sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count){
		if(true) { //la tabla se inicializa solo si esta vacia
			Quiz.create({ pregunta:'Capital de Italia?',
							respuesta: 'Roma'
						});
			Quiz.create({ pregunta:'Capital de Portugal?',
							respuesta: 'Lisboa'
						});
			Quiz.create({ pregunta:'Capital de Francia?',
							respuesta: 'Paris'
						});
			Quiz.create({ pregunta:'Capital de Alemania?',
							respuesta: 'Berlin'
						});
			Quiz.create({ pregunta:'Capital de España?',
							respuesta: 'Madrid'
						})
			.then( function(){console.log('Base de datos inicializa')});
		};
	});
});