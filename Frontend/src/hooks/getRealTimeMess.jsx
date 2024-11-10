import { setMessages } from "@/redux/chatSlice";
import { setMessageNotifications } from "@/redux/NotificationSlice";

import { setPost } from "@/redux/userPostSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";


function useGetRTM(){
  const dispatch=useDispatch()
  
  const {messages}=useSelector
  (
    (store) => store.chat
  );

  const {socket}=useSelector((store)=>store.socketio)

  

 useEffect(()=>{
  const fetchRealTimeMess=async()=>{
              try {
               socket?.on('newMessage',(newMessage)=>{
                dispatch(setMessages([...messages,newMessage]))
                // dispatch(setMessageNotifications(newMessage.senderId))
                
                
               })

               return ()=>{
                   socket?.off('newMessage')
               }
                
              } catch (error) {
                 
              }
  }
   fetchRealTimeMess()
 },[messages,setMessages])
}

export default useGetRTM