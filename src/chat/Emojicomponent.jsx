import axios from 'axios'
import { useEffect, useState } from 'react'

export const Emojicomponent=({room,ready,message,setMessage})=>{


    const [ emojis, setEmojis ] = useState([])


    useEffect(()=>{

        
        const getData=async ()=>{            
        
          const emoji=await axios.get('https://emoji-api.com/emojis?access_key=eac0adc843f4d6ff44f2110cc2a28bbdf786d174')

      
           setEmojis(emoji.data)

        } 
        
        getData()
        
    },[room])
    
    

    return (
        <div className='text-md max-h-40 overflow-y-scroll scroll-smooth  max-w-sm '>
        {
            ready===true && 
                        <div className='grid grid-cols-10 p-2 gap-2'>
                            {
                                emojis.map((emoji)=>(
                                    <button key={emoji.slug} value={emoji.character} onClick={(e)=>{setMessage(message+e.target.value)}}>{emoji.character}</button>
                                )) 
                            }
                        </div>
                }  
        </div>
    )
} 