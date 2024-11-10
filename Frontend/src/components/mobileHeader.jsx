import { setLikeNotificationBadge, setNotificationActive } from "@/redux/NotificationSlice"
import { Heart, MessageCircle } from "lucide-react"
import { BsMessenger } from "react-icons/bs"
import { FaSignalMessenger } from "react-icons/fa6"
import { GoDotFill } from "react-icons/go"
import { LiaFacebookMessenger } from "react-icons/lia"
import { PiMessengerLogo, PiMessengerLogoBold } from "react-icons/pi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

function MobileHeader(){
const navigate=useNavigate()
const dispatch=useDispatch()
const {showLikeNotifcationBadge,messageNotifications}=useSelector((store)=>store.notifications)


const  messageSymbolClickHandler=()=>{
            navigate('/chat')
 }

 const notificationSymbolHandler=()=>{
  // dispatch(setNotificationActive())
      dispatch(setLikeNotificationBadge(false))
      navigate('/notification')
 }
  return (
    <>
<div className="dark:text-darkTheme-mainText    dark:bg-darkTheme-priBack bg-lightTheme-priBack  ">
  <div className="flex justify-between w-full py-3 items-center px-5   ">
    <h1 className="font-semibold text-2xl ">ℑ𝔫𝔰𝔱𝔞𝔤𝔯𝔞𝔪</h1>

    <div className=" flex items-center gap-5 ">
      
     <div className="relative" onClick={notificationSymbolHandler}>
     <Heart className="cursor-pointer"/>
     {showLikeNotifcationBadge && <span className="text-red-600 absolute left-3 bottom-[0.7rem]">< GoDotFill size={'18px'}/></span>}
     </div>
     
      
     <div className="relative">
     {/* <MessageCircle onClick={messageSymbolClickHandler}/> */}
     <PiMessengerLogo size={'24px'} className="font-bold cursor-pointer"  onClick={messageSymbolClickHandler}/>
     <p className={`bg-red-600 absolute left-3 bottom-[0.8rem]  rounded-full text-darkTheme-mainText text-[9px] font-semibold w-4 h-4 text-center ${ messageNotifications?.length>0  ?'opacity-100':'opacity-0'} transition-opacity duration-200 ease-linear justify-center flex items-center`}>{messageNotifications?.length>0 && messageNotifications?.length>99?'99+':messageNotifications?.length}</p>
     </div>


    </div>

  </div>

</div>

    </>
  )
}

export default MobileHeader