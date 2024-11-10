import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/userAuthSlice";

function Login() {
  const dispatch=useDispatch()
  const navigate=useNavigate()
  axios.defaults.baseURL = 'https://social-media-mern-project.onrender.com/api/v1'; // Set your default base URL here
  const {user}=useSelector((store)=>store.auth)
  //loading state
  const [loading,setLoading]=useState(false)

  const [inputValue, setInputValue] = useState({
    email:"",
    
    password: "",
  });

  const [loginError, setError] = useState({
   
    passwordError:'',
    emailError:'',
  });

  

  //we are dealing with username value in handlechange function alredady


  //handlechange func along with username validate condition
  const handleChange = (e, inputName) => {
    setInputValue({ ...inputValue, [inputName]: e.target.value });
   
    // !no need of above commented code as we are use validation errors and checking format uniquness from backend logic  see """"""""signUpHandler func""""""""
    // ?seting error emtpy obj onchnage so that error gets removed
    setError(
      {
        passwordError:'',
        emailError:'',})
    
  };

  //LoginHandler func for Form submit
  const loginHandler=async (e)=>{
    e.preventDefault();
   
    try {
      setLoading(true)  //loading true 
      const response=await axios.post('/user/login',inputValue,{
        headers:{
          'Content-Type':'application/json'
        },
        withCredentials:true
      })
      if(response.data.success){
        toast.success(response.data.message)
        setInputValue({
          email:"",
          password: "",
        })
        navigate('/')
        dispatch(setAuthUser(response.data.user))
        
      }
    } catch (error) {
     
      const{err}=error.response.data 
      setError( err)
      // toast.error(error.response.data.message)
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
                   if(user){
                    navigate('/')
                   }
  },[])
  return (
    <>
      <div className="w-full h-[100svh] sm:h-screen flex justify-center items-center bg-lightTheme-priBack dark:bg-darkTheme-priBack overflow-x-auto ">
        <form
          onSubmit={loginHandler}
          className=" my-4 border border-gray-300 dark:border-gray-700    flex flex-col justify-center gap-5 p-8 w-[348.66px] "
        >
          <div className="my-4 text-center">
            <h1 className="font-bold text-3xl mx-[10px] pt-[10px] pb-[15px] text-black dark:text-white">
            ℑ𝔫𝔰𝔱𝔞𝔤𝔯𝔞𝔪
            </h1>
            <p className="text-lightTheme-placeholder dark:text-darkTheme-placeholder font-semibold ">
              Sign in to see photos and videos from your friends.
            </p>
          </div>
          <div>
            {/* email input */}
            <div className="relative mb-4">
              <Input
                required
                value={inputValue.email}
                placeholder="Email"
                type="email"

                name="email"
                className={`px-2   rounded-sm text-xs focus-visible:ring-transparent focus:border-black/30
                  dark:focus-visible:ring-transparent dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover bg-lightTheme-input dark:bg-darkTheme-input placeholder-text-lightTheme-placeholder dark:placeholder-text-darkTheme-placeholder dark:text-white ${
                    inputValue.email ? "pt-[14px]" : ""
                  }  ${
                    loginError.emailError && "dark:border-red-700 dark:focus:border-red-700 border-red-700 focus:border-red-700" 
                  } `}
                onChange={(e) => {
                  handleChange(e, "email");
                }}
              />
              <span
                className={`absolute px:2  transition-all  ${
                  inputValue.email
                    ? "text-lightTheme-placeholder dark:text-darkTheme-placeholder top-0 left-2 text-xs mb-5  "
                    : "text-lightTheme-placeholder dark:text-darkTheme-placeholder top-1 left-2 text-base"
                }`}
              >
                {inputValue.email ? "Email" : ""}
              </span>
              {loginError.emailError && (
                <p className="text-xs pt-1 transition-all text-red-700 dark:text-red-600">
                  {loginError.emailError}
                </p>
              )}
            </div>
           
            {/* Password */}
            <div className="relative mb-4">
              <Input
                required
                value={inputValue.password}
                placeholder="Password"
                type="password"
                name="password"
                
                className={`px-2   rounded-sm text-xs focus-visible:ring-transparent focus:border-black/30  dark:focus-visible:ring-transparent dark:border-darkTheme-placeholder dark:focus:border-darkTheme-bluebtnhover
                  bg-lightTheme-input dark:bg-darkTheme-input placeholder-text-lightTheme-placeholder dark:placeholder-text-darkTheme-placeholder dark:text-white ${
                    inputValue.password ? "pt-[14px]" : ""
                  } ${
                    loginError.passwordError && "dark:border-red-700 dark:focus:border-red-700 border-red-700 focus:border-red-700" 
                  }`}
                onChange={(e) => {
                  handleChange(e, "password");
                }}
              />
              <span
                className={`absolute px:2  transition-all  ${
                  inputValue.password
                    ? "text-lightTheme-placeholder dark:text-darkTheme-placeholder top-0 left-2 text-xs mb-5  "
                    : "text-lightTheme-placeholder dark:text-darkTheme-placeholder top-1 left-2 text-base"
                }`}
              >
                {inputValue.password ? "Password" : ""}
              </span>
              <p className="text-xs pt-1  transition-all text-red-700 dark:text-red-600">
                  {loginError.passwordError}
                </p>
            </div>
          </div>

          <div className="text-lightTheme-placeholder dark:text-darkTheme-placeholder text-xs text-center">
            People who use our service may have uploaded your contact
            information to Instagram.{" "}
            <a
              href="https://www.facebook.com/help/instagram/261704639352628"
              target="_blank"
              className="text-lightTheme-termsCondition dark:text-darkTheme-termsCondition"
            >
              Learn More
            </a>
          </div>

          <div className="text-lightTheme-placeholder dark:text-darkTheme-placeholder text-xs text-center">
            By signing in, you agree to our{" "}
            <a
              href="https://help.instagram.com/581066165581870/?locale=en_US"
              target="_blank"
              className="text-lightTheme-termsCondition dark:text-darkTheme-termsCondition"
            >
              Terms
            </a>{" "}
            ,{" "}
            <a
              href="https://www.facebook.com/privacy/policy"
              target="_blank"
              className="text-lightTheme-termsCondition dark:text-darkTheme-termsCondition"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://privacycenter.instagram.com/policies/cookies/"
              target="_blank"
              className="text-lightTheme-termsCondition dark:text-darkTheme-termsCondition"
            >
              Cookies Policy
            </a>{" "}
            .
          </div>

          {/* submit button */}
          <div className="">
            <Button
              type="submit"
              className="bg-lightTheme-btnBlue dark:bg-lightTheme-btnBlue hover:bg-lightTheme-bluebtnhover dark:hover:bg-lightTheme-bluebtnhover  dark:text-white  w-full "
              disabled={(loginError.emailError || loginError.passwordError || loading) ? true : false}
            >
              {loading?<span className="loading loading-infinity loading-lg"></span>:'Log in'}
            </Button>

            <p className="text-sm text-center dark:text-white mt-1">
            Don't have an account?{" "}
              <Link to={'/signup'} className="text-lightTheme-btnBlue dark:text-[#0095f6] font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;
