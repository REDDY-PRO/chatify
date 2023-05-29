import { Authcomponent } from '../components/Authcomponent'
import { Chatcompnonent } from './Chatcompnonent'
import {  useAuthState } from 'react-firebase-hooks/auth'
import { authUser } from "../config/firebase"

export const Chat=()=>{
    
    const [user]=useAuthState(authUser)
    
    return <div className='bg-slate-800 h-screen text-white'>
    <Authcomponent />
    {
        user && <Chatcompnonent />
    }
    </div>
}