import { CiFaceFrown } from "react-icons/ci"
import { IoIosConstruct } from "react-icons/io"

function NotAvailable({heading, message ,css,height ,icon=<CiFaceFrown size={'8rem'} /> ,messCss,headingCss}){

  return(
    <div className={`flex items-center justify-center ${css}`}>
              <div className={`flex flex-col gap-2 items-center justify-center h-${height} dark:text-darkTheme-placeholder text-lightTheme-placeholder`}>
              
              {/* <CiFaceFrown size={'8rem'} /> */}
                {icon}
                <div>
                <div className={`text-center font-bold ${headingCss}`}>{heading}</div>
                <div className={`text-center ${messCss}`}>{message}</div>
                </div>

              </div>
            </div>
            //  <IoIosConstruct size={'8rem'}/>
  )
}
export default NotAvailable