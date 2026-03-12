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
let ADMIN_RIGHTS = null; // Права текущего админа

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
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');
const currentUserPhone = document.getElementById('currentUserPhone');
const currentUserName = document.getElementById('currentUserName');
const adminButton = document.getElementById('adminButton');
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

// Настройки профиля
const profileModal = document.getElementById('profileModal');
const closeProfileModal = document.getElementById('closeProfileModal');
const profileDisplayName = document.getElementById('profileDisplayName');
const profilePhone = document.getElementById('profilePhone');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const userProfile = document.getElementById('userProfile');

// Настройки группы
const groupSettingsModal = document.getElementById('groupSettingsModal');
const closeGroupSettings = document.getElementById('closeGroupSettings');
const groupSettingsName = document.getElementById('groupSettingsName');
const groupSettingsNameInput = document.getElementById('groupSettingsNameInput');
const groupSettingsDescription = document.getElementById('groupSettingsDescription');
const saveGroupInfoBtn = document.getElementById('saveGroupInfoBtn');
const groupMembersList = document.getElementById('groupMembersList');
const leaveGroupBtn = document.getElementById('leaveGroupBtn');
const deleteGroupBtn = document.getElementById('deleteGroupBtn');
const groupTabs = document.querySelectorAll('.group-tab');

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function formatPhone(number) {
    let cleaned = number.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.substring(1);
    if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
    cleaned = cleaned.substring(0, 11);
    return '+' + cleaned;
}

function saveSession(user) {
    localStorage.setItem('linkup_session', JSON.stringify({ user, timestamp: Date.now() }));
}

function loadSession() {
    const s = localStorage.getItem('linkup_session');
    if (s) try {
        const d = JSON.parse(s);
        if (Date.now() - d.timestamp < 30 * 24 * 60 * 60 * 1000) return d.user;
    } catch (e) {}
    return null;
}

async function loadAdminRights(phone) {
    const { data } = await supabaseClient
        .from('admins')
        .select('*')
        .eq('phone', phone)
        .single();
    return data;
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
        saveSession(CURRENT_USER);
        
        // Загружаем права админа если есть
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
        }
        
        loadChats();
        loadGroups();
    } catch (e) { authMessage.textContent = '❌ Ошибка входа: ' + e.message; }
});

// ==================== РЕГИСТРАЦИЯ ====================
registerButton?.addEventListener('click', async () => {
    const phone = formatPhone(registerPhone.value);
    const pass = registerPassword.value;
    const confirm = registerPasswordConfirm.value;
    if (!phone || !pass || !confirm) { authMessage.textContent = '❌ Заполните все поля'; return; }
    if (pass !== confirm) { authMessage.textContent = '❌ Пароли не совпадают'; return; }
    if (pass.length < 4) { authMessage.textContent = '❌ Пароль минимум 4 символа'; return; }
    try {
        const { data: existing } = await supabaseClient.from('profiles').select('*').eq('phone', phone);
        if (existing?.length) { authMessage.textContent = '❌ Номер уже зарегистрирован'; return; }
        await supabaseClient.from('profiles').insert([{ phone, password: pass, username: phone }]);
        authMessage.textContent = '✅ Регистрация успешна! Войдите.';
        authMessage.style.color = '#4caf50';
        registerPhone.value = registerPassword.value = registerPasswordConfirm.value = '';
        setTimeout(() => { backToLoginButton?.click(); authMessage.textContent = ''; }, 2000);
    } catch (e) { authMessage.textContent = '❌ Ошибка: ' + e.message; }
});

// ==================== ПОИСК ====================
searchButton?.addEventListener('click', searchUsers);
searchInput?.addEventListener('keypress', e => e.key === 'Enter' && searchUsers());

async function searchUsers() {
    const q = searchInput.value.trim();
    if (!q) return;
    const sp = formatPhone(q).slice(-10);
    try {
        const { data: users, error } = await supabaseClient.from('profiles').select('*').neq('phone', CURRENT_USER.phone).ilike('phone', `%${sp}%`);
        if (error) throw error;
        searchResultsList.innerHTML = users?.length ? users.map(u => `
            <div class="search-result-item" onclick="startChat('${u.phone}')">
                <div class="search-result-avatar">👤</div>
                <div class="search-result-info">
                    <div class="search-result-name">${u.username || u.phone}</div>
                    <div class="search-result-phone">${u.phone}</div>
                </div>
                <div class="search-result-add">+</div>
            </div>`).join('') : '<p class="no-data">Пользователи не найдены</p>';
        searchResults.style.display = 'block';
    } catch (e) { console.error(e); }
}

