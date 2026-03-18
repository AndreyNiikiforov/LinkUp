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
// ==================== ДОПОЛНЕНИЯ К ОСНОВНОМУ КОДУ ====================

// Переопределяем функцию входа для подписки на звонки
const originalLoginHandler = loginButton?.onclick;
if (loginButton) {
    loginButton.onclick = async function(e) {
        if (originalLoginHandler) {
            await originalLoginHandler.call(this, e);
        }
        if (CURRENT_USER && typeof subscribeToIncomingCalls === 'function') {
            subscribeToIncomingCalls();
        }
        if (typeof loadPremiumSettings === 'function') {
            loadPremiumSettings();
        }
        if (typeof checkPremiumFeatures === 'function') {
            checkPremiumFeatures();
        }
        if (typeof updateAllOwnerBadges === 'function') {
            updateAllOwnerBadges();
        }
        if (typeof setupAnimatedStatus === 'function') {
            setupAnimatedStatus();
        }
    };
}

// Переопределяем функцию старта чата для активации кнопок
const originalStartChat = window.startChat;
window.startChat = async function(phone) {
    if (originalStartChat) {
        await originalStartChat(phone);
    }
    
    // Активируем кнопки звонков
    const audioBtn = document.getElementById('audioCallBtn');
    const videoBtn = document.getElementById('videoCallBtn');
    const voiceBtn = document.getElementById('voiceMsgBtn');
    const circleBtn = document.getElementById('videoCircleBtn');
    
    if (audioBtn) audioBtn.disabled = false;
    if (videoBtn) videoBtn.disabled = false;
    if (voiceBtn) voiceBtn.disabled = false;
    if (circleBtn) circleBtn.disabled = false;
    
    // Обновляем бейдж владельца
    if (typeof updateAllOwnerBadges === 'function') {
        updateAllOwnerBadges();
    }
};

// Кнопка профиля
document.getElementById('profileBtn')?.addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'flex';
    if (typeof loadProfile === 'function') {
        loadProfile();
    }
    if (typeof loadSessions === 'function') {
        loadSessions();
    }
    if (typeof setupAnimatedStatus === 'function') {
        setupAnimatedStatus();
    }
});

// Закрытие модалок
document.getElementById('closeProfileModal')?.addEventListener('click', () => {
    document.getElementById('profileModal').style.display = 'none';
});

// Переключение вкладок профиля
document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.profile-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.profile-tab-content').forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        document.getElementById(tabName + 'Tab')?.classList.add('active');
        
        if (tabName === 'devices' && typeof loadSessions === 'function') {
            loadSessions();
        }
    });
});

