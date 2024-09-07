import './Registro.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { endpoint } from '../../assets/config';
import Swal from 'sweetalert2';

function Registro() {
  const navigate = useNavigate();
  const regexParaEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.-])[A-Za-z\d$@$!%*?&.-]{8,15}$/;

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    imagen: null,
    password: '',
    confirmarpassword: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === 'nombre' || name === 'apellido') {
      const regexSoloLetras = /^[a-zA-Z\s]*$/;
      if (!regexSoloLetras.test(value)) {
        setError("Solo se permiten letras en los campos de nombre y apellido");
        return;
      }
    }

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
    setNuevoUsuario({ ...nuevoUsuario, foto: URL.createObjectURL(file) });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (nuevoUsuario.nombre === '') {
      setError('Ingrese su nombre');
      return;
    }
    if (nuevoUsuario.apellido === '') {
      setError('Ingrese su apellido');
      return;
    }
    if (nuevoUsuario.telefono === '') {
      setError('Ingrese su número');
      return;
    }
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
        'Ingrese un mínimo de 8 caracteres y un máximo de 15, al menos una letra minúscula, al menos una letra mayúscula, al menos 1 dígito (número), al menos 1 caracter especial, que no existan espacios en blanco.'
      );
      return;
    }
    if (!nuevoUsuario.confirmarpassword) {
      setError('Debe confirmar la contraseña');
      return;
    }
    if (nuevoUsuario.password !== nuevoUsuario.confirmarpassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch(`${endpoint}/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      });
      const { code, message } = await res.json()
      if (code === 501 || code === 500 || code === 400 ) {
        setError(message);
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: 'Error en el registro',
          text: message,
          confirmButtonColor: '#76ABAE',
        });
      } else if (code === 201) {
        setSuccess(message);
        Swal.fire({
          icon: 'success',
          iconColor: 'green',
          title: 'Registro exitoso',
          text: message,
          confirmButtonColor: '#76ABAE',
        }).then(() => {
          navigate('/login');
        });
      }
    } catch (error) {
      console.log(error);
      setError('Error en la conexión con el servidor');
      Swal.fire({
        icon: 'error',
        iconColor: 'red',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Inténtelo más tarde.',
        confirmButtonColor: '#76ABAE',
      });
    }

    setSuccess('');
    console.log('Datos del nuevo usuario:', nuevoUsuario);
  };

  return (
    <div className="contenedor-registro">
      <h1 className="titulo-registro">Registro de usuario</h1>
      <form className='formulario-registro' onSubmit={handleSubmit}>
        <div className="campo-registro">
          <label className='label-registro'>Nombre</label>
          <input
            className='input-registro'
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="campo-registro">
          <label className='label-registro'>Apellido</label>
          <input
            className='input-registro'
            type="text"
            name="apellido"
            value={nuevoUsuario.apellido}
            onChange={handleChange}
          />
        </div>
        <div className="campo-registro codigo-telefono">
          <label className='label-registro'>Telefono</label>
          <div className="codigo-telefono-registro">
            <input
              className='input-registro-codigo'
              name="codigo"
              type='tel'
              value="+56"
              onChange={handleChange}
              disabled
            />
            <input
              className='input-registro input-telefono-registro'
              type="tel"
              name="telefono"
              value={nuevoUsuario.telefono}
              onChange={handleChange}
              title="Debe tener 9 dígitos"
              pattern="[0-9]{9}"
            />
          </div>
        </div>

        <div className="campo-registro">
          <label className='label-registro'>Email</label>
          <input
            className='input-registro'
            type="email"
            name="email"
            value={nuevoUsuario.email}
            onChange={handleChange}
          />
        </div>
        <div className='campo-registro'>
          <label className='label-registro'>Contraseña</label>
          <input
            className='input-registro'
            type="password"
            name='password'
            value={nuevoUsuario.password}
            onChange={handleChange}
          />
        </div>
        <div className='campo-registro'>
          <label className='label-registro'>Confirmar contraseña</label>
          <input
            className='input-registro'
            type="password"
            name='confirmarpassword'
            value={nuevoUsuario.confirmarpassword}
            onChange={handleChange}
          />
        </div>
        <div className="campo-registro">
          <label className='label-registro'>Imagen de perfil</label>
          <input
            className='input-registro'
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {nuevoUsuario.foto && <img src={nuevoUsuario.foto} alt="Imagen de perfil" className="imagen-registro" />}
        </div>
        <div className="boton-registro">
          <button
            className="boton-guardar-registro"
            type="submit"
          >
            Registrarse
          </button>
        </div>
        <div className='mensajeRegistro'>
          {error && <div className="alerta alerta-error">{error}</div>}
          {success && <div className="alerta alerta-exito">{success}</div>}
        </div>
      </form>
    </div>
  );
}

export default Registro;
