import './Registro.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Registro() {

  const navigate = useNavigate()
  //Expresión regular para validar que el campo de email contenga el formato adecuado
  const regexParaEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

  //Expresión regular para validar el campo de password solicita un mínimo de 8 caracteres y un máximo de 15 , al menos una letra minúscula, al menos una letra mayúscula, al menos 1 dígito (número), al menos 1 caracter especial, que no existan espacios en blanco y al menos 1 símbolo para más seguridad fuente https://es.stackoverflow.com/questions/4300/expresiones-regulares-para-contrase%C3%B1a-en-base-a-una-politica.
  const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.-])[A-Za-z\d$@$!%*?&.-]{8,15}$/;

  const [error, setError] = useState("")
  const [succes, setSucces] = useState("")

  //falta hacer las validaciones con regex para email y password
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    imagen: null,
    password: '',
    confirmarpassword: ''
  })

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
    setNuevoUsuario({ ...nuevoUsuario, imagen: URL.createObjectURL(file) });
  };

  const [aprobado, setAprobado] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault();
    registrarUsuario()
  }

  const registrarUsuario = async () => {
    try {
      const res = await fetch('http://localhost:3000/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario)
      })
      if(res.status === 501){
        console.log('Error de la solicitud')
        return alert("el usuario ya esta registrado")
      }
      if(res.status === 201 ){
        const data = await res.json()
        console.log("respuesta del server: ", data)
        navigate('/login')
      }
      setAprobado(true)
    } catch (error) {
      console.log(error)
    }



    //Se elimina el mensaje de succes
    setSucces("")

    // Se validan los input
    if (nuevoUsuario.nombre === "") {
      setError("Ingrese su nombre")
      return
    } if (nuevoUsuario.apellido === "") {
      setError("Ingrese su apellido")
      return
    } if (nuevoUsuario.telefono === "") {
      setError("Ingrese su numero")
      return
    } if (nuevoUsuario.email === "") {
      setError("Ingrese su email")
      return
    } if (!regexParaEmail.test(nuevoUsuario.email)) {
      setError("Ingrese un email válido")
      return
    } if (nuevoUsuario.password === "") {
      setError("Ingrese su password")
      return
    } if (!regexPas.test(nuevoUsuario.password)) {
      setError("Ingrese un mínimo de 8 caracteres y un máximo de 15 , al menos una letra minúscula, al menos una letra mayúscula, al menos 1 dígito (número), al menos 1 caracter especial, que no existan espacios en blanco.")
      return
    } if (nuevoUsuario.password !== nuevoUsuario.confirmarpassword) {
      setError("Las passwords no coinciden")
      return
    }
    //Se elimina el mensaje de error
    setError("")
    setSucces("Registro exitoso")

    //console.log('Datos del nuevo usuario:', nuevoUsuario);
  }



  return (
    <div className="contenedor-registro">
      <h1 className="titulo-registro">Registro de usuario</h1>
      <form className='formulario-registro' onSubmit={handleSubmit}>
        <div className="campo-registro">
          <label className='label-registro'>Nombre</label>
          <input className='input-registro'
            type="text"
            name="nombre"
            value={nuevoUsuario.nombre}
            onChange={handleChange}

          />
        </div>
        <div className="campo-registro">
          <label className='label-registro'>Apellido</label>
          <input className='input-registro'
            type="text"
            name="apellido"
            value={nuevoUsuario.apellido}
            onChange={handleChange}

          />
        </div>
        <div className="campo-registro">
          <label className='label-registro'>codigo</label>
          <input className='input-registro'
            name="codigo"
            type='text'
            value="+56"
            onChange={handleChange}
            disabled
          />
        </div>

        <div className="campo-registro">
          <label className='label-registro'>Teléfono</label>
          <input className='input-registro'
            type="tel"
            name="telefono"
            value={nuevoUsuario.telefono}
            onChange={handleChange}
            title="Debe tener 9 dígitos"
            pattern="[0-9]{9}"

          />
        </div>
        <div className="campo-registro">
          <label className='label-registro'>Email</label>
          <input className='input-registro'
            type="email"
            name="email"
            value={nuevoUsuario.email}
            onChange={handleChange}

          />
        </div>



        <div className='campo-registro'>
          <label className='label-registro'> password</label>
          <input className='input-registro'
            type="password"
            name='password'
            value={nuevoUsuario.password}
            onChange={handleChange}

          />


        </div>

        <div className='campo-registro'>
          <label className='label-registro'>Confirmar password</label>
          <input className='input-registro'
            type="password"
            name='confirmarpassword'
            value={nuevoUsuario.confirmarpassword}
            onChange={handleChange}

          />

        </div>

        <div className="campo-registro">
          <label className='label-registro'>Imagen de perfil</label>
          <input className='input-registro'
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {nuevoUsuario.foto && <img src={nuevoUsuario.foto} alt="Imagen de perfil" className="imagen-registro" />}
        </div>
        <div className="boton-registro">
          <button className="boton-guardar-registro"
            type="submit"> Registrarse
          </button>
        </div>
        <div className='mensajeRegistro'>
          {error.length > 0 && <h3 className="error">{error}</h3>}
          {succes.length > 0 && <h3 className="succes">{succes}</h3>}
        </div>



      </form>
    </div>
  )



}

export default Registro