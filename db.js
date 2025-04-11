// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres.hfvgpxqpmaosrugcdpqc',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: '1234',
  port: 5432,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones seguras con Supabase
  }
});

// Verificación de la conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error(' Error al conectar con Supabase:', err.stack);
  } else {
    console.log(' Conectado exitosamente a Supabase');
    release();
  }
});

// Manejo de errores inesperados en la conexión
pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente de PostgreSQL', err);
  process.exit(-1);
});

module.exports = pool;

