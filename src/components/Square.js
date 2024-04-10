import React from "react"
import icon from "../images/plus-solid.svg"
import useHover from "./useHoverNoReset.js"

const style = {
    backgroundColor: 'none',
    opacity: '0%',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    transition: 'all 0.2s ease'
}

const hoverStyle = {
    backgroundColor: 'white',
    opacity: '85%',
    position: 'absolute',
    height: '80%',
    width: '80%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    transition: 'all 0.2s ease'
}

let lastPickedStyle = {
    backgroundColor: 'orange',
    opacity: '30%',
    position: 'absolute',
    height: '82%',
    width: '82%',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '20px',
    transition: 'all 0.2s ease'
}

const Square = React.memo((props) => {
// console.log("re-render?")

    // const [hover, setHover] = React.useState(false);
    const [last, setLast] = React.useState(false);
    
    if(props.gameOver) {
        lastPickedStyle = {
            ...lastPickedStyle,
            opacity: '50%'
        }
    }
    else {
        lastPickedStyle = {
            ...lastPickedStyle,
            opacity: '30%'
        }
    }

    const { handleMouseOverHover, handleMouseLeaveHover, hover } = useHover(250);

    // React.useEffect(() => {
    //     if(props.gameOver === true) { return }
    //     const remove = () => {
    //         if(props.lastPicked) {setTimeout(() => setLast(true), 2000)};
    //     }
        
    //     window.addEventListener("focus", remove);
    //     return (() => window.removeEventListener("focus", remove));
    // }, [props]);

    return(

        <div className="square" >
            
            <div className="onHoverHitbox" 
            onMouseEnter={() => handleMouseOverHover()} 
            onMouseLeave={() => handleMouseLeaveHover()}
            >
                <div className="onHover" style = {(!hover) ? style : hoverStyle} />
                <div className="hitbox" onClick={props.onClick} />
                {/* <div className="squareShadow"> </div> */}
            </div>
            <div className = "lastPicked" style = {!(props.lastPicked && !last) ? style : lastPickedStyle} />
            {props.value === 'X' &&
                <div className="X">
                    <svg width="206" height="206" viewBox="0 0 206 206" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M196.7 8.98972C204.675 16.9639 204.675 29.8926 196.7 37.8667L133.842 100.719C132.671 101.89 132.671 103.79 133.842 104.961L196.7 167.813C204.675 175.787 204.675 188.716 196.7 196.69C188.725 204.664 175.795 204.664 167.821 196.69L104.962 133.838C103.79 132.667 101.891 132.667 100.72 133.838L37.8611 196.69C29.8861 204.664 16.9562 204.664 8.98123 196.69C1.00627 188.716 1.00627 175.787 8.98123 167.813L71.8393 104.961C73.011 103.79 73.011 101.89 71.8393 100.719L8.98122 37.8667C1.00626 29.8926 1.00626 16.9639 8.98122 8.98973C16.9562 1.01556 29.8861 1.01557 37.8611 8.98973L100.72 71.842C101.891 73.0134 103.79 73.0134 104.962 71.842L167.821 8.98972C175.795 1.01556 188.725 1.01556 196.7 8.98972Z" fill="black"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M166.056 7.21221C175.007 -1.73741 189.514 -1.7374 198.465 7.21221C207.421 16.167 207.421 30.6895 198.465 39.6442L137.384 100.719C136.213 101.89 136.213 103.79 137.384 104.961L198.465 166.036C207.421 174.991 207.421 189.513 198.465 198.468C189.514 207.417 175.007 207.417 166.056 198.468L104.962 137.38C103.79 136.208 101.891 136.208 100.72 137.38L39.6256 198.468C30.675 207.417 16.1673 207.417 7.21676 198.468C-1.7389 189.513 -1.73891 174.991 7.21676 166.036L68.2971 104.961C69.4689 103.79 69.4689 101.89 68.2971 100.719L7.21675 39.6443C-1.73892 30.6895 -1.73892 16.167 7.21675 7.21222C16.1673 -1.7374 30.675 -1.73739 39.6256 7.21222L100.72 68.3002C101.891 69.4716 103.79 69.4716 104.962 68.3002L166.056 7.21221ZM194.936 10.7672C187.937 3.76852 176.584 3.76852 169.585 10.7672L104.962 75.3838C103.79 76.5552 101.891 76.5552 100.72 75.3838L36.0966 10.7672C29.0972 3.76853 17.7451 3.76853 10.7457 10.7672C3.75144 17.7608 3.75144 29.0957 10.7457 36.0892L75.3814 100.719C76.5532 101.89 76.5532 103.79 75.3814 104.961L10.7457 169.591C3.75145 176.584 3.75145 187.919 10.7457 194.913C17.7451 201.911 29.0972 201.911 36.0966 194.913L100.72 130.296C101.891 129.125 103.79 129.125 104.962 130.296L169.585 194.913C176.584 201.911 187.937 201.911 194.936 194.913C201.93 187.919 201.93 176.584 194.936 169.591L130.3 104.961C129.128 103.79 129.128 101.89 130.3 100.719L194.936 36.0892C201.93 29.0957 201.93 17.7608 194.936 10.7672Z" fill="black"/>
</svg>

                </div>
            }
            {props.value === 'O' &&
            <div className="X"> 
<svg width="205" height="205" viewBox="0 0 205 205" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="102.34" cy="102.34" r="79.84" stroke="black" stroke-width="45"/>
</svg>


            </div>
            }

            <div className="plus plusCorner">
            <svg width="70" height="70" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M69.9999 15C69.9999 23.2843 63.2841 30 54.9999 30L34.9999 30C32.2385 30 29.9999 32.2386 29.9999 35L29.9999 55C29.9999 63.2843 23.2841 70 14.9999 70C6.7156 70 -0.000124837 63.2843 -0.000124474 55L-0.000122945 20C-0.000122462 8.9543 8.95418 -2.66839e-06 19.9999 -2.18557e-06L54.9999 -6.55671e-07C63.2841 -2.93554e-07 69.9999 6.71573 69.9999 15Z" fill="black"/>
</svg>



            </div>

            {/* <div className="plus plusSides">
            <svg width="66" height="41" viewBox="0 0 66 66" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.5 7.99999C0.500005 3.85786 3.85787 0.499995 8.00001 0.5L58 0.500058C62.1421 0.500063 65.5 3.85793 65.5 8.00007C65.5 12.1422 62.1421 15.5001 58 15.5001L45.5001 15.5C42.7387 15.5 40.5001 17.7386 40.5001 20.5L40.5001 33.5C40.5002 37.6421 37.1423 41 33.0002 41C28.858 41 25.5002 37.6421 25.5002 33.5L25.5001 20.5C25.5001 17.7386 23.2616 15.5 20.5001 15.5L7.99999 15.5C3.85786 15.5 0.499995 12.1421 0.5 7.99999Z" fill="black"/>
</svg>





            </div> */}

            <div className="plus plusMiddle">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M55 0.00012207C63.2843 0.00012207 70 6.71585 70 15.0001V35.0001C70 37.7615 72.2386 40.0001 75 40.0001H95C103.284 40.0001 110 46.7159 110 55.0001C110 63.2844 103.284 70.0001 95 70.0001H75C72.2386 70.0001 70 72.2387 70 75.0001V95.0001C70 103.284 63.2843 110 55 110C46.7157 110 40 103.284 40 95.0001V75.0001C40 72.2387 37.7614 70.0001 35 70.0001H15C6.71573 70.0001 9.53674e-07 63.2844 0 55.0001C-9.53674e-07 46.7159 6.71573 40.0001 15 40.0001L35 40.0001C37.7614 40.0001 40 37.7615 40 35.0001V15.0001C40 6.71585 46.7157 0.00012207 55 0.00012207Z" fill="black"/>
</svg>
{/* <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M52.0001 0.5C58.3514 0.499993 63.5001 5.64871 63.5002 12L63.5002 35.4996C63.5002 38.261 65.7388 40.4996 68.5002 40.4996L92 40.4996C98.3513 40.4996 103.5 45.6484 103.5 51.9996C103.5 58.3509 98.3513 63.4996 92 63.4996L68.5002 63.4996C65.7388 63.4996 63.5002 65.7382 63.5002 68.4996L63.5002 92C63.5002 98.3513 58.3515 103.5 52.0003 103.5C45.649 103.5 40.5003 98.3513 40.5002 92L40.5002 68.4996C40.5002 65.7381 38.2616 63.4996 35.5002 63.4996L12 63.4995C5.64871 63.4995 0.499992 58.3508 0.5 51.9995C0.500008 45.6482 5.64874 40.4995 12 40.4995L35.5002 40.4996C38.2616 40.4996 40.5002 38.261 40.5002 35.4996L40.5002 12C40.5001 5.64874 45.6489 0.500007 52.0001 0.5Z" fill="black"/>
</svg> */}






            </div>

        </div>
    )
});
export default Square;