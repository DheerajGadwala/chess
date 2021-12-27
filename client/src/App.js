import './App.css';
import {useState, useEffect} from 'react';
import io from 'socket.io-client';
import GamePage from './components/gamePage';
import HomePage from './components/homePage';

function App() {

  const [socket, setSocket] = useState(null);
  const [page, setPage] = useState('homePage');

  useEffect(()=>{
    setSocket(io("https://git.heroku.com/floating-atoll-84889.git"));
  }, []);

  return (
    <>
    <HomePage
      page = {page}
      setPage={setPage}
      socket = {socket}
    />
    <GamePage
      page = {page}
      setPage = {setPage}
      socket = {socket}
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
