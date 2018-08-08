
const express = require('express');
const _ =  require('underscore');

let {verificaToken} = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../models/producto');

app.get('/producto', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
	desde = Number(desde);

	let limite = req.query.limite || 5;
    limite = Number(limite);
    
    Producto.find({disponible:true})
    .skip(desde)
    .limit(limite)
    .sort('nombre')
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            productos
        });
    });
});


app.get('/producto/:id',verificaToken, (req,res) => {

    let id = req.params.id;

    Producto.findById(id)
    .sort('nombre')
    .populate('usuario','nombre email')
    .populate('categoria', 'descripcion')
    .exec((err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El id es incorrecto'
                }
            });
        }

        res.json({
            ok:true,
            producto : productoDB
        });
    });
});


app.get('/producto/buscar/:termino',verificaToken, (req,res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre:regex, disponible:true})
    .populate('categoria', 'descripcion')
    .exec((err, productos) => {
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok:true,
            productos
        });
    });
});
app.post('/producto', verificaToken,(req, res) => {

    let body = req.body;
    let idUsuario = req.usuario._id;

    let producto =  new Producto({

        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: idUsuario
    });

    producto.save((err, productoDB) => {

        if(err){

            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put('/producto/:id',verificaToken, (req,res) => {

    let id = req.params.id;
    let body = _.pick(req.body,['nombre', 'precioUni', 'descripcion', 'categoria']);

    Producto.findByIdAndUpdate(id, body, {new :true, runValidators: true},(err, productoDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'El id es incorrecto o no existe'
                }
            });
        }

        res.json({
            ok:true,
            producto: productoDB
        });
    });
})

app.delete('/producto/:id', verificaToken, (req,res) => {

    let id = req.params.id;

    let cambioDisponible = {
        disponible: false
    };

    Producto.findByIdAndUpdate(id, cambioDisponible, {new:true}, (err, productoNoDisponoble) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoNoDisponoble){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Producto No encontrado'
                }
            });
        }

        res.json({
            ok:true,
            producto: productoNoDisponoble
        });
    });
});


module.exports = app;