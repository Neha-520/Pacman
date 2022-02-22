import './style.css'
const canvas = document.querySelector('canvas');
const scoreEl = document.querySelector('#scoreElement');

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
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = 'yellow'
    context.fill();
    context.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Ghost {
  constructor({ position, velocity, color = 'red' }) {
    this.position = position
    this.velocity = velocity
    this.radius = 15
    this.color = color
  }

  draw() {
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color
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

const pellets = []
const boundaries = []
const ghosts = [
  new Ghost({
    position: {
      x: Boundary.width * 6 + Boundary.width / 2,
      y: Boundary.height + Boundary.height / 2
    },
    velocity: {
      x: 0,
      y: 0
    }
  })
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
    }
  })
})

function collisionOfPacmanWithRectangle({
  circle,
  rectangle
}) {
  return (
    circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height
    && circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x
    && circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y
    && circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
  )
}

function animate() {
  requestAnimationFrame(animate)
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (keys.ArrowUp.pressed && lastKey === 'ArrowUp') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (collisionOfPacmanWithRectangle({
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
      if (collisionOfPacmanWithRectangle({
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
      if (collisionOfPacmanWithRectangle({
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
      if (collisionOfPacmanWithRectangle({
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

  //touch pellets
  for (let i = pellets.length - 1; i > 0; i--) {
    const p = pellets[i];
    p.draw();

    //hypot here is dustance b/w center of pacman and center of pellete
    if (Math.hypot(p.position.x - pacman.position.x, p.position.y - pacman.position.y)
      < p.radius + pacman.radius
    ) {
      pellets.splice(i, 1);
      score += 10;
      scoreEl.innerHTML = score
    }
  }


  boundaries.forEach((b) => {
    b.draw();

    //Collision detection
    if (collisionOfPacmanWithRectangle({
      circle: pacman,
      rectangle: b
    })) {
      pacman.velocity.y = 0;
      pacman.velocity.x = 0;
    }

  })

  pacman.update();

  ghosts.forEach(g => {
    g.update()
  })
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