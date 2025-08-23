import axios from 'axios';

const URL = "http://localhost:8085/api/proveedor";

const proveedorService = {
    "getAll": async () => {
        try {
            const response = await axios.get(`${URL}`)
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    },
    "getById": async (id) => {
        try {
            const response = await axios.get(`${URL}/${id}`);
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    },
    "search": async (param, type) => {
        try {
            const response = await axios.get(`${URL}/search/${param}?type=${type}`);
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    },
    "save": async (data) => {
        try {
            const response = await axios.post(`${URL}`, data);
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    },
    "update": async (id, data) => {
        try {
            const response = await axios.put(`${URL}/${id}`, data);
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    },
    "delete": async (id) => {
        try {
            const response = await axios.delete(`${URL}/${id}`);
            return response;
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                return { data: "Error de conexión con el servidor" };
            }
            return error.response;
        }
    }
}

export default proveedorService;