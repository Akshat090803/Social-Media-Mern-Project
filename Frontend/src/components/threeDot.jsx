import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

import { Button } from "./ui/button";

import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import { act, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, setSelectedPost } from "@/redux/userPostSlice";
import { setFollowing } from "@/redux/userAuthSlice";
import { Link } from "react-router-dom";

function ThreeDot({ openThreeDot, setOpenThreeDot, isLegal, postID,bookmarkHandler}) {
  axios.defaults.baseURL = "http://localhost:8080/api/v1"; // Set your default base URL here
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);
  const { selectedPost } = useSelector((store) => store.Posts);
  const [loading, setLoading] = useState(false);

  const postDeleteHandler = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/post/delete/${postID}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setOpenThreeDot(false);
        dispatch(deletePost(postID));
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  //is following ,followBack or follow logic
  const [isFollowing, setIsFollowing] = useState();
  useEffect(() => {
    setIsFollowing(user?.following.includes(selectedPost?.author._id));
  }, [selectedPost,user]);
  
   const clickToFollow = async () => {
    try {
   
    setLoading(true)
    const response=await axios.post(`/user/followorunfollow/${selectedPost?.author._id}`,{},{
      headers:{
         'Content-Type':'application/json'
      },
      withCredentials:true
     })
 
     if(response.data.success){
   
      dispatch(setFollowing({
        type:'rightSidebar',
        id:selectedPost?.author._id,
        action:response.data.action
      }))
      // setOpenThreeDot(false)
      toast.success(response.data.message)

     }
     } catch (error) {
               toast.error(error?.response?.data?.message)
              
     }finally{setLoading(false)}
     
  };

  return (
    <>
      <Dialog open={openThreeDot}>
        <DialogContent
          onInteractOutside={() => setOpenThreeDot(false)}
          className=" bg-white dark:bg-darkTheme-dialog sm:w-full w-80 rounded-lg"
        >
          <DialogTitle className="hidden"> Your Dialog Title </DialogTitle>
          <Description className="hidden">Create Post </Description>

          <div >
            <div className="flex flex-col items-center text-center">
              {isLegal ? (
                <Button
                disabled={loading? true : false}
                  onClick={postDeleteHandler}
                  variant="ghost"
                  className={`mb-2 text-[#ED4956] dark:bg-darkTheme-dialog cursor-pointer w-full font-bold bg-transparent hover:text-[#ED4956] hover:bg-transparent dark:hover:text-[#ED4956] dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover  `}
                >
                  {loading ? (
                    <span className="loading loading-infinity loading-lg"></span>
                  ) : (
                    "Delete"
                  )}
                </Button>
              ) : (
                <Button
                
                disabled={loading? true : false}
                onClick={clickToFollow}
                  variant="ghost"
                  className={`mb-2  focus-visible:ring-transparent text-[#ED4956] dark:bg-darkTheme-dialog cursor-pointer w-full font-bold bg-transparent hover:text-[#ED4956] hover:bg-transparent dark:hover:text-[#ED4956] dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover   `}
                >
                {isFollowing?'Unfollow':user?.followers.includes(selectedPost?.author._id)?'Follow back':'Follow'}
                </Button>)
              }
              <Button
               disabled={loading? true : false}
                variant="ghost"
                
               onClick={()=>{bookmarkHandler(); setOpenThreeDot(false)}}
                className="mb-2  font-medium dark:bg-darkTheme-dialog cursor-pointer w-full dark:text-darkTheme-mainText bg-transparent  hover:bg-transparent dark:hover:text-darkTheme-mainText dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
              >
                {
                  user?.bookmarks.includes(selectedPost?._id)?'Remove from favourites':'Add to favourites'
                }
              </Button>

              <Link to={`/profile/${selectedPost?.author?._id}`}>
              <Button
               disabled={loading? true : false}
                variant="ghost"
                className="mb-2  font-medium dark:bg-darkTheme-dialog cursor-pointer w-full dark:text-darkTheme-mainText bg-transparent  hover:bg-transparent dark:hover:text-darkTheme-mainText dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
              >
                About this account
              </Button>
              </Link>

              <Button
               disabled={loading? true : false}
                onClick={() => setOpenThreeDot(false)}
                variant="ghost"
                className="  font-medium dark:bg-darkTheme-dialog cursor-pointer w-full dark:text-darkTheme-mainText bg-transparent  hover:bg-transparent dark:hover:text-darkTheme-mainText dark:hover:bg-transparent active:bg-gray-200 dark:active:bg-darkTheme-btnHover"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default ThreeDot;
