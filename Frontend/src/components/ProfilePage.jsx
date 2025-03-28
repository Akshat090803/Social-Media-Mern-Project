import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LiaUserTagSolid } from "react-icons/lia";
import useGetUserProfile from "@/hooks/getUserProfile";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowLeft, Bookmark, Grid, Heart, LogOut, MessageCircle, MoveLeft } from "lucide-react";
import { BsGrid } from "react-icons/bs";
import { FaHeart, FaTags } from "react-icons/fa";
import { lazy, useEffect, useRef, useState } from "react";

import { logOutUser, setFollowing, setSelectedUser, setSuggestedUser, setUserProfile } from "@/redux/userAuthSlice";
import { setPost, setSelectedPost } from "@/redux/userPostSlice";
import axios from "axios";
import { toast } from "sonner";

import Following from "./following";
// const Following=lazy(()=>import('./following'))

import Followers from "./Followers";
// const Followers=lazy(()=>import('./followers'))

import NotAvailable from "./NotAvailable";
import { IoIosConstruct } from "react-icons/io";
import { CiCamera } from "react-icons/ci";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import MobileBottomBar from "./mobileBottomBar";
import LoadingPage from "./loadingPage";

function ProfilePage() {
  axios.defaults.baseURL = "https://social-media-mern-project.onrender.com/api/v1"; // Set your default base URL here
  const navigate=useNavigate()
  const params = useParams();
  const id=params.id
  useGetUserProfile(id);
 

  
  const { userProfile } = useSelector((store) => store?.auth);
  const { user } = useSelector((store) => store.auth);

const dispatch=useDispatch()
  // for active tab css
  const [activeTab, setActiveTab] = useState("posts");

  //for show following
  const[userFollowing,setUserFollowing]=useState(false)
  const activateFollowingDialog=()=>{
   
    if(userProfile?.following.length) setUserFollowing(true)  
  }

  //for show followers
  const[userFollowers,setUserFollowers]=useState(false)
  const activateFollowersDialog=()=>{
   
    if(userProfile?.followers.length) setUserFollowers(true)  
  }
   
  //for follow or  following
  const [isFollowing, setIsFollowing] = useState()
  useEffect(()=>{
    setIsFollowing(user?.following.includes(userProfile?._id))
  },[userProfile])


  const tabHandler = (tab) => {
    setActiveTab(tab);
  };

  const displayPost =  activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  //state for controlling caption lineclamp css
  const [lineClamp, setLineClamp] = useState(true);
  const [showMoreLink, setShowMoreLink] = useState(true);
  

  const paragraphRef = useRef(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (paragraph.scrollHeight > paragraph.clientHeight) {
      setShowMoreLink(true);
    }else{
      setShowMoreLink(false)
    }
    window.scrollTo(0,0);

    return ()=>{
      setShowMoreLink(false)
      
    }
  }, [userProfile]);

 

  //lineclamp visibility handler
  const linClampHandler = () => {
    setShowMoreLink(!showMoreLink);
    setLineClamp(!lineClamp);
  };

  const showSinglePost=(post)=>{
    // dispatch(setSelectedPost(post))
    navigate(`/post/${post._id}`)
    
  }

  const [loading,setLoading]=useState(false)

   const followUnfollowHandler=async()=>{
                     try {
                      setLoading(true)
                     const response=await axios.post(`/user/followorunfollow/${userProfile?._id}`,{},{
                      headers:{
                         'Content-Type':'application/json'
                      },
                      withCredentials:true
                     })


                     if(response.data.success){
                      
                      const {action} =response.data
                     
                      dispatch(setFollowing({
                        type:action,
                        userProfileId:userProfile?._id,
                        followinguser:response.data.userForUserProfileUpdate
                      }))
                       setIsFollowing(response.data.isFollowing)
                       toast.success(response.data.message)
                     }
                
                      
                     } catch (error) {
                               toast.error(error?.response?.data?.message)
                     }finally{setLoading(false)}
  }
   

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


 

  return (
    <>

   
        
              <div className="sm:hidden fixed top-0 w-full z-40  dark:bg-darkTheme-priBack bg-lightTheme-priBack  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  ">
          <Link to={'/'} className="absolute left-3"><MdOutlineKeyboardArrowLeft size={'40px'} /></Link>
           <LogOut  className={`absolute right-4 cursor-pointer ${userProfile?._id === user?._id  && "hidden"}`} onClick={logoutHandler}/>
          
            <span className="dark:text-darkTheme-mainText  text-xl ">
                {userProfile?.username}
              </span>
       </div>
           
{/* Upper div is for mobile view only */}

<div className="fixed bottom-0 z-50 sm:hidden w-full"><MobileBottomBar/></div>  {/*this is also for mobile view only */}


      <section className=" flex sm:justify-center justify-start   overflow-hidden sm:py-0 pt-12 ">
        <div className="flex ml-4 mr-[calc(10vh-20px)]  mt-4 sm:mr-6 sm:ml-[4rem] sm:my-10 sm:gap-28 gap-6 flex-grow sm:flex-grow-0 justify-between  sm:justify-normal sm:py-8  h-full sm:items-center">
          {/* <Avatar className=" h-[6rem] w-[6rem] sm:h-[10rem] sm:w-[10rem] cursor-pointer ">
            <AvatarImage
              src={`${
                userProfile?.profilePicture ||
                "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
              }`}
              alt="profile_picture"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar> */}
          <div className="h-[6rem] w-[6rem] sm:h-[10rem] sm:w-[10rem] cursor-pointer  rounded-full">
            <img  src={`${
                userProfile?.profilePicture ||
                "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
              }`} alt="profile_picture" className="rounded-full h-[6rem] w-[6rem] sm:h-[10rem] sm:w-[10rem] object-cover
              "/>
          </div>

          <div className=" flex flex-col gap-6 ">
            <div className=" flex items-center gap-6">
              <p className="dark:text-darkTheme-mainText  text-xl hidden  sm:block">
                {userProfile?.username}
              </p>

              {/* condition whether user and userProfile same or not  */}
              {userProfile?._id === user?._id ? (
                <div className="   hidden sm:flex gap-2 items-center">
                  <Link to={"/account/edit"}>
                    <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-fit px-4 rounded-lg py-1 dark:hover:bg-darkTheme-dialog bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover">
                      Edit profile
                    </button>
                  </Link>
                  <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-fit px-4 rounded-lg dark:hover:bg-darkTheme-dialog py-1 bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover"  onClick={()=>{alert('View archive is a dummy button')}}>
                    View archive
                  </button>
                </div>
              ) : (
                <div className=" hidden sm:flex gap-2 items-center">
                  <button
                     disabled={loading ? true :false}
                    className={`transition-all font-semibold  w-fit  px-4 rounded-lg py-1  ${
                      isFollowing
                        ? "dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg dark:hover:bg-darkTheme-dialog bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover"
                        : "bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover  dark:text-white  "
                    } ${loading && 'opacity-50 cursor-wait'}`}
                    onClick={followUnfollowHandler}
                  >
                     {
                       isFollowing
                       ? "Following"
                       : user?.followers.includes(userProfile?._id)
                       ? "Follow Back"
                       : "Follow"
                     }
                  </button>
                 <Link to={`/chat/${userProfile?._id}`}>
                 <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-fit px-4 rounded-lg dark:hover:bg-darkTheme-dialog py-1 bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover">
                    Message
                  </button>
                 </Link>
                </div>
              )}
            </div>

            {/*no. of post follower following  */}
            <div className=" flex items-center gap-6  sm:gap-11 text-center ">
              <p className="dark:text-darkTheme-mainText ">
                <span className="font-semibold block sm:inline">{`${userProfile?.posts.length} `}</span>
                posts
              </p>
              <p className="dark:text-darkTheme-mainText  cursor-pointer " onClick={activateFollowersDialog}>
                <span className="font-semibold block sm:inline">{`${userProfile?.followers.length} `}</span>
                followers
              </p>
              <p className="dark:text-darkTheme-mainText cursor-pointer " onClick={activateFollowingDialog}>
                <span className="font-semibold block sm:inline" >{`${userProfile?.following.length} `}</span>
                following
              </p>
              <Following  userFollowing={userFollowing} setUserFollowing={setUserFollowing}/>
              <Followers userFollowers={userFollowers} setUserFollowers={setUserFollowers}/>
            </div>
            {/* Full Name bio */}
            <div className="hidden sm:block">
              <p className="dark:text-darkTheme-mainText">
                {userProfile?.fullName}
              </p>
              <pre
                ref={paragraphRef}
                className={`dark:text-darkTheme-mainText font-sans max-w-[23rem]  overflow-hidden text-wrap  ${
                  lineClamp && "line-clamp-3" 
                }`}
              >
                {userProfile?.bio || "..."}
              </pre>
              {showMoreLink && (
                <span
                  className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer  sm:pl-0"
                  onClick={linClampHandler}
                >
                  more
                </span>
              )  }
               {lineClamp || (
                <span
                  className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer  sm:pl-0"
                  onClick={linClampHandler}
                >
                  less
                </span>
              )  }
             
            </div>
          </div>
          
        </div>
        
      </section>

{/* this div is for mobile view only  */}
     <div className="flex-col sm:hidden ">
     <div className=" mx-4 mt-2 mb-4">
              <p className="dark:text-darkTheme-mainText">
                {userProfile?.fullName}
              </p>
              <pre
                ref={paragraphRef}
                className={`dark:text-darkTheme-mainText font-sans max-w-[23rem]  overflow-hidden text-wrap  ${
                  lineClamp && "line-clamp-3" 
                }`}
              >
                {userProfile?.bio || "..."}
              </pre>
              {showMoreLink && (
                <span
                  className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer  sm:pl-0"
                  onClick={linClampHandler}
                >
                  more
                </span>
              )  }
               {lineClamp || (
                <span
                  className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer  sm:pl-0"
                  onClick={linClampHandler}
                >
                  less
                </span>
              )  }
             
            </div>

            <div className=" flex items-center px-4 ">
            {userProfile?._id === user?._id ? (
                <div className="  flex sm:hidden gap-2 items-center w-full">
                  <Link to={"/account/edit"} className="w-1/2">
                    <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-full px-4 rounded-lg py-1 dark:hover:bg-darkTheme-dialog bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover">
                      Edit profile
                    </button>
                  </Link>
                  <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg w-1/2 px-4 rounded-lg dark:hover:bg-darkTheme-dialog py-1 bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover" onClick={logoutHandler}>
                    Log Out
                  </button>
                </div>
              ) : (
                <div className=" flex sm:hidden gap-2 w-full  items-center">
                  <button
                     disabled={loading ? true :false}
                    className={`transition-all font-semibold  w-1/2  px-4 rounded-lg py-1  ${
                      isFollowing
                        ? "dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg dark:hover:bg-darkTheme-dialog bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover"
                        : "bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover  dark:text-white  "
                    } ${loading && 'opacity-50 cursor-wait'}`}
                    onClick={followUnfollowHandler}
                  >
                     {
                       isFollowing
                       ? "Following"
                       : user?.followers.includes(userProfile?._id)
                       ? "Follow Back"
                       : "Follow"
                     }
                  </button>
                 <Link to={`/chat/${userProfile?._id}`} className="w-1/2">
                 <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-badgeBg  w-full px-4 rounded-lg dark:hover:bg-darkTheme-dialog py-1 bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover">
                    Message
                  </button>
                 </Link>
                </div>
              )}
     </div>
     </div>

      {/* ------------------------------------------------------------------------------------------ */}

      {/* post section */}
      <section className="sm:pl-64 mt-10 min-h-screen max-h-full pb-9 overflow-hidden">
        <div className="border-t mx-auto   border-gray-300 dark:border-[#262626]  w-[55rem]  "></div>

        <div className={`flex justify-center ${userProfile?._id===user?._id ? 'gap-16':"gap-6"}  my-5 relative`}>
          {/* this div has 3 div */}

          {/* div1 */}
          <div
            className={`flex  items-center gap-1   cursor-pointer ${
              activeTab === "posts"
                ? "dark:text-darkTheme-mainText "
                : "dark:text-darkTheme-placeholder text-lightTheme-placeholder"
            } `}
            onClick={() => {
              tabHandler("posts");
            }}
          >
            <Grid className="  mt-[1px] p-0 m-0 h-3 w-3" />
            <span className=" text-sm">POSTS</span>
            {activeTab === "posts" && (
              <span className="border-t dark:border-darkTheme-mainText w-[3.67rem] border-black absolute -top-[21px] rounded-sm"></span>
            )}
          </div>
          {/* div 2 */}
          <div
            className={`flex  items-center gap-1  cursor-pointer ${
              activeTab === "saved"
                ? "dark:text-darkTheme-mainText "
                : "dark:text-darkTheme-placeholder text-lightTheme-placeholder"
            } `}
            onClick={() => {
              tabHandler("saved");
            }}
          >
           {
            userProfile?._id === user?._id && (

             <>
              <Bookmark className=" mt-[1px] p-0 m-0 h-3 w-3" />
              <span className=" text-sm">SAVED</span>
              {activeTab === "saved" && (
                <span className="border-t dark:border-darkTheme-mainText border-black w-[3.71rem] absolute -top-[21px] rounded-sm"></span>
              )}
             </>
            )
              
            
           }
          </div>

          {/*  div 3 */}
          <div
            className={`flex  items-center gap-1  cursor-pointer ${
              activeTab === "tagged"
                ? "dark:text-darkTheme-mainText "
                : "dark:text-darkTheme-placeholder text-lightTheme-placeholder"
            } `}
            onClick={() => {
              tabHandler("tagged");
            }}
          >
            <FaTags className="  mt-[1px] p-0 m-0 h-3 w-3" />
            <span className=" text-sm">TAGGED</span>
            {activeTab === "tagged" && (
              <span className="border-t dark:border-darkTheme-mainText border-black w-[4.33rem] absolute -top-[21px] rounded-sm"></span>
            )}
          </div>
        </div>

        {/* display posts in grid */}
        {
          activeTab==='tagged' ?(
            <NotAvailable  icon={ <IoIosConstruct size={'6rem'}/>} message={'In development phase!'} css={'mt-8'} messCss={'font-semibold text-xl'} />):(
              <>
              {
                displayPost?.length===0?(
                  <NotAvailable icon={<CiCamera size={'6rem'}/>} css={'mt-8'} message={'No Posts Yet'} messCss={'font-semibold text-xl'}/>
                  
                ):(
                  <div className="grid grid-cols-3 gap-1 max-w-[25rem] sm:max-w-[55rem] mx-auto">
                  {displayPost?.map((post, index) => {
                    return (
                      <div key={index} className="relative group cursor-pointer" onClick={()=>{showSinglePost(post)}}>
                        <img
                          className="aspect-square object-fill sm:rounded-sm  w-full"
                          src={post?.image}
                          alt="posts at user profile"
                          loading="lazy"
                        />
        
                        <div
                          className="absolute flex items-center justify-center bg-black bg-opacity-0 inset-0  
                          rounded-sm group-hover:bg-opacity-50 opacity-0 transition-opacity group-hover:opacity-100 duration-500"
                        >
                          <div className="flex items-center space-x-4">
                            <button className="text-darkTheme-mainText hover:text-darkTheme-placeholder flex items-center">
                              <Heart />
                              <span>{post?.likes.length}</span>
                            </button>
                            <button className="text-darkTheme-mainText hover:text-darkTheme-placeholder flex items-center">
                              <MessageCircle />
                              <span>{post?.likes.length}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                )
              }
              
            </>
            )
          
        }
       
      </section>
    </>
  );
}

export default ProfilePage;
