const canvas = document.querySelector("canvas");
const startButton = document.querySelector("button");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 250;

// listeners
startButton.addEventListener("click", ()=>{
    requestAnimationFrame(game);
    startButton.style.display = "none";
});

let spaceCounter = false;
addEventListener("keydown", e =>{
    ball.isMoving = true;
    switch(e.key){
        // movment players
        case "ArrowUp":
            playerTwo.moveUp();
            break;
            case "ArrowDown":
                playerTwo.moveDown();
                break;
                case "w" || "W":
                    playerOne.moveUp();
                    break;
                    case "s" || "S":
                        playerOne.moveDown();
                        break;
                        // start game
                        case " ": // space key
                        if(spaceCounter) {
                            break;
                        }
                        requestAnimationFrame(game);
                        startButton.style.display = "none";
                        spaceCounter = !spaceCounter;
                        break;
                    }
});

// instances
const playerOne = getPlayer({});
const playerTwo = getPlayer({x:canvas.width-7});
const ball = getBall({});
const score = {
    left: 0,
    right: 0
}

playerOne.draw();
playerTwo.draw();

const ballReboundSound = document.createElement("audio");
const paddleSound = document.createElement("audio");
const goalSound = document.createElement("audio");
const aplausse = document.createElement("audio");
ballReboundSound.src = "./assets/ball_rebound.mp3";
paddleSound.src = "./assets/paddle.mp3";
goalSound.src = "./assets/error.mp3";
aplausse.src = "./assets/aplausse.mp3";

// Game Loop
drawCourt();
function game(){
    clearScreen();
    drawCourt();
    drawScore();
    ball.draw();
    playerOne.draw();
    playerTwo.draw();
    checkCollition();
    loserWatch();
}


// Construction functions
function getBall({}){
    return {
        x: canvas.width / 2 - 3.5,
        y: canvas.height / 2 - 3.5,
        w: 7,
        h: 7,
        color: "white",
        speedX: 1,
        speedY: 1,
        ballSpeed: .7,
        directionX: "right",
        directionY: "up",
        reboundCounter: 0,
        isMoving: true,
        movement(){
            if(!this.isMoving){return}
            // Direction - Left Right
            if(this.x < 0){
                this.directionX = "right";
                ballReboundSound.play();
            }else if(this.x > canvas.width - this.w){
                this.directionX = "left";
                ballReboundSound.play();
            }
            if(this.directionX === "right")  this.speedX++
            else this.speedX--;

            this.speedX*= this.ballSpeed;
            this.x += this.speedX;

            // Direction - Up Down
            if(this.y < 0){
                this.directionY = "down";
                ballReboundSound.play();
            }else if(this.y > canvas.height - this.h){
                this.directionY = "up";
                ballReboundSound.play();
            }
            if(this.directionY === "down")  this.speedY++;
            else this.speedY--;

            this.speedY*= this.ballSpeed;
            this.y+= this.speedY;
        },
        draw(){
            this.movement();
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
        }
    }
}

function getPlayer({
    x=0,
    color="white"
}) {
    return {
        x,
        y: canvas.height/2- 25,
        w: 7,
        h: 50,
        speed: 10,
        color,
        draw(){
            ctx.fillStyle = color;
            ctx.fillRect(this.x,this.y,this.w,this.h);
        },
        moveUp(){
            if(this.y < 10) return;
            this.y-= this.speed;
        },
        moveDown(){
            if(this.y > canvas.height - 60) return;
            this.y+= this.speed;
        },
        contains(b){
            return (this.x < b.x + b.w) &&
                    (this.x + this.w > b.x) &&
                    (this.y < b.y + b.h) &&
                    (this.y + this.h > b.y);

        }
    }
}


// independent functions
function clearScreen(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
}

function drawScore(){
    ctx.fillStyle = "white";
    ctx.font = '44px "Press Start 2P"';
    ctx.fillText(score.left,canvas.width - canvas.width*.7 - 22,canvas.height/2+ 22, 50);
    ctx.fillText(score.right,canvas.width - canvas.width*.3 - 22,canvas.height/2+ 22, 50);
}

function drawCourt(){
    let color = "white";

    ctx.fillStyle = "black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeRect(0,0,canvas.width,canvas.height);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.closePath;
}

function speedUp() {
    if(ball.ballSpeed === .78) {return};
    ball.ballSpeed += 0.002;
}

function checkCollition() {
    if(playerOne.contains(ball)){
        ball.directionX = "right";
        speedUp();
        paddleSound.play();
    }else if(playerTwo.contains(ball)) {
        ball.directionX = "left";
        speedUp();
        paddleSound.play();
    }
    // Score
    if(ball.x < 0){
        goalSound.play();
        ball.x = canvas.width / 2 - 3.5;
        ball.y = canvas.height / 2 - 3.5;
        playerOne.y = canvas.height/2 -25;
        playerTwo.y = canvas.height/2 -25;
        ball.isMoving = false;
        score.right++;
        ball.ballSpeed = .7;
        ball.directionX = "right";
    }else if(ball.x > canvas.width - ball.w){
        goalSound.play();
        ball.x = canvas.width / 2 - 3.5;
        ball.y = canvas.height / 2 - 3.5;
        playerOne.y = canvas.height/2 -25;
        playerTwo.y = canvas.height/2 -25;
        ball.isMoving = false;
        score.left++;
        ball.ballSpeed = .7;
        ball.directionX = "left";
    }
}

function loserWatch() {
    let winner = "";
    if(score.left === 3) {
        winner = "PLAYER ONE";
    }else if(score.right === 3){
        winner = "PLAYER TWO";
    }
    if(score.left === 3 || score.right === 3) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText(winner, canvas.width/2- 216, canvas.height/2- 22);
        ctx.fillText("WIN", canvas.width/2- 66, canvas.height/2+ 22);
        aplausse.play();
    }else{
        requestAnimationFrame(game);
    }
}