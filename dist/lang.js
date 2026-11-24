/* Arkivia 汉化层：语言选择 + 静态界面文案切换 + 词表 */
(function () {
    'use strict';

    var KEY = 'arkivia-lang';
    var lang = 'zh';
    try {
        var saved = localStorage.getItem(KEY);
        if (saved === 'en' || saved === 'zh') { lang = saved; }
    } catch (e) {}

    window.ARK_LANG = lang;
    window.ARK_LANG_NAME = (lang === 'en') ? 'Language' : '语言';

    var TITLES_EN_TO_ZH = {
        'Unknown': '未知',
        'Newcomer': '新来者',
        'Athlete': '运动员',
        'Fighter': '格斗家',
        'Disciple': '门徒',
        'Seeker': '求道者',
        'Crafter': '工匠',
        'Sleeper': '睡神',
        'Alchemist': '炼金师',
        'Miner': '矿工',
        'Lumberjack': '伐木工',
        'Walker': '行者'
    };

    function invert(obj) {
        var out = {};
        for (var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) { out[obj[k]] = k; } }
        return out;
    }

    var WORDS_ZH = {
        'str': '力量', 'def': '防御', 'spd': '速度', 'dex': '敏捷',
        'night': '夜晚', 'morning': '早晨', 'afternoon': '下午', 'evening': '傍晚'
    };

    if (lang === 'zh') {
        var style = document.createElement('style');
        style.textContent = '#inventory-discard {padding: 0 2px;}';
        document.head.appendChild(style);
    }

    if (lang === 'en') {
        window.ARK_WORDS = {};
        window.ARK_LEGACY_TITLES = invert(TITLES_EN_TO_ZH);
    } else {
        window.ARK_WORDS = WORDS_ZH;
        window.ARK_LEGACY_TITLES = TITLES_EN_TO_ZH;
    }

    function applyEnglish() {
        var nodes = document.querySelectorAll('[data-en]');
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].textContent = nodes[i].getAttribute('data-en');
        }
        var phs = document.querySelectorAll('[data-en-placeholder]');
        for (var j = 0; j < phs.length; j++) {
            phs[j].setAttribute('placeholder', phs[j].getAttribute('data-en-placeholder'));
        }
        var tips = document.querySelectorAll('[data-tooltip-title-en]');
        for (var k = 0; k < tips.length; k++) {
            tips[k].setAttribute('data-tooltip-title', tips[k].getAttribute('data-tooltip-title-en'));
        }
        var tips2 = document.querySelectorAll('[data-tooltip-text-en]');
        for (var m = 0; m < tips2.length; m++) {
            tips2[m].setAttribute('data-tooltip-text', tips2[m].getAttribute('data-tooltip-text-en'));
        }
    }

    function setLang(value) {
        try { localStorage.setItem(KEY, value); } catch (e) {}
        window.location.reload();
    }

    window.ARK_LANG_UI = function (holder) {
        var row = document.createElement('div');
        row.className = 'settings-option-holder';

        var label = document.createElement('span');
        label.textContent = (lang === 'en') ? 'Language' : '语言';
        row.appendChild(label);

        var group = document.createElement('span');
        group.style.marginLeft = '10px';

        function makeButton(text, value) {
            var button = document.createElement('button');
            button.textContent = text;
            button.style.marginRight = '6px';
            if (lang === value) {
                button.style.color = '#ffeeaa';
                button.style.fontWeight = 'bold';
            }
            button.addEventListener('click', function () { setLang(value); });
            return button;
        }

        group.appendChild(makeButton('简体中文', 'zh'));
        group.appendChild(makeButton('English', 'en'));
        row.appendChild(group);
        holder.appendChild(row);

        var hint = document.createElement('div');
        hint.style.marginTop = '8px';
        hint.style.color = '#999999';
        hint.textContent = (lang === 'en')
            ? 'Switching the language reloads the game. Your save is kept.'
            : '切换语言会重新载入游戏，存档会保留。';
        holder.appendChild(hint);
    };

    if (lang === 'en') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', applyEnglish);
        } else {
            applyEnglish();
        }
    }
})();