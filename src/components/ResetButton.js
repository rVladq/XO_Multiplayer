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
            className="buttonContainer"
            onMouseOver={ (event) => handleMouseOverHover() } 
            onMouseLeave={ (event) => handleMouseLeaveHover() } 
            style = { hover ? { transform: 'scale(1.2)' } : {} }
        >
            <button
                onClick={ handleClick }
                className="button"
                style={ hover ? { backgroundColor: 'rgb(221, 100, 20)', boxShadow: '0 0 30px -9px rgb(221, 100, 20)', } : props.style }
            />
        </div>
    )
    
}
export default ResetButton;