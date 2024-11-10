import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Message from "./message";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import userAllMessages from "@/hooks/getAllMessages";
import useGetRTM from "@/hooks/getRealTimeMess";
import { setMessageNotificationsRemove } from "@/redux/NotificationSlice";
import { setMessageNotificationsRemoveFromUser } from "@/redux/userAuthSlice";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";



function ChattingWindow() {
  
  
  const {selectedUser}=useSelector
  (
    (store) => store.auth
  );
  userAllMessages()
  useGetRTM()
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
  const {onlineUsers,messages}=useSelector((store)=>store.chat)
  const dispatch=useDispatch()

  

  const inputRef=useRef(null)
  
  

  const isActive=onlineUsers.includes(selectedUser?._id)

 

  //hnadler for showing Post option or not
  const [inputValue, setInputValue] = useState("");
  const handleChange = (e) => {
    if (e.target.value.trim()) {
      setInputValue(e.target.value);
      // e.target.style.height = (e.target.scrollHeight > 44 ? e.target.scrollHeight + 'px' : '44px');
      e.target.style.height = (e.target.scrollHeight > e.target.clientHeight ? e.target.scrollHeight + 'px' : '44px');
      e.target.style.borderRadius = (e.target.scrollHeight > e.target.clientHeight ? '0.75rem' : '9999px');
    
    } else {
      setInputValue("");
      e.target.style.height = 44 + 'px';
    }
    
    
  };

  const messageSubmitHandler=async ()=>{
             try {
              const response=await axios.post(`/message/send/${selectedUser?._id}`,{message:inputValue},{
                headers:{
                  "Content-Type":'application/json'
                },
                withCredentials:true
              });
      
              if(response.data.success){
                dispatch(setMessages([...messages,response.data.newMessage]))
                setInputValue('')
                inputRef.current.style.height = 44 + 'px';
                inputRef.current.style.borderRadius = '9999px'

              }
             } catch (error) {
              
             }
  }
  return (
    <>
      
          
 
      <section className={`flex-1 flex flex-col  w-full   text-darkTheme-mainText  `} >
        <div className="flex fixed z-40   dark:bg-darkTheme-priBack bg-lightTheme-priBack w-full  items-center gap-3 border-b border-gray-300 dark:border-[#262626] py-3 px-4">
        <Link to={'/chat'}><MdOutlineKeyboardArrowLeft className="sm:hidden " size={"40px"} /></Link>
          <Link>
            <Avatar className="h-10 w-10 cursor-pointer ">
              <AvatarImage
                src={`${
                  selectedUser?.profilePicture ||
                  "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                }`}
                alt="profile_picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <div>
            <p className="dark:text-darkTheme-mainText text-sm font-semibold text-black">
              {selectedUser?.fullName}
            </p>
            <p
              className={`text-[11px] font-bold ${
                isActive ? "text-green-600 " : "text-red-600"
              }`}
            >
              {isActive ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        {/* ---------------------------------------------- */}
        {/* messages */}
        <Message selectedUser={selectedUser} />
        {/* ------------------ */}
        {/* input */}
        <div className="w-full mb-16 sm:mb-0 ">
        <div className="flex justify-between items-center pt-2 pb-4 px-4 fixed bottom-0 sm:relative dark:bg-darkTheme-priBack  bg-lightTheme-priBack  w-full    ">
          <textarea
          ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            type="text"
            className="  w-full pl-6 pr-14 sm:pr-10 text-black   py-[0.7rem] h-11 max-h-20 resize-none rounded-full  outline-none  border border-gray-300 dark:border-[#262626] placeholder-lightTheme-placeholder dark:placeholder-darkTheme-placeholder dark:text-darkTheme-mainText text-sm bg-inherit "
            placeholder="Message..."
          />
          {inputValue && (
            <span
              className="text-lightTheme-btnBlue font-semibold text-sm  sm:mr-0 cursor-pointer absolute
               right-5 pr-4 "
               onClick={messageSubmitHandler}
            >
              Send
            </span>
          )}
        </div>
        </div>
      </section>
     
    
    </>
  );
}

export default ChattingWindow