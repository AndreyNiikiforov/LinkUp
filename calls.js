// ==================== ЗВОНКИ ====================

// Состояние звонка
let callState = {
    isCalling: false,
    targetUser: null,
    callType: null,
    callId: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    callTimer: null,
    callSeconds: 0
};

// STUN серверы
const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

// Простой звук звонка
function playRingtone() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 440;
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 2);
    } catch (e) {
        console.log('Звук не поддерживается');
    }
}

// Начать звонок
async function startCall(type) {
    if (!window.CURRENT_CHAT) {
        alert('Сначала выберите чат');
        return;
    }
    
    try {
        console.log('Начинаем звонок с:', window.CURRENT_CHAT.phone);
        
        // Запрашиваем доступ
        callState.localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: type === 'video'
        });
        
        // Показываем локальное видео
        const localVideo = document.getElementById('localVideo');
        if (localVideo && type === 'video') {
            localVideo.srcObject = callState.localStream;
            document.getElementById('callVideoContainer').style.display = 'block';
        }
        
        // Создаем соединение
        callState.peerConnection = new RTCPeerConnection(iceServers);
        
        // Добавляем треки
        callState.localStream.getTracks().forEach(track => {
            callState.peerConnection.addTrack(track, callState.localStream);
        });
        
        // Получаем удаленный поток
        callState.peerConnection.ontrack = (event) => {
            console.log('Получен удаленный поток');
            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            }
        };
        
        // ICE кандидаты
        callState.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                supabaseClient
                    .from('calls')
                    .update({ ice_candidate: JSON.stringify(event.candidate) })
                    .eq('call_id', callState.callId);
            }
        };
        
        // Создаем оффер
        const offer = await callState.peerConnection.createOffer();
        await callState.peerConnection.setLocalDescription(offer);
        
        // Сохраняем в Supabase
        callState.callId = 'call_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
        callState.callType = type;
        callState.targetUser = window.CURRENT_CHAT.phone;
        callState.isCalling = true;
        
        await supabaseClient
            .from('calls')
            .insert([{
                call_id: callState.callId,
                caller: window.CURRENT_USER.phone,
                callee: window.CURRENT_CHAT.phone,
                type: type,
                offer: JSON.stringify(offer),
                status: 'calling',
                created_at: new Date().toISOString()
            }]);
        
        // Показываем модалку
        document.getElementById('callModal').style.display = 'block';
        document.getElementById('callName').textContent = window.CURRENT_CHAT.username || window.CURRENT_CHAT.phone;
        document.getElementById('callStatus').textContent = '📞 Вызов...';
        
        // Таймер
        startCallTimer();
        
        // Слушаем ответ
        listenForAnswer();
        
        console.log('Звонок создан:', callState.callId);
        
    } catch (e) {
        console.error('Ошибка звонка:', e);
        alert('Ошибка: ' + e.message);
    }
}

// Слушаем ответ
function listenForAnswer() {
    supabaseClient
        .channel('call-channel-' + callState.callId)
        .on('postgres_changes', { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'calls',
            filter: `call_id=eq.${callState.callId}`
        }, async (payload) => {
            console.log('Обновление звонка:', payload);
            
            if (payload.new.status === 'connected' && payload.new.answer) {
                const answer = JSON.parse(payload.new.answer);
                await callState.peerConnection.setRemoteDescription(answer);
                document.getElementById('callStatus').textContent = '⏳ Разговор';
                
            } else if (payload.new.status === 'declined') {
                alert('Пользователь отклонил звонок');
                endCall();
                
            } else if (payload.new.status === 'ended') {
                endCall();
            }
        })
        .subscribe();
    
    // Таймаут
    setTimeout(() => {
        if (callState.isCalling) {
            alert('Пользователь не отвечает');
            endCall();
        }
    }, 30000);
}

// Принять звонок
async function acceptCall(callData) {
    try {
        console.log('Принимаем звонок:', callData);
        
        callState.callId = callData.call_id;
        callState.targetUser = callData.caller;
        
        // Запрашиваем доступ
        callState.localStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: callData.type === 'video'
        });
        
        // Локальное видео
        const localVideo = document.getElementById('localVideo');
        if (localVideo && callData.type === 'video') {
            localVideo.srcObject = callState.localStream;
            document.getElementById('callVideoContainer').style.display = 'block';
        }
        
        // Создаем соединение
        callState.peerConnection = new RTCPeerConnection(iceServers);
        
        callState.localStream.getTracks().forEach(track => {
            callState.peerConnection.addTrack(track, callState.localStream);
        });
        
        callState.peerConnection.ontrack = (event) => {
            console.log('Получен удаленный поток');
            const remoteVideo = document.getElementById('remoteVideo');
            if (remoteVideo) {
                remoteVideo.srcObject = event.streams[0];
            }
        };
        
        callState.peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                supabaseClient
                    .from('calls')
                    .update({ ice_candidate: JSON.stringify(event.candidate) })
                    .eq('call_id', callState.callId);
            }
        };
        
        // Устанавливаем оффер
        await callState.peerConnection.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(callData.offer))
        );
        
        // Создаем ответ
        const answer = await callState.peerConnection.createAnswer();
        await callState.peerConnection.setLocalDescription(answer);
        
        // Отправляем ответ
        await supabaseClient
            .from('calls')
            .update({
                answer: JSON.stringify(answer),
                status: 'connected'
            })
            .eq('call_id', callState.callId);
        
        // Показываем модалку
        document.getElementById('incomingCallModal').style.display = 'none';
        document.getElementById('callModal').style.display = 'block';
        
        // Получаем имя звонящего
        const { data } = await supabaseClient
            .from('profiles')
            .select('username, phone')
            .eq('phone', callData.caller)
            .single();
        
        document.getElementById('callName').textContent = data ? (data.username || data.phone) : callData.caller;
        document.getElementById('callStatus').textContent = '⏳ Разговор';
        
        startCallTimer();
        
    } catch (e) {
        console.error('Ошибка приема звонка:', e);
        alert('Ошибка: ' + e.message);
    }
}

