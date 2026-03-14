// ==================== ПОДКЛЮЧЕНИЕ К SUPABASE ====================
const SUPABASE_URL = 'https://zrqaiwobrkzilfwhtkvs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycWFpd29icmt6aWxmd2h0a3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDc0MDgsImV4cCI6MjA4ODcyMzQwOH0.3PeA7LCedWW8YmiSKW_hqv8Lv227Rk_QrAxFJTFeSpw';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== КОНСТАНТЫ ====================
const OWNER_PHONE = '+79224030705';
let CURRENT_USER = null;
let CURRENT_CHAT = null;
let CURRENT_GROUP = null;
let GROUPS = [];
let selectedMembers = [];
let selectedMessageId = null;
let selectedMessageType = null;
let ADMIN_RIGHTS = null;
let CURRENT_SESSION_TOKEN = null;
let QR_POLLING_INTERVAL = null;
let leafInterval = null;
let rainInterval = null;
let currentRankUser = null;

// ==================== ДОМ ЭЛЕМЕНТЫ ====================
const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const authMessage = document.getElementById('authMessage');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatWindow = document.getElementById('chatWindow');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const qrLoginForm = document.getElementById('qrLoginForm');
const showQrLogin = document.getElementById('showQrLogin');
const backFromQrBtn = document.getElementById('backFromQrBtn');
const showRegisterButton = document.getElementById('showRegisterButton');
const backToLoginButton = document.getElementById('backToLoginButton');
const loginPhone = document.getElementById('loginPhone');
const loginPassword = document.getElementById('loginPassword');
const registerPhone = document.getElementById('registerPhone');
const registerUsername = document.getElementById('registerUsername');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const currentUserPhone = document.getElementById('currentUserPhone');
const currentUserName = document.getElementById('currentUserName');
const currentUserUsername = document.getElementById('currentUserUsername');
const adminButton = document.getElementById('adminButton');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchTypeRadios = document.querySelectorAll('input[name="searchType"]');
const searchResults = document.getElementById('searchResults');
const searchResultsList = document.getElementById('searchResultsList');
const closeSearch = document.getElementById('closeSearch');
const chatsList = document.getElementById('chatsList');
const groupsList = document.getElementById('groupsList');
const chatsTabBtn = document.getElementById('chatsTabBtn');
const groupsTabBtn = document.getElementById('groupsTabBtn');
const createGroupBtn = document.getElementById('createGroupBtn');
const groupModal = document.getElementById('groupModal');
const closeGroupModal = document.getElementById('closeGroupModal');
const groupName = document.getElementById('groupName');
const groupDescription = document.getElementById('groupDescription');
const availableUsers = document.getElementById('availableUsers');
const createGroupFinal = document.getElementById('createGroupFinal');
const pinnedMessages = document.getElementById('pinnedMessages');
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const emojiBtn = document.getElementById('emojiBtn');
const emojiPanel = document.getElementById('emojiPanel');
const messageMenu = document.getElementById('messageMenu');
const deleteMessageBtn = document.getElementById('deleteMessageBtn');
const pinMessageBtn = document.getElementById('pinMessageBtn');
const chatMenuBtn = document.getElementById('chatMenuBtn');

// Кнопки звонков и медиа
const audioCallBtn = document.getElementById('audioCallBtn');
const videoCallBtn = document.getElementById('videoCallBtn');
const groupCallBtn = document.getElementById('groupCallBtn');
const voiceMsgBtn = document.getElementById('voiceMsgBtn');
const videoCircleBtn = document.getElementById('videoCircleBtn');
const attachBtn = document.getElementById('attachBtn');

// Модалки звонков
const callModal = document.getElementById('callModal');
const callAvatar = document.getElementById('callAvatar');
const callName = document.getElementById('callName');
const callStatus = document.getElementById('callStatus');
const callVideoContainer = document.getElementById('callVideoContainer');
const remoteVideo = document.getElementById('remoteVideo');
const localVideo = document.getElementById('localVideo');
const muteAudioBtn = document.getElementById('muteAudioBtn');
const toggleVideoBtn = document.getElementById('toggleVideoBtn');
const endCallBtn = document.getElementById('endCallBtn');
const speakerBtn = document.getElementById('speakerBtn');
const callTimerDisplay = document.getElementById('callTimer');
const incomingCallModal = document.getElementById('incomingCallModal');
const incomingCallAvatar = document.getElementById('incomingCallAvatar');
const incomingCallName = document.getElementById('incomingCallName');
const incomingCallType = document.getElementById('incomingCallType');
const acceptCallBtn = document.getElementById('acceptCallBtn');
const declineCallBtn = document.getElementById('declineCallBtn');

// Голосовые сообщения
const voiceRecorderModal = document.getElementById('voiceRecorderModal');
const closeVoiceRecorder = document.getElementById('closeVoiceRecorder');
const voiceTimer = document.getElementById('voiceTimer');
const startRecordingBtn = document.getElementById('startRecordingBtn');
const stopRecordingBtn = document.getElementById('stopRecordingBtn');
const playRecordingBtn = document.getElementById('playRecordingBtn');
const sendRecordingBtn = document.getElementById('sendRecordingBtn');
const cancelRecordingBtn = document.getElementById('cancelRecordingBtn');

// Кружочки
const videoCircleModal = document.getElementById('videoCircleModal');
const closeVideoCircle = document.getElementById('closeVideoCircle');
const circleVideo = document.getElementById('circleVideo');
const circleTimer = document.getElementById('circleTimer');
const startCircleBtn = document.getElementById('startCircleBtn');
const stopCircleBtn = document.getElementById('stopCircleBtn');
const playCircleBtn = document.getElementById('playCircleBtn');
const sendCircleBtn = document.getElementById('sendCircleBtn');
const cancelCircleBtn = document.getElementById('cancelCircleBtn');

// QR элементы
const qrContainer = document.getElementById('qrContainer');
const qrPlaceholder = document.getElementById('qrPlaceholder');
const qrCanvas = document.getElementById('qrCanvas');
const qrScanModal = document.getElementById('qrScanModal');
const closeQrScan = document.getElementById('closeQrScan');
const qrVideo = document.getElementById('qrVideo');
const stopQrScan = document.getElementById('stopQrScan');
const qrConfirmModal = document.getElementById('qrConfirmModal');
const qrConfirmYes = document.getElementById('qrConfirmYes');
const qrConfirmNo = document.getElementById('qrConfirmNo');
const qrConfirmDevice = document.getElementById('qrConfirmDevice');
const qrConfirmLocation = document.getElementById('qrConfirmLocation');

// Настройки профиля
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const profileDisplayName = document.getElementById('profileDisplayName');
const profileUsername = document.getElementById('profileUsername');
const profilePhone = document.getElementById('profilePhone');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const userProfile = document.getElementById('userProfile');
const profileTabs = document.querySelectorAll('.profile-tab');
const profileTabContents = document.querySelectorAll('.profile-tab-content');

// Приватность
const showPhoneRadios = document.querySelectorAll('input[name="showPhone"]');
const whoCanWriteRadios = document.querySelectorAll('input[name="whoCanWrite"]');
const lastSeenRadios = document.querySelectorAll('input[name="lastSeen"]');
const savePrivacyBtn = document.getElementById('savePrivacyBtn');

// Устройства
const devicesList = document.getElementById('devicesList');
const terminateAllSessions = document.getElementById('terminateAllSessions');

// Привязки
const linkGoogle = document.getElementById('linkGoogle');

// Админка
const adminModal = document.getElementById('adminModal');
const closeAdmin = document.getElementById('closeAdmin');
const adminTabs = document.querySelectorAll('.admin-tab');
const adminsTab = document.getElementById('adminsTab');
const adminUsersList = document.getElementById('adminUsersList');
const adminUserSearch = document.getElementById('adminUserSearch');
const supportList = document.getElementById('supportList');
const reportsList = document.getElementById('reportsList');
const channelsList = document.getElementById('channelsList');
const createChannelBtn = document.getElementById('createChannelBtn');
const adminsList = document.getElementById('adminsList');
const addAdminBtn = document.getElementById('addAdminBtn');
const newAdminPhone = document.getElementById('newAdminPhone');

