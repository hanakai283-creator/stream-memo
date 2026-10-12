// ==========================================
// 1. UI要素の取得
// ==========================================
const toggleManualBtn = document.getElementById('toggleManualBtn');
const manualContent = document.getElementById('manualContent');
const manualHeader = document.getElementById('manualHeader');

const togglePanelBtn = document.getElementById('togglePanelBtn');
const panelContent = document.getElementById('panelContent');
const panelHeader = document.getElementById('panelHeader');
const apiErrorAlert = document.getElementById('apiErrorAlert');

const startBtn = document.getElementById('startBtn');
const clearScreenBtn = document.getElementById('clearScreenBtn'); 
const toggleVisibilityBtn = document.getElementById('toggleVisibilityBtn'); 
const obsContentWrapper = document.getElementById('obsContentWrapper'); 

const statusMessage = document.getElementById('statusMessage');

const tempTextDisplay = document.getElementById('tempText');
const currentTopicArea = document.getElementById('currentTopicArea');
const pastTopicsArea = document.getElementById('pastTopicsArea');
const highlightArea = document.getElementById('highlightArea');
const highlightText = document.getElementById('highlightText');
const highlightLabel = document.getElementById('highlightLabel');

const apiKeyInput = document.getElementById('apiKeyInput');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const keyStatusMessage = document.getElementById('keyStatusMessage');

const customPromptInput = document.getElementById('customPromptInput');
const saveCustomPromptBtn = document.getElementById('saveCustomPromptBtn');
const promptStatusMessage = document.getElementById('promptStatusMessage');
const aiModelSelect = document.getElementById('aiModelSelect');

const chromaToggle = document.getElementById('chromaToggle');
const overlayContainer = document.getElementById('overlayContainer');
const previewBox = document.getElementById('previewBox');
const textColorPicker = document.getElementById('textColorPicker');
const fontSelect = document.getElementById('fontSelect');
const outlineSlider = document.getElementById('outlineSlider');
const outlineValue = document.getElementById('outlineValue');
const shadowToggle = document.getElementById('shadowToggle');

const historyList = document.getElementById('historyList');
const selectAllHistory = document.getElementById('selectAllHistory');
const exportBtn = document.getElementById('exportBtn');
const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

const autoHighlightToggle = document.getElementById('autoHighlightToggle');
const triggerLengthSlider = document.getElementById('triggerLengthSlider');
const triggerLengthValue = document.getElementById('triggerLengthValue');

const GAS_API_URL = "https://script.google.com/macros/s/AKfycbzNVdF26Fx8CoCXJRmznve-dhP3EwvGb4pU_7nVybETnQca_nSERZiTPbnONT6RzHBaDA/exec";
const GAS_SECRET_TOKEN = "AutoCampe_Secret_2026";


// ==========================================
// 2. モード切り替えのロジック
// ==========================================
let currentMode = localStorage.getItem('gemini_app_mode') || 'obs';
const modeObs = document.getElementById('modeObs');
const modeMemo = document.getElementById('modeMemo');
const rightPaneMessage = document.getElementById('rightPaneMessage');

function applyMode(mode) {
    if (mode === 'memo') {
        document.body.classList.add('mode-memo-active');
        highlightLabel.innerHTML = '💡 全体の結論・TODO';
        rightPaneMessage.innerHTML = '▼ あなた専用の議事メモ・思考整理ノート';
    } else {
        document.body.classList.remove('mode-memo-active');
        highlightLabel.innerHTML = '🔥 配信の見どころ';
        rightPaneMessage.innerHTML = '▼ 下の枠内だけをOBSでウィンドウキャプチャ（クロップ）してください';
    }
}
if (currentMode === 'memo') { modeMemo.checked = true; applyMode('memo'); }
else { modeObs.checked = true; applyMode('obs'); }

document.querySelectorAll('input[name="appMode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        currentMode = e.target.value; localStorage.setItem('gemini_app_mode', currentMode); applyMode(currentMode);
    });
});


