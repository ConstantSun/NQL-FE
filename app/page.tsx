"use client"

import { Clipboard } from "lucide-react"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { format } from "sql-formatter"
import { cb } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from "react";
import PromptSearch from "@/components/prompt-search";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { SQLInference, AthenaData } from '@/types/api';
import { Skeleton } from '@/components/ui/skeleton';
import { getSQL } from '@/api/inference';
import getData from "@/api/athena/get-data";
import { useSetting } from "@/stores";
import { useToast } from "@/components/ui/use-toast";


export default function Page() {
  const { toast, dismiss } = useToast()

  const [search, setSearch] = useState<string>('')
  const [copy, setCopy] = useState<boolean>(false)
  const [SQLInference, setSQLInference] = useState<SQLInference>()
  const [athenaData, setAthenaData] = useState<AthenaData>()

  const { catalog, database } = useSetting()

  const sqlText = SQLInference ? format(SQLInference.query, {
    language: "postgresql"
  }) : ""


  const onClick = async () => {
    if (search.length === 0 || !(catalog.selected && database.selected))
      return
    setSQLInference(undefined)
    setAthenaData(undefined)
    try {
      const { id: sqlQueryToastId } = toast({
        title: "Generating SQL Query...",

      })
      const sqlInferenceData = await getSQL(search, catalog.selected, database.selected)
      setSQLInference(sqlInferenceData)

      dismiss(sqlQueryToastId)

      const { id: athenaToastId } = toast({
        title: "Querying Data from Amazon Athena..."
      })
      const athenaData = await getData(sqlInferenceData.query, sqlInferenceData.qid, catalog.selected, database.selected)
      setAthenaData(athenaData)
      dismiss(athenaToastId)
    }
    catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error occured!",
        description: e.toString()
      })
    }
  }

  const onCopy = () => {
    setCopy(true)
    navigator.clipboard.writeText(sqlText)
  }

  useEffect(() => {
    if (copy) {
      const copyTimeout = setTimeout(() => {
        setCopy(false)
      }, 750)

      return () => clearTimeout(copyTimeout)
    }
  }, [copy])

  return (
    <section className="flex flex-col w-full items-center space-y-10 mt-8">
      <div className="w-[600px] space-y-8">
        <PromptSearch search={search} setSearch={setSearch} onClick={onClick} SQLInference={SQLInference} disabled={search.length === 0 || !(catalog.selected && database.selected)} />
        {SQLInference && <div className="w-full space-y-8">
          {athenaData?.data && <Table>
            <TableHeader>
              <TableRow>
                {athenaData.data[0].map((data) =>
                  <TableHead>{data}</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {athenaData.data.slice(1).map((row) =>
                <TableRow>
                  {row.map(c => <TableCell>{c}</TableCell>)}
                </TableRow>

              )}
            </TableBody>
          </Table>}
          {!athenaData && SQLInference && <div className='space-y-2'>
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6" />
            <Skeleton className="h-6 w-1/3" />
          </div>}
          <div className="w-full space-y-2 px-8 pt-4 pb-5 rounded-lg border-[#9F9F9F] border-[1px] shadow-md bg-[#222]">
            <div className='flex w-full justify-between items-center'>
              {/* Hidden div to align title in center and icon on the right. Can't be bothered to write actual CSS for it */}
              <div className="w-9 h-9" />
              <p className="font-semibold text-white">SQL Query</p>
              <TooltipProvider>
                <Tooltip open={copy}>
                  <TooltipTrigger asChild>
                    <div onClick={onCopy}>
                      <Clipboard className="text-white w-9 h-9 cursor-pointer p-2 rounded-sm hover:bg-gray-600" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copied!</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <SyntaxHighlighter language='sql' wrapLines wrapLongLines style={
              cb
            }>
              {sqlText}
            </SyntaxHighlighter>
          </div>
        </div>}
      </div>

    </section >
  )
}
