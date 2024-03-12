import React from 'react'

const useHoverButtonsStyles = (buttons) => {
    const [stylesState, setStylesState] = React.useState(
            buttons.map((button, i) => {
                return { id: i }; 
            })
        );

    function handleMouseOverStyle(key){
        let styles = [...stylesState];
        styles.forEach((style) => {
            if (style.id != key) { styles[style.id] = { ...style, small: true } }
        })
        setStylesState(styles);
    }
    function handleMouseLeaveStyle(){
        let styles = [...stylesState];
        styles.forEach((style) => {
            styles[style.id] = { ...style, small: false, selected: false } 
        })
        setStylesState(styles);
    }

    return { handleMouseOverStyle, handleMouseLeaveStyle, stylesState };

}

export default useHoverButtonsStyles;