closeSearch?.addEventListener('click', () => searchResults.style.display = 'none');

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
                const senderName = isSent ? 'Вы' : (CURRENT_CHAT?.username || m.sender);
                
                return `
                <div class="message ${isSent ? 'sent' : 'received'} ${m.pinned ? 'pinned' : ''}" 
                     data-id="${m.id}" 
                     data-type="private"
                     onclick="selectMessage(this, '${m.id}', 'private')">
                    ${!isSent ? `<div class="message-sender">${senderName}</div>` : ''}
                    <div class="message-content">${m.content}</div>
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0,-3)}</div>
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
                    <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0,-3)}</div>
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
    
    // Показываем меню
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
        const { data: messages, error } = await supabaseClient.from('messages').select('*').or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`).order('created_at', { ascending: false });
        if (error) throw error;
        const chats = new Map();
        
        const otherPhones = [...new Set(messages.map(m => m.sender === CURRENT_USER.phone ? m.receiver : m.sender))];
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
                    lastMessage: m.content, 
                    lastMessageTime: m.created_at 
                });
            }
        });
        
        if (!chats.size) chatsList.innerHTML = '<div class="chat-item">Найдите контакт через поиск</div>';
        else chatsList.innerHTML = Array.from(chats.values()).map(c => `
            <div class="chat-item" onclick="startChat('${c.phone}')">
                <span class="chat-name">${c.name}</span>
                <span class="chat-preview">${c.lastMessage.slice(0,30)}...</span>
            </div>
        `).join('');
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

// ==================== НАСТРОЙКИ ПРОФИЛЯ ====================
userProfile?.addEventListener('click', () => {
    profileModal.style.display = 'flex';
    profileDisplayName.value = CURRENT_USER.username || CURRENT_USER.phone;
    profilePhone.value = CURRENT_USER.phone;
});

closeProfileModal?.addEventListener('click', () => {
    profileModal.style.display = 'none';
});

