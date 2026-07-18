import express from 'express';
import cors from 'cors';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_DIR = path.join(__dirname, 'data');
const JSON_FILE = path.join(DATA_DIR, 'downloads.json');
const EXCEL_FILE = path.join(DATA_DIR, 'cv_downloads.xlsx');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(cors({ origin: true }));
app.use(express.json());

function getData() {
  if (!fs.existsSync(JSON_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(JSON_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(JSON_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

async function writeExcel(data) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Downloads');
  sheet.columns = [
    { header: 'S.No', key: 'sno', width: 8 },
    { header: 'Name', key: 'name', width: 25 },
    { header: 'Date', key: 'date', width: 20 },
    { header: 'Time', key: 'time', width: 15 },
  ];
  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
  headerRow.alignment = { horizontal: 'center' };
  data.forEach(row => sheet.addRow(row));
  const buffer = await workbook.xlsx.writeBuffer();
  fs.writeFileSync(EXCEL_FILE, new Uint8Array(buffer));
}

app.post('/api/cv-download', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const data = getData();
  const now = new Date();
  data.push({
    sno: data.length + 1,
    name: name.trim(),
    date: now.toLocaleDateString('en-IN'),
    time: now.toLocaleTimeString('en-IN'),
  });

  saveData(data);

  try {
    await writeExcel(data);
    console.log(`[OK] Excel updated: ${data.length} rows`);
  } catch (e) {
    console.error(`[FAIL] Excel write:`, e);
  }

  res.json({ success: true });
});

app.get('/api/cv-downloads', (req, res) => {
  res.json(getData());
});

app.get('/api/cv-excel', async (req, res) => {
  if (!fs.existsSync(EXCEL_FILE)) return res.status(404).json({ error: 'No data' });
  res.download(EXCEL_FILE, 'cv_downloads.xlsx');
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
});
