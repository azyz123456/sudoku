//generate complete square fulfilling all requirements, then remove a certain number of boxes depending on the difficulty mode

let rows;
let columns;
let boxes;
let solution;
let currStr;
let tileSelected;
let prevTile;
let clear;
let normal;
let candidate;

let firstGame = true;
let numEmpty = 20;
let mode = "normal";
let winner = document.querySelector("#winner");
let easy = document.querySelector("#easy");
let medium = document.querySelector("#medium");
let hard = document.querySelector("#hard");
let board = document.querySelector("#board");

window.onload = function() {
    
    //set game mode to easy
    easy.addEventListener("click",()=> { 
        if (easy.style.fontWeight=="bold") {
            return;
        }
        numEmpty = 20;
        easy.style.fontWeight = "bold";
        medium.style.fontWeight = "normal";
        hard.style.fontWeight = "normal";

        newGame();
    });
    
    //set game mode to medium
    medium.addEventListener("click",()=> {
        if (medium.style.fontWeight=="bold") {
            return;
        }
        numEmpty = 30;
        easy.style.fontWeight = "normal";
        medium.style.fontWeight = "bold";
        hard.style.fontWeight = "normal";

        newGame();
    });

    //set game mode to hard
    hard.addEventListener("click",()=> {
        if (hard.style.fontWeight=="bold") {
            return;
        }
        numEmpty = 40;
        easy.style.fontWeight = "normal";
        medium.style.fontWeight = "normal";
        hard.style.fontWeight = "bold";

        newGame();
    });
    setGame();
}

function checkValid(row, col,value) {
    //check if a number is valid
    if (columns[col].includes(value) || boxes[getBoxNum(row,col)].includes(value) || rows[row].includes(value) ) {
        return false;
    }

    return true;
}

function getBoxNum(row,col) {
    //get the box number given row and column number
    
    if (row<=2 && row>=0) {
        if(col<=2 && col>=0) {
            return 0;
        }
        else if (col<=5 && col>=3) {
            return 1;
        }
        else if (col<=8 && col>=6) {
            return 2;
        }  
    }
    else if (row<=5 && row>=3) {
        if(col<=2 && col>=0) {
            return 3;
        }
        else if (col<=5 && col>=3) {
            return 4;
        }
        else if (col<=8 && col>=6) {
            return 5;
        }  
    }
    else if (row<=8 && row>=6) {
        if(col<=2 && col>=0) {
            return 6;
        }
        else if (col<=5 && col>=3) {
            return 7;
        }
        else if (col<=8 && col>=6) {
            return 8;
        }  
    }
}


function setBoard() {
    //create the sudoku board
    rows = [[],[],[],[],[],[],[],[],[]];
    columns = [[],[],[],[],[],[],[],[],[]];
    boxes = [[],[],[],[],[],[],[],[],[]];

    for (let r=0; r<9; r++) {
        for (let c=0; c<9; c++) {
            let choices = [1,2,3,4,5,6,7,8,9];
            let index = Math.floor(Math.random() * choices.length);
    
            let choicesTried = 0;
               while (checkValid(r,c,choices[index])===false && choicesTried<9){
                    choices.splice(index, 1);
                    index = Math.floor(Math.random() * choices.length); //chooses another number that is valid
                    choicesTried++;
                }
    
    
            rows[r].push(choices[index]);
            columns[c].push(choices[index]);
            boxes[getBoxNum(r,c)].push(choices[index]);
        }
    }
}


function checkEmpty() {
        for (let r=0; r<9; r++) {
            for (let c=0; c<9; c++) {
                if (rows[r][c]==undefined) {
                    return true;
                }
            }
        }
    return false;
}

function setGame() {
    //set new sudoku game
    setBoard();
    while (checkEmpty()===true) {
        setBoard();
    }

    //solution is string representation of rows
    solution = [];
    for(let r=0; r<9; r++) {
        solution[r] = "";
        for (let c=0; c<9; c++) {
            solution[r] += rows[r][c];
        }
    }

    //create empty tiles
    for (let i=0; i<numEmpty; i++) {
        removePiece();
    }

    currStr = [];
    for(let r=0; r<9; r++) {
        currStr[r] = "";
            for (let c=0; c<9; c++) {
                currStr[r] += rows[r][c];
            }
    }

    //HTML elements

    //tiles
    for (let r=0;r<9;r++) {
        for (let c=0;c<9;c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.innerHTML = rows[r][c];
            tile.classList.add("tile");

            if (rows[r][c] !== " "){
                tile.style.backgroundColor = "#f0f0f0";
            } else {
                tile.addEventListener("click", setTile);
                
                for (let i=1; i<=9; i++) {
                    let candidateDigit = document.createElement("div");
                    candidateDigit.classList.add("candidate-digit");
                    candidateDigit.id = tile.id + "-" + i;
                    tile.appendChild(candidateDigit);
                }
                
            }

            if (r===2 || r===5 || r===8) {
                tile.classList.add("horizontal-line");
            }
            if (c===2 || c===5 || c===8) {
                tile.classList.add("vertical-line");
            }

            document.getElementById("board").append(tile);
        }
    }

    if (firstGame) {
        //normal or candidate mode
        normal = document.createElement("div");
        normal.innerHTML = "Normal";
        normal.classList.add("normal");
        digits.appendChild(normal);
        normal.addEventListener("click", setNormal);

        candidate = document.createElement("div");
        candidate.innerHTML = "Candidate";
        candidate.classList.add("candidate");
        digits.appendChild(candidate);
        candidate.addEventListener("click", setCandidate);

        //digits
        for (let i=1; i<=9; i++) {
            let digit = document.createElement("div");
            digit.classList.add("number");
            digit.innerHTML = i;
            digits.appendChild(digit);
            digit.addEventListener("click", setNum);
            digit.addEventListener("click", addCandidate);

        }

        //clear button
        clear = document.createElement("div");
        clear.classList.add("clear");
        clear.innerHTML = "X";
        digits.appendChild(clear);
        clear.addEventListener("click", clearNum);

    }
    firstGame = false;
    //debugging: winner.innerHTML = currStr + '<br />' + solution;

}

