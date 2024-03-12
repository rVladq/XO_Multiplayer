import React from "react";
import useHover from "./useHover";
import useLock from "./useLock";

const Button = (props) => {
    const allowClick = React.useRef(true);
    const lockOnClick = React.useRef(false);
    const { lockUnlock, lockedRef } = useLock(props.id);

    function handleClick(){
        if(props.onClick && allowClick.current) { 
            if (props.once) { 
                allowClick.current = false 
            } 
            else if(props.animation) { 
                animation.current = props.animation;
            }
            props.onClick(props.onClickProps ? props.onClickProps : '');
            if(!props.hasSubMenu) { lockUnlock(); }
            setShowText((prevState) => !prevState);
        }
    }
    const animation = React.useRef(props.animation);
    const [showText, setShowText] = React.useState(props.img ? false : true);
    let img = (showText && props.img2) ? props.img2 : props.img;
    const { handleMouseOverHover, handleMouseLeaveHover, hover } = useHover(300);
    
    let imgStyle;
    if(( props.info === '9X9' || props.info === '7X7' || props.info === '4X4' || props.info === '3X3' ) && !showText){
        imgStyle = {
            height: '77%',
        }
    }

    return(
        <div 
            className="buttonContainer"
            onMouseOver={ (event) => handleMouseOverHover() } 
            onMouseLeave={ (event) => handleMouseLeaveHover() } 
            style = { hover ? { transform: 'scale(1.2)' } : {} }
        >
            {
            props.info &&
            <div className="buttonInfoContainer" style={ hover ? {transform: 'scale(1)', opacity: '1'} : {}} >
                <p className="buttonInfo" style={ props.subInfo ? { whiteSpace: 'nowrap'} : {}}> { props.info } </p>
                { props.subInfo && <p className="buttonInfo buttonSubInfo"> { props.subInfo } </p> }
            </div>
            }
            <button
                id={props.id}
                onClick={ handleClick }
                className="button"
                style={ hover ? { backgroundColor: 'rgb(221, 100, 20)', boxShadow: '0 0 30px -9px rgb(221, 100, 20)', } : props.style }
            >
                {( (props.img && !showText) || !props.message) ? <img style = {imgStyle} className={showText ? 'pulse buttonImg' : 'buttonImg'} src={img} /> : <p className="buttonImg"> {props.message} </p> }
            </button>
        </div>
    )
    
}
export default Button;