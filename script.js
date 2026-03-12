const SUPABASE_URL = 'https://zrqaiwobrkzilfwhtkvs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycWFpd29icmt6aWxmd2h0a3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDc0MDgsImV4cCI6MjA4ODcyMzQwOH0.3PeA7LCedWW8YmiSKW_hqv8Lv227Rk_QrAxFJTFeSpw';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const OWNER_PHONE = '+79224030705';
let CURRENT_USER = null;
let CURRENT_CHAT = null;
let CURRENT_GROUP = null;
let ADMINS = [OWNER_PHONE];
let GROUPS = [];
let selectedMembers = [];

// DOM элементы
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
const availableUsers = document.getElementById('availableUsers');
const createGroupFinal = document.getElementById('createGroupFinal');

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

// Форматирование номера
function formatPhone(number) {
    let cleaned = number.replace(/\D/g, '');
    if (!cleaned) return '';
    if (cleaned.startsWith('8')) cleaned = '7' + cleaned.substring(1);
    if (!cleaned.startsWith('7')) cleaned = '7' + cleaned;
    cleaned = cleaned.substring(0, 11);
    return '+' + cleaned;
}

// Сессия
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

function isOwner() { return CURRENT_USER?.phone === OWNER_PHONE; }
function isAdmin() { return CURRENT_USER && (ADMINS.includes(CURRENT_USER.phone) || isOwner()); }

// Глазки
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

// Переключение форм
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

// Вход
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
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
        if (isAdmin()) {
            adminButton.style.display = 'block';
            if (isOwner()) adminsTab.style.display = 'block';
        }
        loadChats();
        loadGroups();
    } catch (e) { authMessage.textContent = '❌ Ошибка входа: ' + e.message; }
});

// Регистрация
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

// Поиск
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

// Вкладки Чаты / Группы
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

// Личные чаты
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
        const area = document.getElementById('messagesArea');
        if (!messages?.length) area.innerHTML = '<div class="message received">Начните общение</div>';
        else area.innerHTML = messages.map(m => `
            <div class="message ${m.sender === CURRENT_USER.phone ? 'sent' : 'received'}">
                ${m.content}
                <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0,-3)}</div>
            </div>`).join('');
    } catch (e) { console.error(e); }
}

// Группы
window.openGroup = async function(groupId) {
    CURRENT_CHAT = null;
    CURRENT_GROUP = GROUPS.find(g => g.id === groupId);
    document.getElementById('currentChatName').textContent = CURRENT_GROUP.name;
    document.getElementById('currentChatPhone').textContent = 'Группа';
    welcomeScreen.style.display = 'none';
    chatWindow.style.display = 'flex';
    loadGroupMessages(groupId);
};

async function loadGroupMessages(groupId) {
    try {
        const { data: messages, error } = await supabaseClient
            .from('group_messages')
            .select('*')
            .eq('group_id', groupId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        const area = document.getElementById('messagesArea');
        if (!messages?.length) area.innerHTML = '<div class="message received">Начните общение в группе</div>';
        else area.innerHTML = messages.map(m => `
            <div class="message ${m.sender === CURRENT_USER.phone ? 'sent' : 'received'}">
                <strong>${m.sender}:</strong> ${m.content}
                <div class="message-time">${new Date(m.created_at).toLocaleTimeString().slice(0,-3)}</div>
            </div>`).join('');
    } catch (e) { console.error(e); }
}

// Загрузка чатов
async function loadChats() {
    try {
        const { data: messages, error } = await supabaseClient.from('messages').select('*').or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`).order('created_at', { ascending: false });
        if (error) throw error;
        const chats = new Map();
        messages.forEach(m => {
            const other = m.sender === CURRENT_USER.phone ? m.receiver : m.sender;
            if (!chats.has(other) || new Date(m.created_at) > new Date(chats.get(other).lastMessageTime))
                chats.set(other, { phone: other, lastMessage: m.content, lastMessageTime: m.created_at });
        });
        if (!chats.size) chatsList.innerHTML = '<div class="chat-item">Найдите контакт через поиск</div>';
        else chatsList.innerHTML = Array.from(chats.values()).map(c => `<div class="chat-item" onclick="startChat('${c.phone}')"><span class="chat-name">${c.phone}</span><span class="chat-preview">${c.lastMessage.slice(0,30)}...</span></div>`).join('');
    } catch (e) { console.error(e); }
}

// Загрузка групп
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
                <span class="group-preview">Группа</span>
            </div>
        `).join('');
    } catch (e) { console.error(e); }
}