// Модалка рангов
const rankModal = document.getElementById('rankModal');
const closeRankModal = document.getElementById('closeRankModal');
const rankUserPhone = document.getElementById('rankUserPhone');
const rankOptions = document.querySelectorAll('.rank-option');
const confirmRankBtn = document.getElementById('confirmRankBtn');
const cancelRankBtn = document.getElementById('cancelRankBtn');

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function formatPhone(number) {
    let cleaned = number.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.substring(1);
    if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
    cleaned = cleaned.substring(0, 11);
    return '+' + cleaned;
}

function validateUsername(username) {
    const regex = /^[a-z0-9_]+$/;
    return regex.test(username);
}

function generateSessionToken() {
    return 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

function generateQrCode() {
    return 'qr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
}

function saveSession(user) {
    localStorage.setItem('linkup_session', JSON.stringify({ 
        user, 
        token: CURRENT_SESSION_TOKEN,
        timestamp: Date.now() 
    }));
}

function loadSession() {
    const s = localStorage.getItem('linkup_session');
    if (s) try {
        const d = JSON.parse(s);
        if (Date.now() - d.timestamp < 30 * 24 * 60 * 60 * 1000) {
            CURRENT_SESSION_TOKEN = d.token;
            return d.user;
        }
    } catch (e) {}
    return null;
}

function isOwner() {
    return CURRENT_USER?.phone === OWNER_PHONE;
}

function getUserRank(phone) {
    if (phone === OWNER_PHONE) return 5;
    if (!ADMIN_RIGHTS) return 0;
    return ADMIN_RIGHTS.rank || 0;
}

function canUserDo(phone, action) {
    const rank = getUserRank(phone);
    if (rank >= 5) return true;
    return false;
}

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ==================== ВЫХОД ИЗ ПРОФИЛЯ ====================
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('Вы уверены, что хотите выйти?')) {
            localStorage.removeItem('linkup_session');
            CURRENT_USER = null;
            CURRENT_SESSION_TOKEN = null;
            ADMIN_RIGHTS = null;
            authScreen.style.display = 'flex';
            app.style.display = 'none';
            loginPhone.value = '';
            loginPassword.value = '';
            authMessage.textContent = '';
        }
    });
}

// ==================== ГЛАЗКИ ДЛЯ ПАРОЛЯ ====================
function addPasswordToggle(input) {
    const container = input.parentElement;
    const btn = document.createElement('span');
    btn.className = 'password-toggle';
    btn.innerHTML = '👁️';
    btn.onclick = () => {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.innerHTML = input.type === 'password' ? '👁️' : '🔓';
    };
    container.style.position = 'relative';
    input.style.paddingRight = '40px';
    container.appendChild(btn);
}

[loginPassword, registerPassword, registerPasswordConfirm].forEach(i => i && addPasswordToggle(i));

// ==================== ПЕРЕКЛЮЧЕНИЕ ФОРМ ====================
if (showRegisterButton) {
    showRegisterButton.addEventListener('click', () => {
        loginForm.style.display = 'none';
        qrLoginForm.style.display = 'none';
        showRegisterButton.style.display = 'none';
        registerForm.style.display = 'block';
        authMessage.textContent = '';
    });
}

if (backToLoginButton) {
    backToLoginButton.addEventListener('click', () => {
        loginForm.style.display = 'block';
        qrLoginForm.style.display = 'none';
        showRegisterButton.style.display = 'block';
        registerForm.style.display = 'none';
        authMessage.textContent = '';
    });
}

if (showQrLogin) {
    showQrLogin.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        showRegisterButton.style.display = 'none';
        qrLoginForm.style.display = 'block';
        authMessage.textContent = '';
        startQrLogin();
    });
}

if (backFromQrBtn) {
    backFromQrBtn.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        qrLoginForm.style.display = 'none';
        showRegisterButton.style.display = 'block';
        stopQrLogin();
    });
}

// ==================== QR-ВХОД ====================
let currentQrCode = null;
let currentQrToken = null;
let qrCheckInterval = null;

async function startQrLogin() {
    if (!qrPlaceholder || !qrCanvas) return;
    
    qrPlaceholder.style.display = 'flex';
    qrCanvas.style.display = 'none';
    
    currentQrToken = generateQrCode();
    currentQrCode = currentQrToken;
    
    await supabaseClient
        .from('qr_codes')
        .insert([{
            code: currentQrToken,
            expires_at: new Date(Date.now() + 2 * 60 * 1000),
            used: false
        }]);
    
    QRCode.toCanvas(qrCanvas, currentQrToken, {
        width: 250,
        margin: 2,
        color: {
            dark: '#ffffff',
            light: '#00000000'
        }
    }, function(error) {
        if (error) {
            console.error('Ошибка генерации QR:', error);
            return;
        }
        qrPlaceholder.style.display = 'none';
        qrCanvas.style.display = 'block';
    });
    
    if (qrCheckInterval) clearInterval(qrCheckInterval);
    if (QR_POLLING_INTERVAL) clearInterval(QR_POLLING_INTERVAL);
    
    QR_POLLING_INTERVAL = setInterval(async () => {
        const { data } = await supabaseClient
            .from('qr_codes')
            .select('*')
            .eq('code', currentQrToken)
            .eq('used', true)
            .single();
        
        if (data) {
            const { data: session } = await supabaseClient
                .from('sessions')
                .select('*')
                .eq('qr_code', currentQrToken)
                .single();
            
            if (session) {
                const { data: user } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('phone', session.user_phone)
                    .single();
                
                if (user) {
                    CURRENT_USER = user;
                    CURRENT_SESSION_TOKEN = generateSessionToken();
                    saveSession(CURRENT_USER);
                    await saveSessionToDB();
                    await loadUserSettings();
                    await loadUserTheme();
                    
                    authScreen.style.display = 'none';
                    app.style.display = 'flex';
                    if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
                    
                    ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
                    if (ADMIN_RIGHTS || isOwner()) {
                        if (adminButton) adminButton.style.display = 'block';
                    }
                    
                    stopQrLogin();
                    loadChats();
                    loadGroups();
                }
            }
        }
    }, 2000);
    
    qrCheckInterval = setInterval(() => {
        if (qrLoginForm.style.display === 'block') {
            stopQrLogin();
            startQrLogin();
        }
    }, 2 * 60 * 1000);
}

function stopQrLogin() {
    if (QR_POLLING_INTERVAL) {
        clearInterval(QR_POLLING_INTERVAL);
        QR_POLLING_INTERVAL = null;
    }
    if (qrCheckInterval) {
        clearInterval(qrCheckInterval);
        qrCheckInterval = null;
    }
}

// ==================== СКАНИРОВАНИЕ QR ====================
let scanning = false;
let videoStream = null;

window.startQrScanning = async function() {
    if (!qrScanModal || !qrVideo) return;
    
    qrScanModal.style.display = 'flex';
    
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } 
        });
        qrVideo.srcObject = videoStream;
        qrVideo.setAttribute('playsinline', true);
        qrVideo.play();
        
        scanning = true;
        requestAnimationFrame(scanQrFrame);
    } catch (e) {
        alert('❌ Не удалось получить доступ к камере');
        qrScanModal.style.display = 'none';
    }
};

