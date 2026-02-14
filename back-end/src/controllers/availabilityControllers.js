const { Availability, Musician, Band, Establishment } = require("../models");


const findOwner = async (userId) => {
  const musician = await Musician.findOne({ where: { user_id: userId } });
  if (musician) return { owner: musician, ownerType: "musician" };

  const band = await Band.findOne({ where: { user_id: userId } });
  if (band) return { owner: band, ownerType: "band" };

  const establishment = await Establishment.findOne({ where: { user_id: userId } });
  if (establishment) return { owner: establishment, ownerType: "establishment" };

  return null;
};


exports.register = async (req, res) => {
  try {
    const result = await findOwner(req.user.id);
    
    if (!result) {
      return res.status(403).json({
        error: "You must be a musician, band, or establishment"
      });
    }

    const { owner, ownerType } = result;

    const availability = await Availability.create({
      owner_id: owner.id,
      owner_type: ownerType,
      ...req.body
    });

    const response = availability.toJSON();
    delete response.id;
    delete response.owner_id;
    delete response.createdAt;
    delete response.updatedAt;

    return res.status(201).json(response);

  } catch (error) {
    console.error("Error:", error);
    
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
  try {
    const availabilities = await Availability.findAll({
      attributes: { exclude: ["id", "owner_id", "createdAt", "updatedAt"] },
      order: [['date', 'ASC'], ['start_time', 'ASC']]
    });
    
    return res.status(200).json(availabilities);
    
  } catch (error) {
    return res.status(500).json({ 
      error: "Not found", 
      details: error.message 
    });
  }
};
