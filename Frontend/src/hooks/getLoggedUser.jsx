

import { setAuthUser } from "@/redux/userAuthSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";


function useGetLoggedUser(userId){
  const dispatch=useDispatch()
  const { user } = useSelector((store) => store.auth);
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
 useEffect(()=>{
  const fetchLoggedUser=async()=>{
              try {
                const response=await axios.get(`/user/getuser/${user._id}`,{withCredentials:true})
            
                
                if(response.data.success){

                 
                              dispatch(setAuthUser(response.data.user))
                             
                             
                }
                
              } catch (error) {
                 
                 if(error.response.data.message==='Authentication Token Not Found.'){
                  dispatch(setAuthUser(null))
                 }
              }
  }
   fetchLoggedUser()
  
 },[])
}

export default useGetLoggedUser