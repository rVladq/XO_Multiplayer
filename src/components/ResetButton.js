import React from "react";
import useHover from "./useHover";

const ResetButton= (props) => {

    const rotate = props.pressed ? 'rotate' : '';
    function handleClick(){
        props.onClick();
    }

    let img;
    // const { handleMouseOverHover, handleMouseLeaveHover, hover } = useHover(300);
    
    return(
        <div 
            className="resetButton"
            // onMouseOver={ (event) => handleMouseOverHover() } 
            // onMouseLeave={ (event) => handleMouseLeaveHover() } 
            onClick={ handleClick }
        >
            <svg className={rotate} width="201" height="235" viewBox="0 0 201 235" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M56 215L20.5 179.5" stroke="black" stroke-width="40" stroke-linecap="round"/>
            <path d="M55.9998 144.001L20.4998 179.501" stroke="black" stroke-width="40" stroke-linecap="round"/>
            <path d="M20.9998 100C20.9998 84.1775 25.6917 68.7103 34.4822 55.5544C43.2727 42.3985 55.767 32.1446 70.3851 26.0896C85.0032 20.0346 101.089 18.4504 116.607 21.5372C132.125 24.624 146.38 32.2433 157.568 43.4315C168.757 54.6197 176.376 68.8743 179.463 84.3928C182.549 99.9113 180.965 115.997 174.91 130.615C168.855 145.233 158.601 157.727 145.445 166.518C132.289 175.308 116.822 180 101 180" stroke="black" stroke-width="40" stroke-linecap="round"/>
            </svg>
        </div>
    )
    
}
export default ResetButton;