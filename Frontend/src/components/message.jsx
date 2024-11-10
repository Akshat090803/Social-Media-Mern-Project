import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dot } from "lucide-react"
import { useSelector } from "react-redux"

import { useEffect, useRef } from "react"


function Message({selectedUser}){
   const {user}=useSelector((store)=>store.auth)

  const {messages}=useSelector((store)=>store.chat)

  const endMessageRef=useRef(null)


  // this is to scroll to last message of chat whenever we open chat window
  useEffect(()=>{
    if (endMessageRef.current) {
      endMessageRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  },[messages])


  return(
    <>
    <div className="pl-2  pt-20 mb-3 overflow-y-auto  scrollbar-none scroll-smooth flex-1 ">

      {/* first top of message */}
              <div className="flex justify-center py-4">
                <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24  ">
                    <AvatarImage
                      src={`${
                        selectedUser?.profilePicture ||
                        "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                      }`}
                      alt="profile_picture"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <div className="text-center">
                  <p className="dark:text-darkTheme-mainText text-black font-semibold text-lg">{selectedUser?.fullName}</p>
                  <p className="text-lightTheme-placeholder dark:text-darkTheme-placeholder text-sm ">{selectedUser?.username} <Dot className="inline p-0 m-0 h-2 w-2"/> <span>Instagram</span></p>
                  </div>

                 <Link to={`/profile/${selectedUser?._id}`}><button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-fit px-4 rounded-lg dark:hover:bg-darkTheme-dialog py-2 text-black hover:bg-lightTheme-badgeHover text-sm bg-[#dbdbdb]">View Profile</button></Link>

                </div>

              </div>

                  {/* messages */}
                  <div className="mt-4">
             {
              messages && messages.map((mess,index)=>{
                return(
              
                 <>
                
                <div key={index} className={`chat   ${user?._id===mess?.senderId ?'chat-end':'chat-start'} `}>
  <div className={`chat-image avatar ${user?._id===mess?.senderId && 'hidden'}`}>
    <div className="w-7 rounded-full ">
      <img
        alt="profilePicture"
        src={selectedUser?.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
        loading="lazy"/>
    </div>
  </div>
 
 <pre ref={index === messages.length - 1 ? endMessageRef : null} className={`chat-bubble font-sans sm:max-w-md overflow-hidden break-words text-ellipsis whitespace-pre-wrap  ${user?._id===mess?.receiverId ?'dark:bg-darkTheme-dialog bg-[#efefef] text-black dark:text-darkTheme-mainText':'dark:bg-darkTheme-btnBlue bg-darkTheme-btnBlue'}`}>{mess.message}</pre>

</div> 
               

                </>
               
                )
              })
             }

            </div>
            </div>

    
    
    </>
  )
}

export default Message