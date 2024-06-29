const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { pool } = require("./database.js")
const { verificarUsuario, getDataMisPub, getDataPerfil, postearPub, actualizarPub, actualizarPerfil, verificacionDePublicacion, borrarPublicacion, verificacionDeUsuario, borrarCuenta } = require("./funciones.js")
const { autenticadorToken } = require("./middleware.js")
require("dotenv").config()

// el levantamiento del servdor esta en index.js
app = express()
// middleware
app.use(express.json())

// middleware para recibir consultas cruzadas
app.use(cors())


// rutas GET publicas

// data completa de publicaciones
const queryVehiculos = "SELECT p.id_publicacion AS id_publicacion, p.id_usuario AS id_usuario, p.titulo AS titulo, p.precio AS precio, m.nombre AS marca, mo.nombre AS modelo, p.year AS año, p.kilometraje AS kilometraje, t.nombre AS transmision, c.nombre AS categoria, e.nombre AS estado, p.descripcion AS descripcion, p.imagen AS imagen FROM publicaciones p JOIN marcas m ON p.id_marca = m.id_marca JOIN modelos mo ON p.id_modelo = mo.id_modelo JOIN transmisiones t ON p.id_transmision = t.id_transmision JOIN  categorias c ON p.id_categoria = c.id_categoria JOIN estados e ON p.id_estado = e.id_estado"
app.get('/vehiculos', async (req, res) => {
    try {
        const consulta = `${queryVehiculos};`
        const { rows, rowCount } = await pool.query(consulta)
        if (!rowCount) {
            return res.status(204).send("No hay publicaciones en la base de datos")
        }
        res.status(200).send(rows)
    } catch (error) {
        res.status(500).send("No se puede contactar a la base de datos", error)
    }
})

// data con la aplicacion de filtros
app.get('/vehiculos/filtros', async (req, res) => {
    try {
        const { estado, categoria, marca, modelo, year, transmision } = req.query
        let filtros = []
        const values = []
        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor)
            const posicion = values.length
            filtros.push(`${campo} ${comparador} $${posicion}`);
        };
        if (estado) {
            agregarFiltro("e.id_estado", "=", estado)
        }
        if (categoria) {
            agregarFiltro("c.id_categoria", "=", categoria)
        }
        if (marca) {
            agregarFiltro("m.id_marca", "=", marca)
        }
        if (modelo) {
            agregarFiltro("mo.id_modelo", "=", modelo)
        }
        if (year) {
            agregarFiltro("p.year", "=", year)
        }
        if (transmision) {
            agregarFiltro("t.id_transmision", "=", transmision)
        }
        const unionDeFiltros = filtros.length > 0 ? 'WHERE ' + filtros.join(" AND ") : '';
        const consulta = `SELECT p.id_publicacion AS id_publicacion, p.id_usuario AS id_usuario, p.titulo AS titulo, p.precio AS precio, m.nombre AS marca, mo.nombre AS modelo, p.year AS año, p.kilometraje AS kilometraje, t.nombre AS transmision, c.nombre AS categoria, e.nombre AS estado, p.descripcion AS descripcion, p.imagen AS imagen FROM publicaciones p JOIN marcas m ON p.id_marca = m.id_marca JOIN modelos mo ON p.id_modelo = mo.id_modelo JOIN transmisiones t ON p.id_transmision = t.id_transmision JOIN categorias c ON p.id_categoria = c.id_categoria JOIN estados e ON p.id_estado = e.id_estado ${unionDeFiltros};`;
        const { rows, rowCount } = await pool.query(consulta, values)
        if (!rowCount) {
            return res.status(204).send("No hay Autos publicados con estos filtros")
        }
        res.status(200).send(rows)
    } catch (error) {
        res.status(500).send("No se pudo conectar con el servidor")
    }
})

