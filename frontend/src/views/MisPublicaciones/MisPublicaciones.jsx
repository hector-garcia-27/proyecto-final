import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Context'
import { validarRutaPrivada } from '../../fuction/funciones';
import { eliminarPublicacion } from '../../fuction/funciones'
import './MisPublicaciones.css';
import { endpoint } from '../../assets/config';
import Swal from 'sweetalert2'; // Importa SweetAlert2

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
            Swal.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error',
                text: 'Usuario no tiene autorización',
                confirmButtonColor: '#76ABAE',
            }).then(() => {
                navigate('/login')
                logout()
            });
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
            Swal.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error',
                text: 'La publicación no se pudo eliminar',
                confirmButtonColor: '#76ABAE',
            });
        } else {
            Swal.fire({
                icon: 'success',
                iconColor: 'green',
                title: 'Éxito',
                text: 'Publicación eliminada',
                confirmButtonColor: '#76ABAE',
            }).then(() => {
                // Actualiza la lista de publicaciones sin recargar la página
                const updatedPublicaciones = publicaciones.filter(pub => pub.id_publicacion !== id_publicacion);
                setPublicaciones(updatedPublicaciones);
            });
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
