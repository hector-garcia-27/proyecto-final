const request = require("supertest")
const server = require("../index")

describe("Operaciones CRUD rutas AustralAuto", () => {
    // ruta get
    it("Obteniendo statusCode 200 de vehiculos", async () => {
        const { statusCode } = await request(server).get('/vehiculos').send()
        expect(statusCode).toBe(200)
    })

    // ruta post
    it("Obteniendo statusCode 201 de registro", async () => {
        const user = {
            "nombre": "Hector",
            "apellido": "Garcia",
            "email": `pruebaTest@gmail.com`, // cada que se corra el test se debe cambiar el email, ya que en la BD esta configurado como UNIQUE
            "password": "1111"
        }
        const { statusCode, body } = await request(server).post("/registro").send(user)
        expect(statusCode).toBe(201)
        expect(body).toBeInstanceOf(Object)
    })

    // ruta put
    it("Obteniendo statusCode 200 de Actualizar-perfil", async () => {
        const id_usuario = 36 //el id debe existir en la tabla usuarios de la base de datos
        const userEditdo = {
            "nombre": "Prueba PUT",
            "apellido": "Garcia",
            "email": `prueba1@gmail.com`, // el email debe ser diferente de cualquiera de la base de datos (restriccion UNIQUE)
            "password": "2222"
        }
        const {statusCode} = await request(server).put(`/editar-perfil/${id_usuario}`).send(userEditdo)
        expect(statusCode).toBe(200)
    })

    it("Obteniendo statusCode 200 de eliminar-perfil", async ()=>{
        const id_usuario =  43 // el id_usuario debe existir en la bae de datos
        const {statusCode} = await request(server).delete(`/eliminar-perfil/${id_usuario}`).send()
        expect(statusCode).toBe(200)
    })
})