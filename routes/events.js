const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

const {obtenerEventos, crearEvento,actualizarEvento,eliminarEvento} = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


router.use(validarJWT);
//Todas validar token jwt
//obtener event
router.get('/',obtenerEventos);

//Crear event
router.post('/',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Se debe ingresar la fecha de inicio').custom(isDate),
        check('end','Se debe ingresar la fecha final').custom(isDate),
        validarCampos
    ],    
crearEvento);

//Actualizar event
router.put('/:id',
[
    check('title','El titulo es obligatorio').not().isEmpty(),
    check('start','Se debe ingresar la fecha de inicio').custom(isDate),
    check('end','Se debe ingresar la fecha final').custom(isDate),
    validarCampos
],actualizarEvento);

//Actualizar event
router.delete('/:id',eliminarEvento);

module.exports = router;