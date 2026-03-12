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

// Описания рангов
const RANGS = {
    1: { name: 'Младший модератор', desc: 'Мут и варны', color: '#cd7f32' },
    2: { name: 'Старший модератор', desc: 'Кик, чистка чата', color: '#c0c0c0' },
    3: { name: 'Младший администратор', desc: 'Настройки чата, фильтры', color: '#ffd700' },
    4: { name: 'Старший администратор', desc: 'Назначение модераторов, правила', color: '#00bfff' },
    5: { name: 'Создатель', desc: 'Полный доступ, передача прав', color: '#ff1493' }
};

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
const googleLoginBtn = document.getElementById('googleLoginBtn');
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

// Админ-чаты
const adminChatsList = document.getElementById('adminChatsList');
const refreshChatsBtn = document.getElementById('refreshChatsBtn');
const adminChatSearch = document.getElementById('adminChatSearch');

// Модалка рангов
const rankModal = document.getElementById('rankModal');
const closeRankModal = document.getElementById('closeRankModal');
const rankUserPhone = document.getElementById('rankUserPhone');
const rankOptions = document.querySelectorAll('.rank-option');
const confirmRankBtn = document.getElementById('confirmRankBtn');
const cancelRankBtn = document.getElementById('cancelRankBtn');

// Модалка просмотра чата
const adminChatViewModal = document.getElementById('adminChatViewModal');
const closeAdminChatView = document.getElementById('closeAdminChatView');
const adminChatViewTitle = document.getElementById('adminChatViewTitle');
const adminChatInfo = document.getElementById('adminChatInfo');
const adminChatMessages = document.getElementById('adminChatMessages');
const adminChatWarnBtn = document.getElementById('adminChatWarnBtn');
const adminChatMuteBtn = document.getElementById('adminChatMuteBtn');
const adminChatKickBtn = document.getElementById('adminChatKickBtn');
const adminChatBanBtn = document.getElementById('adminChatBanBtn');

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
    
    const actions = {
        'warn': rank >= 1,
        'mute': rank >= 1,
        'kick': rank >= 2,
        'clean': rank >= 2,
        'settings': rank >= 3,
        'filters': rank >= 3,
        'assign_mods': rank >= 4,
        'rules': rank >= 4,
        'full': rank >= 5
    };
    return actions[action] || false;
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
                    await loadUserTheme();
                    
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

// ==================== СКАНИРОВАНИЕ QR ====================
let scanning = false;
let videoStream = null;

window.startQrScanning = async function() {
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

// ==================== ВХОД ЧЕРЕЗ GOOGLE ====================
googleLoginBtn?.addEventListener('click', () => {
    alert('🔐 Вход через Google будет доступен в ближайшее время!');
});

// ==================== ЗАГРУЗКА НАСТРОЕК ====================
async function loadUserSettings() {
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

// ==================== ЗАГРУЗКА УСТРОЙСТВ ====================
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
        
        CURRENT_USER = users[0];
        CURRENT_SESSION_TOKEN = generateSessionToken();
        saveSession(CURRENT_USER);
        
        await saveSessionToDB();
        await loadUserSettings();
        await loadUserTheme();
        
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (ADMIN_RIGHTS || isOwner()) {
            adminButton.style.display = 'block';
        }
        
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

// ==================== СОЗДАНИЕ ГРУППЫ ====================
createGroupBtn?.addEventListener('click', async () => {
    groupModal.style.display = 'flex';
    await loadAvailableUsers();
});

closeGroupModal?.addEventListener('click', () => {
    groupModal.style.display = 'none';
    groupName.value = '';
    groupDescription.value = '';
    selectedMembers = [];
});

async function loadAvailableUsers() {
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

createGroupFinal?.addEventListener('click', async () => {
    const name = groupName.value.trim();
    const desc = groupDescription.value.trim();
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
        groupModal.style.display = 'none';
        groupName.value = '';
        groupDescription.value = '';
        selectedMembers = [];
        loadGroups();
        groupsTabBtn.click();
    } catch (e) {
        console.error(e);
        alert('❌ Ошибка: ' + e.message);
    }
});

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
        } else if (tabName === 'themes') {
            const currentTheme = CURRENT_USER?.theme || 'dark';
            document.querySelectorAll('.theme-check').forEach(check => check.style.opacity = '0');
            document.getElementById(`check-${currentTheme}`).style.opacity = '1';
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

// ==================== ПРИВЯЗКА GOOGLE ====================
linkGoogle?.addEventListener('click', () => {
    alert('🔐 Привязка Google будет доступна в ближайшее время!');
});

// ==================== ТЕМЫ ====================
async function loadUserTheme() {
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

// ==================== АДМИН-ПАНЕЛЬ ====================
adminButton?.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    loadAdminUsers();
    loadAdminChats();
    if (isOwner()) loadAdminsList();
});

closeAdmin?.addEventListener('click', () => adminModal.style.display = 'none');

adminTabs.forEach(tab => tab.addEventListener('click', () => {
    adminTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`admin${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`).classList.add('active');
    
    if (tab.dataset.tab === 'users') loadAdminUsers();
    if (tab.dataset.tab === 'chats') loadAdminChats();
    if (tab.dataset.tab === 'support') loadSupportRequests();
    if (tab.dataset.tab === 'reports') loadReports();
    if (tab.dataset.tab === 'channels') loadChannels();
    if (tab.dataset.tab === 'admins' && isOwner()) loadAdminsList();
}));

