const messagesDiv = document.getElementById("messages");
const input = document.getElementById("messageInput");

/* ------------------ СООБЩЕНИЯ ------------------ */
function sendMessage() {
  const text = input.value;
  if (!text) return;

  addMessage(text);
  input.value = "";
}

function addMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.innerText = text;
  messagesDiv.appendChild(msg);
}

/* ------------------ ГОЛОСОВЫЕ ------------------ */
let mediaRecorder;
let isRecording = false;

async function toggleVoice() {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    let chunks = [];

    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/ogg" });
      const audio = document.createElement("audio");

      audio.controls = true;
      audio.src = URL.createObjectURL(blob);

      messagesDiv.appendChild(audio);
    };

    mediaRecorder.start();
    isRecording = true;
  } else {
    mediaRecorder.stop();
    isRecording = false;
  }
}

/* ------------------ ЗВОНКИ ------------------ */
let localStream;

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    alert("📞 Звонок начат (локально)\n\nЧтобы работало между людьми — нужен сервер");

  } catch (e) {
    alert("Ошибка доступа к камере");
  }
}

/* ------------------ АДМИН ------------------ */
const OWNER = "89224030705";

function openAdmin() {
  const phone = prompt("Введите номер");

  if (phone !== OWNER) {
    alert("Нет доступа");
    return;
  }

  showAdminPanel();
}

function showAdminPanel() {
  const action = prompt(
    "Админ панель:\n1 - Очистить чат\n2 - Инфо"
  );

  if (action === "1") {
    messagesDiv.innerHTML = "";
  }

  if (action === "2") {
    alert("LinkUp v1\nТы владелец");
  }
}