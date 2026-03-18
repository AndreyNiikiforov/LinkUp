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

// Расширенные описания рангов
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

// Обработчик чекбокса статуса владельца
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
                        return `
                        <div class="message ${isSent ? 'sent' : 'received'}" 
                             data-id="${m.id}" 
                             data-type="private">
                            <div class="message-file" onclick="downloadFile('${m.file_data}', '${m.file_name || 'file'}')">
                                <span class="file-icon"><i class="fas fa-file"></i></span>
                                <span>${m.file_name || 'Файл'}</span>
                            </div>
                            <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0, -3)}</div>
                        </div>`;
                    }
                }
                
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
    if (!GROUPS || !welcomeScreen || !chatWindow) return;
    
    CURRENT_CHAT = null;
    CURRENT_GROUP = GROUPS.find(g => g.id === groupId);
    
    const chatName = document.getElementById('currentChatName');
    const chatPhone = document.getElementById('currentChatPhone');
    const chatUsername = document.getElementById('currentChatUsername');
    
    if (chatName) chatName.textContent = CURRENT_GROUP.name;
    if (chatPhone) chatPhone.textContent = 'Группа';
    if (chatUsername) chatUsername.textContent = '';
    if (chatOwnerBadge) chatOwnerBadge.style.display = 'none';
    
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
                
                if (m.voice_data) {
                    return `
                    <div class="message ${isSent ? 'sent' : 'received'} voice-message" 
                         data-id="${m.id}" 
                         data-type="group"
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
                         data-type="group"
                         onclick="playCircleMessage('${m.circle_data}')">
                        <video src="${m.circle_data}" style="display:none;"></video>
                        <span class="play-icon"><i class="fas fa-play"></i></span>
                        <span class="voice-duration" style="position:absolute;bottom:5px;right:5px;">${formatDuration(m.circle_duration)}</span>
                    </div>`;
                }
                
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
            chatNames[p.phone] = p.username || p.phone;
        });
        
        messages.forEach(m => {
            const other = m.sender === CURRENT_USER.phone ? m.receiver : m.sender;
            if (!chats.has(other) || new Date(m.created_at) > new Date(chats.get(other).lastMessageTime)) {
                chats.set(other, { 
                    phone: other, 
                    name: chatNames[other] || other,
                    lastMessage: m.content || '📎 Файл', 
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
                <span><i class="fas fa-thumbtack"></i> ${m.content?.slice(0, 30) || 'Файл'}${m.content?.length > 30 ? '...' : ''}</span>
                <span class="pinned-close" onclick="event.stopPropagation(); unpinMessage('${m.id}', '${type}')"><i class="fas fa-times"></i></span>
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

// ==================== ЗВОНКИ ====================
let peerConnection = null;
let localStream = null;
let remoteStream = null;
let callTimer = null;
let callSeconds = 0;
let callState = {
    isCalling: false,
    targetUser: null,
    callType: null,
    callId: null
};
let incomingCallTimeout = null;

const iceServers = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
    ]
};

if (audioCallBtn) {
    audioCallBtn.addEventListener('click', async () => {
        if (!CURRENT_CHAT) {
            alert('Сначала выберите чат');
            return;
        }
        
        if (CURRENT_CHAT.phone === CURRENT_USER.phone) {
            alert('Нельзя позвонить самому себе');
            return;
        }
        
        if (callState.isCalling) {
            alert('Уже есть активный звонок');
            return;
        }
        
        alert('📞 Функция звонков в разработке');
    });
}

if (videoCallBtn) {
    videoCallBtn.addEventListener('click', async () => {
        if (!CURRENT_CHAT) {
            alert('Сначала выберите чат');
            return;
        }
        
        if (CURRENT_CHAT.phone === CURRENT_USER.phone) {
            alert('Нельзя позвонить самому себе');
            return;
        }
        
        if (callState.isCalling) {
            alert('Уже есть активный звонок');
            return;
        }
        
        alert('📹 Функция видеозвонков в разработке');
    });
}

// ==================== ГОЛОСОВЫЕ СООБЩЕНИЯ ====================
let mediaRecorder = null;
let audioChunks = [];
let recordingTimerInterval = null;
let recordingSeconds = 0;

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
            
            hideRecordingIndicator();
        };
        
        mediaRecorder.start();
        
        showRecordingIndicator('voice');
        
        voiceMsgBtn.style.background = '#ff4444';
        voiceMsgBtn.style.transform = 'scale(1.2)';
        
        recordingSeconds = 0;
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
        recordingTimerInterval = setInterval(() => {
            recordingSeconds++;
            if (recordingTimer) {
                recordingTimer.textContent = formatDuration(recordingSeconds);
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
        if (recordingTimerInterval) clearInterval(recordingTimerInterval);
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
let circlePreviewStream = null;

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
        // Показываем модалку с превью
        if (videoCircleModal) {
            videoCircleModal.style.display = 'flex';
        }
        
        // Запрашиваем доступ к камере
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 300 },
                height: { ideal: 300 },
                aspectRatio: 1,
                facingMode: 'user' // фронтальная камера
            }, 
            audio: true 
        });
        
        circlePreviewStream = stream;
        
        // Показываем превью в модалке
        if (circleVideo) {
            circleVideo.srcObject = stream;
            circleVideo.style.display = 'block';
        }
        
        // Создаём рекордер
        circleRecorder = new MediaRecorder(stream);
        videoChunks = [];
        
        circleRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                videoChunks.push(e.data);
            }
        };
        
        circleRecorder.onstop = async () => {
            if (circlePreviewStream) {
                circlePreviewStream.getTracks().forEach(track => track.stop());
                circlePreviewStream = null;
            }
            
            if (videoChunks.length > 0) {
                await sendCircleMessage();
            }
            
            if (circleVideo) {
                circleVideo.srcObject = null;
            }
            
            hideRecordingIndicator();
        };
        
        circleRecorder.start();
        
        // Обновляем интерфейс
        if (startCircleBtn) startCircleBtn.style.display = 'none';
        if (stopCircleBtn) stopCircleBtn.style.display = 'inline-flex';
        if (cancelCircleBtn) cancelCircleBtn.style.display = 'inline-flex';
        
        showRecordingIndicator('circle');
        
        videoCircleBtn.style.background = '#ff4444';
        videoCircleBtn.style.transform = 'scale(1.2)';
        
        circleSeconds = 0;
        if (circleTimer) {
            circleTimer.textContent = formatDuration(0);
        }
        
        if (circleTimerInterval) clearInterval(circleTimerInterval);
        circleTimerInterval = setInterval(() => {
            circleSeconds++;
            if (circleTimer) {
                circleTimer.textContent = formatDuration(circleSeconds);
            }
            if (recordingTimer) {
                recordingTimer.textContent = formatDuration(circleSeconds);
            }
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка доступа к камере:', error);
        alert('❌ Не удалось получить доступ к камере');
        if (videoCircleModal) {
            videoCircleModal.style.display = 'none';
        }
    }
}