// data de marcas
app.get('/marcas', async (req, res) => {
    try {
        const consulta = "SELECT * FROM marcas;"
        const { rows } = await pool.query(consulta)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

// data de modelos segun la marca
app.get('/modelos/:id_marca', async (req, res) => {
    const { id_marca } = req.params
    const values = [id_marca]
    try {
        const consulta = `SELECT * FROM modelos WHERE id_marca = $1;`
        const { rows } = await pool.query(consulta, values)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

// data de transmisiones
app.get('/transmisiones', async (req, res) => {
    try {
        const consulta = "SELECT * FROM transmisiones;"
        const { rows } = await pool.query(consulta)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

// data de estado
app.get('/estados', async (req, res) => {
    try {
        const consulta = "SELECT * FROM estados;"
        const { rows } = await pool.query(consulta)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

//data de categoria
app.get('/categorias', async (req, res) => {
    try {
        const consulta = "SELECT * FROM categorias;"
        const { rows } = await pool.query(consulta)
        res.json(rows)
    } catch (error) {
        console.log(error)
    }
})

// rutas GET privadas
app.get("/perfil", autenticadorToken, async (req, res) => {
    const usuario = req.user
    const id_usuario = usuario.id_usuario
    console.log(id_usuario)
    const dataPerfil = await getDataPerfil(id_usuario)
    res.status(200).json([dataPerfil])
})

app.get("/editar-perfil", autenticadorToken, (req, res) => {
    const usuario = req.user
    res.status(200).json({ message: 'Acceso concedido a ruta privada', usuario })
})

app.get("/publicar", autenticadorToken, (req, res) => {
    const usuario = req.user
    res.status(200).json({ message: 'Acceso concedido a ruta privada', usuario })
})

app.get("/editar-publicacion/:id_publicacion", autenticadorToken, (req, res) => {
    const usuario = req.user
    res.status(200).json({ message: 'Acceso concedido a ruta privada', usuario })
})

app.get("/mis-publicaciones", autenticadorToken, async (req, res) => {
    const usuario = req.user
    const id_usuario = usuario.id_usuario
    const dataMisPub = await getDataMisPub(id_usuario)
    console.log(dataMisPub)
    res.status(200).json({ message: 'Acceso concedido a ruta privada', usuario, dataMisPub })
})

// rutas POST

const key = process.env.LLAVESECRETA
// registrar un usuario
app.post('/registro', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, password, foto } = req.body
        if (!nombre || !apellido || !email || !password) {
            return res.status(400).json("Faltan datos para poder realizar el registro")
        }
        const values = [nombre, apellido, email, telefono, bcrypt.hashSync(password), foto]
        const consulta = "INSERT INTO usuarios (nombre, apellido, email, telefono, password, foto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;"
        const { rows, rowCount } = await pool.query(consulta, values)
        if (!rowCount) {
            return res.status(500).send("No se ha podido registrar")
        }
        res.status(201).json(rows[0])
    } catch (error) {
        console.log(error)
        res.status(501).send("El usuario no se puede registrar " + error.detail)
    }
})

// loguearse
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const usuarioVerificado = await verificarUsuario(email)
        if (!usuarioVerificado.rowCount) {
            return res.status(404).send("el usuario no existe")
        }
        const verificarPassword = bcrypt.compareSync(password, usuarioVerificado.rows[0].password)
        if (!verificarPassword) {
            return res.status(401).send("la contraseña es incorrecta")
        } else {
            const token = jwt.sign({
                nombre: usuarioVerificado.rows[0].nombre,
                apellido: usuarioVerificado.rows[0].apellido,
                email: usuarioVerificado.rows[0].email,
                id_usuario: usuarioVerificado.rows[0].id_usuario
            }, key)
            res.status(200).send({ token })
            console.log(token)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            code: 500,
            message: "error al iniciar sesión",
            error: error.detail
        })
    }
})

// publicar
app.post('/publicar', async (req, res) => {
    try {
        const { id_usuario, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen } = req.body
        if (!id_usuario || !id_marca || !id_modelo || !id_transmision || !id_categoria || !id_estado) {
            return res.status(500).send({ message: "faltan datos para poder realizar el registro ", code: 500 })
        }
        const postPublicacion = await postearPub(id_usuario, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen)
        res.status(200).send({ message: "La publicación ha sido posteada con éxito", postPublicacion })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "No se pudo postear la publicación", code: 500 })
    }
})

// rutas PUT

// editar publicación
app.put('/editar-publicacion/:id_publicacion', async (req, res) => {
    try {
        const { id_publicacion } = req.params
        const { titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen } = req.body
        const { rows, rowCount } = await actualizarPub(id_publicacion, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen)
        if (!rowCount) {
            return res.status(501).send("no se pudo conectar con el servidor")
        }
        res.status(200).send("La publicacion se actualizó exitosamente con sol datos: ", rows[0])
    } catch (error) {
        res.status(500).send(error)
    }
})

// editar perfil
app.put('/editar-perfil/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params
        const { email, foto, telefono, password } = req.body
        const perfilActualizado = await actualizarPerfil(email, foto, telefono, password, id_usuario)
        if (!perfilActualizado.rowCount) {
            return res.status(400).send("No se pudo actualizar el perfil")
        }
        res.status(200).send(`Los datos del usuario con id ${id_usuario} se han actualizado correctamente`)
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Problemas con el servidor", err: error })
    }
})

// rutas DELETE

// eliminar publicacion
app.delete('/mis-publicaciones/:id_publicacion', async (req, res) => {
    try {
        const { id_publicacion } = req.params
        const { id_usuario } = req.body
        const verificarPublicacion = await verificacionDePublicacion(id_publicacion)
        if (!verificarPublicacion.rowCount) {
            return res.status(404).send("Publicación no encotrada")
        }
        const validacionDeUsuario = verificarPublicacion.rows[0]
        if (validacionDeUsuario.id_usuario !== id_usuario) {
            res.status(401).send("No tienes autorización para borrar esta publicación")
        }
        const deletePub = await borrarPublicacion(id_publicacion)
        if (!deletePub.rowCount) {
            res.status(500).send("No se logró borrar la publicacion")
        }
        res.status(200).send("La publicación se borró con exito")
    } catch (error) {
        res.status(500).send({ message: "Problemas con el servidor", err: error })
    }
})

//eliminar perfil
app.delete('/eliminar-perfil/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params
        const verificarUsuario = await verificacionDeUsuario(id_usuario)
        if (!verificarUsuario.rowCount) {
            return res.status(404).send("El usuario no existe")
        }
        const eliminarPerfil = await borrarCuenta(id_usuario)
        if (!eliminarPerfil.rowCount) {
            return res.status(500).send("Error al eliminar el usuario")
        }
        res.status(200).send({ message: "El usuario se ha eliminado junto con todas sus publicaciones", usuario: verificarUsuario.rows[0] })
    } catch (error) {
        res.status(500).send({ message: "Problemas con el servidor", err: error })
    }
})
module.exports = app