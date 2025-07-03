
const video = document.getElementById('video');
const canvas = document.getElementById('overlay');
const ctx = canvas.getContext('2d');
const label = document.getElementById('shape-label');

let selectedShape = null;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => video.srcObject = stream)
    .catch(err => console.error("Nelze spustit kameru", err));
}

function selectShape(shape) {
  selectedShape = shape;
  label.innerText = "Vybraný tvar: " + shape;
}

video.addEventListener('play', () => {
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detection = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (detection && selectedShape) {
      const landmarks = detection.landmarks;
      const jaw = landmarks.getJawOutline();

      const left = jaw[0].x;
      const right = jaw[jaw.length - 1].x;
      const top = landmarks.getNose()[0].y - 50;
      const bottom = jaw[8].y + 20;

      const width = right - left;
      const height = bottom - top;
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      ctx.strokeStyle = "red";
      ctx.lineWidth = 3;
      ctx.beginPath();

      if (selectedShape === "kulaty") {
        const radius = Math.min(width, height) / 2;
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      } else if (selectedShape === "ovalny") {
        ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, 2 * Math.PI);
      } else if (selectedShape === "hranaty") {
        ctx.rect(centerX - width / 2, centerY - height / 2, width, height);
      } else if (selectedShape === "trojuhelnikovy") {
        ctx.moveTo(centerX, centerY - height / 2);
        ctx.lineTo(centerX - width / 2, centerY + height / 2);
        ctx.lineTo(centerX + width / 2, centerY + height / 2);
        ctx.closePath();
      }

      ctx.stroke();
    }
  }, 300);
});
