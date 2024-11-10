import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useEffect, useState } from "react";

function Following({userFollowing,setUserFollowing}) {
  const { userProfile } = useSelector((store) => store?.auth);
  const [showFollowing, setShowFollowing] = useState();
  const [searchValue,setSearchValue]=useState('')


  

 let filtered=userProfile?.following

 useEffect(()=>{
  setShowFollowing(userProfile?.following)
 },[userProfile])
 
 const searchBarHandler=(e)=>{
    const value=e.target.value.trim()
   
   
    if(value){
   setSearchValue(value)
     filtered =userProfile?.following.filter((user)=>{
        return user.username.startsWith(value)
      })
        
      setShowFollowing(filtered)
      
    }else{
      setSearchValue('')
      setShowFollowing(userProfile?.following)
      
    }

  }
  
  return (
    <>
      <Dialog open={userFollowing}>
        <DialogContent
          onInteractOutside={() => {setUserFollowing(false)}}
          className="dark:text-darkTheme-mainText dark:bg-darkTheme-dialog p-0 rounded-lg "
        >
          <DialogHeader className="mx-auto font-bold mt-2">
            Followings
          </DialogHeader>
          <div className="border-t w-full  border-gray-400  "></div>
          <div className="px-5 pb-5">
            <input
              placeholder="Search here..."
             value={searchValue}
              onChange={searchBarHandler}
              type="text"
              className="dark:bg-darkTheme-badgeBg bg-[#efefef] px-2 py-1 outline-none rounded w-full text-sm"
            />
            <div className="flex flex-col gap-4 mt-4 scroll-smooth min-h-52 max-h-[27.5rem] overflow-y-auto scrollbar-none pr-2">
              {showFollowing && showFollowing?.length ?'':( <span className="dark:text-darkTheme-placeholder text-lightTheme-placeholder mx-auto text-sm py-1">No results found.</span>)}
              {
                showFollowing?.map((followingUser,index)=>{
                  return(
                    <div key={index} className="flex justify-between items-center w-full">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${followingUser?._id}`} onClick={()=>setUserFollowing(false)}>
                    <Avatar className="h-8 w-8 ">
                      <AvatarImage
                        src={
                          followingUser?.profilePicture ||
                          "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                        }
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>

                  <div>
                    <Link
                      to={`/profile/${followingUser?._id}`}
                      className="dark:text-darkTheme-mainText font-medium text-sm"
                      onClick={()=>setUserFollowing(false)}
                    >
                      <p>{followingUser?.username}</p>
                    </Link>
                    <p className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-sm">
                      {followingUser?.fullName}
                    </p>
                  </div>
                </div>

                <Link to={`/profile/${followingUser._id}`}
               onClick={()=>{setUserFollowing(false)}}>
               <button className="font-semibold dark:text-darkTheme-mainText dark:bg-darkTheme-btnHover w-fit px-3 rounded-md py-1 dark:hover:bg-darkTheme-badgeBg bg-lightTheme-badgebg hover:bg-lightTheme-badgeHover">
                  Stalk profile
                </button>
               </Link>
              </div>
                  )
                })
              }
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default Following;
