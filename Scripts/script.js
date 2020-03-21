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
  element: document.getElementById("main"),
  engine: engine,
  options: {
    width: 1200,
    height: 600,
    background: "./Imgs/fondo_3_copy.jpg",
    showAngleIndicator: false,
    wireframes: false
  }
});

render.context.fillStyle = "blue";
render.context.font = "48px sans-serif";

// Planos para colisión
// const primerPlano = 0x0001,
//   segundoPlano = 0x0002;

var ship1 = Bodies.rectangle(100, 300, 180, 90, {
  chamfer: { radius: 20 },
  frictionAir: 0.08,
  render: {
    sprite: { texture: "./Imgs/barco_der.png", xOffset: 0, yOffset: 0.2 }
  }
});
// var ship1 = Bodies.rectangle(100, 300, 180, 90, { chamfer: { radius: 30 } });

var ship2 = Bodies.rectangle(1100, 300, 180, 90, {
  chamfer: { radius: 30 },
  frictionAir: 0.08,
  render: {
    sprite: { texture: "./Imgs/barco.png", xOffset: 0, yOffset: 0.2 }
  }
});

// const boxB = Bodies.rectangle(450, 50, 80, 80, { restitution: 0.95 });

// Objetivo actual de altura del lado izquierdo, varía entre 400 y 600:
let altura_izda = 500;
let bajando_izda = true;
let altura_centro_izda = 500;
let bajando_centro_izda = true;
let altura_centro_der = 500;
let bajando_centro_der = true;
let altura_der = 500;
let bajando_der = true;

let shoot_allowed_s1 = true;
let shoot_allowed_s2 = true;
let s1_bullet_id = 0;
let s2_bullet_id = 0;

let s1_life = 1;
let s2_life = 1;

let flgGameOver = false;
let winnerMsg;

const _audio = new Audio();
_audio.src = "../Media/NavalWar.mp3";
_audio.loop = true;

const _audioGameOver = new Audio();
_audioGameOver.src = "../Media/GameOver.mp3";
_audioGameOver.loop = false;

// Soft Body
var particleOptions = {
  friction: 0.05,
  frictionStatic: 0.05,
  frictionAir: 0.8,
  render: { visible: false }
};
var constraintOptions = {
  stiffness: 0.5,
  render: { visible: false, anchors: false, lineWidth: 2 }
};
const base = Composites.softBody(
  0,
  400,
  32,
  1,
  0,
  0,
  true,
  15,
  particleOptions,
  constraintOptions
);

// De 33 elementos, hay contraints en el 1, 8, 17, 33
let pto_izda = { x: 0, y: 500 };
var base_constraint_izda = Constraint.create({
  pointA: pto_izda,
  bodyB: base.bodies[0],
  pointB: { x: 0, y: 0 },
  length: 0
});

let pto_centro_izda = { x: 400, y: 500 };
var base_constraint_centro_izda = Constraint.create({
  pointA: pto_centro_izda,
  bodyB: base.bodies[11],
  pointB: { x: 0, y: 0 },
  length: 0
});

let pto_centro_der = { x: 800, y: 500 };
var base_constraint_centro_der = Constraint.create({
  pointA: pto_centro_der,
  bodyB: base.bodies[21],
  pointB: { x: 0, y: 0 },
  length: 0
});

