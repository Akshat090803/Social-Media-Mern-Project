import { setMessages } from "@/redux/chatSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function userAllMessages(){
  const dispatch=useDispatch()
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
  const {selectedUser}=useSelector
  (
    (store) => store.auth
  );

 useEffect(()=>{
  const fetchAllMessages=async()=>{
              try {
              
                const response=await axios.get(`/message/all/${selectedUser?._id}`,{withCredentials:true})
              
              
                if(response.data.success){
                              dispatch(setMessages(response.data.messages))
                              
                              
                             
                }
                
              } catch (error) {
                
              }finally{
                
              }
  }
   fetchAllMessages()
 },[selectedUser])
}

export default userAllMessages