// Загрузка пользователей для админки
async function loadAdminUsers() {
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

// Модалка выбора ранга
window.openRankModal = function(phone) {
    currentRankUser = phone;
    rankUserPhone.textContent = `Пользователь: ${phone}`;
    
    // Сбрасываем выделение
    rankOptions.forEach(opt => opt.classList.remove('selected'));
    
    // Загружаем текущий ранг
    supabaseClient.from('admins').select('rank').eq('phone', phone).single().then(({ data }) => {
        if (data) {
            const rank = data.rank;
            rankOptions.forEach(opt => {
                if (opt.dataset.rank == rank) {
                    opt.classList.add('selected');
                }
            });
        }
    });
    
    rankModal.style.display = 'flex';
};

window.selectRank = function(rank) {
    rankOptions.forEach(opt => opt.classList.remove('selected'));
    rankOptions.forEach(opt => {
        if (opt.dataset.rank == rank) {
            opt.classList.add('selected');
        }
    });
};

closeRankModal?.addEventListener('click', () => {
    rankModal.style.display = 'none';
    currentRankUser = null;
});

cancelRankBtn?.addEventListener('click', () => {
    rankModal.style.display = 'none';
    currentRankUser = null;
});

confirmRankBtn?.addEventListener('click', async () => {
    const selected = document.querySelector('.rank-option.selected');
    if (!selected) {
        alert('Выберите ранг');
        return;
    }
    
    const rank = parseInt(selected.dataset.rank);
    
    try {
        // Проверяем, есть ли уже запись
        const { data: existing } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('phone', currentRankUser);
        
        if (existing?.length) {
            // Обновляем ранг
            await supabaseClient
                .from('admins')
                .update({ rank })
                .eq('phone', currentRankUser);
        } else {
            // Создаём новую запись
            await supabaseClient
                .from('admins')
                .insert([{ phone: currentRankUser, rank }]);
        }
        
        alert(`✅ Ранг ${rank} назначен`);
        rankModal.style.display = 'none';
        loadAdminUsers();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// Загрузка чатов для админки
async function loadAdminChats() {
    if (!adminChatsList) return;
    
    try {
        // Загружаем личные сообщения
        const { data: privateMessages } = await supabaseClient
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });
        
        // Загружаем группы
        const { data: groups } = await supabaseClient
            .from('groups')
            .select('*')
            .order('created_at', { ascending: false });
        
        const chats = [];
        
        // Группируем личные сообщения по парам
        const privateChats = new Map();
        privateMessages?.forEach(m => {
            const participants = [m.sender, m.receiver].sort().join('-');
            if (!privateChats.has(participants) || new Date(m.created_at) > new Date(privateChats.get(participants).lastMessageTime)) {
                privateChats.set(participants, {
                    type: 'private',
                    participants: [m.sender, m.receiver],
                    lastMessage: m.content,
                    lastMessageTime: m.created_at,
                    messageCount: 1
                });
            } else {
                privateChats.get(participants).messageCount++;
            }
        });
        
        privateChats.forEach(chat => chats.push(chat));
        
        // Добавляем группы
        groups?.forEach(g => {
            chats.push({
                type: 'group',
                id: g.id,
                name: g.name,
                created_by: g.created_by,
                created_at: g.created_at
            });
        });
        
        // Сортируем по дате
        chats.sort((a, b) => {
            const dateA = a.lastMessageTime || a.created_at;
            const dateB = b.lastMessageTime || b.created_at;
            return new Date(dateB) - new Date(dateA);
        });
        
        if (!chats.length) {
            adminChatsList.innerHTML = '<p class="no-data">Нет чатов</p>';
            return;
        }
        
        adminChatsList.innerHTML = chats.map(chat => {
            if (chat.type === 'private') {
                const other = chat.participants.find(p => p !== CURRENT_USER.phone) || chat.participants[0];
                return `
                <div class="admin-chat-item">
                    <div class="admin-chat-header">
                        <span class="admin-chat-type private">💬 Личный чат</span>
                        <span>${new Date(chat.lastMessageTime).toLocaleString()}</span>
                    </div>
                    <div class="admin-chat-users">Участники: ${chat.participants.join(', ')}</div>
                    <div class="admin-chat-last-message">${chat.lastMessage}</div>
                    <div class="admin-chat-actions">
                        <button class="admin-chat-btn view" onclick="viewAdminChat('private', '${chat.participants.join('|')}')">👁️ Просмотр</button>
                        ${canUserDo(CURRENT_USER.phone, 'warn') ? `<button class="admin-chat-btn warn" onclick="moderateChat('${other}', 'warn')">⚠️ Варн</button>` : ''}
                        ${canUserDo(CURRENT_USER.phone, 'mute') ? `<button class="admin-chat-btn mute" onclick="moderateChat('${other}', 'mute')">🔇 Мут</button>` : ''}
                        ${canUserDo(CURRENT_USER.phone, 'kick') ? `<button class="admin-chat-btn kick" onclick="moderateChat('${other}', 'kick')">👢 Кик</button>` : ''}
                        ${canUserDo(CURRENT_USER.phone, 'full') ? `<button class="admin-chat-btn ban" onclick="moderateChat('${other}', 'ban')">🚫 Бан</button>` : ''}
                    </div>
                </div>`;
            } else {
                return `
                <div class="admin-chat-item">
                    <div class="admin-chat-header">
                        <span class="admin-chat-type group">👥 Группа: ${chat.name}</span>
                        <span>${new Date(chat.created_at).toLocaleString()}</span>
                    </div>
                    <div class="admin-chat-users">Создатель: ${chat.created_by}</div>
                    <div class="admin-chat-actions">
                        <button class="admin-chat-btn view" onclick="viewAdminChat('group', ${chat.id})">👁️ Просмотр</button>
                        ${canUserDo(CURRENT_USER.phone, 'settings') ? `<button class="admin-chat-btn" onclick="editGroup(${chat.id})">⚙️ Настройки</button>` : ''}
                    </div>
                </div>`;
            }
        }).join('');
    } catch (e) {
        console.error('Ошибка загрузки чатов:', e);
    }
}

// Просмотр чата админом
window.viewAdminChat = async function(type, id) {
    adminChatViewModal.style.display = 'flex';
    
    if (type === 'private') {
        const [user1, user2] = id.split('|');
        adminChatViewTitle.textContent = `Чат: ${user1} - ${user2}`;
        adminChatInfo.innerHTML = `<p>Тип: Личный чат</p><p>Участники: ${user1}, ${user2}</p>`;
        
        // Загружаем сообщения
        const { data: messages } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`and(sender.eq.${user1},receiver.eq.${user2}),and(sender.eq.${user2},receiver.eq.${user1})`)
            .order('created_at', { ascending: true });
        
        adminChatMessages.innerHTML = messages?.map(m => `
            <div class="message ${m.sender === CURRENT_USER.phone ? 'sent' : 'received'}" style="margin:5px 0;max-width:100%">
                <div><strong>${m.sender}:</strong> ${m.content}</div>
                <div style="font-size:10px;color:#888">${new Date(m.created_at).toLocaleString()}</div>
            </div>
        `).join('') || '<p>Нет сообщений</p>';
    } else {
        const { data: group } = await supabaseClient.from('groups').select('*').eq('id', id).single();
        adminChatViewTitle.textContent = `Группа: ${group.name}`;
        adminChatInfo.innerHTML = `<p>Тип: Группа</p><p>Создатель: ${group.created_by}</p><p>Описание: ${group.description || 'Нет'}</p>`;
        
        const { data: messages } = await supabaseClient
            .from('group_messages')
            .select('*')
            .eq('group_id', id)
            .order('created_at', { ascending: true });
        
        adminChatMessages.innerHTML = messages?.map(m => `
            <div class="message received" style="margin:5px 0;max-width:100%">
                <div><strong>${m.sender}:</strong> ${m.content}</div>
                <div style="font-size:10px;color:#888">${new Date(m.created_at).toLocaleString()}</div>
            </div>
        `).join('') || '<p>Нет сообщений</p>';
    }
};

closeAdminChatView?.addEventListener('click', () => {
    adminChatViewModal.style.display = 'none';
});

// Модерация
window.moderateChat = async function(userPhone, action) {
    if (userPhone === OWNER_PHONE) {
        alert('❌ Нельзя модерировать владельца');
        return;
    }
    
    const actionNames = {
        warn: 'выдать предупреждение',
        mute: 'замутить',
        kick: 'кикнуть',
        ban: 'забанить'
    };
    
    if (!confirm(`Вы уверены, что хотите ${actionNames[action]} пользователя ${userPhone}?`)) return;
    
    // Здесь будет логика модерации
    alert(`✅ Действие "${actionNames[action]}" выполнено (тестовая версия)`);
};

// Обновление списка чатов
refreshChatsBtn?.addEventListener('click', loadAdminChats);

// Поиск по чатам
adminChatSearch?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-chat-item').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(term) ? 'block' : 'none';
    });
});

