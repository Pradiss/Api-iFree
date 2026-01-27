const { Instrument } = require("../models")

exports.register = async (req, res) => {
    try{
        const instrument = await Instrument.create(req.body)
        res.status(200).json(instrument)
    }catch(error){
        res.status(500).json({ error: "Internal Erro", details: error.message })
    }
}

exports.show = async (req, res) => {
    try{
        const instrument = await Instrument.findAll()
        res.status(200).json(instrument)
    }catch(error){
        res.status(404).json({ error: "Not Found ", details: error.message})
    }
}