const btn = document.getElementById('record-btn');
const status = document.getElementById('status');

let mediaRecorder;
let chunks = [];
let recording = false;

btn.addEventListener('click', async () => {
  if (!recording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    chunks = [];

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');

      status.textContent = 'Saving...';
      const res = await fetch('/api/recordings', { method: 'POST', body: formData });
      const data = await res.json();
      status.textContent = `Saved: ${data.saved}`;
      stream.getTracks().forEach((t) => t.stop());
    };

    mediaRecorder.start();
    recording = true;
    btn.classList.add('recording');
    status.textContent = 'Recording... press to stop';
  } else {
    mediaRecorder.stop();
    recording = false;
    btn.classList.remove('recording');
  }
});
