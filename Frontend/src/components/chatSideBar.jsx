import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";
import {
  logOutUser,
  setScrollPosition,
  setSelectedUser,
  setUserProfile,
} from "@/redux/userAuthSlice";
import CreatePost from "./createPost";
// const CreatePost=lazy(()=>import('./createPost'))

import { setPost, setSelectedPost } from "@/redux/userPostSlice";
import { BsInstagram } from "react-icons/bs";
import {
  setLikeNotificationBadge,
  setNotificationActive,
} from "@/redux/NotificationSlice";
import { GoDotFill } from "react-icons/go";
import { Button } from "./ui/button";
import { setSearchActive } from "@/redux/searchPageSlice";

function ChatSideBar() {
  const { user ,scrollPosition} = useSelector((store) => store.auth);
  const { NotificationActive, showLikeNotifcationBadge, messageNotifications } =
    useSelector((store) => store.notifications);
  const dispatch = useDispatch();
  const { searchActive } = useSelector((store) => store.search);
  const loc = useLocation();
  const [chatPage, setChatPage] = useState(loc.pathname.includes("/chat"));
  useEffect(() => {
    setChatPage(loc.pathname.includes("/chat"));
  }, [loc]);

  axios.defaults.baseURL = "http://localhost:8080/api/v1"; // Set your default base URL here
  const navigate = useNavigate();

  const [openCreate, setOpenCreate] = useState(false);

  let sideBarItems = [
    {
      label: "Home",
      icon: <Home />,
    },
    {
      label: "Search",
      icon: <Search />,
    },
    {
      label: "Explore",
      icon: <Compass />,
    },
    {
      label: "Messages",
      icon: <MessageCircle />,
    },
    {
      label: "Notifications",
      icon: <Heart />,
    },
    {
      label: "Create",
      icon: <PlusSquare />,
    },
    {
      label: "Profile",
      icon: (
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={
              user?.profilePicture ||
              "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
            }
            alt="profile"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    {
      label: "Logout",
      icon: <LogOut />,
    },
   
  ];

  //this is to check if we are already on home page url and we click on home we will scroll to top of the home page
  const { pathname } = useLocation();
  //scroll to top logic is sidebarclickhander if label===home part

  const logoutHandler = async () => {
    try {
      const response = await axios.get("/user/logout", {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
        dispatch(logOutUser());
        dispatch(setPost([]));
        dispatch(setSelectedPost(null));
        dispatch(setSelectedUser(null));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

    //this is when when are on top scrol-0 and we again click home than load new posts if there
const loadAllPost=async()=>{
  try {
    const response=await axios.get('/post/all',{withCredentials:true})
         

    if(response.data.success){
                  dispatch(setPost(response.data.posts))
                  
                 
    }


    
  } catch (error) {
   
  }
}


  const sideBarHandler = (labelText) => {
    if (labelText === "Logout") {
      logoutHandler();
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
    } else if (labelText === "Create") {
      setOpenCreate(true);
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
    } else if (labelText === "Profile") {
      navigate(`/profile/${user?._id}`);
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
    } else if (labelText === "Home") {
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
      if (pathname === "/") {
        if(scrollPosition===0){
          // window.location.reload()
          loadAllPost()
        
       
        }else{
          dispatch(setScrollPosition(0));
          window.scrollTo(0, 0);
          
        }
      } else {
        navigate("/");
      }
    } else if (labelText === "Messages") {
      navigate("/chat");
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
    }  else if (labelText === "Explore") {
      navigate("/explore");
      dispatch(setNotificationActive(false));
      dispatch(setSearchActive(false));
    } else if (labelText === "Notifications") {
      dispatch(setNotificationActive());
      dispatch(setLikeNotificationBadge(false));
      dispatch(setSearchActive(false));
    } else if (labelText === "Search") {
      dispatch(setSearchActive());
      dispatch(setNotificationActive(false));
    }
  };
  return (
    <>
      <div
        className={`bg-lightTheme-priBack dark:bg-darkTheme-priBack w-20 h-screen border-r border-gray-300 dark:border-[#262626]  `}
      >
        <div className="flex flex-col justify-center ">
          <Link
            to={"/"}
            className="my-5 pl-6 pr-3 py-4  cursor-pointer dark:text-darkTheme-mainText "
          >
            <BsInstagram size={"24px"} className="hover:animate-spin" />
          </Link>

          {sideBarItems.map((item, index) => {
            return (
              <button
                onClick={() => {
                  sideBarHandler(item.label);
                }}
                key={index + item.label}
                className={`dark:focus:bg-darkTheme-badgeBg ${
                  chatPage &&
                  !NotificationActive &&
                  index === 3 &&
                  "dark:bg-darkTheme-badgeBg"
                } ${
                  NotificationActive &&
                  index === 4 &&
                  "dark:bg-darkTheme-badgeBg"
                }
                  ${
                    searchActive && index === 1 && "dark:bg-darkTheme-badgeBg"
                  }  w-fit cursor-pointer h-12 my-[2px] ml-3 pl-3 pr-3 rounded-md  hover:bg-lightTheme-tabHover dark:hover:bg-darkTheme-tabHover mb-3 transition-all focus:${
                  index !== 3 && "font-bold"
                }`}
                style={{ transition: "background-color 0.2s linear" }}
              >
                <div className="flex relative items-center py-3 group ">
                  <span
                    className={`dark:text-darkTheme-mainText ${
                      index === 6 || index === 4 || index === 3
                        ? ""
                        : "group-hover:animate-spin"
                    }`}
                  >
                    {item.icon}
                  </span>
                  {showLikeNotifcationBadge && index === 4 && (
                    <span className="text-red-600 absolute left-3 top-[0.45rem]">
                      <GoDotFill size={"18px"} />
                    </span>
                  )}

                  <p
                    className={`bg-red-600 absolute left-3 top-[0.45rem]  rounded-full text-darkTheme-mainText text-[10px] font-semibold w-5 h-5 text-center ${
                      messageNotifications?.length > 0 && index === 3
                        ? "opacity-100"
                        : "opacity-0"
                    } transition-opacity  justify-center flex items-center`}
                  >
                    {messageNotifications?.length > 0 &&
                    messageNotifications?.length > 99
                      ? "99+"
                      : messageNotifications?.length}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div className="">
          <CreatePost openCreate={openCreate} setOpenCreate={setOpenCreate} />
        </div>
      </div>
    </>
  );
}

export default ChatSideBar;
