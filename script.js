let video = document.getElementById("webcam");
let jawapanText = document.getElementById("jawapan");

async function setupCamera() {
  video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

function detectGesture(landmarks) {
  if (!landmarks) return null;

  const [thumbTip, indexTip] = [landmarks[4], landmarks[8]];
  const distance = Math.hypot(thumbTip[0] - indexTip[0], thumbTip[1] - indexTip[1]);

  if (distance < 30) return "A"; // 👍
  if (landmarks[8][1] < landmarks[6][1] && landmarks[12][1] < landmarks[10][1]) return "B"; // ✌️
  return null;
}

async function main() {
  await setupCamera();
  const model = await handpose.load();

  setInterval(async () => {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const gesture = detectGesture(predictions[0].landmarks);
      if (gesture === "A") jawapanText.textContent = "Jawapan: A (Biru)";
      else if (gesture === "B") jawapanText.textContent = "Jawapan: B (Merah)";
    }
  }, 1000);
}

main();
