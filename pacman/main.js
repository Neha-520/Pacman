import './style.css'
const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
  static width = 40;
  static height = 40;
  constructor({ position }) {
    this.position = position;
    this.width = 40;
    this.height = 40;
  }

  draw() {
    context.fillStyle = 'blue'
    context.fillRect(
      this.position.x, this.position.y, this.width, this.height
    )
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

const boundaries = [];

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

const map = [
  ['-', '-', '-', '-', '-', '-', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', ' ', '-', ' ', '-', ' ', '-'],
  ['-', ' ', ' ', ' ', ' ', ' ', '-'],
  ['-', '-', '-', '-', '-', '-', '-']
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
            }
          })
        )
        break;
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
      } else {
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
    pacman.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && lastKey === 'ArrowRight') {
    pacman.velocity.x = 5;
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
  // pacman.velocity.y = 0;
  // pacman.velocity.x = 0;
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