function setNum() {
    //set number for sudoku tile
    if (mode!=="normal") {
        return;
    }

    let tile = document.getElementById(tileSelected);
    tile.innerText = this.innerHTML;
    winner.innerHTML = "tile innertext length: " + tile.innerText.length;


    //js
    let r = tileSelected[0];
    let c = tileSelected[2];
    let str = currStr[r];
    currStr[r] = str.substring(0,c);
    currStr[r] += tile.innerText;
    currStr[r] += str.substring(parseInt(c)).substring(1); 
    //debugging: winner.innerHTML = currStr + '<br />' + solution + '<br />' + str.substring(0,c) +'<br />'+str.substring(parseInt(c));

    //why doesn't second substring work?
    checkWin();

}

function clearNum() {

    let tile = document.getElementById(tileSelected);

    if (mode==="normal") {
        //delete the number in a sudoku tile
        tile.innerText = "";
        winner.innerHTML = "tile innertext length: " + tile.innerText.length;

        //js
        let r = tileSelected[0];
        let c = tileSelected[2];
        //declare str
        let str = currStr[r];
        currStr[r] = str.substring(0,c);
        currStr[r] += str.substring(parseInt(c)).substring(1);
    }

    else {
        //delete the notes in a sudoku tile
        for (let i=0; i<9; i++) {
            tile.children[i].innerHTML = "";
        }
        winner.innerHTML = "tile innertext length: " + tile.innerText.length;
    }
}

function removePiece() {
        let r=Math.floor(Math.random()*9);
        let c=Math.floor(Math.random()*9);

        while (rows[r][c]==" ") {
            r=Math.floor(Math.random()*9);
            c=Math.floor(Math.random()*9);
        }

        rows[r][c] = " ";
        columns[c][r] = " ";  
}

function setTile() {
    if (prevTile) {
        prevTile.style.backgroundColor = "white";
    }
    let tile = this;
    tile.style.backgroundColor = "#f3df87";
    winner.innerHTML = "tile innertext length: " + tile.innerText.length;
    tileSelected = this.id;
    prevTile = this;
}

function checkWin() {
    let win = true;
    for (let r=0; r<9; r++) {
        if (currStr[r]!==solution[r]){
            win = false;
        }
    }

    if (win){
        winner.innerHTML = "You win!";
    }
}

function newGame() {
    while (board.firstChild) {
        board.removeChild(board.lastChild);
      }
    setGame();
}

function setNormal(){    
    if (mode==="normal") {
        return;
    }
    mode="normal";
    this.style.color="white";
    this.style.backgroundColor="black";
    this.style.borderColor="black";
    candidate.style.backgroundColor="white";
    candidate.style.color="lightgray";
    candidate.style.borderColor="lightgray";
}

function setCandidate(){
    if (mode==="candidate") {
        return;
    }
    mode="candidate";
    this.style.color="white";
    this.style.backgroundColor="black";
    this.style.borderColor="black";
    normal.style.backgroundColor="white";
    normal.style.color="lightgray";
    normal.style.borderColor="lightgray";
}

function addCandidate() {
    if (mode !== "candidate") {
        return;
    }

    let tile = document.getElementById(tileSelected);
    if (tile.innerText.length === 1 || tile.innerText.length==0) {

        //why doesn't length===0 check work??
        //create candidate tiles
        tile.innerHTML = null;
        for (let i=1; i<=9; i++) {
            let candidateDigit = document.createElement("div");
            candidateDigit.classList.add("candidate-digit");
            candidateDigit.id = tile.id + "-" + i;
            tile.appendChild(candidateDigit);
        }
    }    

    let candidateDigit = document.getElementById(tileSelected + "-" + this.innerHTML);

    if (candidateDigit.innerText.length === 1) {
        candidateDigit.innerText = "";
    } else {
        candidateDigit.innerHTML = this.innerHTML;
    }

    winner.innerHTML = "tile innertext length: " + tile.innerText.length;
    winner.innerHTML += " candidate tile innertext length: " + candidateDigit.innerText.length;

}