let pto_der = { x: 1200, y: 500 };
var base_constraint_der = Constraint.create({
  pointA: pto_der,
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
var ground = Bodies.rectangle(600, 650, 1200, 10, {
  isStatic: true,
  render: { visible: true }
});

// Suspende la gravedad temporalmente
//engine.world.gravity = {x: 0, y: 0};

World.add(engine.world, [
  base,
  base_constraint_izda,
  base_constraint_centro_izda,
  base_constraint_centro_der,
  base_constraint_der,
  ship1,
  ship2,
  pared_izda,
  pared_der,
  ground
]);

// Starts the Game

Engine.run(engine);
Render.run(render);
startGame();

// Functions

function shoot(isS1) {
  if (isS1) {
    // Obtiene el angulo en radianes
    let ang_s1 = ship1.angle;
    //let factorX = (90 - (ang_s1)) / 90;
    // Buscamos 65
    //let offsetX = 76.322 * Math.cos(ang_s1 - 0.38);
    let offsetX = 85 * Math.cos(ang_s1 - 0.38);
    console.log("factorX:", offsetX, " ang_s1:", ang_s1);
    let offsetY = 85 * Math.sin(ang_s1 - 0.38);
    // Baucamos 40
    //console.log(factorY);
    // Convierte a grados
    //ang_s1 = (ang_s1 * 180) / 3.1416;
    let bullet = Bodies.circle(
      ship1.position.x + offsetX,
      ship1.position.y + offsetY,
      7,
      {
        render: { fillStyle: "#eb9b34" },
        force: {
          x: 0.01 * Math.cos(ang_s1 - 0.45),
          y: 0.01 * Math.sin(ang_s1 - 0.45)
        }
      }
    );
    s1_bullet_id = bullet.id;
    World.add(engine.world, [bullet]);
  } else {
    // Ship1
    // Obtiene el angulo en radianes
    let ang_s2 = ship2.angle;
    //let factorX = (90 - (ang_s1)) / 90;
    // Buscamos 65
    let factorX = -85 * Math.cos(ang_s2 - 0.38);
    // console.log("factorX:", factorX, " ang_s1:", ang_s2);
    // Pi - 0.38 = 2.76
    let factorY = 85 * Math.sin(ang_s2 - 2.76);
    // Baucamos 40
    console.log(factorY);
    // Convierte a grados
    //ang_s1 = (ang_s1 * 180) / 3.1416;
    let bullet = Bodies.circle(
      ship2.position.x + factorX,
      ship2.position.y + factorY,
      7,
      {
        render: { fillStyle: "#f5b942" },
        force: {
          x: -0.01 * Math.cos(ang_s2 - 0.45),
          // Pi - 0.45 = 2.69
          y: 0.01 * Math.sin(ang_s2 - 2.69)
        }
      }
    );
    World.add(engine.world, [bullet]);
    s2_bullet_id = bullet.id;
    console.log("ang_s2", ang_s2, "y", Math.sin(ang_s2 - 2.69));
  }
}

function startGame() {
  _audio.play();
}

function restartGame() {
  s1_life = 10;
  s2_life = 10;
  winnerMsg = undefined;
  _audio.currentTime = 0;
  flgGameOver = false;
  restartsection.style.display = "none";
  _audio.play();
}

restart = document.getElementById("restart");
restart.onclick = restartGame;
restartsection = document.getElementById("restartsection");

function checkForLoose() {
  if (s1_life <= 0) winnerMsg = "Player 2 Win!!";
  if (s2_life <= 0) winnerMsg = "Player 1 Win!!";
  if (winnerMsg != undefined) {
    flgGameOver = true;
    _audioGameOver.play();
    restartsection.style.display = "flex";
  }
}

function impact(bulletS1, onShip1, onShip2) {
  if (bulletS1) {
    World.remove(
      engine.world,
      [engine.world.bodies.filter(item => item.id === s1_bullet_id)][0]
    );
  } else {
    World.remove(
      engine.world,
      [engine.world.bodies.filter(item => item.id === s2_bullet_id)][0]
    );
  }
  // Bala disparada por S1 e impacto en S2
  if (bulletS1 && onShip2) s2_life--;
  if (!bulletS1 && onShip1) s1_life--;
  checkForLoose();
}

window.addEventListener("keydown", event => {
  if (event.code == "KeyA") {
    // Aplica una fuerza a Ship1
    let ang_s1 = ship1.angle;
    // ship1.force = { x: -0.1 * Math.cos(ang_s1), y: - 0.1 * Math.sin(ang_s1) };
    ship1.force = { x: -0.1 * Math.cos(ang_s1), y: 0 };
  }
  if (event.code == "KeyD") {
    // Aplica una fuerza a Ship1
    let ang_s1 = ship1.angle;
    ship1.force = { x: 0.1 * Math.cos(ang_s1), y: 0 };
  }
  if (event.key === "ArrowRight") {
    // Aplica una fuerza a Ship2
    let ang_s2 = ship2.angle;
    ship2.force = { x: 0.1 * Math.cos(ang_s2), y: 0 };
  }
  if (event.key === "ArrowLeft") {
    // Aplica una fuerza a Ship2
    let ang_s2 = ship2.angle;
    ship2.force = { x: -0.1 * Math.cos(ang_s2), y: 0 };
  }

  if (event.code == "KeyH") {
    //boxA.render = { visible: false };
  }
  if (event.code == "KeyS") {
    if (shoot_allowed_s1) {
      shoot_allowed_s1 = false;
      shoot(true);
      setTimeout(() => {
        shoot_allowed_s1 = true;
      }, 3000);
    }
  }
  if (event.code == "KeyR") {
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
    if (shoot_allowed_s2) {
      shoot_allowed_s2 = false;
      shoot(false);
      setTimeout(() => {
        shoot_allowed_s2 = true;
      }, 3000);
    }
  }
});

// an example of using collisionStart event on an engine
Events.on(engine, "collisionStart", function(event) {
  var pairs = event.pairs;

  // change object colours to show those starting a collision
  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i];
    // console.log("Id_A:", pair.bodyA.id);
    // console.log("Id_B:", pair.bodyB.id);
    let onShip1 = pair.bodyA.id === ship1.id || pair.bodyB.id === ship1.id;
    let onShip2 = pair.bodyA.id === ship2.id || pair.bodyB.id === ship2.id;
    if (pair.bodyA.id === s1_bullet_id || pair.bodyB.id === s1_bullet_id)
      impact(true, onShip1, onShip2);
    if (pair.bodyA.id === s2_bullet_id || pair.bodyB.id === s2_bullet_id)
      impact(false, onShip1, onShip2);
  }
});