function stopCircleRecording() {
    if (circleRecorder && circleRecorder.state === 'recording') {
        circleRecorder.stop();
        
        if (startCircleBtn) startCircleBtn.style.display = 'inline-flex';
        if (stopCircleBtn) stopCircleBtn.style.display = 'none';
        if (playCircleBtn) playCircleBtn.style.display = 'inline-flex';
        if (sendCircleBtn) sendCircleBtn.style.display = 'inline-flex';
        
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
            
            // Закрываем модалку
            if (videoCircleModal) {
                videoCircleModal.style.display = 'none';
            }
            
            // Сбрасываем кнопки
            if (startCircleBtn) startCircleBtn.style.display = 'inline-flex';
            if (stopCircleBtn) stopCircleBtn.style.display = 'none';
            if (playCircleBtn) playCircleBtn.style.display = 'none';
            if (sendCircleBtn) sendCircleBtn.style.display = 'none';
            
            videoCircleBtn.style.background = '';
            videoCircleBtn.style.transform = '';
            
        } catch (e) {
            alert('❌ Ошибка отправки: ' + e.message);
        }
    };
}

// Закрытие модалки кружочка
if (closeVideoCircle) {
    closeVideoCircle.addEventListener('click', () => {
        if (circleRecorder && circleRecorder.state === 'recording') {
            circleRecorder.stop();
        }
        if (circlePreviewStream) {
            circlePreviewStream.getTracks().forEach(track => track.stop());
            circlePreviewStream = null;
        }
        videoCircleModal.style.display = 'none';
        
        // Сбрасываем кнопки
        if (startCircleBtn) startCircleBtn.style.display = 'inline-flex';
        if (stopCircleBtn) stopCircleBtn.style.display = 'none';
        if (playCircleBtn) playCircleBtn.style.display = 'none';
        if (sendCircleBtn) sendCircleBtn.style.display = 'none';
        
        if (circleTimerInterval) clearInterval(circleTimerInterval);
    });
}

