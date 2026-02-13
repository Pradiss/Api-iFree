const { Establishment} = require("../models")


exports.register = async (req, res) => {
  try {
    const establishment = await Establishment.create({
      user_id: req.user.id,
      ...req.body // Spread dos campos do body
    });

    // Remover campos sensíveis
    const { id, user_id, createdAt, updatedAt, ...response } = establishment.toJSON();

    return res.status(201).json(response);

  } catch (error) {
    // Tratamento de erros do Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        error: "Establishment already exists for this user"
      });
    }
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        error: error.errors.map(e => e.message).join(', ')
      });
    }

    return res.status(400).json({
      error: "Error creating Establishment",
      details: error.message
    });
  }
};


exports.showAll = async (req, res) => {
  try {
    const establishments = await Establishment.findAll({  
      attributes: { exclude: ["user_id","createdAt", "updatedAt"] }
    });
    res.status(200).json(establishments);  
  } catch (error) {
    res.status(500).json({
      error: "Establishments not found",  
      details: error.message 
    });
  }
};