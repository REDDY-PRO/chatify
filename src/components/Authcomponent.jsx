import { authUser, provider } from "../config/firebase"
import { signInWithPopup, signOut } from "firebase/auth"
import { useState } from "react"
import {  useAuthState } from 'react-firebase-hooks/auth'

export const Authcomponent=()=>{

    const [user,loading,error]=useAuthState(authUser)

    // const [ visible , setVisible ]= useState(false)

    const handleSignin=async ()=>{
        await signInWithPopup(authUser,provider)
    }

    const handleSignout=async ()=>{
        await signOut(authUser)
    }

    if(loading){
        return <>
        <h1>Loading....</h1>
        </>
    }

    if(error){
        return <>
        <h1>Error : {error}</h1>
        </>
    }

    return (
        <>
        {
         !user &&
         <>
         <div className="flex flex-col justify-center  h-[200px] bg-sky-400 gap-4">
            <h1 className="mx-auto text-2xl font-semibold">sing in with
            <span className="text-blue-800"> G</span>
            <span className="text-red-700">o</span>
            <span className="text-yellow-400">o</span>
            <span className="text-blue-800">g</span>
            <span className="text-green-900">l</span>
            <span className="text-red-700">e</span>
                </h1>
            <button onClick={handleSignin} className="text-black text-xl font-semibold bg-slate-300 mx-auto px-3 rounded-md">Sign In</button>
         </div>
        </>
        }
        {
            user && 
            <div className="relative flex justify-between items-center p-6 text-sky-400 max-w-[400px] mx-auto">
                    <div className="group relative">
                    <img src={authUser?.currentUser?.photoURL} alt="...." className={`relative h-[25px] rounded-full`}/>
                    <div className="text-md absolute translate-x-[-40%] top-8 bg-slate-600 p-2 rounded-md text-white hidden group-hover:block">{authUser?.currentUser?.email}</div>
                    </div>
                    <div>{authUser?.currentUser?.displayName}</div>
                    <button onClick={handleSignout} className="border-slate-900 px-2 border-2 rounded-md hover:border-slate-700">Sign Out</button>
            </div>
        }
        </>
    )
}