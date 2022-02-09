import './style.css'
const canvas = document.querySelector('canvas');

const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Boundary {
  constructor({ position }) {
    this.position = position
  }
}