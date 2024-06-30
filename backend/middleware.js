const jwt = require("jsonwebtoken")
require("dotenv").config()

const key = process.env.LLAVESECRETA
const autenticadorToken = (req, res, next) => {
    const credenciales = req.headers.authorization
    if (!credenciales) {
        return res.status(401).send({ message: "Sin autorización, cabecera sin credenciales" })
    }
    const [bearer, token] = credenciales.split(" ")
    if (bearer !== "Bearer" || !token) {
        return res.status(401).send({ message: "Sin autorización, Token no válido" })
    }
    try {
        const user = jwt.verify(token, key)
        req.user = user
        return next()
    } catch (error) {
        console.log(error)
        return res.status(401).send({ message: "Sin autorización, verifique sus credenciales" })
    }
}

module.exports = { autenticadorToken }