// Отклонить звонок
async function declineCall(callId) {
    await supabaseClient
        .from('calls')
        .update({ status: 'declined' })
        .eq('call_id', callId);
    
    document.getElementById('incomingCallModal').style.display = 'none';
}

// Завершить звонок
async function endCall() {
    console.log('Завершаем звонок');
    
    if (callState.localStream) {
        callState.localStream.getTracks().forEach(t => t.stop());
    }
    if (callState.peerConnection) {
        callState.peerConnection.close();
    }
    if (callState.callTimer) {
        clearInterval(callState.callTimer);
    }
    
    if (callState.callId) {
        await supabaseClient
            .from('calls')
            .update({ status: 'ended' })
            .eq('call_id', callState.callId);
    }
    
    document.getElementById('callModal').style.display = 'none';
    document.getElementById('callVideoContainer').style.display = 'none';
    
    callState = {
        isCalling: false,
        targetUser: null,
        callType: null,
        callId: null,
        peerConnection: null,
        localStream: null,
        remoteStream: null,
        callTimer: null,
        callSeconds: 0
    };
}

// Таймер
function startCallTimer() {
    callState.callSeconds = 0;
    const timer = document.getElementById('callTimer');
    
    callState.callTimer = setInterval(() => {
        callState.callSeconds++;
        const mins = Math.floor(callState.callSeconds / 60);
        const secs = callState.callSeconds % 60;
        timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
}

// Подписка на входящие звонки
function subscribeToIncomingCalls() {
    if (!window.CURRENT_USER) return;
    
    console.log('Подписка на звонки для:', window.CURRENT_USER.phone);
    
    supabaseClient
        .channel('incoming-calls-' + window.CURRENT_USER.phone)
        .on('postgres_changes', { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'calls',
            filter: `callee=eq.${window.CURRENT_USER.phone}`
        }, (payload) => {
            console.log('Входящий звонок!', payload);
            
            if (payload.new.status === 'calling') {
                // Показываем модалку
                document.getElementById('incomingCallModal').style.display = 'block';
                document.getElementById('incomingCallName').textContent = payload.new.caller;
                document.getElementById('incomingCallType').textContent = 
                    payload.new.type === 'video' ? '📹 Видеозвонок' : '🎧 Аудиозвонок';
                
                // Сохраняем данные
                const modal = document.getElementById('incomingCallModal');
                modal.dataset.callId = payload.new.call_id;
                modal.dataset.caller = payload.new.caller;
                modal.dataset.type = payload.new.type;
                modal.dataset.offer = payload.new.offer;
                
                // Звук
                playRingtone();
            }
        })
        .subscribe();
}

// ==================== ИНИЦИАЛИЗАЦИЯ ====================

document.addEventListener('DOMContentLoaded', function() {
    // Кнопки звонков
    const audioBtn = document.getElementById('audioCallBtn');
    const videoBtn = document.getElementById('videoCallBtn');
    
    if (audioBtn) {
        audioBtn.addEventListener('click', function() {
            startCall('audio');
        });
    }
    
    if (videoBtn) {
        videoBtn.addEventListener('click', function() {
            startCall('video');
        });
    }
    
    // Принять звонок
    const acceptBtn = document.getElementById('acceptCallBtn');
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            const modal = document.getElementById('incomingCallModal');
            acceptCall({
                call_id: modal.dataset.callId,
                caller: modal.dataset.caller,
                type: modal.dataset.type,
                offer: modal.dataset.offer
            });
        });
    }
    
    // Отклонить звонок
    const declineBtn = document.getElementById('declineCallBtn');
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            const modal = document.getElementById('incomingCallModal');
            declineCall(modal.dataset.callId);
        });
    }
    
    // Завершить звонок
    const endBtn = document.getElementById('endCallBtn');
    if (endBtn) {
        endBtn.addEventListener('click', endCall);
    }
    
    // Mute
    const muteBtn = document.getElementById('muteAudioBtn');
    if (muteBtn) {
        muteBtn.addEventListener('click', function() {
            if (callState.localStream) {
                const audioTrack = callState.localStream.getAudioTracks()[0];
                if (audioTrack) {
                    audioTrack.enabled = !audioTrack.enabled;
                    muteBtn.textContent = audioTrack.enabled ? '🔊' : '🔇';
                }
            }
        });
    }
});

// Экспортируем функции
window.subscribeToIncomingCalls = subscribeToIncomingCalls;