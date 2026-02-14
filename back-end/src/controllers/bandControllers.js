const { Band, Genre } = require("../models")

exports.register = async (req, res) => {
  try {

    const existingBand = await Band.findOne({
      where: { user_id: req.user.id }
    });

    if(existingBand){
      return res.status(400).json({ error: "Band Already exists" })
    }

     if (!Array.isArray(req.body.genre_ids) || req.body.genre_ids.length === 0) {
      return res.status(400).json({
        error: "Band must have at least one genre"
      });
    }

    const band = await Band.create({
      user_id: req.user.id, 
      name: req.body.name,
      city: req.body.city,
      genre_description: req.body.genre_description,
      bio: req.body.bio,
      profile_image: req.body.profile_image,
    });

    await band.setGenres(req.body.genre_ids)

    const BandWithGenres = await Band.findByPk(band.id, {
      include: {
        model: Genre,
        as: "genres",
        through: { attributes: [] }
      }
    })

    return res.status(201).json(BandWithGenres);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Error creating musician",
      details: error.message,
    });
  }
};

exports.showAll = async (req, res) => {
  try {
    const band = await Band.findAll({
      attributes: { exclude: ["user_id","createdAt", "updatedAt"] } 
    });
    return res.status(200).json(band);
  } catch (error) {
    return res.status(500).json({
      error: "Band not found",
      details: error.message,
    });
  }
};