// Заглушки для других вкладок
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
            <div>${a.phone} - Ранг ${a.rank || 1}</div>
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
    
    openRankModal(p);
    newAdminPhone.value = '';
});

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
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (CURRENT_SESSION_TOKEN) {
            await supabaseClient
                .from('sessions')
                .update({ last_active: new Date() })
                .eq('session_token', CURRENT_SESSION_TOKEN);
        }
        
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        if (ADMIN_RIGHTS || isOwner()) {
            adminButton.style.display = 'block';
        }
        
        loadChats();
        loadGroups();
    })();
}

// ==================== ЗАКРЫТИЕ МЕНЮ ====================
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

console.log('✅ LinkUp — полная версия с рангами 1-5 и админ-чатами');
// ==================== ЗВОНКИ (WebRTC) ====================
let peerConnection = null;
let localStream = null;
let remoteStream = null;
let callTimer = null;
let callSeconds = 0;
let currentCall = null;
let incomingCallTimeout = null;

const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' }
    ]
};

// Элементы звонков
const audioCallBtn = document.getElementById('audioCallBtn');
const videoCallBtn = document.getElementById('videoCallBtn');
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

// Элементы входящего звонка
const incomingCallModal = document.getElementById('incomingCallModal');
const incomingCallAvatar = document.getElementById('incomingCallAvatar');
const incomingCallName = document.getElementById('incomingCallName');
const incomingCallType = document.getElementById('incomingCallType');
const acceptCallBtn = document.getElementById('acceptCallBtn');
const declineCallBtn = document.getElementById('declineCallBtn');

