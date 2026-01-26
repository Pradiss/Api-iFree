const { Band } = require("../models")

exports.register = async (req, res) => {
  try {
    const band = await Band.create({
      user_id: req.user.id, 
      name: req.body.name,
      city: req.body.city,
      genre_description: req.body.genre_description,
      bio: req.body.bio,
      profile_image: req.body.profile_image,
    });

    return res.status(201).json(band);
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
    const band = await Band.findAll({
      attributes: { exclude: ["user_id"] } 
    });
    return res.status(200).json(band);
  } catch (error) {
    return res.status(500).json({
      error: "Band not found",
      details: error.message,
    });
  }
};
