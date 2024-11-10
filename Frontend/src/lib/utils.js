import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}


export const readFileAsDataUrl=(file)=>{
  return new Promise((resolve,reject)=>{
    const reader= new FileReader();
    reader.onloadend=()=>{
      if(typeof reader.result==='string') resolve(reader.result);
    }
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file as a data URI.'));
    };

    reader.readAsDataURL(file);

  })
}