import { Link, useNavigate } from "react-router-dom"
import ChatSideBar from "./chatSideBar"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { setNotificationActive } from "@/redux/NotificationSlice"
import NotAvailable from "./NotAvailable"
import { MdOutlineKeyboardArrowLeft } from "react-icons/md"

function NotificationMenu(){
 const navigate=useNavigate()
 const dispatch=useDispatch()
  const { likeCommentFollowNotifications}=useSelector((store)=>store.notifications)
  const clickToProfile=(id)=>{
    dispatch(setNotificationActive(false))
    navigate(`/profile/${id}`)
                   
  }

  const clickToShowPost=(postId)=>{
    
    navigate(`/post/${postId}`)
    dispatch(setNotificationActive(false))


  }
  return (
    <>

<div className="sm:hidden fixed top-0 w-full z-40  dark:bg-darkTheme-priBack bg-lightTheme-priBack  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  ">
          <Link to={'/'} className="absolute left-3"><MdOutlineKeyboardArrowLeft size={'40px'} /></Link>
          {/* <MoveLeft className="absolute left-4"/> */}
          
            <span className="dark:text-darkTheme-mainText  text-xl ">
              Notifications
              </span>
       </div>
{/* Upper div is for mobile view only */}

    <div className=" bg-lightTheme-priBack mt-10     sm:mt-0  dark:bg-darkTheme-priBack h-screen dark:text-darkTheme-mainText sm:w-[28rem] ">
          <div className="flex ">
         
           <div className="hidden sm:block"><ChatSideBar/></div>
           

           
             <div className="flex-1 sm:overflow-y-auto  scrollbar-none scroll-smooth h-screen   " >
             <h1 className="text-2xl font-bold my-8 px-4 sm:block hidden">Notifications</h1>
             <div className="border-t    border-gray-300 dark:border-[#262626]  sm:block hidden"></div>
             <div className="flex flex-col gap-4 my-8 px-4 overflow-y-auto scrollbar-none scroll-smooth sm:overflow-y-hidden pb-8 sm:pb-0 dark:bg-darkTheme-priBack bg-lightTheme-priBack " >
             {
              likeCommentFollowNotifications?.length>0 && likeCommentFollowNotifications?.map((noti,index)=>{
                return(
                  <div key={index} className="flex justify-between items-center w-full  ">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div onClick={()=>clickToProfile(noti?.userId)} >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={
                          noti?.user?.profilePicture ||
                          "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                        }
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    
                  </div>

              
                    <div
                  
                      onClick={()=>clickToProfile(noti?.userId)} 
                      className="dark:text-darkTheme-mainText  cursor-pointer"
                      
                    >
                      <p className="font-semibold text-[15px]">{noti?.user?.username} <span className="font-normal cursor-pointer break-words ">{`${noti?.message}.`}</span></p>
                      
                    </div>
            
                </div>
               

              <div className="md:min-w-9 md:min-h-9 max-w-9 max-h-9 cursor-pointer sm:ml-[0.1rem]" onClick={()=>{clickToShowPost(noti?.post?._id)}}>
                {
                  noti.type!=='follow' && <img className=" aspect-square rounded-lg object-cover" src={noti?.post?.image} alt="post" loading="lazy"/>
                }
              </div>
              </div>
                )
              })
             }
              

           
             </div>
             {
              likeCommentFollowNotifications.length==0 && <p className="flex justify-center items-center dark:text-darkTheme-placeholder text-lightTheme-placeholder ">No Notifications</p>
             }

             </div>
             {/* {
              likeCommentFollowNotifications.length==0 && <p className="px-0 my-auto absolute top-[50%] left-[48%] dark:text-darkTheme-placeholder text-lightTheme-placeholder ">No Notifications</p>
             } */}
          </div>

        

    </div>
    
    </>
  )
}

export default NotificationMenu