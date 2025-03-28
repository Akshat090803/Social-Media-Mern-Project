import {   useState } from "react";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


import {
  Link,
 
  useLocation,
  useNavigate,
 
} from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { LogOut } from "lucide-react";

import {
  logOutUser,
  setScrollPosition,
  setSelectedUser,
  setSuggestedUser,

} from "@/redux/userAuthSlice";
import CreatePost from "./createPost";
// const CreatePost=lazy(()=>import('./createPost'))
import { setPost, setSelectedPost } from "@/redux/userPostSlice";


import {
  
  setLikeNotificationBadge,
 
  setNotificationActive,
} from "@/redux/NotificationSlice";
import { GoDotFill } from "react-icons/go";
import { setSearchActive } from "@/redux/searchPageSlice";

function SideBar() {
  const { user ,scrollPosition} = useSelector((store) => store.auth);
  const { showLikeNotifcationBadge, messageNotifications } = useSelector(
    (store) => store.notifications
  );
  const dispatch = useDispatch();

  //this is to check if we are already on home page url and we click on home we will scroll to top of the home page
  const { pathname } = useLocation();
  //scroll to top logic is at sidebarclickhander if label===home part

  axios.defaults.baseURL = "https://social-media-mern-project.onrender.com/api/v1"; // Set your default base URL here
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

        dispatch(setSuggestedUser([]));
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
     console.log(error)
  }
}


  const sideBarHandler = (labelText) => {
    if (labelText === "Logout") {
      logoutHandler();
    } else if (labelText === "Create") {
      setOpenCreate(true);
    } else if (labelText === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (labelText === "Home") {
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
    } else if (labelText === "Notifications") {
      dispatch(setNotificationActive());
      dispatch(setLikeNotificationBadge(false));
    } else if (labelText === "Explore") {
      navigate("/explore");
    } else if (labelText === "Search") {
      dispatch(setSearchActive());
    }
  };
  return (
    <>
      <div
        className={`bg-lightTheme-priBack dark:bg-darkTheme-priBack w-64 h-screen border-r border-gray-300 dark:border-[#262626]   `}
      >
        <div className="flex flex-col ">
          <Link
            to={"/"}
            className="cursor-pointer font-semibold text-3xl my-5 pl-6 pr-3 py-4   text-black dark:text-darkTheme-mainText"
          >
            ℑ𝔫𝔰𝔱𝔞𝔤𝔯𝔞𝔪
          </Link>

          {sideBarItems.map((item, index) => {
            return (
              <button
                onClick={() => {
                  sideBarHandler(item.label);
                }}
                key={index + item.label}
                className={`w-56 cursor-pointer h-12 my-[2px] ml-3 pl-3 pr-3 rounded-md  hover:bg-lightTheme-tabHover dark:hover:bg-darkTheme-tabHover mb-3 transition-all focus:${
                  index !== 3 && "font-bold"
                }`}
                style={{ transition: "background-color 0.2s linear" }}
              >
                <div className="flex relative items-center  group  ">
                  <span
                    className={`dark:text-darkTheme-mainText ${
                      index === 7 && "group-hover:animate-spin"
                    } `}
                  >
                    {item.icon}
                  </span>

                  <p className="dark:text-darkTheme-mainText pl-4 ">
                    {item.label}
                  </p>

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
                    } transition-opacity duration-200 ease-linear justify-center flex items-center`}
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

export default SideBar;
