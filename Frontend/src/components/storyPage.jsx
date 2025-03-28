import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import { Avatar } from "@radix-ui/react-avatar";
import { Link, useNavigate } from "react-router-dom";
import { AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRef } from "react";

function StoryPage({ open, setOpen }) {
  const { suggestedUser, user } = useSelector((store) => store.auth);
 const navigate=useNavigate()
  return (
    <>
      <div className="bg-neutral-700 fixed top-0 left-0 right-0 bottom-0 z-50 bg-opacity-75 flex justify-center items-center text-darkTheme-mainText overflow-hidden ">
        <div className="sm:h-[calc(95vh)] relative sm:w-[calc(27vw)] h-full w-full bg-darkTheme-priBack sm:rounded-lg flex  items-center ">
          {/* <Link to={`/profile/${open?._id}`} className="fixed top-0 sm:top-4 py-3 px-3  flex items-center gap-3  w-full sm:w-[calc(27vw)]">
            <Avatar className="h-8 w-8 cursor-pointer flex-shrink-0">
              <AvatarImage
                src={
                  open?.profilePicture ||
                  "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                }
                alt="profile_picture"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <span className="text-sm">{open?.username}</span>

            <span
          className="sm:hidden   absolute  cursor-pointer right-3"
          onClick={() => {
            setOpen(false);
          }}
        >
          <RxCross2 size={24} />
        </span>
          </Link> */}
          <div className="fixed top-0 sm:top-4 py-3 px-3  flex items-center gap-3  w-full sm:w-[calc(27vw)]">
          <Avatar className="h-8 w-8 cursor-pointer flex-shrink-0" onClick={()=>navigate(`/profile/${open?._id}`)}>
              <AvatarImage
                src={
                  open?.profilePicture ||
                  "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                }
                alt="profile_picture"
                className="rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <span onClick={()=>navigate(`/profile/${open?._id}`)}  className="text-sm">{open?.username}</span>

            <span
          className="sm:hidden   absolute  cursor-pointer right-3"
          onClick={() => {
            setOpen(false);
          }}
        >
          <RxCross2 size={24} />
        </span>
          </div>

          {/* for timeLine */}
          <div className=" top-14 sm:top-[3.4rem] h-[2px] absolute bg-lightTheme-placeholder bg-opacity-50 w-full ">
            <div className="h-full w-[90%] rounded-r-sm timeline-color-gradient-custom-class  timeline "></div>
          </div>

          <div className="container mx-auto py-16 px-3 flex justify-center items-center h-screen ">
            <div className="flex flex-col justify-center items-center p-5 bg-neutral-800 rounded-md">
              <div className="text-3xl ">🐣</div>
              <p className=" text-lg">Oops!!</p>
              <p className="text-sm text-center">
                This feature is currently unavailble for you.
              </p>
            </div>
          </div>
        </div>

        <span
          className=" hidden sm:flex absolute top-6 cursor-pointer right-16"
          onClick={() => {
            setOpen(false);
          }}
        >
          <RxCross2 size={40} />
        </span>
      </div>
    </>
  );
}
export default StoryPage;
