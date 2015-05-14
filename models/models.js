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

//Importar la definicion de la tabla user
var user_path = path.join(__dirname,'user');
var User = sequelize.import(user_path);

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//RElacion 1-N entre User y Quiz
Quiz.belongsTo(User);
User.hasMany(Quiz);



exports.Quiz = Quiz; //exportar definicion de la tabla Quiz
exports.Comment = Comment;
exports.User = User;

//sequelize.sync() crea e inicializa la tabla de preguntas en DB
sequelize.sync().then(function() {
	//then(..) ejecuta el manejador una vez creada la tabla
	User.count().then(function(count){
		if(count === 0) { //la tabla se inicializa solo si esta vacia
			User.bulkCreate(
				[	{username: 'admin', password: '1234', isAdmin: true},
					{username: 'pepe', password: '5678'} //isAdmin por defecto vale false
					]
				).then(function(){
					console.log('Base de datos (tabla user) inicializa');
					Quiz.count().then(function(count){
						if(count === 0) { 
							Quiz.bulkCreate(
								[ { pregunta:'Capital de Italia?', 		respuesta: 'Roma', 		UserId:2},
								  { pregunta:'Capital de Portugal?',	respuesta: 'Lisboa',	UserId:2},
								  { pregunta:'Capital de Francia?',		respuesta: 'Paris',		UserId:2},
								  { pregunta:'Capital de Alemania?',	respuesta: 'Berlin',	UserId:1},
								  { pregunta:'Capital de España?',		respuesta: 'Madrid',	UserId:2}
								]
							).then(function(){console.log('Base de datos (table quiz) inicializa')});
						};
					});
				});
			};
		});
	});