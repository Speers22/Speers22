const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");


// used to se canvas to full width and height of the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let adjustX = -10;
let adjustY = 20;
// creating an empty array
let particleArray = [];


            /* Handle Mouse Interactions */ 

const mouse = {
    x: null,           // x axis on canvas
    y: null,           // y axis on canvas
    radius: 150     // sets circle around mouse
}

window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;

})


            /*Draw on canvas selecting size and font as well as text and x and y location */
// default color is black so setting color of text to white
ctx.fillStyle= "white";

// selects fontsize and font
ctx.font = "20px Comic Book";

//selects text and x and y location
ctx.fillText("SPEERS", 0, 30);

            /*Used to visualize the area for get Image Data*/ 
/*
ctx.strokeStyle = "white";
ctx.strokeRect(0,0,100,100);
*/

const textCoordinates = ctx.getImageData(0, 0, 100, 100);


class Particle {
    constructor(x, y) {
            this.x = x + 100;
            this.y = y;
            this.size = 3;
            this.baseX = this.x;
            this.baseY = this.y;
            this.density = (Math.random() * 40) + 5;
    }
    draw(){
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if(this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y = this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
console.log(textCoordinates);
function init() {
    particleArray = [];
    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX * 10, positionY * 10));
            }
        }
    }

}

init();
console.log(particleArray);


/* creating an animation loop to reDraw particles*/
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}

animate();

function connect(){
    let opacityValue = 1;
        for (let a = 0; a < particleArray.length; a++) {
            for(let b = a; b < particleArray.length; b++){
                let dx = particleArray[a].x - particleArray[b].x;
                let dy = particleArray[a].y - particleArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 50) {
                    opacityValue = 1 - (distance/50);
                    ctx.strokeStyle = "rgba(0, 255, 255," + opacityValue + ")";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(particleArray[a].x, particleArray[a].y);
                    ctx.lineTo(particleArray[b].x, particleArray[b].y);
                    ctx.stroke();
                }
            }
        }
}