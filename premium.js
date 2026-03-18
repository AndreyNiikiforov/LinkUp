// ==================== ПРЕМИУМ ФУНКЦИИ ====================

let PREMIUM_FEATURES = {
    hasAnimatedNick: false,
    hasAnimatedReactions: false,
    hasCustomThemes: false,
    animatedStatus: ''
};

// Проверка премиум статуса (для владельца всегда true)
function checkPremiumFeatures() {
    if (typeof isOwner === 'function' && isOwner()) {
        PREMIUM_FEATURES = {
            hasAnimatedNick: true,
            hasAnimatedReactions: true,
            hasCustomThemes: true,
            animatedStatus: OWNER_SETTINGS?.animatedStatus || '👑 CREATOR'
        };
        return true;
    }
    
    // Здесь будет проверка покупки через донат
    const premiumData = localStorage.getItem('linkup_premium');
    if (premiumData) {
        try {
            PREMIUM_FEATURES = JSON.parse(premiumData);
            return true;
        } catch (e) {}
    }
    return false;
}

// Применить анимированный ник
function applyAnimatedNick(element, username) {
    if (!element || !username) return;
    
    if (PREMIUM_FEATURES.hasAnimatedNick || (typeof isOwner === 'function' && isOwner())) {
        element.innerHTML = `<span class="username-premium">@${username}</span>`;
    } else {
        element.textContent = `@${username}`;
    }
}

// Показать анимированную реакцию
function showAnimatedReaction(messageId, reaction) {
    const messageEl = document.querySelector(`[data-id="${messageId}"]`);
    if (!messageEl) return;
    
    const reactionEl = document.createElement('span');
    reactionEl.className = 'reaction reaction-animated';
    reactionEl.textContent = reaction;
    reactionEl.style.position = 'absolute';
    reactionEl.style.right = '10px';
    reactionEl.style.bottom = '-10px';
    
    messageEl.style.position = 'relative';
    messageEl.appendChild(reactionEl);
    
    setTimeout(() => reactionEl.remove(), 1000);
}

// Анимированный статус владельца
function getOwnerBadgeHTML() {
    if (typeof isOwner !== 'function' || !isOwner() || !OWNER_SETTINGS?.showBadge) return '';
    
    const status = OWNER_SETTINGS.animatedStatus || '👑 CREATOR';
    return `<span class="owner-badge-animated" title="Владелец LinkUp">${status}</span>`;
}

// Обновить все бейджи владельца на странице
function updateAllOwnerBadges() {
    const badgeElements = document.querySelectorAll('.owner-badge, #chatOwnerBadge, #ownerBadge');
    badgeElements.forEach(el => {
        if (typeof isOwner === 'function' && isOwner() && OWNER_SETTINGS?.showBadge) {
            el.innerHTML = getOwnerBadgeHTML();
            el.style.display = 'inline-block';
        } else {
            el.style.display = 'none';
        }
    });
}

// Настройка анимированного статуса в профиле
function setupAnimatedStatus() {
    if (typeof isOwner !== 'function' || !isOwner()) return;
    
    const statusInput = document.getElementById('animatedStatus');
    const statusPreview = document.getElementById('statusPreview');
    
    if (statusInput) {
        statusInput.value = OWNER_SETTINGS?.animatedStatus || '👑 CREATOR';
        
        statusInput.addEventListener('input', (e) => {
            if (!OWNER_SETTINGS) OWNER_SETTINGS = {};
            OWNER_SETTINGS.animatedStatus = e.target.value;
            if (statusPreview) {
                statusPreview.innerHTML = getOwnerBadgeHTML();
            }
            // Сохраняем в базу
            if (typeof saveOwnerSettings === 'function') {
                saveOwnerSettings();
            }
        });
    }
}

// Загрузка настроек премиум
async function loadPremiumSettings() {
    if (!CURRENT_USER) return;
    
    try {
        const { data } = await supabaseClient
            .from('profiles')
            .select('premium_settings')
            .eq('phone', CURRENT_USER.phone)
            .single();
        
        if (data?.premium_settings) {
            PREMIUM_FEATURES = { ...PREMIUM_FEATURES, ...data.premium_settings };
        }
        
        if (typeof isOwner === 'function' && isOwner()) {
            PREMIUM_FEATURES.hasAnimatedNick = true;
            PREMIUM_FEATURES.hasAnimatedReactions = true;
        }
    } catch (e) {
        console.error('Ошибка загрузки премиум настроек:', e);
    }
}

// Экспорт
window.checkPremiumFeatures = checkPremiumFeatures;
window.applyAnimatedNick = applyAnimatedNick;
window.showAnimatedReaction = showAnimatedReaction;
window.getOwnerBadgeHTML = getOwnerBadgeHTML;
window.updateAllOwnerBadges = updateAllOwnerBadges;
window.setupAnimatedStatus = setupAnimatedStatus;
window.loadPremiumSettings = loadPremiumSettings;