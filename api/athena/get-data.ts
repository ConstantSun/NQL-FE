import NQLBackendClient from "@/lib/axios"
import { useSetting } from "@/stores"
import { AthenaData } from "@/types/api"
import { AxiosResponse } from "axios"

type Response = AthenaData

const getData = async (search: string, qid: string, catalogName: string, databaseName: string): Promise<Response> => {
    const { data } = await NQLBackendClient.post<any, AxiosResponse<Response, any>>("/inference/explanation", {
        qid,
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

export default getData