import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const JSON_FILE = path.join(DATA_DIR, 'downloads.json');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = process.env.GITHUB_REPO || '0ABILASH/my-personal-website';
const GITHUB_JSON_URL = `https://api.github.com/repos/${GITHUB_REPO}/contents/data/downloads.json`;

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors({ origin: true }));
app.use(express.json());

let inMemoryData = null;
let inMemorySha = null;

async function githubGet() {
  if (!GITHUB_TOKEN) return null;
  const res = await fetch(GITHUB_JSON_URL, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
  return res.json();
}

async function githubPut(content, sha, message) {
  if (!GITHUB_TOKEN) return null;
  const res = await fetch(GITHUB_JSON_URL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, content, sha }),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${res.status}`);
  return res.json();
}

async function loadData() {
  if (inMemoryData) return inMemoryData;

  if (GITHUB_TOKEN) {
    try {
      const file = await githubGet();
      if (file && file.content) {
        inMemoryData = JSON.parse(Buffer.from(file.content, 'base64').toString('utf-8'));
        inMemorySha = file.sha;
        console.log(`[GITHUB] Loaded ${inMemoryData.length} records`);
        return inMemoryData;
      }
    } catch (e) {
      console.error('[GITHUB] Load failed:', e.message);
    }
  }

  if (fs.existsSync(JSON_FILE)) {
    try {
      inMemoryData = JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
      return inMemoryData;
    } catch { /* fall through */ }
  }

  inMemoryData = [];
  return inMemoryData;
}

async function saveData(data) {
  inMemoryData = data;

  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');

  if (GITHUB_TOKEN) {
    try {
      const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
      const result = await githubPut(content, inMemorySha || '', `Update downloads.json (${data.length} records)`);
      if (result && result.content) {
        inMemorySha = result.content.sha;
        console.log(`[GITHUB] Saved ${data.length} records`);
      }
    } catch (e) {
      console.error('[GITHUB] Save failed:', e.message);
    }
  }
}

app.post('/api/cv-download', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const data = await loadData();
    const now = new Date();
    data.push({
      sno: data.length + 1,
      name: name.trim(),
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN'),
    });

    await saveData(data);
    console.log(`[OK] Saved: ${name.trim()} (${data.length} total)`);
    res.json({ success: true });
  } catch (err) {
    console.error('[FAIL] CV download:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cv-downloads', async (req, res) => {
  res.json(await loadData());
});

const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`GitHub persistence: ${GITHUB_TOKEN ? 'ENABLED' : 'DISABLED (local only)'}`);
});
