// Подключаемся к Supabase
const SUPABASE_URL = 'https://zrqaiwobrkzilfwh tkvs.supabase.co'.replace(/\s+/g, '');
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycWFpd29icmt6aWxmd2h0a3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNDc0MDgsImV4cCI6MjA4ODcyMzQwOH0.3PeA7LCedWW8YmiSKW_hqv8Lv227Rk_QrAxFJTFeSpw';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Константы
const OWNER_PHONE = '+79224030705';
let CURRENT_USER = null;
let CURRENT_CHAT = null;
let ADMINS = [OWNER_PHONE];

// Элементы DOM
const authScreen = document.getElementById('authScreen');
const app = document.getElementById('app');
const authMessage = document.getElementById('authMessage');
const welcomeScreen = document.getElementById('welcomeScreen');
const chatWindow = document.getElementById('chatWindow');

// Формы
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showRegisterButton = document.getElementById('showRegisterButton');
const backToLoginButton = document.getElementById('backToLoginButton');

// Поля
const loginPhone = document.getElementById('loginPhone');
const loginPassword = document.getElementById('loginPassword');
const registerPhone = document.getElementById('registerPhone');
const registerPassword = document.getElementById('registerPassword');
const registerPasswordConfirm = document.getElementById('registerPasswordConfirm');
const loginButton = document.getElementById('loginButton');
const registerButton = document.getElementById('registerButton');

// Профиль
const currentUserPhone = document.getElementById('currentUserPhone');
const currentUserName = document.getElementById('currentUserName');
const adminButton = document.getElementById('adminButton');

// Поиск
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const searchResults = document.getElementById('searchResults');
const searchResultsList = document.getElementById('searchResultsList');
const closeSearch = document.getElementById('closeSearch');

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

function saveSession(user) {
    localStorage.setItem('linkup_session', JSON.stringify({
        user: user,
        timestamp: Date.now()
    }));
}

function loadSession() {
    const session = localStorage.getItem('linkup_session');
    if (session) {
        try {
            const data = JSON.parse(session);
            if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
                return data.user;
            }
        } catch (e) {
            console.error('Ошибка загрузки сессии');
        }
    }
    return null;
}

function isOwner() {
    return CURRENT_USER && CURRENT_USER.phone === OWNER_PHONE;
}

function isAdmin() {
    return CURRENT_USER && (ADMINS.includes(CURRENT_USER.phone) || CURRENT_USER.phone === OWNER_PHONE);
}

// ==================== ГЛАЗКИ ДЛЯ ПАРОЛЯ ====================

function addPasswordToggle(inputElement) {
    const container = inputElement.parentElement;
    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'password-toggle';
    toggleBtn.innerHTML = '👁️';
    
    toggleBtn.addEventListener('click', () => {
        if (inputElement.type === 'password') {
            inputElement.type = 'text';
            toggleBtn.innerHTML = '🔓';
        } else {
            inputElement.type = 'password';
            toggleBtn.innerHTML = '👁️';
        }
    });
    
    container.style.position = 'relative';
    inputElement.style.paddingRight = '40px';
    container.appendChild(toggleBtn);
}

addPasswordToggle(loginPassword);
addPasswordToggle(registerPassword);
addPasswordToggle(registerPasswordConfirm);

// ==================== ПЕРЕКЛЮЧЕНИЕ ФОРМ ====================

showRegisterButton.addEventListener('click', () => {
    loginForm.style.display = 'none';
    showRegisterButton.style.display = 'none';
    registerForm.style.display = 'block';
    authMessage.textContent = '';
});

backToLoginButton.addEventListener('click', () => {
    loginForm.style.display = 'block';
    showRegisterButton.style.display = 'block';
    registerForm.style.display = 'none';
    authMessage.textContent = '';
});

// ==================== ВХОД ====================

