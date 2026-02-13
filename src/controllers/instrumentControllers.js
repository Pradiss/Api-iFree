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
        const instrument = await Instrument.findAll({ attributes: { exclude: [ "createdAt", "updatedAt"] }})
        res.status(200).json(instrument)
    }catch(error){
        res.status(404).json({ error: "Not Found ", details: error.message})
    }
}


exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        
       
        const deleted = await Instrument.destroy({
            where: { 
                id: Number(id)  
            }
        });

       
        if (deleted === 0) {
            return res.status(404).json({
                error: `Instrument with id ${id} not found`
            });
        }

        res.status(204).send(); 
        
    } catch (error) {
        res.status(500).json({ 
            error: "Internal Server Error", 
            details: error.message 
        });
    }
}