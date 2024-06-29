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
            console.log(data)
            return data
        } catch (error) {
            console.log("error")
        }
    }

