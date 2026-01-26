const { verify } = require("jsonwebtoken")

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  
  if(!token){
    return res.status(401).json({ error: "Token Not Found"})
  }
  
  try{
    const verified = verify(token, process.env.JWT_SECRET)
    req.user = verified 
    next()
  }catch(error){
    res.status(401).json({ error: "Token Invalid" })
  }
}