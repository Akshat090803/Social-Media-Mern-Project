import { setPost, setPostLoading } from "@/redux/userPostSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


function userAllPost(){
  const dispatch=useDispatch()
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
 useEffect(()=>{
  const fetchAllPost=async()=>{
              try {
                dispatch(setPostLoading(true))
                const response=await axios.get('/post/all',{withCredentials:true})
                

                if(response.data.success){
                              dispatch(setPost(response.data.posts))
                              
                              
                }
                
              } catch (error) {
               
              }finally{
                dispatch(setPostLoading(false))
              }
  }
   fetchAllPost()
 },[])
}

export default userAllPost