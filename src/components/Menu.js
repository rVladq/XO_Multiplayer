import React from "react";

import Button from "./Button";
import useHoverWaitOnLeave from "./useHoverWaitOnLeave"
import imgReturnArrow from "../images/backwardsArrow.png";

export default function Menu( { buttons, setButtons } ){

    const [prevMenus, setPrevMenus] = React.useState([]);
    const { handleMouseOverHoverLeave, handleMouseLeaveHoverLeave, hover, setHover } = useHoverWaitOnLeave(400);
    const keyIterator = React.useRef(0);
    
    function handleMouseOver(event, key){
        handleMouseOverHoverLeave();
    }
    function handleMouseLeave(event, key){
        handleMouseLeaveHoverLeave();
    }

    const menu = buttons.map((button, key) => {

        let handleClick = undefined;

        if(button.onClick) {
            handleClick = button.onClick;
        }
        else if(button.subButtons){
            handleClick = () => {
                let _buttons = [ ...button.subButtons ];
                setButtons(_buttons);
                
                let _subMenu = [ ...prevMenus ];
                _subMenu.unshift( [...buttons] );
                setPrevMenus(_subMenu);
                setHover(false);
                keyIterator.current += buttons.length;

            }
        }

        return(
            <div className="preventHoverOnRender"
                onMouseOver={(event) => handleMouseOver(event, key)}
                onMouseLeave={(event) => handleMouseLeave(event, key)}
                key={key + keyIterator.current}
            >
                <Button
                    id={key + keyIterator.current}
                    hasSubMenu={ button.subButtons ? true : false }
                    onClick = { handleClick } 
                    onClickProps = { button.onClickProps }
                    message={button.message? button.message : ''}
                    info={button.info}
                    subInfo={button.subInfo}
                    img={button.img}
                    img2={button.img2}
                    imgName=''
                    style={ hover ? { ...button.style, transform: 'scale(0.8)', backgroundColor: 'rgb(170, 79, 0)', boxShadow: '0 0 30px -9px rgb(170, 79, 0)', transition: 'all 0.3s'} : button.style}
                    />
            </div>
        )
    })

    return (
        <div className="menuContainer" style={ {height: '100%'} }>
            <div className="buttonsContainer">
                {menu}
            </div>
            { (prevMenus.length > 0) && 
            <button
                onClick={() => {
                    keyIterator.current += buttons.length;
                    setButtons( prevMenus[0] );
                    let _subMenu = [ ...prevMenus ];
                    _subMenu.shift();
                    setPrevMenus(_subMenu);
                    setHover(false);
                }}
                className="returnButton" 
            >
                <img src={imgReturnArrow} />
            </button> 
            }
        </div>
    
    )
}