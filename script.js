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
let currentRankUser = null;
let OWNER_SETTINGS = { showBadge: true };

// ==================== СОСТОЯНИЕ ЗВОНКОВ ====================
let callState = {
    isCalling: false,
    isRinging: false,
    targetUser: null,
    callType: null,
    callId: null,
    peerConnection: null,
    localStream: null,
    remoteStream: null,
    callTimer: null,
    callSeconds: 0,
    incomingCallTimeout: null
};

const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ]
};

// ==================== ОПИСАНИЯ РАНГОВ ====================
const RANGS = {
    1: { 
        name: 'Младший модератор', 
        desc: 'Мут, варны, предупреждения', 
        color: '#cd7f32',
        permissions: ['warn', 'mute', 'view']
    },
    2: { 
        name: 'Старший модератор', 
        desc: 'Кик, чистка чата, мут', 
        color: '#c0c0c0',
        permissions: ['warn', 'mute', 'kick', 'clean', 'view']
    },
    3: { 
        name: 'Младший администратор', 
        desc: 'Настройки чата, фильтры, безопасность', 
        color: '#ffd700',
        permissions: ['warn', 'mute', 'kick', 'clean', 'settings', 'filters', 'view']
    },
    4: { 
        name: 'Старший администратор', 
        desc: 'Назначение модераторов, правила, приветствия', 
        color: '#00bfff',
        permissions: ['warn', 'mute', 'kick', 'clean', 'settings', 'filters', 'assign_mods', 'rules', 'view']
    },
    5: { 
        name: 'Заместитель владельца', 
        desc: 'Все функции, кроме удаления владельца', 
        color: '#ff1493',
        permissions: ['warn', 'mute', 'kick', 'clean', 'settings', 'filters', 'assign_mods', 'rules', 'full', 'manage_admins', 'view']
    }
};

// ==================== DOM ЭЛЕМЕНТЫ ====================
const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const authMessage = document.getElementById('authMessage');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatWindow = document.getElementById('chatWindow');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
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
const currentUserPhone = document.getElementById('currentUserPhone');
const currentUserName = document.getElementById('currentUserName');
const currentUserUsername = document.getElementById('currentUserUsername');
const adminButton = document.getElementById('adminButton');
const logoutBtn = document.getElementById('logoutBtn');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
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
const ownerTab = document.getElementById('ownerTab');
const showOwnerBadge = document.getElementById('showOwnerBadge');
const ownerBadge = document.getElementById('ownerBadge');
const chatOwnerBadge = document.getElementById('chatOwnerBadge');

// Приватность
const showPhoneRadios = document.querySelectorAll('input[name="showPhone"]');
const whoCanWriteRadios = document.querySelectorAll('input[name="whoCanWrite"]');
const lastSeenRadios = document.querySelectorAll('input[name="lastSeen"]');
const savePrivacyBtn = document.getElementById('savePrivacyBtn');

// Устройства
const devicesList = document.getElementById('devicesList');
const terminateAllSessions = document.getElementById('terminateAllSessions');

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

// Меню чата
const chatMenuModal = document.getElementById('chatMenuModal');
const closeChatMenu = document.getElementById('closeChatMenu');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// Индикатор записи
const recordingIndicator = document.getElementById('recordingIndicator');
const recordingIcon = document.getElementById('recordingIcon');
const recordingTimer = document.getElementById('recordingTimer');
const stopRecordingBtn2 = document.getElementById('stopRecordingBtn2');

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

function generateCallId() {
    return 'call_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
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
    if (rank === 0) return false;
    return RANGS[rank]?.permissions?.includes(action) || false;
}

function formatDuration(seconds) {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getRankColor(rank) {
    const colors = ['#888', '#cd7f32', '#c0c0c0', '#ffd700', '#00bfff', '#ff1493'];
    return colors[rank] || '#888';
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
        showRegisterButton.style.display = 'none';
        registerForm.style.display = 'block';
        authMessage.textContent = '';
    });
}

if (backToLoginButton) {
    backToLoginButton.addEventListener('click', () => {
        loginForm.style.display = 'block';
        showRegisterButton.style.display = 'block';
        registerForm.style.display = 'none';
        authMessage.textContent = '';
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
            last_seen: 'everyone',
            show_owner_badge: true
        };
        
        if (currentUserName) currentUserName.textContent = data.username || CURRENT_USER.phone;
        if (currentUserUsername) currentUserUsername.textContent = data.username ? '@' + data.username : '';
    }
}

