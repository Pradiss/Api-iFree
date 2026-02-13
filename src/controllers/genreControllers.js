const { Genre } = require("../models")

exports.register = async (req, res) => {
    try{
        const genre = await Genre.create(req.body)
        res.status(201).json(genre)
    }catch(error){
        res.status(500).json({error: 'Internal Error', details: error.message})
    }
}

exports.showAll = async (req, res) => {
    try{
        const genre = await Genre.findAll({ attributes: { exclude: [ "createdAt", "updatedAt"] }})
        res.status(200).json(genre)
    }catch(error){
        res.status(500).json( {error: "Not Found ", details: error.message})
    }
}