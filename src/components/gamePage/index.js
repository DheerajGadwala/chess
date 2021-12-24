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

    const [game, setGame] = useState(new Game());
    const [board, setBoard] = useState([]);
    const [refreshVar, refresh] = useState(false); 
    let dragged = null;

    useEffect(() => {
        setBoard([...game.getBoard()]);
    }, []);

    useEffect(() => {
        let fulls = document.querySelectorAll(".full");
        let squares = document.querySelectorAll(".square");
        fulls.forEach(element => {
            element.addEventListener("drag", unusedDropEvent);
            element.addEventListener("dragstart", onDragStart);
            element.addEventListener("dragend", onDragEnd);
        })
        squares.forEach(element => {
            element.addEventListener("dragenter", unusedDropEvent);
            element.addEventListener("dragover", unusedDropEvent);
            element.addEventListener("dragleave", unusedDropEvent);
            element.addEventListener("drop", onDrop);
        })

        return () => {
            fulls.forEach(element => {
                element.removeEventListener("drag", unusedDropEvent);
                element.removeEventListener("dragstart", onDragStart);
                element.removeEventListener("dragend", onDragEnd);
            });
            squares.forEach(element => {
                element.removeEventListener("dragenter", unusedDropEvent);
                element.removeEventListener("dragover", unusedDropEvent);
                element.removeEventListener("dragleave", unusedDropEvent);
                element.removeEventListener("drop", onDrop);
            });
        }
    }, [board]);

    useEffect(() => {
        setBoard([...game.getBoard()]);
    }, [refreshVar]);

    const unusedDropEvent = (e) => {
        e.preventDefault();
    }

    const onDragStart = (e) => {
        let element = e.target;
        dragged = element;
        let moves = game.getValidMoves(parseInt(element.getAttribute('row')), parseInt(element.getAttribute('col')));
        let squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            moves.forEach(move => {
                if (parseInt(square.getAttribute('row')) === move[0] && parseInt(square.getAttribute('col')) === move[1]) {
                    square.classList.add('possibleMove');
                }
            });
        });
        setTimeout(() => (element.className = "invisible", 0));
    }

    const onDragEnd = (e) => {
        let element = e.target;
        let moves = game.getValidMoves(parseInt(element.getAttribute('row')), parseInt(element.getAttribute('col')));
        let squares = document.querySelectorAll(".square");
        squares.forEach(square => {
            moves.forEach(move => {
                if (parseInt(square.getAttribute('row')) === move[0] && parseInt(square.getAttribute('col')) === move[1]) {
                    square.classList.remove('possibleMove');
                }
            });
        });
        dragged = null;
        e.target.className = "full"
    }

    const onDrop = (e) => {
        if (dragged !== null) {
            let element = e.target;
            let moves = game.getValidMoves(parseInt(dragged.getAttribute('row')), parseInt(dragged.getAttribute('col')));
            let squares = document.querySelectorAll(".square");
            squares.forEach(square => {
                moves.forEach(move => {
                    if (parseInt(square.getAttribute('row')) === move[0] && parseInt(square.getAttribute('col')) === move[1]) {
                        square.classList.remove('possibleMove');
                    }
                });
            });
            game.move(
                parseInt(dragged.getAttribute('row')),
                parseInt(dragged.getAttribute('col')),
                parseInt(element.getAttribute('row')), 
                parseInt(element.getAttribute('col'))
                );
            setBoard([...game.getBoard()]);
            dragged.className = "full";
            dragged = null;
        }
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
        <div className = "gamePageContainer" draggable = "false">
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
                                        <div key = {id} className = "square" colour = {square.isBlack() ? 1 : 0} 
                                        draggable = "false" piece = {square.getPiece() !== null ? 1 : 0}
                                        row = {m} col = {n}>
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