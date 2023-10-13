import NQLBackendClient from "@/lib/axios"
import { AxiosResponse } from "axios"

type Response = {
    catalogs: string[]
}

const getDataCatalogs = async (): Promise<Response> => {
    const { data } = await NQLBackendClient.get<any, AxiosResponse<Response, any>>("/athena/catalog")

    return data
}

export default getDataCatalogs