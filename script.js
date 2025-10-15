const video = document.getElementById("webcam");
const jawapanText = document.getElementById("jawapan");

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return new Promise((resolve) => {
    video.onloadedmetadata = () => resolve(video);
  });
}

function detectGesture(landmarks) {
  if (!landmarks) return null;

  const thumbTip = landmarks[4];   // Ibu jari
  const indexTip = landmarks[8];   // Jari telunjuk
  const middleTip = landmarks[12]; // Jari tengah

  const thumbIndexDist = Math.hypot(
    thumbTip[0] - indexTip[0],
    thumbTip[1] - indexTip[1]
  );

  const peaceCondition =
    indexTip[1] < landmarks[6][1] &&
    middleTip[1] < landmarks[10][1];

  if (thumbIndexDist < 40) return "A"; // 👍
  if (peaceCondition) return "B";      // ✌️

  return null;
}

async function main() {
  await setupCamera();
  await tf.setBackend("webgl");
  const model = await handpose.load();

  setInterval(async () => {
    const predictions = await model.estimateHands(video);
    if (predictions.length > 0) {
      const gesture = detectGesture(predictions[0].landmarks);
      if (gesture === "A") {
        jawapanText.textContent = "Jawapan: A (Biru)";
      } else if (gesture === "B") {
        jawapanText.textContent = "Jawapan: B (Merah)";
      } else {
        jawapanText.textContent = "Gesture tidak dikenalpasti";
      }
    } else {
      jawapanText.textContent = "Tiada tangan dikesan";
    }
  }, 1000);
}

main