loginButton.addEventListener('click', async () => {
    const phone = formatPhone(loginPhone.value);
    const password = loginPassword.value;

    if (!phone || !password) {
        authMessage.textContent = '❌ Введите номер и пароль';
        return;
    }

    try {
        const { data: users, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone)
            .eq('password', password);

        if (error) throw error;

        if (!users || users.length === 0) {
            authMessage.textContent = '❌ Неверный номер или пароль';
            return;
        }

        CURRENT_USER = users[0];
        saveSession(CURRENT_USER);
        
        authScreen.style.display = 'none';
        app.style.display = 'flex';
        currentUserPhone.textContent = CURRENT_USER.phone;
        currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
        
        if (isAdmin()) {
            adminButton.style.display = 'block';
            if (isOwner()) {
                adminsTab.style.display = 'block';
            }
        }
        
        loadChats();
        
    } catch (error) {
        authMessage.textContent = '❌ Ошибка входа: ' + error.message;
    }
});

// ==================== РЕГИСТРАЦИЯ ====================

registerButton.addEventListener('click', async () => {
    const phone = formatPhone(registerPhone.value);
    const password = registerPassword.value;
    const confirm = registerPasswordConfirm.value;

    if (!phone || !password || !confirm) {
        authMessage.textContent = '❌ Заполните все поля';
        return;
    }

    if (password !== confirm) {
        authMessage.textContent = '❌ Пароли не совпадают';
        return;
    }

    if (password.length < 4) {
        authMessage.textContent = '❌ Пароль минимум 4 символа';
        return;
    }

    try {
        const { data: existing } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone);

        if (existing && existing.length > 0) {
            authMessage.textContent = '❌ Номер уже зарегистрирован';
            return;
        }

        const { data, error } = await supabaseClient
            .from('profiles')
            .insert([{ 
                phone: phone,
                password: password,
                username: phone
            }]);

        if (error) throw error;

        authMessage.textContent = '✅ Регистрация успешна! Войдите.';
        authMessage.style.color = '#4caf50';
        
        registerPhone.value = '';
        registerPassword.value = '';
        registerPasswordConfirm.value = '';
        
        setTimeout(() => {
            backToLoginButton.click();
            authMessage.textContent = '';
            authMessage.style.color = '#ff4444';
        }, 2000);
        
    } catch (error) {
        authMessage.textContent = '❌ Ошибка: ' + error.message;
    }
});

// ==================== ПОИСК КОНТАКТОВ ====================

searchButton.addEventListener('click', searchUsers);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchUsers();
});

