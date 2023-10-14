const {response} = require('express');
const {validationResult} = require('express-validator');


const validarCampos = (req, resp=response,next) =>{

    //CErrores
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return resp.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }
    //Console.log(errors);

    next();
}

module.exports = {
    validarCampos
}