// ==========================================
// 3. パネル開閉・デザイン設定のロジック
// ==========================================
toggleManualBtn.addEventListener('click', () => {
    if (manualContent.style.display === 'none') { manualContent.style.display = 'block'; manualHeader.classList.remove('closed'); toggleManualBtn.textContent = '🔼 閉じる'; }
    else { manualContent.style.display = 'none'; manualHeader.classList.add('closed'); toggleManualBtn.textContent = '🔽 開く'; }
});
togglePanelBtn.addEventListener('click', () => {
    if (panelContent.style.display === 'none') { panelContent.style.display = 'block'; panelHeader.classList.remove('closed'); togglePanelBtn.textContent = '🔼 閉じる'; }
    else { panelContent.style.display = 'none'; panelHeader.classList.add('closed'); togglePanelBtn.textContent = '🔽 開く'; }
});
let isObsVisible = true;
toggleVisibilityBtn.addEventListener('click', () => {
    isObsVisible = !isObsVisible;
    if (isObsVisible) { obsContentWrapper.style.opacity = '1'; toggleVisibilityBtn.textContent = '👁️ 一時非表示にする'; toggleVisibilityBtn.style.backgroundColor = '#4f545c'; }
    else { obsContentWrapper.style.opacity = '0'; toggleVisibilityBtn.textContent = '👁️ 画面を再表示する'; toggleVisibilityBtn.style.backgroundColor = '#43b581'; }
});
clearScreenBtn.addEventListener('click', () => {
    currentTopicArea.innerHTML = ''; pastTopicsArea.innerHTML = ''; highlightArea.style.display = 'none'; highlightText.innerHTML = ''; tempTextDisplay.innerHTML = ''; accumulatedText = ""; 
});

chromaToggle.addEventListener('change', (e) => {
    if (e.target.checked) { overlayContainer.classList.replace('bg-normal', 'bg-chroma'); previewBox.classList.replace('bg-normal', 'bg-chroma'); }
    else { overlayContainer.classList.replace('bg-chroma', 'bg-normal'); previewBox.classList.replace('bg-chroma', 'bg-normal'); }
});
const savedTextColor = localStorage.getItem('gemini_text_color'); if (savedTextColor) { textColorPicker.value = savedTextColor; document.documentElement.style.setProperty('--main-text-color', savedTextColor); }
textColorPicker.addEventListener('input', (e) => { document.documentElement.style.setProperty('--main-text-color', e.target.value); localStorage.setItem('gemini_text_color', e.target.value); });
const savedFont = localStorage.getItem('gemini_font'); if (savedFont) { fontSelect.value = savedFont; document.documentElement.style.setProperty('--main-font', savedFont); }
fontSelect.addEventListener('change', (e) => { document.documentElement.style.setProperty('--main-font', e.target.value); localStorage.setItem('gemini_font', e.target.value); });
const savedOutline = localStorage.getItem('gemini_outline'); if (savedOutline) { outlineSlider.value = savedOutline; outlineValue.textContent = savedOutline + 'px'; document.documentElement.style.setProperty('--text-outline', savedOutline + 'px'); }
outlineSlider.addEventListener('input', (e) => { const val = e.target.value; outlineValue.textContent = val + 'px'; document.documentElement.style.setProperty('--text-outline', val + 'px'); localStorage.setItem('gemini_outline', val); });
const savedShadow = localStorage.getItem('gemini_shadow'); if (savedShadow !== null) { const isShadow = savedShadow === 'true'; shadowToggle.checked = isShadow; document.documentElement.style.setProperty('--text-shadow', isShadow ? '2px 2px 6px rgba(0,0,0,0.8)' : 'none'); }
shadowToggle.addEventListener('change', (e) => { const isShadow = e.target.checked; document.documentElement.style.setProperty('--text-shadow', isShadow ? '2px 2px 6px rgba(0,0,0,0.8)' : 'none'); localStorage.setItem('gemini_shadow', isShadow); });


