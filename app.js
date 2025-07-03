const video = document.getElementById('video');
const shapeLabel = document.getElementById('shape-label');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      video.play();
    };
  })
  .catch(err => {
    console.error("Nelze spustit kameru", err);
  });

function selectShape(shape) {
  shapeLabel.innerText = "Vybraný tvar: " + shape.charAt(0).toUpperCase() + shape.slice(1);
  drawOverlayShape(shape);
}

function drawOverlayShape(shape) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;

  ctx.beginPath();

  if (shape === "kulaty") {
    ctx.arc(200, 150, 80, 0, Math.PI * 2);
  } else if (shape === "ovalny") {
    ctx.ellipse(200, 150, 70, 100, 0, 0, Math.PI * 2);
  } else if (shape === "hranaty") {
    ctx.rect(130, 90, 140, 140);
  } else if (shape === "trojuhelnikovy") {
    ctx.moveTo(200, 70);
    ctx.lineTo(130, 230);
    ctx.lineTo(270, 230);
    ctx.closePath();
  }

  ctx.stroke();
}
