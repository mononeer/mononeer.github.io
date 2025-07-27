// npm i express body-parser chokidar
import express from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import chokidar from 'chokidar';
const app = express();
app.use(express.json());

const POSTS_DIR = '../posts'; // relative to admin-blog folder
const clients = [];

app.post('/post', (req,res)=>{
  const {title,date,body,slug} = req.body;
  const yaml = `title: ${title}\ndate: ${date}\n---\n${body}`;
  writeFileSync(`${POSTS_DIR}/${slug}.yml`, yaml);
  clients.forEach(c=>c.write('data: reload\n\n'));
  res.sendStatus(201);
});

app.get('/events', (req,res)=>{
  res.writeHead(200,{'Content-Type':'text/event-stream'});
  res.write('\n');
  clients.push(res);
  req.on('close',()=>clients.splice(clients.indexOf(res),1));
});

// rebuild index.json on the fly
chokidar.watch(POSTS_DIR).on('add',()=>reindex());
function reindex(){
  const files = require('fs').readdirSync(POSTS_DIR).filter(f=>f.endsWith('.yml'));
  writeFileSync(`${POSTS_DIR}/index.json`, JSON.stringify(files.map(f=>f.replace('.yml',''))));
}
reindex();

app.listen(4000, ()=>console.log('Admin API on http://localhost:4000'));
