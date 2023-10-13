import { env } from "@/config/env";
import axios from "axios";

const NQLBackendClient = axios.create({
    baseURL: env.API_URL,
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
});

export default NQLBackendClient