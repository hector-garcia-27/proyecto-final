import React, { useContext, useEffect, useState } from 'react';
import { opciones } from "../../../public/opciones";
import { AuthContext } from '../../context/Context'
import { validarRutaPublicar } from '../../fuction/funciones'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './PublicarAviso.css';
import { endpoint } from '../../assets/config';

function PublicarAviso() {
  const navigate = useNavigate()
  const { getDataModelos, modelos, getDataTransmision, transmisiones, getDataEstado, estados, getDataMarca, marcas, getDataCategoria, categorias, logout, login } = useContext(AuthContext)

  const token = sessionStorage.getItem('token')
  useEffect(() => {
    login()
    const permisos = async () => {
      const data = await validarRutaPublicar(token)
      setVehiculo({ ...vehiculo, "id_usuario": data.usuario.id_usuario })
      if (data.code === 401) {
        Swal.fire({
          icon: 'error',
          title: 'No está registrado',
          text: 'Por favor, inicie sesión para continuar.',
          confirmButtonColor: '#76ABAE',
        }).then(() => {
          navigate('/login')
          logout()
        });
      }
    }
    permisos()
    getDataTransmision()
    getDataEstado()
    getDataMarca()
    getDataCategoria()
  }, [])

  const [vehiculo, setVehiculo] = useState({});
  const [error, setError] = useState("")

  const cambioDeMarca = (event) => {
    const { name, value } = event.target;
    setVehiculo({ ...vehiculo, [name]: value })
    getModeloPorMarca(value)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVehiculo({ ...vehiculo, [name]: value });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setVehiculo({ ...vehiculo, imagen: URL.createObjectURL(file) });
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    peticionPublicarPost()
    setVehiculo({})
  };

  const peticionPublicarPost = async () => {
    try {
      const res = await fetch(`${endpoint}/publicar`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(vehiculo)
      })

      if (res.status === 400) {
        setError("Faltan datos en la solicitud");
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: 'Datos incompletos',
          text: 'Por favor, complete todos los campos.',
          confirmButtonColor: '#76ABAE',
        });
      } else if (res.status === 500) {
        setError("Error de conexión con el servidor")
        Swal.fire({
          icon: 'error',
          iconColor: 'red',
          title: 'Error del servidor',
          text: 'No se pudo conectar con el servidor. Inténtelo más tarde.',
          confirmButtonColor: '#76ABAE',
        });
      } else if (res.status === 200) {
        setError("");
        Swal.fire({
          icon: 'success',
          iconColor: 'green',
          title: 'Publicación exitosa',
          text: 'La publicación se realizó correctamente.',
          confirmButtonColor: '#76ABAE',
        }).then(() => {
          navigate('/mis-publicaciones')
        });
      }
    } catch (error) {
      console.log(error)
      setError("Error de conexión con el servidor")
      Swal.fire({
        icon: 'error',
        title: 'Error de conexión',
        text: 'No se pudo conectar con el servidor. Inténtelo más tarde.',
        confirmButtonColor: '#76ABAE',
      });
    }
  }

  const getModeloPorMarca = (id) => {
    getDataModelos(id)
  };

  return (
    <div className="container-publicar-aviso">
      <h1 className='titulo-publicar-aviso'>Información de tu aviso</h1>
      <form onSubmit={handleSubmit} className="formulario-publicar">
        <label className="label-publicar-aviso">
          Título
          <input className='input-publicar-aviso'
            type="text"
            name="titulo"
            value={vehiculo.titulo}
            onChange={handleChange}
            required
          />
        </label>
        <div className="inline-fields">
          <label className="label-publicar-aviso">
            Estado
            <select type="text" name="id_estado" value={vehiculo.id_estado} onChange={handleChange} required >
              <option value="">Seleccione</option>
              {estados?.map((estado, index) =>
                <option value={estado.id_estado} key={index}>{estado.nombre}</option>
              )}
            </select>
          </label>
          <label className="label-publicar-aviso">
            Categoría
            <select className='input-publicar-aviso'
              type="text"
              name="id_categoria"
              value={vehiculo.id_categoria}
              onChange={handleChange}
              required
            >
              <option value="">Categoria</option>
              {categorias?.map((categoria, index) =>
                <option value={categoria.id_categoria} key={index}>{categoria.nombre}</option>
              )}
            </select>
          </label>
        </div>
        <div className="inline-fields">
          <label className="label-publicar-aviso">
            Marca
            <select className='input-publicar-aviso'
              type="text"
              name="id_marca"
              value={vehiculo.id_marca}
              onChange={cambioDeMarca}
              required
            >
              <option value="">Marca</option>
              {marcas?.map((marca, index) =>
                <option value={marca.id_marca} key={index}>{marca.nombre}</option>
              )}
            </select>
          </label>
          <label className="label-publicar-aviso">
            Modelo
            <select className='input-publicar-aviso'
              type="text"
              name="id_modelo"
              value={vehiculo.id_modelo}
              disabled={!vehiculo.id_marca}
              onChange={handleChange}
              required
            >
              <option value="">Modelo</option>
              {modelos?.map((modelo, index) =>
                <option value={modelo.id_modelo} key={index}>{modelo.nombre}</option>
              )}
            </select>
          </label>
        </div>
        <div className="inline-fields">
          <label className="label-publicar-aviso">
            Año
            <select className='input-publicar-aviso'
              type="number"
              name="year"
              value={vehiculo.año}
              onChange={handleChange}
              required
            >
              <option value="">Año</option>
              {opciones[0].opcionAño?.map((año, index) =>
                <option value={año} key={index}>{año}</option>
              )}
            </select>
          </label>
          <label className="label-publicar-aviso">
            Kilómetros
            <input className='input-publicar-aviso'
              type="text"
              name="kilometraje"
              value={vehiculo.kilometraje}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="inline-fields">
          <label className="label-publicar-aviso">
            Transmisión
            <select className='input-publicar-aviso' type="text" name="id_transmision" value={vehiculo.id_transmision} onChange={handleChange} required>
              <option value="">Transmisión</option>
              {transmisiones?.map((transmision, index) =>
                <option value={transmision.id_transmision} key={index}>{transmision.nombre}</option>
              )}
            </select>
          </label>
          <label className="label-publicar-aviso">
            Precio
            <input className='input-publicar-aviso'
              type="text"
              name="precio"
              value={vehiculo.precio}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <label className="label-publicar-aviso">
          Descripción
          <textarea
            name="descripcion"
            value={vehiculo.descripcion}
            onChange={handleChange}
            required
          />
        </label>
        <label className="label-publicar-aviso">
          Imagen
          <input className='input-publicar-aviso'
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>
        {vehiculo.imagen && <img src={vehiculo.imagen} alt="Vehículo" className="imagen-publicar-aviso" />}

        <div className='btn-publicar'>
          <button type="submit" className="boton-publicar-aviso">Publicar</button>
        </div>
        {error && 
          <div className={`alert alert-error`}>
            {error}
          </div>
        }
      </form>
    </div>
  );
}

export default PublicarAviso;
