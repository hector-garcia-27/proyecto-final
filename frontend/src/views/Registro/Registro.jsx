import './Registro.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Registro() {
  const navigate = useNavigate();
  const regexParaEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.-])[A-Za-z\d$@$!%*?&.-]{8,15}$/;

  const [error, setError] = useState("");
  const [succes, setSucces] = useState("");

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
      if (value.startsWith('+56') && value.length <= 12) {
        setNuevoUsuario({ ...nuevoUsuario, telefono: value });
      } else if (value.startsWith('+56')) {
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
    registrarUsuario();
  };

  const registrarUsuario = async () => {
    try {
      const res = await fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      });
      if (res.status === 501) {
        console.log('Error de la solicitud');
        return alert("El usuario ya está registrado");
      }
      if (res.status === 201) {
        const data = await res.json();
        console.log("Respuesta del servidor: ", data);
        navigate('/login');
      }
      setAprobado(true);
    } catch (error) {
      console.log(error);
    }

    setSucces("");
    if (nuevoUsuario.nombre === "") {
      setError("Ingrese su nombre");
      return;
    } if (nuevoUsuario.apellido === "") {
      setError("Ingrese su apellido");
      return;
    } if (nuevoUsuario.telefono === "") {
      setError("Ingrese su número");
      return;
    } if (nuevoUsuario.email === "") {
      setError("Ingrese su email");
      return;
    } if (!regexParaEmail.test(nuevoUsuario.email)) {
      setError("Ingrese un email válido");
      return;
    } if (nuevoUsuario.password === "") {
      setError("Ingrese su password");
      return;
    } if (!regexPas.test(nuevoUsuario.password)) {
      setError("Ingrese un mínimo de 8 caracteres y un máximo de 15, al menos una letra minúscula, al menos una letra mayúscula, al menos 1 dígito (número), al menos 1 caracter especial, que no existan espacios en blanco.");
      return;
    } if (nuevoUsuario.password !== nuevoUsuario.confirmarpassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    setSucces("Registro exitoso");
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
          {nuevoUsuario.imagen && <img src={nuevoUsuario.imagen} alt="Imagen de perfil" className="imagen-registro" />}
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
          {error.length > 0 && <h3 className="error">{error}</h3>}
          {succes.length > 0 && <h3 className="succes">{succes}</h3>}
        </div>
      </form>
    </div>
  );
}

export default Registro;
