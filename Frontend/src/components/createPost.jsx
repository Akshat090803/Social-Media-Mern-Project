import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {  useRef, useState } from "react";
import { Button } from "./ui/button";
import { readFileAsDataUrl } from "@/lib/utils";
import { Description } from "@radix-ui/react-dialog";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { addPost, setPost } from "@/redux/userPostSlice";


function CreatePost({ openCreate, setOpenCreate }) {
  const {post}=useSelector((store)=>store.Posts)
  const {user}=useSelector((store)=>store.auth)
  const dispatch=useDispatch()
  axios.defaults.baseURL = 'http://localhost:8080/api/v1'; // Set your default base URL here
  const [caption, setCaption] = useState("");
  const [file,setFile]=useState('')
  const [preview,setPreview]=useState('')
  const [loading,setLoading]=useState(false)

  const imageRef=useRef()

  const captionHandler = (e) => {
    if (e.target.value) {
      setCaption(e.target.value);
    } else {
      setCaption("");
    }
  };

  const fileChangeHandler=async (e)=>{
    const file=e.target.files?.[0]
    if(file){
      setFile(file)
      const dataUrl=await readFileAsDataUrl(file)
      setPreview(dataUrl)
    }
  }

const handlePostSubmit=async (e)=>{
  e.preventDefault()
 try {
            
       const formData=new FormData()

       //appendind body data caption
       formData.append('caption',caption)

       //appendind file in form data
       formData.append('post',file)

      setLoading(true)
     const response=await axios.post('/post/addpost',formData,{
      headers:{
        'Content-Type':'multipart/form-data'
      },
      withCredentials:true
     })

     if(response.data.success){
      toast.success(response.data.message)
      
      dispatch(setPost([response.data.post,...post]))
      setOpenCreate(false)
      setFile('')
      setCaption('')
      setPreview('')
     }

  
 } catch (error) {
 
    toast.error(error.response.data.message)
 }finally{
       setLoading(false)
 }
}

  return (
    <>
      <Dialog open={openCreate}>
        <DialogContent
          onInteractOutside={() => setOpenCreate(false)}
          className="dark:bg-[#1A1A1A] bg-lightTheme-priBack rounded-md"
        >
          <DialogTitle className="hidden"> Your Dialog Title </DialogTitle>
          <Description className="hidden">Create Post </Description>
          <DialogHeader className="dark:text-darkTheme-mainText font-semibold">
            Create Post
          </DialogHeader>
          <form onSubmit={handlePostSubmit}>
            <div className="flex flex-col gap-5  h-full w-full  ">
            <div className="flex gap-3 items-center">
              <Avatar className="h-8 w-8 cursor-pointer ">
              <AvatarImage
                src={user?.profilePicture || "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"}
                alt="profile_picture"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
                <div>
                  <p className="dark:text-darkTheme-mainText text-sm">
                    {user?.username}
                  </p>
                  <span className="dark:text-darkTheme-placeholder text-lightTheme-placeholder text-xs">
                    {user?.fullName}
                  </span>
                </div>
              </div>

              <div className="h-52 overflow-y-auto scrollbar-none scroll-smooth ">
                <textarea
                  value={caption}
                  name="caption"
                  id="caption"
                  placeholder="caption..."
                  className="resize-none outline-none w-full sm:min-h-32 p-2 text-sm sm:text-[16px] border-2 placeholder-lightTheme-placeholder dark:border border-gray-200 rounded-md mt-5 focus:border focus:border-black dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover bg-lightTheme-input dark:bg-darkTheme-input dark:text-darkTheme-mainText mb-1"
                  onChange={captionHandler}
                />
                {preview && <p className="dark:text-darkTheme-mainText text-lightTheme-placeholder text-sm mb-20">Scroll Up tp preview image</p>}

                {preview ? <div className="transition-all animate-in duration-700">
                  <img
                    className="max-h-52 w-full mt-1 rounded-md "
                    src={preview}
                    alt="post image"
                    loading="lazy"
                  />
                </div>:""}
              </div>

              <div>
                <input id="filese" type="file" ref={imageRef}  className="hidden" onChange={fileChangeHandler}/>
                {
                  (preview ? <Button  className="bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover   dark:text-white w-full"
                   >
                     {loading?<span className="loading loading-infinity loading-lg"></span>:'Create'}
                   </Button>:<div className="bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover  dark:text-white  w-fit p-2 -mt-3 rounded-md text-sm cursor-pointer text-white font-semibold  mx-auto" onClick={()=>imageRef.current.click()}>Choose File</div>)
                }
               
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export default CreatePost;
