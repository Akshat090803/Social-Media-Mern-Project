import { Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import SideBar from "./SideBar";
import ChatSideBar from "./chatSideBar";

import { useSelector } from "react-redux";
import SearchPage from "./Searchpage";

import LoadingPage from "./loadingPage";

import ShowLoadbaronUrlChange from "./ShowLoadbaronUrlChange";

// import NotificationMenu from "./Notification";
const NotificationMenu = lazy(() => import("./Notification"));

function MainLayout() {
  const { NotificationActive } = useSelector((store) => store.notifications);
  const { searchActive } = useSelector((store) => store.search);

  return (
    <>
      <ShowLoadbaronUrlChange />
      <div className="bg-lightTheme-priBack dark:bg-darkTheme-priBack w-full h-full min-h-screen relative overflow-x-hidden">
        <div>
          <Outlet />
        </div>

        {/* <div className="fixed bottom-0 z-50 sm:hidden"><MobileBottomBar/></div> */}
        <div className={`fixed top-0 hidden lg:block`}>
          <SideBar />
        </div>
        <div className={`fixed top-0 hidden sm:block lg:hidden`}>
          <ChatSideBar />
        </div>
        <div
          className={`${
            NotificationActive ? "-translate-x-0 " : "-translate-x-[28rem]"
          } fixed top-0 z-50 transition-transform duration-500 sm:block hidden`}
        >
          <Suspense fallback={<LoadingPage />}>
            <NotificationMenu />
          </Suspense>
        </div>

        <div
          className={`${
            searchActive ? "-translate-x-0 " : "-translate-x-[28rem]"
          } fixed top-0 z-50 transition-transform duration-500 sm:block hidden`}
        >
          <Suspense fallback={<LoadingPage />}>
            <SearchPage />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export default MainLayout;
