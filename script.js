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

// Меню чата (три точки)
const chatMenuModal = document.getElementById('chatMenuModal');
const closeChatMenu = document.getElementById('closeChatMenu');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

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
        if (currentUserName) currentUserName.textContent = data.username || CURRENT_USER.phone;
        if (currentUserUsername) currentUserUsername.textContent = data.username ? '@' + data.username : '';
    }
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
            
            authScreen.style.display = 'none';
            app.style.display = 'flex';
            if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
            
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
                password: pass
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
                        <span>🎤</span>
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
                        <span class="play-icon">▶️</span>
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
                             data-type="private"
                             onclick="downloadFile('${m.file_data}', '${m.file_name || 'file'}')">
                            <div class="message-file">
                                <span class="file-icon">📎</span>
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
                        <span>🎤</span>
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
                        <span class="play-icon">▶️</span>
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
        messages.forEach(m => {
            const other = m.sender === CURRENT_USER.phone ? m.receiver : m.sender;
            if (!chats.has(other) || new Date(m.created_at) > new Date(chats.get(other).lastMessageTime)) {
                chats.set(other, { 
                    phone: other, 
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
                    <span class="chat-name">${c.phone}</span>
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
                <span>📌 ${m.content?.slice(0, 30) || 'Файл'}${m.content?.length > 30 ? '...' : ''}</span>
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

// ==================== ЗВОНКИ ====================
let peerConnection = null;
let localStream = null;
let remoteStream = null;
let callTimer = null;
let callSeconds = 0;
let callState = {
    isCalling: false,
    targetUser: null,
    callType: null
};

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
                timer.textContent = formatDuration(recordingSeconds);
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
                timer.textContent = formatDuration(circleSeconds);
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
    timer.textContent = '0:00';
    
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
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        if (currentUserPhone) currentUserPhone.textContent = CURRENT_USER.phone;
        
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

console.log('✅ LinkUp — ПОЛНАЯ РАБОЧАЯ ВЕРСИЯ');