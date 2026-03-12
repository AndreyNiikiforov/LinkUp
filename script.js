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

// MAX баннер
const maxBanner = document.getElementById('maxBanner');
const showMaxBind = document.getElementById('showMaxBind');
const closeMaxBanner = document.getElementById('closeMaxBanner');

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
    showRegisterButton.style.display = 'none';
    registerForm.style.display = 'block';
    authMessage.textContent = '';
});

backToLoginButton?.addEventListener('click', () => {
    loginForm.style.display = 'block';
    showRegisterButton.style.display = 'block';
    registerForm.style.display = 'none';
    authMessage.textContent = '';
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
    
    const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
    };
    
    const deviceName = /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? '📱 Мобильное' : '💻 Компьютер';
    
    try {
        // Сначала сбрасываем флаг is_current у всех сессий
        await supabaseClient
            .from('sessions')
            .update({ is_current: false })
            .eq('user_phone', CURRENT_USER.phone);
        
        // Сохраняем новую сессию
        await supabaseClient
            .from('sessions')
            .insert([{
                user_phone: CURRENT_USER.phone,
                device_name: deviceName,
                device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
                ip: '0.0.0.0', // В реальности нужно получать IP с сервера
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
        
        CURRENT_USER = users[0];
        CURRENT_SESSION_TOKEN = generateSessionToken();
        saveSession(CURRENT_USER);
        
        // Сохраняем сессию в БД
        await saveSessionToDB();
        
        // Загружаем настройки
        await loadUserSettings();
        
        // Загружаем права админа
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
        }
        
        // Показываем баннер MAX (если не привязан)
        setTimeout(() => {
            maxBanner.style.display = 'block';
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
        // Проверяем номер
        const { data: existingPhone } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone);
        
        if (existingPhone?.length) {
            authMessage.textContent = '❌ Номер уже зарегистрирован';
            return;
        }
        
        // Проверяем username
        const { data: existingUsername } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('username', username);
        
        if (existingUsername?.length) {
            authMessage.textContent = '❌ Username уже занят';
            return;
        }
        
        // Создаём пользователя
        await supabaseClient.from('profiles').insert([{ 
            phone, 
            username,
            password: pass,
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
            // Поиск по всему
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
        
        // Загружаем данные при переключении
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
    
    // Устанавливаем радиокнопки
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
        // Проверяем, не занят ли username
        const { data: existing } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('username', newUsername)
            .neq('phone', CURRENT_USER.phone);
        
        if (existing?.length) {
            alert('❌ Username уже занят');
            return;
        }
        
        // Обновляем username
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

// ==================== ПРИВЯЗКИ (ЗАГОТОВКИ) ====================
linkGoogle?.addEventListener('click', () => {
    alert('🔐 Привязка Google будет доступна в следующем обновлении!');
});

linkEmail?.addEventListener('click', () => {
    alert('📧 Привязка почты будет доступна в следующем обновлении!');
});

linkMax?.addEventListener('click', () => {
    alert('💬 Привязка MAX будет доступна в следующем обновлении!');
});

// ==================== MAX БАННЕР ====================
closeMaxBanner?.addEventListener('click', () => {
    maxBanner.style.display = 'none';
});

showMaxBind?.addEventListener('click', () => {
    alert('🔒 Функция привязки MAX будет доступна в следующем обновлении!');
    maxBanner.style.display = 'none';
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
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        
        // Обновляем активность сессии
        if (CURRENT_SESSION_TOKEN) {
            await supabaseClient
                .from('sessions')
                .update({ last_active: new Date() })
                .eq('session_token', CURRENT_SESSION_TOKEN);
        }
        
        loadChats();
        loadGroups();
        
        // Показываем баннер MAX
        setTimeout(() => {
            maxBanner.style.display = 'block';
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

console.log('✅ LinkUp — Этап 2: Настройки профиля, приватность и устройства');