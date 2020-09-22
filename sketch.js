//global variables
let board = [
  [' ', ' ', ' '],
  [' ', ' ', ' '],
  [' ', ' ', ' ']
];

let boxAvailable = [
  [true, true, true],
  [true, true, true],
  [true, true, true]
];

let playerX = 'X';
let playerO = 'O';

let available = 9; //number of boxes left

function setup() {
  createCanvas(400, 400);
 moveAI();
}

//to check if a player won
function win() {
  for (let i = 0; i < 3; i++) {
    //check for rows
    if ((board[i][0] !== ' ') && (board[i][0] === board[i][1]) && (board[i][1] === board[i][2])) {
      strokeWeight(4);
      stroke(255, 100, 100);
      line(0, (0.5 + i) * height / 3, width, (0.5 + i) * height / 3);
      return board[i][0];
    } 
    //check for columns
    else if ((board[0][i] !== ' ') && (board[0][i] === board[1][i]) && (board[1][i] === board[2][i])) {
      strokeWeight(4);
      stroke(255, 100, 100);
      line((0.5 + i) * width / 3, 0, (0.5 + i) * width / 3, height);
      return board[0][i];
    }
  }
  //check diagonal 1
  if ((board[0][0] !== ' ') && (board[0][0] === board[1][1] && board[1][1] === board[2][2])) {
    strokeWeight(4);
    stroke(255, 100, 100);
    line(0, 0, width, height);
    return board[1][1];
  } 
  //check diagonal 2
  else if ((board[1][1] !== ' ') && (board[0][2] === board[1][1] && board[2][0] === board[1][1])) {
    strokeWeight(4);
    stroke(255, 100, 100);
    line(0, height, width, 0);
    return board[1][1];
  }
  //check for a tie
  else if(available === 0){
    return 't';
  }
  return null;
}

//reaction to click
function mousePressed() {
  let x = -1;
  let y = -1;
  if ((mouseX >= 0) && (mouseX < width / 3)) {
    x = 0;
  } 
  else if ((mouseX > width / 3) && (mouseX < 2 * width / 3)) {
    x = 1;
  } 
  else if ((mouseX > 2 * width / 3) && (mouseX < width)) {
    x = 2;
  }
  if ((mouseY >= 0) && (mouseY < height / 3)) {
    y = 0;
  } 
  else if ((mouseY > height / 3) && (mouseY < 2 * height / 3)) {
    y = 1;
  } 
  else if ((mouseY > 2 * height / 3) && (mouseY < height)) {
    y = 2;
  }
  if (boxAvailable[y][x]) {
    board[y][x] = playerO;
    boxAvailable[y][x] = false;
    available--;
    if(available > 0){
      moveAI();
    }
  }
}

function touchStarted(){
  mousePressed();
}

function minimax(board, depth, maxBoolean, alpha, beta){
  let result = win();
  if(result === 'X'){
    return 100;
  }
  else if(result === 'O'){
    return -100;
  }
  else if(depth <= 0){
    return 0;
  }  
  if(maxBoolean){
    let highest = -Infinity;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(boxAvailable[i][j]){
          board[i][j] = playerX;
          boxAvailable[i][j] = false;
          let high = minimax(board, depth-1, false, alpha, beta);
          if(high > highest){
            x = i;
            y = j;
            highest = high;
          }
          alpha = Math.max(alpha, high);
          if(beta <= alpha){
            board[i][j] = ' ';
            boxAvailable[i][j] = true; 
            break;
          }
          board[i][j] = ' ';
          boxAvailable[i][j] = true;
        }
      }
    }
    return highest;
  }
  else if (!maxBoolean) {
    let lowest = 10000000;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        if(boxAvailable[i][j]){
          board[i][j] = playerO;
          boxAvailable[i][j] = false;
          let low = minimax(board, depth-1, true, alpha, beta);
          if(low < lowest){
            x = i;
            y = j;
            lowest = low;
          }
           beta = Math.min(beta, low);
          if(beta<=alpha){
            board[i][j] = ' ';
            boxAvailable[i][j] = true;
            break;   
          }
          board[i][j] = ' ';
          boxAvailable[i][j] = true;
        }
      }
    }
    return lowest;
  }
}

//AI algorithm
function moveAI(){
  let resultP = createP('');
  resultP.style('font-size', '32pt');
  resultP.style('text-align', 'center');
  let result = win();
  if(result === 'X'){
    resultP.html("Artificial Intelligence won.");
    noLoop();
  }
  else if(result === 'O'){
    resultP.html("Player won.");
    noLoop();
  }
  else if(result === 't'){
    resultP.html("Game Tied");
    noLoop();
  }
  let x;
  let y;
  let highest = -Infinity;
  for(let i = 0; i < 3; i++){
    for(let j = 0; j < 3; j++){
      if(boxAvailable[i][j]){
        board[i][j] = playerX;
        boxAvailable[i][j] = false;
        let high = minimax(board, available-1, false, -Infinity, Infinity);
        if(high > highest){
          x = i;
          y = j;
          highest = high;
        }
        board[i][j] = ' ';
        boxAvailable[i][j] = true;
      }
    }
  }
  board[x][y] = playerX;
  boxAvailable[x][y] = false;
  available--;
  // result = win();
  // if(result === 'X'){
  //   console.log("Artificial Intelligence won.");
  //   noLoop();
  // }
  // else if(result === 'O'){
  //   console.log("Player won.");
  //   noLoop();
  // }
  // else if(result === 't'){
  //   console.log("Game Tied");
  //   noLoop();
  // }
}

//this function draws the board and acts like the main function
function draw() {
  background(0, 0, 0); //sets the background to coral red

  let h = height / 3; //h is the height of a box in the board
  let w = width / 3; //w is the width of a box in the board

  //draws the grid
  strokeWeight(2);
  stroke('grey');
  line(w, 0, w, height);
  line(2 * w, 0, 2 * w, height);
  line(0, h, width, h);
  line(0, 2 * h, width, 2 * h);

  //draws symbols/text in the boxes
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      let x = (j * h) + 20; //x-coordinate of the box
      let y = (i * w) + 15; //y-coordinate of the box
      textSize(120);
      fill(255, 255, 255);
      text(board[i][j], x, y, w, h);
    }
  }
  let resultP = createP('');
  resultP.style('font-size', '32pt');
  resultP.style('text-align', 'center');
  let result = win();
  if(result === 'X'){
    resultP.html("Artificial Intelligence won.");
    noLoop();
  }
  else if(result === 'O'){
    resultP.html("Player won.");
    noLoop();
  }
  else if(result === 't'){
    resultP.html("Game Tied");
    noLoop();
  }
}