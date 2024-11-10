import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import axios from "axios";
import { setFollowing } from "@/redux/userAuthSlice";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Salad, SaladIcon } from "lucide-react";
import { FaCloudSunRain } from "react-icons/fa";
import { TbFaceIdError } from "react-icons/tb";
import { CiFaceFrown } from "react-icons/ci";
import NotAvailable from "./NotAvailable";

function SuggestedUser() {
  let { suggestedUser } = useSelector((store) => store.auth);
  const { user } = useSelector((store) => store.auth);
  axios.defaults.baseURL = "https://social-media-mern-project.onrender.com/api/v1"; // Set your default base URL here
  // Only those user in suggestion which are not followed by him
  const customSuggestedUser = suggestedUser.filter((notFollowed) => {
    return !user.following.includes(notFollowed?._id);
  });
const dispatch=useDispatch()

const [loading,setLoading]=useState(false)
  const clickToFollow = async (id) => {
    try {
      setLoading(true)
     const response=await axios.post(`/user/followorunfollow/${id}`,{},{
      headers:{
         'Content-Type':'application/json'
      },
      withCredentials:true
     })


     if(response.data.success){
      
      const {action} =response.data
 
      dispatch(setFollowing({
        type:'rightSidebar',
       id,
        followinguser:response.data.userForUserProfileUpdate,
        action:response.data.action
      }))
      
       toast.success(response.data.message)
     }

      
     } catch (error) {
               toast.error(error?.response?.data?.message)
     }finally{setLoading(false)}
     
  };
 const [noSuggestions,setNoSuggestions]=useState()

  useEffect(() => {
    setNoSuggestions(user.following.length === suggestedUser.length);
  }, [customSuggestedUser]);

  return (
    <>
      <div className="pl-4 pr-6 mt-4 flex flex-col gap-4 ">
        {
           noSuggestions && (
           <NotAvailable heading='Oopsie daisy! ' message='No recommended folks around here!' height={'64'}/>
           )
        }
        { customSuggestedUser.map((suggested, index) => {
          return (
            <div
              key={index + suggested?._id}
              className="flex items-center justify-between  "
            >
              <div className="flex gap-3 items-center ">
                <Link to={`/profile/${suggested?._id}`}>
                  <Avatar className="h-11 w-11 cursor-pointer ">
                    <AvatarImage
                      src={`${
                        suggested?.profilePicture ||
                        "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                      }`}
                      alt="profile_picture"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link to={`/profile/${suggested?._id}`}>
                    <p className="dark:text-darkTheme-mainText text-sm font-semibold">
                      {suggested?.username}
                    </p>
                  </Link>
                  <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm ">
                    {suggested?.fullName || "NA"}
                  </p>
                </div>
              </div>
              <p className={`dark:text-darkTheme-btnBlue text-lightTheme-btnBlue font-medium cursor-pointer dark:hover:text-darkTheme-mainText hover:text-lightTheme-termsCondition text-xs ${loading && 'pointer-events-none'}`} onClick={()=>{clickToFollow(suggested?._id)}}>
                Follow
              </p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default SuggestedUser;
