import NQLBackendClient from "@/lib/axios"
import { SQLInference } from "@/types/api"
import { AxiosResponse } from "axios"

type Response = SQLInference

const getSQL = async (search: string, catalogName: string, databaseName: string): Promise<Response> => {
    const { data } = await NQLBackendClient.post<any, AxiosResponse<Response, any>>("/inference/sql",
        {
            "prompt": search,
            "CatalogName": catalogName,
            "DatabaseName": databaseName,
        }, {
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    })

    return data
}

export default getSQL