import { createBrowserRouter, Route } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
// import SignUp from "./components/SignUp";
const SignUp = lazy(() => import("./components/SignUp"));
import MainLayout from "./components/MainLayout";
// const MainLayout=lazy(()=> import('./components/MainLayout'))

// import Login from "./components/Login";
const Login = lazy(() => import("./components/Login"));
// import Home from "./components/Home";
const Home = lazy(() => import("./components/Home"));

// import ProfilePage from "./components/ProfilePage";
const ProfilePage = lazy(() => import("./components/ProfilePage"));
// import EditProfile from "./components/EditProfile";
const EditProfile = lazy(() => import("./components/EditProfile"));
// import ChatPage from "./components/ChatPage";
const ChatPage = lazy(() => import("./components/ChatPage"));

import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
// import ChattingWindow from "./components/chattingWindow";
const ChattingWindow = lazy(() => import("./components/chattingWindow"));
import {
  setLikeCommentFollowNotifications,
  setLikeNotificationBadge,
  setMessageNotificationFromDb,
  setMessageNotifications,
} from "./redux/NotificationSlice";
import userAllMessages from "./hooks/getAllMessages";

// import ShowSinglePost from "./components/SinglePost";
const ShowSinglePost = lazy(() => import("./components//SinglePost"));
import ProtectedRoutes from "./components/ProtectedRoutes";
// const ProtectedRoutes=lazy(()=> import('./components/ProtectedRoutes'))
// import SwitchProfile from "./components/SwitchProfile";
const SwitchProfile = lazy(() => import("./components/SwitchProfile"));

import userGetAllNotifications from "./hooks/getAllNotifications";
import { setLikeDislikeFromSocket } from "./redux/userPostSlice";
import {
  setFollowingFromSocket,
  setMessageNotificationsForUser,
} from "./redux/userAuthSlice";
import useGetLoggedUser from "./hooks/getLoggedUser";
// import ExplorePage from "./components/explore";
const ExplorePage = lazy(() => import("./components/explore"));
// import NotificationMenu from "./components/Notification";
const NotificationMenu = lazy(() => import("./components/Notification"));

// import NotAvailable from "./components/NotAvailable";
const NotAvailable = lazy(() => import("./components/NotAvailable"));

import { TbArrowLoopLeft } from "react-icons/tb";
// import SearchPage from "./components/Searchpage";
const SearchPage = lazy(() => import("./components/Searchpage"));
import LoadingPage from "./components/loadingPage";
import WaitingPage from "./components/WaitingPage";
import ShowLoadbaronUrlChange from "./components/ShowLoadbaronUrlChange";
import { ErrorBoundary } from "react-error-boundary";
import NotFound from "./components/404NotFound";

// const isSmallScreen = window.innerWidth < 640; // Adjust the width value based on your breakpoint

//!We shifted routes from here outside app func to inside the app func as we want to access isSmallScreen state in routes for chattingWindow conditional render

function errorBoundaryFallback(){
  return(
    <>

<div className="h-screen w-screen dark:bg-darkTheme-priBack text-darkTheme-mainText bg-lightTheme-priBack flex items-center justify-center ">

<div className="flex flex-col w-72 text-center justify-center items-center p-5 dark:bg-neutral-800 rounded-md border-2 dark:border bg-slate-100">
          <div className="text-3xl ">🦉</div>
          <p className=" text-lg font-semibold text text-black dark:text-darkTheme-mainText">Something went wrong !!!</p>
          <p className=" text-center dark:text-darkTheme-placeholder text-neutral-500">
          Oops! It seems like we hit a bump in the road. Please reload the page or try again later.
          </p>
        </div>
     

</div> 
    
    </>
  )
}

