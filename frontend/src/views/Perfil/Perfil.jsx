import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useContext } from 'react';
import './Perfil.css';
import { useNavigate } from 'react-router-dom';
import { validacionRutaPerfil } from '../../fuction/funciones'
import { AuthContext } from '../../context/Context'

function Perfil() {

  const { login, logout } = useContext(AuthContext)
  const token = sessionStorage.getItem('token')
  useEffect(() => {
    const permisos = async () => {
      const data = await validacionRutaPerfil(token)
      if (data === "Usuario no tiene autorizacion") {
        console.log("data es ", data)
        alert("usuario sin credenciales")
        logout()
        navigate('/login')
      } else {
        setUsuario(data[0])
        login()
      }
    }
    permisos()
  }, [])

  const [usuario, setUsuario] = useState([])// con la validacion del token debemos setear en Usuario con los datos correspondientes);

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