// Аудиозвонок
audioCallBtn?.addEventListener('click', async () => {
    if (!CURRENT_CHAT) {
        alert('Сначала выберите чат');
        return;
    }
    await startCall('audio');
});

// Видеозвонок
videoCallBtn?.addEventListener('click', async () => {
    if (!CURRENT_CHAT) {
        alert('Сначала выберите чат');
        return;
    }
    await startCall('video');
});

// Начать звонок
async function startCall(type) {
    try {
        // Запрашиваем доступ к медиа
        const constraints = {
            audio: true,
            video: type === 'video'
        };
        
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        
        // Создаём peer connection
        peerConnection = new RTCPeerConnection(configuration);
        
        // Добавляем локальные треки
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        
        // Обработка удалённого потока
        peerConnection.ontrack = (event) => {
            remoteStream = event.streams[0];
            remoteVideo.srcObject = remoteStream;
        };
        
        // Создаём оффер
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        
        // Отправляем оффер собеседнику (в реальном проекте через сервер)
        console.log('📞 Отправляем оффер:', offer);
        
        // Показываем модалку
        showCallModal(type);
        
        // Имитация ответа (для теста)
        setTimeout(() => {
            simulateAnswer();
        }, 3000);
        
    } catch (error) {
        console.error('Ошибка звонка:', error);
        alert('❌ Не удалось начать звонок: ' + error.message);
    }
}

