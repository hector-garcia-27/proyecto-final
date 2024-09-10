import { useEffect, useState, useContext } from "react";
import Card from "../../components/card/Card";
import './Vehiculos.css';
import { AuthContext } from '../../context/Context'
import { opciones } from "../../../public/opciones";
import { endpoint } from '../../assets/config';
import Swal from 'sweetalert2';
import { validarRutaPrivada } from "../../fuction/funciones";

function Vehiculos() {

    const token = sessionStorage.getItem('token')
    const url = `${endpoint}/compartida`

    const { login, logout, getDataModelos, modelos, getDataTransmision, transmisiones, getDataEstado, estados, getDataVehiculos, setDataCompletaVehiculos, dataCompletaVehiculos, getDataMarca, marcas, getDataCategoria, categorias } = useContext(AuthContext)
    useEffect(() => {
        const permisos = async () => {
            const res = await validarRutaPrivada(token, url)
            if (res.code === 401 || res.code === 500) {
                logout()
            }
            if (res.code === 200) {
                login()
            }
        }
        permisos()
        getDataVehiculos()
        getDataEstado()
        getDataMarca()
        getDataCategoria()
        getDataTransmision()
    }, [])

    // Estados para los filtros
    const [estadoOpcion, setEstadoOpcion] = useState("")
    const [categoriaOpcion, setCategoriaOpcion] = useState("")
    const [marcaOpcion, setMarcaOpcion] = useState("")
    const [modeloOpcion, setModeloOpcion] = useState("")
    const [añoOpcion, setAñoOpcion] = useState("")
    const [transmisionOpcion, setTransmisionOpcion] = useState("")

    // setear el cambio en la opcion seleccionada
    const cambioEnEstado = (element) => setEstadoOpcion(element.target.value)
    const cambioEnCategoria = (element) => setCategoriaOpcion(element.target.value)

    const cambioEnMarca = (element) => {
        setMarcaOpcion(element.target.value)
        getDataModelos(element.target.value) // funcion para la peticion get de modelos, pasando por parametro el valor actual, si dejo el marcaOpcion, se desfasa un tiempo
        setModeloOpcion('')
    }
    const cambioEnModelo = (element) => setModeloOpcion(element.target.value)
    const cambioEnAño = (element) => setAñoOpcion(element.target.value)
    const cambioEnTransmision = (element) => setTransmisionOpcion(element.target.value)

    // funcion para aplicar flitro
    const aplicarFiltro = () => {
        // logica para hacer el llamado a la api y que traiga la data con los filtros aplicados
        const getDataFiltrada = async () => {
            let fEstado = ``
            if (estadoOpcion) {
                fEstado = `&estado=${estadoOpcion}`
            }
            let fCategoria = ``
            if (categoriaOpcion) {
                fCategoria = `&categoria=${categoriaOpcion}`
            }
            let fModelo = ``
            if (modeloOpcion) {
                fModelo = `&modelo=${modeloOpcion}`
            }
            let fMarca = ``
            if (marcaOpcion) {
                fMarca = `&marca=${marcaOpcion}`
            }
            let fTransmision = ``
            if (transmisionOpcion) {
                fTransmision = `&transmision=${transmisionOpcion}`
            }
            let fYear = ``
            if (añoOpcion) {
                fYear = `&year=${añoOpcion}`
            }

            const rutaConFiltros = `${endpoint}/vehiculos/filtros?${fEstado}${fCategoria}${fModelo}${fMarca}${fTransmision}${fYear}`
            const res = await fetch(rutaConFiltros)
            console.log(res)
            if (!res.ok) {
                return Swal.fire({
                    icon: 'error',
                    iconColor: 'red',
                    title: 'Error',
                    text: 'Error al conectar con el servidor',
                });
            }
            if (res.status === 204) {
                return Swal.fire({
                    icon: 'info',
                    iconColor: '#76ABAE',
                    title: 'Sin resultados',
                    text: 'No existen datos para esos filtros',
                    confirmButtonColor: '#76ABAE',
                });
            }

            if (res.ok) {
                const dataFilt = await res.json()
                setDataCompletaVehiculos(dataFilt)

            }

        }
        getDataFiltrada()
    }

    // funciones para ordenar la data
    const [configOrden, setConfigOrden] = useState({ key: '', direccion: 'asc' })

    const ordenar = (key) => {
        let direccion = 'asc'
        if (configOrden.key === key && configOrden.direccion === 'asc') { direccion = 'desc' }

        const dataOrdenada = [...dataCompletaVehiculos].sort((a, b) => {
            if (a[key] < b[key]) {
                return direccion === 'asc' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direccion === 'asc' ? 1 : -1;
            }
            return 0;
        })

        setDataCompletaVehiculos(dataOrdenada)
        setConfigOrden({ key, direccion })
    }

    return (
        <div className="containerVehiculos">
            <div className="filtrosVehiculos">
                <label className="filtrarPor">
                    <h3>Filtrar por:</h3>
                </label>
                <div className="btnFiltros">
                    <select className="selectFiltros" value={estadoOpcion} onChange={(element) => cambioEnEstado(element)}>
                        <option value="">Estado</option>
                        {estados?.map((estado, index) =>
                            <option value={estado.id_estado} key={index} >{estado.nombre}</option>
                        )}
                    </select>

                    <select className="selectFiltros" value={categoriaOpcion} onChange={(element) => cambioEnCategoria(element)} >
                        <option value="">Categoria</option>
                        {categorias?.map((categoria) =>
                            <option value={categoria.id_categoria} key={categoria.id_categoria}>{categoria.nombre}</option>
                        )}
                    </select>

                    <select className="selectFiltros" value={marcaOpcion} onChange={(element) => cambioEnMarca(element)}>
                        <option value="">Marca</option>
                        {marcas?.map((marca, index) =>
                            <option value={marca.id_marca} key={index}>{marca.nombre}</option>
                        )}
                    </select>

                    <select className="selectFiltros" value={modeloOpcion} disabled={!marcaOpcion} onChange={(element) => cambioEnModelo(element)}>
                        <option value="">Modelo</option>
                        {modelos?.map((modelo, index) =>
                            <option value={modelo.id_modelo} key={index}>{modelo.nombre}</option>
                        )}
                    </select>

                    <select className="selectFiltros" value={añoOpcion} onChange={(element) => cambioEnAño(element)}> {/* cambiar a input tipo numero limitado a 4 numeros validando que sea un numero entre 1950 a 2024*/}
                        <option value="">Año</option>
                        {opciones[0].opcionAño?.sort((a, b) => b - a).map((año, index) =>
                            <option value={año} key={index}>{año}</option>
                        )}
                    </select>
                    <select className="selectFiltros" value={transmisionOpcion} onChange={cambioEnTransmision}>
                        <option value="">Transmision</option>
                        {transmisiones?.map((transmision, index) =>
                            <option value={transmision.id_transmision} key={index}>{transmision.nombre}</option>
                        )}
                    </select>
                    <button className="btnBuscarFiltros" onClick={() => aplicarFiltro()}>Buscar</button>
                </div>

                <div className="ordernarPor">
                    <h3>Ordenar por:</h3>
                </div>

                <div className="btnOrdenarPor">
                    <div>
                        <button className="boton-k" onClick={() => ordenar('precio')} >Precio </button>
                    </div>
                    <div>
                        <button className="boton-k" onClick={() => ordenar('kilometraje')}>Kilometraje</button>
                    </div>
                    <div>
                        <button className="boton-k" onClick={() => ordenar('año')}>Año</button>
                    </div>
                </div>
            </div>

            <h1>AUTOS PUBLICADOS</h1>

            <div className="galeriaVehiculos" >

                {dataCompletaVehiculos?.map(element => (
                    <div key={element.id_publicacion} className="card-vehiculo" /* to={`/detalle/${element.id_publicacion}`} */>
                        <Card
                            id={element.id_publicacion}
                            imagen={element.imagen}
                            titulo={element.titulo}
                            marca={element.marca}
                            modelo={element.modelo}
                            año={element.año} // agregar kilometraje a la card
                            precio={element.precio}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Vehiculos;
