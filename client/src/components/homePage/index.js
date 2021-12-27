import React, {useEffect, useState} from 'react';
import './style.css';

const HomePage = (props) => {

    const [screen, setScreen] = useState("home");
    const [joinGameBox, shownJoinGameBox] = useState(false);

    useEffect(() => {
        const setPagePVPS = () => {props.setPage("gamePage_PVPS")}
        const setPagePVPD = () => {setScreen("differentDevices")}
        const setPagePVC = () => {alert("To be implemented")}
        const onBackClick = () => {setScreen("home")}
        const onHostClick = () => {
            setScreen("wait");
            props.socket.emit('host', (response) => {console.log(response)});
        }
        const onJoinClick = () => {
            props.socket.emit('join', document.getElementById("gameId").value, (response) => {
                if (response.status === "connected") {
                    // TODO
                }
            });
        }

        document.getElementById("pvpS").addEventListener('click', setPagePVPS);
        document.getElementById("pvpD").addEventListener('click', setPagePVPD);
        document.getElementById("pvc").addEventListener('click', setPagePVC);
        document.getElementById("host").addEventListener('click', onHostClick);
        document.getElementById("back").addEventListener('click', onBackClick);
        document.getElementById("joinGame").addEventListener('click', onJoinClick);

        return () => {
            document.getElementById("pvpS").removeEventListener('click', setPagePVPS);
            document.getElementById("pvpD").removeEventListener('click', setPagePVPD);
            document.getElementById("pvc").removeEventListener('click', setPagePVC);
            document.getElementById("host").removeEventListener('click', onHostClick);
            document.getElementById("back").removeEventListener('click', onBackClick);
            document.getElementById("joinGame").removeEventListener('click', onJoinClick);
        }
    }, [props]);


    return(
        <>
        <div className = {"homeContainer" + (props.page === "homePage" ? "" : " disableDisplay")}>
        <div className = "options">
            <div className = "titleContainer">
                <div className="title">
                    CHESS
                </div>
                <a className="author" href = "https://www.dheerajgadwala.tech/">
                    By Dheeraj Gadwala
                </a>
            </div>
            <div className = {"overlay" + (joinGameBox ? "" : " disableDisplay")}>
                <div className = "overlayTitle">Enter game ID</div>
                <input type = "text" id = "gameId"/>
                <div className = "overlayButtons">
                <div className = "button" id = "cancel" onClick = {() => {shownJoinGameBox(false)}}>Cancel</div>
                <div className = "button" id = "joinGame">Join</div>
                </div>
            </div>
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvpS">Player vs Player, Same Device</div>
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvpD">Player vs Player, Different Device</div>
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvc">Player vs Computer</div>
            <div className = {"button" + (screen === "differentDevices" ? "" : " disableDisplay")} id = "host">Host Game</div>
            <div className = {"button" + (screen === "differentDevices" ? "" : " disableDisplay")} id = "join" onClick = {()=>{shownJoinGameBox(true);}}>Join Game</div>
            <div className = {"button" + (screen === "differentDevices" ? "" : " disableDisplay")} id = "back">Back</div>
            <div className = {"hostText" + (screen === "wait" ? "" : " disableDisplay")}>Waiting for a player to join</div>
        </div>
        </div>
        </>
    );
}

export default HomePage;