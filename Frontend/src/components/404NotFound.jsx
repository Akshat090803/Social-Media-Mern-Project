import { Link } from "react-router-dom";

function NotFound() {

  return (
    <>
      <div className="h-screen w-screen dark:bg-darkTheme-priBack text-darkTheme-mainText bg-lightTheme-priBack flex items-center justify-center ">
        <div className="flex flex-col w-72 text-center justify-center items-center p-5 dark:bg-neutral-800 rounded-md border-2 dark:border bg-slate-100">
          <div className="text-3xl animate-spin ">🐥</div>
          <p className=" text-lg font-semibold text text-black dark:text-darkTheme-mainText">
           404 Not Found
          </p>
          <p className=" text-center dark:text-darkTheme-placeholder text-neutral-500">
          Uh-oh! Looks like you've wandered off the map. Let's navigate back together!
          </p>

          <Link to={'/'} className="border-none bg-slate-700 hover:bg-opacity-50 rounded-md text-sm px-2 py-1 mt-3 text-darkTheme-mainText dark:bg-darkTheme-btnHover ">Back to Home</Link>
        </div>

       
      </div>
    </>
  );
}

export default NotFound