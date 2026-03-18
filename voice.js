// ==================== ГОЛОСОВЫЕ СООБЩЕНИЯ И КРУЖОЧКИ ====================

let voiceRecorder = {
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
    timer: null,
    seconds: 0,
    isRecording: false
};

let videoCircleRecorder = {
    mediaRecorder: null,
    videoChunks: [],
    stream: null,
    timer: null,
    seconds: 0,
    isRecording: false
};

// ==================== ГОЛОСОВЫЕ СООБЩЕНИЯ ====================

// Начать запись голосового сообщения
async function startVoiceRecording() {
    try {
        // Запрашиваем доступ к микрофону
        voiceRecorder.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        voiceRecorder.mediaRecorder = new MediaRecorder(voiceRecorder.stream);
        voiceRecorder.audioChunks = [];
        
        voiceRecorder.mediaRecorder.ondataavailable = (event) => {
            voiceRecorder.audioChunks.push(event.data);
        };
        
        voiceRecorder.mediaRecorder.onstop = () => {
            // Создаем аудио blob
            const audioBlob = new Blob(voiceRecorder.audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Сохраняем для отправки
            window.currentVoiceBlob = audioBlob;
            window.currentVoiceUrl = audioUrl;
            window.currentVoiceDuration = voiceRecorder.seconds;
            
            // Останавливаем треки
            voiceRecorder.stream.getTracks().forEach(t => t.stop());
        };
        
        // Начинаем запись
        voiceRecorder.mediaRecorder.start();
        voiceRecorder.isRecording = true;
        
        // Запускаем таймер
        startVoiceTimer();
        
        // Показываем индикатор записи
        showRecordingIndicator('voice');
        
        console.log('Запись голоса начата');
        
    } catch (e) {
        console.error('Ошибка доступа к микрофону:', e);
        alert('Не удалось получить доступ к микрофону');
    }
}

// Остановить запись голоса
function stopVoiceRecording() {
    if (voiceRecorder.mediaRecorder && voiceRecorder.isRecording) {
        voiceRecorder.mediaRecorder.stop();
        voiceRecorder.isRecording = false;
        
        // Останавливаем таймер
        if (voiceRecorder.timer) {
            clearInterval(voiceRecorder.timer);
        }
        
        // Скрываем индикатор
        hideRecordingIndicator();
        
        // Показываем модалку с записью
        showVoicePreview();
    }
}

// Таймер для голосовых
function startVoiceTimer() {
    voiceRecorder.seconds = 0;
    const timerDisplay = document.getElementById('voiceTimer');
    
    voiceRecorder.timer = setInterval(() => {
        voiceRecorder.seconds++;
        if (timerDisplay) {
            const mins = Math.floor(voiceRecorder.seconds / 60);
            const secs = voiceRecorder.seconds % 60;
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Индикатор в шапке
        const recordingTimer = document.getElementById('recordingTimer');
        if (recordingTimer) {
            recordingTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Показать предпросмотр голоса
function showVoicePreview() {
    const modal = document.getElementById('voiceRecorderModal');
    const playBtn = document.getElementById('playRecordingBtn');
    const audioPlayer = document.getElementById('voicePreview');
    
    if (!audioPlayer) {
        // Создаем аудио элемент
        const audio = document.createElement('audio');
        audio.id = 'voicePreview';
        audio.controls = true;
        audio.style.width = '100%';
        document.getElementById('voiceRecorderContent').appendChild(audio);
    }
    
    const player = document.getElementById('voicePreview');
    player.src = window.currentVoiceUrl;
    
    // Настройка кнопки Play
    if (playBtn) {
        playBtn.onclick = () => {
            if (player.paused) {
                player.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                player.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
    }
    
    modal.style.display = 'flex';
}

// Отправить голосовое сообщение
async function sendVoiceMessage() {
    if (!window.currentVoiceBlob || !CURRENT_CHAT) return;
    
    try {
        // Конвертируем blob в base64
        const reader = new FileReader();
        reader.readAsDataURL(window.currentVoiceBlob);
        
        reader.onloadend = async function() {
            const base64data = reader.result;
            
            // Сохраняем в Supabase
            const { error } = await supabaseClient
                .from('messages')
                .insert([{
                    sender: CURRENT_USER.phone,
                    receiver: CURRENT_CHAT.phone,
                    voice_data: base64data,
                    voice_duration: window.currentVoiceDuration,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            
            // Закрываем модалку
            document.getElementById('voiceRecorderModal').style.display = 'none';
            
            // Обновляем сообщения
            if (typeof loadMessages === 'function') {
                loadMessages(CURRENT_CHAT.phone);
            }
            
            // Очищаем
            window.currentVoiceBlob = null;
            window.currentVoiceUrl = null;
        };
        
    } catch (e) {
        console.error('Ошибка отправки голоса:', e);
        alert('Ошибка отправки: ' + e.message);
    }
}

// ==================== КРУЖОЧКИ (ВИДЕО) ====================

// Начать запись кружочка
async function startCircleRecording() {
    try {
        // Запрашиваем доступ к камере
        videoCircleRecorder.stream = await navigator.mediaDevices.getUserMedia({ 
            audio: true,
            video: {
                width: { ideal: 360 },
                height: { ideal: 360 },
                facingMode: 'user'
            }
        });
        
        // Показываем видео
        const videoElement = document.getElementById('circleVideo');
        if (videoElement) {
            videoElement.srcObject = videoCircleRecorder.stream;
            videoElement.play();
        }
        
        videoCircleRecorder.mediaRecorder = new MediaRecorder(videoCircleRecorder.stream);
        videoCircleRecorder.videoChunks = [];
        
        videoCircleRecorder.mediaRecorder.ondataavailable = (event) => {
            videoCircleRecorder.videoChunks.push(event.data);
        };
        
        videoCircleRecorder.mediaRecorder.onstop = () => {
            // Создаем видео blob
            const videoBlob = new Blob(videoCircleRecorder.videoChunks, { type: 'video/webm' });
            const videoUrl = URL.createObjectURL(videoBlob);
            
            // Сохраняем
            window.currentCircleBlob = videoBlob;
            window.currentCircleUrl = videoUrl;
            window.currentCircleDuration = videoCircleRecorder.seconds;
            
            // Останавливаем треки
            videoCircleRecorder.stream.getTracks().forEach(t => t.stop());
        };
        
        // Начинаем запись
        videoCircleRecorder.mediaRecorder.start();
        videoCircleRecorder.isRecording = true;
        
        // Прячем кнопку старт, показываем стоп
        document.getElementById('startCircleBtn').style.display = 'none';
        document.getElementById('stopCircleBtn').style.display = 'inline-flex';
        
        // Запускаем таймер
        startCircleTimer();
        
        // Показываем индикатор записи
        showRecordingIndicator('circle');
        
        console.log('Запись кружочка начата');
        
    } catch (e) {
        console.error('Ошибка доступа к камере:', e);
        alert('Не удалось получить доступ к камере');
    }
}

// Остановить запись кружочка
function stopCircleRecording() {
    if (videoCircleRecorder.mediaRecorder && videoCircleRecorder.isRecording) {
        videoCircleRecorder.mediaRecorder.stop();
        videoCircleRecorder.isRecording = false;
        
        // Останавливаем таймер
        if (videoCircleRecorder.timer) {
            clearInterval(videoCircleRecorder.timer);
        }
        
        // Возвращаем кнопки
        document.getElementById('startCircleBtn').style.display = 'inline-flex';
        document.getElementById('stopCircleBtn').style.display = 'none';
        
        // Скрываем индикатор
        hideRecordingIndicator();
        
        // Показываем предпросмотр
        showCirclePreview();
    }
}

// Таймер для кружочка
function startCircleTimer() {
    videoCircleRecorder.seconds = 0;
    const timerDisplay = document.getElementById('circleTimer');
    
    videoCircleRecorder.timer = setInterval(() => {
        videoCircleRecorder.seconds++;
        if (timerDisplay) {
            const mins = Math.floor(videoCircleRecorder.seconds / 60);
            const secs = videoCircleRecorder.seconds % 60;
            timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        
        // Индикатор в шапке
        const recordingTimer = document.getElementById('recordingTimer');
        if (recordingTimer) {
            recordingTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Показать предпросмотр кружочка
function showCirclePreview() {
    const modal = document.getElementById('videoCircleModal');
    const videoElement = document.getElementById('circlePreview');
    const playBtn = document.getElementById('playCircleBtn');
    
    if (!videoElement) {
        const video = document.createElement('video');
        video.id = 'circlePreview';
        video.controls = true;
        video.style.width = '100%';
        video.style.borderRadius = '12px';
        document.getElementById('videoCircleContent').appendChild(video);
    }
    
    const preview = document.getElementById('circlePreview');
    preview.src = window.currentCircleUrl;
    
    // Настройка кнопки Play
    if (playBtn) {
        playBtn.onclick = () => {
            if (preview.paused) {
                preview.play();
                playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                preview.pause();
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        };
    }
    
    modal.style.display = 'flex';
}

// Отправить кружочек
async function sendCircleMessage() {
    if (!window.currentCircleBlob || !CURRENT_CHAT) return;
    
    try {
        const reader = new FileReader();
        reader.readAsDataURL(window.currentCircleBlob);
        
        reader.onloadend = async function() {
            const base64data = reader.result;
            
            const { error } = await supabaseClient
                .from('messages')
                .insert([{
                    sender: CURRENT_USER.phone,
                    receiver: CURRENT_CHAT.phone,
                    circle_data: base64data,
                    circle_duration: window.currentCircleDuration,
                    created_at: new Date().toISOString()
                }]);
            
            if (error) throw error;
            
            document.getElementById('videoCircleModal').style.display = 'none';
            
            if (typeof loadMessages === 'function') {
                loadMessages(CURRENT_CHAT.phone);
            }
            
            window.currentCircleBlob = null;
            window.currentCircleUrl = null;
        };
        
    } catch (e) {
        console.error('Ошибка отправки кружочка:', e);
        alert('Ошибка отправки: ' + e.message);
    }
}

// Индикатор записи
function showRecordingIndicator(type) {
    const indicator = document.getElementById('recordingIndicator');
    const icon = document.getElementById('recordingIcon');
    const timer = document.getElementById('recordingTimer');
    
    if (indicator) {
        indicator.style.display = 'flex';
    }
    
    if (icon) {
        icon.innerHTML = type === 'voice' ? '🎤' : '📹';
    }
    
    if (timer) {
        timer.textContent = '0:00';
    }
}

function hideRecordingIndicator() {
    const indicator = document.getElementById('recordingIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Воспроизвести голосовое сообщение
function playVoiceMessage(audioData) {
    const audio = new Audio(audioData);
    audio.play();
}

// Воспроизвести кружочек
function playCircleMessage(videoData) {
    const modal = document.getElementById('videoCircleModal');
    const video = document.getElementById('circlePreview') || document.createElement('video');
    
    if (!video.id) {
        video.id = 'circlePreview';
        video.controls = true;
        video.style.width = '100%';
        document.getElementById('videoCircleContent').appendChild(video);
    }
    
    video.src = videoData;
    video.play();
    modal.style.display = 'flex';
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', () => {
    // Кнопка голосового сообщения
    const voiceBtn = document.getElementById('voiceMsgBtn');
    if (voiceBtn) {
        voiceBtn.addEventListener('click', startVoiceRecording);
    }
    
    // Кнопка кружочка
    const circleBtn = document.getElementById('videoCircleBtn');
    if (circleBtn) {
        circleBtn.addEventListener('click', startCircleRecording);
    }
    
    // Кнопки в модалках
    const stopRecordingBtn = document.getElementById('stopRecordingBtn');
    if (stopRecordingBtn) {
        stopRecordingBtn.addEventListener('click', stopVoiceRecording);
    }
    
    const startCircleBtn = document.getElementById('startCircleBtn');
    if (startCircleBtn) {
        startCircleBtn.addEventListener('click', startCircleRecording);
    }
    
    const stopCircleBtn = document.getElementById('stopCircleBtn');
    if (stopCircleBtn) {
        stopCircleBtn.addEventListener('click', stopCircleRecording);
    }
    
    const sendVoiceBtn = document.getElementById('sendRecordingBtn');
    if (sendVoiceBtn) {
        sendVoiceBtn.addEventListener('click', sendVoiceMessage);
    }
    
    const sendCircleBtn = document.getElementById('sendCircleBtn');
    if (sendCircleBtn) {
        sendCircleBtn.addEventListener('click', sendCircleMessage);
    }
    
    const cancelVoiceBtn = document.getElementById('cancelRecordingBtn');
    if (cancelVoiceBtn) {
        cancelVoiceBtn.addEventListener('click', () => {
            document.getElementById('voiceRecorderModal').style.display = 'none';
            window.currentVoiceBlob = null;
            window.currentVoiceUrl = null;
        });
    }
    
    const cancelCircleBtn = document.getElementById('cancelCircleBtn');
    if (cancelCircleBtn) {
        cancelCircleBtn.addEventListener('click', () => {
            document.getElementById('videoCircleModal').style.display = 'none';
            window.currentCircleBlob = null;
            window.currentCircleUrl = null;
        });
    }
    
    // Кнопка остановки в индикаторе
    const stopBtn2 = document.getElementById('stopRecordingBtn2');
    if (stopBtn2) {
        stopBtn2.addEventListener('click', () => {
            if (voiceRecorder.isRecording) {
                stopVoiceRecording();
            } else if (videoCircleRecorder.isRecording) {
                stopCircleRecording();
            }
        });
    }
    
    // Закрытие модалок
    document.getElementById('closeVoiceRecorder')?.addEventListener('click', () => {
        document.getElementById('voiceRecorderModal').style.display = 'none';
    });
    
    document.getElementById('closeVideoCircle')?.addEventListener('click', () => {
        document.getElementById('videoCircleModal').style.display = 'none';
    });
});

// Экспорт
window.startVoiceRecording = startVoiceRecording;
window.stopVoiceRecording = stopVoiceRecording;
window.startCircleRecording = startCircleRecording;
window.stopCircleRecording = stopCircleRecording;
window.sendVoiceMessage = sendVoiceMessage;
window.sendCircleMessage = sendCircleMessage;
window.playVoiceMessage = playVoiceMessage;
window.playCircleMessage = playCircleMessage;