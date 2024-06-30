import React, { useContext, useEffect, useState } from 'react';
import { opciones } from "../../../public/opciones";
import { AuthContext } from '../../context/Context'
import { validarRutaPublicar } from '../../fuction/funciones'
import { useNavigate } from 'react-router-dom';
import './PublicarAviso.css';

const formatNumber = (num) => {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};


function PublicarAviso() {
  const navigate = useNavigate()


  const { getDataModelos, modelos, getDataTransmision, transmisiones, getDataEstado, estados, getDataMarca, marcas, getDataCategoria, categorias, logout } = useContext(AuthContext)


  const token = sessionStorage.getItem('token')
  useEffect(() => {
    const permisos = async () => {
      const data = await validarRutaPublicar(token)
      if (data.code === 401) {
        navigate('/login')
        logout()
        return
      }
    }
    permisos()
    getDataTransmision()
    getDataEstado()
    getDataMarca()
    getDataCategoria()

  }, [])

  const [vehiculo, setVehiculo] = useState({
    titulo: '',
    precio: '',
    estado: '',
    marca: '',
    modelo: '',
    año: '',
    kilometros: '',
    transmision: '',
    categoria: '',
    descripcion: '',
    imagen: null
  });

  const cambioDeMarca = (event) => {
    const { name, value } = event.target;
    setVehiculo({ ...vehiculo, [name]: value })
    getModeloPorMarca(value)
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Si el campo es 'precio', elimina los puntos para que se pueda formatear correctamente
    if (name === 'precio' || name === 'kilometros') {
      const rawValue = value.replace(/\./g, '');
      if (!isNaN(Number(rawValue))) {
        setVehiculo({ ...vehiculo, [name]: formatNumber(rawValue) });
      }
    } else {
      setVehiculo({ ...vehiculo, [name]: value });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setVehiculo({ ...vehiculo, imagen: URL.createObjectURL(file) });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación adicional para el campo "estado"
    if (vehiculo.estado === '') {
      alert('Por favor, selecciona el estado del vehículo (Nuevo o Usado).');
      return;
    }

    console.log('Datos del vehículo:', vehiculo);
    alert('Datos enviados exitosamente. Revisa la consola para ver los datos.');
  };

  // falta dejar mapeados los select ya que los datos se deben seleccionar 
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
        </label >
        <div className="inline-fields">

          <label className="label-publicar-aviso">
            Estado
            <select type="text" name="estado" value={vehiculo.estado} onChange={handleChange} required >
              <option value="">Seleccione</option>
              {estados?.map((estado, index) =>
                <option value={estado.id_estado} key={index}>{estado.nombre}</option>
              )}
            </select>
          </label >

          <label className="label-publicar-aviso">
            Categoría
            <select className='input-publicar-aviso'
              type="text"
              name="categoria"
              value={vehiculo.categoria}
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
              name="marca"
              value={vehiculo.marca}
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
              name="modelo"
              value={vehiculo.modelo}
              disabled={!vehiculo.marca}
              onChange={handleChange}
              required
            >
              <option value="">Modelo</option>
              {modelos.map((modelo, index) =>
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
              name="año"
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
              name="kilometros"
              value={vehiculo.kilometros}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div className="inline-fields">
          <label className="label-publicar-aviso">
            Transmisión
            <select className='input-publicar-aviso' type="text" name="transmision" value={vehiculo.transmision} onChange={handleChange} required>
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
            required
          />
        </label>
        {vehiculo.imagen && <img src={vehiculo.imagen} alt="Vehículo" className="imagen-publicar-aviso" />}
      </form >

      <div className='btn-publicar'>
        <button type="submit" className="boton-publicar-aviso">Publicar</button>
      </div>
    </div >

  );
}

export default PublicarAviso;
