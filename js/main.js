'use strict';
var HAPPY_SMILEY = '😊';
var SAD_SMILEY = '😒';
var WINER_SMILEY = '😎';
var MINE = '🧨';
var FLAG = '🚩';
var Lives;
var gBoard;
var gLevel = 1;
var gGame = false;
var gCellNextId = 0;
var gRCellNextId = 0;
var firstCellPressed = false
var I;
var J;
var CellPressed;
var button = document.querySelector('.starter');
var lives = document.querySelector('.lives')
var size = 4;
var randeredMinutes = document.querySelector(".minutes");
var randeredSeconds = document.querySelector(".seconds");
var totalSeconds
var board = document.querySelector('.board');
var gMinesInStock = 2;
var Call;
var timer;

function setPersonalization(level) {
    gLevel = level
    switch (gLevel) {

        case 1:
            size = 4
            gMinesInStock = 2
            break
        case 2:
            size = 8
            gMinesInStock = 12
            break
        case 3:
            size = 12
            gMinesInStock = 30
            break
    }
}
function setTime() {
    ++totalSeconds;
    randeredSeconds.innerHTML = pad(totalSeconds % 60);
    randeredMinutes.innerHTML = pad(parseInt(totalSeconds / 60));

}

function pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
        return "0" + valString;
    } else {
        return valString;
    }
}
button.innerText = HAPPY_SMILEY;
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
}
function initGame(lev) {
    if (lev === false) (lev = gLevel)
    gGame = true
    Lives=2
    setPersonalization(lev)
    clearInterval(timer)
    buildBoard()
    firstCellPressed = false

}
function buildBoard() {
    gBoard = []
    for (var i = 0; i <= (size - 1); i++) {
        gBoard.push([])
        for (var j = 0; j <= (size - 1); j++) {
            gBoard[i].push({ 'class': 'cell', 'id': ++gCellNextId, 'i': i, 'j': j, 'isShown': false, 'containsMine': false, 'isMarked': false, 'adjacentMinesCounter': 0 })
        }
    }


}
function LayMines(minesInStock) {

    while (minesInStock) {
        I = getRandomInt(gBoard.length)
        J = getRandomInt(gBoard[0].length)

        if (gBoard[I][J].containsMine === true || gBoard[I][J].isShown === true) { continue }
        else {
            gBoard[I][J].containsMine = true
            --minesInStock
        }
    }
    setMinesNegsCount(gBoard)
}
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[i].length; j++) {

            var currCell = board[i][j]

            if (board[i][j].containsMine) {

                for (var I = -1; I <= 1; I++) {

                    if (currCell.i + I < 0 || currCell.i + I > board.length - 1) {

                        continue
                    }

                    for (var J = -1; J <= 1; J++) {

                        if (currCell.j + J < 0 || currCell.j + J > board[0].length - 1) {

                            continue
                        }
                        ++board[i + I][j + J].adjacentMinesCounter

                    }
                }
            }
        }
    }
}
function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < board[i].length; j++) {
            var currCell = board[i][j];




            strHTML += '\t</td>\n';

            if (board[i][j].containsMine && board[i][j].isShown === true) {
                strHTML += '\t<td class="cell" id=' + board[i][j].id + ' onclick=' + "cellClicked(this)" + '  >' + MINE + ' </td>\n';

            }
            else if (board[i][j].adjacentMinesCounter && board[i][j].isShown === true) {
                strHTML += '\t<td class="cell" id=' + board[i][j].id + ' onclick=' + "cellClicked(this)" + '  >' + board[i][j].adjacentMinesCounter + ' </td>\n';

            }
            else if (board[i][j].isMarked === true) {
                strHTML += '\t<td class="cell" id=' + board[i][j].id + ' onclick=' + "cellClicked(this)" + '  >' + FLAG + ' </td>\n';

            }
            else if (board[i][j].isShown === true) { strHTML += '\t<td class="cell "id=' + board[i][j].id + ' onclick=' + "cellClicked(this)" + '  >' + '' + ' </td>\n' }

            else { strHTML += '\t<td class="cell "id=' + board[i][j].id + ' onclick=' + "cellClicked(this)" + '  >' + '?' + ' </td>\n' }

        }
        strHTML += '</tr>\n';

    }

    var elBoard = document.querySelector('.board');
    var cells = document.getElementsByClassName('cell');
    elBoard.innerHTML = strHTML;
    for (var i1 = 0; i1 < cells.length; i1++) {

        Call = cells[i1]
        if (Call.innerText === '?') { Call.innerHTML = '<button class="clicker"></button>' }
        else if (Call.innerText === FLAG) { Call.innerHTML = '<button class="clicker">' + FLAG + '</button>' }
        Call.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            cellMarked(this);
            return false;
        }, false);

    }
}
function cellClicked(elCell) {
    for (var i = 0; i < gBoard.length; ++i) {
        for (var j = 0; j < gBoard[i].length; ++j) {
            if (gBoard[i][j].id === +elCell.id) {
                CellPressed = gBoard[i][j]
                if (gGame === true && CellPressed.isShown === false && CellPressed.isMarked === false) {
                    CellPressed.isShown = true
                    if (firstCellPressed === false) {
                        LayMines(gMinesInStock)
                        firstCellPressed = true
                        totalSeconds = 0
                        timer = setInterval(setTime, 1000);
                    }
                    if (CellPressed.containsMine === true) { --Lives }
                    for (var I = -1; I <= 1; I++) {

                        if (CellPressed.i + I < 0 || CellPressed.i + I > gBoard.length - 1) {

                            continue
                        }

                        for (var J = -1; J <= 1; J++) {

                            if (CellPressed.j + J < 0 || CellPressed.j + J > gBoard[0].length - 1) {

                                continue
                            }
                            if (gBoard[i + I][j + J].containsMine === false && gBoard[i + I][j + J].isShown === false && gBoard[i + I][j + J].isMarked === false) { gBoard[i + I][j + J].isShown = true }
                        }
                    }
                    checkGameOver()

                }

            }
        }
    }

}
function cellMarked(elCell) {
    for (var i = 0; i < gBoard.length; ++i) {
        for (var j = 0; j < gBoard[i].length; ++j) {
            if (gBoard[i][j].id === +elCell.id) {
                CellPressed = gBoard[i][j]
                if (gGame === true && CellPressed.isShown === false) {
                    if (CellPressed.isMarked === true) { CellPressed.isMarked = false }
                    else { CellPressed.isMarked = true }
                }
            }
        }
    }
    checkGameOver()
}
function checkGameOver() {
    if (Lives === 0) {
        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[i].length; j++) {
                if (board[i][j].containsMine === true) { board[i][j].isShown = true }
            }
        }
        gGame=false
        button.innerText = SAD_SMILEY
        lives.innerText = 0
        renderBoard(gBoard)
        clearInterval(timer)
        clearInterval(ui)

    }
    else {
        for (var i = 0; i < gBoard.length; ++i) {
            for (var j = 0; j < gBoard[i].length; ++j) {
                if ((gBoard[i][j].isShown === false && gBoard[i][j].isMarked === false) || (gBoard[i][j].containsMine === false && gBoard[i][j].isMarked === true)) { return }
            }
        }
        gGame=false
        button.innerText = WINER_SMILEY
        clearInterval(timer)
        clearInterval(ui)

    }
}
function expandShown(board, elCell, i, j) { }




var ui = setInterval(function () {

    renderBoard(gBoard)
    if (Lives >= 0) {
        lives.innerText = Lives
    }
}, 400)
