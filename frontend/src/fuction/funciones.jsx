export async function validacionRutaPerfil(token) {
        try {
            const res = await fetch('http://localhost:3000/perfil', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            })
            const data = await res.json()
            return data
        } catch (error) {
            console.log("error")
        }
    }

export async function validarRutaPublicar (token) {
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
        
    }
}