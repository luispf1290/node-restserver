

// =================
// puerto
// =================

process.env.PORT = process.env.PORT || 3000;


// =================
// Entorno
// =================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =================
// Vencimiento del token
// =================
//60 segundos
//60 minitus
//24 horas
// 30 dias

process.env.CADUCIDAD_DE_TOKEN = 60 * 60 * 24 * 30;


// =================
// SEED de autentificacion
// =================


process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// =================
/// Base de datos
// =================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/cafe';
} else {
	urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;



// =================
/// GOOGLE CLIENT_ID
// =================

process.env.CLIENT_ID = process.env.CLIENT_ID || '244935034127-pjb0q1lkka2gqfr6vpv37uddug8500k6.apps.googleusercontent.com'; 

