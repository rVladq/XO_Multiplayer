import React, { useEffect } from "react"
import { db } from "../App.js"
import * as database  from "firebase/database";
import {child} from "firebase/database";
import Square from "./Square"
import Countdown from "./Countdown"

export default function TableMultiplayer(props){
    
    const [tableState, setTableState] = React.useState(tableSetup());
    const tableStateRef = React.useRef(tableState);
    const tableClickHandlers = React.useRef();
    if(!tableClickHandlers.current) { tableClickHandlers.current = tableClickHandlersSetup(); }
    const playerValue = React.useRef(props.playerValue);
    const yourTurn = React.useRef(playerValue.current ? true : false);
    const lastPicked = React.useRef( { line: undefined, cell: undefined } );
    const tableFull = React.useRef(0);

    const [preTimerOn, setPreTimerOn] = React.useState(props.id ? true : false);
    const [timerOn, setTimerOn] = React.useState(false);
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

    var cell = 
        {
            value: "",
            position: {line: 0, cell: 0},
            isChecked: false,
            lastPicked: undefined,
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
    const gameRef = database.ref(db, `/games/${props.tableSize}/${props.id}`);
    React.useEffect(()=>{
        if(props.id){
            database.onDisconnect(gameRef).remove();
            database.set(database.child(gameRef, '/table'), tableStateRef.current);

            database.onValue(database.child(gameRef, '/info/lastPicked'), (snapshot) => {
                if(!snapshot.exists()) { return }
                lastPicked.current = snapshot.val();
            })

            database.onValue(database.child(gameRef, '/info/winner'), (snapshot) => {
                if(!snapshot.exists()) { return }
                winner.current = snapshot.val();
            })

            database.onValue(database.child(gameRef, '/table'), (snapshot) => {
                if(gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) {
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val())); 
                    setTableState(_tableState);
                }
                else if(gameStarted.current){
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val()));
                    if(!yourTurn.current && _tableState){
                        _tableState[lastPicked.current.line][lastPicked.current.cell] = {
                            ..._tableState[lastPicked.current.line][lastPicked.current.cell],
                            lastPicked: true,
                        }
                    }
                    yourTurn.current = !yourTurn.current;
                    setTableState(_tableState);
                }
                else if(!gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) {
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val())); 
                    setTableState(_tableState);
                }
            })
            
            database.onValue(child(gameRef, '/status'), (child)=>{
                if(!child.exists()) return;
                if(child.val() === 'in progress') { gameStarted.current = true; setTimerOn(true); }
                if(child.val() === 'game over') { endGame(); }
            })

            database.onValue(child(gameRef, '/winner'), (child)=>{
                if(!child.exists()) return;
                setTimeout(() => alert(child.val()), 300);
            })
        }

    }, [])

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
            else if(Math.sqrt(tableFull.current) === props.tableSize) { database.set(child(gameRef, '/status'), 'game over'); return }
            else { return }
    
            database.set(child(gameRef, '/info/winner'), playerValue.current ? 'X' : 'O');
    
            database.set(child(gameRef, '/status'), 'game over');
        }
        if (preTimerOn === false) { return }
        if (!yourTurn.current) { return }
        
        let _tableState = JSON.parse(JSON.stringify(tableStateRef.current));
        if(_tableState[line][cell].isChecked) { return }
        tableFull.current = tableFull.current + 1;
        
        _tableState[line][cell] = {
            ..._tableState[line][cell],
            value: playerValue.current ? "X" : "O",
            isChecked: true,
        };

        if(gameStarted.current){
            _tableState[lastPicked.current.line][lastPicked.current.cell] = {
                ..._tableState[lastPicked.current.line][lastPicked.current.cell],
                lastPicked: false,
            }
        }

        if (!gameStarted.current) { database.set(child(gameRef, '/status'), 'in progress'); }
        database.set(database.child(gameRef, '/info/lastPicked'), { line: line, cell: cell });
        database.set(database.child(gameRef, '/table'), _tableState);
        
        checkWin(line, cell);
    }

    function endGame(){
        
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

        if(!gameStarted.current) { database.set(database.child(gameRef, '/table'), _tableState); database.set(child(gameRef, '/winner'), `Game aborted!`); return }
        if (gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) { database.set(database.child(gameRef, '/table'), _tableState); database.set(child(gameRef, '/winner'), `Draw!`); return }

        _tableState[lastPicked.current.line][lastPicked.current.cell] = { ..._tableState[lastPicked.current.line][lastPicked.current.cell], value: winner.current, lastPicked: true, gameOver: true }

        database.set(database.child(gameRef, '/table'), _tableState);
        setTimerOn(false);

        if(gameStarted.current && winner.current === 'X'){ database.set(child(gameRef, '/winner'), 'X won!') }
        else if(gameStarted.current && winner.current === 'O'){ database.set(child(gameRef, '/winner'), 'O won!') }
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
        if(timer.minutes === 0 && timer.seconds === 0) { timerRef.current = timer; database.set(child(gameRef, '/status'), 'game over'); }
    }, [timer]);

    return(
        <div className="game--container">
            {(!timerOn && !gameStarted.current) && <Countdown getTime={getTime} minutes={0} seconds={10} running={preTimerOn} hide={false}/>}
            {(timerOn || (!timerOn && gameStarted.current)) && <Countdown getTime={getTime} minutes={10} seconds={0} running={timerOn} hide={false}/>}
            <div className="table">
                {table}
            <div className="outside" />
            </div>
        </div>
    )
}