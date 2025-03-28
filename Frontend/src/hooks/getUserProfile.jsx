import {  setUserProfile } from "@/redux/userAuthSlice";

import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


function useGetUserProfile(userId){
  const dispatch=useDispatch()
  const [profileLoading, setProfileLoading] = useState(true);
  const { user } = useSelector((store) => store.auth);
  
  axios.defaults.baseURL = 'https://social-media-mern-project.onrender.com/api/v1'; // Set your default base URL here
 useEffect(()=>{
  const fetchUserProfile=async()=>{
              try {
                setProfileLoading(true)
                
                const response=await axios.get(`/user/${userId}/profile`,{withCredentials:true})
            
              
                if(response.data.success){

                 
                              dispatch(setUserProfile(response.data.user))
                              setProfileLoading(false); 
                             
                             
                }
                
              } catch (error) {
                console.error("Error fetching profile:", error);
                setProfileLoading(false); 
               
              }
  }
   fetchUserProfile()
  

     return ()=>{
       dispatch(setUserProfile(null))
      }
  
 },[userId,user]);

 return { profileLoading };
}

export default useGetUserProfile