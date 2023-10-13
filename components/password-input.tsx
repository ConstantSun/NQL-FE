import { Eye } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { EyeOff } from 'lucide-react'

type Props = {
    value: string | undefined
    setValue: (value: string) => void
}

const PasswordInput = ({ value, setValue }: Props) => {
    const [isVisible, setIsVisible] = useState<boolean>(true)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue(e.target.value)

    const toggleVisibility = () => setIsVisible(v => !v)

    return (
        <div className='flex border-[#C5C5C5] border-[1px] h-12 rounded-lg shadow-sm items-center px-1'>
            <Input type={isVisible ? "text" : "password"} className='border-none' onChange={handleInputChange} value={value} />
            <Button variant="ghost" className='rounded-full hover:bg-accent/50 w-10 h-10 p-[10px]' onClick={toggleVisibility}>
                {isVisible ? <Eye className="text-[#b8b8b8]" /> : <EyeOff className="text-[#b8b8b8]" />}
            </Button>
        </div>
    )
}

export default PasswordInput