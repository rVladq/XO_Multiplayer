import React, { useEffect } from "react"

import Square from "./Square"
import Countdown from "./Countdown"
import ResetButton from "./ResetButton.js";

export default function TableSingleplayer(props){
    
    const [tableState, setTableState] = React.useState(tableSetup());
    const tableStateRef = React.useRef();
    const tableClickHandlers = React.useRef();
    if(!tableClickHandlers.current) { tableClickHandlers.current = tableClickHandlersSetup(); }
    const playerValue = React.useRef('X');
    const yourTurn = React.useRef(playerValue.current ? true : false);
    const lastPicked = React.useRef( { line: undefined, cell: undefined } );
    const tableFull = React.useRef(0);
    const myscore = React.useRef(0);
    const enemyscore = React.useRef(0);
    const round = React.useRef(1);

    const [refresh, setRefresh] = React.useState(1);
    const [preTimerOn, setPreTimerOn] = React.useState(true);
    const [timerOn, setTimerOn] = React.useState(false);
    const gameOver =  React.useRef(false);
    const [timer, setTimer] = React.useState({
        minutes: "", 
        seconds: ""
    });
    const timerRef = React.useRef({
        minutes: "", 
        seconds: ""
    });

    const gameStarted = React.useRef(false);
    const winner = React.useRef(undefined);

    function reset(){
        if(round.current % 2 === 0){
            if (playerValue.current === 'O'){
                setTimerOn((prev)=>!prev);
            }
            playerValue.current = 'X';
        }
        else {
            if(playerValue.current === 'X'){
                setTimerOn((prev)=>!prev);
            }
            playerValue.current = 'O';
        }
        round.current = round.current + 1;
        // if(!gameOver.current) {playerValue.current = playerValue.current === 'X' ? 'O' : 'X'; }
        yourTurn.current = true;
        lastPicked.current = { line: undefined, cell: undefined };
        tableFull.current = 0;
        // setPreTimerOn(true);
        setTableState(tableSetup());
        setTimer({
            minutes: "", 
            seconds: ""
        });
        gameStarted.current = false;
        winner.current = undefined;
        gameOver.current = false;
        setRefresh((prev) => !prev);
    }

    var cell = 
        {
            value: "",
            position: {line: 0, cell: 0},
            isChecked: false,
            lastPicked: undefined,
            gameOver: false,
        };
    function tableSetup(){
        var tableSetup = [];
        for(let i = 0; i < props.tableSize; i++){
            tableSetup.push([]);
            for(let j = 0; j < props.tableSize; j++){
                tableSetup[i].push();
                tableSetup[i][j] = {...tableSetup[i][j], position: {line: i, cell: j}};
            }
        }
        return(tableSetup);
    }
    function tableClickHandlersSetup(){
        var clickHandlers = [];
        for(let i = 0; i < props.tableSize; i++){
            clickHandlers.push([]);
            for(let j = 0; j < props.tableSize; j++){
                clickHandlers[i].push();
                clickHandlers[i][j] = () => handleClick(i, j);
            }
        }
        return clickHandlers;
    }

    tableStateRef.current = tableState;

    function handleClick(line, cell) {
        function checkWin(line, cell){

            function checkFirstDiag(){
                var temp = 0;
                //going up
                for(let i = line, j = cell; i >= 0, j>=0; i--, j--){
                    if(!_tableState[i] || !_tableState[i][j]){ break }
                    if(_tableState[line][cell].value === _tableState[i][j].value){
                        temp++;
                    }else{break;}
                }
                //going down
                for(let i = line+1, j = cell+1; i < props.tableSize, j < props.tableSize; i++, j++){
                    if(!_tableState[i] || !_tableState[i][j]){ break }
                    if(_tableState[line][cell].value === _tableState[i][j].value){
                        temp++;
                    }else{break;}
                }
                return(temp);
            }
            function checkSecondDiag(){
                var temp = 0;
                //going up
                for(let i = line, j = cell; i >= 0, j < props.tableSize; --i, ++j){
                    if(!_tableState[i] || !_tableState[i][j]){ break }
                    if(_tableState[line][cell].value === _tableState[i][j].value){
                        temp++;
                    }else{break;}
                }
                //going down
                for(let i = line+1, j = cell-1; i < props.tableSize, j >= 0; ++i, --j){
                    if(!_tableState[i] || !_tableState[i][j]){ break }
                    if(_tableState[line][cell].value === _tableState[i][j].value){
                        temp++;
                    }else{ break }
                }
                return(temp);
            }
            function checkVertical(){
                var temp = 0;
                //going up
                for(let i = line; i >= 0; --i){
                    if(!_tableState[i] || !_tableState[i][cell]){ break }
                    if(_tableState[line][cell].value === _tableState[i][cell].value){
                        temp++;
                    }else{ break }
                }
                //going down
                for(let i = line+1; i < props.tableSize; i++){
                    if(!_tableState[i] || !_tableState[i][cell]){ break }
                    if(_tableState[line][cell].value === _tableState[i][cell].value){
                        temp++;
                    }else{ break }
                }
                return(temp);
            }
            function checkHorizontal(){
                var temp = 0;
                //going left
                for(let j = cell; j >= 0; --j){
                    if(!_tableState[line] || !_tableState[line][j]){ break }
                    if(_tableState[line][cell].value === _tableState[line][j].value){
                        temp++;
                    }else{ break }
                }
                //going right
                for(let j = cell+1; j < props.tableSize; ++j){
                    if(!_tableState[line] || !_tableState[line][j]){ break }
                    if(_tableState[line][cell].value === _tableState[line][j].value){
                        temp++;
                    }else{ break }
                }
                return(temp);
            }
            if(checkFirstDiag() >= props.countToWin) {}
            else if(checkSecondDiag() >= props.countToWin) {}
            else if(checkVertical() >= props.countToWin) {}
            else if(checkHorizontal() >= props.countToWin) {}
            else if(tableFull.current === (props.tableSize * props.tableSize)) { endGame(); return }
            else { return }
            console.log(round.current, round.current%2.0 != 0)
            if(playerValue.current === 'X'){
                myscore.current = myscore.current + 1;
            } else {
                enemyscore.current = enemyscore.current + 1;
            }
            winner.current = playerValue.current;
            endGame();
        }

        if (!preTimerOn) { return }
        if (!yourTurn.current) { return }
        if(gameOver.current) { return }

        let _tableState = JSON.parse(JSON.stringify(tableStateRef.current));
        if(_tableState[line][cell].isChecked) { return }
        tableFull.current = tableFull.current + 1;
        
        _tableState[line][cell] = {
            ..._tableState[line][cell],
            value: playerValue.current,
            isChecked: true,
            lastPicked: true,
        };

        if(gameStarted.current){
            _tableState[lastPicked.current.line][lastPicked.current.cell] = {
                ..._tableState[lastPicked.current.line][lastPicked.current.cell],
                lastPicked: false,
            }
        }

        lastPicked.current = { line: line, cell: cell };
        tableStateRef.current = _tableState;
        setTableState(_tableState);
        checkWin(line, cell);
        if(!gameOver.current) {playerValue.current = playerValue.current === 'X' ? 'O' : 'X';}

        if (!gameStarted.current) { gameStarted.current = true; setTimerOn((prev) => !prev); }
        else if(!gameOver.current){
            setTimerOn((prev) => !prev);
        }
        

    }

    function endGame() {
        
        gameOver.current = true;
        let _tableState = JSON.parse(JSON.stringify(tableStateRef.current));
        for(let i = 0; i < props.tableSize; i++){
            for(let j = 0; j < props.tableSize; j++){
                _tableState[i][j] = { 
                    ..._tableState[i][j],
                    lastPicked: false,
                    isChecked: true,
                };
            }
        }

        if(!gameStarted.current) { setTableState(_tableState); alertWinner('Game aborted!'); return }
        else if(gameStarted.current && 
            (timerRef.current.minutes === 0 && timerRef.current.seconds === 0)
            ){ 
                if(playerValue.current === 'X'){
                    enemyscore.current = enemyscore.current + 1;
                }
                else {
                    myscore.current = myscore.current + 1;
                }
                setTableState(_tableState); return; 
            }
        else if (gameStarted.current && (tableFull.current === props.tableSize * props.tableSize && winner.current === undefined)) { setTableState(_tableState); return; } 
        
        
        _tableState[lastPicked.current.line][lastPicked.current.cell] = { ..._tableState[lastPicked.current.line][lastPicked.current.cell], lastPicked: true, gameOver: true }

        setTableState(_tableState);
        // setTimerOn(false);
        
        function alertWinner(text) { setTimeout(() => alert(text), 300); }
        // if(gameStarted.current && winner.current === 'X'){ alertWinner('X won!'); }
        // else if(gameStarted.current && winner.current === 'O'){ alertWinner('O won!') }
        // else if(gameStarted.current && !winner.current ){ alertWinner('Draw!') }
    }

    let table = 
        tableState.map((line, i) => {
            return(
                <div key={i} className="line">
                {line.map((cell, j) => {
                    return(
                        <div key={j+props.tableSize} className="cell">
                            <Square
                                value={cell.value}
                                lastPicked={cell.lastPicked}
                                gameOver={cell.gameOver}
                                onClick={ tableClickHandlers.current[cell.position.line][cell.position.cell] }
                            />
                        </div>
                    )
                })}
                </div>
            )
        });

    function getTime(min, sec) {
        setTimer(prevState => {return({...prevState, minutes: min, seconds: sec})});
    }

    React.useEffect(() => {
        timerRef.current = timer;
        if(timer.minutes === 0 && timer.seconds === 0) { timerRef.current = timer; endGame(); }
    }, [timer]);

    const timerStyle=[
        {
            transform: 'scale(0.7)',
            opacity: 0.5,
        },
        {
            transform: 'scale(1)',
            opacity: 1
        }
    ]

    let selectedStyle1 = timerOn ? 0 : 1;
    let selectedStyle2 = timerOn ? 1 : 0;
    // if(gameOver.current) {
    //     selectedStyle1 = 1; selectedStyle2 = 1;
    // }

    return(
        
        <div className="game--container">

                {(timerOn || (!timerOn && gameStarted.current) || round.current > 0) && 
                    <div className = "scoreboard--container">
                        <div className = "scoreboard--score_letter" style={{paddingBottom: '0px', ...timerStyle[selectedStyle1]}}>
                            <div className ="scoreboard--score_letter_container">
                                <svg width="25" height="25" viewBox="0 0 206 206" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M196.7 8.98972C204.675 16.9639 204.675 29.8926 196.7 37.8667L133.842 100.719C132.671 101.89 132.671 103.79 133.842 104.961L196.7 167.813C204.675 175.787 204.675 188.716 196.7 196.69C188.725 204.664 175.795 204.664 167.821 196.69L104.962 133.838C103.79 132.667 101.891 132.667 100.72 133.838L37.8611 196.69C29.8861 204.664 16.9562 204.664 8.98123 196.69C1.00627 188.716 1.00627 175.787 8.98123 167.813L71.8393 104.961C73.011 103.79 73.011 101.89 71.8393 100.719L8.98122 37.8667C1.00626 29.8926 1.00626 16.9639 8.98122 8.98973C16.9562 1.01556 29.8861 1.01557 37.8611 8.98973L100.72 71.842C101.891 73.0134 103.79 73.0134 104.962 71.842L167.821 8.98972C175.795 1.01556 188.725 1.01556 196.7 8.98972Z" fill="orange"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M166.056 7.21221C175.007 -1.73741 189.514 -1.7374 198.465 7.21221C207.421 16.167 207.421 30.6895 198.465 39.6442L137.384 100.719C136.213 101.89 136.213 103.79 137.384 104.961L198.465 166.036C207.421 174.991 207.421 189.513 198.465 198.468C189.514 207.417 175.007 207.417 166.056 198.468L104.962 137.38C103.79 136.208 101.891 136.208 100.72 137.38L39.6256 198.468C30.675 207.417 16.1673 207.417 7.21676 198.468C-1.7389 189.513 -1.73891 174.991 7.21676 166.036L68.2971 104.961C69.4689 103.79 69.4689 101.89 68.2971 100.719L7.21675 39.6442C-1.73892 30.6895 -1.73892 16.167 7.21675 7.21222C16.1673 -1.7374 30.675 -1.73739 39.6256 7.21222L100.72 68.3002C101.891 69.4716 103.79 69.4716 104.962 68.3002L152.5 20.7669L166.056 7.21221ZM194.936 10.7672C187.937 3.76852 176.584 3.76852 169.585 10.7672L104.962 75.3838C103.79 76.5552 101.891 76.5552 100.72 75.3838L36.0966 10.7672C29.0972 3.76853 17.7451 3.76853 10.7457 10.7672C3.75144 17.7608 3.75144 29.0957 10.7457 36.0892L75.3814 100.719C76.5532 101.89 76.5532 103.79 75.3814 104.961L10.7457 169.591C3.75145 176.584 3.75145 187.919 10.7457 194.913C17.7451 201.911 29.0972 201.911 36.0966 194.913L100.72 130.296C101.891 129.125 103.79 129.125 104.962 130.296L169.585 194.913C176.584 201.911 187.937 201.911 194.936 194.913C201.93 187.919 201.93 176.584 194.936 169.591L130.3 104.961C129.128 103.79 129.128 101.89 130.3 100.719L194.936 36.0892C201.93 29.0957 201.93 17.7608 194.936 10.7672Z" fill="orange"/>
                                </svg>
                                <h1>-</h1>
                                <h1 className="score">{myscore.current}</h1>
                            </div>
                            <Countdown key={refresh} getTime={getTime} minutes={0} seconds={30} running={gameOver.current ? false : !timerOn} hide={false}/>
                        </div>
                        <div className = "scoreboard--score_letter" style = {timerStyle[selectedStyle2]}>
                            <div className ="scoreboard--score_letter_container">
                                <h1 className="score">{enemyscore.current}</h1>
                                <h1>-</h1>
                                <svg width="25" height="25" viewBox="0 0 205 205" fill="" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="102.34" cy="102.34" r="79.84" stroke="orange" stroke-width="45"/>
                                </svg>
                            </div>
                            <Countdown key={refresh} getTime={getTime} minutes={0} seconds={30} running={gameOver.current ? false : timerOn} hide={false}/>
                        </div>
                    </div>
                }

            <div className="table">
                {table}
                <div className="outside" />
            </div>
            
            <ResetButton onClick={reset}/>
        
        </div>

    )
}