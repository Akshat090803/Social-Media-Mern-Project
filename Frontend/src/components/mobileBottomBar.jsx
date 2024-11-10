
import { setSearchActive } from "@/redux/searchPageSlice";
import { setScrollPosition } from "@/redux/userAuthSlice";
import { setPost } from "@/redux/userPostSlice";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
import { Compass, Home, PlusSquare, Search } from "lucide-react";
import { lazy, Suspense, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingPage from "./loadingPage";
// import CreatePost from "./createPost";
const CreatePost=lazy(()=>import('./createPost'))

function MobileBottomBar() {
  const { user,scrollPosition } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
  //this is to check if we are already on home page url and we click on home we will scroll to top of the home page
  const { pathname } = useLocation();
  //scroll to top logic is at bottombarclickhander if label===home part

  let bottomBarItems = [
    {
      label: "Home",
      icon: <Home size={30} />,
    },
    {
      label: "Search",
      icon: <Search size={30} />,
    },
    {
      label: "Create",
      icon: <PlusSquare size={30} />,
    },
    {
      label: "Explore",
      icon: <Compass size={30} />,
    },
    {
      label: "Profile",
      icon: (
        <Avatar className="h-8 w-8">
          <AvatarImage
            className="h-8 w-8 rounded-full"
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
  ];

 
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

//this for opening create post dialog
const [openCreate, setOpenCreate] = useState(false);

  const bottomBarHandler = (labelText) => {
    if (labelText === "Create") {
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
    } else if (labelText === "Explore") {
      navigate("/explore");
    } else if (labelText === "Search") {
      dispatch(setSearchActive(false));
      navigate('/search')
    }
  };

  return (
    <>
      <div className="dark:text-darkTheme-mainText    dark:bg-darkTheme-priBack bg-lightTheme-priBack  ">
        <div className=" flex items-center py-3  w-full justify-around gap-3 px-2">
          {bottomBarItems.map((item, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  bottomBarHandler(item.label);
                }}
              >
                {" "}
                <span className="">{item.icon}</span>
              </button>
            );
          })}
        </div>
        <div className="">
          <Suspense fallback={<LoadingPage/>}><CreatePost openCreate={openCreate} setOpenCreate={setOpenCreate} /></Suspense>
        </div>
      </div>
    </>
  );
}
export default MobileBottomBar;