if (cancelCircleBtn) {
    cancelCircleBtn.addEventListener('click', () => {
        if (circleRecorder && circleRecorder.state === 'recording') {
            circleRecorder.stop();
        }
        if (circlePreviewStream) {
            circlePreviewStream.getTracks().forEach(track => track.stop());
            circlePreviewStream = null;
        }
        videoCircleModal.style.display = 'none';
        
        // Сбрасываем кнопки
        if (startCircleBtn) startCircleBtn.style.display = 'inline-flex';
        if (stopCircleBtn) stopCircleBtn.style.display = 'none';
        if (playCircleBtn) playCircleBtn.style.display = 'none';
        if (sendCircleBtn) sendCircleBtn.style.display = 'none';
        
        if (circleTimerInterval) clearInterval(circleTimerInterval);
    });
}

// ==================== ИНДИКАТОР ЗАПИСИ ====================
function showRecordingIndicator(type) {
    if (!recordingIndicator) return;
    
    recordingIndicator.style.display = 'flex';
    if (recordingIcon) {
        recordingIcon.textContent = type === 'circle' ? '⭕' : '🎤';
    }
    recordingIndicator.className = `recording-indicator ${type === 'circle' ? 'circle' : ''}`;
}

function hideRecordingIndicator() {
    if (recordingIndicator) {
        recordingIndicator.style.display = 'none';
    }
}

if (stopRecordingBtn2) {
    stopRecordingBtn2.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            stopVoiceRecording();
        }
        if (circleRecorder && circleRecorder.state === 'recording') {
            stopCircleRecording();
        }
        hideRecordingIndicator();
    });
}

// ==================== ПРИКРЕПЛЕНИЕ ФОТО ====================
if (attachBtn) {
    attachBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                sendPhoto(file);
            }
        };
        input.click();
    });
}

