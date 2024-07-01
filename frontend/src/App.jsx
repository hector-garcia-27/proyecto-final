import React from 'react'
import './App.css'
import AuthProvider from './context/Context'
import { Routes, Route } from 'react-router-dom'
import Inicio from './views/Inicio/Inicio'
import Vehiculos from './views/Vehiculos/Vehiculos.jsx'
import Registro from './views/Registro/Registro'
import Login from './views/Login/Login'
import PublicarAviso from './views/PublicarAviso/PublicarAviso'
import Detalle from './views/Detalle/Detalle'
import EditarPerfil from './views/EditarPerfil/EditarPerfil'
import EditarPublicacion from './views/EditarPublicacion/EditarPublicacion.jsx'
import MisPublicaciones from './views/MisPublicaciones/MisPublicaciones'
import Perfil from './views/Perfil/Perfil'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {

  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/vehiculos' element={<Vehiculos />} />
          <Route path='/registro' element={<Registro />} />
          <Route path='/login' element={<Login />} />
          <Route path='/publicar' element={<PublicarAviso />} />
          <Route path='/detalle/:id_publicacion' element={<Detalle />} />
          <Route path='/editar-perfil' element={<EditarPerfil />} />
          <Route path='/editar-publicacion/:id_publicacion' element={<EditarPublicacion />} />
          <Route path='/mis-publicaciones' element={<MisPublicaciones />} />
          <Route path='/perfil' element={<Perfil />} />
        </Routes>
        <Footer />
      </AuthProvider>
    </div>
  )
}

export default App
