import { create } from "zustand";
import { persist } from 'zustand/middleware'
import { produce } from "immer"
import getDatabases from "@/api/athena/get-database";
import getDataCatalogs from "@/api/athena/get-data-catalogs";

type Action = {
    setSelectedDataCatalog: (val: string) => void;
    setSelectedDatabase: (val: string) => void;
    setDataCatalogList: () => Promise<void>;
    setDatabaseList: () => Promise<void>;
}

type State = {
    catalog: {
        list: string[],
        selected?: string
    },
    database: {
        list: string[],
        selected?: string
    }
}

type Store = State & Action

const useSetting = create(persist<Store>((set, get) => ({
    catalog: {
        list: []
    },
    database: {
        list: []
    },
    setDatabaseList: async () => {
        const selectedCatalog = get().catalog.selected
        if (!selectedCatalog) return
        const { databases } = await getDatabases(selectedCatalog)
        set((state) => {
            return produce(state, draft => {
                draft.database.list = databases
            })
        })
    },
    setDataCatalogList: async () => {
        const { catalogs } = await getDataCatalogs()
        set((state) => produce(state, draft => {
            draft.catalog.list = catalogs
        }))
    },
    setSelectedDatabase: (val) => {
        set(state => produce(state, draft => {
            draft.database.selected = val
        }))
    },
    setSelectedDataCatalog: (val) => {
        set(state => produce(state, draft => {
            draft.catalog.selected = val
        }))
    },
}), {
    name: "setting-storage"
}))

export default useSetting