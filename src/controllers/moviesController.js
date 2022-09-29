const moment = require('moment')
const {
    name
} = require('ejs');
const db = require('../database/models');
const sequelize = db.sequelize;
const {
    validationResult
} = require('express-validator')
//Otra forma de llamar a los modelos
const Movies = db.Movie;

const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {
                    movies
                })
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {
                    movie
                });
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
                order: [
                    ['release_date', 'DESC']
                ],
                limit: 5
            })
            .then(movies => {
                res.render('newestMovies', {
                    movies
                });
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
                where: {
                    rating: {
                        [db.Sequelize.Op.gte]: 8
                    }
                },
                order: [
                    ['rating', 'DESC']
                ]
            })
            .then(movies => {
                res.render('recommendedMovies.ejs', {
                    movies
                });
            });
    }, //Aqui debemos modificar y completar lo necesario para trabajar con el CRUD
    add: function (req, res) {
        // TODO   
        db.Genre.findAll({
                order: [
                    ['name']
                ]
            })
            .then(genres => res.render('moviesAdd', {
                genres
            }))
            .catch(error => console.log(error))

    },
    create: function (req, res) {
        const {
            title,
            release_date,
            rating,
            awards,
            genre_id,
            length
        } = req.body;
        let errors = validationResult(req);

        if (errors.isEmpty()) {
            db.Movie.create({
                    ...req.body,
                    title: title.trim()
                })
                .then(movie => {
                    return res.redirect('/movies/detail/' + movie.id)
                })
                .catch(error => console.log(error))
        } else {
            db.Genre.findAll({
                    order: [
                        ['name']
                    ]
                })
                .then(genres => res.render('moviesAdd', {
                    errors: errors.mapped(),
                    old: req.body,
                    genres
                }))

        }

    },
    edit: function (req, res) {
        // TODO
        let genres = db.Genre.findAll({
            order: [
                ['name']
            ]
        })
        let movie = db.Movie.findByPk(req.params.id)
        Promise.all([genres, movie])
            .then(([genres, movie]) => {
                res.render('moviesEdit', {
                    genres,
                    Movie: movie,
                    moment: moment
                })
            })
            .catch(error => console.log(error))
    },
    update: function (req, res) {
        errors = validationResult(req)
        let genres = db.Genre.findAll({
            order: [
                ['name']
            ]
        })
        let movie = db.Movie.findByPk(req.params.id)

        Promise.all([genres, movie])
        .then(([genres, movie]) => {
            if (errors.isEmpty()) {
                db.Movie.update({
                        ...req.body,
                        title: req.body.title.trim()
                    }, {
                        where: {
                            id: req.params.id
                        }
                    })
                    .then(response => {
                        console.log(response)
                        return res.redirect('/movies/detail/' + req.params.id)
                    })
                    .catch(error => console.log(error))
            }else{
                
                res.render('moviesEdit',{
                    genres,
                    Movie: movie,
                    moment: moment,
                    errors:errors.mapped()
                })
            }
            })
        
        .catch(error => console.log(error))
        
        

    },
    delete: function (req, res) {
        db.Movie.findByPk(req.params.id)
            .then(movie => res.render('moviesDelete', {
                Movie: movie
            }))
            .catch(error => console.log(error))
    },
    destroy: function (req, res) {
        db.Movie.destroy({
                where: {
                    id: req.params.id
                }
            })
            .then(result => {
                console.log(result)
                return res.redirect('/movies')
            })
            .catch(error => console.log(error))
    }

}

module.exports = moviesController;