// Создание группы
createGroupBtn?.addEventListener('click', async () => {
    groupModal.style.display = 'flex';
    await loadAvailableUsers();
});

closeGroupModal?.addEventListener('click', () => {
    groupModal.style.display = 'none';
    groupName.value = '';
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
        const text = el.textContent.trim();
        if (selectedMembers.includes(text) || selectedMembers.some(s => text.includes(s))) {
            el.classList.add('selected');
        } else {
            el.classList.remove('selected');
        }
    });
};

createGroupFinal?.addEventListener('click', async () => {
    const name = groupName.value.trim();
    if (!name) { alert('Введите название группы'); return; }
    if (!selectedMembers.length) { alert('Выберите участников'); return; }
    
    try {
        const { data: group, error } = await supabaseClient
            .from('groups')
            .insert([{ name, created_by: CURRENT_USER.phone }])
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
        selectedMembers = [];
        loadGroups();
        groupsTabBtn.click();
    } catch (e) {
        console.error(e);
        alert('Ошибка: ' + e.message);
    }
});

// Отправка сообщений
document.getElementById('sendButton')?.addEventListener('click', sendMessage);
document.getElementById('messageInput')?.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    if (!content) return;
    
    try {
        if (CURRENT_GROUP) {
            await supabaseClient.from('group_messages').insert([{
                group_id: CURRENT_GROUP.id,
                sender: CURRENT_USER.phone,
                content
            }]);
            input.value = '';
            loadGroupMessages(CURRENT_GROUP.id);
        } else if (CURRENT_CHAT) {
            await supabaseClient.from('messages').insert([{
                sender: CURRENT_USER.phone,
                receiver: CURRENT_CHAT.phone,
                content
            }]);
            input.value = '';
            loadMessages(CURRENT_CHAT.phone);
            loadChats();
        }
    } catch (e) {
        console.error('Ошибка отправки:', e);
        alert('❌ Ошибка: ' + e.message);
    }
}

// Админка
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

async function loadAdminUsers() {
    try {
        const { data: users } = await supabaseClient.from('profiles').select('*').order('created_at', { ascending: false });
        adminUsersList.innerHTML = users?.map(u => `
            <div class="admin-user-item">
                <div><strong>${u.username || u.phone}</strong><div style="color:#888;font-size:12px;">${u.phone}</div></div>
                <div class="admin-user-actions">
                    ${isOwner() && u.phone !== OWNER_PHONE ? `
                        <button class="admin-user-btn make-admin" onclick="makeAdmin('${u.phone}')">
                            ${ADMINS.includes(u.phone) ? 'Убрать из админов' : 'Сделать админом'}
                        </button>
                    ` : ''}
                    ${u.phone === OWNER_PHONE ? '<span style="color:gold;">👑 Владелец</span>' : ''}
                    ${ADMINS.includes(u.phone) && u.phone !== OWNER_PHONE ? '<span style="color:#00bfff;">👤 Админ</span>' : ''}
                </div>
            </div>`).join('') || '<p class="no-data">Нет пользователей</p>';
    } catch (e) { console.error(e); }
}

window.makeAdmin = function(phone) {
    if (!isOwner()) return;
    if (ADMINS.includes(phone)) {
        ADMINS = ADMINS.filter(p => p !== phone);
        alert(`✅ ${phone} больше не админ`);
    } else {
        ADMINS.push(phone);
        alert(`✅ ${phone} назначен админом`);
    }
    loadAdminUsers();
    if (isOwner()) loadAdminsList();
};

async function loadSupportRequests() {
    try {
        const { data: r } = await supabaseClient.from('support_requests').select('*').order('created_at', { ascending: false });
        supportList.innerHTML = r?.length ? r.map(req => `
            <div class="support-request-item">
                <div class="support-request-header"><span>${req.user_phone}</span><span>${new Date(req.created_at).toLocaleString()}</span></div>
                <div class="support-request-question">${req.question}</div>
                ${!req.answered ? `<div class="support-request-actions"><textarea class="support-answer-input" placeholder="Ответ..." id="answer_${req.id}"></textarea><button class="admin-user-btn" onclick="answerSupport('${req.id}')">Ответить</button></div>` : `<div class="support-request-answer"><strong>Ответ:</strong> ${req.answer}</div>`}
            </div>`).join('') : '<p class="no-data">Нет вопросов</p>';
    } catch (e) { console.error(e); }
}

