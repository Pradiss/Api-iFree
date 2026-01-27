const { User, Establishment, Band, Musician,MusicianMedia, Genre, Instrument } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    console.log("Dados recebidos:", req.body) 
    const user = await User.create(req.body)
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error("Erro completo:", error) 
    
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map(e => e.message)
      })
    }
    
    
    res.status(500).json({ 
      error: "Error registering user.",
      details: error.message 
    })
  }
}


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    )

    return res.json({ token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Error login " })
  }
}


exports.userAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role"],  
      include: [
        {
          model: Musician,
          as: "musician",
          attributes: { 
            exclude: ["user_id", "createdAt", "updatedAt"] 
          },
          include: [
            {
              model: MusicianMedia,
              as: "media",
              attributes: ["id", "type", "url", "title"],
              limit: 3  
            },
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
        },
        {
          model: Band,
          as: "band",
          attributes: { 
            exclude: ["user_id", "createdAt", "updatedAt"] 
          }
        },
        {
          model: Establishment,
          as: "establishment",
          attributes: { 
            exclude: ["user_id", "createdAt", "updatedAt"] 
          }
        }
      ]
    });
    
    res.status(200).json(users)
    
  } catch (error) {
    res.status(500).json({
      error: "Users not found",
      details: error.message
    })
  }
}
