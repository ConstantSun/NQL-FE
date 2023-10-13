import NQLBackendClient from "@/lib/axios"
import { AxiosResponse } from "axios"

type Response = {
    databases: string[]
}

const getDatabases = async (catalogName: string): Promise<Response> => {
    const { data } = await NQLBackendClient.get<any, AxiosResponse<Response, any>>(`/athena/database/${catalogName}`)

    return data
}

export default getDatabases