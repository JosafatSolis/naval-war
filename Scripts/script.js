const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Bodies = Matter.Bodies;

const engine = Engine.create();

const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        background: './Imgs/fondo.jpg',
        showAngleIndicator: false,
        wireframes: false
    }
});

var ship_v = Vertices.fromPath('0 90 60 90 60 0 90 0 90 90 185 65 125 160 0 160');
var ship = Bodies.fromVertices(150, 200, ship_v, { render: { fillStyle: '#556270', strokeStyle: '#556270', lineWidth: 1}}, true)

const boxA = Bodies.rectangle(400, 200, 80, 80, { render: {strokeStyle: '#ffffff', sprite: {texture: './Imgs/barco.png'}}});
const boxB = Bodies.rectangle(450, 50, 80, 80);

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [ship, boxA, boxB, ground]);

Engine.run(engine);

Render.run(render);