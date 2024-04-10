import React, { useEffect } from "react"
import { db } from "../App.js"
import * as database  from "firebase/database";
import { child } from "firebase/database";
import Square from "./Square"
import Countdown from "./Countdown"
import ResetButton from "./ResetButton.js";

export default function TableMultiplayer(props){
    
    const [tableState, setTableState] = React.useState(tableSetup());
    const tableStateRef = React.useRef(tableState);
    const tableClickHandlers = React.useRef();
    if(!tableClickHandlers.current) { tableClickHandlers.current = tableClickHandlersSetup(); }
    const playerValue = React.useRef(props.playerValue);
    const yourTurn = React.useRef(playerValue.current === 'X' ? true : false);
    const lastPicked = React.useRef( { line: undefined, cell: undefined } );
    const tableFull = React.useRef(0);
    const myscore = React.useRef(0);
    const enemyscore = React.useRef(0);
    const round = React.useRef(1);
    const playerRef =  React.useRef(props.playerRef.current);
    const clickedRefresh = React.useRef(false);

    const [refresh, setRefresh] = React.useState(1);
    const [preTimerOn, setPreTimerOn] = React.useState(props.id ? true : false);
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

    function request_reset(){

        database.get(child(gameRef, '/reset'))
            .then((snap) => {
                if (snap.exists()) {
                    if(!clickedRefresh.current) {
                        if(snap.val() === 0) clickedRefresh.current = true;
                        database.set(child(gameRef, '/reset'), snap.val() + 1);
                    }
                    else {
                        database.set(child(gameRef, '/reset'), snap.val() - 1);
                        clickedRefresh.current = false;
                    }
                }
            })
    }

    function reset(){

        if(round.current % 2 === 0) { //switch to X
            if(playerValue.current === 'O'){
                if(yourTurn.current){
                    setTimerOn((prev)=>!prev);
                    yourTurn.current = !yourTurn.current
                }
            }
            else{
                if(playerValue.current === 'X'){
                    if(!yourTurn.current){
                        setTimerOn((prev)=>!prev);
                        yourTurn.current = !yourTurn.current
                    }
                }
            }
        }
        else { //switch to O
            if(playerValue.current === 'X'){
                if(yourTurn.current){
                    setTimerOn((prev)=>!prev);
                    yourTurn.current = !yourTurn.current
                }
            }
            else{
                if(playerValue.current === 'O'){
                    if(!yourTurn.current){
                        setTimerOn((prev)=>!prev);
                        yourTurn.current = !yourTurn.current
                    }
                }
            }
        }

        round.current = round.current + 1;

        clickedRefresh.current = false;
        database.set(child(gameRef, '/status'), 'reset')
        database.set(child(gameRef, '/reset'), 0);
        // lastPicked.current = { line: undefined, cell: undefined };
        tableFull.current = 0;
        // setTimerOn((prev) => !prev);
        setTableState(tableSetup());
        // tableStateRef.current = tableSetup();
        gameOver.current = false;
        gameStarted.current = false;
        setTimer({
            minutes: "", 
            seconds: ""
        });
        setRefresh((prev) => !prev);
        database.set(database.child(gameRef, '/table'), tableSetup());


        // winner.current = undefined;

    }

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
            database.set(child(gameRef, '/reset'), 0);
            database.onDisconnect(gameRef).remove();
            database.set(database.child(gameRef, '/table'), tableStateRef.current);

            database.onValue(database.child(gameRef, `/players`), (snapshot) => {
                if(!snapshot.exists()) { return }
                let players = snapshot.val();
                Object.keys(players).forEach((key) => {
                    if(players[`${key}`]['value'] === 'X'){
                        myscore.current = players[`${key}`]['score'];
                    }
                    else {
                        enemyscore.current = players[`${key}`]['score'];
                    }
                })
            })

            database.onValue(database.child(gameRef, '/reset'), (snap) => {
                if(snap.val() === 2) {
                    reset();
                }
            })

            database.onValue(database.child(gameRef, '/info/lastPicked'), (snapshot) => {
                if(!snapshot.exists()) { return }
                lastPicked.current = snapshot.val();
            })

            database.onValue(database.child(gameRef, '/info/winner'), (snapshot) => {
                if(!snapshot.exists()) { return }
                winner.current = snapshot.val();
            })

            database.onValue(database.child(gameRef, '/table'), (snapshot) => {
                console.log('D');
                
                if(gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) {
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val())); 
                    setTableState(_tableState);
                    console.log('B');

                }
                else if(gameStarted.current){
                    console.log('A');
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val()));
                    if(!yourTurn.current && _tableState){
                        _tableState[lastPicked.current.line][lastPicked.current.cell] = {
                            ..._tableState[lastPicked.current.line][lastPicked.current.cell],
                            lastPicked: true,
                        }
                    }
                    
                    yourTurn.current = !yourTurn.current;
                    setTimerOn((prev) => !prev);
                    setTableState(_tableState);
                }
                else if(!gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) {
                    console.log('C');
                    
                    let _tableState = JSON.parse(JSON.stringify(snapshot.val())); 
                    setTableState(_tableState);
                }

            })
            
            database.onValue(child(gameRef, '/status'), (child)=>{
                if(!child.exists()) return;
                if(child.val() === 'in progress') { gameStarted.current = true;  }
                if(child.val() === 'game over') { endGame(); }
            })

            database.onValue(child(gameRef, '/info/winner'), (child)=>{
                // if(!child.exists()) return;
                // setTimeout(() => alert(child.val()), 300);
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
            else if(tableFull.current === props.tableSize*props.tableSize) { database.set(child(gameRef, '/status'), 'game over'); return }
            else { return }
    
            database.set(child(gameRef, '/info/winner'), playerValue.current);
            database.set(child(gameRef, `/players/${playerRef.current.uid}/score`), playerValue.current === 'X' ? myscore.current + 1 : enemyscore.current + 1);
            database.set(child(gameRef, '/status'), 'game over');
        }

        console.log('herex');
        console.log(preTimerOn, yourTurn.current, gameOver.current)
        if (!preTimerOn) { return }
        if (!yourTurn.current) { return }
        if(gameOver.current) { return } 
        console.log('here1');

        let _tableState = JSON.parse(JSON.stringify(tableStateRef.current));
        if(_tableState[line][cell].isChecked) { return }
        tableFull.current = tableFull.current + 1;
        
        _tableState[line][cell] = {
            ..._tableState[line][cell],
            value: playerValue.current,
            isChecked: true,
        };

        console.log(_tableState);
        console.log(gameStarted.current);
        console.log(lastPicked.current);

        if(gameStarted.current){
            _tableState[lastPicked.current.line][lastPicked.current.cell] = {
                ..._tableState[lastPicked.current.line][lastPicked.current.cell],
                lastPicked: false,
            }
        }   
        console.log('here2', playerValue.current);

        database.set(database.child(gameRef, '/info/lastPicked'), { line: line, cell: cell });
        if (!gameStarted.current) { 
            database.set(child(gameRef, '/status'), 'in progress'); 
        }
        database.set(database.child(gameRef, '/table'), _tableState);

        console.log('here3');
        
        checkWin(line, cell);
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

        if(!gameStarted.current) { database.set(database.child(gameRef, '/table'), _tableState); database.set(child(gameRef, '/info/winner'), `Game aborted!`); return }
        // else if (gameStarted.current && timerRef.current.minutes === 0 && timerRef.current.seconds === 0) { database.set(database.child(gameRef, '/table'), _tableState); database.set(child(gameRef, '/info/winner'), `Draw!`); return }

        _tableState[lastPicked.current.line][lastPicked.current.cell] = { ..._tableState[lastPicked.current.line][lastPicked.current.cell], value: winner.current, lastPicked: true, gameOver: true }

        database.set(database.child(gameRef, '/table'), _tableState);
        // setTimerOn(false);

        // if(gameStarted.current && winner.current === 'X'){ database.set(child(gameRef, '/info/winner'), 'X') }
        // else if(gameStarted.current && winner.current === 'O'){ database.set(child(gameRef, '/info/winner'), 'O') }
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

    return(

        <div className="game--container">

                {(timerOn || (!timerOn && gameStarted.current) || round.current > 0) && 
                    <div className = "scoreboard--container">
                        <div className = "scoreboard--score_letter" style={{paddingBottom: '0px', ...timerStyle[selectedStyle1]}}>
                            <h1>{myscore.current}</h1>
                            <Countdown key={refresh} getTime={getTime} minutes={10} seconds={0} running={gameOver.current ? false : !timerOn} hide={false}/>
                        </div>
                        <div className = "scoreboard--score_letter" style = {timerStyle[selectedStyle2]}>
                            <h1>{enemyscore.current}</h1>
                            <Countdown key={refresh} getTime={getTime} minutes={10} seconds={0} running={gameOver.current ? false : timerOn} hide={false}/>
                        </div>
                    </div>
                }

            <div className="table">
                {table}
                <div className="outside" />
            </div>
            
            <ResetButton key={refresh} onClick={request_reset} pressed={clickedRefresh.current}/>
        
        </div>

    )
}