import React from "react";
import imgplaceholderFill from "../images/placeholderFill.png"
import imgplaceholderBlank from "../images/placeholderBlank.png"
import imgMultiplayer from "../images/multiplayer.png" 
import imgSingleplayer from "../images/singleplayer.png"
import img3x3 from "../images/3x3.png"
import img4x4 from "../images/4x4.png"
import img7x7 from "../images/7x7.png" 
import Menu from './Menu'

export default function Home(props){

    const [buttons, setButtons] = React.useState([
        {
            info: 'SINGLEPLAYER',
            img: imgSingleplayer,
            subButtons: [
                {
                    info: 'Against PC',
                    img: imgplaceholderFill,
                },
                {
                    info: 'Alone!...',
                    img: imgplaceholderBlank,
                    subButtons: [
                        {
                            info: '3X3',
                            subInfo: '(3 in a row)',
                            img: img3x3,
                            img2: imgSingleplayer,
                            animation: 'pulse',
                            onClick: props.singleplayer,
                            onClickProps: { size: 3, count: 3 },
                        },
                        {
                            info: '9X9',
                            subInfo: '(5 in a row)',
                            img: img7x7,
                            img2: imgSingleplayer,
                            animation: 'pulse',
                            onClick: props.singleplayer,
                            onClickProps: { size: 9, count: 5 },
                        },
                        {
                            info: 'CUSTOM',
                            img: imgplaceholderFill,
                        },
                    ],
                }
            ],
            style: {
                info: {}
            },
        },
        {
            info: 'MULTIPLAYER',
            img: imgMultiplayer,
            subButtons: [
                {
                    info: '3X3',
                    subInfo: '(3 in a row)',
                    img: img3x3,
                    img2: imgMultiplayer,
                    animation: 'pulse',
                    onClick: props.matchmake,
                    onClickProps: { size: 3, count: 3 },
                },
                {
                    info: '9X9',
                    subInfo: '(5 in a row)',
                    img: img7x7,
                    img2: imgMultiplayer,
                    animation: 'pulse',
                    onClick: props.matchmake,
                    onClickProps: { size: 9, count: 5 },
                },
                {
                    info: 'CUSTOM',
                    img: imgplaceholderFill,
                },
            ],
        },
        {
            info: '(❛ ᴗ❛)',
            img: imgplaceholderBlank,
            style: {
                // backgroundColor: 'purple'
            },
            subButtons: [
                {
                    message: 'CIRCLING',
                    info: "(︡❛ ᴗ❛ ͜)",
                },
                {
                    message: 'SKY',
                    info: '( ͡❛ ͜ʖ ͡❛)',
                    subButtons: [
                        {message: 'Oh, wow!' },
                        {
                            info: '^.^', 
                            message: '	⊂(◉‿◉)つ', 
                        },
                        {message: 'You found Meh!'},
                    ]
                },
            ],
        }
    ]);

    return(

        <div className="homeContainer">
            <div className="heroImg">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M194.118 6.09988C202.106 14.0876 202.106 27.0381 194.118 35.0258L129.035 100.109L194.118 165.192C202.106 173.18 202.106 186.131 194.118 194.118C186.131 202.106 173.18 202.106 165.192 194.118L100.109 129.035L35.0258 194.118C27.0381 202.106 14.0876 202.106 6.0999 194.118C-1.88778 186.131 -1.88778 173.18 6.0999 165.192L71.1832 100.109L6.09988 35.0258C-1.88779 27.0381 -1.88779 14.0876 6.09988 6.0999C14.0876 -1.88778 27.0381 -1.88778 35.0258 6.09989L100.109 71.1832L165.192 6.09988C173.18 -1.88779 186.131 -1.88779 194.118 6.09988Z" fill="black"/>
                </svg>
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M100 160C133.137 160 160 133.137 160 100C160 66.8629 133.137 40 100 40C66.8629 40 40 66.8629 40 100C40 133.137 66.8629 160 100 160ZM100 200C155.228 200 200 155.228 200 100C200 44.7715 155.228 0 100 0C44.7715 0 0 44.7715 0 100C0 155.228 44.7715 200 100 200Z" fill="black"/>
                </svg>
            </div>
            <Menu buttons={ buttons } setButtons={setButtons} />
        </div>

    )
}