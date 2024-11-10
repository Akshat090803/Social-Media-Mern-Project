
import { setLikeCommentFollowNotificationsFromDb } from "@/redux/NotificationSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";


function userGetAllNotifications(){
  const dispatch=useDispatch()
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
  const {user}=useSelector
  (
    (store) => store.auth
  );

 useEffect(()=>{
  const fetchAllNotifications=async()=>{
              try {
                const response=await axios.get(`/notification/getallnotifications`,{withCredentials:true})
              
              
                if(response.data.success){
                             
                              dispatch(setLikeCommentFollowNotificationsFromDb(response.data.notifications))
                              
                             
                }
                
              } catch (error) {
               
              }
  }
   fetchAllNotifications()
 },[user])
}

export default userGetAllNotifications