// ==========================================
// 4. APIキー＆プロンプト＆履歴保存
// ==========================================
const savedKey = localStorage.getItem('gemini_api_key'); if (savedKey) apiKeyInput.value = savedKey;
saveKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) { localStorage.setItem('gemini_api_key', key); keyStatusMessage.textContent = "✅ キーを保存しました（自分用モード）"; } 
    else { localStorage.removeItem('gemini_api_key'); keyStatusMessage.textContent = "🗑️ キーを削除しました（お試し枠モード）"; }
    setTimeout(() => { keyStatusMessage.textContent = ""; }, 3000);
});

const savedAiModel = localStorage.getItem('gemini_ai_model'); if (savedAiModel) aiModelSelect.value = savedAiModel;
aiModelSelect.addEventListener('change', (e) => { localStorage.setItem('gemini_ai_model', e.target.value); });

const savedCustomPrompt = localStorage.getItem('gemini_custom_prompt'); if (savedCustomPrompt) customPromptInput.value = savedCustomPrompt;
saveCustomPromptBtn.addEventListener('click', () => { localStorage.setItem('gemini_custom_prompt', customPromptInput.value.trim()); promptStatusMessage.textContent = "✅ 用語を保存しました"; setTimeout(() => { promptStatusMessage.textContent = ""; }, 3000); });

let TRIGGER_LENGTH = parseInt(localStorage.getItem('gemini_trigger_length')) || 50;
triggerLengthSlider.value = TRIGGER_LENGTH; triggerLengthValue.textContent = TRIGGER_LENGTH + '文字';
triggerLengthSlider.addEventListener('input', (e) => { TRIGGER_LENGTH = parseInt(e.target.value); triggerLengthValue.textContent = TRIGGER_LENGTH + '文字'; localStorage.setItem('gemini_trigger_length', TRIGGER_LENGTH); });

let historyArray = []; 
function addHistoryToList(summaryText, rawText) {
    if (historyArray.length === 0) historyList.innerHTML = '';
    const timestamp = new Date().toLocaleTimeString('ja-JP', { hour12: false });
    const historyObj = { id: 'hist_' + Date.now(), time: timestamp, summary: summaryText, raw: rawText };
    historyArray.unshift(historyObj); 
    const itemDiv = document.createElement('div'); itemDiv.className = 'history-item'; itemDiv.id = historyObj.id;
    const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'history-checkbox';
    const textDiv = document.createElement('div'); textDiv.className = 'history-text'; textDiv.innerHTML = `<span style="color:#faa61a; font-weight:bold;">[${timestamp}]</span><br>${summaryText}`;
    itemDiv.appendChild(checkbox); itemDiv.appendChild(textDiv); historyList.prepend(itemDiv);
}
selectAllHistory.addEventListener('change', (e) => { document.querySelectorAll('.history-checkbox').forEach(cb => cb.checked = e.target.checked); });
deleteSelectedBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.history-checkbox:checked');
    if (checkboxes.length === 0) return alert("削除する項目を選択してください。");
    if (confirm(`選択した ${checkboxes.length} 件を削除しますか？`)) {
        checkboxes.forEach(cb => { const itemDiv = cb.closest('.history-item'); historyArray = historyArray.filter(item => item.id !== itemDiv.id); itemDiv.remove(); });
        selectAllHistory.checked = false; if (historyArray.length === 0) historyList.innerHTML = '<div style="color:#aaa; font-size:12px; text-align:center;">ここに要約履歴がストックされます</div>';
    }
});
exportBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.history-checkbox:checked');
    if (checkboxes.length === 0) return alert("エクスポートする項目を選択してください。");
    let exportText = "=== AI議事メモ / 要約履歴 ===\n\n";
    const selectedIds = Array.from(checkboxes).map(cb => cb.closest('.history-item').id);
    const selectedData = historyArray.filter(item => selectedIds.includes(item.id)).reverse();
    selectedData.forEach((item, index) => { exportText += `[トピック ${index + 1}] (${item.time})\n${item.summary}\n----------------------------------------\n`; });
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.download = `AI_Memo_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.txt`; a.href = url; a.click(); URL.revokeObjectURL(url);
});


