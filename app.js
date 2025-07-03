
const video = document.getElementById('video');
const hairstyleDiv = document.getElementById('hairstyle');

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://justadudewhohacks.github.io/face-api.js/models')
]).then(startVideo);

function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: {} })
    .then(stream => {
      video.srcObject = stream;
    })
    .catch(err => {
      console.error("Nelze spustit kameru", err);
      hairstyleDiv.innerText = "Nepodařilo se získat přístup ke kameře.";
    });
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detections) {
      hairstyleDiv.innerText = "Tvar obličeje nebyl rozpoznán...";
      return;
    }

    const landmarks = detections.landmarks;
    const jaw = landmarks.getJawOutline();
    const width = jaw[jaw.length - 1].x - jaw[0].x;
    const height = landmarks.getNose()[0].y - jaw[0].y;

    const ratio = width / height;

    let shape = '';
    if (ratio > 1.5) shape = 'kulatý';
    else if (ratio < 0.9) shape = 'oválný';
    else shape = 'hranatý';

    hairstyleDiv.innerHTML = `<h2>Tvůj tvar obličeje je: ${shape}</h2>
      <img src="images/${shape}.jpg" alt="účes pro ${shape} obličej" width="200"
      style="border-radius:12px; box-shadow: 0 0 10px #aaa;" />`;
  }, 1000);
});
