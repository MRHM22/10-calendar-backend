const {response} = require('express');
const bcrypt = require('bcryptjs');
const {validationResult} =require('express-validator');
const Usuario = require('../models/Usuario');
const {generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, resp = response) => {
    
    const { email, password} = req.body;
    
    try {
        let usuario =await Usuario.findOne({email});
        //console.log(usuario);
        if (usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'Existe un usuario con ese correo'
            });
        }
        usuario = new Usuario(req.body);

        // Encriptar contrasena
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password,salt);

        await usuario.save();

        //Generar token
        const token = await generarJWT(usuario.id,usuario.name);

        resp.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }
}

const loginUsuario = async(req, resp = response)=>{
    //console.log(req.body);
    const { email, password} = req.body;
    
    try{
        const usuario =await Usuario.findOne({email});
        //console.log(usuario);
        if (!usuario) {
            return resp.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            });
        }
        //Confirmar la contrasena
        const validPassword=bcrypt.compareSync(password, usuario.password);

        if (!validPassword){
            return resp.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }
        // Generar nuestro JWT
        const token = await generarJWT(usuario.id,usuario.name);

        resp.status(200).json({
            ok: true,
            msg:'login',
            uid: usuario.id,
            name: usuario.name,
            token
        })

    }catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }
    
    
}

const revalidarToken = async (req, resp = response)=>{
    
    const {uid, name} = req;

    //Genera JWT
    const token = await generarJWT(uid,name);

    resp.status(200).json({
        "ok": true,
        msg: 'renew',
        uid, name,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}