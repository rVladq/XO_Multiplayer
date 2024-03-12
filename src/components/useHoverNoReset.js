import React from 'react'

const useHoverNoReset = (preventionTime, callback) => {
    const [hover, setHover] = React.useState(false);
    const hovering = React.useRef(undefined);
    const allowChange = React.useRef(undefined);
    const timeout = React.useRef();
    
    function timeoutFunction(){
        timeout.current = setTimeout(() => {
            allowChange.current = true;
            if(!hovering.current) { handleMouseLeaveHover(); }
        }, preventionTime);
    } 

    function handleMouseOverHover( callback ){
        hovering.current = true;
        allowChange.current = false;

        timeoutFunction();

        setHover(true);

        if(callback) { callback(); }
    }

    function handleMouseLeaveHover(){
        hovering.current = false;
        if(allowChange.current){
            setHover(false);
            if (callback) { callback(); }
        }
    }

    return { handleMouseOverHover, handleMouseLeaveHover, hover, setHover };

}

export default useHoverNoReset;