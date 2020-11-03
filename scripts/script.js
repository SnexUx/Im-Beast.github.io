const title = 'Ｂｅａｓｔ',
    loading = ['|','/','-','\\'];

var loadingChar = loading[0],
    currentTitle = title,
    a = 0,
    b = 1,
    c = 0,
    d = 1;

var titleInterval = setInterval(() => {
    loadingChar = loading[c % 4];
    if (d == 1) {
        currentTitle = title.substring(a%title.length, title.length);
        if (a%title.length == title.length-1) d *= -1;
        document.title = `${loadingChar} ${currentTitle.length < 5 ? currentTitle + '\u2000'.repeat(2*(5-currentTitle.length)) : currentTitle} ${loadingChar}`;
    } else {
        currentTitle = title.substring(0, a%title.length);
        if (a%title.length == title.length-1) d *= -1;
        document.title = `${loadingChar} ${currentTitle.length < 5 ? '\u2000'.repeat(2*(5-currentTitle.length)) + currentTitle : currentTitle} ${loadingChar}`;
    }
    a += b;
    c++;
}, 500);

var canvas = document.getElementById('starfield'),
    context = canvas.getContext('2d'),
    starAmount = 150,
    stars = [];

canvas.width = window.innerWidth*0.99;
canvas.height = window.innerHeight*0.99;

class Star {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.speed = 1;
        this.velocity = [Math.random()*this.speed, Math.random()*this.speed];
    }

    move() {
        this.x += this.velocity[0];
        this.y += this.velocity[1];
        this.velocity = [Math.max(this.velocity[0]*0.7,this.speed), Math.max(this.velocity[1]*0.7,this.speed)];

        if (this.x <= 0)
            this.x = canvas.width;
        if (this.y <= 0)
            this.y = canvas.height;
        if (this.x > canvas.width)
            this.x = 0;
        if (this.y > canvas.height)
            this.y = 0;
    }
    

    show(size, color) {
        context.beginPath();
        context.fillStyle = color;
        context.arc(this.x, this.y, size, 0, Math.PI*2);
        context.fill();
    }
}

var mouseX = -500;
var mouseY = -500;
var deltaX = 0;
var deltaY = 0;

document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
    deltaX = e.pageX-mouseX;
    deltaY = e.pageY-mouseY;
    mouseX = e.pageX;
    mouseY = e.pageY;
}

for (let i = 0; i < starAmount; i++) {
    let x = Math.random()*canvas.width;
    let y = Math.random()*canvas.height;
    let star = new Star(x ,y);
    stars.push(star);
}

var lastTime = Date.now();

function draw() {
    canvas.width = window.innerWidth*0.99;
    canvas.height = window.innerHeight*0.99;
    context.fillStyle="black";
    context.fillRect(0,0,canvas.width,canvas.height);
    for (star of stars) {
        let distX = (mouseX-star.x);
        let distY = (mouseY-star.y);

        let dist = 100;

        if (Math.abs(distX) < dist && Math.abs(distY) < dist && (deltaX != 0 || deltaY != 0)) {
            star.velocity = [
                deltaX*star.speed,
                deltaY*star.speed
            ];

            context.beginPath();
            context.strokeStyle = '#fffffff0';
            context.moveTo(mouseX, mouseY);
            context.lineTo(mouseX-distX/1.1, mouseY-distY/1.1);
            context.stroke();
            
            star.show(3, 'white');
            star.show(2, 'black');
        } else {
            star.show(2, 'white');
        }
        
        star.move();
    }
}

//setInterval(draw, 60);

function update() {
    if (Date.now()-lastTime > 30)  {
        draw();
        lastTime = Date.now();
    }
    window.requestAnimationFrame(update);
}
update();
