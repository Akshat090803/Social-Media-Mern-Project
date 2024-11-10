import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/userAuthSlice";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
function EditProfile() {

  axios.defaults.baseURL = 'https://social-media-mern-project.onrender.com/api/v1'; // Set your default base URL here
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const { user } = useSelector((store) => store.auth);
  const [bioObject, setBio]=useState({
    bio:user?.bio ||'',
    isChange:false
  })
  const [genderObject,setGender]=useState({
    gender:user?.gender,
    isChange:false
  })
  const [fullNameObject,setFullName]=useState({
    fullName:user?.fullName ,
    isChange:false
  })
  const [fileObject,setFile]=useState({
    file:'',
    isChange:false
  })
  const [bioLength,setBioLength]=useState(user?.bio.length)
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [loading,setLoading]=useState(false)

  const handleChange=(e,field)=>{

    if (field === 'gender') {
      setGender((prevState) => ({
        ...prevState,
        gender: e.target.value,
        isChange: true
      }));
      setIsFormChanged(true);
    }
    if (field === 'bio') {
      setBio((prevState) => ({
        ...prevState,
        bio: e.target.value,
        isChange: true
      }));
      setIsFormChanged(true);
      setBioLength(e.target.value.length)
    
    }
    if (field === 'fullName') {
      setFullName((prevState) => ({
        ...prevState,
        fullName: e.target.value,
        isChange: true
      }));
      setIsFormChanged(true);
    }
    if (field === 'file') {
      setFile((prevState) => ({
        ...prevState,
        file:e.target.files?.[0],
        isChange: true
      }));
      setIsFormChanged(true);
    }

   
  }
 
  const formHandler= async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)

      // removing unnneccesary linebreaks spaces between texts through regular exp in replace and spaces usinng trim 
      const trimmedBio=bioObject.bio.replace(/\n\s*\n/g, '\n').trim()

       const formData=new FormData()
       //appendind only data in body data  if they are changed 
       if(bioObject.isChange) formData.append('bio',trimmedBio)
       if(genderObject.isChange)formData.append('gender',genderObject.gender)
       if(fullNameObject.isChange)formData.append('fullName',fullNameObject.fullName)

       //appendind file in form data
       if(fileObject.isChange)formData.append('profilePicture',fileObject.file)

       const response=await axios.post('/user/profile/edit',formData,{
        headers:{
          'Content-Type':'multipart/form-data'
        },
        withCredentials:true
       })
       
       if(response.data.success){
                
               dispatch(setAuthUser(response.data.user))
               toast.success(response.data.message)
               navigate(`/profile/${user?._id}`)
               
       }

      
    } catch (error) {
   
      toast.error(error.response.data.message)
     
    }finally{
      setLoading(false)
    }
  }
  return (
    <>
      <div className="sm:hidden fixed top-0 w-full z-40 dark:bg-darkTheme-priBack bg-lightTheme-priBack  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  ">
          <Link to={`/profile/${user?._id}`} className="absolute left-3"><MdOutlineKeyboardArrowLeft size={'40px'} /></Link>
          {/* <MoveLeft className="absolute left-4"/> */}
          
            <span className="dark:text-darkTheme-mainText  text-lg font-semibold ">
                Edit Profile
              </span>
       </div>
{/* Upper div is for mobile view only */}



      <section className=" md:pl-60 grid place-items-center overflow-hidden">
        <div className="dark:text-darkTheme-mainText max-w-xl sm:w-[30rem]  md:w-[50rem] min-w-[22rem] pt-10 pb-20  min-h-screen max-h-full px-1 sm:px-2  ">
          <form className="flex flex-col gap-10 sm:mt-1 mt-10" onSubmit={formHandler}>
            <h1 className="font-bold text-xl hidden sm:block">Edit profile</h1>

          
            {/* change photo */}
           <div className="flex items-center justify-between p-4  bg-[#efefef] dark:bg-darkTheme-dialog rounded-xl">
           <div className="flex gap-4 items-center">
              <Avatar className="h-14 w-14 cursor-pointer ">
                <AvatarImage
                  src={
                    user?.profilePicture ||
                    "https://www.sunsetlearning.com/wp-content/uploads/2019/09/User-Icon-Grey-300x300.png"
                  }
                  alt="profile_picture"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <p className="dark:text-darkTheme- font-bold ">
                  {user?.username}
                </p>
                <p className="dark:text-darkTheme-placeholder hidden sm:block text-lightTheme-placeholder text-sm">
                  {user?.fullName}
                </p>
                <label htmlFor="changePhoto"  className="dark:text-darkTheme-btn text-lightTheme-btnBlue sm:hidden text-sm font-semibold cursor-pointer">Change Photo</label>
              </div>
            </div>

            <label htmlFor="changePhoto"  className="bg-darkTheme-btnBlue hover:bg-darkTheme-bluebtnhover text-white px-4 rounded-lg py-1 cursor-pointer hidden sm:block">Change photo</label>
            <input type="file" id="changePhoto" className="hidden" onChange={(e)=>handleChange(e,'file')}/>

           </div>

             {/* change name */}
             <div className="flex flex-col gap-4">
              <p className="font-bold text-lg">Full Name</p>
              <input value={fullNameObject?.fullName} className="outline-none w-full   px-4 py-2  border-2 placeholder-lightTheme-placeholder dark:border border-gray-200 rounded-md focus:border focus:border-black dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover  bg-inherit dark:text-darkTheme-mainText " onChange={(e)=>handleChange(e,'fullName')}></input>
           </div>


           {/* bio change */}
           <div className="flex flex-col gap-4 relative">
              <p className="font-bold text-lg">Bio</p>
              <textarea value={bioObject?.bio} className={`resize-none  outline-none w-full min-h-24  pl-4 pr-14 py-3  border-2  dark:border border-gray-200 rounded-md focus:border focus:border-black dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover  bg-inherit dark:text-darkTheme-mainText ${bioLength>150 && 'dark:border-red-600 border-red-600 dark:focus:border-red-600 focus:border-red-600'}`} onChange={(e)=>handleChange(e,'bio')}></textarea>
              <span className={`absolute top-[7.1rem] right-5 text-[0.83rem] text-darkTheme-placeholder ${bioLength>150 && 'text-red-600'}`}>{bioLength}/150</span>
           </div>

           {/* Gender */}
          <div className="flex flex-col gap-4">
          <p className="font-bold text-lg">Gender</p>
          <select  value={genderObject?.gender} onChange={(e)=>handleChange(e,'gender')}  name="gender" id="gender" className="outline-none bg-inherit border-2 dark:border border-gray-200 rounded-md focus:border focus:border-black dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover  py-2 px-4 dark:text-darkTheme-mainText ">
            <option className="hidden" value="">{genderObject.gender}</option>
            <option className="text-black p-6 " value="Male">Male</option>
            <option className="text-black p-6" value="Female">Female</option>
            <option className="text-black p-6" value="Prefer not to say">Prefer not to say</option>  
          </select>
          <span className="text-sm dark:text-darkTheme-placeholder text-lightTheme-placeholder -mt-2">This won’t be part of your public profile.</span>
          </div>

          <div className="flex justify-end">
          <Button disabled={isFormChanged && !loading && bioLength<=150 ?false:true}  className="bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover  dark:text-white px-16"> {loading?<span className="loading loading-infinity loading-lg"></span>:'Submit'}</Button>
          </div>
          
          </form>
        </div>
      </section>
    </>
  );
}
export default EditProfile;
