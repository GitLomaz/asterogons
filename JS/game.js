const HEIGHT = 595;
const WIDTH = 1105;

var config = {
  type: Phaser.AUTO,
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: '#efefef',
  parent: 'phaser-example',
  physics: {
      default: 'matter',
      matter: {
          debug: true,
          gravity: {
            x: 0,
            y: 0
        }
      }
  },
  scene: {
    preload: preload, create: create, update: update
  }
};

var objects = []
var poly2
var bodies
var compoundBody
var scene
var game = new Phaser.Game(config);

function preload () {
  this.load.image('block', '../assets/images/rectangle.png');
}

function create () {

  scene = this
  // this.matter.world.setBounds().disableGravity();

  var arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50';
  var chevron = '100 0 75 50 100 100 25 100 0 50 25 0';
  var star = '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38';

  // var poly1 = this.add.polygon(700, 300, arrow, 0x0000ff, 0.2);
  // objects.push(poly1)

  // this.matter.add.gameObject(poly1, { shape: { type: 'fromVerts', verts: arrow, flagInternal: true } });

  // poly1.setVelocity(0, 0);
  // // poly1.setAngularVelocity(0.01);
  // poly1.setBounce(1);
  // poly1.setFriction(0, 0, 0);




  Bodies = Phaser.Physics.Matter.Matter.Bodies;

  // var rectA = Bodies.rectangle(200, 200, 20, 20);
  // var rectB = Bodies.rectangle(300, 300, 20, 20);

  var rectA = Bodies.polygon(200, 200, 3, 10, {
    isStatic: true
  });
  var rectB = Bodies.polygon(300, 300, 3, 10, {
    isStatic: true
  });

  // rectB.setRotation(1)

  compoundBody = Phaser.Physics.Matter.Matter.Body.create({
      parts: [ rectA, rectB]
  });
  var block = this.matter.add.image(150, 0, 'block');
  block.setAngularVelocity(1)

  // this.tweens.add({
  //   targets: block,
  //   rotation: Phaser.Math.DegToRad(360),
  //   duration: 800,
  //   ease: 'Linear',
  //   repeat: -1,
  // });

  block.setExistingBody(compoundBody);

  compoundBody.gameObject.setBounce(5)


  

  poly2 = this.add.polygon(100, 300, chevron, 0xff0000, 0.2);
  objects.push(poly2)

  this.matter.add.gameObject(poly2, { shape: { type: 'fromVerts', verts: chevron, flagInternal: true } });

  spawnAsterogon()

  poly2.setVelocity(1, 0);
  poly2.setBounce(1);
  poly2.setFriction(0, .001, 0);
  

  // var poly3 = this.add.polygon(600, 400, star, 0x00ff00, 0.2);
  // objects.push(poly3)

  // this.matter.add.gameObject(poly3, { shape: { type: 'fromVerts', verts: star, flagInternal: true } });

  // poly3.setVelocity(4, -2);
  // poly3.setBounce(1);
  // poly3.setFriction(0, 0, 0);
  // poly3.setFrictionAir(0.005);

  // var cat1 = this.matter.world.nextCategory();

  // poly2.setCollisionCategory(cat1);
  // // poly3.setCollisionCategory(cat1);

  // var cat2 = this.matter.world.nextCategory();

  // poly1.setCollisionCategory(cat2);

  // poly1.setCollidesWith([ cat1 ]);
  // poly2.setCollidesWith([ cat2 ]);
  // // poly3.setCollidesWith([ cat2 ]);

  this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
    // event.pairs[0].separation = 0
  });
}

function update() {
  compoundBody.gameObject.setAngularVelocity(.03)
  compoundBody.gameObject.setPosition(200, 200)
  // console.log(Math.hypot(poly2.body.velocity.x, poly2.body.velocity.y))
  _.each(objects, function(ob){

    if (Math.hypot(ob.body.velocity.x, ob.body.velocity.y) > 25) {
      ob.setFriction(0, 0.5, 0);
    } else if (Math.hypot(ob.body.velocity.x, ob.body.velocity.y) > 15) {
      ob.setFriction(0, 0.1, 0);
    } else if (Math.hypot(ob.body.velocity.x, ob.body.velocity.y) > 5) {
      ob.setFriction(0, 0.005, 0);
    } else if (Math.hypot(ob.body.velocity.x, ob.body.velocity.y) > 2) {
      ob.setFriction(0, 0.001, 0);
    } else {
      ob.setFriction(0, 0, 0);
    }

    if(ob.x > WIDTH) {
      ob.x = 0
    } else if (ob.x < 0) {
      ob.x = WIDTH
    }
    if(ob.y > HEIGHT) {
      ob.y = 0
    } else if (ob.y < 0) {
      ob.y = HEIGHT
    }
  })
}

function spawnAsterogon(sides = 6, size = 80, velocity, position) {
  if (!position) { 
    if (Phaser.Math.Between(0, 1)) {
      position = {
        x: Phaser.Math.Between(0, WIDTH),
        y: 0
      }
    } else {
      position = {
        y: Phaser.Math.Between(0, HEIGHT),
        x: 0
      }
    }

  }
  const asterogon = scene.matter.add.image(position.x, position.y, 'block');
  asterogon.setBody({type: 'polygon', sides: sides, radius: size})

  // const asterogon = Bodies.polygon(position.x, position.y, sides, size)
  // scene.matter.add.gameObject(asterogon)
  asterogon.setVelocity(1, 0);
  asterogon.setBounce(1);
  asterogon.setFriction(0, .001, 0);
  objects.push(asterogon)
}