// ==================== ЗАГРУЗКА ПРАВ АДМИНА ====================
async function loadAdminRights(phone) {
    if (phone === OWNER_PHONE) {
        return { 
            rank: 5, 
            is_owner: true,
            can_manage_admins: true,
            can_ban_users: true,
            can_manage_groups: true,
            can_view_reports: true
        };
    }
    
    try {
        const { data, error } = await supabaseClient
            .from('admins')
            .select('*')
            .eq('phone', phone)
            .maybeSingle();
        
        if (error) throw error;
        return data;
    } catch (e) {
        console.error('Ошибка загрузки прав:', e);
        return null;
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
                    <span class="device-details">Последняя активность: ${new Date(s.last_active).toLocaleString()}</span>
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

// ==================== СТАТУС ВЛАДЕЛЬЦА ====================
async function loadOwnerSettings() {
    if (!isOwner()) return;
    
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('privacy_settings')
            .eq('phone', CURRENT_USER.phone)
            .single();
        
        if (data?.privacy_settings?.show_owner_badge !== undefined) {
            OWNER_SETTINGS.showBadge = data.privacy_settings.show_owner_badge;
        }
        
        updateOwnerBadge();
    } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
    }
}

async function saveOwnerSettings() {
    if (!isOwner()) return;
    
    const settings = { ...CURRENT_USER.privacy_settings, show_owner_badge: OWNER_SETTINGS.showBadge };
    
    await supabaseClient
        .from('profiles')
        .update({ privacy_settings: settings })
        .eq('phone', CURRENT_USER.phone);
}

function updateOwnerBadge() {
    if (ownerBadge) {
        ownerBadge.style.display = OWNER_SETTINGS.showBadge ? 'inline-block' : 'none';
    }
    if (showOwnerBadge) {
        showOwnerBadge.checked = OWNER_SETTINGS.showBadge;
    }
}

if (showOwnerBadge) {
    showOwnerBadge.addEventListener('change', (e) => {
        OWNER_SETTINGS.showBadge = e.target.checked;
        updateOwnerBadge();
        saveOwnerSettings();
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
            
            await loadUserSettings();
            
            ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
            
            authScreen.style.display = 'none';
            app.style.display = 'flex';
            if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
            
            if (ADMIN_RIGHTS) {
                if (adminButton) adminButton.style.display = 'block';
            }
            
            if (isOwner()) {
                if (ownerTab) ownerTab.style.display = 'block';
                await loadOwnerSettings();
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
                privacy_settings: {
                    show_phone: 'everyone',
                    who_can_write: 'everyone',
                    last_seen: 'everyone',
                    show_owner_badge: true
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

async function searchUsers() {
    if (!searchInput || !searchResultsList || !CURRENT_USER) return;
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    try {
        const { data: users, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .neq('phone', CURRENT_USER.phone)
            .or(`phone.ilike.%${query}%,username.ilike.%${query}%`);
        
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
        
        if (chatOwnerBadge) {
            chatOwnerBadge.style.display = (CURRENT_CHAT.phone === OWNER_PHONE && OWNER_SETTINGS.showBadge) ? 'inline-block' : 'none';
        }
        
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
                
                if (m.voice_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} voice-message" 
                         data-id="${m.id}" 
                         data-type="private"
                         onclick="playVoiceMessage('${m.voice_data}')">
                        <span><i class="fas fa-microphone"></i></span>
                        <div class="voice-waveform">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        <span class="voice-duration">${formatDuration(m.voice_duration)}</span>
                    </div>`;
                }
                
                if (m.circle_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} video-circle-message" 
                         data-id="${m.id}" 
                         data-type="private"
                         onclick="playCircleMessage('${m.circle_data}')">
                        <video src="${m.circle_data}" style="display:none;"></video>
                        <span class="play-icon"><i class="fas fa-play"></i></span>
                        <span class="voice-duration" style="position:absolute;bottom:5px;right:5px;">${formatDuration(m.circle_duration)}</span>
                    </div>`;
                }
                
                if (m.file_data) {
                    if (m.file_type?.startsWith('image/')) {
                        return `
                        <div class="message ${isSent ? 'sent' : 'received'}" 
                             data-id="${m.id}" 
                             data-type="private">
                            <img src="${m.file_data}" class="message-image" onclick="viewImage('${m.file_data}')">
                            <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                        </div>`;
                    } else {
                       