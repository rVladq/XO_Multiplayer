import React from "react"

export default function(props){

    const [time, setTime] = React.useState(
        {
            minutes: props.minutes ? props.minutes : 0,
            seconds: (props.seconds ? props.seconds : 0) + 1 //+1 to account for the first render (it would start at 59)
        }
    )

    const [change, setChange] = React.useState(false);
    const interval = React.useRef(null);

    React.useEffect(() => {
        if(props.running) {
            interval.current = setInterval(() => setChange(prevState => !prevState), 1000);
        }

        if(!props.running){ clearInterval(interval.current); };

    }, [props.running]);

    React.useEffect(() => {
        if(props.getTime){props.getTime(time.minutes, time.seconds);};
        if(time.minutes === 0 && time.seconds === 0) { clearInterval(interval.current); return};
        if(time.minutes !== 0 && time.seconds === 0) { setTime(prevState => {return({...prevState, minutes: prevState.minutes - 1, seconds: 59})});};
        if(time.seconds !== 0) { setTime(prevState => {return({...prevState, seconds: prevState.seconds - 1})});};
    }, [change]);

    const [displayNone, setDisplayNone] = React.useState("");
    if(props.hide && time.minutes === 0 && time.seconds === 0) { setTimeout(() => { setDisplayNone("none"); }, 1000) };

    const style = {
        display: displayNone,
        ...props.style
    }

    return(
        <div className="timer--container" style={style}>
            <h1>{time.minutes < 10 && <span>0</span>}{time.minutes}:{time.seconds < 10 && <span>0</span>}{time.seconds}</h1>
        </div>
    )
}