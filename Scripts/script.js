const Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Vertices = Matter.Vertices,
    Events = Matter.Events,
    Composites = Matter.Composites,
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

// Planos para colisión
const primerPlano = 0x0001,
      segundoPlano = 0x0002;


var ship_v = Vertices.fromPath('0 90 60 90 60 0 90 0 90 90 185 65 125 160 0 160');
var ship = Bodies.fromVertices(150, 200, ship_v, { render: { fillStyle: '#556270', strokeStyle: '#556270', lineWidth: 1}}, true)

const boxA = Bodies.rectangle(400, 200, 80, 80, { render: {strokeStyle: '#ffffff', sprite: {texture: './Imgs/barco.png'}}});
const boxB = Bodies.rectangle(450, 50, 80, 80, { restitution: .95});

var particleOptions = { 
    friction: 0.05,
    frictionStatic: 0.1,
    render: { visible: true } 
};
const base = Composites.softBody(0, 400, 30, 1, 0, 0, true, 10, particleOptions)

var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

World.add(engine.world, [base, ship, boxA, boxB, ground]);

Engine.run(engine);

Render.run(render);

window.addEventListener("keydown", event => {
    if (event.key === "ArrowRight") {
        // Aplica una fuerza a boxB
        boxB.force = {x: .1, y: 0};
    }
    if (event.key === "ArrowLeft") {
        // Aplica una fuerza a boxB
        boxB.force = {x: -.1, y: 0};
    }
    if (event.code == "KeyH") {
        boxA.render = {visible: false};
    }
    if (event.code == "KeyS") {
        boxA.render = {visible: true};
    }
    if (event.code == "KeyR") {
        World.remove(engine.world, [boxA])
    }
    if (event.code == "KeyC") {
        ship.collisionFilter = {category: segundoPlano};
    }
    if (event.key === "ArrowUp") {
        base.bodies.forEach(element => {
            // Aplica una fuerza a boxB
            element.force = {x: 0, y: -.02};
        });        
    }
  });

  // an example of using collisionStart event on an engine
  Events.on(engine, 'collisionStart', function(event) {
    var pairs = event.pairs;

    // change object colours to show those starting a collision
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        // pair.bodyA.render.fillStyle = '#333';
        // pair.bodyB.render.fillStyle = '#333';
       
       // console.log("Id_A:", pair.bodyA.id);
       // console.log("Id_B:", pair.bodyB.id);
       
        //alert("Colision")
    }
});
  




      var particleOptions = { 
        friction: 0.05,
        frictionStatic: 0.1,
        render: { visible: true } 
    };