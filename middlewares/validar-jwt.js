const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, resp = response, next) => {
    // x-token headers
    const token = req.header('x-token');
    //console.log(token);
    if(!token) {
        return resp.status(401).json({
            ok: false,
            msg: 'NO hay token en la peticion'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.uid = payload.uid;
        req.name = payload.name;
        //console.log(payload);
    }catch(error){
        return resp.status(401).json({
            ok: false,
            msg: 'Token invalidao'
        });
    }

    next();
}

module.exports = {
    validarJWT
}