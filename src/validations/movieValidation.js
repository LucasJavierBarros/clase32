const {check} = require('express-validator');

module.exports = [

    check('title')
        .notEmpty().withMessage('El nombre es obligatorio').bail(),

    check('rating')
        .notEmpty().withMessage('El Rating es obligatorio')
        .isNumeric({
            min : 0,
            max: 10
        }).withMessage('Valores de rating entre 1 y 10'),
    check('awards')
        .notEmpty().withMessage('Este campo es obligatorio').bail()
        .isNumeric().withMessage('Solo se admiten números'),
    check('release_date')
        .notEmpty().withMessage('Este campo es obligatorio').bail(),
    check('length')
        .notEmpty().withMessage('La duración es obligatoria').bail()
        .isNumeric().withMessage('Solo se admiten números'),
    check('genre_id')
        .notEmpty().withMessage('Debe seleccionar género')

]   
