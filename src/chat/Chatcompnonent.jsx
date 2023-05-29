import { useEffect, useState } from "react"
import { authUser, db } from "../config/firebase"
import { Emojicomponent } from "./Emojicomponent"
import { addDoc ,collection,serverTimestamp  ,query,where,orderBy,onSnapshot, getDocs, deleteDoc,doc} from "firebase/firestore"

import { storage } from '../config/firebase'
import { ref ,uploadBytes ,listAll, getDownloadURL} from 'firebase/storage'


export const Chatcompnonent=()=>{

    const [ room, setRoom ]=useState("")

    const [ enteredRoom, setEnteredRoom ]=useState(false)

    const [ roomName, setRoomName ] = useState("")

    const [ message, setMessage ]=useState("")
    
    const [ getMessage, getSetMessage ]=useState([])

    const [ imageName, setImageName ] = useState("")

    const [ imagesList, setImagesList ]=useState([])

    const [ lastImage, setLastImage ] = useState('')

    const [ uploading, setUploading ] = useState('')

    const [ isEmptyMessage, setIsEmptyMessage ] = useState(false)

    const [ isGetRooms, setIsGetRooms ] = useState(false)


    //  creating rooms 

    const [ roomPassword, setRoomPassword ] = useState("")

    const [ incorrectRoomName,setIncorrectRoomName ] = useState(false)

    const [ incorrectRoomPass,setIncorrectRoomPass ] = useState(false)


    const [ ready, setReady ] = useState(false)

    const [ uploadImage, setUploadImage ]= useState("")

    const [ roomsInDb, setRoomsInDb ] = useState([])
     
    const [ roomsCreatedByYou, setRoomsCreatedByYou] = useState([])

    const [ roomAlreadyExists, setRoomAlreadyExists ]= useState(false)

    const messageRef = collection(db,"messages")
    
    const roomRef = collection(db,"rooms")


    const roomCreated=()=>{
            
            setRoomsCreatedByYou([])
            
            getDocs(roomRef).then(roomsData=>setRoomsInDb(roomsData.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
            
            roomsInDb.forEach(roomindb=>{
                
                if(roomindb.createdBy===authUser.currentUser.photoURL){
             setRoomsCreatedByYou(prev=>[...prev, {roomName : roomindb.roomName, password:roomindb.roomPass}])
            }
        })
        
        console.log(roomsCreatedByYou)
        
        setIsGetRooms(!isGetRooms)
    }
    

    useEffect(()=>{

        let queryMessages=query(messageRef,where("roomName","==",room),orderBy("time"))
         onSnapshot(queryMessages,(snapshot)=>{
            
            let messagesArray=[]
            snapshot.forEach((doc)=>{
                messagesArray.push({...doc.data(),docId:doc.id})
            })
            getSetMessage(messagesArray)
            
            getDocs(roomRef).then(roomsData=>setRoomsInDb(roomsData.docs.map(doc => ({ ...doc.data(), id: doc.id })))).catch(err=>console.error(err))
        })

        }, [room])

    
    const handleRoom=async ()=>{


        if(room=="" || roomPassword=="" ) return


        const notThere=roomsInDb.filter(roomindb=>(roomindb.roomName===room))


        if(notThere.length===0)
        {
          return setIncorrectRoomName(true) 
           
        }else{
                 setIncorrectRoomName(false)
            if( roomPassword === notThere[0].roomPass)
            {
                    setIncorrectRoomPass(false)
                    setIncorrectRoomName(false)
                    setRoomAlreadyExists(false)
                    setRoomName(room)

              return setEnteredRoom(true)
            }else{
                return  setIncorrectRoomPass(true)   
            }
        }
        

    }
    
    const handleCreateRoom=async ()=>{
        
        if(room=="" || roomPassword=="" ) return 
        
        setRoomName(room)

        setRoom("")
        setRoomPassword("")


        getDocs(roomRef).then(roomsData=>setRoomsInDb(roomsData.docs.map(doc => ({ ...doc.data(), id: doc.id }))))
        
       let roomThere=false

        roomsInDb.forEach(roomindb=>{

        if(roomindb.roomName===room){
            setRoomAlreadyExists(true)
            roomThere=true
        }
    })
    
    if(!roomThere){
        await addDoc(roomRef,{
            roomName : room,
            roomPass : roomPassword,
            createdBy : authUser.currentUser.photoURL,
            createdTime : serverTimestamp()
        })
        setIncorrectRoomName(false)
        setIncorrectRoomPass(false)
        setRoomAlreadyExists(false)
        setEnteredRoom(true)
        }
    }


    const handleSendMessage=async ()=>{
        if(message=="" && uploadImage=="") return setIsEmptyMessage(true)

        var imageUpload=false

        let textMsg=message

        let multiple=false
        
        if(1){
            var res = message.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
           
            imageUpload =res !== null

            if(imageUpload===true){

                
                console.log(message.split('/'))
                
                setMessage("")
                
            if(message.split(' ').length>1)
            {
                
                for(let i=0;i<message.length;i++){
                    
                const seperateLinks=message.split(' ')
                
                //multiple google drive links

                const link=seperateLinks[i]
                
                
                if(link.split('/')[2]=="drive.google.com")
                {
                    console.log(message)
                    const id=link.split('/')[5]
                    console.log(id)
                    const newUrl=`https://drive.google.com/uc?export=view&id=${id}`
                    console.log(newUrl)
                    
                    textMsg=newUrl
                    
                    setUploading("Image sending....")
                    await addDoc(messageRef , {
                        roomName : room,
                        textMessage : textMsg,
                        id:authUser?.currentUser?.uid,
                        user: authUser?.currentUser?.displayName,
                        image:authUser?.currentUser?.photoURL,
                        isImage:imageUpload,
                        time:serverTimestamp(),
                        uniqueID:crypto.randomUUID()
                    })
                    
                    setUploading("Image sent Buddy!")
                    setTimeout(() => {
                        setUploading("")
                    }, 1000);
                    
                }
                //multiple normal links
                else{
                    
                    textMsg=seperateLinks[i]
                    
                    setUploading("Image sending....")
                    
                    
                    await addDoc(messageRef , {
                        roomName : room,
                        textMessage : textMsg,
                        id:authUser?.currentUser?.uid,
                        user: authUser?.currentUser?.displayName,
                        image:authUser?.currentUser?.photoURL,
                        isImage:imageUpload,
                        time:serverTimestamp(),
                        uniqueID:crypto.randomUUID()
                    })
                    
                    setUploading("Image sent Buddy!")
                    setTimeout(() => {
                        setUploading("")
                    }, 1000);
                }          
            }   
            
            
            multiple=true
        }
        }
        else
        { 
                if(message.split('/')[2]=="drive.google.com")
                {
                    console.log(message)
                    const id=message.split('/')[5]
                    console.log(id)
                    const newUrl=`https://drive.google.com/uc?export=view&id=${id}`
                    console.log(newUrl)
                    textMsg=newUrl
            }
        }
        
    }
        
        setMessage("")
        
        if(uploadImage!=""){
            imageUpload=true
            
        setMessage(imageName)
        
        const imageRef=ref(storage,`images/${ imageName + crypto.randomUUID().split('-')[0]}`)
        await uploadBytes(imageRef,uploadImage).then((snapshot)=>{
            getDownloadURL(snapshot.ref).then(async (url)=>{
                setLastImage(url)
                
                
                setUploading("Image sending....")
                
                await  addDoc(messageRef , {
                    roomName : room,
                    textMessage : url,
                    id:authUser?.currentUser?.uid,
                    user: authUser?.currentUser?.displayName,
                    image:authUser?.currentUser?.photoURL,
                    isImage:imageUpload,
                    time:serverTimestamp(),
                    uniqueID:crypto.randomUUID()
                })
                
                setUploading("Image sent Buddy!")
                setTimeout(() => {
                    setUploading("")
                }, 1000);
                setUploadImage("")
            })
        })
        setMessage("")
    } else{
        if(!multiple){

            await addDoc(messageRef , {
                roomName : room,
                textMessage : textMsg,
                id:authUser?.currentUser?.uid,
                user: authUser?.currentUser?.displayName,
                image:authUser?.currentUser?.photoURL,
                isImage:imageUpload,
                time:serverTimestamp(),
                uniqueID:crypto.randomUUID()
            })
        
        }
    }
    setIsEmptyMessage(false)
    }   
        
    const handleDeleteAll=async ()=>{

        getMessage.forEach(mess=>{
            const messageDoc=doc(db,"messages",mess.docId)
            deleteDoc(messageDoc)
        })
    }


    const setEmojiReady=()=>{
        setReady(!ready)
    }

    const downloadImage=(e)=>{
        var image=document.createElement('a')
            image.target="_blank"
            image.href=e.target.src
            image.download="Image"
            image.click()
    }
  

    // rooms entering container
    return <div className="flex justify-center items-center flex-col gap-2 select-none">
        <h1 className="text-xl">Chatting</h1>
        {
            // room not entered 
            !enteredRoom && 
            <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-col">
                    {/* room name entering container */}
                    <label htmlFor="room" className="text-md">Room: </label>
                    <input type="text" id="room" onChange={(e)=>{setRoom(e.target.value)}} placeholder="Enter RoomName..."   className="text-md  bg-transparent outline-none border-transparent border-b-2 border-b-slate-300"/>
                    <label htmlFor="password" className="text-md">Password: </label>
                    <input type="password" id="password" onChange={(e)=>{setRoomPassword(e.target.value)}} placeholder="Enter Password..." className="text-md  bg-transparent outline-none border-transparent border-b-2 border-b-slate-300"/>
                </div>
                <br />
                {/* entering room */}
                <button onClick={handleRoom} className="border-slate-900 px-4 border-2 rounded-md hover:border-slate-700 mx-auto focus:bg-sky-400 ">Enter Room</button>

                { incorrectRoomName ===true && <p className="text-md text-red-600">incorrect room Name! Wanna create one?</p> }
                { incorrectRoomPass ===true && <p className="text-md text-red-600">incorrect room Password</p> }
                
                {/* creating room  */}
                <button onClick={handleCreateRoom} className="border-slate-900 px-4 border-2 rounded-md hover:border-slate-700 mx-auto">Create Room</button>
                { roomAlreadyExists ===true && <p className="text-md text-red-600">Room already exists buddy!</p> }
                
                   <button onClick={roomCreated} className="border-slate-900 px-4 border-2 rounded-md hover:border-slate-700 mx-auto">Get Rooms</button>               
                {
                    isGetRooms===true &&
                    <div className="flex text-sky-500 flex-col mx-auto p-3">
                    {   
                    roomsCreatedByYou.map(room=>{
                        return <div className="flex justify-between gap-2" key={room.roomName}>
                        <h1 className="text-center text-xl" title="roomName">{room.roomName} =</h1>
                        <h1 className="text-center text-xl" title="password">{ room.password}</h1>
                        </div>
                    })
                     }
                </div>
                }
            </div>
        }
        {
            enteredRoom &&   
            <div className=" relative flex flex-col gap-4 p-2">
            <div>
                <div className="relative flex p-4 text-md flex-col bg-blue-400 rounded-md h-[400px] overflow-y-scroll scroll-smooth">
                    <h1 className="sticky text-xl font-semibold text-white flex justify-between bg-slate-800 p-2 rounded-md"><span>Room : {roomName}</span><button title="delete all messages!" onClick={handleDeleteAll}>🗑️</button></h1> 
                    
                {
                    getMessage.map(mes=> {
                        return <div className="flex p-2" key={mes.uniqueID}>
                            {
                                mes.textMessage!="" && <>
                            
                                { mes.image !== authUser?.currentUser?.photoURL && 
                                    <>
                                    <img src={mes.image} alt="...."  className="h-[25px] rounded-full ml-0"/>
                                    {
                                        mes.isImage=== true ?
                                        <img src={mes?.textMessage} className=" h-[180px] w-[100%] object-contain ml-0"/>:
                                        <div className="text-md font-medium  ml-2 max-w-sm" >{mes?.textMessage}</div>
                                    }
                                    </>
                                }  

                                { mes.image === authUser?.currentUser?.photoURL && 
                                    <>
                                    {
                                        mes.isImage=== true ?
                                        <img src={mes?.textMessage} onClick={(e)=>{downloadImage(e)}} className=" h-[180px] w-[100%] object-contain mr-0"/>:
                                        <div className="text-md font-medium   mr-2 mx-auto max-w-sm"  >{mes?.textMessage}</div>
                                    }
                                    <img src={mes.image} alt="...." className="h-[25px] rounded-full mr-0"/>
                                    </>
                                }
                            </>
                        }
                            </div>
                    })
                }
                </div>
            </div>
            <div className="flex gap-2 mx-auto">
                <input type="text" id="message" onChange={(e)=>{
                    setMessage(e.target.value)
                    setIsEmptyMessage(false)
                    }} value={message} placeholder="Enter message...."  className={`text-md w-[250px] bg-transparent outline-none border-transparent border-b-2 ${ message=="" && isEmptyMessage==true ? "border-b-red-500 placeholder:text-red-400" : "border-b-slate-300" } `}/>
             <button onClick={setEmojiReady}>😊</button>
             <label htmlFor="image">🖼️</label>
            <input type="file" name="image" id="image" onChange={(e)=>{
                 setUploadImage(e.target.files[0]) 
                 setImageName(e.target.files[0].name)
                 }} className='hidden' />
                <button onClick={handleSendMessage} id="send" className="border-slate-900 px-4 border-2 rounded-md hover:border-slate-700 mx-auto" >send</button>
            

            </div>
            <button onClick={()=>{
                setEnteredRoom(false)
                setRoom("")
                setRoomPassword("")}} className="border-slate-900 px-4 border-2 rounded-md hover:border-slate-700 mx-auto" >Change Room</button>
                
                {  uploading!=="" &&
                    <div className="text-md text-sky-500 mx-auto">{uploading}</div>
                }
            </div>
        }
        <Emojicomponent room={room} message={message} setMessage={setMessage} ready={ready}/>
        </div>
}

