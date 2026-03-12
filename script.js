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

// ==================== DOM ЭЛЕМЕНТЫ ====================
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
const currentUserPhone = document.getElementById('currentUserPhone');
const currentUserName = document.getElementById('currentUserName');
const currentUserUsername = document.getElementById('currentUserUsername');
const adminButton = document.getElementById('adminButton');
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
const linkEmail = document.getElementById('linkEmail');
const linkMax = document.getElementById('linkMax');

// MAX баннер и модалки
const maxBanner = document.getElementById('maxBanner');
const showMaxBind = document.getElementById('showMaxBind');
const closeMaxBanner = document.getElementById('closeMaxBanner');
const bindMaxModal = document.getElementById('bindMaxModal');
const closeBindMax = document.getElementById('closeBindMax');
const bindMaxPhone = document.getElementById('bindMaxPhone');
const sendMaxCode = document.getElementById('sendMaxCode');
const bindStep1 = document.getElementById('bindStep1');
const bindStep2 = document.getElementById('bindStep2');
const bindMaxCode = document.getElementById('bindMaxCode');
const verifyMaxCode = document.getElementById('verifyMaxCode');
const backToStep1 = document.getElementById('backToStep1');
const bindMessage = document.getElementById('bindMessage');
const maxLoginModal = document.getElementById('maxLoginModal');
const maxLoginCode = document.getElementById('maxLoginCode');
const verifyLoginCode = document.getElementById('verifyLoginCode');
const cancelMaxLogin = document.getElementById('cancelMaxLogin');
const maxLoginMessage = document.getElementById('maxLoginMessage');

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

function generateMaxCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
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

function isAdmin() {
    return !!(ADMIN_RIGHTS || isOwner());
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
showRegisterButton?.addEventListener('click', () => {
    loginForm.style.display = 'none';
    qrLoginForm.style.display = 'none';
    showRegisterButton.style.display = 'none';
    registerForm.style.display = 'block';
    authMessage.textContent = '';
});

backToLoginButton?.addEventListener('click', () => {
    loginForm.style.display = 'block';
    qrLoginForm.style.display = 'none';
    showRegisterButton.style.display = 'block';
    registerForm.style.display = 'none';
    authMessage.textContent = '';
});

showQrLogin?.addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'none';
    showRegisterButton.style.display = 'none';
    qrLoginForm.style.display = 'block';
    authMessage.textContent = '';
    startQrLogin();
});

backFromQrBtn?.addEventListener('click', () => {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    qrLoginForm.style.display = 'none';
    showRegisterButton.style.display = 'block';
    stopQrLogin();
});

// ==================== QR-ВХОД ====================
let currentQrCode = null;
let currentQrToken = null;

async function startQrLogin() {
    qrPlaceholder.style.display = 'flex';
    qrCanvas.style.display = 'none';
    
    currentQrToken = generateQrCode();
    currentQrCode = currentQrToken;
    
    await supabaseClient
        .from('qr_codes')
        .insert([{
            code: currentQrToken,
            expires_at: new Date(Date.now() + 5 * 60 * 1000),
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
                    
                    authScreen.style.display = 'none';
                    app.style.display = 'flex';
                    currentUserPhone.textContent = CURRENT_USER.phone;
                    
                    stopQrLogin();
                    loadChats();
                    loadGroups();
                }
            }
        }
    }, 2000);
}

function stopQrLogin() {
    if (QR_POLLING_INTERVAL) {
        clearInterval(QR_POLLING_INTERVAL);
        QR_POLLING_INTERVAL = null;
    }
}

// ==================== СКАНИРОВАНИЕ QR (ДЛЯ ТЕЛЕФОНА) ====================
let scanning = false;
let videoStream = null;

async function startQrScanning() {
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
}

function scanQrFrame() {
    if (!scanning) return;
    
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
        alert('✅ Вход подтверждён');
    };
    
    qrConfirmNo.onclick = () => {
        qrConfirmModal.style.display = 'none';
        alert('❌ Вход отклонён');
    };
}

closeQrScan?.addEventListener('click', () => {
    scanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    qrScanModal.style.display = 'none';
});

