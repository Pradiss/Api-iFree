const { User } = require("../models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.register = async (req, res) => {
  try {
    const user = await User.create(req.body)

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })

  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        errors: error.errors.map(e => e.message)
      })
    }

    res.status(500).json({ error: "Erro ao registrar usuário  " })
  }
}


exports.login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({where: { email }})

    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.json(401).json({ error: 'Invalid credentials', error: details.message })
    }

    const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {expiresIn: '1d'})
    res.json({ token })
}

exports.userAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    })

    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({
      error: "Users not found",
      details: error.message
    })
  }
}
