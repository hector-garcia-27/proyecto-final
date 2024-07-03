import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Context'
import { validarRutaPrivada } from '../../fuction/funciones';
import { eliminarPublicacion } from '../../fuction/funciones'
import './MisPublicaciones.css';
import { endpoint } from '../../assets/config';

function MisPublicaciones() {
    const [usuarioActual, setUsuarioActual] = useState(null)
    const navigate = useNavigate();
    const [publicaciones, setPublicaciones] = useState([]);
    const { login, logout } = useContext(AuthContext)
    const [sinPub, setSinPub] = useState(false)
    // logica para validacion de ruta privada
    const token = sessionStorage.getItem('token')
    const url = `${endpoint}/mis-publicaciones`

    const permisos = async () => {
        const data = await validarRutaPrivada(token, url)
        if (data.code === 500) {
            setSinPub(true)
        }else if (data.code === 401) {
            alert("Usuario no tiene autorización")
            navigate('/login')
            logout()
        } else if (data.dataMisPub.rowCount) {
            setPublicaciones(data.dataMisPub.rows)
            setUsuarioActual(data.usuario.id_usuario)
        }
    }

    useEffect(() => {
        login()
        permisos()
    }, []);

    const handleVerDetalle = (idPublicacion) => {
        navigate(`/detalle/${idPublicacion}`, { state: { usuarioActual } });
    };

    const handleEditar = (idPublicacion) => {
        navigate(`/editar-publicacion/${idPublicacion}`);
    };

    const handleEliminar = async (id_publicacion) => {
        const eliminar = await eliminarPublicacion(id_publicacion, usuarioActual)

        if (!eliminar.ok) {
            return alert("La publicacion no se pudo eliminar")
        }
        if (eliminar.ok) {
            alert("Publicacion eliminada")
            window.location.reload();
            return
        }
    };
    if (!sinPub) {
        return (
            <div className="mis-publicaciones-container">
                <h1 className="mis-publicaciones-title">Mis Publicaciones</h1>
                <div className="publicaciones-grid">
                    {publicaciones?.map((publicacion) => (
                        <div key={publicacion.id_publicacion} className="publicacion-card">
                            <img src={publicacion.imagen} alt={publicacion.titulo} />
                            <h2 className="publicacion-title">{publicacion.titulo}</h2>
                            <div className="botones-container">
                                <button className='boton-MisPublicaciones' onClick={() => handleVerDetalle(publicacion.id_publicacion)}>Detalle</button>
                                <button className='boton-MisPublicaciones' onClick={() => handleEditar(publicacion.id_publicacion)}>Editar</button>
                                <button className='boton-MisPublicaciones' onClick={() => handleEliminar(publicacion.id_publicacion)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    } else {
        return (
            <div className="mis-publicaciones-container">
                <h1 className="mis-publicaciones-title">Mis Publicaciones</h1>
                <div className="publicaciones-grid">
                    <div>El usuario no tiene publicaciones realizadas</div>
                </div>
            </div>
        );
    }
}

export default MisPublicaciones;
