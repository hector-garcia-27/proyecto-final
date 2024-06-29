import './Login.css'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/Context'

function Login() {

    //Expresión regular para validar que el campo de email contenga el formato adecuado
    const regexParaEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    //Expresión regular para validar el campo de password solicita un mínimo de 8 caracteres y un máximo de 15 , al menos una letra minúscula, al menos una letra mayúscula, al menos 1 dígito (número), al menos 1 caracter especial, que no existan espacios en blanco y al menos 1 símbolo para más seguridad fuente https://es.stackoverflow.com/questions/4300/expresiones-regulares-para-contrase%C3%B1a-en-base-a-una-politica.
    const regexPas = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&.-])[A-Za-z\d$@$!%*?&.-]{8,15}$/;

    const [email, setEmail] = useState("")
    const [password, setpassword] = useState("")
    const [error, setError] = useState("")
    const [succes, setSucces] = useState("")

    const { login } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogin = () => {
        login()
        
    }
    const handleSubmit = (event) => {
        event.preventDefault();

        //Se elimina el mensaje de succes
        setSucces("")

        // Se validan los input
        if (email === "") {
            setError("Ingrese su email")
            return
        } if (!regexParaEmail.test(email)) {
            setError("Email no cumple con un formato válido")
            return
        } if (password === "") {
            setError("Ingrese su password")
            return
        } if (!regexPas.test(password)) {
            setError("Formato de contraseña no cumple con los requisitos")
            return
        }
        //Se elimina el mensaje de error
        setError("")
        peticionLoginPost()
    }

    const peticionLoginPost = async () => {
        try {
            const res = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
            if (res.status === 404) {
                setError("El usuario no existe")
            }
            if (res.status === 401){
                setError("La contraseña es incorrecta")
            }
            if (res.status === 200) {
                const { token } = await res.json()
                sessionStorage.setItem('token', token);
                setSucces("Registro exitoso")
                navigate('/')
                handleLogin()
            }

        } catch (error) {
            // falta el error
        }

    }

    return (
        <div className='container-1'>
            <form className='formLogin' onSubmit={handleSubmit}>
                <div className="login-container">
                    <h1>Iniciar Sesión</h1>
                    <div className="login-inputs">
                        <input type="email" name='email' placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" name='password' placeholder="password" value={password} onChange={(e) => setpassword(e.target.value)} />
                    </div>
                    <button className='botonLogin' type='submit'>Ingresar</button>
                    <div className="register-link">
                        <p>¿Aún no tienes cuenta?</p>
                        <NavLink to="/registro">Regístrate</NavLink>
                    </div>
                    <div className='mensajeRegistro'>
                        {error.length > 0 && <h3 className="error">{error}</h3>}
                        {succes.length > 0 && <h3 className="succes">{succes}</h3>}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login
