import './App.css';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import GamePage from './components/gamePage';
import HomePage from './components/homePage';

function App() {

  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState('homePage');
  const [playerColor, setPlayerColor] = useState('white');
  const [vsC, setVSC] = useState(false);

  useEffect(()=>{
    // setSocket(io("https://floating-atoll-84889.herokuapp.com/"));
    setSocket(io("http://127.0.0.1:5000"));
  }, []);

  return (
    <>
    <HomePage
      page = {page}
      setPage={setPage}
      socket = {socket}
      playerColor = {playerColor}
      setPlayerColor = {setPlayerColor}
      setVSC = {setVSC}
    />
    <GamePage
      page = {page}
      setPage = {setPage}
      socket = {socket}
      playerColor = {playerColor}
      setPlayerColor = {setPlayerColor}
      vsC = {vsC}
      setVSC = {setVSC}
    />
      {/* {
        (()=>{
          if (page == 'homePage') {
            return <HomePage
            page = {page}
            setPage={setPage}
            socket = {socket}
            />
          }
          else {
            return <GamePage
            page = {page}
            setPage = {setPage}
            socket = {socket}
            />
          }
          })()
      } */}
    </>
  );
}

export default App;
