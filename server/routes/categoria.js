
const express = require('express');

let {verificaToken, verificaAdminRole} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//====================
//Mostrar todas las categorias
//====================

app.get('/categoria',verificaToken,(req, res) => {
    
    Categoria.find()
    .sort('descripcion')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categorias
        });
    });
});

app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id,(err, categoria) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoria){
            return res.status(400).json({
                ok: false,
                err:{
                    message: 'El id no es correcto'
                }
            });
        }

        res.json({
            ok:true,
            categoria
        });

    });
});

app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;
    let idUsuario = req.usuario._id;

    let categoria = new Categoria({

        descripcion: body.descripcion,
        usuario: idUsuario
    });

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });
    });
});

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let descCat = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCat, {new:true, runValidators:true}, (err, categoriaDB) =>{

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDB
        });

    } );
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err,categoriaDelete) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!categoriaDelete){
            return res.status(400).json({
                ok: false,
                err:{
                    message:"Categoria no encontrada"
                }
            });
        }

        res.json({
            ok:true,
            categoria: categoriaDelete
        });
    });
});

module.exports = app;