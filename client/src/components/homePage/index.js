import React, {useEffect, useState} from 'react';
import './style.css';

const HomePage = (props) => {

    const [screen, setScreen] = useState("home");
    const [joinGameBox, shownJoinGameBox] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {
        const setPagePVPS = () => {props.setPage("gamePage_PVPS")}
        const setPagePVPD = () => {setScreen("differentDevices")}
        const setPagePVC = () => {setScreen("chooseColor")}
        const onBackClick = () => {setScreen("home")}
        const onHostClick = () => {
            setScreen("wait");
            props.socket.emit('host', {}, (response) => {
                setCode(response.gameId);
            });
            props.setPlayerColor("white");
            props.setVSC(false);
        }
        const onJoinClick = () => {
            props.socket.emit('join', document.getElementById("gameId").value, (response) => {
                if (response.status !== "connected") {
                    alert("Please enter a valid code");
                }
                props.setPlayerColor("black");
                props.setVSC(false);
            });
        }

        const onPlayAsWhite = () => {
            props.socket.emit('start_ai', 0, (response) => {
                if (response.status !== "connected") {
                    alert("Please enter a valid code");
                }
            });
            props.setPlayerColor("white");
            props.setPage("gamePage_PVPD");
            props.setVSC(true);
        }

        const onPlayAsBlack = () => {
            props.socket.emit('start_ai', 1, (response) => {
                if (response.status !== "connected") {
                    alert("Please enter a valid code");
                }
            });
            props.setPlayerColor("black");
            props.setPage("gamePage_PVPD");
            props.setVSC(true);
        }

        document.getElementById("pvpS").addEventListener('click', setPagePVPS);
        document.getElementById("pvpD").addEventListener('click', setPagePVPD);
        document.getElementById("pvc").addEventListener('click', setPagePVC);
        document.getElementById("host").addEventListener('click', onHostClick);
        document.getElementById("back").addEventListener('click', onBackClick);
        document.getElementById("joinGame").addEventListener('click', onJoinClick);
        document.getElementById("chooseWhite").addEventListener('click', onPlayAsWhite);
        document.getElementById("chooseBlack").addEventListener('click', onPlayAsBlack);

        return () => {
            document.getElementById("pvpS").removeEventListener('click', setPagePVPS);
            document.getElementById("pvpD").removeEventListener('click', setPagePVPD);
            document.getElementById("pvc").removeEventListener('click', setPagePVC);
            document.getElementById("host").removeEventListener('click', onHostClick);
            document.getElementById("back").removeEventListener('click', onBackClick);
            document.getElementById("joinGame").removeEventListener('click', onJoinClick);
            document.getElementById("chooseWhite").removeEventListener('click', onPlayAsWhite);
            document.getElementById("chooseBlack").removeEventListener('click', onPlayAsBlack);
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
                <a className="author" href = "https://github.com/DheerajGadwala">
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
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvpS">PvP, Same Device</div>
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvpD">PvP, Different Device</div>
            <div className = {"button" + (screen === "home" ? "" : " disableDisplay")} id = "pvc">PvC</div>
            <div className = {"button" + (screen === "chooseColor" ? "" : " disableDisplay")} id = "chooseWhite">Play as White</div>
            <div className = {"button" + (screen === "chooseColor" ? "" : " disableDisplay")} id = "chooseBlack">Play as Black</div>
            <div className = {"button" + (screen === "differentDevices" ? "" : " disableDisplay")} id = "host">Host Game</div>
            <div className = {"button" + (screen === "differentDevices" ? "" : " disableDisplay")} id = "join" onClick = {()=>{shownJoinGameBox(true);}}>Join Game</div>
            <div className = {"hostText" + (screen === "wait" ? "" : " disableDisplay")}>Share this code with the other player: {code}</div>
            <div className = {"button" + (screen !== "home" ? "" : " disableDisplay")} id = "back">Back</div>
        </div>
        </div>
        </>
    );
}

export default HomePage;