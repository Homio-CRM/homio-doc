// Sobe vídeos e capas dos tutoriais para a Media Storage da subconta Homio (GHL) e imprime {nome: url}.
// Uso: node scripts/subir-midia.mjs <arquivo-com-o-PIT> universidade-homio <arquivo> [<arquivo>...]
// O PIT da subconta Homio fica em location_token (Supabase Homio Operations); nunca commitar o arquivo da chave.
// Cria (ou reaproveita) a pasta na raiz da Media Storage e envia cada arquivo com parentId.
import fs from 'node:fs';
import path from 'node:path';

const [pitFile, pastaNome, ...arquivos] = process.argv.slice(2);
if (!pitFile || !pastaNome || arquivos.length === 0) {
  console.error('uso: node upload_media.mjs <pit.txt> <pasta> <arquivo...>');
  process.exit(2);
}
const PIT = fs.readFileSync(pitFile, 'utf8').trim();
const LOC = 'sTzec3aUgGdmWIlduwGM';
const BASE = 'https://services.leadconnectorhq.com';
const H = { Authorization: `Bearer ${PIT}`, Version: '2021-07-28', Accept: 'application/json' };

const MIME = { '.mp4': 'video/mp4', '.webm': 'video/webm', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' };

async function acharOuCriarPasta(nome) {
  const u = new URL(`${BASE}/medias/files`);
  u.searchParams.set('altType', 'location');
  u.searchParams.set('altId', LOC);
  u.searchParams.set('type', 'folder');
  u.searchParams.set('sortBy', 'createdAt');
  u.searchParams.set('sortOrder', 'asc');
  const r = await fetch(u, { headers: H });
  if (r.ok) {
    const j = await r.json();
    const lista = j.files || j.data || [];
    const achada = lista.find((f) => f.name === nome && !f.parentId);
    if (achada) return achada._id || achada.id;
  } else {
    console.error('listar pastas:', r.status, (await r.text()).slice(0, 300));
  }
  const c = await fetch(`${BASE}/medias/folder`, {
    method: 'POST',
    headers: { ...H, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: nome, altType: 'location', altId: LOC }),
  });
  const t = await c.text();
  if (!c.ok) throw new Error(`criar pasta ${c.status}: ${t.slice(0, 300)}`);
  const j = JSON.parse(t);
  return j._id || j.id || j.data?._id;
}

async function subir(caminho, parentId) {
  const nome = path.basename(caminho);
  const ext = path.extname(nome).toLowerCase();
  const buf = fs.readFileSync(caminho);
  const fd = new FormData();
  fd.append('file', new Blob([buf], { type: MIME[ext] || 'application/octet-stream' }), nome);
  fd.append('hosted', 'false');
  fd.append('name', nome);
  if (parentId) fd.append('parentId', parentId);
  const ini = Date.now();
  const r = await fetch(`${BASE}/medias/upload-file`, { method: 'POST', headers: H, body: fd });
  const t = await r.text();
  if (!r.ok) throw new Error(`${nome}: ${r.status} ${t.slice(0, 300)}`);
  const j = JSON.parse(t);
  return { nome, url: j.url || j.fileUrl || j.data?.url, id: j.fileId || j._id || j.id, ms: Date.now() - ini, bytes: buf.length, raw: j };
}

// Desde 2026-11 o `url` devolvido pela API aponta para um domínio com a marca do fornecedor.
// O MDX usa a CDN neutra: https://assets.cdn.filesafe.space/<path>, com o `path` do registro.
const CDN = 'https://assets.cdn.filesafe.space/';

async function caminhosNaPasta(parentId) {
  const u = new URL(`${BASE}/medias/files`);
  u.searchParams.set('altType', 'location');
  u.searchParams.set('altId', LOC);
  u.searchParams.set('type', 'file');
  u.searchParams.set('parentId', parentId);
  u.searchParams.set('sortBy', 'createdAt');
  u.searchParams.set('sortOrder', 'desc');
  u.searchParams.set('limit', '100');
  const r = await fetch(u, { headers: H });
  if (!r.ok) throw new Error(`listar arquivos ${r.status}: ${(await r.text()).slice(0, 300)}`);
  const j = await r.json();
  return new Map((j.files || []).map((f) => [f._id, f.path]));
}

const parentId = await acharOuCriarPasta(pastaNome);
console.error('pasta', pastaNome, '=>', parentId);
const subidos = [];
for (const a of arquivos) {
  try {
    const r = await subir(a, parentId);
    subidos.push(r);
    console.error(`ok  ${r.nome}  ${(r.bytes / 1e6).toFixed(1)} MB  ${r.ms} ms`);
  } catch (e) {
    console.error('ERRO', e.message);
  }
}
const caminhos = await caminhosNaPasta(parentId);
const saida = {};
for (const r of subidos) {
  const p = r.raw.path || caminhos.get(r.id);
  saida[r.nome] = p ? CDN + p : null;
  if (!p) console.error(`sem path para ${r.nome} (id ${r.id}); resposta crua:`, JSON.stringify(r.raw).slice(0, 400));
}
console.log(JSON.stringify(saida, null, 2));
