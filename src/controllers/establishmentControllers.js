const { Establishment} = require("../models")


exports.register = async (req,res) => {
    try{
        const establishment = await Establishment.create({
            user_id: req.user.id,
            name: req.body.name,
            city: req.body.city,
            description: req.body.description,
            contact_phone: req.body.contact_phone
        })
     return res.status(201).json(establishment);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: "Error creating Establishment",
      details: error.message,
    });
  }
};

exports.showAll = async (req, res) => {
  try {
    const establishments = await Establishment.findAll({  
      attributes: { exclude: ["user_id"] }
    });
    res.status(200).json(establishments);  
  } catch (error) {
    res.status(500).json({
      error: "Establishments not found",  
      details: error.message 
    });
  }
};