
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload());
 
app.put('/upload/:tipo/:id', (req, res) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files){
        
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No has seleccionado un archivo'
            }
        });
    }

    // valitda tipo

    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.lastIndexOf(tipo) < 0){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;

    let nombreSegmentado = archivo.name.split('.');

    let extension = nombreSegmentado[nombreSegmentado.length - 1];

    let extensionesValidas = ['jpg', 'jpge', 'png', 'gif'];

    //Validar extenciones

    if( extensionesValidas.indexOf(extension) < 0){

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', ')
            }
        });
    }

    // Cambiar nombre al archivo

    nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {
        if (err)
          return res.status(500).json({
            ok:false,
            err
          });
        
        if( tipo === 'usuarios' ){
            
            imagenUsuario(id, res, nombreArchivo);
        }else{
            imagenProducto(id, res, nombreArchivo);
        }

      });
});

function imagenUsuario(id, res, nombreArchivo){

    Usuario.findById(id, (err, usuarioBD) => {
        
        if(err){

            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioBD){

            borrarImagen(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no es correcto o no existe'
                }
            });
        }

      
        borrarImagen(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;

        usuarioBD.save((err, usuarioSave) => {

            res.json({
                ok:true,
                usuario: usuarioSave,
                img: nombreArchivo
            });
        });

    });
}


function imagenProducto(id, res, nombreArchivo){

    Producto.findById(id, (err, productoDB) => {
       
        if(err){
            borrarImagen(nombreArchivo, 'productos');

            return res.status(500).json({
                ok:false,
                err
            });
        } 

        if(!productoDB){

            borrarImagen(nombreArchivo, 'productos');

            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El id no es correcto o no existe'
                }
            });
        }

        borrarImagen(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoSave) => {

            res.json({
                ok:true,
                producto: productoSave,
                img: nombreArchivo
            });
        });

    });
}

function borrarImagen(nombreImagen, tipo){
    
    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen }`)

        if( fs.existsSync(pathImagen)){
            fs.unlinkSync(pathImagen);
        }
}

module.exports = app;