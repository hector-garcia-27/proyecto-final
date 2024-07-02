
export async function validarRutaPublicar(token) {
    try {
        const res = await fetch('http://localhost:3000/publicar', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.log(error)
    }
}

export async function validarRutaPrivada(token, url) {
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        })
        const data = await res.json()
        return data
    } catch (error) {
        return { message: "error al validar ruta", code: 500 }
    }
}

export async function eliminarPublicacion(id_publicacion, id_usuario) {
    try {
        const res = await fetch('http://localhost:3000/mis-publicaciones', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_publicacion, id_usuario })
        })
        return res
    } catch (error) {
        console.log("Error en la peticion DELETE /mis-publicaciones", error)
    }
}

export async function deleteAccount(id_usuario) {
    try {
        const res = await fetch(`http://localhost:3000/eliminar-perfil/${id_usuario}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_usuario })
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.log("Error en la peticion DELETE /eliminar-perfil", error)
    }
}