import './style.css'
const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreElement');

import soundPellet from './audio/munch.wav'
import soundPowerUp from './audio/pill.wav'
import soundGameOver from './audio/death.wav'
import soundGhost from './audio/eat_ghost.wav'

const context = canvas.getContext('2d');


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position, image }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
    this.image = image
  }

  draw() {
    // context.fillStyle = 'blue'
    // context.fillRect(
    //   this.position.x, this.position.y, this.width, this.height
    // )
    context.drawImage(this.image, this.position.x, this.position.y)
  }
}

class Pacman {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
  }

  draw() {
    //wrapped inside save and restore so that global canvas funcn applied only for inside code
    context.save()
    //translate canvas center to pacman center
    context.translate(this.position.x, this.position.y)
    context.rotate(this.rotation)
    //canvas centre changed back
    context.translate(-this.position.x, -this.position.y)

    context.beginPath();
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      this.radians,
      Math.PI * 2 - this.radians
    );
    context.lineTo(this.position.x, this.position.y) // draws line from 2 ends of arc 
    context.fillStyle = 'yellow'
    context.fill();
    context.closePath();
    context.restore()
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.radians < 0 || this.radians > 0.75)
      this.openRate = - this.openRate

    this.radians += this.openRate
  }
}

class Ghost {
  static speed = 2
  constructor({ position, velocity, color = 'red' }) {
    this.position = position
    this.velocity = velocity
    this.radius = 14
    this.color = color
    this.prevCollisions = []
    this.speed = 2
    this.scared = false
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.scared ? 'blue' : this.color
    context.fill();
    context.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Pellet {
  constructor({ position }) {
    this.position = position
    this.radius = 3
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'white'
    context.fill();
    context.closePath();
  }
}

class PowerUp {
  constructor({ position }) {
    this.position = position
    this.radius = 8
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'white'
    context.fill();
    context.closePath();
  }
}

function playAudio(audio) {
  const soundEffect = new Audio(audio)
  soundEffect.play();
}

const pellets = []
const boundaries = []
const powerUps = []
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }
  }),
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height * 3 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'pink'
  }),
  new Ghost({
    position: {
      x: Boundary.width * 2 + Boundary.width / 2,
      y: Boundary.height * 5 + Boundary.height / 2
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    },
    color: 'cyan'
  }),
]

const pacman = new Pacman({
  position: {
    x: Boundary.width + Boundary.width / 2,
    y: Boundary.height + Boundary.height / 2
  },
  velocity: {
    x: 0,
    y: 0
  }
});

const keys = {
  ArrowUp: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowDown: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  }
}

let lastKey = ''
let score = 0

//create html image element
function createImg(src) {
  const image = new Image()
  image.src = src
  return image
}

const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeHorizontal.png')
          })
        )
        break;
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeVertical.png')
          })
        )
        break;
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeCorner1.png')
          })
        )
        break;
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeCorner2.png')
          })
        )
        break;
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeCorner3.png')
          })
        )
        break;
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/pipeCorner4.png')
          })
        )
        break;
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImg('./assets/block.png')
          })
        )
        break;
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImg('./assets/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImg('./assets/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImg('./assets/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImg('./assets/pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
      case 'p':
        powerUps.push(
          new PowerUp({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break
    }
  })
})

function collisionOfCircleWithRectangle({ circle, rectangle }) {
  const padding = Boundary.width / 2 - circle.radius - 1
  return (
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
  )
}

