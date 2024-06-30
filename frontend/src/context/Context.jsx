import { createContext, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // autenticacion provisional del navbar
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    // peticion para conseguir toda la data de vehiculos
    const [dataCompletaVehiculos, setDataCompletaVehiculos] = useState([])
    const getDataVehiculos = async () => {
        try {
            const urlApi = 'http://localhost:3000/vehiculos'
            const res = await fetch(urlApi)
            const dataApi = await res.json()
            setDataCompletaVehiculos(dataApi)
        } catch (error) {
            console.log("hay un error", error)
        }
    }

    // peticion para recibir los estados disponibles
    const [estados, setEstado] = useState([])
    const getDataEstado = async () => {
        try {
            const res = await fetch('http://localhost:3000/estados')
            const dataEstados = await res.json()
            setEstado(dataEstados)
        } catch (error) {
            console.log("no se pudo conectar con el servidor")
        }

    }

    // peticion para recibir las marcas disponibles
    const [marcas, setMarcas] = useState([])
    const getDataMarca = async () => {
        try {
            const res = await fetch('http://localhost:3000/marcas')
            const dataMarcas = await res.json()
            setMarcas(dataMarcas)
        } catch (error) {
            console.log("no se pudo conectar con el servidor")
        }
    }

    // peticion para recibir las categorias disponibles
    const [categorias, setCategroria] = useState([])
    const getDataCategoria = async () => {
        try {
            const res = await fetch('http://localhost:3000/categorias')
            const dataCategorias = await res.json()
            setCategroria(dataCategorias)
        } catch (error) {

        }
    }

    //peticion para recibir las categorias
    const [transmisiones, setTransmisiones] = useState([])
    const getDataTransmision = async () => {
        try {
            const res = await fetch('http://localhost:3000/transmisiones')
            const dataTransmisiones = await res.json()
            setTransmisiones(dataTransmisiones)
        } catch (error) {
            
        }
    }

    //peticion para recibir los modelos
    const [modelos, setModelos] = useState([])
    const getDataModelos = async (marcaOpcion) => {
        const id = marcaOpcion
        const url = `http://localhost:3000/modelos/${id}`
        console.log(url)
        try {
            const res = await fetch(url)
            const dataModelo = await res.json()
            setModelos(dataModelo)
        } catch (error) {
            console.log("no se pudo conectar con el servidor")
        }
    }

    const login = () => {
        
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem("token")
    };


    return (
        <AuthContext.Provider value={{getDataModelos, modelos, isAuthenticated, login, logout, getDataEstado, estados, getDataVehiculos, setDataCompletaVehiculos, dataCompletaVehiculos, getDataMarca, marcas, getDataCategoria, categorias, getDataTransmision, transmisiones }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider
// export const useAuth = () => useContext(AuthContext);