function scanQrFrame() {
    if (!scanning || !qrVideo) return;
    
    if (qrVideo.readyState === qrVideo.HAVE_ENOUGH_DATA) {
        const canvas = document.createElement('canvas');
        canvas.width = qrVideo.videoWidth;
        canvas.height = qrVideo.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(qrVideo, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        
        if (code) {
            processScannedQr(code.data);
        }
    }
    
    requestAnimationFrame(scanQrFrame);
}

async function processScannedQr(qrData) {
    if (!qrData.startsWith('qr_')) return;
    
    scanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    qrScanModal.style.display = 'none';
    
    const { data: qr } = await supabaseClient
        .from('qr_codes')
        .select('*')
        .eq('code', qrData)
        .eq('used', false)
        .single();
    
    if (!qr) {
        alert('❌ Недействительный или просроченный QR-код');
        return;
    }
    
    if (new Date(qr.expires_at) < new Date()) {
        alert('❌ QR-код истёк');
        return;
    }
    
    const deviceInfo = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? '📱 Мобильное' : '💻 Компьютер';
    qrConfirmDevice.textContent = `Устройство: ${deviceInfo}`;
    qrConfirmLocation.textContent = `IP: 0.0.0.0 • ${new Date().toLocaleString()}`;
    
    qrConfirmModal.style.display = 'flex';
    
    qrConfirmYes.onclick = async () => {
        const newToken = generateSessionToken();
        await supabaseClient
            .from('sessions')
            .insert([{
                user_phone: CURRENT_USER.phone,
                device_name: deviceInfo,
                device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                ip: '0.0.0.0',
                session_token: newToken,
                is_current: true,
                qr_code: qrData
            }]);
        
        await supabaseClient
            .from('qr_codes')
            .update({ used: true, user_phone: CURRENT_USER.phone })
            .eq('code', qrData);
        
        qrConfirmModal.style.display = 'none';
        alert('✅ Вход подтверждён!');
    };
    
    qrConfirmNo.onclick = () => {
        qrConfirmModal.style.display = 'none';
        alert('❌ Вход отклонён');
    };
}

if (closeQrScan) {
    closeQrScan.addEventListener('click', () => {
        scanning = false;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        qrScanModal.style.display = 'none';
    });
}

if (stopQrScan) {
    stopQrScan.addEventListener('click', () => {
        scanning = false;
        if (videoStream) {
            videoStream.getTracks().forEach(track => track.stop());
        }
        qrScanModal.style.display = 'none';
    });
}

// ==================== ВХОД ЧЕРЕЗ GOOGLE ====================
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', () => {
        alert('🔐 Вход через Google будет доступен в ближайшее время!');
    });
}

// ==================== ЗАГРУЗКА НАСТРОЕК ====================
async function loadUserSettings() {
    if (!CURRENT_USER) return;
    
    const { data } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('phone', CURRENT_USER.phone)
        .single();
    
    if (data) {
        CURRENT_USER.username = data.username;
        CURRENT_USER.privacy_settings = data.privacy_settings || {
            show_phone: 'everyone',
            who_can_write: 'everyone',
            last_seen: 'everyone'
        };
        
        if (currentUserName) currentUserName.textContent = data.username || CURRENT_USER.phone;
        if (currentUserUsername) currentUserUsername.textContent = data.username ? '@' + data.username : '';
    }
}

// ==================== ЗАГРУЗКА ПРАВ АДМИНА ====================
async function loadAdminRights(phone) {
    const { data } = await supabaseClient
        .from('admins')
        .select('*')
        .eq('phone', phone)
        .single();
    return data;
}

// ==================== СОХРАНЕНИЕ СЕССИИ ====================
async function saveSessionToDB() {
    if (!CURRENT_USER || !CURRENT_SESSION_TOKEN) return;
    
    const deviceInfo = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? '📱 Мобильное' : '💻 Компьютер';
    
    try {
        await supabaseClient
            .from('sessions')
            .update({ is_current: false })
            .eq('user_phone', CURRENT_USER.phone);
        
        await supabaseClient
            .from('sessions')
            .insert([{
                user_phone: CURRENT_USER.phone,
                device_name: deviceInfo,
                device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                ip: '0.0.0.0',
                session_token: CURRENT_SESSION_TOKEN,
                is_current: true
            }]);
    } catch (e) {
        console.error('Ошибка сохранения сессии:', e);
    }
}

// ==================== ЗАГРУЗКА УСТРОЙСТВ ====================
async function loadSessions() {
    if (!devicesList || !CURRENT_USER) return;
    
    try {
        const { data: sessions, error } = await supabaseClient
            .from('sessions')
            .select('*')
            .eq('user_phone', CURRENT_USER.phone)
            .order('last_active', { ascending: false });
        
        if (error) throw error;
        
        if (!sessions?.length) {
            devicesList.innerHTML = '<p class="no-data">Нет активных сессий</p>';
            return;
        }
        
        devicesList.innerHTML = sessions.map(s => `
            <div class="device-item">
                <div class="device-info">
                    <span class="device-name">${s.device_name || 'Неизвестное устройство'}</span>
                    <span class="device-details">IP: ${s.ip || '0.0.0.0'} • Последняя активность: ${new Date(s.last_active).toLocaleString()}</span>
                    ${s.qr_code ? '<span class="device-qr">🔓 Вход по QR</span>' : ''}
                </div>
                ${s.is_current ? '<span class="device-current">Текущее устройство</span>' : 
                  `<button class="terminate-btn" onclick="terminateSession('${s.session_token}')">Завершить</button>`}
            </div>
        `).join('');
    } catch (e) {
        console.error('Ошибка загрузки сессий:', e);
    }
}