stopQrScan?.addEventListener('click', () => {
    scanning = false;
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
    qrScanModal.style.display = 'none';
});

// ==================== MAX ПРИВЯЗКА ====================
let currentMaxCode = null;
let pendingMaxPhone = null;

// Открытие модалки привязки MAX
function openMaxBindModal() {
    bindMaxModal.style.display = 'flex';
    bindStep1.style.display = 'block';
    bindStep2.style.display = 'none';
    bindMessage.textContent = '';
    bindMaxPhone.value = '';
    bindMaxCode.value = '';
}

// Закрытие модалки
closeBindMax?.addEventListener('click', () => {
    bindMaxModal.style.display = 'none';
});

// Отправка кода в MAX
sendMaxCode?.addEventListener('click', async () => {
    const phone = formatPhone(bindMaxPhone.value);
    if (!phone) {
        bindMessage.textContent = '❌ Введите номер телефона';
        return;
    }
    
    // Генерируем код подтверждения
    currentMaxCode = generateMaxCode();
    pendingMaxPhone = phone;
    
    // В реальном проекте здесь будет отправка через MAX API
    console.log(`📱 Отправка кода ${currentMaxCode} в MAX на номер ${phone}`);
    
    // Показываем второй шаг
    bindStep1.style.display = 'none';
    bindStep2.style.display = 'block';
    bindMessage.textContent = `✅ Код отправлен в MAX на номер ${phone}`;
});

// Возврат к первому шагу
backToStep1?.addEventListener('click', () => {
    bindStep1.style.display = 'block';
    bindStep2.style.display = 'none';
    bindMessage.textContent = '';
});

// Подтверждение кода
verifyMaxCode?.addEventListener('click', async () => {
    const code = bindMaxCode.value.trim();
    if (!code) {
        bindMessage.textContent = '❌ Введите код';
        return;
    }
    
    if (code !== currentMaxCode) {
        bindMessage.textContent = '❌ Неверный код';
        return;
    }
    
    // Сохраняем привязку в БД
    await supabaseClient
        .from('linked_accounts')
        .insert([{
            user_phone: CURRENT_USER.phone,
            provider: 'max',
            provider_user_id: pendingMaxPhone,
            verified: true
        }]);
    
    // Включаем двухфакторную аутентификацию
    await supabaseClient
        .from('profiles')
        .update({ two_factor: 'max' })
        .eq('phone', CURRENT_USER.phone);
    
    bindMessage.textContent = '✅ MAX успешно привязан!';
    bindMessage.style.color = '#4caf50';
    
    setTimeout(() => {
        bindMaxModal.style.display = 'none';
        maxBanner.style.display = 'none';
    }, 2000);
});

// ==================== ВХОД С MAX КОДОМ ====================
let pendingLoginPhone = null;

async function requestMaxLogin(phone) {
    pendingLoginPhone = phone;
    currentMaxCode = generateMaxCode();
    
    // В реальном проекте здесь отправка через MAX API
    console.log(`📱 Код для входа ${currentMaxCode} отправлен в MAX на номер ${phone}`);
    
    maxLoginModal.style.display = 'flex';
    maxLoginMessage.textContent = '';
    maxLoginCode.value = '';
}

verifyLoginCode?.addEventListener('click', async () => {
    const code = maxLoginCode.value.trim();
    if (!code) {
        maxLoginMessage.textContent = '❌ Введите код';
        return;
    }
    
    if (code !== currentMaxCode) {
        maxLoginMessage.textContent = '❌ Неверный код';
        return;
    }
    
    // Получаем пользователя
    const { data: users } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('phone', pendingLoginPhone);
    
    if (!users?.length) {
        maxLoginMessage.textContent = '❌ Пользователь не найден';
        return;
    }
    
    CURRENT_USER = users[0];
    CURRENT_SESSION_TOKEN = generateSessionToken();
    saveSession(CURRENT_USER);
    await saveSessionToDB();
    await loadUserSettings();
    
    maxLoginModal.style.display = 'none';
    authScreen.style.display = 'none';
    app.style.display = 'flex';
    currentUserPhone.textContent = CURRENT_USER.phone;
    
    loadChats();
    loadGroups();
});