// ==========================================
// 5. 音声認識の設定
// ==========================================
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'ja-JP'; recognition.continuous = true; recognition.interimResults = true;
let isRecording = false; let accumulatedText = "";

recognition.onstart = () => { isRecording = true; statusMessage.textContent = "🎙️ 録音中..."; statusMessage.style.color = "#43b581"; startBtn.textContent = "⏹️ マイク停止"; };
recognition.onresult = (event) => {
    let interimTranscript = ''; let finalTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        let transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else interimTranscript += transcript;
    }
    tempTextDisplay.textContent = interimTranscript;
    if (finalTranscript !== '') {
        accumulatedText += finalTranscript + " "; tempTextDisplay.textContent = ""; 
        if (accumulatedText.length >= TRIGGER_LENGTH) { triggerSummary(accumulatedText); accumulatedText = ""; }
    }
};
recognition.onend = () => { if (isRecording) recognition.start(); else { statusMessage.textContent = "停止中"; statusMessage.style.color = "#f04747"; startBtn.textContent = "🎤 マイク開始"; } };
startBtn.addEventListener('click', () => { if (isRecording) { isRecording = false; recognition.stop(); } else { accumulatedText = ""; tempTextDisplay.textContent = ""; recognition.start(); } });


// ==========================================
// 6. Gemini API ＆ GAS中継サーバーの通信処理
// ==========================================
let isApiLimitReached = false;
let summaryCount = 0; 

function getCustomInstructionText() {
    const customText = customPromptInput.value.trim();
    return customText ? `\n\n【前提条件・独自ルール】\n${customText}\n` : "";
}

async function callAI(promptText) {
    const userApiKey = apiKeyInput.value.trim();
    const selectedModel = aiModelSelect.value;

    if (userApiKey) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${userApiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });
        if (response.status === 429) throw new Error("RATE_LIMIT");
        if (!response.ok) throw new Error("APIエラー");
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } else {
        const response = await fetch(GAS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ prompt: promptText, token: GAS_SECRET_TOKEN })
        });
        
        if (response.status === 429) throw new Error("RATE_LIMIT");
        if (!response.ok) throw new Error("APIエラー");
        
        const data = await response.json();
        
        if (data.error) {
            const errorString = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
            if (errorString.includes("quota") || errorString.includes("429")) {
                throw new Error("RATE_LIMIT");
            }
            if (errorString.includes("トークンが一致しません")) {
                console.error("セキュリティ警告: GASの合言葉が一致しません。");
            }
            console.error("GASからのエラー詳細:", data.error);
            throw new Error("APIエラー");
        }
        return data.text;
    }
}


