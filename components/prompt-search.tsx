import { Label } from '@radix-ui/react-label'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { RefreshCcw, Search, Send, Settings } from 'lucide-react'
import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { SQLInference } from '@/types/api'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { useSetting } from '@/stores'

import { toast } from 'react-hot-toast'

type Props = {
    search: string;
    setSearch: (s: string) => void;
    onClick: () => Promise<void>;
    SQLInference?: SQLInference
    disabled: boolean;
}

const PromptSearch = ({ search, setSearch, onClick, SQLInference, disabled }: Props) => {
    const { catalog, database, setDataCatalogList, setDatabaseList, setSelectedDataCatalog, setSelectedDatabase } = useSetting()

    useEffect(() => {
        if (catalog.selected && database.list.length === 0)
            setDatabaseList()
    }, [catalog.selected, database.list.length])

    useEffect(() => {
        if (catalog.list.length === 0)
            setDataCatalogList()
    }, [])



    return (
        <div className="w-full space-y-2">
            <div className="relative flex border-[#9F9F9F] border-[1px] rounded-xl pl-4 pr-2 py-1 shadow-md transition-all duration-150 h-full">
                <div className='flex space-x-3'>
                    <Search className="text-[#9F9F9F] my-2" />
                    <div className='flex h-full items-center py-1'>
                        <div className='h-full w-[1.5px] rounded-full bg-[#c2c2c2]' />
                    </div>
                </div>
                <Textarea className="border-none text-lg pr-12 py-1 placeholder:text-[#B5B5B5]" placeholder="Enter your prompt" value={search} onChange={(e) => {
                    setSearch(e.target.value)
                }} />
                <Button className='absolute top-2 right-2' size='sm' disabled={disabled}>
                    <Send className='w-4 h-4' onClick={onClick} />
                </Button>
            </div>
            <div className="flex justify-between">
                <div className="flex space-x-2">
                    {SQLInference && <>
                        <div className="flex flex-col justify-center px-4 py-1 text-xs text-white bg-[#7E49EF] rounded-full w-max">
                            Query Execution Id: {SQLInference.qid}
                        </div>
                    </>}
                </div>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-7 h-7 rounded-full p-0">
                            <Settings className="h-4 w-4 text-gray-400" />
                            <span className="sr-only">Open popover</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent >
                        <div className="relative bg-white top-2 grid gap-4 p-8 rounded-md border-[#9F9F9F] border-[1px] shadow-lg">
                            <div className="space-y-2">
                                <h4 className="font-medium leading-none">Athena</h4>
                                <p className="text-sm text-muted-foreground">
                                    Set athena config
                                </p>
                            </div>
                            <div className="grid gap-2 ">
                                <div className="grid grid-cols-[30%_55%_15%] items-center gap-1 w-96">
                                    <Label className='font-bold'>Catalog</Label>
                                    <Select disabled={catalog.list.length === 0} onValueChange={setSelectedDataCatalog} value={catalog.selected}>
                                        <SelectTrigger >
                                            <SelectValue placeholder="Select Data Catalog" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {catalog.list.map((c) => (<SelectItem value={c}>{c}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" onClick={() => {
                                        toast.promise(setDataCatalogList(), {
                                            error: (e) => e,
                                            loading: "Fetching data catalogs",
                                            success: "Fetched data catalogs"
                                        })
                                    }}>
                                        <RefreshCcw className="text-gray-400" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-[30%_55%_15%] items-center gap-1 w-96">
                                    <Label className='font-bold'>DB</Label>
                                    <Select disabled={database.list.length === 0} onValueChange={setSelectedDatabase} value={database.selected}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Database" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {database.list.map((db) => (<SelectItem value={db}>{db}</SelectItem>))}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" onClick={() => {
                                        toast.promise(setDatabaseList(), {
                                            error: (e) => e,
                                            loading: "Fetching database",
                                            success: "Fetched database"
                                        })
                                    }}>
                                        <RefreshCcw className="text-gray-400" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default PromptSearch