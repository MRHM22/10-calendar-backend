const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config');

// crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//cors
app.use(cors());

//Directorio public
app.use(express.static('public'));

//Lecturas y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));

app.get('*',(req,resp)=>{
    resp.sendFile(__dirname + '/public/index.html');
});
// Escuchar peticiones
app.listen(process.env.PORT ,()=>{
    console.log(`Servidor en puerto ${process.env.PORT}`)
});