import React from "react"

import Home from "./components/Home"
import TableSingleplayer from "./components/TableSingleplayer"
import TableMultiplayer from "./components/TableMultiplayer"

import { initializeApp } from "firebase/app";
import * as fbauth  from "firebase/auth";
import * as database  from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDzuBMfqR-Ra4y6djJBltQKPMQGOKcLglg",
    authDomain: "xogame-680ad.firebaseapp.com",
    databaseURL: "https://xogame-680ad-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "xogame-680ad",
    storageBucket: "xogame-680ad.appspot.com",
    messagingSenderId: "760956148861",
    appId: "1:760956148861:web:a60dda9054c4df3d75a514"
  };

  const app = initializeApp(firebaseConfig);
  export const db = database.getDatabase(app);
  const auth = fbauth.getAuth(app);

export default function App() {
  const [loaded, setLoaded] = React.useState(false);
  const tableSize = React.useRef(0);
  const playerValue = React.useRef('X');
  const gameId = React.useRef();
  const [gaming, setGaming] = React.useState(false);

  const onDisconnectRef = React.useRef();
  const onGameAddedRef = React.useRef();

  const countToWin = React.useRef();

  const playerRef = React.useRef();

  const mmRef = database.ref(db, '/matchmaking');
  const gamesRef = database.ref(db, '/games');

  React.useEffect(() => {
    fbauth.onAuthStateChanged(auth, (user) => {
      if(user){
        playerRef.current = auth.currentUser;

        
        setLoaded(true);
      }
      else {
        fbauth.signInAnonymously(auth)
      }

    })

  }, []);

  function matchmake( { size, count } ) {
      database.get(database.child(mmRef, `/${size}/${playerRef.current.uid}`))
        .then((id) => {
          if(id.exists()) { 
            database.remove(database.child(mmRef, `/${size}/${playerRef.current.uid}`))
              .then( () => { 
                onDisconnectRef.current.cancel(); 
                onGameAddedRef.current.cancel();
              })
          }
          else { 
            database.set(database.child(mmRef, `/${size}/${playerRef.current.uid}`), '')
              .then(() => { 
                onDisconnectRef.current = database.onDisconnect(database.child(mmRef, `/${size}/${playerRef.current.uid}`)).remove();
                onGameAddedRef.current = database.onChildAdded(database.child(gamesRef, `/${size}`), (game) => {
                  if(game.key.includes(playerRef.current.uid)){
                    playerValue.current = game.child(`players/${playerRef.current.uid}`).val();
                    tableSize.current = parseInt(game.ref.parent.key);
                    countToWin.current = count;
                    gameId.current = game.key;
                    setGaming(true); 
                  }
                })
                checkForGame();
              })
          }
        })

      function checkForGame(){
          database.get(database.child(mmRef, `/${size}`))
          .then((room) => {
                if(room.size >= 2){
                  let value = (Math.floor(Math.random()*2) === 0 ? 'X' : 'O');
                  database.get(database.query(room.ref, database.limitToFirst(2)).ref)
                  .then((players) => {
                    let gameId = '';
                    let playerObj = {};
                    players.forEach((player) => {
                      playerObj[`${player.key}`] = value;
                      value = (value === 'X') ? 'O' : 'X';
                      gameId += player.key;
                      database.remove(database.child(mmRef, `/${size}/${player.key}`));
                    })

                    database.set(database.child(gamesRef, `/${size}/${gameId}/players`), playerObj);
                  })
                }
            })
          .catch((err) => console.log(err))
      }

  }

  function singleplayer( { size, count } ){
    tableSize.current = size;
    countToWin.current = count;
    playerValue.current = 'X';
    setGaming(true);
  }

    var root = document.querySelector(':root');
    root.style.setProperty('--board-size', tableSize.current);

    return(
    <>
        { !gaming && loaded && <Home singleplayer={singleplayer} matchmake={matchmake}/> }
        { gaming && gameId.current &&  <TableMultiplayer tableSize={tableSize.current} countToWin={countToWin.current} id = {gameId.current} key={gameId.current} playerValue = {playerValue.current}/> }
        { gaming && !gameId.current && <TableSingleplayer tableSize={tableSize.current} countToWin={countToWin.current}/> }
    </>
    )

}