function App() {
  const [isSmallScreen, setIsSmallScreenforRenderOnly] = useState(); // Adjust the width value based on your breakpoint
  //!useEffect for isSmallScreen is at last

  //we shifted routes inside app func which was previously above app func in global scope in app.jsx as we want isSmallScreen as a state and if we not shifted routes inside app func we are unable to access isSmallScreen sate
  const routes = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary fallback={    <div className="h-screen w-screen dark:bg-darkTheme-priBack text-darkTheme-mainText bg-lightTheme-priBack flex items-center justify-center ">

          <div className="flex flex-col w-72 text-center justify-center items-center p-5 dark:bg-neutral-800 rounded-md border-2 dark:border bg-slate-100">
                    <div className="text-3xl ">🦉</div>
                    <p className=" text-lg font-semibold text text-black dark:text-darkTheme-mainText">Something went wrong !!!</p>
                    <p className=" text-center dark:text-darkTheme-placeholder text-neutral-500">
                    Oops! It seems like we hit a bump in the road. Please reload the page or try again later.
                    </p>
                  </div>
               
      
          </div>   }> <ProtectedRoutes>
        <MainLayout />
      </ProtectedRoutes></ErrorBoundary>
       
      ),
      children: [
        {
          path: "/",
          element: (
            <Suspense fallback={<WaitingPage />}>
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            </Suspense>
          ),
        },
        {
          path: "/profile/:id",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                <ProfilePage />
              </ProtectedRoutes>{" "}
            </Suspense>
          ),
        },
        {
          path: "/account/edit",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                <EditProfile />{" "}
              </ProtectedRoutes>
            </Suspense>
          ),
        },

        // { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> ,children:[{path:`/chat/:id`,element:<ProtectedRoutes><ChattingWindow /></ProtectedRoutes>}]},

        // { path: "/chat", element: <ProtectedRoutes><ChatPage /></ProtectedRoutes>},
        // {path:'/chat/:id',element:<ProtectedRoutes><ChattingWindow  /></ProtectedRoutes>},

        !isSmallScreen
          ? {
              path: "/chat",
              element: (
                <Suspense fallback={<LoadingPage />}>
                  <ProtectedRoutes>
                    <ChatPage />
                  </ProtectedRoutes>
                </Suspense>
              ),
              children: [
                {
                  path: `/chat/:id`,
                  element: (
                    <Suspense fallback={<LoadingPage />}>
                      {" "}
                      <ProtectedRoutes>
                        <ChattingWindow />
                      </ProtectedRoutes>
                    </Suspense>
                  ),
                },
              ],
            }
          : {
              path: "/chat",
              element: (
                <Suspense fallback={<LoadingPage />}>
                  <ProtectedRoutes>
                    <ChatPage />
                  </ProtectedRoutes>
                </Suspense>
              ),
            },

        {
          path: "/chat/:id",
          element: (
            <Suspense fallback={<LoadingPage />}>
              {" "}
              <ProtectedRoutes>
                <ChattingWindow />
              </ProtectedRoutes>
            </Suspense>
          ),
        },
        {
          path: "/post/:id",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                <ShowSinglePost />
              </ProtectedRoutes>
            </Suspense>
          ),
        },
        {
          path: "/explore",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                <ExplorePage />
              </ProtectedRoutes>
            </Suspense>
          ),
        },

        {
          path: "/notification",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                {isSmallScreen ? (
                  <NotificationMenu />
                ) : (
                  <NotAvailable
                    css={"md:pl-64 h-screen sm:pl-20"}
                    icon={<TbArrowLoopLeft size={"6rem"} />}
                    message={
                      "The notification page is designed for mobile use. Please access the home page through the left sidebar on your desktop or laptop"
                    }
                    messCss={"font-semibold text-lg overflow-hidden w-[17rem]"}
                    headingCss={"text-xl"}
                  />
                )}
              </ProtectedRoutes>
            </Suspense>
          ),
        },

        {
          path: "/search",
          element: (
            <Suspense fallback={<LoadingPage />}>
              <ProtectedRoutes>
                {isSmallScreen ? (
                  <SearchPage />
                ) : (
                  <NotAvailable
                    css={"sm:pl-20 md:pl-64 h-screen"}
                    icon={<TbArrowLoopLeft size={"6rem"} />}
                    message={
                      "The path /search is designed for mobile use.To Access Search Page on your desktop or laptop,first visit to home page through left sidebar than click on search icon"
                    }
                    messCss={"font-semibold text-lg overflow-hidden w-[17rem]"}
                    headingCss={"text-xl"}
                  />
                )}
              </ProtectedRoutes>
            </Suspense>
          ),
        },

        // {path:'/search',element:<ProtectedRoutes><SearchPage/></ProtectedRoutes>}
      ],
    },

    {
      path: "/signup",
      element: (
       <ErrorBoundary fallback={    <div className="h-screen w-screen dark:bg-darkTheme-priBack text-darkTheme-mainText bg-lightTheme-priBack flex items-center justify-center ">

        <div className="flex flex-col w-72 text-center justify-center items-center p-5 dark:bg-neutral-800 rounded-md border-2 dark:border bg-slate-100">
                  <div className="text-3xl ">🦉</div>
                  <p className=" text-lg font-semibold text text-black dark:text-darkTheme-mainText">Something went wrong !!!</p>
                  <p className=" text-center dark:text-darkTheme-placeholder text-neutral-500">
                  Oops! It seems like we hit a bump in the road. Please reload the page or try again later.
                  </p>
                </div>
             
    
        </div>   }> <Suspense fallback={<LoadingPage />}>
       <SignUp />
     </Suspense></ErrorBoundary>
      ),
    },
    {
      path: "/login",
      element: (
        <ErrorBoundary fallback={    <div className="h-screen w-screen dark:bg-darkTheme-priBack text-darkTheme-mainText bg-lightTheme-priBack flex items-center justify-center ">

          <div className="flex flex-col w-72 text-center justify-center items-center p-5 dark:bg-neutral-800 rounded-md border-2 dark:border bg-slate-100">
                    <div className="text-3xl ">🦉</div>
                    <p className=" text-lg font-semibold text text-black dark:text-darkTheme-mainText">Something went wrong !!!</p>
                    <p className=" text-center dark:text-darkTheme-placeholder text-neutral-500">
                    Oops! It seems like we hit a bump in the road. Please reload the page or try again later.
                    </p>
                  </div>
               
      
          </div>   }> <Suspense fallback={<LoadingPage />}>
        <Login/>
      </Suspense></ErrorBoundary>
      ),
    },
    {
      path: "/switch",
      element: (
        <ErrorBoundary fallback={errorBoundaryFallback}><Suspense fallback={<LoadingPage />}>
        <SwitchProfile />
      </Suspense></ErrorBoundary>
      ),
    },
    {
      path:"*",
      element:<NotFound/>
    }
  ]);
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector((store) => store.socketio);

  useGetLoggedUser();

  userAllMessages();

  const {
    NotificationActive,
    messageNotifications,
    likeCommentFollowNotifications,
  } = useSelector((store) => store.notifications);

  userGetAllNotifications();
  useEffect(() => {
    dispatch(setMessageNotificationFromDb(user?.messageNotifications));

    if (user) {
      const socketio = io("http://localhost:8080", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      // listening events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeCommentFollowNotifications(notification));

        if (
          notification.type === "follow" ||
          notification.type === "unfollow"
        ) {
          dispatch(setFollowingFromSocket(notification));
        }
        // if(notification.type==='like' || notification.type==='dislike'){
        //   dispatch(setLikeDislikeFromSocket(notification))
        // }

        if (notification.badge) {
          dispatch(setLikeNotificationBadge(true));
        } else {
          dispatch(setLikeNotificationBadge(false));
        }
      });

      socketio.on("messageNotification", (newMessage) => {
        dispatch(setMessageNotifications(newMessage.senderId));
        dispatch(setMessageNotificationsForUser(newMessage.senderId));
      });

      socketio.on("updatePostDataforAll", (updateData) => {
        if (updateData.type === "like" || updateData.type === "dislike") {
          dispatch(setLikeDislikeFromSocket(updateData));
        }
      });

      // cleanup func
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  //for chatWindow
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreenforRenderOnly(window.innerWidth < 640);
    };

    // Initial check
    setIsSmallScreenforRenderOnly(window.innerWidth < 640);

    // Event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  

  return (
    <>
    <RouterProvider router={routes}>
   </RouterProvider>
    </>
  );
}

export default App;
