import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import SuggestedUser from "./suggestedUser";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
function RightSideBar() {
  const { user,suggestedUser } = useSelector((store) => store.auth);

  const [seeAll,setSeeAll]=useState(false)
  const [overflow,setOverflow]=useState(true)
  const seeAllRef=useRef()
  useEffect(() => {
    const seeAll = seeAllRef.current;

    if (seeAll.scrollHeight > seeAll.clientHeight) {
      setSeeAll(true);
    }
  }, [suggestedUser]);


  const overflowHandler=()=>{
        setOverflow(false)
        setSeeAll(false)
  }
  return (
    <>
      <section className="w-[23.93rem] h-[34.87rem] pl-[64px]  relative">
        <div className="flex items-center justify-between mt-9 pl-4 pr-6 ">
          <div className="flex gap-3 items-center ">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="h-11 w-11 cursor-pointer ">
                <AvatarImage
                  src={
                    user?.profilePicture ||
                    "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                  }
                  alt="profile_picture"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <Link to={`/profile/${user?._id}`}>
                <p className="dark:text-darkTheme-mainText text-sm font-semibold">
                  {user?.username}
                </p>
              </Link>
              <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm ">
                {user?.fullName}
              </p>
            </div>
          </div>
          <Link to={'/switch'} className="dark:text-darkTheme-btnBlue font-medium cursor-pointer dark:hover:text-darkTheme-mainText text-xs text-lightTheme-btnBlue hover:text-lightTheme-termsCondition">
            Switch
          </Link>
        </div>
        {/* suggestion for you headline */}
        <div className="mt-6 pl-4 pr-6 flex justify-between items-center">
          <p className="dark:text-darkTheme-placeholder font-semibold">
            Suggested for you
          </p>
          {
            user.following.length !==suggestedUser.length && seeAll && <p className="dark:text-darkTheme-mainText font-medium cursor-pointer dark:hover:text-darkTheme-placeholder text-sm hover:text-[#9f9fa1]" onClick={overflowHandler}>
              See All
          </p >
          }
        </div>

        {/* suggested users aynege */}
       
            <div className={`  ${overflow ?'line-clamp-4 max-h-60':' max-h-80 overflow-y-auto scrollbar-none scroll-smooth'}`} ref={seeAllRef}>
            <SuggestedUser />
            </div>
       
      

        {/* footer */}
        <div className="text-xs dark:text-lightTheme-placeholder text-darkTheme-placeholder pl-4 pr-6 mt-9 cursor-pointer absolute bottom-0">
          <p>
            About . Help . Press . API . Jobs . Privacy . Terms . Locations .
            Language Meta Verified
          </p>
          <p className="mt-5">© 2024 Instagram from Akshat Corp.</p>
        </div>
      </section>
    </>
  );
}

export default RightSideBar;
