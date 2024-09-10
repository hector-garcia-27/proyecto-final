import './Inicio.css';
import { endpoint } from '../../assets/config';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../../context/Context';
import { validarRutaPrivada } from '../../fuction/funciones';

function Inicio() {

    const { login, logout } = useContext(AuthContext)
    const token = sessionStorage.getItem('token')
    const url = `${endpoint}/compartida`

    useEffect(() => {
        const permisos = async (token, url) => {
            try {
                const res = await validarRutaPrivada(token, url)
                if (res.code === 401 || res.code === 500) {
                    logout()
                }
                if (res.code === 200) {
                    login()
                }
            } catch (error) {
                console.log(error)
            }
        }
        permisos(token, url)
    }, [])

    return (

        <div className='containerInicio'>
            <h1 className='bienvenida'>Bienvenido a Austral Autos</h1>
            <div className="imagen">
                <h4 className='sub-bienvenida'>Compra y vende vehículos nuevos y usados con confianza. ¡Explora nuestro inventario o vende tu auto hoy mismo!</h4>
            </div>
        </div>
    )
}

export default Inicio