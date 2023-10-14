const {response} = require('express');
const Evento = require('../models/Evento');

const obtenerEventos = async(req, resp = response) => {

    const eventos = await Evento.find()
                            .populate('user','name') ;
    try {
        resp.status(201).json({
            ok: true,
            msg:'ObtenerEventos',
            evento: eventos
        });
    }
    catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }

}

const crearEvento = async(req, resp = response) => {

    const evento = new Evento(req.body);
    
    try {
        evento.user = req.uid;
        const guardarEvento = await evento.save();
        resp.status(201).json({
            ok: true,
            msg:'Crear',
            evento: guardarEvento
        });
    }
    catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }

}

const actualizarEvento = async(req, resp = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventId);
        
        if(!evento){
            return resp.status(404).json({
                ok: true,
                msg:'No existe el evento'
            });
        }
        if(evento.user.toString() !== uid){
            return resp.status(401).json({
                ok: true,
                msg:'No puede editar el evento'
            });
        }

        const nuevoEvento = {
            ...req.body,
            user:uid
        }
        const eventoActualizado = await Evento.findByIdAndUpdate(eventId,nuevoEvento, {new:true});

        resp.status(201).json({
            ok: true,
            msg:'Actualizar',
            evento: eventoActualizado
        });
    }
    catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }

}

const eliminarEvento = async(req, resp = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    try {

        const evento = await Evento.findById(eventId);
        
        if(!evento){
            return resp.status(404).json({
                ok: true,
                msg:'No existe el evento'
            });
        }
        if(evento.user.toString() !== uid){
            return resp.status(401).json({
                ok: true,
                msg:'No puede editar el evento'
            });
        }
        const eventoEliminado = await Evento.findByIdAndDelete(eventId);

        resp.status(201).json({
            ok: true,
            msg:'Eliminar',
            evento:eventoEliminado

        });
    }
    catch(error){
        resp.status(500).json({
            ok: false,
            msg:'Comuniquese con el admin',
        })
    }

}

module.exports = {
    obtenerEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}