import { useDispatch, useSelector } from "react-redux";

import { Link, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";
import { Dot } from "lucide-react";
import { GoDotFill } from "react-icons/go";
import { FaArrowLeftLong } from "react-icons/fa6";
import { PiMessengerLogoLight } from "react-icons/pi";
import ChatSideBar from "./chatSideBar";
import {
  setMessageNotificationsRemoveFromUser,
  setSelectedUser,
} from "@/redux/userAuthSlice";
import {
  setMessageNotifications,
  setMessageNotificationsRemove,
} from "@/redux/NotificationSlice";
import axios from "axios";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { TbArrowLeftToArc } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";

function ChatPage() {
  axios.defaults.baseURL = "http://localhost:8080/api/v1"; // Set your default base URL here
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loc = useLocation();
  const { user, suggestedUser, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers } = useSelector((store) => store.chat);
  const { messageNotifications } = useSelector((store) => store.notifications);

  //for search bar
  const [searchInputvalue, setSearchInputValue] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const searchInputHandler = (e) => {
    const text = e.target.value.trim();
    let filtered;
    if (text) {
      setSearchInputValue(text);
      filtered = suggestedUser.filter((item) => {
        return item.username.includes(text);
      });

     

      setSearchedUsers(filtered);
     
    } else {
      setSearchInputValue("");
      setSearchedUsers([]);
    }
  };
  
  


  //for online offline
  let isActive;

  const selectUserForChat = async (selectedUser) => {
    try {
      dispatch(setSelectedUser(selectedUser));
      navigate(`/chat/${selectedUser?._id}`);
     
      const response = await axios.patch(
        "/user/removeid",
        { removeId: selectedUser?._id },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
            setSearchInputValue('')
        dispatch(setMessageNotificationsRemove(selectedUser?._id));
        dispatch(setMessageNotificationsRemoveFromUser(selectedUser?._id));
      }
    } catch (error) {}
  };



  return (
    <>
      <div className="overflow-x-hidden">
      <div className="sm:hidden fixed z-40 w-full  top-0  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  dark:bg-darkTheme-priBack bg-lightTheme-priBack">
        <Link to={"/"} className="absolute left-3">
          <MdOutlineKeyboardArrowLeft size={"40px"} />
         {/* <FaArrowLeftLong size={"24px"}/> */}
        </Link>
       

        <Link to={`/profile/${user?._id}`}><span className="dark:text-darkTheme-mainText  text-xl ">
          {user?.username}
        </span></Link>
      </div>
      {/* Upper div is for mobile view only */}

      <div className={`flex  relative z-10  bg-lightTheme-priBack  dark:bg-darkTheme-priBack h-screen dark:text-darkTheme-mainText `}>
        <div className="hidden sm:block">
          <ChatSideBar />
        </div>
        {/* chat list */}
        <div className="border-r border-gray-300 dark:border-[#262626] sm:overflow-y-auto    scrollbar-none scroll-smooth">
          <section className="w-screen sm:w-[22.82rem]  flex flex-col items-start  ">
            <Link to={`/profile/${user?._id}`} className="fixed bg-lightTheme-priBack w-[22.82rem] dark:bg-darkTheme-priBack z-50 text-xl hidden sm:block px-6 pt-8 pb-4 font-bold">
              {user?.username}
            </Link>
            {/* search bar than in ternary see code  */}
            <div className="mt-20 sm:mt-24  md:pl-3 md:pr-3 pl-4 pr-[17px] w-full  ">
              <input
              
                value={searchInputvalue}
                placeholder="Search..."
                className="w-full mb-8 dark:bg-darkTheme-badgeBg py-2 px-2 outline-none rounded-md placeholder:dark:text-darkTheme-placeholder bg-[#efefef]"
                type="text"
                onChange={searchInputHandler}
              />
            </div>
            
            {
              searchInputvalue ?(
                !searchedUsers.length  ? (
                  <p className="dark:text-darkTheme-placeholder text-sm flex-grow flex justify-center items-center w-full ">
                    No user found
                  </p>
                ) : (
                  searchedUsers.map((item, index) => {
                    return (
                      <div 
                      onClick={() => selectUserForChat(item)}
                        key={index}
                        className="flex justify-between items-center w-full cursor-pointer py-2  pl-3 sm:pl-6"
                      >
                        
                        <div className="flex items-center gap-3">
                          <div
                          >
                            <Avatar className="sm:h-14 sm:w-14 h-12 w-12">
                              <AvatarImage
                                src={
                                  item?.profilePicture ||
                                  "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                                }
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                          </div>
  
                          <div>
                            <div
                              className="dark:text-darkTheme-mainText text-sm font-semibold"
                            
                            >
                              <p>{item?.username}</p>
                            
                            <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm">
                              {item?.fullName}
                            </p>
                            </div>
                          </div>
                         
                        </div>
                       
                      </div>
                    );
                  }))
              ):(
                <>
                <h2 className="font-bold mx-4 sm:mx-6  text-xl sm:text-lg ">Messages</h2>
             
            

             <div className="mt-6 flex flex-col gap-1 mb-6 scrollbar-none scroll-smooth">
               {suggestedUser.map((suggested, index) => {
                 isActive = onlineUsers.includes(suggested?._id);
 
                 return (
                   <div
                     className="cursor-pointer sm:hover:bg-lightTheme-tabHover  sm:dark:hover:bg-darkTheme-tabHover py-2  pl-4 sm:pl-6 "
                     key={index + suggested?._id}
                     onClick={() => {
                       selectUserForChat(suggested);
                     }}
                   >
                     <div className="flex items-center justify-between w-[20.82rem]   ">
                       <div className="flex gap-3 items-center relative ">
                         <Link>
                           <Avatar className="sm:h-14 sm:w-14 h-12 w-12 cursor-pointer ">
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
                           <Link>
                             <p className="dark:text-darkTheme-mainText text-sm font-semibold">
                               {suggested?.username}
                             </p>
                           </Link>
                           <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm ">
                             {suggested?.fullName || "NA"}
                           </p>
                         </div>
                         <GoDotFill
                           size={"15px "}
                           className={`absolute sm:left-10 sm:top-10 left-8 top-8 bg-white rounded-full p-0  z-10 ${
                             isActive ? "text-green-500 " : "text-red-500"
                           }`}
                         ></GoDotFill>
                         {/* <div className="bg-white h-4 w-4 absolute top-10 left-10 rounded-full"> </div> */}
                       </div>
                       {messageNotifications?.includes(suggested?._id) && (
                         <p className="dark:text-darkTheme-btnBlue text-lightTheme-btnBlue font-medium cursor-pointer text-xs ">
                           <Dot className="h-11 w-11 " />
                         </p>
                       )}
                     </div>
                   </div>
                 );
               })}
             </div>
                </>
              )
            }


            
          </section>
        </div>

        {/* if path is /chat/:id than chatting window .jsx through Outlet */}
      
       <Outlet />
      

        {/* if url loaction ===/chart than below */}
        {loc.pathname === "/chat" && (
          <div className="sm:flex flex-col justify-center items-center mx-auto hidden ">
            <PiMessengerLogoLight size={"115px"} />
            <p className="text-lg mt-3">Your messages</p>
            <p className="text-sm mt-1 dark:text-darkTheme-placeholder text-lightTheme-placeholder ">
              Send a message to start a chat
            </p>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
export default ChatPage;
