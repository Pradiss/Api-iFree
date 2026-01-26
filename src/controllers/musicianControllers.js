const { Musician } = require("../models");

exports.register = async (req, res) => {
  try {
    const musician = await Musician.create({
      user_id: req.user.id, 
      name_artistic: req.body.name_artistic,
      city: req.body.city,
      experience_years: req.body.experience_years,
      bio: req.body.bio,
      profile_image: req.body.profile_image,
    });

    return res.status(201).json(musician);
  } catch (error) {
    console.error(error);

    return res.status(400).json({
      error: "Error creating musician",
      details: error.message,
    });
  }
};

exports.showAll = async (req, res) => {
  try {
    const musicians = await Musician.findAll({
      attributes: { exclude: ["user_id"] } 
    });
    return res.status(200).json(musicians);
  } catch (error) {
    return res.status(500).json({
      error: "Musicians not found",
      details: error.message,
    });
  }
};
