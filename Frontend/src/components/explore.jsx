import { IoIosConstruct } from "react-icons/io";
import NotAvailable from "./NotAvailable";
import MobileBottomBar from "./mobileBottomBar";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { Link } from "react-router-dom";


function ExplorePage() {
  
  return (
    <>
     
      <div className="sm:hidden fixed top-0 w-full z-40  dark:bg-darkTheme-priBack bg-lightTheme-priBack  dark:text-darkTheme-mainText text-center flex items-center justify-center py-2 border-b border-gray-300 dark:border-[#767676]  ">
        <Link to={"/"} className="absolute left-3">
          <MdOutlineKeyboardArrowLeft size={"40px"} />
        </Link>
        {/* <MoveLeft className="absolute left-4"/> */}

        <span className="dark:text-darkTheme-mainText  text-xl ">Explore</span>
      </div>
      {/* Upper div is for mobile view only */}
      <div className="fixed bottom-0 z-50 sm:hidden w-full">
        <MobileBottomBar />
      </div>{" "}
      {/*this is also for mobile view only */}
      <NotAvailable
        css={"sm:pl-64 h-screen"}
        icon={<IoIosConstruct size={"6rem"} />}
        message={
          'The explore page is currently getting a makeover and is in the "under construction" fashion show!'
        }
        messCss={"font-semibold text-lg overflow-hidden w-[15rem]"}
        headingCss={"text-xl"}
      />
    </>
  );
}

export default ExplorePage;