async function triggerSummary(text) {
    if (isApiLimitReached) return;

    if (currentTopicArea.children.length > 0) {
        const oldCard = currentTopicArea.firstElementChild;
        oldCard.className = 'summary-card past-card';
        const label = oldCard.querySelector('.topic-label');
        if (label) { label.className = 'topic-label past-label'; label.innerHTML = currentMode === 'memo' ? '📝 記録済みのノート' : '🕒 過去の話題'; }
        pastTopicsArea.prepend(oldCard);
        
        if (pastTopicsArea.querySelectorAll('.section-divider').length === 0) {
            const divider = document.createElement('div'); divider.className = 'section-divider'; pastTopicsArea.prepend(divider);
        }
        
        const pastCards = pastTopicsArea.querySelectorAll('.past-card');
        if (currentMode === 'obs' && pastCards.length > 2) {
            const oldestCard = pastCards[pastCards.length - 1];
            oldestCard.style.transition = "opacity 0.5s"; oldestCard.style.opacity = "0";
            setTimeout(() => { oldestCard.remove(); }, 500);
        }
    }

    const loadingItem = document.createElement('div');
    loadingItem.className = 'summary-card current-card log-loading';
    const isTrial = apiKeyInput.value.trim() === "" ? " (お試し枠)" : "";
    loadingItem.innerHTML = `⏳ AIが整理中...${isTrial} (${text.length}文字)`;
    currentTopicArea.appendChild(loadingItem);

    try {
        // ★ 修正：こまめな要約は「深く整理しすぎない短いメモ」へ変更
        let basePrompt = currentMode === 'obs' 
            ? `あなたはライブ配信の優秀なアシスタントです。以下の配信者のトーク内容を、視聴者がパッと見て分かるように短い箇条書きで要約してください。返事や前置きは一切不要で、要約の結果のみを出力してください。`
            : `あなたは優秀な秘書です。以下のユーザーが音声で話した内容を、簡潔な短いメモとして要約してください。この段階では深く整理・構造化しすぎず、何について話したかがサッと分かる程度の軽い箇条書き（1〜2行程度）に留めてください。返事や前置きは不要です。`;
        
        const prompt = `${basePrompt}${getCustomInstructionText()}\n\n【入力内容】\n${text}`;
        
        const summaryResult = await callAI(prompt);

        loadingItem.className = 'summary-card current-card'; 
        const titleText = currentMode === 'memo' ? '✍️ 現在の思考' : '✨ 今の話題';
        loadingItem.innerHTML = `<div class="log-summary"><strong class="topic-label current-label">${titleText}</strong><br>${summaryResult.replace(/\n/g, '<br>')}</div>`;

        addHistoryToList(summaryResult, text);
        summaryCount++; 

        if (autoHighlightToggle.checked && summaryCount % 3 === 0) {
            generateHighlight();
        }

    } catch (error) {
        if (error.message === "RATE_LIMIT") {
            loadingItem.remove(); apiErrorAlert.style.display = 'block';
            if (panelContent.style.display === 'none') togglePanelBtn.click();
        } else {
            loadingItem.className = 'summary-card log-error'; loadingItem.innerHTML = `❌ 通信エラーが発生しました。`;
            console.error(error);
        }
    }
}

async function generateHighlight() {
    if (historyArray.length < 3 || isApiLimitReached) return; 
    const allPastText = historyArray.map(item => item.raw).reverse().join("\n");

    try {
        highlightArea.style.display = "block";
        const isTrial = apiKeyInput.value.trim() === "" ? " (お試し枠)" : "";
        highlightText.innerHTML = `<span style="color: #faa61a; font-size: 16px;">⏳ 全体を分析中...${isTrial}</span>`;

        // ★ 修正：全体のまとめは「断片的なメモを統合し、構造化して綺麗にまとめる」ように強化
        let basePrompt = currentMode === 'obs'
            ? `あなたはライブ配信の敏腕ディレクターです。以下のテキストはここまでの配信で話された全記録です。この全体を通して、視聴者が一番興味を持ちそうな「現在の配信のハイライト（見どころ）」を1〜2行で魅力的にまとめてください。前置きは不要です。`
            : `あなたは優秀な秘書・アイデア整理のプロです。以下のテキストはここまでの思考・ブレストの断片的なメモの全記録です。これらを統合し、最終的な「結論」や「重要な気づき」、次にやるべき「TODO」を、見出しや箇条書きを使って議事録として綺麗に構造化してまとめてください。前置きは不要です。`;
        
        const prompt = `${basePrompt}${getCustomInstructionText()}\n\n【これまでの全テキスト】\n${allPastText}`;

        const highlightResult = await callAI(prompt);

        highlightText.innerHTML = highlightResult.replace(/\n/g, '<br>');
        highlightArea.style.animation = "none";
        setTimeout(() => { highlightArea.style.animation = "fadeIn 0.8s ease-in-out"; }, 10);

    } catch (error) {
        console.error("ハイライト生成エラー:", error);
        highlightArea.style.display = "none"; 
        if (error.message === "RATE_LIMIT") {
            apiErrorAlert.style.display = 'block';
            if (panelContent.style.display === 'none') togglePanelBtn.click();
        }
    }
}