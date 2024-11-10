import instaLogo from "../assets/instaLogo.png";
function WaitingPage() {
  return (
    <>
      <div
        className="fixed top-0 right-0 left-0 bottom-0 dark:bg-darkTheme-priBack bg-lightTheme-priBack z-50 
    flex items-center justify-center"
      >
        <div className="flex-col items-center ">
          <img src={instaLogo} alt="logo" className="h-20 w-20" />

          <div className="fixed bottom-16 text-center">
            <p className="dark:text-darkTheme-termsCondition font-semibold text-sm text-lightTheme-placeholder">from</p>
            {/* gradient-text is a custom class defined in index.css */}
            <p className="gradient-text  font-semibold text-lg  ">Akshat Jain</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default WaitingPage;
