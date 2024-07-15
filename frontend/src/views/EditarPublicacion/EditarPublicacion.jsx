import './EditarPublicacion.css'
import { useState, useEffect, useContext } from "react"
import { AuthContext } from '../../context/Context'
import { opciones } from "../../../public/opciones"; // de aca nos estamos trayendo las opciones que deberian estar en la base de datos, para poder mapear las opciones disponibles
import { useParams, useNavigate } from 'react-router-dom';
import { validarRutaPrivada } from '../../fuction/funciones';
import { endpoint } from '../../assets/config';
import Swal from 'sweetalert2';

function EditarPublicacion() {

    const navigate = useNavigate();
    const { getDataModelos, modelos, getDataTransmision, transmisiones, getDataEstado, estados, getDataMarca, marcas, getDataCategoria, categorias, logout, login } = useContext(AuthContext)
    const { id_publicacion } = useParams();
    const vNull = {
        titulo: '',
        precio: '',
        id_estado: '',
        id_marca: '',
        id_modelo: '',
        year: '',
        kilometraje: '',
        id_transmision: '',
        id_categoria: '',
        descripcion: '',
        imagen: '',
    }
    const [vehiculoEditado, setVehiculoEditado] = useState(vNull);
    const token = sessionStorage.getItem('token')
    const url = `${endpoint}/editar-publicacion`

    const permisos = async () => {
        const data = await validarRutaPrivada(token, url)
        if (data.code === 401) {
            Swal.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Usuario sin autorización',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#76ABAE',

            }).then(() => {
                navigate('/login')
                logout()
            });
        } else {
            login()
            console.log(`usuario ${data.usuario.nombre} autorizado`)
        }
    }

    useEffect(() => {
        permisos()
        getDataTransmision()
        getDataEstado()
        getDataMarca()
        getDataCategoria()
    }, [])

    //peticion PUT a la api
    const editarPublicacion = async () => {
        try {
            const res = await fetch(`${endpoint}/editar-publicacion/${id_publicacion}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(vehiculoEditado)
            })
            if (res.ok) {
                Swal.fire({
                    icon: 'success',
                    iconColor: 'green',
                    title: 'Publicación actualizada con éxito',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#76ABAE',
                }).then(() => {
                    navigate(`/mis-publicaciones`)
                });
            } else {
                setVehiculoEditado(vNull)
                Swal.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'No se pudo actualizar la Publicación',
                    confirmButtonText: 'Ok',
                    confirmButtonColor: '#76ABAE',
                });
            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                iconColor: 'red',
                title: 'Error al intentar actualizar la Publicación',
                confirmButtonText: 'Ok',
                confirmButtonColor: '#76ABAE',
            });
        }
    }

    const cambioDeMarca = (event) => {
        const { name, value } = event.target;
        setVehiculoEditado({ ...vehiculoEditado, [name]: value });
        getModeloPorMarca(value)
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setVehiculoEditado({ ...vehiculoEditado, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setVehiculoEditado({ ...vehiculoEditado, imagen: URL.createObjectURL(file) });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        editarPublicacion()


    };

    const getModeloPorMarca = (id_marca) => {
        getDataModelos(id_marca)
    };

    return (
        <div className="container-edit-publicacion">
            <h1 className="title-edit-publicacion">Editar información de tu aviso</h1>

            <form onSubmit={handleSubmit} className="form-vehiculo">
                <label>
                    Título
                    <input
                        type="text"
                        name="titulo"
                        value={vehiculoEditado.titulo}
                        onChange={handleChange}
                        required
                    />
                </label>
                <div className="inline-fields">

                    <label>
                        Estado
                        <select
                            name="id_estado"
                            value={vehiculoEditado.id_estado}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Estado</option>
                            {estados?.map((estado, index) =>
                                <option value={estado.id_estado} key={index} >{estado.nombre}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Categoría
                        <select
                            name="id_categoria"
                            value={vehiculoEditado.id_categoria}
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
                    <label>
                        Marca
                        <select
                            name="id_marca"
                            value={vehiculoEditado.id_marca}
                            onChange={cambioDeMarca}
                            required
                        >
                            <option value="">Marca</option>
                            {marcas?.map((marca, index) =>
                                <option value={marca.id_marca} key={index}>{marca.nombre}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Modelo
                        <select
                            name="id_modelo"
                            value={vehiculoEditado.id_modelo}
                            disabled={!vehiculoEditado.id_marca}
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
                    <label>
                        Año
                        <select
                            type="number"
                            name="year"
                            value={vehiculoEditado.año}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Año</option>
                            {opciones[0].opcionAño?.map((año, index) =>
                                <option value={año} key={index}>{año}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Kilometros
                        <input
                            type='number'
                            name="kilometraje"
                            value={vehiculoEditado.kilometraje}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <div className="inline-fields">
                    <label>
                        Transmisión
                        <select
                            name="id_transmision"
                            value={vehiculoEditado.id_transmision}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Transmision</option>
                            {transmisiones?.map((transmision, index) =>
                                <option value={transmision.id_transmision} key={index}>{transmision.nombre}</option>
                            )}
                        </select>
                    </label>
                    <label>
                        Precio
                        <input
                            type='number'
                            name="precio"
                            value={vehiculoEditado.precio}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>
                <label>
                    Descripción
                    <textarea
                        name="descripcion"
                        value={vehiculoEditado.descripcion}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Imagen
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </label>
                {vehiculoEditado.imagen && <img src={vehiculoEditado.imagen} alt="Vehículo" className="imagen-vehiculo" />}

                <div className="btn-editar">
                    <button type="submit" className="boton-editar-aviso">Actualizar</button>
                </div>
            </form>
        </div>

    )
}

export default EditarPublicacion