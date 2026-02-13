const { Availability, Musician ,Band} = require("../models");

exports.register = async (req, res) => {
  try {
    const result = await findOwner(req.user.id);
    
    if (!result) {
      return res.status(403).json({
        error: "You must be a musician, band, or establishment"
      });
    }

    const { owner, ownerType } = result;

    // O MODEL já valida os campos obrigatórios!
    const availability = await Availability.create({
      owner_id: owner.id,
      owner_type: ownerType,
      ...req.body // Spread do body
    });

    // Remover campos sensíveis
    const { id, owner_id, createdAt, updatedAt, ...response } = availability.toJSON();

    return res.status(201).json(response);

  } catch (error) {
    console.error("Error creating availability:", error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join(', ')
      });
    }

    return res.status(500).json({
      error: "Internal error",
      details: error.message
    });
  }
};

exports.showAll = async (req, res) => {
    try{
        const available = await Availability.findAll()
        res.status(200).json(available)
    }catch(error){
        res.status(404).json({ error: "Not found", datails: error.message })
    }
}