// Показать модалку звонка
function showCallModal(type) {
    callAvatar.textContent = CURRENT_CHAT?.username?.charAt(0) || '👤';
    callName.textContent = CURRENT_CHAT?.username || CURRENT_CHAT?.phone || 'Собеседник';
    callStatus.textContent = 'Соединение...';
    
    if (type === 'video') {
        callVideoContainer.style.display = 'block';
        localVideo.srcObject = localStream;
    } else {
        callVideoContainer.style.display = 'none';
    }
    
    callModal.style.display = 'flex';
    
    // Запускаем таймер
    callSeconds = 0;
    updateCallTimer();
    callTimer = setInterval(updateCallTimer, 1000);
}

// Обновление таймера
function updateCallTimer() {
    callSeconds++;
    const minutes = Math.floor(callSeconds / 60);
    const seconds = callSeconds % 60;
    callTimerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Имитация ответа (для теста)
function simulateAnswer() {
    callStatus.textContent = 'Соединено';
}

// Завершить звонок
endCallBtn?.addEventListener('click', endCall);

function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    
    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
        remoteStream = null;
    }
    
    if (callTimer) {
        clearInterval(callTimer);
        callTimer = null;
    }
    
    callModal.style.display = 'none';
    incomingCallModal.style.display = 'none';
    
    if (incomingCallTimeout) {
        clearTimeout(incomingCallTimeout);
        incomingCallTimeout = null;
    }
}

// Mute audio
muteAudioBtn?.addEventListener('click', () => {
    if (localStream) {
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            muteAudioBtn.classList.toggle('active');
            muteAudioBtn.title = audioTrack.enabled ? 'Выключить микрофон' : 'Включить микрофон';
        }
    }
});

// Toggle video
toggleVideoBtn?.addEventListener('click', () => {
    if (localStream) {
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            toggleVideoBtn.classList.toggle('active');
            toggleVideoBtn.title = videoTrack.enabled ? 'Выключить камеру' : 'Включить камеру';
        }
    }
});

// Speaker (имитация)
speakerBtn?.addEventListener('click', () => {
    speakerBtn.classList.toggle('active');
    speakerBtn.title = speakerBtn.classList.contains('active') ? 'Выключить динамик' : 'Включить динамик';
});

// Закрытие модалки по ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && callModal.style.display === 'flex') {
        endCall();
    }
});

// Входящий звонок (имитация для теста)
window.simulateIncomingCall = function(phone, type = 'video') {
    incomingCallName.textContent = phone;
    incomingCallType.textContent = type === 'video' ? '📹 Входящий видеозвонок' : '📞 Входящий аудиозвонок';
    incomingCallModal.style.display = 'flex';
    
    // Автоотклонение через 30 секунд
    incomingCallTimeout = setTimeout(() => {
        incomingCallModal.style.display = 'none';
        alert('❌ Вызов не отвечен');
    }, 30000);
};

// Принять звонок
acceptCallBtn?.addEventListener('click', () => {
    incomingCallModal.style.display = 'none';
    if (incomingCallTimeout) {
        clearTimeout(incomingCallTimeout);
        incomingCallTimeout = null;
    }
    
    // Запускаем звонок (для теста)
    showCallModal('video');
    callStatus.textContent = 'Соединено';
});

// Отклонить звонок
declineCallBtn?.addEventListener('click', () => {
    incomingCallModal.style.display = 'none';
    if (incomingCallTimeout) {
        clearTimeout(incomingCallTimeout);
        incomingCallTimeout = null;
    }
    alert('❌ Звонок отклонён');
});

// Для теста: Ctrl+C - входящий звонок
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'c') {
        simulateIncomingCall('+79991234567', 'video');
    }
    if (e.ctrlKey && e.key === 'a') {
        simulateIncomingCall('+79991234567', 'audio');
    }
});

console.log('✅ Звонки добавлены! Нажми Ctrl+C для теста входящего звонка');