cancelMaxLogin?.addEventListener('click', () => {
    maxLoginModal.style.display = 'none';
    pendingLoginPhone = null;
    currentMaxCode = null;
});

// ==================== ЗАГРУЗКА НАСТРОЕК ПОЛЬЗОВАТЕЛЯ ====================
async function loadUserSettings() {
    const { data } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('phone', CURRENT_USER.phone)
        .single();
    
    if (data) {
        CURRENT_USER.username = data.username;
        CURRENT_USER.two_factor = data.two_factor || 'none';
        CURRENT_USER.privacy_settings = data.privacy_settings || {
            show_phone: 'everyone',
            who_can_write: 'everyone',
            last_seen: 'everyone'
        };
        
        currentUserName.textContent = data.username || CURRENT_USER.phone;
        currentUserUsername.textContent = data.username ? '@' + data.username : '';
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

// ==================== ЗАГРУЗКА СПИСКА УСТРОЙСТВ ====================
async function loadSessions() {
    if (!devicesList) return;
    
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

// ==================== ЗАВЕРШЕНИЕ СЕССИИ ====================
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

// ==================== ВЫХОД СО ВСЕХ УСТРОЙСТВ ====================
terminateAllSessions?.addEventListener('click', async () => {
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

// ==================== ВХОД ====================
loginButton?.addEventListener('click', async () => {
    const phone = formatPhone(loginPhone.value);
    const pass = loginPassword.value;
    if (!phone || !pass) { authMessage.textContent = '❌ Введите номер и пароль'; return; }
    
    try {
        const { data: users, error } = await supabaseClient.from('profiles').select('*').eq('phone', phone).eq('password', pass);
        if (error) throw error;
        if (!users?.length) { authMessage.textContent = '❌ Неверный номер или пароль'; return; }
        
        const user = users[0];
        
        // Проверяем, включена ли двухфакторка через MAX
        if (user.two_factor === 'max') {
            // Запрашиваем код из MAX
            await requestMaxLogin(phone);
            return;
        }
        
        CURRENT_USER = user;
        CURRENT_SESSION_TOKEN = generateSessionToken();
        saveSession(CURRENT_USER);
        
        await saveSessionToDB();
        await loadUserSettings();
        
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
        }
        
        setTimeout(() => {
            if (user.two_factor === 'none') {
                maxBanner.style.display = 'block';
            }
        }, 5000);
        
        loadChats();
        loadGroups();
    } catch (e) { authMessage.textContent = '❌ Ошибка входа: ' + e.message; }
});

// ==================== РЕГИСТРАЦИЯ ====================
registerButton?.addEventListener('click', async () => {
    const phone = formatPhone(registerPhone.value);
    const username = registerUsername.value.trim().toLowerCase();
    const pass = registerPassword.value;
    const confirm = registerPasswordConfirm.value;
    
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
            two_factor: 'none',
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
        
        setTimeout(() => {
            backToLoginButton?.click();
            authMessage.textContent = '';
            authMessage.style.color = '#ff4444';
        }, 2000);
    } catch (e) {
        authMessage.textContent = '❌ Ошибка: ' + e.message;
    }
});

// ==================== ПОИСК ====================
searchButton?.addEventListener('click', searchUsers);
searchInput?.addEventListener('keypress', e => e.key === 'Enter' && searchUsers());

function getSelectedSearchType() {
    for (const radio of searchTypeRadios) {
        if (radio.checked) return radio.value;
    }
    return 'all';
}

async function searchUsers() {
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
        
        searchResults.style.display = 'block';
    } catch (e) {
        console.error('Ошибка поиска:', e);
    }
}

closeSearch?.addEventListener('click', () => {
    searchResults.style.display = 'none';
});

// ==================== ВКЛАДКИ ЧАТЫ/ГРУППЫ ====================
chatsTabBtn?.addEventListener('click', () => {
    chatsTabBtn.classList.add('active');
    groupsTabBtn.classList.remove('active');
    chatsList.style.display = 'block';
    groupsList.style.display = 'none';
});

groupsTabBtn?.addEventListener('click', () => {
    groupsTabBtn.classList.add('active');
    chatsTabBtn.classList.remove('active');
    chatsList.style.display = 'none';
    groupsList.style.display = 'block';
    loadGroups();
});

// ==================== ЛИЧНЫЕ ЧАТЫ ====================
window.startChat = async function(phone) {
    searchResults.style.display = 'none';
    searchInput.value = '';
    CURRENT_GROUP = null;
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').eq('phone', phone);
        if (!users?.length) return;
        CURRENT_CHAT = users[0];
        
        document.getElementById('currentChatName').textContent = CURRENT_CHAT.username || CURRENT_CHAT.phone;
        document.getElementById('currentChatPhone').textContent = CURRENT_CHAT.phone;
        document.getElementById('currentChatUsername').textContent = CURRENT_CHAT.username ? '@' + CURRENT_CHAT.username : '';
        
        welcomeScreen.style.display = 'none';
        chatWindow.style.display = 'flex';
        loadMessages(phone);
        loadPinnedMessages('private', phone);
    } catch (e) { console.error(e); }
};

async function loadMessages(chatPhone) {
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
                return `
                <div class="message ${isSent ? 'sent' : 'received'} ${m.pinned ? 'pinned' : ''}" 
                     data-id="${m.id}" 
                     data-type="private"
                     onclick="selectMessage(this, '${m.id}', 'private')">
                    <div class="message-content">${m.content}</div>
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>`;
            }).join('');
        }
    } catch (e) { console.error(e); }
}

