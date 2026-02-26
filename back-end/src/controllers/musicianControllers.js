const { Musician, Genre, Instrument, User } = require("../models");

exports.register = async (req, res) => {
  try {
    
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    
    const existingMusician = await Musician.findOne({
      where: { user_id: req.user.id }
    });

    if (existingMusician) {
      return res.status(400).json({
        error: "Musician already exists for this user"
      });
    }

    
    if (Array.isArray(req.body.genre_ids) && req.body.genre_ids.length > 0) {
      const genres = await Genre.findAll({
        where: { id: req.body.genre_ids }
      });
      
      if (genres.length !== req.body.genre_ids.length) {
        return res.status(400).json({
          error: "One or more genre IDs are invalid"
        });
      }
    }

    
    if (Array.isArray(req.body.instrument_ids) && req.body.instrument_ids.length > 0) {
      const instruments = await Instrument.findAll({
        where: { id: req.body.instrument_ids }
      });
      
      if (instruments.length !== req.body.instrument_ids.length) {
        return res.status(400).json({
          error: "One or more instrument IDs are invalid"
        });
      }
    }

   
    const musician = await Musician.create({
      user_id: req.user.id,
      name_artistic: req.body.name_artistic,
      city: req.body.city,
      experience_years: req.body.experience_years,
      bio: req.body.bio,
      profile_image: req.body.profile_image,
    });

    
    if (Array.isArray(req.body.genre_ids) && req.body.genre_ids.length > 0) {
      await musician.setGenres(req.body.genre_ids);
    }
    
    if (Array.isArray(req.body.instrument_ids) && req.body.instrument_ids.length > 0) {
      await musician.setInstruments(req.body.instrument_ids);
    }

    const musicianWithRelations = await Musician.findByPk(musician.id, {
      include: ["genres", "instruments"]
    });

    return res.status(201).json(musicianWithRelations);
  } catch (error) {
    console.error("Error:", error); 
    return res.status(400).json({
      error: "Error creating musician",
      details: error.message
    });
  }
};

exports.showProfile = async (req, res) => {
  try {
    const musician = await Musician.findOne({
      where: { user_id: req.user.id },
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: Instrument,
          as: "instruments",
          attributes: ["id", "name"],
          through: { attributes: [] }
        }
      ]
    });

    if (!musician) {
      return res.status(404).json({
        error: "Musician not found"
      });
    }

    return res.status(200).json(musician);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error fetching musician profile",
      details: error.message
    });
  }
};

exports.showAll = async (req, res) => {
  try {
    const musicians = await Musician.findAll({
      attributes: { exclude: ["user_id"] },
      include: [
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "name"],
          through: { attributes: [] }
        },
        {
          model: Instrument,
          as: "instruments",
          attributes: ["id", "name"],
          through: { attributes: [] }
        }
      ]
    });
    return res.status(200).json(musicians);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Musicians not found",
      details: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const musician = await Musician.findOne({
      where: { user_id: req.user.id }
    });

    if (!musician) {
      return res.status(404).json({
        error: "Musician not found"
      });
    }

    await musician.destroy();

    return res.status(200).json({
      message: "Musician deleted successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error deleting musician",
      details: error.message
    });
  }
};