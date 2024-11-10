import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSideBar from "./RightSidebar";
import SideBar from "./SideBar";
import userAllPost from "@/hooks/UserAllPost";
import getSuggestedUsers from "@/hooks/getSuggestedUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import MobileHeader from "./mobileHeader";
import MobileBottomBar from "./mobileBottomBar";
import { setScrollPosition } from "@/redux/userAuthSlice";

import LoadingPage from "./loadingPage";

function Home() {
  userAllPost();
  getSuggestedUsers();

  const { postLoading } = useSelector((store) => store.Posts);

  const dispatch = useDispatch();

  // const [scrollPosition, setScrollPosition] = useState(0);
  const { scrollPosition } = useSelector((store) => store.auth);

  // Update scroll position in state on scroll
  const handleScroll = () => {
    dispatch(setScrollPosition(window.scrollY));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to the stored position when returning to the home page
  useEffect(() => {
    window.scrollTo(0, scrollPosition);
  }, []);

  return (
    <>
      <div className="fixed bottom-0 z-50 sm:hidden w-full ">
        <MobileBottomBar />
      </div>
      <div className="flex h-full min-h-screen  ">
        {/* <div className="fixed top-0 sm:hidden z-40"><MobileHeader/></div> */}

        <div className="flex-grow overflow-x-hidden scrollbar-none scroll-smooth">
          
           { postLoading &&<LoadingPage/>}
            <div className="mb-3  top-0 sm:hidden z-40">
            <MobileHeader />
          </div>
          <Feed />
          <Outlet />
          
        </div>
        <div className="hidden lg:block rightSideBar 2xl:pr-80 ">
          <RightSideBar />
        </div>
      </div>
    </>
  );
}

export default Home;