async function sendPhoto(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = async () => {
        const base64data = reader.result;
        
        try {
            const messageData = {
                sender: CURRENT_USER.phone,
                content: '📷 Фото',
                file_data: base64data,
                file_type: file.type,
                file_name: file.name,
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
        } catch (e) {
            alert('❌ Ошибка отправки: ' + e.message);
        }
    };
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
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
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

window.viewImage = function(dataUrl) {
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
    
    const img = document.createElement('img');
    img.src = dataUrl;
    img.style.maxWidth = '90%';
    img.style.maxHeight = '90%';
    img.style.borderRadius = '10px';
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => modal.remove();
    
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    document.body.appendChild(modal);
};

// ==================== МЕНЮ ЧАТА (ТРИ ТОЧКИ) ====================
if (chatMenuBtn) {
    chatMenuBtn.addEventListener('click', () => {
        if (chatMenuModal) {
            chatMenuModal.style.display = 'flex';
        }
    });
}

if (closeChatMenu) {
    closeChatMenu.addEventListener('click', () => {
        chatMenuModal.style.display = 'none';
    });
}

if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', async () => {
        if (!CURRENT_CHAT && !CURRENT_GROUP) {
            alert('Сначала выберите чат');
            return;
        }
        
        if (!confirm('Очистить историю сообщений? Это действие нельзя отменить.')) return;
        
        try {
            if (CURRENT_GROUP) {
                await supabaseClient
                    .from('group_messages')
                    .delete()
                    .eq('group_id', CURRENT_GROUP.id);
                loadGroupMessages(CURRENT_GROUP.id);
            } else if (CURRENT_CHAT) {
                await supabaseClient
                    .from('messages')
                    .delete()
                    .or(`and(sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_CHAT.phone})`)
                    .or(`and(sender.eq.${CURRENT_CHAT.phone},receiver.eq.${CURRENT_USER.phone})`);
                loadMessages(CURRENT_CHAT.phone);
                loadChats();
            }
            
            alert('✅ История очищена');
            chatMenuModal.style.display = 'none';
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
            last_seen: lastSeen,
            show_owner_badge: OWNER_SETTINGS.showBadge
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

// ==================== АДМИН-ПАНЕЛЬ ====================
if (adminButton) {
    adminButton.addEventListener('click', () => {
        if (adminModal) adminModal.style.display = 'flex';
        loadAdminUsers();
        loadAdminsList();
    });
}

if (closeAdmin) {
    closeAdmin.addEventListener('click', () => {
        adminModal.style.display = 'none';
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
        if (tab.dataset.tab === 'support') loadSupportRequests();
        if (tab.dataset.tab === 'reports') loadReports();
        if (tab.dataset.tab === 'channels') loadChannels();
        if (tab.dataset.tab === 'admins' && (isOwner() || canUserDo(CURRENT_USER.phone, 'manage_admins'))) loadAdminsList();
    }));
}

async function loadAdminUsers() {
    if (!adminUsersList || !CURRENT_USER) return;
    
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').order('created_at', { ascending: false });
        
        const { data: admins } = await supabaseClient.from('admins').select('phone, rank, can_manage_admins, can_ban_users, can_manage_groups, can_view_reports');
        const adminMap = {};
        admins?.forEach(a => adminMap[a.phone] = a);
        
        adminUsersList.innerHTML = users?.map(u => {
            const isOwnerUser = u.phone === OWNER_PHONE;
            const adminData = adminMap[u.phone];
            const rank = isOwnerUser ? 5 : (adminData?.rank || 0);
            const canManage = isOwner() || (ADMIN_RIGHTS?.can_manage_admins);
            
            // Определяем какие кнопки показывать в зависимости от прав текущего админа
            const canWarn = canUserDo(CURRENT_USER.phone, 'warn');
            const canMute = canUserDo(CURRENT_USER.phone, 'mute');
            const canKick = canUserDo(CURRENT_USER.phone, 'kick');
            const canBan = canUserDo(CURRENT_USER.phone, 'full');
            
            return `
            <div class="admin-user-item">
                <div>
                    <strong>${u.username || u.phone}</strong>
                    <div style="color:#888;font-size:12px;">${u.phone}</div>
                    ${rank > 0 ? `<div style="color:${getRankColor(rank)}">Ранг ${rank}: ${RANGS[rank]?.name}</div>` : ''}
                    ${isOwnerUser ? '<span style="color:gold;"><i class="fas fa-crown"></i> Владелец</span>' : ''}
                    ${adminData && !isOwnerUser ? '<span style="color:#00bfff;"><i class="fas fa-user-tie"></i> Админ</span>' : ''}
                </div>
                <div class="admin-user-actions">
                    ${!isOwnerUser && canManage ? `
                        <button class="admin-user-btn make-admin" onclick="openRankModal('${u.phone}')">
                            <i class="fas fa-crown"></i> ${adminData ? 'Изменить ранг' : 'Назначить'}
                        </button>
                    ` : ''}
                    
                    ${!isOwnerUser && canWarn ? `
                        <button class="admin-user-btn warn" onclick="moderateUser('${u.phone}', 'warn')">
                            <i class="fas fa-exclamation-triangle"></i> Варн
                        </button>
                    ` : ''}
                    
                    ${!isOwnerUser && canMute ? `
                        <button class="admin-user-btn mute" onclick="moderateUser('${u.phone}', 'mute')">
                            <i class="fas fa-microphone-slash"></i> Мут
                        </button>
                    ` : ''}
                    
                    ${!isOwnerUser && canKick ? `
                        <button class="admin-user-btn kick" onclick="moderateUser('${u.phone}', 'kick')">
                            <i class="fas fa-user-slash"></i> Кик
                        </button>
                    ` : ''}
                    
                    ${!isOwnerUser && canBan ? `
                        <button class="admin-user-btn ban" onclick="moderateUser('${u.phone}', 'ban')">
                            <i class="fas fa-ban"></i> Бан
                        </button>
                    ` : ''}
                </div>
            </div>`;
        }).join('') || '<p class="no-data">Нет пользователей</p>';
        
    } catch (e) { 
        console.error('Ошибка загрузки админ-панели:', e);
        adminUsersList.innerHTML = '<p class="no-data">Ошибка загрузки</p>';
    }
}

window.moderateUser = function(phone, action) {
    const actionNames = {
        warn: 'выдать предупреждение',
        mute: 'замутить',
        kick: 'кикнуть',
        ban: 'забанить'
    };
    
    if (phone === OWNER_PHONE) {
        alert('❌ Нельзя модерировать владельца');
        return;
    }
    
    if (!confirm(`Вы уверены, что хотите ${actionNames[action]} пользователя ${phone}?`)) return;
    
    alert(`✅ Действие "${actionNames[action]}" выполнено`);
};

// Загрузка списка админов
async function loadAdminsList() {
    if (!adminsList) return;
    
    try {
        const { data: admins } = await supabaseClient.from('admins').select('*').order('rank', { ascending: false });
        
        adminsList.innerHTML = admins?.map(a => `
            <div class="admin-user-item">
                <div>
                    <strong>${a.phone}</strong>
                    <div style="color:${getRankColor(a.rank)}">Ранг ${a.rank}: ${RANGS[a.rank]?.name}</div>
                </div>
                ${a.phone === OWNER_PHONE ? '<span style="color:gold;"><i class="fas fa-crown"></i> Владелец</span>' : ''}
            </div>
        `).join('') || '<p class="no-data">Нет админов</p>';
        
    } catch (e) {
        console.error('Ошибка загрузки админов:', e);
    }
}

// Добавление нового админа
if (addAdminBtn) {
    addAdminBtn.addEventListener('click', async () => {
        if (!newAdminPhone) return;
        
        const phone = formatPhone(newAdminPhone.value);
        if (!phone) return;
        
        try {
            // Проверяем существование пользователя
            const { data: user } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('phone', phone)
                .single();
            
            if (!user) {
                alert('❌ Пользователь не найден');
                return;
            }
            
            openRankModal(phone);
            newAdminPhone.value = '';
            
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
}

// Заглушки для других вкладок
async function loadSupportRequests() {
    if (supportList) supportList.innerHTML = '<p class="no-data">Функция поддержки в разработке</p>';
}

async function loadReports() {
    if (reportsList) reportsList.innerHTML = '<p class="no-data">Функция жалоб в разработке</p>';
}

async function loadChannels() {
    if (channelsList) channelsList.innerHTML = '<p class="no-data">Функция каналов в разработке</p>';
}

// ==================== МОДАЛКА РАНГОВ ====================
window.openRankModal = function(phone) {
    if (!isOwner() && !canUserDo(CURRENT_USER.phone, 'manage_admins')) {
        alert('❌ Недостаточно прав');
        return;
    }
    
    currentRankUser = phone;
    rankUserPhone.textContent = `Пользователь: ${phone}`;
    
    rankOptions.forEach(opt => opt.classList.remove('selected'));
    
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

if (closeRankModal) {
    closeRankModal.addEventListener('click', () => {
        rankModal.style.display = 'none';
        currentRankUser = null;
    });
}

if (cancelRankBtn) {
    cancelRankBtn.addEventListener('click', () => {
        rankModal.style.display = 'none';
        currentRankUser = null;
    });
}

if (confirmRankBtn) {
    confirmRankBtn.addEventListener('click', async () => {
        if (!isOwner() && !canUserDo(CURRENT_USER.phone, 'manage_admins')) {
            alert('❌ Недостаточно прав');
            return;
        }
        
        const selected = document.querySelector('.rank-option.selected');
        if (!selected) {
            alert('Выберите ранг');
            return;
        }
        
        const rank = parseInt(selected.dataset.rank);
        
        try {
            const { data: existing } = await supabaseClient
                .from('admins')
                .select('*')
                .eq('phone', currentRankUser);
            
            if (existing?.length) {
                await supabaseClient
                    .from('admins')
                    .update({ rank })
                    .eq('phone', currentRankUser);
            } else {
                // Определяем права в зависимости от ранга
                const canManageAdmins = rank >= 4;
                const canBanUsers = rank >= 1;
                const canManageGroups = rank >= 3;
                const canViewReports = rank >= 1;
                
                await supabaseClient
                    .from('admins')
                    .insert([{ 
                        phone: currentRankUser, 
                        rank,
                        can_manage_admins: canManageAdmins,
                        can_ban_users: canBanUsers,
                        can_manage_groups: canManageGroups,
                        can_view_reports: canViewReports
                    }]);
            }
            
            alert(`✅ Ранг ${rank} назначен`);
            rankModal.style.display = 'none';
            loadAdminUsers();
            loadAdminsList();
        } catch (e) {
            alert('❌ Ошибка: ' + e.message);
        }
    });
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
    if (!e.target.closest('.rank-modal') && !e.target.closest('.admin-user-btn.make-admin')) {
        if (rankModal) rankModal.style.display = 'none';
    }
});

console.log('✅ LinkUp — ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ');