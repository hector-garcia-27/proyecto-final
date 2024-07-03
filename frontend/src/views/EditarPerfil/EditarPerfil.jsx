import './EditarPerfil.css'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/Context';
import { validarRutaPrivada } from '../../fuction/funciones';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { endpoint } from '../../assets/config';

function EditarPerfil() {

  const { login, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const regexParaEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.-])[A-Za-z\d$@$!%*?&.-]{8,15}$/;
  const token = sessionStorage.getItem('token')
  const url = `${endpoint}/editar-perfil`

  useEffect(() => {
    permisos()
  }, [])

  const permisos = async () => {
    try {
      const data = await validarRutaPrivada(token, url)
      setNuevoUsuario(data.usuario)

      if (data.code === 401 || data.code === 500) {
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: 'Error de autorización',
          text: 'Usuario no tiene autorización',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#76ABAE',
        }).then(() => {
          logout()
          navigate('/login')
        });
        return
      }
      if (data.code === 200) {
        login()
      }
    } catch (error) {
      console.log('Error al validar permisos:', error);
      Swal.fire({
        icon: 'error',
        iconColor: 'red',
        title: 'Error',
        text: 'Error al validar permisos',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#76ABAE',
      }).then(() => {
        logout()
        navigate('/login')
      });
    }
  };

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [nuevoUsuario, setNuevoUsuario] = useState({});

  const id_usuario = nuevoUsuario.id_usuario

  const editarPerfil = async () => {
    try {
      const res = await fetch(`${endpoint}/editar-perfil/${id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      })
      const data = await res.json()
      console.log(data)
      if(data.code === 400 || data.code === 500){
        setError(data.message)
      }
      if(data.code === 200){
        Swal.fire({
          icon: 'success',
          confirmButtonText: 'Ok',
          confirmButtonColor: '#76ABAE',
          title: `${nuevoUsuario.nombre}, tus datos han sido actualizados`
        }).then(() => {
          navigate('/perfil')
        });
      }
      
    } catch (error) {
      console.log("Error de respuesta del servidor",error)
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'telefono') {
      if (value.startsWith('')) {
        if (value.length <= 9) {
          setNuevoUsuario({ ...nuevoUsuario, telefono: value });
        }
      } else if (value.startsWith('')) {
        setNuevoUsuario({ ...nuevoUsuario, telefono: '' });
      }
    } else {
      setNuevoUsuario({ ...nuevoUsuario, [name]: value });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setNuevoUsuario({ ...nuevoUsuario, imagen: URL.createObjectURL(file) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (nuevoUsuario.email === '') {
      setError('Ingrese su email');
      return;
    }
    if (!regexParaEmail.test(nuevoUsuario.email)) {
      setError('Ingrese un email válido');
      return;
    }
    if (nuevoUsuario.password === '') {
      setError('Ingrese su contraseña');
      return;
    }
    if (!regexPas.test(nuevoUsuario.password)) {
      setError(
        'La contraseña debe tener entre 8 y 15 caracteres, al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'
      );
      return;
    }
    if (!nuevoUsuario.confirmarContraseña) {
      setError('Debe confirmar la contraseña');
      return;
    }
    if (nuevoUsuario.password !== nuevoUsuario.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setError('')
    editarPerfil()
  };

  return (
    <div className='contenedor-editar-perfil'>
      <h1 className='titulo-editar-perfil'>Edita tu perfil</h1>
      <form className='formulario-editar-perfil' onSubmit={handleSubmit}>
        <div className='campo-editar'>
          <label className='label-editar'>Nombre</label>
          <input
            className='input-editar'
            type='text'
            name='nombre'
            value={nuevoUsuario.nombre}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className='campo-editar'>
          <label className='label-editar'>Apellido</label>
          <input
            className='input-editar'
            type='text'
            name='apellido'
            value={nuevoUsuario.apellido}
            onChange={handleChange}
            disabled
          />
        </div>

        <div className='campo-editar'>
          <label className='label-editar'>Telefono</label>
          <div className='codigo-telefono-container'>
            <input
              className='input-codigo-telefono'
              name='codigo'
              type='tel'
              value='+56'
              onChange={handleChange}
              disabled
            />
            <input
              className='input-editar input-telefono'
              type='tel'
              name='telefono'
              value={nuevoUsuario.telefono}
              onChange={handleChange}
              title='Debe tener 9 dígitos'
              pattern='[0-9]{9}'
            />
          </div>
        </div>

        <div className='campo-editar'>
          <label className='label-editar'>Email</label>
          <input
            className='input-editar'
            type='email'
            name='email'
            value={nuevoUsuario.email}
            onChange={handleChange}
          />
        </div>

        <div className='campo-editar'>
          <label className='label-editar'> Contraseña</label>
          <input
            className='input-editar'
            type='password'
            name='password'
            value={nuevoUsuario.contraseña}
            onChange={handleChange}
          />
        </div>

        <div className='campo-editar'>
          <label className='label-editar'>Confirmar contraseña</label>
          <input
            className='input-editar'
            type='password'
            name='confirmarContraseña'
            value={nuevoUsuario.confirmarContraseña}
            onChange={handleChange}
          />
        </div>

        <div className='campo-editar'>
          <label className='label-editar'>Imagen de perfil</label>
          <input
            className='input-editar'
            type='file'
            accept='image/*'
            onChange={handleImageChange}
          />
          {nuevoUsuario.foto && (
            <img src={nuevoUsuario.foto} alt='Imagen de perfil' className='imagen-editar' />
          )}
        </div>
        <div className='boton-editar-perfil'>
          <button className='boton-guardar-editar' type='submit'>
            Actualizar
          </button>
        </div>
        <div className='mensajeEditar'>
          {error.length > 0 && <h3 className='alerta alerta-error'>{error}</h3>}
          {success.length > 0 && <h3 className='alerta alerta-exito'>{success}</h3>}
        </div>
      </form>
    </div>
  );
}

export default EditarPerfil;
