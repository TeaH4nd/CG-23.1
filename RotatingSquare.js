"use strict";

var width;  // Largura do canvas
var height; // Altura do canvas

var vertices = new Float32Array([ // Coordenada dos vertices
    // x, z, y
    // v0-v1-v2-v3
    -0.5, -0.5, 0.5,
    -0.5, 0.5, 0.5,
    -0.5, -0.5, 0.5,
    0.5, -0.5, 0.5,
]);

var borda = new Float32Array([ // Coordenada dos vertices da borda
// x, z, y
// v0-v1-v2-v3
-0.6, -0.6, 0.6,
-0.6, 0.6, 0.6,
-0.6, -0.6, 0.6,
0.6, -0.6, 0.6,
]);

var numPoints = vertices.length / 2;

var ANGLE_INCREMENT = 30.0; // Incremento do angulo (velocidade)

var last_time = Date.now();

function mapToViewport (x, y, n = 5) {
    return [((x + n / 2) * width) / n, ((-y + n / 2) * height) / n];
}

function getVertex (i) {
    let j = (i % numPoints) * 2;
    return [vertices[j], vertices[j + 1]];
}

function getVertex_borda (i) {
    let j = (i % numPoints) * 2;
    return [borda[j], borda[j + 1]];
}

function draw (ctx, angle, index) {
    ctx.fillStyle = "rgba(0, 204, 204, 1)";
    ctx.rect(0, 0, width, height);
    ctx.fill();

    let [x, y] = mapToViewport(...getVertex(index));
    ctx.translate(x, y);
    ctx.rotate(-angle * Math.PI / 180);
    ctx.translate(-x, -y)
    
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertex_borda(i).map((x) => x));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.fillStyle = "grey";
    ctx.fill();
    
    // Cria gradiente de acordo com o vertice selecionado
    let grad;
    if (0 === index) {
        grad = ctx.createLinearGradient(203, 150, x, y);
        grad.addColorStop(0, 'rgba(12, 0, 255, 1)'); //red
        grad.addColorStop(1, 'rgba(255, 0, 0, 1)');
    } else if (2 === index) {
        grad = ctx.createLinearGradient(167, 200, x, y);
        grad.addColorStop(0, 'rgba(255, 0, 0, 1)'); //blue
        grad.addColorStop(1, 'rgba(12, 0, 255, 1)');
    } else if (5 === index) {
        grad = ctx.createLinearGradient(210, 270, x, y);
        grad.addColorStop(0, 'rgba(0, 255, 4, 1)'); //white
        grad.addColorStop(1, 'rgba(255, 255, 255, 1)');
    } else if (1 === index) {
        grad = ctx.createLinearGradient(167, 200, x, y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)'); //green
        grad.addColorStop(1, 'rgba(0, 255, 4, 1)');
    }
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
        if (i == 3 || i == 4) continue;
        let [x, y] = mapToViewport(...getVertex(i).map((x) => x));
        if (i == 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.fillStyle = grad;
    ctx.fill();

    draw_vertex(ctx)
}

function draw_vertex(ctx){
    let size = 8
    let [x_v, y_v] = mapToViewport(...getVertex(0));
    ctx.beginPath();
    ctx.rect(x_v - (size/2), y_v - (size/2) , size, size);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    [x_v, y_v] = mapToViewport(...getVertex(1));
    ctx.beginPath();
    ctx.rect(x_v - (size/2), y_v - (size/2) , size, size);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();

    [x_v, y_v] = mapToViewport(...getVertex(2));
    ctx.beginPath();
    ctx.rect(x_v - (size/2), y_v - (size/2) , size, size);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
    
    [x_v, y_v] = mapToViewport(...getVertex(5));
    ctx.beginPath();
    ctx.rect(x_v - (size/2), y_v - (size/2) , size, size);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function calculateAngle (angle) {
    var now = Date.now();
    var elapsed = now - last_time;
    last_time = now;
    var newAngle = angle + (ANGLE_INCREMENT * elapsed) / 1000.0;
    return newAngle %= 360;
};

function mainEntrance () {
    // Recupera o elemento <canvas>
    var canvas = document.getElementById('theCanvas');

    // Obtém o contexto de renderização para WebGL
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.log('Falha ao obter o contexto de renderização para WebGL');
    return;
    }

    // Recupera as medidas do canvas
    width = canvas.width;
    height = canvas.height;

    // Muda a direcao da rotacao
    var currentIndex = 0; // Indice inicial de rotacao
    document.addEventListener("keydown", (e) => {
        switch (e.key) {
            case "r":
                currentIndex = 0;
                break;
            case "g":
                currentIndex = 1;
                break;
            case "b":
                currentIndex = 2;
                break;
            case "w":
                currentIndex = 5;
                break;
        }
    });

    // Gera o loop da animacao
    var currentAngle = 2.0; // Angulo inicial
    var runanimation = (() => {
        currentAngle = calculateAngle(currentAngle);
        return () => {
            draw(ctx, currentAngle, currentIndex);
            requestAnimationFrame(runanimation);
        };
    })();
    runanimation();
};