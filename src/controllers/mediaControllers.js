const { Media } = require("../models")

exports.create = async (req, res) => {    
  try {
    const { type, title, url } = req.body;
    
    const owner_type = req.user.role;
    
   
    if (!['musician', 'band', 'establishment'].includes(owner_type)) {
      return res.status(400).json({
        error: "Invalid user role"
      });
    }
    

    const media = await Media.create({
      user_id: req.user.id,    
      owner_type,              
      type,
      title,
      url
    });
    
    
    const { user_id, ...mediaData } = media.toJSON();
    return res.status(201).json(mediaData);
    
  } catch (error) {
    console.error("Erro completo:", error);
    return res.status(500).json({ 
      error: "Internal Error", 
      details: error.message 
    });
  }
}

exports.show = async (req, res) => {
  try {
    const medias = await Media.findAll({
  where: {
    user_id: musician.user_id,
    owner_type: "musician"
  },
  limit: 3,
  order: [["createdAt", "DESC"]]
})

    
    return res.status(200).json(media);
  } catch (error) {
    return res.status(500).json({
      error: "Error fetching media",
      details: error.message
    });
  }
}
