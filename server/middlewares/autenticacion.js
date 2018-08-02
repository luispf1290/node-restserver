

const jwt = require('jsonwebtoken');

//==============
//Verificar Token
//==============

module.exports.verificaToken = (req, res, next) => {
    
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err,decoded) => {

        if(err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario  = decoded.usuario;
        next();

    });
};

//==============
//Verifica Usuaro ADMIN_ROLE
//==============

module.exports.verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario.role;

    if(usuario !== 'ADMIN_ROLE'){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se puede realizar esta accion, no eres administrador'
            }
        });
    }

    next();

}
