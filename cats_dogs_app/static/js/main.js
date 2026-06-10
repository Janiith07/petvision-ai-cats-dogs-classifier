// main.js — Cats vs Dogs frontend logic

const fileInput     = document.getElementById('fileInput');
const dropZone      = document.getElementById('dropZone');
const previewWrap   = document.getElementById('previewWrap');
const previewImg    = document.getElementById('previewImg');
const predictBtn    = document.getElementById('predictBtn');
const clearBtn      = document.getElementById('clearBtn');
const resultCard    = document.getElementById('resultCard');
const loadingOverlay= document.getElementById('loadingOverlay');
const toast         = document.getElementById('toast');
const tryAgainBtn   = document.getElementById('tryAgainBtn');

// Result elements
const resultLabel   = document.getElementById('resultLabel');
const resultConf    = document.getElementById('resultConf');
const barFill       = document.getElementById('barFill');
const barThumb      = document.getElementById('barThumb');
const catProb       = document.getElementById('catProb');
const dogProb       = document.getElementById('dogProb');

let selectedFile = null;


// ── File selection ────────────────────────────────────────────────────

fileInput.addEventListener('change', (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

// Click anywhere on drop zone opens picker
dropZone.addEventListener('click', () => {
  fileInput.click();
});


// ── Drag and drop ─────────────────────────────────────────────────────

dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleFile(file);
  else showToast('Please drop an image file (JPG, PNG, WEBP)');
});


// ── Handle selected file ──────────────────────────────────────────────

function handleFile(file) {
  selectedFile = file;

  // Show preview
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
  };
  reader.readAsDataURL(file);

  // Swap drop zone for preview
  dropZone.style.display    = 'none';
  previewWrap.style.display = 'flex';

  // Hide previous result
  resultCard.style.display = 'none';
}


// ── Clear ─────────────────────────────────────────────────────────────

function resetUI() {
  selectedFile              = null;
  fileInput.value           = '';
  previewImg.src            = '';
  dropZone.style.display    = 'flex';
  previewWrap.style.display = 'none';
  resultCard.style.display  = 'none';
}

clearBtn.addEventListener('click', resetUI);
tryAgainBtn.addEventListener('click', resetUI);


// ── Predict ───────────────────────────────────────────────────────────

predictBtn.addEventListener('click', async () => {
  if (!selectedFile) return;

  // Show loading
  loadingOverlay.style.display = 'flex';
  predictBtn.disabled = true;

  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const response = await fetch('/predict', {
      method: 'POST',
      body:   formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      showToast(data.error || 'Prediction failed. Check server.');
      return;
    }

    showResult(data);

  } catch (err) {
    showToast('Could not reach the server. Is app.py running?');
    console.error(err);
  } finally {
    loadingOverlay.style.display = 'none';
    predictBtn.disabled = false;
  }
});


// ── Show result ───────────────────────────────────────────────────────

function showResult(data) {
  // data = { label, confidence, raw_prob, emoji }

  const isDog   = data.label === 'Dog';
  const rawProb = data.raw_prob;                 // probability of Dog (sigmoid output)
  const dogPct  = Math.round(rawProb * 100);
  const catPct  = 100 - dogPct;

  // Fill in result values
  resultLabel.textContent = data.label;
  resultConf.textContent  = `${data.confidence}% confident`;

  // Colour the label
  resultLabel.style.color = isDog ? 'var(--dog-color)' : 'var(--cat-color)';

  // Move thumb on the gradient bar (0% = all cat, 100% = all dog)
  barThumb.style.left = `${dogPct}%`;

  // Probability labels
  catProb.textContent = `${catPct}%`;
  dogProb.textContent = `${dogPct}%`;

  // Reveal
  resultCard.style.display = 'block';

  // Smooth scroll to result
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}


// ── Toast notification ────────────────────────────────────────────────

function showToast(msg) {
  toast.textContent     = msg;
  toast.style.display   = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4000);
}
