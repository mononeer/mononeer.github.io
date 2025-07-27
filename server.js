// npm i express body-parser js-yaml chokidar
import express from 'express';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import chokidar from 'chokidar';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('pages'));
app.use(express.json());
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/posts', express.static('posts'));

const POST_DIR = path.join(__dirname, 'posts');
if (!existsSync(POST_DIR)) mkdirSync(POST_DIR);

// build index.json for blog-engine.js
function buildIndex() {
  const files = readdirSync(POST_DIR).filter(f => f.endsWith('.yml'));
  writeFileSync(path.join(POST_DIR, 'index.json'), JSON.stringify(files.map(f => f.replace('.yml', ''))));
}
buildIndex();
chokidar.watch(POST_DIR).on('all', () => buildIndex());

// SSE endpoint
const clients = [];
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.write('retry: 1000\n\n');
  clients.push(res);
  req.on('close', () => clients.splice(clients.indexOf(res), 1));
});

// publish post
app.post('/api/post', (req, res) => {
  const { title, date, body } = req.body;
  const slug = title.toLowerCase().replace(/[^\w]/g,'-');
  const yamlStr = yaml.dump({ title, date }) + '---\n' + body;
  writeFileSync(path.join(POST_DIR, `${slug}.yml`), yamlStr);
  clients.forEach(c => c.write(`data: reload\n\n`));
  res.sendStatus(201);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}/pages/index.html`));
