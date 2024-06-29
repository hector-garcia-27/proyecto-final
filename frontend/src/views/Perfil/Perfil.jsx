import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import './Perfil.css';
import fotoPerfil from '../../assets/img/vehiculo1.jpg';
import { useNavigate } from 'react-router-dom';
import { validacionRutaPerfil } from '../../fuction/funciones'

function Perfil() {

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    const permisos = async () => {
      const data = await validacionRutaPerfil(token)
      if (data) {
        setUsuario(data[0])
      } else {
        console.log("error al cargar la data")
      }
    }
    permisos()
  }, [])

  const [usuario, setUsuario] = useState({ // con la validacion del token debemos setear en Usuario con los datos correspondientes
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan.perez@example.com',
    telefono: '123-456-7890',
    foto: fotoPerfil
  });

  console.log(usuario)
  const navigate = useNavigate();

  const handleEditar = () => {
    navigate('/editar-perfil');
  };
  const handleEliminar = () => {
    console.log('Eliminar cuenta');
    alert('La cuenta ha sido eliminada exitosamente.');
  };

  return (
    <div className='container'>
      <div className="contenedor-perfil">
        <div className="bienvenida">
          <h1 className='bienvenida'>Bienvenido, {usuario.nombre}!</h1>
        </div>
        <div className="info-usuario">
          <img src={usuario.foto} alt="Foto de perfil" className="foto-perfil" />
          <div className="campos">
            <p><strong>Nombre:</strong> {usuario.nombre}</p>
            <p><strong>Apellido:</strong> {usuario.apellido}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono}</p>
          </div>
        </div>
        <div className="acciones">
          <button className="boton-icono" onClick={handleEditar}>
            <FontAwesomeIcon icon={faEdit} style={{ color: '#FFD43B' }} />
            <p>Editar</p>
          </button>
          <button className="boton-icono" onClick={handleEliminar}>
            <FontAwesomeIcon icon={faTrashAlt} style={{ color: '#e40c0c' }} />
            <p>Eliminar cuenta</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Perfil;
