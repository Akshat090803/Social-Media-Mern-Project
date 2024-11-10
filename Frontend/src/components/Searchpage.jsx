import { Search } from "lucide-react";
import ChatSideBar from "./chatSideBar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import NotAvailable from "./NotAvailable";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { setrecentSearches, setrecentSearchesIfUserAlreadyTheir, setRemoveFromRecentSearches, setSearchActive } from "@/redux/searchPageSlice";
import { MdCancel, MdCancelPresentation, MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { TbClockCancel, TbEyeCancel, TbMapCancel } from "react-icons/tb";
import { BsCrosshair } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

import MobileBottomBar from "./mobileBottomBar";

function SearchPage() {
  const dispatch = useDispatch();

  


  const { suggestedUser, user } = useSelector((store) => store.auth);
  const { recentSearches } = useSelector((store) => store.search);
  const [searchInputvalue, setSearchInputValue] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  const searchInputHandler = (e) => {
    const text = e.target.value.trim();
    let filtered;
    if (text) {
      setSearchInputValue(text);
      filtered = suggestedUser.filter((item) => {
        return item.username.includes(text);
      });

      //this so that user can search his username also
      filtered = user.username.startsWith(text)
        ? [user, ...filtered]
        : filtered;

      setSearchedUsers(filtered);
     
    } else {
      setSearchInputValue("");
      setSearchedUsers([]);
    }
  };



  //function to check user already in recent search array or not if yes than make him as a first element of array
  const clickHandler = (item) => {
    dispatch(setSearchActive(false));
    

    const check=recentSearches.findIndex((ele)=>ele._id===item._id)

    if(check===-1){
      dispatch(setrecentSearches(item));
    }else{
      dispatch(setrecentSearchesIfUserAlreadyTheir(item))
    }

    
  };

  

  

  return (
    <>
 <div className="sm:hidden fixed top-0 w-full z-40  dark:bg-darkTheme-priBack bg-lightTheme-priBack  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  ">
          <Link to={'/'} className="absolute left-3"><MdOutlineKeyboardArrowLeft size={'40px'} /></Link>
          {/* <MoveLeft className="absolute left-4"/> */}
          
            <span className="dark:text-darkTheme-mainText  text-xl ">
              Search
              </span>
       </div>
{/* Upper div is for mobile view only */}

     <div className="">
     <div className=" bg-lightTheme-priBack  dark:bg-darkTheme-priBack h-screen dark:text-darkTheme-mainText sm:w-[28rem] ">
        <div className="flex h-screen">
          <div className="sm:block hidden"> <ChatSideBar  /></div>
         

          <div className="flex-1 h-screen pt-20 sm:pt-0 ">
            <h1 className="text-2xl font-bold my-8 px-4 hidden sm:block">Search</h1>
            <div className="px-4">
              <input
              
                value={searchInputvalue}
                placeholder="Search..."
                className="w-full mb-8 bg-[#efefef] dark:bg-darkTheme-badgeBg py-2 px-2 outline-none rounded-md placeholder:dark:text-darkTheme-placeholder"
                type="text"
                onChange={searchInputHandler}
              />
            </div>
            <div className="border-t    border-gray-300 dark:border-[#262626]"></div>

            <div className="flex flex-col px-4 mt-3 pb-8 gap-3 h-[calc(75vh-20px)] bg-lightTheme-priBack  dark:bg-darkTheme-priBack  overflow-y-auto scrollbar-none scroll-smooth">
              {!searchInputvalue && recentSearches.length ? (
                <div className="flex justify-between items-center"><h1 className=" font-semibold ">Recent</h1>
                <span className="dark:text-darkTheme-btnBlue font-medium cursor-pointer dark:hover:text-darkTheme-mainText text-sm text-lightTheme-btnBlue" onClick={()=>dispatch(setRemoveFromRecentSearches({type:'all'}))}>Clear All</span>
                </div>
          
              ):''}

              {!recentSearches.length && !searchInputvalue ? (
                <>
                  <p className="mt-5 dark:text-darkTheme-placeholder text-sm flex-grow flex justify-center items-center">
                    No recent searches
                  </p>
                </>
              ) : !searchInputvalue.length && (
                recentSearches.map((item,index)=>{
                  return (
                    <div 
                   
                      key={index}
                      className="flex justify-between items-center w-full"
                    >
                      <Link  to={`/profile/${item?._id}`}
                          onClick={() => clickHandler(item)} className="flex items-center gap-3">
                        <div
                       
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                item?.profilePicture ||
                                "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                              }
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>

                        <div>
                          <div
                            className="dark:text-darkTheme-mainText font-medium text-sm"
                            
                          >
                            <p>{item?.username}</p>
                            <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm">
                            {item?.fullName}
                          </p>
                          </div>
                          
                        </div>
                        
                      </Link>
                      <div className="hover:text-darkTheme-btnHover pr-5 cursor-pointer z-50" onClick={()=>dispatch(setRemoveFromRecentSearches({type:'single',id:item._id}))}><MdCancel/></div>
                      {/* <div className="font-semibold dark:text-darkTheme-placeholder text-xl pr-5"><IoMdClose/></div> */}
                      
                    
                    </div>
                  );
                
              
                })
              )}
              {!searchedUsers.length && searchInputvalue ? (
                <p className="dark:text-darkTheme-placeholder text-sm flex-grow flex justify-center items-center">
                  No user found
                </p>
              ) : (
                searchedUsers.map((item, index) => {
                  return (
                    <Link to={`/profile/${item?._id}`}
                    onClick={() => clickHandler(item)}
                      key={index}
                      className="flex justify-between items-center w-full"
                    >
                      
                      <div className="flex items-center gap-3">
                        <div
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                item?.profilePicture ||
                                "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                              }
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                        </div>

                        <div>
                          <div
                            className="dark:text-darkTheme-mainText font-medium text-sm"
                          
                          >
                            <p>{item?.username}</p>
                          
                          <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm">
                            {item?.fullName}
                          </p>
                          </div>
                        </div>
                       
                      </div>
                     
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
     </div>
    </>
  );
}

export default SearchPage;
