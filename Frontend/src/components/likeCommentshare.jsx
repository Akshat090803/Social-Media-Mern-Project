import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";
import { CiBookmark } from "react-icons/ci";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import CommentDialogBox from "./CommentDialogBox";
import { useState } from "react";

function LikeCommentShare({dialogHandler}){
 
 
  return(
    
    <>
    <div className="flex justify-between  mt-3 mb-2">
          <div className="flex gap-3 items-center pl-4 sm:pl-0">
            <FaRegHeart
              size={"24px"}
              className=" dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500"
            />
            <MessageCircle onClick={dialogHandler} className="dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500" />
            <Send className="dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500" />
          </div>
          <Bookmark className="dark:text-darkTheme-mainText cursor-pointer mr-[1.2rem] sm:-mr-1 hover:text-gray-500" />
        </div>
        <span className="dark:text-darkTheme-mainText cursor-pointer font-semibold block pl-3 sm:pl-0">
          1K likes
        </span> 

       
    </>
  )
}

export default LikeCommentShare