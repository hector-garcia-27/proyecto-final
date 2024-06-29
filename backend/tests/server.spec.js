const request = require("supertest")
const server = require("../index")

function numAzar() {
    return Math.floor(Math.random() * 99999) + 100
}

describe("Operaciones CRUD rutas AustralAuto", () => {
    // ruta get
    it("Obteniendo statusCode 200 de /vehiculos", async () => {
        const { statusCode } = await request(server).get('/vehiculos').send()
        expect(statusCode).toBe(200) // la tabla publicaciones debe tener al menos un dato
    })
    it("Obteniendo statusCode 204 de /vehiculos", async () => {
        const { statusCode } = await request(server).get('/vehiculos').send()
        expect(statusCode).toBe(204) // la tabla publicaciones debe estar vacia
    })

    // ruta post
    it("Obteniendo statusCode 201 de registro", async () => {
        const numero = numAzar()
        const user = {
            "nombre": "Prueba",
            "apellido": "Test",
            "email": `test${numero}@gmail.com`, // cada que se corra el test se debe cambiar el email, ya que en la BD esta configurado como UNIQUE
            "password": "1111"
        }
        const { statusCode, body } = await request(server).post("/registro").send(user)
        expect(statusCode).toBe(201)
        expect(body).toBeInstanceOf(Object)
    })
    it("Obteniendo statusCode 400 de registro", async () => {
        const user2 = { //enviando variables incompletas falta el email
            "nombre": "Hector",
            "apellido": "Garcia",
            "password": "1111"
        }
        const { statusCode } = await request(server).post("/registro").send(user2)
        expect(statusCode).toBe(400)
    })

    // ruta put
    it("Obteniendo statusCode 200 de Actualizar-perfil", async () => {
        const id_usuario = 52 //el id debe existir en la tabla usuarios de la base de datos
        const userEditdo = {
            "nombre": "Prueba PUT",
            "apellido": "Garcia",
            "email": `prueba1@gmail.com`, // el email debe ser diferente de cualquiera de la base de datos (restriccion UNIQUE)
            "password": "2222"
        }
        const {statusCode} = await request(server).put(`/editar-perfil/${id_usuario}`).send(userEditdo)
        expect(statusCode).toBe(200)
    })
    it("Obteniendo statusCode 400 de Actualizar-perfil", async () => {
        const id_usuario = numAzar() //el id no debe existir en la tabla usuarios de la base de datos
        const userEditdo = {
            "nombre": "Prueba PUT",
            "apellido": "Garcia",
            "email": `prueba1@gmail.com`, // el email debe ser diferente de cualquiera de la base de datos (restriccion UNIQUE)
            "password": "2222"
        }
        const {statusCode} = await request(server).put(`/editar-perfil/${id_usuario}`).send(userEditdo)
        expect(statusCode).toBe(400)
    })

    // ruta delete
    it("Obteniendo statusCode 200 de eliminar-perfil/:id_usuario", async ()=>{
        const id_usuario =  36 // el id_usuario debe existir en la base de datos (inserte un ID que exista)
        const {statusCode} = await request(server).delete(`/eliminar-perfil/${id_usuario}`).send()
        expect(statusCode).toBe(200)
    })
    it("Obteniendo statusCode 404 de eliminar-perfil/:id_usuario", async ()=>{
        const id_usuario =  numAzar() // el id_usuario no debe existir en la bae de datos
        const {statusCode} = await request(server).delete(`/eliminar-perfil/${id_usuario}`).send()
        expect(statusCode).toBe(404)
    })
})