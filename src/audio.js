let audioCtx = null;
let audioRef = null;
let sourceNode = null;
let gainNode = null;

const SONGS = [
  { title:'Acoustic Sunrise', artist:'Morning Sessions', dur:'3:42', durSec:222, link:'https://open.spotify.com/search/Acoustic%20Sunrise%20Morning%20Sessions', colors:['#f59e0b','#f97316'], notes:[261.63,329.63,392.00,329.63,261.63,196.00,261.63,329.63] },
  { title:'Midnight Drive', artist:'Lo-Fi Beats', dur:'4:15', durSec:255, link:'https://open.spotify.com/search/Midnight%20Drive%20Lo-Fi%20Beats', colors:['#6366f1','#8b5cf6'], notes:[220.00,277.18,329.63,277.18,220.00,185.00,220.00,277.18] },
  { title:'Electric Feel', artist:'Indie Collection', dur:'3:58', durSec:238, link:'https://open.spotify.com/search/Electric%20Feel%20Indie', colors:['#10b981','#06b6d4'], notes:[293.66,369.99,440.00,369.99,293.66,246.94,293.66,369.99] },
  { title:'Ocean Waves', artist:'Ambient Sounds', dur:'5:20', durSec:320, link:'https://open.spotify.com/search/Ocean%20Waves%20Ambient', colors:['#0ea5e9','#6366f1'], notes:[196.00,246.94,293.66,246.94,196.00,164.81,196.00,246.94] },
  { title:'Last Summer', artist:'Jazz Café', dur:'4:01', durSec:241, link:'https://open.spotify.com/search/Last%20Summer%20Jazz%20Cafe', colors:['#ec4899','#f43f5e'], notes:[349.23,440.00,523.25,440.00,349.23,293.66,349.23,440.00] },
];

const TOP_SONGS = [
  { title:'Blinding Lights', artist:'The Weeknd', dur:'3:20', genre:'Pop', link:'https://open.spotify.com/search/Blinding%20Lights%20The%20Weeknd' },
  { title:'Levitating', artist:'Dua Lipa', dur:'3:23', genre:'Pop', link:'https://open.spotify.com/search/Levitating%20Dua%20Lipa' },
  { title:'Bohemian Rhapsody', artist:'Queen', dur:'5:55', genre:'Rock', link:'https://open.spotify.com/search/Bohemian%20Rhapsody%20Queen' },
  { title:'Shape of You', artist:'Ed Sheeran', dur:'3:53', genre:'Pop', link:'https://open.spotify.com/search/Shape%20of%20You%20Ed%20Sheeran' },
  { title:'Starboy', artist:'The Weeknd', dur:'3:50', genre:'R&B', link:'https://open.spotify.com/search/Starboy%20The%20Weeknd' },
];

const PLAYLISTS = [
  { name:'Lo-Fi Chill Beats', desc:'Relaxing lo-fi for coding and studying', emoji:'🎧', songs:24, link:'https://open.spotify.com/playlist/37i9dQZF1DX4dyzvZRCJMC' },
  { name:'Indie Acoustic', desc:'Acoustic guitar vibes and folk tunes', emoji:'🎸', songs:18, link:'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U' },
  { name:'Jazz Café Evenings', desc:'Smooth jazz for late night sessions', emoji:'🎷', songs:30, link:'https://open.spotify.com/playlist/37i9dQZF1DWV7EzJMK2FUI' },
  { name:'Bollywood Classics', desc:'Timeless Indian music favourites', emoji:'🎶', songs:45, link:'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd' },
  { name:'Workout Energy', desc:'High energy tracks to keep you going', emoji:'💪', songs:35, link:'https://open.spotify.com/playlist/37i9dQZF1DX76Wlfdnj7AP' },
  { name:'Late Night Drive', desc:'Perfect songs for midnight road trips', emoji:'🌙', songs:20, link:'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M' },
];

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function generateMelody(notes, duration) {
  const ctx = getAudioCtx();
  const sampleRate = ctx.sampleRate;
  const totalSamples = sampleRate * duration;
  const buffer = ctx.createBuffer(2, totalSamples, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);
  const noteLen = duration / notes.length;
  const attack = 0.03;
  const decay = 0.05;
  const release = 0.1;

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(Math.floor(t / noteLen), notes.length - 1);
    const noteT = t - noteIdx * noteLen;
    const freq = notes[noteIdx];

    let env = 1;
    if (noteT < attack) env = noteT / attack;
    else if (noteT > noteLen - release) env = Math.max(0, (noteLen - noteT) / release);
    else if (noteT < attack + decay) env = 1 - 0.3 * ((noteT - attack) / decay);

    const wave1 = Math.sin(2 * Math.PI * freq * t) * 0.5;
    const wave2 = Math.sin(2 * Math.PI * freq * 2 * t) * 0.15;
    const wave3 = Math.sin(2 * Math.PI * freq * 0.5 * t) * 0.1;
    const vibrato = Math.sin(2 * Math.PI * 5 * t) * 0.002;
    const sample = (wave1 + wave2 + wave3) * env * 0.7 * (1 + vibrato);

    left[i] = sample;
    right[i] = sample * 0.95 + Math.sin(2 * Math.PI * (freq * 1.002) * t) * env * 0.05;
  }
  return buffer;
}

function bufferToWav(buffer) {
  const numCh = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numCh * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numCh, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeStr(36, 'data');
  view.setUint32(40, dataLength, true);

  const channels = [];
  for (let ch = 0; ch < numCh; ch++) channels.push(buffer.getChannelData(ch));

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }
  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

const generatedUrls = {};

function getAudioUrl(idx) {
  if (generatedUrls[idx]) return generatedUrls[idx];
  const song = SONGS[idx];
  const duration = Math.min(song.durSec, 120);
  const buffer = generateMelody(song.notes, duration);
  const blob = bufferToWav(buffer);
  const url = URL.createObjectURL(blob);
  generatedUrls[idx] = url;
  return url;
}

function initAudio() {
  if (audioRef) return audioRef;
  audioRef = new Audio();
  audioRef.volume = 1;
  audioRef.preload = 'auto';
  return audioRef;
}

function playSong(idx) {
  const audio = initAudio();
  audio.src = getAudioUrl(idx);
  audio.load();
  return audio.play();
}

function pauseSong() {
  if (audioRef) audioRef.pause();
}

function resumeSong() {
  if (audioRef) return audioRef.play();
}

function seekTo(pct) {
  if (audioRef && audioRef.duration) audioRef.currentTime = pct * audioRef.duration;
}

function setVolume(v) {
  if (audioRef) audioRef.volume = v / 100;
}

function getAudioRef() { return audioRef; }

export {
  SONGS, TOP_SONGS, PLAYLISTS,
  playSong, pauseSong, resumeSong, seekTo, setVolume, getAudioRef, getAudioCtx
};
