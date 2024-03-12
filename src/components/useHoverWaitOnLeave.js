import React from 'react'

const useHover = (preventionTime, callback) => {
    const [hover, setHover] = React.useState(false);
    const hovering = React.useRef(undefined);
    const allowChange = React.useRef(undefined);
    let timeout = React.useRef();
    
    function timeoutSet(){
        timeout.current = setTimeout(() => {
            allowChange.current = true;
            if(!hovering.current) { handleMouseLeaveHoverLeave(); }
        }, preventionTime);
    } 

    function handleMouseOverHoverLeave( callback ){
        hovering.current = true;
        allowChange.current = false;
        
        clearTimeout(timeout.current);
        setHover(true);

        if(callback) { callback(); }
    }

    function handleMouseLeaveHoverLeave(){
        timeoutSet();
        hovering.current = false;

        if(allowChange.current){
            setHover(false);
            if (callback) { callback(); }
        }
    }

    return { handleMouseOverHoverLeave, handleMouseLeaveHoverLeave, hover, setHover };

}

export default useHover;