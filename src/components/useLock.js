import React from "react"

export default function useLock(...unlockIds){

    const allElementsRef = React.useRef(document.querySelectorAll('*'));
    const lockedRef = React.useRef(false);

    function unlockAllIds(){
        unlockIds.forEach((id) => {
            document.getElementById(`${id}`).style.pointerEvents = 'auto';
        })
    }

    function lockUnlock() {
        if(!lockedRef.current) { 
            const allElements = document.querySelectorAll('*');
            allElements.forEach((element) => {
                if(element.classList.contains('returnButton')){
                    element.style.pointerEvents = 'none'
                    element.style.opacity = '70%';
                }
                if(element.classList.contains('buttonContainer')){
                    element.style.pointerEvents = 'none';
                }
            })
            unlockAllIds();
            lockedRef.current = true;
        }
        else if (lockedRef.current) { 
            const allElements = document.querySelectorAll('*');
            allElements.forEach((element) => {
                if(element.classList.contains('returnButton')){
                    element.style.opacity = '';
                    element.style.pointerEvents = 'auto';
                }
                if(element.classList.contains('buttonContainer')){
                    element.style.pointerEvents = 'auto';
                }
            })
            lockedRef.current = false;
        }

    }

    return { lockUnlock, lockedRef };
}