async function searchUsers() {
    const query = searchInput.value.trim();
    if (!query) return;
    
    const searchPhone = formatPhone(query);
    
    try {
        const { data: users, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .neq('phone', CURRENT_USER.phone)
            .ilike('phone', `%${searchPhone.slice(-10)}%`);
        
        if (error) throw error;
        
        if (!users || users.length === 0) {
            searchResultsList.innerHTML = '<p class="no-data">Пользователи не найдены</p>';
        } else {
            searchResultsList.innerHTML = users.map(user => `
                <div class="search-result-item" onclick="startChat('${user.phone}')">
                    <div class="search-result-avatar">👤</div>
                    <div class="search-result-info">
                        <div class="search-result-name">${user.username || user.phone}</div>
                        <div class="search-result-phone">${user.phone}</div>
                    </div>
                    <div class="search-result-add">+</div>
                </div>
            `).join('');
        }
        
        searchResults.style.display = 'block';
        
    } catch (error) {
        console.error('Ошибка поиска:', error);
    }
}

closeSearch.addEventListener('click', () => {
    searchResults.style.display = 'none';
});

// ==================== ЧАТЫ ====================

window.startChat = async function(phone) {
    searchResults.style.display = 'none';
    searchInput.value = '';
    
    try {
        const { data: users, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone', phone);
        
        if (error || !users || users.length === 0) return;
        
        CURRENT_CHAT = users[0];
        
        document.getElementById('currentChatName').textContent = CURRENT_CHAT.username || CURRENT_CHAT.phone;
        document.getElementById('currentChatPhone').textContent = CURRENT_CHAT.phone;
        
        welcomeScreen.style.display = 'none';
        chatWindow.style.display = 'flex';
        
        loadMessages(phone);
        
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

async function loadMessages(chatPhone) {
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .or(`sender.eq.${chatPhone},receiver.eq.${chatPhone}`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const messagesArea = document.getElementById('messagesArea');
        
        if (!messages || messages.length === 0) {
            messagesArea.innerHTML = '<div class="message received">Начните общение</div>';
        } else {
            messagesArea.innerHTML = messages.map(msg => `
                <div class="message ${msg.sender === CURRENT_USER.phone ? 'sent' : 'received'}">
                    ${msg.content}
                    <div class="message-time">${new Date(msg.created_at).toLocaleTimeString().slice(0, -3)}</div>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки сообщений:', error);
    }
}

document.getElementById('sendButton').addEventListener('click', sendMessage);
document.getElementById('messageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

async function sendMessage() {
    const input = document.getElementById('messageInput');
    const content = input.value.trim();
    
    if (!content || !CURRENT_CHAT) return;
    
    try {
        const { data, error } = await supabaseClient
            .from('messages')
            .insert([{
                sender: CURRENT_USER.phone,
                receiver: CURRENT_CHAT.phone,
                content: content,
                created_at: new Date()
            }]);
        
        if (error) throw error;
        
        input.value = '';
        loadMessages(CURRENT_CHAT.phone);
        loadChats();
        
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
}

async function loadChats() {
    try {
        const { data: messages, error } = await supabaseClient
            .from('messages')
            .select('*')
            .or(`sender.eq.${CURRENT_USER.phone},receiver.eq.${CURRENT_USER.phone}`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const chats = new Map();
        
        messages.forEach(msg => {
            const otherPhone = msg.sender === CURRENT_USER.phone ? msg.receiver : msg.sender;
            if (!chats.has(otherPhone) || new Date(msg.created_at) > new Date(chats.get(otherPhone).lastMessageTime)) {
                chats.set(otherPhone, {
                    phone: otherPhone,
                    lastMessage: msg.content,
                    lastMessageTime: msg.created_at
                });
            }
        });
        
        const chatsList = document.getElementById('chatsList');
        
        if (chats.size === 0) {
            chatsList.innerHTML = '<div class="chat-item">Найдите контакт через поиск</div>';
        } else {
            const chatsArray = Array.from(chats.values());
            
            chatsList.innerHTML = chatsArray.map(chat => `
                <div class="chat-item" onclick="startChat('${chat.phone}')">
                    <span class="chat-name">${chat.phone}</span>
                    <span class="chat-preview">${chat.lastMessage.slice(0, 30)}...</span>
                </div>
            `).join('');
        }
        
    } catch (error) {
        console.error('Ошибка загрузки чатов:', error);
    }
}

// ==================== АДМИН-ПАНЕЛЬ ====================

adminButton.addEventListener('click', () => {
    adminModal.style.display = 'flex';
    loadAdminUsers();
    loadSupportRequests();
    loadReports();
    loadChannels();
    if (isOwner()) loadAdminsList();
});

closeAdmin.addEventListener('click', () => {
    adminModal.style.display = 'none';
});

adminTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        adminTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        document.querySelectorAll('.admin-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const tabName = tab.dataset.tab;
        document.getElementById(`admin${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`).classList.add('active');
        
        if (tabName === 'users') loadAdminUsers();
        if (tabName === 'support') loadSupportRequests();
        if (tabName === 'reports') loadReports();
        if (tabName === 'channels') loadChannels();
        if (tabName === 'admins' && isOwner()) loadAdminsList();
    });
});

// Пользователи
async function loadAdminUsers() {
    try {
        const { data: users, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        adminUsersList.innerHTML = users.map(user => `
            <div class="admin-user-item">
                <div>
                    <div><strong>${user.username || user.phone}</strong></div>
                    <div style="color: #888; font-size: 12px;">${user.phone}</div>
                </div>
                <div class="admin-user-actions">
                    ${isOwner() && user.phone !== OWNER_PHONE ? `
                        <button class="admin-user-btn make-admin" onclick="makeAdmin('${user.phone}')">
                            ${ADMINS.includes(user.phone) ? 'Убрать из админов' : 'Сделать админом'}
                        </button>
                    ` : ''}
                    
                    ${user.phone === OWNER_PHONE ? '<span style="color: gold;">👑 Владелец</span>' : ''}
                    ${ADMINS.includes(user.phone) && user.phone !== OWNER_PHONE ? '<span style="color: #00bfff;">👤 Админ</span>' : ''}
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
    }
}

window.makeAdmin = async function(phone) {
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
}

// Поддержка
async function loadSupportRequests() {
    if (!supportList) return;
    
    try {
        const { data: requests, error } = await supabaseClient
            .from('support_requests')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!requests || requests.length === 0) {
            supportList.innerHTML = '<p class="no-data">Нет вопросов в поддержку</p>';
        } else {
            supportList.innerHTML = requests.map(req => `
                <div class="support-request-item">
                    <div class="support-request-header">
                        <span class="support-request-user">${req.user_phone}</span>
                        <span class="support-request-date">${new Date(req.created_at).toLocaleString()}</span>
                    </div>
                    <div class="support-request-question">${req.question}</div>
                    ${!req.answered ? `
                        <div class="support-request-actions">
                            <textarea class="support-answer-input" placeholder="Ответ..." id="answer_${req.id}"></textarea>
                            <button class="admin-user-btn" onclick="answerSupport('${req.id}')">Ответить</button>
                        </div>
                    ` : `
                        <div class="support-request-answer">
                            <strong>Ответ:</strong> ${req.answer}
                        </div>
                    `}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки поддержки:', error);
    }
}

window.answerSupport = async function(requestId) {
    const answerInput = document.getElementById(`answer_${requestId}`);
    const answer = answerInput.value.trim();
    
    if (!answer) return;
    
    try {
        const { error } = await supabaseClient
            .from('support_requests')
            .update({ 
                answer: answer,
                answered: true,
                answered_by: CURRENT_USER.phone,
                answered_at: new Date()
            })
            .eq('id', requestId);
        
        if (error) throw error;
        
        loadSupportRequests();
    } catch (error) {
        console.error('Ошибка ответа:', error);
    }
}

// Жалобы
async function loadReports() {
    if (!reportsList) return;
    
    try {
        const { data: reports, error } = await supabaseClient
            .from('reports')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!reports || reports.length === 0) {
            reportsList.innerHTML = '<p class="no-data">Нет жалоб</p>';
        } else {
            reportsList.innerHTML = reports.map(report => `
                <div class="report-item">
                    <div class="report-header">
                        <span class="report-from">От: ${report.reporter_phone}</span>
                        <span class="report-on">На: ${report.reported_phone}</span>
                    </div>
                    <div class="report-reason">Причина: ${report.reason}</div>
                    ${!report.resolved ? `
                        <div class="report-actions">
                            <button class="admin-user-btn" onclick="resolveReport('${report.id}', 'warn')">Предупредить</button>
                            <button class="admin-user-btn ban" onclick="resolveReport('${report.id}', 'ban')">Заблокировать</button>
                            <button class="admin-user-btn" onclick="resolveReport('${report.id}', 'ignore')">Игнорировать</button>
                        </div>
                    ` : `
                        <div class="report-resolved">
                            Решено: ${report.resolved_by}
                        </div>
                    `}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки жалоб:', error);
    }
}

window.resolveReport = async function(reportId, action) {
    try {
        const { error } = await supabaseClient
            .from('reports')
            .update({ 
                resolved: true,
                resolved_by: CURRENT_USER.phone,
                resolved_action: action,
                resolved_at: new Date()
            })
            .eq('id', reportId);
        
        if (error) throw error;
        
        loadReports();
    } catch (error) {
        console.error('Ошибка решения жалобы:', error);
    }
}

// Каналы
async function loadChannels() {
    if (!channelsList) return;
    
    try {
        const { data: channels, error } = await supabaseClient
            .from('channels')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (!channels || channels.length === 0) {
            channelsList.innerHTML = '<p class="no-data">Нет каналов</p>';
        } else {
            channelsList.innerHTML = channels.map(channel => `
                <div class="channel-item">
                    <div class="channel-info">
                        <span class="channel-name">${channel.name}</span>
                        <span class="channel-members">👥 ${channel.members_count || 0}</span>
                    </div>
                    <div class="channel-actions">
                        <button class="admin-user-btn" onclick="editChannel('${channel.id}')">✏️</button>
                        <button class="admin-user-btn" onclick="deleteChannel('${channel.id}')">🗑️</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Ошибка загрузки каналов:', error);
    }
}

window.editChannel = function(channelId) {
    const newName = prompt('Введите новое название канала:');
    if (newName) {
        // Здесь логика редактирования
        console.log('Редактировать канал:', channelId, newName);
    }
}

window.deleteChannel = async function(channelId) {
    if (confirm('Удалить канал?')) {
        try {
            const { error } = await supabaseClient
                .from('channels')
                .delete()
                .eq('id', channelId);
            
            if (error) throw error;
            
            loadChannels();
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    }
}

if (createChannelBtn) {
    createChannelBtn.addEventListener('click', async () => {
        const channelName = prompt('Введите название канала:');
        if (!channelName) return;
        
        try {
            const { error } = await supabaseClient
                .from('channels')
                .insert([{
                    name: channelName,
                    created_by: CURRENT_USER.phone,
                    members_count: 0
                }]);
            
            if (error) throw error;
            
            loadChannels();
        } catch (error) {
            console.error('Ошибка создания канала:', error);
        }
    });
}

// Админы (только для владельца)
async function loadAdminsList() {
    if (!adminsList) return;
    
    adminsList.innerHTML = ADMINS.map(admin => `
        <div class="admin-user-item">
            <div>${admin}</div>
            ${admin === OWNER_PHONE ? '<span style="color: gold;">👑 Владелец</span>' : ''}
        </div>
    `).join('');
}

if (addAdminBtn) {
    addAdminBtn.addEventListener('click', async () => {
        const phone = formatPhone(newAdminPhone.value);
        if (!phone) return;
        
        try {
            const { data: users, error } = await supabaseClient
                .from('profiles')
                .select('*')
                .eq('phone', phone);
            
            if (error || !users || users.length === 0) {
                alert('❌ Пользователь не найден');
                return;
            }
            
            makeAdmin(phone);
            newAdminPhone.value = '';
            
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });
}

// ==================== ФОРМАТИРОВАНИЕ ПРИ ВВОДЕ ====================

[loginPhone, registerPhone, newAdminPhone].forEach(input => {
    if (input) {
        input.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) value = value.slice(0, 10);
            e.target.value = value;
        });
    }
});

// ==================== ПРОВЕРКА СЕССИИ ====================

const savedUser = loadSession();
if (savedUser) {
    CURRENT_USER = savedUser;
    authScreen.style.display = 'none';
    app.style.display = 'flex';
    currentUserPhone.textContent = CURRENT_USER.phone;
    currentUserName.textContent = CURRENT_USER.username || CURRENT_USER.phone;
    
    if (isAdmin()) {
        adminButton.style.display = 'block';
        if (isOwner()) {
            adminsTab.style.display = 'block';
        }
    }
    
    loadChats();
}

// Поиск по пользователям в админке
if (adminUserSearch) {
    adminUserSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.admin-user-item');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
        });
    });
}

console.log('🚀 LinkUp загружен (версия без banned)');