// Сохранение приватности
document.getElementById('savePrivacyBtn')?.addEventListener('click', async () => {
    if (!CURRENT_USER) return;
    
    const showPhone = document.querySelector('input[name="showPhone"]:checked')?.value;
    const whoCanWrite = document.querySelector('input[name="whoCanWrite"]:checked')?.value;
    const lastSeen = document.querySelector('input[name="lastSeen"]:checked')?.value;
    
    const privacy_settings = {
        show_phone: showPhone,
        who_can_write: whoCanWrite,
        last_seen: lastSeen,
        show_owner_badge: document.getElementById('showOwnerBadge')?.checked || true
    };
    
    try {
        await supabaseClient
            .from('profiles')
            .update({ privacy_settings })
            .eq('phone', CURRENT_USER.phone);
        
        alert('✅ Настройки сохранены');
        document.getElementById('profileModal').style.display = 'none';
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// Загрузка профиля
async function loadProfile() {
    if (!CURRENT_USER) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', CURRENT_USER.phone)
            .single();
        
        if (error) throw error;
        
        if (data) {
            CURRENT_USER = { ...CURRENT_USER, ...data };
            
            document.getElementById('profileDisplayName').value = data.display_name || data.username || '';
            document.getElementById('profileUsername').value = data.username || '';
            document.getElementById('profilePhone').value = data.phone;
            
            if (data.privacy_settings) {
                const settings = data.privacy_settings;
                
                const showPhoneRadio = document.querySelector(`input[name="showPhone"][value="${settings.show_phone || 'everyone'}"]`);
                if (showPhoneRadio) showPhoneRadio.checked = true;
                
                const whoCanWriteRadio = document.querySelector(`input[name="whoCanWrite"][value="${settings.who_can_write || 'everyone'}"]`);
                if (whoCanWriteRadio) whoCanWriteRadio.checked = true;
                
                const lastSeenRadio = document.querySelector(`input[name="lastSeen"][value="${settings.last_seen || 'everyone'}"]`);
                if (lastSeenRadio) lastSeenRadio.checked = true;
                
                const showOwnerBadge = document.getElementById('showOwnerBadge');
                if (showOwnerBadge) {
                    showOwnerBadge.checked = settings.show_owner_badge !== false;
                }
            }
        }
    } catch (e) {
        console.error('Ошибка загрузки профиля:', e);
    }
}

// Сохранение профиля
document.getElementById('saveProfileBtn')?.addEventListener('click', async () => {
    if (!CURRENT_USER) return;
    
    const displayName = document.getElementById('profileDisplayName').value.trim();
    const username = document.getElementById('profileUsername').value.trim().toLowerCase();
    const animatedNick = document.getElementById('animatedNick')?.checked || false;
    const animatedReactions = document.getElementById('animatedReactions')?.checked || false;
    
    if (username && !validateUsername(username)) {
        alert('❌ Username может содержать только a-z, 0-9 и _');
        return;
    }
    
    try {
        if (username !== CURRENT_USER.username) {
            const { data: existing } = await supabaseClient
                .from('profiles')
                .select('username')
                .eq('username', username)
                .neq('phone', CURRENT_USER.phone);
            
            if (existing?.length) {
                alert('❌ Username уже занят');
                return;
            }
        }
        
        const updates = {
            display_name: displayName || username,
            username: username,
            premium_settings: {
                hasAnimatedNick: animatedNick,
                hasAnimatedReactions: animatedReactions
            }
        };
        
        const { error } = await supabaseClient
            .from('profiles')
            .update(updates)
            .eq('phone', CURRENT_USER.phone);
        
        if (error) throw error;
        
        CURRENT_USER.username = username;
        CURRENT_USER.display_name = displayName;
        
        document.getElementById('currentUserName').textContent = displayName || username || CURRENT_USER.phone;
        document.getElementById('currentUserUsername').textContent = username ? '@' + username : '';
        
        alert('✅ Профиль обновлен');
        document.getElementById('profileModal').style.display = 'none';
        
        if (typeof checkPremiumFeatures === 'function') {
            checkPremiumFeatures();
        }
        
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// Загрузка чатов
async function loadChats() {
    if (!CURRENT_USER || !chatsList) return;
    
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const chatPartners = new Set();
        messages?.forEach(m => {
            if (m.sender === CURRENT_USER.phone) chatPartners.add(m.receiver);
            if (m.receiver === CURRENT_USER.phone) chatPartners.add(m.sender);
        });
        
        if (chatPartners.size === 0) {
            chatsList.innerHTML = '<div class="no-chats">Нет чатов</div>';
            return;
        }
        
        const { data: users } = await supabaseClient
            .from('profiles')
            .select('*')
            .in('phone', Array.from(chatPartners));
        
        chatsList.innerHTML = users?.map(u => `
            <div class="chat-item" onclick="startChat('${u.phone}')">
                <div class="chat-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <div class="chat-info">
                    <div class="chat-name">
                        ${u.username || u.phone}
                        ${u.phone === OWNER_PHONE && OWNER_SETTINGS?.showBadge ? 
                          '<span class="owner-badge">👑</span>' : ''}
                    </div>
                    <div class="chat-last-message">
                        ${u.username ? '@' + u.username : ''}
                    </div>
                </div>
                <div class="chat-time">
                    ${new Date().toLocaleTimeString().slice(0, -3)}
                </div>
            </div>
        `).join('') || '<div class="no-chats">Нет чатов</div>';
        
    } catch (e) {
        console.error('Ошибка загрузки чатов:', e);
    }
}

// Эмодзи панель
document.getElementById('emojiBtn')?.addEventListener('click', () => {
    const panel = document.getElementById('emojiPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('.emoji-grid span').forEach(emoji => {
    emoji.addEventListener('click', () => {
        const input = document.getElementById('messageInput');
        input.value += emoji.textContent;
        document.getElementById('emojiPanel').style.display = 'none';
    });
});

// Отправка сообщения
document.getElementById('sendButton')?.addEventListener('click', sendMessage);
document.getElementById('messageInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !CURRENT_CHAT) return;
    
    try {
        const { error } = await supabaseClient
            .from('messages')
            .insert([{
                sender: CURRENT_USER.phone,
                receiver: CURRENT_CHAT.phone,
                content: text,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        input.value = '';
        loadMessages(CURRENT_CHAT.phone);
        
    } catch (e) {
        console.error('Ошибка отправки:', e);
    }
}

// Загрузка сообщений
async function loadMessages(chatPhone) {
    if (!CURRENT_USER || !messagesArea) return;
    
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .or(`sender.eq.${chatPhone},receiver.eq.${chatPhone}`)
            .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (!messages?.length) {
            messagesArea.innerHTML = '<div class="message received">Начните общение</div>';
        } else {
            messagesArea.innerHTML = messages.map(m => {
                const isSent = m.sender === CURRENT_USER.phone;
                
                if (m.voice_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} voice-message" 
                         data-id="${m.id}" 
                         onclick="playVoiceMessage('${m.voice_data}')">
                        <i class="fas fa-microphone"></i>
                        <div class="voice-waveform">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <span class="voice-duration">${formatDuration(m.voice_duration)}</span>
                        <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                    </div>`;
                }
                
                if (m.circle_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} video-circle-message" 
                         data-id="${m.id}" 
                         onclick="playCircleMessage('${m.circle_data}')">
                        <video src="${m.circle_data}" style="display:none;"></video>
                        <span class="play-icon"><i class="fas fa-play"></i></span>
                        <span class="voice-duration">${formatDuration(m.circle_duration)}</span>
                        <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                    </div>`;
                }
                
                return `
                <div class="message ${isSent ? 'sent' : 'received'}" data-id="${m.id}">
                    ${m.content || ''}
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>`;
            }).join('');
        }
        
        // Скролл вниз
        messagesArea.scrollTop = messagesArea.scrollHeight;
        
    } catch (e) {
        console.error('Ошибка загрузки сообщений:', e);
    }
}

// Заглушки для функций
function loadGroups() {}
function loadPinnedMessages() {}
// ==================== ДОПОЛНЕНИЕ ДЛЯ ЗВОНКОВ ====================

// Сохраняем оригинальную функцию входа
const originalLoginHandler = document.getElementById('loginButton')?.onclick;

// Переопределяем вход
if (document.getElementById('loginButton')) {
    document.getElementById('loginButton').onclick = async function(e) {
        if (originalLoginHandler) {
            await originalLoginHandler.call(this, e);
        }
        // После входа подписываемся на звонки
        if (window.CURRENT_USER && typeof window.subscribeToIncomingCalls === 'function') {
            window.subscribeToIncomingCalls();
        }
    };
}

// Сохраняем оригинальную функцию старта чата
const originalStartChat = window.startChat;

// Переопределяем старт чата
window.startChat = async function(phone) {
    if (originalStartChat) {
        await originalStartChat(phone);
    }
    // Активируем кнопки
    const audioBtn = document.getElementById('audioCallBtn');
    const videoBtn = document.getElementById('videoCallBtn');
    const voiceBtn = document.getElementById('voiceMsgBtn');
    const circleBtn = document.getElementById('videoCircleBtn');
    
    if (audioBtn) audioBtn.disabled = false;
    if (videoBtn) videoBtn.disabled = false;
    if (voiceBtn) voiceBtn.disabled = false;
    if (circleBtn) circleBtn.disabled = false;
};

// Убираем автоматическое открытие профиля!!!
document.addEventListener('DOMContentLoaded', function() {
    // НИЧЕГО НЕ ОТКРЫВАЕМ АВТОМАТИЧЕСКИ
    
    // Кнопка профиля (если есть)
    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            document.getElementById('profileModal').style.display = 'flex';
        });
    }
    
    // Закрытие модалок
    const closeButtons = document.querySelectorAll('.close-btn, #closeProfileModal');
    closeButtons.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) modal.style.display = 'none';
            });
        }
    });
});

// Загрузка сообщений (если не определена)
if (typeof window.loadMessages !== 'function') {
    window.loadMessages = async function(chatPhone) {
        console.log('Загрузка сообщений для:', chatPhone);
        // Твоя существующая функция loadMessages
    };
}

console.log('Дополнения загружены');