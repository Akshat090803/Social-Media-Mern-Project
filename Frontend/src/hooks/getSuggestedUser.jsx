import { setSuggestedUser } from "@/redux/userAuthSlice";

import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


function getSuggestedUsers(){
  const dispatch=useDispatch()
  axios.defaults.baseURL = 'https://social-media-mern-project.onrender.com/api/v1'; // Set your default base URL here
 useEffect(()=>{
  const fetchSuggestedUsers=async()=>{
              try {
                const response=await axios.get('/user/suggested',{withCredentials:true})
              
                if(response.data.success){
                              dispatch(setSuggestedUser(response.data.users))
                              
                             
                }
                
              } catch (error) {
                 
              }
  }
   fetchSuggestedUsers()
 },[dispatch])
}

export default getSuggestedUsers