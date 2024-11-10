import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BsBookmark,
  BsBookmarkCheckFill,
  BsBookmarkFill,
} from "react-icons/bs";

import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";

import { FaHeart, FaRegBookmark, FaRegHeart } from "react-icons/fa";

import { useEffect, useRef, useState } from "react";
import CommentDialogBox from "./CommentDialogBox";

import { useDispatch, useSelector } from "react-redux";

import ThreeDot from "./threeDot";
import axios from "axios";
import { toast } from "sonner";
import {
  updateComment,
  likeDislike,
  setSelectedPost,
} from "@/redux/userPostSlice";
import { setAuthUser, setFollowing, updateBookmark } from "@/redux/userAuthSlice";
import { Link } from "react-router-dom";

function Post({ post, index }) {
  axios.defaults.baseURL = "https://social-media-mern-project.onrender.com/api/v1"; // Set your default base URL here
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const {selectedPost}=useSelector((store)=>store.Posts)

  // state to check whether post already liked or not
  const [liked, setLiked] = useState(post?.likes.includes(user._id) || false);

  // state to check whether post already bookmarked or not
  const [bookmark, setBookmark] = useState(user?.bookmarks.includes(post?._id));

  // console.log(user.bookmarks)

  //state for comment dialog open close
  const [openComment, setOpenComment] = useState(false);

  const [openThreeDot, setOpenThreeDot] = useState(false);

  //state for controlling caption lineclamp css
  const [lineClamp, setLineClamp] = useState(true);

  //state and ref for controlling visbility of "more" in caption
  const paragraphRef = useRef(null);
  const [showMoreLink, setShowMoreLink] = useState(false);

  //useefect for "more"
  useEffect(() => {
    const paragraph = paragraphRef.current;

    if (paragraph.scrollHeight > paragraph.clientHeight) {
      setShowMoreLink(true);
    }
  }, []);

 

  //lineclamp visibility handler
  const linClampHandler = () => {
    setShowMoreLink(false);
    setLineClamp(false);
  };

  //state for type comment
  const [comments, setComments] = useState(post?.comments);
  const [inputValue, setInputValue] = useState("");

  //hnadler for showing Post option or not
  const handleChange = (e) => {
    if (e.target.value.trim()) {
      setInputValue(e.target.value);
    } else {
      setInputValue("");
    }
  };

  //handler for commnent dialog open close
  const dialogHandler = () => {
    setOpenComment(true);
    dispatch(setSelectedPost(post));
  };

  const threeDothandler = () => {
    setOpenThreeDot(true);
    dispatch(setSelectedPost(post));
  };

  //like-Dislike Post handler
  const likeDislikeHandler = async (e) => {
    try {
      const Action = liked ? "dislike" : "like";
      let { likes } = post;

      const response = await axios.patch(
        `/post/${post?._id}/${Action}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setLiked(!liked);
        //sending likes array to post slice of redux
        likes = liked
          ? likes.filter((l) => l !== user._id)
          : [user._id, ...likes];

        dispatch(likeDislike({ likes, index }));
        //we send index laso in dispatch as in redux store post is an array of all posts so index help in in identifying the required post
      }
    } catch (error) {
      
      toast.error(error.response.data.message);
    }
  };
  //bookmark
  const bookmarkHandler = async () => {
    try {
      // let {bookmarks}=user  //getting bookmark array fform loged in user
      let { bookmarks } = user;
      const id= post?._id
     
      const response = await axios.post(
        `/post/${id}/bookmark`,
        {},
        { withCredentials: true }
      );
    
      if (response.data.success) {
        toast.success(response.data.message);
        bookmarks = bookmark
          ? bookmarks.filter((p) => p !== id)
          : [ id, ...bookmarks];
        dispatch(updateBookmark(bookmarks));
        setBookmark(!bookmark);
      }
    } catch (error) {
      // toast.error(error.response.data.message)
     
    }
  };

  //comment Add

  const addCommentHandler = async (comDialogText, setText) => {
    try {
      const respone = await axios.post(
        `/post/${post?._id}/comment`,
        { text: inputValue || comDialogText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (respone.data.success) {
        const updatedComments = [respone.data.comment, ...comments];
        setComments(updatedComments);

        //updating in post
        dispatch(updateComment({ index, comments: updatedComments }));

        toast.success(respone.data.message);
        setInputValue("");
        comDialogText && setText("");
      }
    } catch (error) {
      toast.error(error.respone.data.message);
     
    }
  };

  //comment delete
  const deleteCommentHandler = async (comId) => {
    try {
      const respone = await axios.delete(`/post/comment/delete/${comId}`, {
        withCredentials: true,
      });
      if (respone.data.success) {
        const updatedComments = comments.filter((com) => {
          return com._id !== comId;
        });
        setComments(updatedComments);
        //updating in post
        dispatch(updateComment({ index, comments: updatedComments }));
        toast.success(respone.data.message);
      }
    } catch (error) {
      toast.error(error.respone.data.message);
    }
  };
    
  
  
 
  return (
    <>
      <div className="my-8 w-screen  dark:bg-darkTheme-priBack flex flex-col  max-w-[calc(65vh-20px)] md:max-w-sm  mx-auto ">
        <div className=" flex  items-center justify-between  my-2">
          <div className="flex items-center pl-5  sm:pl-0   gap-2 ">
            <Link to={`/profile/${post?.author._id}`}>
              <Avatar className="h-8 w-8 cursor-pointer ">
                <AvatarImage
                  src={post?.author?.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
                  alt="profile_picture"
                  
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <Link to={`/profile/${post?.author._id}`}>
              <h1 className="dark:text-darkTheme-mainText  font-semibold cursor-pointer">
                {post?.author?.username}
              </h1>
            </Link>
          </div>
          <div>
            <MoreHorizontal
              className="dark:text-darkTheme-mainText mr-6 sm:-mr-[0.1rem] cursor-pointer"
              onClick={threeDothandler}
            />
            <ThreeDot
              openThreeDot={openThreeDot}
              setOpenThreeDot={setOpenThreeDot}
              isLegal={user._id === post.author._id}
              postID={post?._id}
              bookmarkHandler={bookmarkHandler}
             
            />
          </div>

          
        </div>
        <div onDoubleClick={likeDislikeHandler}>
          <img
            className=" h-auto max-h-[26rem] min-h-96 w-full   object-fit rounded-sm "
            src={post?.image}
            alt="post"
            loading="lazy"
          />
        </div>
        {/* <LikeCommentShare dialogHandler={dialogHandler} /> */}
        <div className="flex justify-between  mt-3 mb-2">
          <div className="flex gap-3 items-center pl-5 sm:pl-0">
            {liked ? (
              <FaHeart
                size={"24px"}
                className=" text-red-500 cursor-pointer  "
                onClick={likeDislikeHandler}
              />
            ) : (
              <FaRegHeart
                size={"24px"}
                className=" dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500"
                onClick={likeDislikeHandler}
              />
            )}
            <MessageCircle
              onClick={dialogHandler}
              className="dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500"
            />
            <Send className="dark:text-darkTheme-mainText cursor-pointer hover:text-gray-500" />
          </div>
          {bookmark ? (
            <BsBookmarkFill
              size={"22px"}
              className="dark:text-darkTheme-mainText cursor-pointer mr-[1.4rem] sm:-mr-[0.1rem] hover:text-gray-500"
              onClick={bookmarkHandler}
            />
          ) : (
            <BsBookmark
              size={"22px"}
              className="dark:text-darkTheme-mainText cursor-pointer mr-[1.4rem] sm:-mr-[0.1rem] hover:text-gray-500"
              onClick={bookmarkHandler}
            />
          )}
        </div>
        <span className="dark:text-darkTheme-mainText cursor-pointer font-semibold block pl-4 sm:pl-0">
          {`${post?.likes.length} likes`}
        </span>

        <p
          ref={paragraphRef}
          className={` dark:text-darkTheme-mainText pl-4 sm:pl-0 text-ellipsis overflow-hidden  break-words  mr-3 sm:mr-2 ${
            lineClamp && "line-clamp-2 "
          }`}
        >
          <span className=" dark:text-darkTheme-mainText cursor-pointer font-semibold pr-2 overflow-hidden ">
            {post?.author?.username}
          </span>
          {post?.caption}
        </p>
        {showMoreLink && (
          <span
            className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer pl-4 sm:pl-0"
            onClick={linClampHandler}
          >
            more
          </span>
        )}
        <div className="">
          {" "}
          <CommentDialogBox
            open={openComment}
            setOpenComment={setOpenComment}
            addCommentHandler={addCommentHandler}
            comments={comments}
            deleteCommentHandler={deleteCommentHandler}
            bookmarkHandler={bookmarkHandler}
            isLegal={user._id === post.author._id}
            
          />
        </div>

        <span
          className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm cursor-pointer my-1 pl-4 sm:pl-0"
          onClick={dialogHandler}
        >
          {post?.comments.length ? `View all ${comments.length} comments` : ""}
        </span>
        <div className="flex justify-between items-center ">
          <input
            value={inputValue}
            onChange={handleChange}
            type="text"
            className="w-full pl-4 sm:pl-0 outline-none border-none placeholder-lightTheme-placeholder dark:placeholder-darkTheme-placeholder dark:text-darkTheme-mainText text-sm bg-inherit "
            placeholder="Add a comment"
          />
          {inputValue && (
            <span
              className="text-lightTheme-btnBlue font-semibold text-sm mr-6 sm:mr-0 cursor-pointer"
              onClick={addCommentHandler}
            >
              Post
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Post;
