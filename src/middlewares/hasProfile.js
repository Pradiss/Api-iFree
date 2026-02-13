const { Musician, Band } = require("../models");

module.exports = (types = []) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;

      if (types.includes("musician")) {
        const musician = await Musician.findOne({ where: { user_id: userId } });
        if (musician) {
          req.musician = musician;
          return next();
        }
      }

      if (types.includes("band")) {
        const band = await Band.findOne({ where: { user_id: userId } });
        if (band) {
          req.band = band;
          return next();
        }
      }

      return res.status(403).json({ error: "Perfil não autorizado" });

    } catch (err) {
      return res.status(500).json({ error: "Erro de permissão" });
    }
  };
};
