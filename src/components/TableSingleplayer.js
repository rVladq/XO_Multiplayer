import React, { useEffect } from "react"
import { db } from "../App.js"
import * as database  from "firebase/database";
import {child} from "firebase/database";
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
        if(!gameOver.current) {playerValue.current = playerValue.current === 'X' ? 'O' : 'X'; }
        yourTurn.current = true;
        lastPicked.current = { line: undefined, cell: undefined };
        tableFull.current = 0;
        setTimerOn((prev)=>!prev);
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

        if (preTimerOn === false) { return }
        if (!yourTurn.current) { return }
        if(gameOver.current) {return;}

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
        playerValue.current = playerValue.current === 'X' ? 'O' : 'X';

        if (!gameStarted.current) { gameStarted.current = true; setTimerOn((prev) => !prev); }
        else if(!gameOver.current){
            setTimerOn((prev) => !prev);
        }
        

    }

    function endGame(){
        gameOver.current = true;
        round.current = round.current + 1;
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
        else if(gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0){ setTableState(_tableState); alertWinner('Draw!'); return;}

        _tableState[lastPicked.current.line][lastPicked.current.cell] = { ..._tableState[lastPicked.current.line][lastPicked.current.cell], lastPicked: true, gameOver: true }

        setTableState(_tableState);
        // setTimerOn(false);
        
        function alertWinner(text) { setTimeout(() => alert(text), 300); }
        if(gameStarted.current && winner.current === 'X'){ alertWinner('X won!'); }
        else if(gameStarted.current && winner.current === 'O'){ alertWinner('O won!') }
        else if(gameStarted.current && !winner.current ){ alertWinner('Draw!') }
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


                {(!timerOn && !gameStarted.current && round.current === 1) && <Countdown key={refresh} getTime={getTime} minutes={0} seconds={10} running={preTimerOn} hide={false}/>}
                
                {(timerOn || (!timerOn && gameStarted.current) || round.current > 1) && 
                    <div className = "scoreboard--container">
                        <div className = "scoreboard--score_letter" style={{paddingBottom: '0px', ...timerStyle[selectedStyle1]}}>
                            <h2>{myscore.current}</h2>
                            <Countdown key={refresh} getTime={getTime} minutes={10} seconds={0} running={gameOver.current ? false : !timerOn} hide={false}/>
                        </div>
                        <div className = "scoreboard--score_letter" style = {timerStyle[selectedStyle2]}>
                            <h2>{enemyscore.current}</h2>
                            <Countdown key={refresh} getTime={getTime} minutes={10} seconds={0} running={gameOver.current ? false : timerOn} hide={false}/>
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