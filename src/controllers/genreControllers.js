const { Genre } = require("../models")

exports.register = async (req, res) => {
    try{
        const genre = await Genre.create()
    }catch(error){
        res.status(500).json({error: 'Internal Error', details: error.message})
    }
}