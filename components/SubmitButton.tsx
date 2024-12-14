"use client"

import {useFormStatus} from 'react-dom'
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";

interface IappProps {
      text:string;
      variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" |  null | undefined;
}

function SubmitButton({text,variant}:IappProps) {
      const {pending} = useFormStatus()
      return (
          <>
                {pending ? <Button disabled className='w-full'><Loader2 className='size-4 mr-2 animate-spin'/>Please wait...</Button>:<Button type='submit' className='w-full' variant={variant}>{text}</Button>}
          </>
      )
}

export default SubmitButton