// ==================== ГРУППЫ ====================
window.openGroup = async function(groupId) {
    CURRENT_CHAT = null;
    CURRENT_GROUP = GROUPS.find(g => g.id === groupId);
    document.getElementById('currentChatName').textContent = CURRENT_GROUP.name;
    document.getElementById('currentChatPhone').textContent = 'Группа';
    document.getElementById('currentChatUsername').textContent = '';
    welcomeScreen.style.display = 'none';
    chatWindow.style.display = 'flex';
    loadGroupMessages(groupId);
    loadPinnedMessages('group', groupId);
};

async function loadGroupMessages(groupId) {
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
                
                return `
                <div class="message ${isSent ? 'sent' : 'received'} ${m.pinned ? 'pinned' : ''}"
                     data-id="${m.id}"
                     data-type="group"
                     onclick="selectMessage(this, '${m.id}', 'group')">
                    ${!isSent ? `<div class="message-sender">${senderName}</div>` : ''}
                    <div class="message-content">${m.content}</div>
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>`;
            }).join('');
        }
    } catch (e) { console.error(e); }
}

// ==================== ЗАКРЕПЛЁННЫЕ СООБЩЕНИЯ ====================
async function loadPinnedMessages(type, id) {
    try {
        let query;
        if (type === 'private') {
            query = await supabaseClient
                .from('messages')
                .select('*')
                .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
                .or(`sender.eq.${id},receiver.eq.${id}`)
                .eq('pinned', true);
        } else {
            query = await supabaseClient
                .from('group_messages')
                .select('*')
                .eq('group_id', id)
                .eq('pinned', true);
        }
        
        const { data: messages } = query;
        
        if (!messages?.length) {
            pinnedMessages.innerHTML = '';
            return;
        }
        
        pinnedMessages.innerHTML = messages.map(m => `
            <div class="pinned-message">
                <span>📌 ${m.content.slice(0, 30)}${m.content.length > 30 ? '...' : ''}</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

// ==================== ВЫБОР СООБЩЕНИЯ ====================
window.selectMessage = function(element, id, type) {
    document.querySelectorAll('.message').forEach(m => m.classList.remove('selected'));
    element.classList.add('selected');
    selectedMessageId = id;
    selectedMessageType = type;
    
    const menu = document.getElementById('messageMenu');
    menu.style.display = 'block';
    menu.style.left = (event.pageX) + 'px';
    menu.style.top = (event.pageY) + 'px';
};

// ==================== УДАЛЕНИЕ СООБЩЕНИЯ ====================
deleteMessageBtn?.addEventListener('click', async () => {
    if (!selectedMessageId) return;
    
    try {
        if (selectedMessageType === 'private') {
            await supabaseClient.from('messages').delete().eq('id', selectedMessageId);
            if (CURRENT_CHAT) loadMessages(CURRENT_CHAT.phone);
        } else {
            await supabaseClient.from('group_messages').delete().eq('id', selectedMessageId);
            if (CURRENT_GROUP) loadGroupMessages(CURRENT_GROUP.id);
        }
        messageMenu.style.display = 'none';
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// ==================== ЗАКРЕПЛЕНИЕ СООБЩЕНИЯ ====================
pinMessageBtn?.addEventListener('click', async () => {
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
        messageMenu.style.display = 'none';
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// ==================== ЗАГРУЗКА ЧАТОВ ====================
async function loadChats() {
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

// ==================== ОТПРАВКА СООБЩЕНИЙ ====================
sendButton?.addEventListener('click', sendMessage);
messageInput?.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

async function sendMessage() {
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
emojiBtn?.addEventListener('click', () => {
    emojiPanel.style.display = emojiPanel.style.display === 'none' ? 'grid' : 'none';
});

window.insertEmoji = function(emoji) {
    messageInput.value += emoji;
    messageInput.focus();
    emojiPanel.style.display = 'none';
};

// ==================== ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК В ПРОФИЛЕ ====================
profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        profileTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        profileTabContents.forEach(c => c.classList.remove('active'));
        const tabName = tab.dataset.profileTab;
        document.getElementById(`profile${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`).classList.add('active');
        
        if (tabName === 'devices') {
            loadSessions();
        } else if (tabName === 'privacy') {
            loadPrivacySettings();
        }
    });
});

// ==================== ЗАГРУЗКА НАСТРОЕК ПРИВАТНОСТИ ====================
function loadPrivacySettings() {
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
savePrivacyBtn?.addEventListener('click', async () => {
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

// ==================== НАСТРОЙКИ ПРОФИЛЯ ====================
userProfile?.addEventListener('click', () => {
    profileModal.style.display = 'flex';
    profileDisplayName.value = CURRENT_USER.username || '';
    profileUsername.value = CURRENT_USER.username || '';
    profilePhone.value = CURRENT_USER.phone;
    loadPrivacySettings();
});

closeProfileModal?.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

saveProfileBtn?.addEventListener('click', async () => {
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
        currentUserName.textContent = newUsername || CURRENT_USER.phone;
        currentUserUsername.textContent = newUsername ? '@' + newUsername : '';
        
        profileModal.style.display = 'none';
        alert('✅ Профиль обновлён');
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// ==================== ПРИВЯЗКИ ====================
linkGoogle?.addEventListener('click', () => {
    alert('🔐 Привязка Google будет доступна в следующем обновлении!');
});

linkEmail?.addEventListener('click', () => {
    alert('📧 Привязка почты будет доступна в следующем обновлении!');
});

linkMax?.addEventListener('click', openMaxBindModal);

// ==================== MAX БАННЕР ====================
closeMaxBanner?.addEventListener('click', () => {
    maxBanner.style.display = 'none';
});

showMaxBind?.addEventListener('click', () => {
    openMaxBindModal();
    maxBanner.style.display = 'none';
});

// ==================== АДМИН-ПАНЕЛЬ ====================
adminButton?.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    loadAdminUsers();
    if (isOwner()) loadAdminsList();
});

closeAdmin?.addEventListener('click', () => adminModal.style.display = 'none');

adminTabs.forEach(tab => tab.addEventListener('click', () => {
    adminTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`admin${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`).classList.add('active');
    
    if (tab.dataset.tab === 'users') loadAdminUsers();
    if (tab.dataset.tab === 'support') loadSupportRequests();
    if (tab.dataset.tab === 'reports') loadReports();
    if (tab.dataset.tab === 'channels') loadChannels();
    if (tab.dataset.tab === 'admins' && isOwner()) loadAdminsList();
}));

async function loadAdminUsers() {
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').order('created_at', { ascending: false });
        
        const { data: admins } = await supabaseClient.from('admins').select('phone');
        const adminPhones = admins?.map(a => a.phone) || [];
        
        adminUsersList.innerHTML = users?.map(u => `
            <div class="admin-user-item">
                <div>
                    <strong>${u.username || u.phone}</strong>
                    <div style="color:#888;font-size:12px;">${u.phone}</div>
                    ${u.two_factor === 'max' ? '<span style="color:#00bfff;">🔒 MAX</span>' : ''}
                </div>
                <div class="admin-user-actions">
                    ${isOwner() && u.phone !== OWNER_PHONE ? `
                        <button class="admin-user-btn make-admin" onclick="toggleAdmin('${u.phone}')">
                            ${adminPhones.includes(u.phone) ? '👑 Убрать из админов' : '👑 Сделать админом'}
                        </button>
                    ` : ''}
                    ${u.phone === OWNER_PHONE ? '<span style="color:gold;">👑 Владелец</span>' : ''}
                    ${adminPhones.includes(u.phone) && u.phone !== OWNER_PHONE ? '<span style="color:#00bfff;">👤 Админ</span>' : ''}
                </div>
            </div>`).join('') || '<p class="no-data">Нет пользователей</p>';
    } catch (e) { console.error(e); }
}

window.toggleAdmin = async function(phone) {
    if (!isOwner()) return;
    
    try {
        const { data: existing } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('phone', phone);
        
        if (existing?.length) {
            await supabaseClient.from('admins').delete().eq('phone', phone);
            alert(`✅ ${phone} больше не админ`);
        } else {
            await supabaseClient.from('admins').insert([{ phone }]);
            alert(`✅ ${phone} назначен админом`);
        }
        
        loadAdminUsers();
        if (isOwner()) loadAdminsList();
    } catch (e) {
        console.error('Ошибка:', e);
        alert('❌ Ошибка: ' + e.message);
    }
};

async function loadSupportRequests() {
    supportList.innerHTML = '<p class="no-data">Функция поддержки в разработке</p>';
}

async function loadReports() {
    reportsList.innerHTML = '<p class="no-data">Функция жалоб в разработке</p>';
}

async function loadChannels() {
    channelsList.innerHTML = '<p class="no-data">Функция каналов в разработке</p>';
}

async function loadAdminsList() {
    const { data: admins } = await supabaseClient.from('admins').select('*');
    adminsList.innerHTML = admins?.map(a => `
        <div class="admin-user-item">
            <div>${a.phone}</div>
            ${a.phone === OWNER_PHONE ? '<span style="color:gold;">👑 Владелец</span>' : ''}
        </div>
    `).join('');
}

addAdminBtn?.addEventListener('click', async () => {
    let p = formatPhone(newAdminPhone.value);
    if (!p) return;
    
    let { data: u } = await supabaseClient.from('profiles').select('*').eq('phone', p);
    if (!u?.length) { 
        alert('❌ Пользователь не найден'); 
        return; 
    }
    
    await toggleAdmin(p);
    newAdminPhone.value = '';
});

// ==================== ФОРМАТИРОВАНИЕ НОМЕРОВ ====================
[loginPhone, registerPhone, bindMaxPhone].forEach(i => i?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = v;
}));

// ==================== СЕССИЯ ====================
const savedUser = loadSession();
if (savedUser) {
    CURRENT_USER = savedUser;
    (async () => {
        await loadUserSettings();
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (CURRENT_SESSION_TOKEN) {
            await supabaseClient
                .from('sessions')
                .update({ last_active: new Date() })
                .eq('session_token', CURRENT_SESSION_TOKEN);
        }
        
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
        }
        
        loadChats();
        loadGroups();
        
        setTimeout(() => {
            if (CURRENT_USER.two_factor === 'none') {
                maxBanner.style.display = 'block';
            }
        }, 5000);
    })();
}

// ==================== ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ ЕГО ====================
document.addEventListener('click', function(e) {
    if (!e.target.closest('.message')) {
        messageMenu.style.display = 'none';
    }
    if (!e.target.closest('.emoji-button') && !e.target.closest('.emoji-panel')) {
        emojiPanel.style.display = 'none';
    }
    if (!e.target.closest('.search-results') && !e.target.closest('.search-button') && !e.target.closest('.search-input')) {
        searchResults.style.display = 'none';
    }
});

console.log('✅ LinkUp — с MAX привязкой и двухфакторной аутентификацией');