// an example of using beforeUpdate event on an engine
Events.on(engine, "beforeUpdate", function(event) {
  var engine = event.source;

  if (event.timestamp % 90 < 40) {
    // Mueve las constraints cada cierto tiempo para simular olas:
    let y_act_izda = base_constraint_izda.pointA.y;
    if (bajando_izda) {
      y_act_izda = base_constraint_izda.pointA.y + 2;
      pto_izda = {
        x: base_constraint_izda.pointA.x,
        y: y_act_izda
      };
      base_constraint_izda.pointA = pto_izda;
      if (y_act_izda >= altura_izda) {
        altura_izda = 400 + Math.random() * 200;
        bajando_izda = false;
      }
    } else {
      y_act_izda = base_constraint_izda.pointA.y - 2;
      pto_izda = {
        x: base_constraint_izda.pointA.x,
        y: y_act_izda
      };
      base_constraint_izda.pointA = pto_izda;
      if (y_act_izda <= altura_izda) {
        altura_izda = 400 + Math.random() * 200;
        bajando_izda = true;
      }
    }

    let y_act_centro_izda = base_constraint_centro_izda.pointA.y;
    if (bajando_centro_izda) {
      y_act_centro_izda = base_constraint_centro_izda.pointA.y + 2;
      pto_centro_izda = {
        x: base_constraint_centro_izda.pointA.x,
        y: y_act_centro_izda
      };
      base_constraint_centro_izda.pointA = pto_centro_izda;
      if (y_act_centro_izda >= altura_centro_izda) {
        altura_centro_izda = 400 + Math.random() * 200;
        bajando_centro_izda = false;
      }
    } else {
      y_act_centro_izda = base_constraint_centro_izda.pointA.y - 2;
      pto_centro_izda = {
        x: base_constraint_centro_izda.pointA.x,
        y: y_act_centro_izda
      };
      base_constraint_centro_izda.pointA = pto_centro_izda;
      if (y_act_centro_izda <= altura_centro_izda) {
        altura_centro_izda = 400 + Math.random() * 200;
        bajando_centro_izda = true;
      }
    }

    let y_act_centro_der = base_constraint_centro_der.pointA.y;
    if (bajando_centro_der) {
      y_act_centro_der = base_constraint_centro_der.pointA.y + 2;
      pto_centro_der = {
        x: base_constraint_centro_der.pointA.x,
        y: y_act_centro_der
      };
      base_constraint_centro_der.pointA = pto_centro_der;
      if (y_act_centro_der >= altura_centro_izda) {
        altura_centro_der = 400 + Math.random() * 200;
        bajando_centro_der = false;
      }
    } else {
      y_act_centro_der = base_constraint_centro_der.pointA.y - 2;
      pto_centro_der = {
        x: base_constraint_centro_der.pointA.x,
        y: y_act_centro_der
      };
      base_constraint_centro_der.pointA = pto_centro_der;
      if (y_act_centro_der <= altura_centro_der) {
        altura_centro_der = 400 + Math.random() * 200;
        bajando_centro_der = true;
      }
    }

    let y_act_der = base_constraint_der.pointA.y;
    if (bajando_der) {
      y_act_der = base_constraint_der.pointA.y + 2;
      pto_der = {
        x: base_constraint_der.pointA.x,
        y: y_act_der
      };
      base_constraint_der.pointA = pto_der;
      if (y_act_der >= altura_izda) {
        altura_der = 400 + Math.random() * 200;
        bajando_der = false;
      }
    } else {
      y_act_der = base_constraint_der.pointA.y - 2;
      pto_der = {
        x: base_constraint_der.pointA.x,
        y: y_act_der
      };
      base_constraint_der.pointA = pto_der;
      if (y_act_der <= altura_der) {
        altura_der = 400 + Math.random() * 200;
        bajando_der = true;
      }
    }
  }

  // apply random forces every 5 secs
  // if (event.timestamp % 5000 < 50)
  // shakeScene(engine);
});

Events.on(render, "afterRender", function(event) {
  let context = render.context;
  context.fillStyle = "red";
  context.fillText(`P1: ${s1_life}   vs   P2: ${s2_life}`, 780, 60);
  //   for (let i = 0; i < base.bodies.length; i = i + 4) {
  //     context.beginPath();
  //     context.moveTo(base.bodies[i].position.x, base.bodies[i].position.y);
  //     let p1_x_1 = base.bodies[i].position.x;
  //     j = i + 4;
  //     let p1_x_2 = base.bodies[j].position.x;
  //     let p1_x = p1_x_1 + (p1_x_2 - p1_x_1) / 2;
  //     context.bezierCurveTo(
  //       p1_x,
  //       base.bodies[i].y,
  //       p1_x,
  //       base.bodies[i+4].position.y,
  //       base.bodies[i+4].position.x,
  //       base.bodies[i+4].position.y
  //     );
  //     context.stroke();
  //   }

  if (flgGameOver) {
    // Dibuja el GameOver
    context.fillStyle = "black";
    context.fillRect(0, 0, 1200, 600);
    context.fillStyle = "red";
    context.font = "80px sans-serif";
    context.fillText("Game Over!", 350, 250);
    context.fillStyle = "white";
    context.font = "50px sans-serif";
    context.fillText(winnerMsg, 400, 380);
    _audio.pause();
  }
});

var particleOptions = {
  friction: 0.05,
  frictionStatic: 0.1,
  render: { visible: true }
};