window.terminateSession = async function(token) {
    if (!confirm('Завершить эту сессию?')) return;
    
    try {
        await supabaseClient
            .from('sessions')
            .delete()
            .eq('session_token', token);
        
        loadSessions();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
};

if (terminateAllSessions) {
    terminateAllSessions.addEventListener('click', async () => {
        if (!CURRENT_USER) return;
        if (!confirm('Вы уверены? Это завершит все сессии, кроме текущей.')) return;
        
        try {
            await supabaseClient
                .from('sessions')
                .delete()
                .eq('user_phone', CURRENT_USER.phone)
                .neq('session_token', CURRENT_SESSION_TOKEN);
            
            loadSessions();
            alert('✅ Все остальные сессии завершены');
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== ВХОД ====================
if (loginButton) {
    loginButton.addEventListener('click', async () => {
        const phone = formatPhone(loginPhone.value);
        const pass = loginPassword.value;
        
        if (!phone || !pass) { 
            authMessage.textContent = '❌ Введите номер и пароль'; 
            return; 
        }
        
        try {
            const { data: users, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('phone', phone)
                .eq('password', pass);
            
            if (error) throw error;
            
            if (!users || users.length === 0) { 
                authMessage.textContent = '❌ Неверный номер или пароль'; 
                return; 
            }
            
            CURRENT_USER = users[0];
            CURRENT_SESSION_TOKEN = generateSessionToken();
            saveSession(CURRENT_USER);
            
            await saveSessionToDB();
            await loadUserSettings();
            await loadUserTheme();
            
            ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
            
            authScreen.style.display = 'none';
            app.style.display = 'flex';
            if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
            
            if (ADMIN_RIGHTS || isOwner()) {
                if (adminButton) adminButton.style.display = 'block';
            }
            
            loadChats();
            loadGroups();
            
        } catch (e) { 
            authMessage.textContent = '❌ Ошибка входа: ' + e.message; 
        }
    });
}

// ==================== РЕГИСТРАЦИЯ ====================
if (registerButton) {
    registerButton.addEventListener('click', async () => {
        const phone = formatPhone(registerPhone.value);
        const username = registerUsername.value.trim().toLowerCase();
        const pass = registerPassword.value;
        const confirm = registerPasswordConfirm.value;
        
        const termsCheckbox = document.getElementById('termsCheckbox');
        if (!termsCheckbox || !termsCheckbox.checked) {
            authMessage.textContent = '❌ Необходимо принять условия';
            return;
        }
        
        if (!phone || !username || !pass || !confirm) {
            authMessage.textContent = '❌ Заполните все поля';
            return;
        }
        
        if (!validateUsername(username)) {
            authMessage.textContent = '❌ Username может содержать только a-z, 0-9 и _';
            return;
        }
        
        if (pass !== confirm) {
            authMessage.textContent = '❌ Пароли не совпадают';
            return;
        }
        
        if (pass.length < 4) {
            authMessage.textContent = '❌ Пароль минимум 4 символа';
            return;
        }
        
        try {
            const { data: existingPhone } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('phone', phone);
            
            if (existingPhone?.length) {
                authMessage.textContent = '❌ Номер уже зарегистрирован';
                return;
            }
            
            const { data: existingUsername } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('username', username);
            
            if (existingUsername?.length) {
                authMessage.textContent = '❌ Username уже занят';
                return;
            }
            
            await supabaseClient.from('profiles').insert([{ 
                phone, 
                username,
                password: pass,
                theme: 'dark',
                privacy_settings: {
                    show_phone: 'everyone',
                    who_can_write: 'everyone',
                    last_seen: 'everyone'
                }
            }]);
            
            authMessage.textContent = '✅ Регистрация успешна! Войдите.';
            authMessage.style.color = '#4caf50';
            
            registerPhone.value = '';
            registerUsername.value = '';
            registerPassword.value = '';
            registerPasswordConfirm.value = '';
            if (termsCheckbox) termsCheckbox.checked = false;
            
            setTimeout(() => {
                if (backToLoginButton) backToLoginButton.click();
                authMessage.textContent = '';
                authMessage.style.color = '#ff4444';
            }, 2000);
        } catch (e) {
            authMessage.textContent = '❌ Ошибка: ' + e.message;
        }
    });
}

// ==================== ПОИСК ====================
if (searchButton) {
    searchButton.addEventListener('click', searchUsers);
}
if (searchInput) {
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && searchUsers());
}

function getSelectedSearchType() {
    for (const radio of searchTypeRadios) {
        if (radio.checked) return radio.value;
    }
    return 'all';
}

async function searchUsers() {
    if (!searchInput || !searchResultsList || !CURRENT_USER) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    const searchType = getSelectedSearchType();
    
    try {
        let dbQuery = supabaseClient
            .from('profiles')
            .select('*')
            .neq('phone', CURRENT_USER.phone);
        
        if (searchType === 'phone') {
            const formattedQuery = formatPhone(query);
            dbQuery = dbQuery.ilike('phone', `%${formattedQuery.slice(-10)}%`);
        } else if (searchType === 'username') {
            dbQuery = dbQuery.ilike('username', `%${query}%`);
        } else {
            const formattedQuery = formatPhone(query);
            dbQuery = dbQuery.or(
                `phone.ilike.%${formattedQuery.slice(-10)}%,username.ilike.%${query}%`
            );
        }
        
        const { data: users, error } = await dbQuery;
        
        if (error) throw error;
        
        if (!users?.length) {
            searchResultsList.innerHTML = '<p class="no-data">Пользователи не найдены</p>';
        } else {
            searchResultsList.innerHTML = users.map(u => `
                <div class="search-result-item" onclick="startChat('${u.phone}')">
                    <div class="search-result-avatar">👤</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${u.username || u.phone}</div>
                        ${u.username ? `<div class="search-result-username">@${u.username}</div>` : ''}
                        <div class="search-result-phone">${u.phone}</div>
                    </div>
                    <div class="search-result-add">+</div>
                </div>
            `).join('');
        }
        
        if (searchResults) searchResults.style.display = 'block';
    } catch (e) {
        console.error('Ошибка поиска:', e);
    }
}

if (closeSearch) {
    closeSearch.addEventListener('click', () => {
        if (searchResults) searchResults.style.display = 'none';
    });
}

// ==================== ВКЛАДКИ ЧАТЫ/ГРУППЫ ====================
if (chatsTabBtn) {
    chatsTabBtn.addEventListener('click', () => {
        chatsTabBtn.classList.add('active');
        groupsTabBtn.classList.remove('active');
        chatsList.style.display = 'block';
        groupsList.style.display = 'none';
    });
}

if (groupsTabBtn) {
    groupsTabBtn.addEventListener('click', () => {
        groupsTabBtn.classList.add('active');
        chatsTabBtn.classList.remove('active');
        chatsList.style.display = 'none';
        groupsList.style.display = 'block';
        loadGroups();
    });
}

// ==================== ЛИЧНЫЕ ЧАТЫ ====================
window.startChat = async function(phone) {
    if (!searchResults || !searchInput || !welcomeScreen || !chatWindow) return;
    
    searchResults.style.display = 'none';
    searchInput.value = '';
    CURRENT_GROUP = null;
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').eq('phone', phone);
        if (!users?.length) return;
        CURRENT_CHAT = users[0];
        
        const chatName = document.getElementById('currentChatName');
        const chatPhone = document.getElementById('currentChatPhone');
        const chatUsername = document.getElementById('currentChatUsername');
        
        if (chatName) chatName.textContent = CURRENT_CHAT.username || CURRENT_CHAT.phone;
        if (chatPhone) chatPhone.textContent = CURRENT_CHAT.phone;
        if (chatUsername) chatUsername.textContent = CURRENT_CHAT.username ? '@' + CURRENT_CHAT.username : '';
        
        welcomeScreen.style.display = 'none';
        chatWindow.style.display = 'flex';
        loadMessages(phone);
        loadPinnedMessages('private', phone);
    } catch (e) { console.error(e); }
};

async function loadMessages(chatPhone) {
    if (!CURRENT_USER || !messagesArea) return;
    
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .or(`sender.eq.${chatPhone},receiver.eq.${chatPhone}`)
            .order('created_at', { ascending: false });
        if (error) throw error;
        
        if (!messages?.length) {
            messagesArea.innerHTML = '<div class="message received">Начните общение</div>';
        } else {
            messagesArea.innerHTML = messages.map(m => {
                const isSent = m.sender === CURRENT_USER.phone;
                
                // Голосовое сообщение
                if (m.voice_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} voice-message" 
                         data-id="${m.id}" 
                         data-type="private"
                         onclick="playVoiceMessage('${m.voice_data}')">
                        <span>🎤</span>
                        <div class="voice-waveform">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <span class="voice-duration">${formatDuration(m.voice_duration)}</span>
                    </div>`;
                }
                
                // Кружочек
                if (m.circle_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} video-circle-message" 
                         data-id="${m.id}" 
                         data-type="private"
                         onclick="playCircleMessage('${m.circle_data}')">
                        <video src="${m.circle_data}" style="display:none;"></video>
                        <span class="play-icon">▶️</span>
                        <span class="voice-duration" style="position:absolute;bottom:5px;right:5px;">${formatDuration(m.circle_duration)}</span>
                    </div>`;
                }
                
                // Обычное сообщение с закреплением
                return `
                <div class="message ${isSent ? 'sent' : 'received'} ${m.pinned ? 'pinned' : ''}" 
                     data-id="${m.id}" 
                     data-type="private"
                     onclick="selectMessage(this, '${m.id}', 'private')">
                    ${m.pinned ? '<span class="pinned-badge">📌</span>' : ''}
                    <div class="message-content">${m.content}</div>
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>`;
            }).join('');
        }
    } catch (e) { console.error(e); }
}

// ==================== ГРУППЫ ====================
window.openGroup = async function(groupId) {
    if (!GROUPS || !welcomeScreen || !chatWindow) return;
    
    CURRENT_CHAT = null;
    CURRENT_GROUP = GROUPS.find(g => g.id === groupId);
    
    const chatName = document.getElementById('currentChatName');
    const chatPhone = document.getElementById('currentChatPhone');
    const chatUsername = document.getElementById('currentChatUsername');
    
    if (chatName) chatName.textContent = CURRENT_GROUP.name;
    if (chatPhone) chatPhone.textContent = 'Группа';
    if (chatUsername) chatUsername.textContent = '';
    
    welcomeScreen.style.display = 'none';
    chatWindow.style.display = 'flex';
    loadGroupMessages(groupId);
    loadPinnedMessages('group', groupId);
};

async function loadGroupMessages(groupId) {
    if (!CURRENT_USER || !messagesArea) return;
    
    try {
        const { data: messages, error } = await supabaseClient
            .from('group_messages')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        
        if (!messages?.length) {
            messagesArea.innerHTML = '<div class="message received">Начните общение в группе</div>';
        } else {
            const senderPhones = [...new Set(messages.map(m => m.sender))];
            const { data: profiles } = await supabaseClient
                .from('profiles')
                .select('phone, username')
                .in('phone', senderPhones);
            
            const senderNames = {};
            profiles?.forEach(p => {
                senderNames[p.phone] = p.username || p.phone;
            });
            
            messagesArea.innerHTML = messages.map(m => {
                const isSent = m.sender === CURRENT_USER.phone;
                const senderName = isSent ? 'Вы' : (senderNames[m.sender] || m.sender);
                
                // Голосовое сообщение
                if (m.voice_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} voice-message" 
                         data-id="${m.id}" 
                         data-type="group"
                         onclick="playVoiceMessage('${m.voice_data}')">
                        <span>🎤</span>
                        <div class="voice-waveform">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <span class="voice-duration">${formatDuration(m.voice_duration)}</span>
                    </div>`;
                }
                
                // Кружочек
                if (m.circle_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} video-circle-message" 
                         data-id="${m.id}" 
                         data-type="group"
                         onclick="playCircleMessage('${m.circle_data}')">
                        <video src="${m.circle_data}" style="display:none;"></video>
                        <span class="play-icon">▶️</span>
                        <span class="voice-duration" style="position:absolute;bottom:5px;right:5px;">${formatDuration(m.circle_duration)}</span>
                    </div>`;
                }
                
                // Обычное сообщение с закреплением
                return `
                <div class="message ${isSent ? 'sent' : 'received'} ${m.pinned ? 'pinned' : ''}"
                     data-id="${m.id}"
                     data-type="group"
                     onclick="selectMessage(this, '${m.id}', 'group')">
                    ${!isSent ? `<div class="message-sender">${senderName}</div>` : ''}
                    ${m.pinned ? '<span class="pinned-badge">📌</span>' : ''}
                    <div class="message-content">${m.content}</div>
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>`;
            }).join('');
        }
    } catch (e) { console.error(e); }
}

// ==================== ЗАКРЕПЛЁННЫЕ СООБЩЕНИЯ ====================
async function loadPinnedMessages(type, id) {
    if (!pinnedMessages || !CURRENT_USER) return;
    
    try {
        let query;
        if (type === 'private') {
            query = await supabaseClient
                .from('messages')
                .select('*')
                .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
                .or(`sender.eq.${id},receiver.eq.${id}`)
                .eq('pinned', true)
                .order('created_at', { ascending: false })
                .limit(3);
        } else {
            query = await supabaseClient
                .from('group_messages')
                .select('*')
                .eq('group_id', id)
                .eq('pinned', true)
                .order('created_at', { ascending: false })
                .limit(3);
        }
        
        const { data: messages } = query;
        
        if (!messages?.length) {
            pinnedMessages.innerHTML = '';
            return;
        }
        
        pinnedMessages.innerHTML = messages.map(m => `
            <div class="pinned-message" onclick="jumpToMessage('${m.id}')">
                <span>📌 ${m.content.slice(0, 30)}${m.content.length > 30 ? '...' : ''}</span>
                <span class="pinned-close" onclick="event.stopPropagation(); unpinMessage('${m.id}', '${type}')">✕</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

window.jumpToMessage = function(messageId) {
    const messageElement = document.querySelector(`[data-id="${messageId}"]`);
    if (messageElement) {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        messageElement.style.animation = 'highlight 2s';
        setTimeout(() => {
            messageElement.style.animation = '';
        }, 2000);
    }
};

window.unpinMessage = async function(messageId, type) {
    if (!confirm('Открепить сообщение?')) return;
    
    try {
        if (type === 'private') {
            await supabaseClient.from('messages').update({ pinned: false }).eq('id', messageId);
            if (CURRENT_CHAT) {
                loadMessages(CURRENT_CHAT.phone);
                loadPinnedMessages('private', CURRENT_CHAT.phone);
            }
        } else {
            await supabaseClient.from('group_messages').update({ pinned: false }).eq('id', messageId);
            if (CURRENT_GROUP) {
                loadGroupMessages(CURRENT_GROUP.id);
                loadPinnedMessages('group', CURRENT_GROUP.id);
            }
        }
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
};

// ==================== ВЫБОР СООБЩЕНИЯ ====================
window.selectMessage = function(element, id, type) {
    document.querySelectorAll('.message').forEach(m => m.classList.remove('selected'));
    element.classList.add('selected');
    selectedMessageId = id;
    selectedMessageType = type;
    
    const menu = document.getElementById('messageMenu');
    if (menu && event) {
        menu.style.display = 'block';
        menu.style.left = (event.pageX) + 'px';
        menu.style.top = (event.pageY) + 'px';
    }
};

// ==================== УДАЛЕНИЕ СООБЩЕНИЯ ====================
if (deleteMessageBtn) {
    deleteMessageBtn.addEventListener('click', async () => {
        if (!selectedMessageId) return;
        
        if (!confirm('Удалить сообщение?')) return;
        
        try {
            if (selectedMessageType === 'private') {
                await supabaseClient.from('messages').delete().eq('id', selectedMessageId);
                if (CURRENT_CHAT) {
                    loadMessages(CURRENT_CHAT.phone);
                    loadPinnedMessages('private', CURRENT_CHAT.phone);
                }
            } else {
                await supabaseClient.from('group_messages').delete().eq('id', selectedMessageId);
                if (CURRENT_GROUP) {
                    loadGroupMessages(CURRENT_GROUP.id);
                    loadPinnedMessages('group', CURRENT_GROUP.id);
                }
            }
            if (messageMenu) messageMenu.style.display = 'none';
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== ЗАКРЕПЛЕНИЕ СООБЩЕНИЯ ====================
if (pinMessageBtn) {
    pinMessageBtn.addEventListener('click', async () => {
        if (!selectedMessageId) return;
        
        try {
            if (selectedMessageType === 'private') {
                await supabaseClient.from('messages').update({ pinned: true }).eq('id', selectedMessageId);
                if (CURRENT_CHAT) {
                    loadMessages(CURRENT_CHAT.phone);
                    loadPinnedMessages('private', CURRENT_CHAT.phone);
                }
            } else {
                await supabaseClient.from('group_messages').update({ pinned: true }).eq('id', selectedMessageId);
                if (CURRENT_GROUP) {
                    loadGroupMessages(CURRENT_GROUP.id);
                    loadPinnedMessages('group', CURRENT_GROUP.id);
                }
            }
            if (messageMenu) messageMenu.style.display = 'none';
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== ЗАГРУЗКА ЧАТОВ ====================
async function loadChats() {
    if (!CURRENT_USER || !chatsList) return;
    
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        
        const chats = new Map();
        
        const otherPhones = [...new Set(messages.map(m => 
            m.sender === CURRENT_USER.phone ? m.receiver : m.sender
        ))];
        
        const { data: profiles } = await supabaseClient
            .from('profiles')
            .select('phone, username')
            .in('phone', otherPhones);
        
        const chatNames = {};
        profiles?.forEach(p => {
            chatNames[p.phone] = {
                name: p.username || p.phone,
                username: p.username
            };
        });
        
        messages.forEach(m => {
            const other = m.sender === CURRENT_USER.phone ? m.receiver : m.sender;
            if (!chats.has(other) || new Date(m.created_at) > new Date(chats.get(other).lastMessageTime)) {
                chats.set(other, { 
                    phone: other, 
                    name: chatNames[other]?.name || other,
                    username: chatNames[other]?.username,
                    lastMessage: m.content, 
                    lastMessageTime: m.created_at 
                });
            }
        });
        
        if (!chats.size) {
            chatsList.innerHTML = '<div class="chat-item">Найдите контакт через поиск</div>';
        } else {
            chatsList.innerHTML = Array.from(chats.values()).map(c => `
                <div class="chat-item" onclick="startChat('${c.phone}')">
                    <span class="chat-name">${c.name}</span>
                    ${c.username ? `<span class="chat-username">@${c.username}</span>` : ''}
                    <span class="chat-preview">${c.lastMessage.slice(0, 30)}...</span>
                </div>
            `).join('');
        }
    } catch (e) { console.error(e); }
}

// ==================== ЗАГРУЗКА ГРУПП ====================
async function loadGroups() {
    if (!CURRENT_USER || !groupsList) return;
    
    try {
        const { data: memberships } = await supabaseClient
            .from('group_members')
            .select('group_id')
            .eq('user_phone', CURRENT_USER.phone);
        
        if (!memberships?.length) {
            groupsList.innerHTML = '<div class="group-item">Нет групп</div>';
            return;
        }
        
        const groupIds = memberships.map(m => m.group_id);
        const { data: groups } = await supabaseClient
            .from('groups')
            .select('*')
            .in('id', groupIds)
            .order('created_at', { ascending: false });
        
        GROUPS = groups || [];
        groupsList.innerHTML = GROUPS.map(g => `
            <div class="group-item" onclick="openGroup(${g.id})">
                <span class="group-name">${g.name}</span>
                <span class="group-preview">${g.description || 'Группа'}</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

// ==================== СОЗДАНИЕ ГРУППЫ ====================
if (createGroupBtn) {
    createGroupBtn.addEventListener('click', async () => {
        if (!groupModal) return;
        groupModal.style.display = 'flex';
        await loadAvailableUsers();
    });
}

if (closeGroupModal) {
    closeGroupModal.addEventListener('click', () => {
        if (!groupModal) return;
        groupModal.style.display = 'none';
        if (groupName) groupName.value = '';
        if (groupDescription) groupDescription.value = '';
        selectedMembers = [];
    });
}

async function loadAvailableUsers() {
    if (!availableUsers || !CURRENT_USER) return;
    
    try {
        const { data: users } = await supabaseClient
            .from('profiles')
            .select('*')
            .neq('phone', CURRENT_USER.phone);
        
        availableUsers.innerHTML = users?.map(u => `
            <div class="group-member-item" onclick="toggleSelect('${u.phone}')">
                <span>${u.username || u.phone}</span>
            </div>
        `).join('') || '<p>Нет пользователей</p>';
    } catch (e) { console.error(e); }
}

window.toggleSelect = function(phone) {
    const index = selectedMembers.indexOf(phone);
    if (index === -1) selectedMembers.push(phone);
    else selectedMembers.splice(index, 1);
    
    document.querySelectorAll('.group-member-item').forEach(el => {
        if (selectedMembers.some(s => el.textContent.includes(s))) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
};

if (createGroupFinal) {
    createGroupFinal.addEventListener('click', async () => {
        if (!groupName) return;
        
        const name = groupName.value.trim();
        const desc = groupDescription ? groupDescription.value.trim() : '';
        if (!name) { alert('Введите название группы'); return; }
        if (!selectedMembers.length) { alert('Выберите участников'); return; }
        
        try {
            const { data: group, error } = await supabaseClient
                .from('groups')
                .insert([{ name, description: desc, created_by: CURRENT_USER.phone }])
                .select();
            
            if (error) throw error;
            
            const groupId = group[0].id;
            
            await supabaseClient.from('group_members').insert([
                { group_id: groupId, user_phone: CURRENT_USER.phone, role: 'creator' }
            ]);
            
            const members = selectedMembers.map(phone => ({
                group_id: groupId,
                user_phone: phone,
                role: 'member'
            }));
            await supabaseClient.from('group_members').insert(members);
            
            alert('✅ Группа создана!');
            if (groupModal) groupModal.style.display = 'none';
            if (groupName) groupName.value = '';
            if (groupDescription) groupDescription.value = '';
            selectedMembers = [];
            loadGroups();
            if (groupsTabBtn) groupsTabBtn.click();
        } catch (e) {
            console.error(e);
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== ОТПРАВКА СООБЩЕНИЙ ====================
if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}
if (messageInput) {
    messageInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
}

async function sendMessage() {
    if (!messageInput) return;
    
    const content = messageInput.value.trim();
    if (!content) return;
    
    try {
        if (CURRENT_GROUP) {
            await supabaseClient.from('group_messages').insert([{
                group_id: CURRENT_GROUP.id,
                sender: CURRENT_USER.phone,
                content
            }]);
            messageInput.value = '';
            loadGroupMessages(CURRENT_GROUP.id);
        } else if (CURRENT_CHAT) {
            await supabaseClient.from('messages').insert([{
                sender: CURRENT_USER.phone,
                receiver: CURRENT_CHAT.phone,
                content
            }]);
            messageInput.value = '';
            loadMessages(CURRENT_CHAT.phone);
            loadChats();
        }
    } catch (e) {
        console.error('Ошибка отправки:', e);
        alert('❌ Ошибка: ' + e.message);
    }
}

// ==================== ЭМОДЗИ ====================
if (emojiBtn) {
    emojiBtn.addEventListener('click', () => {
        if (!emojiPanel) return;
        emojiPanel.style.display = emojiPanel.style.display === 'none' ? 'grid' : 'none';
    });
}

window.insertEmoji = function(emoji) {
    if (!messageInput) return;
    messageInput.value += emoji;
    messageInput.focus();
    if (emojiPanel) emojiPanel.style.display = 'none';
};

// ==================== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ПРОФИЛЕ ====================
if (profileTabs && profileTabContents) {
    profileTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            profileTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            profileTabContents.forEach(c => c.classList.remove('active'));
            const tabName = tab.dataset.profileTab;
            const content = document.getElementById(`profile${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
            if (content) content.classList.add('active');
            
            if (tabName === 'devices') {
                loadSessions();
            } else if (tabName === 'privacy') {
                loadPrivacySettings();
            } else if (tabName === 'themes') {
                const currentTheme = CURRENT_USER?.theme || 'dark';
                document.querySelectorAll('.theme-check').forEach(check => check.style.opacity = '0');
                const checkEl = document.getElementById(`check-${currentTheme}`);
                if (checkEl) checkEl.style.opacity = '1';
            }
        });
    });
}

// ==================== ЗАГРУЗКА НАСТРОЕК ПРИВАТНОСТИ ====================
function loadPrivacySettings() {
    if (!CURRENT_USER) return;
    
    const settings = CURRENT_USER.privacy_settings || {
        show_phone: 'everyone',
        who_can_write: 'everyone',
        last_seen: 'everyone'
    };
    
    showPhoneRadios.forEach(r => {
        if (r.value === settings.show_phone) r.checked = true;
    });
    
    whoCanWriteRadios.forEach(r => {
        if (r.value === settings.who_can_write) r.checked = true;
    });
    
    lastSeenRadios.forEach(r => {
        if (r.value === settings.last_seen) r.checked = true;
    });
}

// ==================== СОХРАНЕНИЕ НАСТРОЕК ПРИВАТНОСТИ ====================
if (savePrivacyBtn) {
    savePrivacyBtn.addEventListener('click', async () => {
        if (!CURRENT_USER) return;
        
        let showPhone = 'everyone';
        let whoCanWrite = 'everyone';
        let lastSeen = 'everyone';
        
        for (const r of showPhoneRadios) if (r.checked) showPhone = r.value;
        for (const r of whoCanWriteRadios) if (r.checked) whoCanWrite = r.value;
        for (const r of lastSeenRadios) if (r.checked) lastSeen = r.value;
        
        const privacySettings = {
            show_phone: showPhone,
            who_can_write: whoCanWrite,
            last_seen: lastSeen
        };
        
        try {
            await supabaseClient
                .from('profiles')
                .update({ privacy_settings: privacySettings })
                .eq('phone', CURRENT_USER.phone);
            
            CURRENT_USER.privacy_settings = privacySettings;
            alert('✅ Настройки приватности сохранены');
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== НАСТРОЙКИ ПРОФИЛЯ ====================
if (userProfile) {
    userProfile.addEventListener('click', () => {
        if (!profileModal || !CURRENT_USER) return;
        
        profileModal.style.display = 'flex';
        if (profileDisplayName) profileDisplayName.value = CURRENT_USER.username || '';
        if (profileUsername) profileUsername.value = CURRENT_USER.username || '';
        if (profilePhone) profilePhone.value = CURRENT_USER.phone;
        loadPrivacySettings();
    });
}

if (closeProfileModal) {
    closeProfileModal.addEventListener('click', () => {
        if (profileModal) profileModal.style.display = 'none';
    });
}

if (saveProfileBtn) {
    saveProfileBtn.addEventListener('click', async () => {
        if (!CURRENT_USER || !profileUsername) return;
        
        const newUsername = profileUsername.value.trim().toLowerCase();
        
        if (!validateUsername(newUsername)) {
            alert('❌ Username может содержать только a-z, 0-9 и _');
            return;
        }
        
        try {
            const { data: existing } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('username', newUsername)
                .neq('phone', CURRENT_USER.phone);
            
            if (existing?.length) {
                alert('❌ Username уже занят');
                return;
            }
            
            await supabaseClient
                .from('profiles')
                .update({ username: newUsername })
                .eq('phone', CURRENT_USER.phone);
            
            CURRENT_USER.username = newUsername;
            if (currentUserName) currentUserName.textContent = newUsername || CURRENT_USER.phone;
            if (currentUserUsername) currentUserUsername.textContent = newUsername ? '@' + newUsername : '';
            
            if (profileModal) profileModal.style.display = 'none';
            alert('✅ Профиль обновлён');
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// ==================== ТЕМЫ ====================
async function loadUserTheme() {
    if (!CURRENT_USER) return;
    
    const { data } = await supabaseClient
        .from('profiles')
        .select('theme')
        .eq('phone', CURRENT_USER.phone)
        .single();
    
    if (data?.theme) {
        applyTheme(data.theme);
    } else {
        applyTheme('dark');
    }
}

function applyTheme(theme) {
    document.body.classList.remove('light-theme', 'dark-theme', 'forest-theme');
    document.body.classList.add(`${theme}-theme`);
    
    document.querySelectorAll('.theme-check').forEach(check => check.style.opacity = '0');
    const checkEl = document.getElementById(`check-${theme}`);
    if (checkEl) checkEl.style.opacity = '1';
    
    if (theme === 'forest') {
        startForestAnimations();
    } else {
        stopForestAnimations();
    }
    
    if (CURRENT_USER) {
        CURRENT_USER.theme = theme;
    }
}

window.setTheme = async function(theme) {
    applyTheme(theme);
    
    if (CURRENT_USER) {
        await supabaseClient
            .from('profiles')
            .update({ theme })
            .eq('phone', CURRENT_USER.phone);
    }
};

function startForestAnimations() {
    stopForestAnimations();
    
    leafInterval = setInterval(() => {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.textContent = ['🍃', '🍂', '🌿'][Math.floor(Math.random() * 3)];
        leaf.style.left = Math.random() * 100 + '%';
        leaf.style.fontSize = (15 + Math.random() * 15) + 'px';
        leaf.style.animationDuration = (3 + Math.random() * 4) + 's';
        leaf.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(leaf);
        
        setTimeout(() => leaf.remove(), 10000);
    }, 300);
    
    rainInterval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
            const drop = document.createElement('div');
            drop.className = 'raindrop';
            drop.style.left = Math.random() * 100 + '%';
            drop.style.animationDuration = (0.5 + Math.random()) + 's';
            drop.style.animationDelay = Math.random() + 's';
            drop.style.opacity = 0.3 + Math.random() * 0.3;
            document.body.appendChild(drop);
            
            setTimeout(() => drop.remove(), 2000);
        }
    }, 100);
}

function stopForestAnimations() {
    if (leafInterval) clearInterval(leafInterval);
    if (rainInterval) clearInterval(rainInterval);
    
    document.querySelectorAll('.leaf, .raindrop').forEach(el => el.remove());
}

// ==================== ЗВОНКИ (УПРОЩЁННЫЕ) ====================
if (audioCallBtn) {
    audioCallBtn.addEventListener('click', () => {
        if (!CURRENT_CHAT) {
            alert('Сначала выберите чат');
            return;
        }
        
        if (CURRENT_CHAT.phone === CURRENT_USER.phone) {
            alert('Нельзя позвонить самому себе');
            return;
        }
        
        alert('📞 Функция звонков в разработке');
    });
}

if (videoCallBtn) {
    videoCallBtn.addEventListener('click', () => {
        if (!CURRENT_CHAT) {
            alert('Сначала выберите чат');
            return;
        }
        
        if (CURRENT_CHAT.phone === CURRENT_USER.phone) {
            alert('Нельзя позвонить самому себе');
            return;
        }
        
        alert('📹 Функция видеозвонков в разработке');
    });
}

// ==================== ГОЛОСОВЫЕ СООБЩЕНИЯ ====================
let mediaRecorder = null;
let audioChunks = [];
let recordingTimer = null;
let recordingSeconds = 0;
let recordingIndicator = null;

if (voiceMsgBtn) {
    voiceMsgBtn.addEventListener('click', toggleVoiceRecording);
}

function toggleVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        stopVoiceRecording();
    } else {
        startVoiceRecording();
    }
}

async function startVoiceRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());
            
            if (audioChunks.length > 0) {
                await sendVoiceMessage();
            }
            
            removeRecordingIndicator();
        };
        
        mediaRecorder.start();
        
        showRecordingIndicator('voice');
        
        voiceMsgBtn.style.background = '#ff4444';
        voiceMsgBtn.style.transform = 'scale(1.2)';
        
        recordingSeconds = 0;
        if (recordingTimer) clearInterval(recordingTimer);
        recordingTimer = setInterval(() => {
            recordingSeconds++;
            const timer = document.querySelector('.recording-timer');
            if (timer) {
                const minutes = Math.floor(recordingSeconds / 60);
                const seconds = recordingSeconds % 60;
                timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
        
    } catch (error) {
        alert('❌ Не удалось получить доступ к микрофону');
    }
}

function stopVoiceRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        voiceMsgBtn.style.background = '';
        voiceMsgBtn.style.transform = '';
        if (recordingTimer) clearInterval(recordingTimer);
    }
}

async function sendVoiceMessage() {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    reader.onloadend = async () => {
        const base64data = reader.result;
        const duration = recordingSeconds;
        
        try {
            const messageData = {
                sender: CURRENT_USER.phone,
                content: '🎤 Голосовое сообщение',
                voice_data: base64data,
                voice_duration: duration,
                created_at: new Date()
            };
            
            if (CURRENT_GROUP) {
                messageData.group_id = CURRENT_GROUP.id;
                await supabaseClient.from('group_messages').insert([messageData]);
                loadGroupMessages(CURRENT_GROUP.id);
            } else if (CURRENT_CHAT) {
                messageData.receiver = CURRENT_CHAT.phone;
                await supabaseClient.from('messages').insert([messageData]);
                loadMessages(CURRENT_CHAT.phone);
                loadChats();
            }
            
            removeRecordingIndicator();
            voiceMsgBtn.style.background = '';
            voiceMsgBtn.style.transform = '';
            
        } catch (e) {
            alert('❌ Ошибка отправки: ' + e.message);
        }
    };
}

// ==================== КРУЖОЧКИ ====================
let circleRecorder = null;
let videoChunks = [];
let circleTimerInterval = null;
let circleSeconds = 0;

if (videoCircleBtn) {
    videoCircleBtn.addEventListener('click', toggleCircleRecording);
}

function toggleCircleRecording() {
    if (circleRecorder && circleRecorder.state === 'recording') {
        stopCircleRecording();
    } else {
        startCircleRecording();
    }
}

async function startCircleRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 300 },
                height: { ideal: 300 },
                aspectRatio: 1
            }, 
            audio: true 
        });
        
        circleRecorder = new MediaRecorder(stream);
        videoChunks = [];
        
        const previewVideo = document.createElement('video');
        previewVideo.srcObject = stream;
        previewVideo.autoplay = true;
        previewVideo.muted = true;
        previewVideo.style.position = 'fixed';
        previewVideo.style.bottom = '100px';
        previewVideo.style.right = '20px';
        previewVideo.style.width = '100px';
        previewVideo.style.height = '100px';
        previewVideo.style.borderRadius = '50%';
        previewVideo.style.border = '3px solid #e91e63';
        previewVideo.style.zIndex = '8000';
        previewVideo.style.objectFit = 'cover';
        previewVideo.id = 'circlePreview';
        document.body.appendChild(previewVideo);
        
        circleRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                videoChunks.push(e.data);
            }
        };
        
        circleRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());
            const preview = document.getElementById('circlePreview');
            if (preview) preview.remove();
            
            if (videoChunks.length > 0) {
                await sendCircleMessage();
            }
            
            removeRecordingIndicator();
        };
        
        circleRecorder.start();
        
        showRecordingIndicator('circle');
        
        videoCircleBtn.style.background = '#ff4444';
        videoCircleBtn.style.transform = 'scale(1.2)';
        
        circleSeconds = 0;
        if (circleTimerInterval) clearInterval(circleTimerInterval);
        circleTimerInterval = setInterval(() => {
            circleSeconds++;
            const timer = document.querySelector('.recording-timer');
            if (timer) {
                const minutes = Math.floor(circleSeconds / 60);
                const seconds = circleSeconds % 60;
                timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
        
    } catch (error) {
        alert('❌ Не удалось получить доступ к камере');
    }
}

function stopCircleRecording() {
    if (circleRecorder && circleRecorder.state === 'recording') {
        circleRecorder.stop();
        videoCircleBtn.style.background = '';
        videoCircleBtn.style.transform = '';
        if (circleTimerInterval) clearInterval(circleTimerInterval);
    }
}

async function sendCircleMessage() {
    const blob = new Blob(videoChunks, { type: 'video/webm' });
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    
    reader.onloadend = async () => {
        const base64data = reader.result;
        const duration = circleSeconds;
        
        try {
            const messageData = {
                sender: CURRENT_USER.phone,
                content: '⭕ Кружочек',
                circle_data: base64data,
                circle_duration: duration,
                created_at: new Date()
            };
            
            if (CURRENT_GROUP) {
                messageData.group_id = CURRENT_GROUP.id;
                await supabaseClient.from('group_messages').insert([messageData]);
                loadGroupMessages(CURRENT_GROUP.id);
            } else if (CURRENT_CHAT) {
                messageData.receiver = CURRENT_CHAT.phone;
                await supabaseClient.from('messages').insert([messageData]);
                loadMessages(CURRENT_CHAT.phone);
                loadChats();
            }
            
            removeRecordingIndicator();
            videoCircleBtn.style.background = '';
            videoCircleBtn.style.transform = '';
            
            const preview = document.getElementById('circlePreview');
            if (preview) preview.remove();
            
        } catch (e) {
            alert('❌ Ошибка отправки: ' + e.message);
        }
    };
}

// ==================== ИНДИКАТОР ЗАПИСИ ====================
function showRecordingIndicator(type) {
    removeRecordingIndicator();
    
    recordingIndicator = document.createElement('div');
    recordingIndicator.className = `recording-indicator ${type === 'circle' ? 'circle' : ''}`;
    
    const icon = document.createElement('span');
    icon.textContent = type === 'circle' ? '⭕' : '🎤';
    
    const timer = document.createElement('span');
    timer.className = 'recording-timer';
    timer.textContent = '00:00';
    
    const stopBtn = document.createElement('button');
    stopBtn.className = 'recording-stop';
    stopBtn.textContent = '⏹️';
    stopBtn.onclick = type === 'circle' ? stopCircleRecording : stopVoiceRecording;
    
    recordingIndicator.appendChild(icon);
    recordingIndicator.appendChild(timer);
    recordingIndicator.appendChild(stopBtn);
    
    document.body.appendChild(recordingIndicator);
}

function removeRecordingIndicator() {
    if (recordingIndicator) {
        recordingIndicator.remove();
        recordingIndicator = null;
    }
}

// ==================== ВОСПРОИЗВЕДЕНИЕ ====================
window.playVoiceMessage = function(dataUrl) {
    const audio = new Audio(dataUrl);
    audio.play();
};

window.playCircleMessage = function(dataUrl) {
    const video = document.createElement('video');
    video.src = dataUrl;
    video.controls = true;
    video.style.width = '300px';
    video.style.borderRadius = '50%';
    
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.background = 'rgba(0,0,0,0.9)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => modal.remove();
    
    modal.appendChild(video);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
    
    video.play();
};

// ==================== АДМИН-ПАНЕЛЬ ====================
if (adminButton) {
    adminButton.addEventListener('click', () => {
        if (adminModal) adminModal.style.display = 'flex';
        loadAdminUsers();
        if (isOwner()) loadAdminsList();
    });
}

if (closeAdmin) {
    closeAdmin.addEventListener('click', () => {
        if (adminModal) adminModal.style.display = 'none';
    });
}

if (adminTabs) {
    adminTabs.forEach(tab => tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
        const content = document.getElementById(`admin${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`);
        if (content) content.classList.add('active');
        
        if (tab.dataset.tab === 'users') loadAdminUsers();
        if (tab.dataset.tab === 'admins' && isOwner()) loadAdminsList();
    }));
}

async function loadAdminUsers() {
    if (!adminUsersList || !CURRENT_USER) return;
    
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').order('created_at', { ascending: false });
        
        const { data: admins } = await supabaseClient.from('admins').select('phone, rank');
        const adminMap = {};
        admins?.forEach(a => adminMap[a.phone] = a.rank || 1);
        
        adminUsersList.innerHTML = users?.map(u => {
            const rank = u.phone === OWNER_PHONE ? 5 : (adminMap[u.phone] || 0);
            return `
            <div class="admin-user-item">
                <div>
                    <strong>${u.username || u.phone}</strong>
                    <div style="color:#888;font-size:12px;">${u.phone}</div>
                    ${rank > 0 ? `<div style="color:${RANGS[rank]?.color}">Ранг ${rank}: ${RANGS[rank]?.name}</div>` : ''}
                </div>
                <div class="admin-user-actions">
                    ${isOwner() && u.phone !== OWNER_PHONE ? `
                        <button class="admin-user-btn make-admin" onclick="openRankModal('${u.phone}')">
                            ${rank > 0 ? '👑 Изменить ранг' : '👑 Назначить'}
                        </button>
                    ` : ''}
                    ${u.phone === OWNER_PHONE ? '<span style="color:gold;">👑 Владелец</span>' : ''}
                </div>
            </div>`;
        }).join('') || '<p class="no-data">Нет пользователей</p>';
    } catch (e) { console.error(e); }
}

// ==================== ФОРМАТИРОВАНИЕ НОМЕРОВ ====================
[loginPhone, registerPhone].forEach(i => i?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = v;
}));

// ==================== СЕССИЯ ====================
const savedUser = loadSession();
if (savedUser) {
    CURRENT_USER = savedUser;
    (async () => {
        await loadUserSettings();
        await loadUserTheme();
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (CURRENT_SESSION_TOKEN) {
            await supabaseClient
                .from('sessions')
                .update({ last_active: new Date() })
                .eq('session_token', CURRENT_SESSION_TOKEN);
        }
        
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        if (ADMIN_RIGHTS || isOwner()) {
            if (adminButton) adminButton.style.display = 'block';
        }
        
        loadChats();
        loadGroups();
    })();
}

// ==================== ЗАКРЫТИЕ МЕНЮ ====================
document.addEventListener('click', function(e) {
    if (!e.target.closest('.message')) {
        if (messageMenu) messageMenu.style.display = 'none';
    }
    if (!e.target.closest('.emoji-button') && !e.target.closest('.emoji-panel')) {
        if (emojiPanel) emojiPanel.style.display = 'none';
    }
    if (!e.target.closest('.search-results') && !e.target.closest('.search-button') && !e.target.closest('.search-input')) {
        if (searchResults) searchResults.style.display = 'none';
    }
});

console.log('✅ LinkUp — ФИНАЛЬНАЯ ВЕРСИЯ (закрепление, удаление, голосовые, кружочки)');