let animationId
function animate() {
  animationId = requestAnimationFrame(animate)
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionOfCircleWithRectangle({
        circle: {
          ...pacman, velocity: {
            x: 0,
            y: -5
          }
        },
        rectangle: boundary
      })
      ) {
        pacman.velocity.y = 0;
        break;
      }
      else {
        pacman.velocity.y = -5;
      }
    }
  } else if (keys.ArrowDown.pressed && lastKey === 'ArrowDown') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionOfCircleWithRectangle({
        circle: {
          ...pacman, velocity: {
            x: 0,
            y: 5
          }
        },
        rectangle: boundary
      })
      ) {
        pacman.velocity.y = 0;
        break;
      } else {
        pacman.velocity.y = 5;
      }
    }
  } else if (keys.ArrowLeft.pressed && lastKey === 'ArrowLeft') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionOfCircleWithRectangle({
        circle: {
          ...pacman, velocity: {
            x: -5,
            y: 0
          }
        },
        rectangle: boundary
      })
      ) {
        pacman.velocity.x = 0;
        break;
      }
      else {
        pacman.velocity.x = -5;
      }
    }
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionOfCircleWithRectangle({
        circle: {
          ...pacman, velocity: {
            x: 5,
            y: 0
          }
        },
        rectangle: boundary
      })
      ) {
        pacman.velocity.x = 0;
        break;
      }
      else {
        pacman.velocity.x = 5;
      }
    }
  }

  //detect collision b/w ghost & player
  for (let i = ghosts.length - 1; i >= 0; i--) {
    const ghost = ghosts[i]

    //ghost touch player
    if (Math.hypot(ghost.position.x - pacman.position.x, ghost.position.y - pacman.position.y)
      < ghost.radius + pacman.radius
    ) {
      if (ghost.scared) {
        playAudio(soundGhost)
        ghosts.splice(i, 1);
      } else {
        cancelAnimationFrame(animationId);
        playAudio(soundGameOver)
      }
    }
  }

  //win condition 
  if (pellets.length === 0) {
    cancelAnimationFrame(animationId)
  }

  //power ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];

    powerUp.draw();

    //player collide with power up
    if (Math.hypot(powerUp.position.x - pacman.position.x, powerUp.position.y - pacman.position.y)
      < powerUp.radius + pacman.radius
    ) {
      playAudio(soundPowerUp)
      powerUps.splice(i, 1);

      //make ghost scared
      ghosts.forEach((ghost) => {
        ghost.scared = true

        setTimeout(() => {
          ghost.scared = false
        }, 4000)
      })
    }
  }

  //touch pellets
  for (let i = pellets.length - 1; i >= 0; i--) {
    const p = pellets[i];
    p.draw();

    //hypot here is dustance b/w center of pacman and center of pellete
    if (Math.hypot(p.position.x - pacman.position.x, p.position.y - pacman.position.y)
      < p.radius + pacman.radius
    ) {
      playAudio(soundPellet)
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerHTML = score
    }
  }


  boundaries.forEach((b) => {
    b.draw();

    //Collision detection
    if (collisionOfCircleWithRectangle({
      circle: pacman,
      rectangle: b
    })) {
      pacman.velocity.y = 0;
      pacman.velocity.x = 0;
    }

  })

  pacman.update();

  ghosts.forEach(ghost => {
    ghost.update()

    const collisions = []
    boundaries.forEach(boundary => {
      if (!collisions.includes('right') && collisionOfCircleWithRectangle({
        circle: {
          ...ghost, velocity: {
            x: ghost.speed,
            y: 0
          }
        },
        rectangle: boundary
      })
      ) {
        collisions.push('right')
      }

      if (!collisions.includes('left') && collisionOfCircleWithRectangle({
        circle: {
          ...ghost, velocity: {
            x: -ghost.speed,
            y: 0
          }
        },
        rectangle: boundary
      })
      ) {
        collisions.push('left')
      }
      if (!collisions.includes('up') && collisionOfCircleWithRectangle({
        circle: {
          ...ghost, velocity: {
            x: 0,
            y: -ghost.speed
          }
        },
        rectangle: boundary
      })
      ) {
        collisions.push('up')
      }
      if (!collisions.includes('bottom') && collisionOfCircleWithRectangle({
        circle: {
          ...ghost, velocity: {
            x: 0,
            y: ghost.speed
          }
        },
        rectangle: boundary
      })
      ) {
        collisions.push('bottom')
      }
    })
    // console.log(collisions)
    if (collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions

    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

      if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
      else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
      else if (ghost.velocity.y > 0) ghost.prevCollisions.push('bottom')
      else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')

      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision)
      })

      const direction = pathways[Math.floor(Math.random() * pathways.length)]

      switch (direction) {
        case 'bottom':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break;
        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break;
        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break;
        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break;
      }

      ghost.prevCollisions = []
    }
  })

  if (pacman.velocity.x > 0) pacman.rotation = 0
  else if (pacman.velocity.x < 0) pacman.rotation = Math.PI
  else if (pacman.velocity.y < 0) pacman.rotation = Math.PI * 1.5
  else if (pacman.velocity.y > 0) pacman.rotation = Math.PI / 2
}

animate();

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = true
      lastKey = 'ArrowUp'
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      lastKey = 'ArrowLeft'
      break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = true
      lastKey = 'ArrowDown'
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      lastKey = 'ArrowRight'
      break;
  }
})

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowUp':
      keys.ArrowUp.pressed = false
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break;
    case 'ArrowDown':
      keys.ArrowDown.pressed = false
      break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break;
  }
})