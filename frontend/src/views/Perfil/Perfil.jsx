import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect, useContext } from 'react';
import './Perfil.css';
import { useNavigate } from 'react-router-dom';
import { validarRutaPrivada, deleteAccount } from '../../fuction/funciones'
import { AuthContext } from '../../context/Context'
import { endpoint } from '../../assets/config';
import Swal from 'sweetalert2'; // Importar SweetAlert2

function Perfil() {

  const { login, logout } = useContext(AuthContext)
  const token = sessionStorage.getItem('token')
  const url = `${endpoint}/perfil`
  const navigate = useNavigate();
  
  useEffect(() => {
    const permisos = async () => {
      const data = await validarRutaPrivada(token, url)
      if (data.code === 401 || data.code === 500) {
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: 'Error de autenticación',
          text: 'Usuario sin credenciales',
          confirmButtonColor: '#76ABAE',
        }).then(() => {
          logout()
          navigate('/login')
        });
        return
      }
      if (data.code === 200) {
        setUsuario(data.dataPerfil)
        login()
      }
    }
    permisos()
  }, [])

  const [usuario, setUsuario] = useState([])// con la validacion del token debemos setear en Usuario con los datos correspondientes);
  

  const handleEditar = () => {
    navigate('/editar-perfil');
  };
  const handleEliminar = async () => {
    const id_usuario = usuario.id_usuario
    const data = await deleteAccount(id_usuario)
    console.log(data)
    if (data.code === 404 || data.code === 501 || data.code === 500) {
      Swal.fire({
        icon: 'error',
        iconColor: 'red',
        title: 'Error',
        text: data.message,
        confirmButtonColor: '#76ABAE',
      });
    } else if (data.code === 200) {
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: data.message,
        confirmButtonColor: '#76ABAE',
      }).then(() => {
        logout()
        navigate('/')
      });
    }
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
