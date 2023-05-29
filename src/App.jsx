import { useEffect, useState } from 'react'
import './App.css'

import { Chat } from './chat/chat'

function App() {

  const [ isOnline, setIsOnline ] = useState(false)

  useEffect(()=>{

   const res= navigator.onLine
    setIsOnline(res)
  })
  return (
    <div className='bg-slate-800'>
      {
        isOnline==true && <Chat />
      }
      {
        isOnline==false && <h1 className='text-xl text-sky-400 h-screen'>you are offline! 😴</h1>
      }
    </div>
  )
}

export default App
