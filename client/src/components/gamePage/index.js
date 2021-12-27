import React from 'react';
import {useState, useEffect} from 'react';
import './style.css';
import Game from '../../model/game';
import blackPawn from '../../img/blackPawn.png';
import blackKnight from '../../img/blackKnight.png';
import blackRook from '../../img/blackRook.png';
import blackBishop from '../../img/blackBishop.png';
import blackQueen from '../../img/blackQueen.png';
import blackKing from '../../img/blackKing.png';
import whitePawn from '../../img/whitePawn.png';
import whiteKnight from '../../img/whiteKnight.png';
import whiteRook from '../../img/whiteRook.png';
import whiteBishop from '../../img/whiteBishop.png';
import whiteQueen from '../../img/whiteQueen.png';
import whiteKing from '../../img/whiteKing.png';

const GamePage = (props) => {

    const [game, setGame] = useState(null);
    const [board, setBoard] = useState([]);
    let dragged = null;
    let clicked = null;

    useEffect(() => {
        //if (game === null) {
            let g = new Game(null, null, null)
            setGame(g);
            setBoard([...g.getBoard()]);
        //}
        // else {
        //     setBoard([...game.getBoard()]);
        // }
    }, [props]);

    useEffect(() => {
        let fulls = document.querySelectorAll(".full");
        let squares = document.querySelectorAll(".square");
        fulls.forEach(element => {
            element.addEventListener("drag", unusedDropEvent);
            element.addEventListener("dragstart", onDragStart);
            element.addEventListener("dragend", onDragEnd);
            element.addEventListener("click", onClick);
        });
        squares.forEach(element => {
            element.addEventListener("dragenter", onDragEnter);
            element.addEventListener("dragover", unusedDropEvent);
            element.addEventListener("dragleave", onDragLeave);
            element.addEventListener("drop", onDrop);
            element.addEventListener("click", onClick);

        });
        return () => {
            fulls.forEach(element => {
                element.removeEventListener("drag", unusedDropEvent);
                element.removeEventListener("dragstart", onDragStart);
                element.removeEventListener("dragend", onDragEnd);
                element.removeEventListener("click", onClick);
            });
            squares.forEach(element => {
                element.removeEventListener("dragenter", onDragEnter);
                element.removeEventListener("dragover", unusedDropEvent);
                element.removeEventListener("dragleave", onDragLeave);
                element.removeEventListener("drop", onDrop);
                element.removeEventListener("click", onClick);
            });
        }
    }, [board]);

    const move = (rowFrom, colFrom, rowTo, colTo) => {
        if (props.page === 'gamePage_PVPS') {
            return game.move(rowFrom, colFrom, rowTo, colTo);
        }
        else if (props.page === 'gamePage_PVPD') {

        }
        else if (props.page === 'gamePage_PVC') {

        }
    }

    const unusedDropEvent = (e) => {
        e.preventDefault();
    }

    const onDragEnter = (e) => {
        e.preventDefault();
        e.target.classList.add('hovered');
    }

    const onDragLeave = (e) => {
        e.preventDefault();
        e.target.classList.remove('hovered');
    }

    const addPossibleMoves = (target, fromClick) => {
        let moves = game.getValidMoves(parseInt(target.getAttribute('row')), parseInt(target.getAttribute('col')));
        let squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            moves.forEach(move => {
                if (parseInt(square.getAttribute('row')) === move[0] && parseInt(square.getAttribute('col')) === move[1]) {
                    square.classList.add('possibleMove');
                    if (move[2] == 1) {
                        square.classList.add('castleMove');
                    }
                }
                if (fromClick
                && parseInt(square.getAttribute('row')) === parseInt(target.getAttribute('row')) 
                && parseInt(square.getAttribute('col')) === parseInt(target.getAttribute('col'))
                ) {
                    square.classList.add('clicked');
                }
            });
        });
    }

    const removePossibleMoves = (target, fromClick) => {
        let moves = game.getValidMoves(parseInt(target.getAttribute('row')), parseInt(target.getAttribute('col')));
        let squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            moves.forEach(move => {
                if (parseInt(square.getAttribute('row')) === move[0] && parseInt(square.getAttribute('col')) === move[1]) {
                    square.classList.remove('possibleMove');
                    if (move[2] == 1) {
                        square.classList.remove('castleMove');
                    }
                }
                if (fromClick 
                && parseInt(square.getAttribute('row')) === parseInt(target.getAttribute('row')) 
                && parseInt(square.getAttribute('col')) === parseInt(target.getAttribute('col'))
                ) {
                    square.classList.remove('clicked');
                }
            });
        });
    }

    const onClick = (e) => {
        if (
            (clicked === null && e.target.classList.contains("full")) 
        || (e === null && clicked !== null && clicked.classList.contains("full"))
        ) {
            if (clicked === null) {
                let element = e.target;
                clicked = element;
            }
            addPossibleMoves(clicked, true);
            setTimeout(() => {
                let fulls = document.querySelectorAll(".full");
                fulls.forEach(full => {
                    full.classList.add('disabled');
                });
            }, 0);
        }
        else if (clicked !== null && e.target.classList.contains("square")) {
            let element = e.target;
            removePossibleMoves(clicked, true);
            let disables = document.querySelectorAll(".disabled");
            disables.forEach(disable => {
                disable.classList.remove('disabled');
            });
            let flag = move(
                parseInt(clicked.getAttribute('row')),
                parseInt(clicked.getAttribute('col')),
                parseInt(element.getAttribute('row')), 
                parseInt(element.getAttribute('col'))
                );
            if (flag) {
                clicked = null;
                setBoard([...game.getBoard()]);
            }
            if (! flag && element.children.length !== 0) {
                clicked = element.children[0];
                onClick(null);
            }
            else {
                clicked = null;
            }
        }
    }

    const onDragStart = (e) => {
        let element = e.target;
        dragged = element;
        addPossibleMoves(dragged, false);
        setTimeout(() => {
            element.className = "invisible";
            let fulls = document.querySelectorAll(".full");
            fulls.forEach(full => {
                full.classList.add('disabled');
            });
        }, 0);
    }

    const onDragEnd = (e) => {
        let element = e.target;
        removePossibleMoves(element, false);
        let disables = document.querySelectorAll(".disabled");
        disables.forEach(disable => {
            disable.classList.remove('disabled');
        });
        e.target.className = "full"
        dragged = null;
    }

    const onDrop = (e) => {
        if (dragged !== null) {
            let element = e.target;
            removePossibleMoves(dragged, false);
            move(
                parseInt(dragged.getAttribute('row')),
                parseInt(dragged.getAttribute('col')),
                parseInt(element.getAttribute('row')), 
                parseInt(element.getAttribute('col'))
                );
            setBoard([...game.getBoard()]);
            dragged.className = "full";
            dragged = null;
        }
        e.target.classList.remove('hovered');
        let disables = document.querySelectorAll(".disabled");
        disables.forEach(disable => {
            disable.classList.remove('disabled');
        });
    }

    const getPieceImage = (piece) => {
        if (piece === null) {
            return null;
        }
        if (piece.isBlack()) {
            if (piece.isPawn()) {
                return blackPawn;
            }
            else if (piece.isRook()) {
                return blackRook;
            }
            else if (piece.isKnight()) {
                return blackKnight;
            }
            else if (piece.isBishop()) {
                return blackBishop;
            }
            else if (piece.isQueen()) {
                return blackQueen;
            }
            else {
                return blackKing;
            }
        }
        else {
            if (piece.isPawn()) {
                return whitePawn;
            }
            else if (piece.isRook()) {
                return whiteRook;
            }
            else if (piece.isKnight()) {
                return whiteKnight;
            }
            else if (piece.isBishop()) {
                return whiteBishop;
            }
            else if (piece.isQueen()) {
                return whiteQueen;
            }
            else {
                return whiteKing;
            }
        }
    }


    return(
        <div className = {"gamePageContainer" + (props.page !== "homePage" ? "" : " disableDisplay")} draggable = "false">
            <div className = "button" id = "back" onClick = {()=>{props.setPage("homePage")}}>BACK [Progress will be lost forever]</div>
            <div className = "board" draggable = "false">
                {
                    (() => {
                        let id = 0;
                        let squares = [];
                        if (board.length > 0) {
                            for (let m = 0; m < 8; m++) {
                                for (let n = 0; n < 8; n++) {
                                    let square = board[m][n];
                                    squares.push(
                                        <div key = {id} className = {"square " + (square.getPiece() !== null && game.turn == square.getPiece().color ? "turn": "")} 
                                        colour = {square.isBlack() ? 1 : 0} draggable = "false" piece = {square.getPiece() !== null ? 1 : 0} row = {m} col = {n}>
                                            {
                                            square.getPiece() !== null ?
                                                <div className = "full" draggable = "true" row = {m} col = {n}>
                                                    <img src = {getPieceImage(square.getPiece())} draggable = "false"/>
                                                </div>
                                                :
                                                <></>
                                            }
                                        </div>
                                        );
                                        id++;
                                }
                            }
                        }
                        return squares;
                    })()
                }
            </div>
        </div>
    );
}

export default GamePage;