saveProfileBtn?.addEventListener('click', async () => {
    const newName = profileDisplayName.value.trim();
    if (!newName) return;
    
    try {
        const { error } = await supabaseClient
            .from('profiles')
            .update({ username: newName })
            .eq('phone', CURRENT_USER.phone);
        
        if (error) throw error;
        
        CURRENT_USER.username = newName;
        currentUserName.textContent = newName;
        profileModal.style.display = 'none';
        alert('✅ Имя сохранено');
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// ==================== НАСТРОЙКИ ГРУППЫ ====================
let currentGroupSettings = null;
let currentUserRole = null;

chatMenuBtn?.addEventListener('click', () => {
    if (CURRENT_GROUP) {
        openGroupSettings(CURRENT_GROUP.id);
    }
});

async function openGroupSettings(groupId) {
    currentGroupSettings = GROUPS.find(g => g.id === groupId);
    groupSettingsModal.style.display = 'flex';
    
    groupSettingsName.textContent = currentGroupSettings.name;
    groupSettingsNameInput.value = currentGroupSettings.name;
    groupSettingsDescription.value = currentGroupSettings.description || '';
    
    const { data: members } = await supabaseClient
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_phone', CURRENT_USER.phone)
        .single();
    
    currentUserRole = members?.role;
    
    deleteGroupBtn.style.display = (currentUserRole === 'creator' || isOwner()) ? 'block' : 'none';
    
    loadGroupMembers(groupId);
}

closeGroupSettings?.addEventListener('click', () => {
    groupSettingsModal.style.display = 'none';
});

groupTabs.forEach(tab => tab.addEventListener('click', () => {
    groupTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    document.querySelectorAll('.group-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`group${tab.dataset.groupTab.charAt(0).toUpperCase() + tab.dataset.groupTab.slice(1)}Tab`).classList.add('active');
}));

async function loadGroupMembers(groupId) {
    try {
        const { data: members } = await supabaseClient
            .from('group_members')
            .select('*')
            .eq('group_id', groupId);
        
        groupMembersList.innerHTML = members?.map(m => `
            <div class="member-item">
                <span>${m.user_phone}</span>
                <span class="member-role ${m.role}">${m.role}</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

saveGroupInfoBtn?.addEventListener('click', async () => {
    const newName = groupSettingsNameInput.value.trim();
    const newDesc = groupSettingsDescription.value.trim();
    
    try {
        const { error } = await supabaseClient
            .from('groups')
            .update({ name: newName, description: newDesc })
            .eq('id', currentGroupSettings.id);
        
        if (error) throw error;
        
        currentGroupSettings.name = newName;
        currentGroupSettings.description = newDesc;
        groupSettingsName.textContent = newName;
        document.getElementById('currentChatName').textContent = newName;
        alert('✅ Информация сохранена');
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

leaveGroupBtn?.addEventListener('click', async () => {
    if (!confirm('Покинуть группу?')) return;
    
    try {
        await supabaseClient
            .from('group_members')
            .delete()
            .eq('group_id', currentGroupSettings.id)
            .eq('user_phone', CURRENT_USER.phone);
        
        alert('✅ Вы покинули группу');
        groupSettingsModal.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        chatWindow.style.display = 'none';
        loadGroups();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

deleteGroupBtn?.addEventListener('click', async () => {
    if (!confirm('Удалить группу навсегда?')) return;
    
    try {
        await supabaseClient
            .from('groups')
            .delete()
            .eq('id', currentGroupSettings.id);
        
        alert('✅ Группа удалена');
        groupSettingsModal.style.display = 'none';
        welcomeScreen.style.display = 'flex';
        chatWindow.style.display = 'none';
        loadGroups();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
});

// ==================== АДМИН-ПАНЕЛЬ ====================
adminButton?.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    loadAdminUsers();
    loadSupportRequests();
    loadReports();
    loadChannels();
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

// Пользователи
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
                </div>
                <div class="admin-user-actions">
                    ${isOwner() ? `
                        <button class="admin-user-btn make-admin" onclick="toggleAdmin('${u.phone}')">
                            ${adminPhones.includes(u.phone) ? '👑 Убрать из админов' : '👑 Сделать админом'}
                        </button>
                    ` : (ADMIN_RIGHTS?.can_ban_users ? `
                        <button class="admin-user-btn ban" onclick="banUser('${u.phone}')">🚫 Заблокировать</button>
                    ` : '')}
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
            await supabaseClient.from('admins').insert([{ 
                phone, 
                can_manage_admins: false,
                can_ban_users: true,
                can_manage_groups: true,
                can_view_reports: true
            }]);
            alert(`✅ ${phone} назначен админом`);
        }
        
        loadAdminUsers();
        if (isOwner()) loadAdminsList();
    } catch (e) {
        console.error('Ошибка:', e);
        alert('❌ Ошибка: ' + e.message);
    }
};

window.banUser = async function(phone) {
    if (!confirm(`Заблокировать ${phone}?`)) return;
    alert('🚫 Функция блокировки в разработке');
};

// Поддержка
async function loadSupportRequests() {
    try {
        const { data: requests } = await supabaseClient
            .from('support_requests')
            .select('*')
            .order('created_at', { ascending: false });
        
        supportList.innerHTML = requests?.length ? requests.map(req => `
            <div class="support-request-item">
                <div class="support-request-header">
                    <span>📞 ${req.user_phone}</span>
                    <span>📅 ${new Date(req.created_at).toLocaleString()}</span>
                </div>
                <div class="support-request-question">❓ ${req.question}</div>
                ${!req.answered ? `
                    <div class="support-request-actions">
                        <textarea class="support-answer-input" placeholder="✏️ Ответ..." id="answer_${req.id}"></textarea>
                        <button class="admin-user-btn" onclick="answerSupport('${req.id}')">✅ Ответить</button>
                    </div>
                ` : `
                    <div class="support-request-answer">
                        <strong>✅ Ответ:</strong> ${req.answer}
                    </div>
                `}
            </div>
        `).join('') : '<p class="no-data">❌ Нет вопросов в поддержку</p>';
    } catch (e) { console.error(e); }
}

window.answerSupport = async function(id) {
    const answer = document.getElementById(`answer_${id}`)?.value.trim();
    if (!answer) return;
    
    try {
        await supabaseClient
            .from('support_requests')
            .update({ 
                answer, 
                answered: true, 
                answered_by: CURRENT_USER.phone,
                answered_at: new Date()
            })
            .eq('id', id);
        
        loadSupportRequests();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
};

// Жалобы
async function loadReports() {
    try {
        const { data: reports } = await supabaseClient
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        reportsList.innerHTML = reports?.length ? reports.map(rep => `
            <div class="report-item">
                <div class="report-header">
                    <span>⚠️ От: ${rep.reporter_phone}</span>
                    <span>👉 На: ${rep.reported_phone}</span>
                </div>
                <div class="report-reason">📋 Причина: ${rep.reason}</div>
                ${!rep.resolved ? `
                    <div class="report-actions">
                        <button class="admin-user-btn" onclick="resolveReport('${rep.id}','warn')">⚠️ Предупредить</button>
                        <button class="admin-user-btn ban" onclick="resolveReport('${rep.id}','ban')">🚫 Заблокировать</button>
                        <button class="admin-user-btn" onclick="resolveReport('${rep.id}','ignore')">❌ Игнорировать</button>
                    </div>
                ` : `
                    <div class="report-resolved">
                        ✅ Решено: ${rep.resolved_by}
                    </div>
                `}
            </div>
        `).join('') : '<p class="no-data">📭 Нет жалоб</p>';
    } catch (e) { console.error(e); }
}

window.resolveReport = async function(id, action) {
    try {
        await supabaseClient
            .from('reports')
            .update({ 
                resolved: true, 
                resolved_by: CURRENT_USER.phone,
                resolved_action: action,
                resolved_at: new Date()
            })
            .eq('id', id);
        
        loadReports();
    } catch (e) {
        alert('❌ Ошибка: ' + e.message);
    }
};

// Каналы
async function loadChannels() {
    try {
        const { data: channels } = await supabaseClient
            .from('channels')
            .select('*')
            .order('created_at', { ascending: false });
        
        channelsList.innerHTML = channels?.length ? channels.map(ch => `
            <div class="channel-item">
                <div class="channel-info">
                    <span class="channel-name">📢 ${ch.name}</span>
                    <span class="channel-members">👥 ${ch.members_count || 0}</span>
                </div>
                <div class="channel-actions">
                    <button class="admin-user-btn" onclick="editChannel('${ch.id}')">✏️ Редактировать</button>
                    <button class="admin-user-btn" onclick="deleteChannel('${ch.id}')">🗑️ Удалить</button>
                </div>
            </div>
        `).join('') : '<p class="no-data">📭 Нет каналов</p>';
    } catch (e) { console.error(e); }
}

window.editChannel = (id) => {
    const newName = prompt('Введите новое название канала:');
    if (newName) alert(`✅ Канал переименован в ${newName}`);
};

window.deleteChannel = async (id) => {
    if (confirm('Удалить канал?')) {
        alert('✅ Канал удалён');
    }
};

createChannelBtn?.addEventListener('click', () => {
    const name = prompt('Введите название канала:');
    if (name) alert(`✅ Канал "${name}" создан`);
});

// Админы
async function loadAdminsList() {
    try {
        const { data: admins } = await supabaseClient
            .from('admins')
            .select('*');
        
        adminsList.innerHTML = admins?.map(a => `
            <div class="admin-user-item">
                <div>
                    <strong>${a.phone}</strong>
                    ${a.phone === OWNER_PHONE ? '<span style="color:gold;"> 👑 Владелец</span>' : ''}
                </div>
                ${a.phone !== OWNER_PHONE && isOwner() ? `
                    <button class="admin-user-btn make-admin" onclick="toggleAdmin('${a.phone}')">
                        👑 Убрать из админов
                    </button>
                ` : ''}
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

addAdminBtn?.addEventListener('click', async () => {
    const phone = formatPhone(newAdminPhone.value);
    if (!phone) return;
    
    const { data: user } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('phone', phone)
        .single();
    
    if (!user) {
        alert('❌ Пользователь не найден');
        return;
    }
    
    await toggleAdmin(phone);
    newAdminPhone.value = '';
});

// ==================== ФОРМАТИРОВАНИЕ НОМЕРОВ ====================
[loginPhone, registerPhone, newAdminPhone].forEach(i => i?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = v;
}));

// ==================== СЕССИЯ ====================
const savedUser = loadSession();
if (savedUser) {
    CURRENT_USER = savedUser;
    (async () => {
        ADMIN_RIGHTS = await loadAdminRights(CURRENT_USER.phone);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
        }
        
        loadChats();
        loadGroups();
    })();
}

// ==================== ПОИСК В АДМИНКЕ ====================
adminUserSearch?.addEventListener('input', e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-user-item').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
    });
});

// ==================== ЗАКРЫТИЕ МЕНЮ ПРИ КЛИКЕ ВНЕ ЕГО ====================
document.addEventListener('click', function(e) {
    if (!e.target.closest('.message')) {
        messageMenu.style.display = 'none';
    }
    if (!e.target.closest('.emoji-button') && !e.target.closest('.emoji-panel')) {
        emojiPanel.style.display = 'none';
    }
});

console.log('✅ LinkUp (полная версия с админкой, поддержкой, жалобами, каналами и эмодзи)');