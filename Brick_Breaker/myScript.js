var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");


//used to set balls starting position
var x = canvas.width/2;
var y = canvas.height-30;

//ball movement
var dx = 2;
var dy = -2;

/* Collision Detection */
var ballRadius = 10;


/* defining the paddle */

var paddleHeight = 10;
var paddleWidth = 75;
//the starting point of the paddle on load
var paddleX = (canvas.width-paddleWidth) / 2;

//starting color of ball
var color = "#0095DD";


/* Paddle movement controls */
var rightPressed = false;
var leftPressed = false;

/* Bricks */
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//tracking the score
var score = 0;

//lives
var lives = 3;



//two dimentional array for building the bricks
var bricks = [];
for(var c = 0; c < brickColumnCount; c++){
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++){
        bricks[c][r] = {x: 0, y: 0, status: 1 };

    } 
}



// function random makes the ball color change to a random color as it hits each wall
function random(){
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
}

function drawBall(){
    /* Draw the Ball */
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);

    //ball color is the fillStyle
    ctx.fillStyle = "#FF1493";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(){
    /* drawing the paddle */
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle="#3DED97";
    ctx.fill();
    ctx.closePath();
}

 

//function to paint bricks on screen from looping through the array
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++){
        if(bricks[c][r].status ==1){
            //brick position
            var brickX = (c*(brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (r*(brickHeight + brickPadding)) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx.beginPath();
            ctx.rect(brickX, brickY, brickWidth, brickHeight);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
            }
        }
    }
}

function drawScore(){
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " +score, 8, 20);
}

function drawLives(){
    ctx.font = ("16px Arial");
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " +lives, canvas.width-65, 20);
}

//function used to draw
function draw () {
    /* Clearing canvas */
    //takes in 4 parameters x and y of top left and x and y of bottom right
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //calling the function to draw the ball after every clear
    drawBall();

    //calling the function to draw the paddle
    drawPaddle();

    //calling the function to track score
    drawScore();

    //calling the function to add lives
    drawLives();

    //calling the function for collision detection
    collisionDetection();

    //calling the function to draw the bricks
    drawBricks();

    //increments the x and y value by dx(+2) and dy(-2) every time the function is loaded to give the ball movement
    x += dx;
    y += dy;
    
/* Collision detection */
    // if y + dy is less than 0 or y + dy is greater than canvas height set dy to -dy setting dy from (-2) to (2) reversing the ball movement on the y axis
if(y + dy < ballRadius){
    dy = -dy;
    
} else if (y + dy > canvas.height-ballRadius){
    //setting paddle detection to ball
    if(x > paddleX && x < paddleX + paddleWidth){
    // the number after -dy is a multiplier so the ball moves faster and faster with every paddle hit remove the number to keep ball at consistent speed
        dy = -dy - 1;
    }
 else{
    lives--;
    if(!lives){
    alert("GAME OVER"); // alerts end game
    document.location.reload();
  
    }
    else{
        x = canvas.width/2;
        y = canvas.height-30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width-paddleWidth)/2;
    }
    }
}

if(x + dx < ballRadius || x + dx > canvas.width-ballRadius){
    dx = -dx;
    
}

//moving paddle Logic
if(rightPressed) {
    //speed of paddle to the right
    paddleX += 7;
    //keeping paddle on screen right side
    if(paddleX + paddleWidth > canvas.width){
        paddleX = canvas.width - paddleWidth;
    }
} else if(leftPressed){
    //speed of paddle to the left
    paddleX -= 7;
    //keeping paddle on screen left side
    if(paddleX < 0){
        paddleX = 0;
    }
}

requestAnimationFrame(draw);
}


/* adding keyUp and keyDown event to listen for key movements */
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//adding mouse movement
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }

}

function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = false;
    }

}

   /* Brick collision Detection */
function collisionDetection(){
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++){
            var b = bricks[c][r];
            if(b.status == 1) {
            if(x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight){
                dy = -dy;
                b.status = 0;
                score++;
                color = random();
                if(score == brickRowCount * brickColumnCount) {
                    alert("YOU WIN, CONGRATULATIONS!");
                    document.location.reload();
                    
                }
                }
            }
        }
    }
}



//setIntreval is used to call the draw function every 10 seconds

draw();