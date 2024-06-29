const { pool } = require("./database.js")
const bcrypt = require("bcryptjs")

const verificarUsuario = async (email) => {
    const consulta = `SELECT * FROM usuarios WHERE email = $1;`
    const values = [email]
    const respuesta = await pool.query(consulta, values)
    return respuesta
}

const getDataMisPub = async (id_usuario) => {
    const consulta = "SELECT p.id_publicacion AS publicacion_id, p.id_usuario AS usuario_id, p.titulo AS titulo, p.precio AS precio, m.nombre AS marca, mo.nombre AS modelo, p.year AS año, p.kilometraje AS kilometraje, t.nombre AS transmision, c.nombre AS categoria, e.nombre AS estado, p.descripcion AS descripcion, p.imagen AS imagen FROM publicaciones p JOIN marcas m ON p.id_marca = m.id_marca JOIN modelos mo ON p.id_modelo = mo.id_modelo JOIN transmisiones t ON p.id_transmision = t.id_transmision JOIN  categorias c ON p.id_categoria = c.id_categoria JOIN estados e ON p.id_estado = e.id_estado WHERE p.id_usuario = $1;"
    const values = [id_usuario]
    const { rows, rowCount } = await pool.query(consulta, values)
    console.log(rows)
    if (!rowCount) {
        return { message: `el usuario no tiene publicaciones` }
    } else {
        return rows
    }
}

const getDataPerfil = async (id_usuario) => {
    const consulta = "SELECT * FROM usuarios WHERE id_usuario = $1;"
    const values = [id_usuario]
    const { rows, rowCount } = await pool.query(consulta, values)
    console.log(rows)
    if (!rowCount) {
        return { message: `El usuaruio con id ${id_usuario} no fue encontrado` }
    } else {
        return rows[0]
    }
}

const postearPub = async (id_usuario, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen) => {
    const consulta = "INSERT INTO publicaciones (id_usuario, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING*;"
    const values = [id_usuario, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen]
    const { rows, rowCount } = await pool.query(consulta, values)
    if (!rowCount) {
        return { message: "No se puedo postear la publicación", code: 500 }
    }
    return rows
}

// falta ver como se hacen las peticiones put, aca falta la funcion y en index terminar de cachear los errores y el res.send()


const actualizarPub = async (id_publicacion, titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen) => {
    const consulta = "UPDATE publicaciones SET titulo = $1, precio = $2, id_marca = $3, id_modelo = $4, year = $5, kilometraje = $6, id_transmision = $7, id_categoria = $8, id_estado = $9, descripcion = $10, imagen = $11 WHERE id_publicacion = $12 RETURNING*;"
    const values = [titulo, precio, id_marca, id_modelo, year, kilometraje, id_transmision, id_categoria, id_estado, descripcion, imagen, id_publicacion]
    const { rows, rowCount } = await pool.query(consulta, values)
    if (!rowCount) {
        return { message: "No se encontró la publicación, o no se pudo actualizar la publicacion", code: 404 }
    }
    return rows
}

const actualizarPerfil = async (email, foto, telefono, password, id_usuario) => {
    const consulta = "UPDATE usuarios SET email = $1, foto = $2, telefono = $3, password = $4 WHERE id_usuario = $5 RETURNING *;"
    const values = [email, foto, telefono, bcrypt.hashSync(password), id_usuario]
    const respuesta = await pool.query(consulta, values)
    return respuesta
}

// ruta DELETE /mis-publicaciones
const verificacionDePublicacion = async (id_publicacion) => {
    const consulta = "SELECT id_usuario FROM publicaciones WHERE id_publicacion = $1"
    const respuesta = await pool.query(consulta, [id_publicacion])
    return respuesta
}

const borrarPublicacion = async (id_publicacion) => {
    const consulta = "DELETE FROM publicaciones WHERE id_publicacion = $1"
    const respuesta = await pool.query(consulta, [id_publicacion])
    return respuesta
}

// ruta DELETE /eliminar-perfil

const verificacionDeUsuario = async (id_usuario) => {
    const consulta = "SELECT * FROM usuarios WHERE id_usuario = $1"
    const respuesta = await pool.query(consulta, [id_usuario])
    return respuesta
}

const borrarCuenta = async (id_usuario) => {
    const consulta = "DELETE FROM usuarios WHERE id_usuario = $1"
    const respuesta = await pool.query(consulta, [id_usuario])
    return respuesta
    
}

module.exports = { verificarUsuario, getDataMisPub, getDataPerfil, postearPub, actualizarPub, actualizarPerfil, verificacionDePublicacion, borrarPublicacion, verificacionDeUsuario, borrarCuenta }
