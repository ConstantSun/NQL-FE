import { siteConfig } from '@/config/site';
import { Bot } from 'lucide-react';
import React from 'react'

const Header = () => {
    return (
        <div className="flex flex-col items-center mt-24 space-y-4">
            <div className='flex space-x-4 items-center'>
                <Bot className="w-20 h-20" />
                <h1 className="text-8xl font-bold">{siteConfig.name}</h1>
            </div>
            <div className="flex text-xl space-x-2">
                <h4>Supercharge data analytics with the power of</h4>
                <div className="relative">
                    <h4 className="z-10 font-semibold italic">Generative AI</h4>
                    <div className="absolute bg-[#2FFF44]/50 w-[106%] h-[5px] bottom-[3px] z-0 left-[-3%]" />
                </div>
            </div>
        </div>
    )
}

export default Header