window.answerSupport = async function(id) {
    const a = document.getElementById(`answer_${id}`)?.value.trim();
    if (!a) return;
    await supabaseClient.from('support_requests').update({ answer: a, answered: true, answered_by: CURRENT_USER.phone, answered_at: new Date() }).eq('id', id);
    loadSupportRequests();
};

async function loadReports() {
    try {
        const { data: r } = await supabaseClient.from('reports').select('*').order('created_at', { ascending: false });
        reportsList.innerHTML = r?.length ? r.map(rep => `
            <div class="report-item">
                <div class="report-header"><span>От: ${rep.reporter_phone}</span><span>На: ${rep.reported_phone}</span></div>
                <div class="report-reason">${rep.reason}</div>
                ${!rep.resolved ? `<div class="report-actions"><button class="admin-user-btn" onclick="resolveReport('${rep.id}','warn')">Предупредить</button><button class="admin-user-btn ban" onclick="resolveReport('${rep.id}','ban')">Заблокировать</button><button class="admin-user-btn" onclick="resolveReport('${rep.id}','ignore')">Игнорировать</button></div>` : `<div class="report-resolved">Решено: ${rep.resolved_by}</div>`}
            </div>`).join('') : '<p class="no-data">Нет жалоб</p>';
    } catch (e) { console.error(e); }
}

window.resolveReport = async function(id, action) {
    await supabaseClient.from('reports').update({ resolved: true, resolved_by: CURRENT_USER.phone, resolved_action: action, resolved_at: new Date() }).eq('id', id);
    loadReports();
};

async function loadChannels() {
    try {
        const { data: c } = await supabaseClient.from('channels').select('*').order('created_at', { ascending: false });
        channelsList.innerHTML = c?.length ? c.map(ch => `
            <div class="channel-item">
                <div class="channel-info"><span class="channel-name">${ch.name}</span><span class="channel-members">👥 ${ch.members_count || 0}</span></div>
                <div class="channel-actions"><button class="admin-user-btn" onclick="editChannel('${ch.id}')">✏️</button><button class="admin-user-btn" onclick="deleteChannel('${ch.id}')">🗑️</button></div>
            </div>`).join('') : '<p class="no-data">Нет каналов</p>';
    } catch (e) { console.error(e); }
}

window.editChannel = id => { let n = prompt('Новое название:'); if (n) console.log('edit', id, n); };
window.deleteChannel = async id => { if (confirm('Удалить канал?')) { await supabaseClient.from('channels').delete().eq('id', id); loadChannels(); } };

createChannelBtn?.addEventListener('click', async () => {
    let n = prompt('Название канала:'); if (!n) return;
    await supabaseClient.from('channels').insert([{ name: n, created_by: CURRENT_USER.phone, members_count: 0 }]);
    loadChannels();
});

async function loadAdminsList() {
    adminsList.innerHTML = ADMINS.map(a => `<div class="admin-user-item"><div>${a}</div>${a === OWNER_PHONE ? '<span style="color:gold;">👑 Владелец</span>' : ''}</div>`).join('');
}

addAdminBtn?.addEventListener('click', async () => {
    let p = formatPhone(newAdminPhone.value);
    if (!p) return;
    let { data: u } = await supabaseClient.from('profiles').select('*').eq('phone', p);
    if (!u?.length) { alert('❌ Пользователь не найден'); return; }
    makeAdmin(p);
    newAdminPhone.value = '';
});

// Форматирование номеров
[loginPhone, registerPhone, newAdminPhone].forEach(i => i?.addEventListener('input', e => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 10);
    e.target.value = v;
}));

// Сессия
const savedUser = loadSession();
if (savedUser) {
    CURRENT_USER = savedUser;
    authScreen.style.display = 'none';
    app.style.display = 'flex';
    currentUserPhone.textContent = CURRENT_USER.phone;
    currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
    if (isAdmin()) {
        adminButton.style.display = 'block';
        if (isOwner()) adminsTab.style.display = 'block';
    }
    loadChats();
    loadGroups();
}

// Поиск в админке
adminUserSearch?.addEventListener('input', e => {
    let term = e.target.value.toLowerCase();
    document.querySelectorAll('.admin-user-item').forEach(el => {
        el.style.display = el.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
    });
});

console.log('✅ LinkUp (финальная версия с группами)');