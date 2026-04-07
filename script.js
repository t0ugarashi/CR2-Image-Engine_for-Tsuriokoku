const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const statusText = document.getElementById('status');
const preView = document.getElementById('preview');
const startBtn = document.getElementById('start-btn');

const renameToggle = document.getElementById('rename-toggle');
const renameInputsContainer = document.getElementById('rename-inputs');
const baseNameInput = document.getElementById('baseName');
const startIndexInput = document.getElementById('startIndex');

// --- UI連動ロジック：トグルの状態に合わせて入力を制限 ---
renameToggle.addEventListener('change', () => {
    const isEnabled = renameToggle.checked;

    if (isEnabled) {
        renameInputsContainer.classList.remove('disabled-inputs');
        baseNameInput.disabled = false;
        startIndexInput.disabled = false;
    } else {
        renameInputsContainer.classList.add('disabled-inputs');
        baseNameInput.disabled = true;
        startIndexInput.disabled = true;
    }
});

let selectedFiles = [];

// --- UIイベントリスナー ---
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    dropZone.classList.add('dragging'); 
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragging'); 
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    statusText.textContent = `${selectedFiles.length} 枚の画像が選択されました。`;
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    selectedFiles = Array.from(e.dataTransfer.files);
    statusText.textContent = `${selectedFiles.length} 枚の画像が準備できました。`;
});

// --- 一括処理メインロジック ---
startBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
        alert("画像を選択してください！");
        return;
    }

    clearPreview();
    const zip = new JSZip();
    const mode = document.querySelector('input[name="mode"]:checked').value;
    const isRenameEnabled = renameToggle.checked; // トグルの状態を取得
    const customBaseName = baseNameInput.value.trim();
    const startNum = parseInt(startIndexInput.value) || 1;
    const suffix = (mode === 'hero') ? '_eye' : '_body';

    startBtn.disabled = true;

    for (let i = 0; i < selectedFiles.length; i++) {
        let file = selectedFiles[i];
        statusText.textContent = `加工中 (${i + 1}/${selectedFiles.length}): ${file.name}`;

        // HEICの変換
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
            file = await convertHeic(file);
        }

        const dataUrl = await fileToDataUrl(file);
        const processedUrl = await processImageAsync(dataUrl, mode);

        // --- ファイル名生成ロジック：ここをトグルで分岐 ---
        let fileName;
        if (isRenameEnabled) {
            // 【リネームON】: 指定ベース名 + 01, 02... + サフィックス
            const currentNum = startNum + i;
            const numberStr = currentNum.toString().padStart(2, '0');
            const base = customBaseName || "image"; 
            fileName = `${base}_${numberStr}${suffix}.jpg`;
        } else {
            // 【リネームOFF】: 元のファイル名（拡張子抜き） + サフィックス
            const originalBase = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            fileName = `${originalBase}${suffix}.jpg`;
        }

        showPreview(processedUrl, fileName);

        const imageData = processedUrl.split(',')[1];
        zip.file(fileName, imageData, {base64: true});
    }

    statusText.textContent = "ZIPファイルを作成中...";
    const content = await zip.generateAsync({type: "blob"});
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(content);
    a.download = "processed_images.zip";
    a.click();
    URL.revokeObjectURL(a.href);

    statusText.textContent = "全件処理が完了しました！";
    startBtn.disabled = false;
});

// --- ヘルパー関数群 ---
async function convertHeic(file) {
    const originalName = file.name;
    const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8
    });
    convertedBlob.name = originalName.replace(/\.heic$/i, '.jpg');
    return convertedBlob;
}

function fileToDataUrl(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
    });
}

function processImageAsync(dataUrl, mode) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let tw, th, sx = 0, sy = 0, sw = img.width, sh = img.height; 

            if (mode === 'hero') {
                tw = 1200; th = 630;
                const targetAspect = tw / th; 
                const imgAspect = img.width / img.height;
                if (imgAspect > targetAspect) {
                    sw = img.height * targetAspect; sh = img.height;
                    sx = (img.width - sw) / 2; 
                } else {
                    sw = img.width; sh = img.width / targetAspect;
                    sy = (img.height - sh) / 2; 
                }
            } else {
                tw = (img.width > 1200) ? 1200 : img.width;
                th = img.height * (tw / img.width);
            }

            canvas.width = tw; canvas.height = th;
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, tw, th);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = dataUrl;
    });
}

function clearPreview() { preView.innerHTML = ''; }

function showPreview(url, fileName) {
    const item = document.createElement('div');
    item.className = 'preview-item'; // CSSでスタイリングしやすくするためにクラスを付与

    const img = document.createElement('img');
    img.src = url;
    
    const label = document.createElement('span');
    label.textContent = fileName;

    item.appendChild(img);
    item.appendChild(label);
    preView.appendChild(item);
}