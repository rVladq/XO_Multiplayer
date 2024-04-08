import React from "react";
import useHover from "./useHover";

const ResetButton= (props) => {

    function handleClick(){
        props.onClick(  );
    }

    let img;
    const { handleMouseOverHover, handleMouseLeaveHover, hover } = useHover(300);
    
    return(
        <div 
            className="resetButton"
            onMouseOver={ (event) => handleMouseOverHover() } 
            onMouseLeave={ (event) => handleMouseLeaveHover() } 
            onClick={ handleClick }
        >
        </div>
    )
    
}
export default ResetButton;