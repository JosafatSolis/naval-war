const Engine = Matter.Engine,
  Render = Matter.Render,
  World = Matter.World,
  Vertices = Matter.Vertices,
  Events = Matter.Events,
  Constraint = Matter.Constraint,
  Composites = Matter.Composites,
  Bodies = Matter.Bodies;

const engine = Engine.create();

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: 1200,
    height: 600,
    background: "./Imgs/fondo.jpg",
    showAngleIndicator: false,
    wireframes: false
  }
});

// Planos para colisión
const primerPlano = 0x0001,
  segundoPlano = 0x0002;

let ang_s1 = 0;

var ship_v = Vertices.fromPath(
  "0 90 60 90 60 0 90 0 90 90 185 65 125 160 0 160"
);
// var ship = Bodies.fromVertices(100, 0, ship_v, { render: {sprite: {texture: './Imgs/barco_der.png'}, }}, true)
var ship = Bodies.fromVertices(100, 0, ship_v, true);

var ship2 = Bodies.rectangle(100, 0, 187, 90, {
  render: {
    sprite: { texture: "./Imgs/barco_der.png", xOffset: 0, yOffset: 0.2 }
  }
});

const boxA = Bodies.rectangle(400, 200, 80, 80, {
  render: {
    strokeStyle: "#ffffff",
    sprite: { texture: "./Imgs/barco.png", xOffset: 0, yOffset: 0 }
  }
});
const boxB = Bodies.rectangle(450, 50, 80, 80, { restitution: 0.95 });

// const bullet = Bodies.circle(300,300,5,{velocity: {x: 100, y: 0.1}});
const bullet = Bodies.circle(300, 300, 5);

// Soft Body
var particleOptions = {
  friction: 0.1,
  frictionStatic: 0.1,
  frictionAir: 0.4,
  render: { visible: true }
};
var constraintOptions = { stiffness: 0.4 };
const base = Composites.softBody(
  0,
  400,
  30,
  1,
  0,
  0,
  true,
  15,
  particleOptions,
  constraintOptions
);
var base_constraint_izda = Constraint.create({
  pointA: { x: 0, y: 500 },
  bodyB: base.bodies[0],
  pointB: { x: 0, y: 0 },
  length: 0
});

var base_constraint_der = Constraint.create({
  pointA: { x: 1200, y: 500 },
  bodyB: base.bodies[base.bodies.length - 1],
  pointB: { x: 0, y: 0 },
  length: 0
});

var pared_izda = Bodies.rectangle(0, 300, 10, 600, {
  isStatic: true,
  render: { visible: false }
});
var pared_der = Bodies.rectangle(1200, 300, 10, 600, {
  isStatic: true,
  render: { visible: false }
});
var ground = Bodies.rectangle(0, 400, 1200, 10, {
  isStatic: true,
  render: { visible: true }
});
World.add(engine.world, [
  base,
  base_constraint_izda,
  base_constraint_der,
  ship,
  boxA,
  boxB,
  pared_izda,
  pared_der,
  ship2,
  ship,
  ground
]);

// Engine

Engine.run(engine);

Render.run(render);

window.addEventListener("keydown", event => {
  if (event.key === "ArrowRight") {
    // Aplica una fuerza a boxB
    boxB.force = { x: 0.1, y: 0 };
  }
  if (event.key === "ArrowLeft") {
    // Aplica una fuerza a boxB
    boxB.force = { x: -0.1, y: 0 };
  }
  if (event.code == "KeyH") {
    boxA.render = { visible: false };
  }
  if (event.code == "KeyS") {
    // boxA.render = {visible: true};
    World.add(engine.world, [
      Bodies.circle(ship.position.x + 95, ship.position.y - 30, 7, {
        force: {
          x: (0.01 * (90 - (ang_s1 - 40))) / 90,
          y: 0.01 * ((ang_s1 - 40) / 90)
        }
      })
    ]);
    //bullet.position = {x: 100, y: 100};
  }
  if (event.code == "KeyR") {
    World.remove(engine.world, [boxA]);
  }
  if (event.code == "KeyC") {
    ship.collisionFilter = { category: segundoPlano };
  }
  if (event.key === "ArrowUp") {
    base.bodies.forEach(element => {
      // Aplica una fuerza a boxB
      element.force = { x: 0, y: -0.02 };
    });
  }
  if (event.key === "ArrowDown") {
    base_constraint_der.pointA = {
      x: base_constraint_der.pointA.x,
      y: base_constraint_der.pointA.y - 10
    };
  }
});

// an example of using collisionStart event on an engine
Events.on(engine, "collisionStart", function(event) {
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

// an example of using beforeUpdate event on an engine
Events.on(engine, "beforeUpdate", function(event) {
  var engine = event.source;

  if (event.timestamp % 90 < 10) {
    //ship.angle = 0;
    ang_s1 = (ship.angle * 180) / 3.1416;
    //console.log("Angulo: ", ang_s1);
    // if (ang > 20) ship.angle = (20 * 3.1416 / 180);
  }

  // apply random forces every 5 secs
  // if (event.timestamp % 5000 < 50)
  // shakeScene(engine);
});

var particleOptions = {
  friction: 0.05,
  frictionStatic: 0.1,
  render: { visible: true }
};
