import {  setUserProfile } from "@/redux/userAuthSlice";

import axios from "axios";
import { useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";


function useGetUserProfile(userId){
  const dispatch=useDispatch()

  const { user } = useSelector((store) => store.auth);
  
  axios.defaults.baseURL = 'https://social-media-mern-project.onrender.com/api/v1'; // Set your default base URL here
 useEffect(()=>{
  const fetchUserProfile=async()=>{
              try {
               
                
                const response=await axios.get(`/user/${userId}/profile`,{withCredentials:true})
            
              
                if(response.data.success){

                 
                              dispatch(setUserProfile(response.data.user))
                              
                             
                             
                }
                
              } catch (error) {
                console.error("Error fetching profile:", error);
              
               
              }
  }
   fetchUserProfile()
  

     return ()=>{
       dispatch(setUserProfile(null))
      }
  
 },[userId,user]);

}

export default useGetUserProfile