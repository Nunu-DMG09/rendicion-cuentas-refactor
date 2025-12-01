import axios from "axios";
import { env } from "./env";

export const api = axios.create({
    baseURL: env.BACKEND_URL,
    timeout: 30000,
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.data?.message) throw new Error(error.response.data.message)
        if (error.response?.data?.error) throw new Error(error.response.data.error)
        if (error.code === "ECONNABORTED") throw new Error("La solicitud ha excedido el tiempo de espera.")
        if (!error.response) throw new Error("Error de red. Por favor, verifica tu conexión a internet.")
        throw new Error("Ha ocurrido un error inesperado.")
    }
)