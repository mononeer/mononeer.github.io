// tiny YAML parser
const parseYML = txt => {
  const [meta, ...body] = txt.split('\n---\n');
  const obj = {};
  meta.split('\n').forEach(l => {
    const [k, v] = l.split(': ');
    if (k) obj[k.trim()] = v.trim();
  });
  obj.content = body.join('\n---\n').trim();
  return obj;
};

// render list
async function renderBlogList() {
  const holder = document.getElementById('blog-list');
  if (!holder) return;
  holder.innerHTML = '';
  const list = await (await fetch('../posts/index.json')).json();
  for (const slug of list) {
    const raw = await (await fetch(`../posts/${slug}.yml`)).text();
    const {title, date, content} = parseYML(raw);
    holder.insertAdjacentHTML('beforeend', `
      <article>
        <h2><a href="#${slug}">${title}</a></h2>
        <div class="date">${date}</div>
        ${content.split('\n').map(p=>`<p>${p}</p>`).join('')}
      </article>
    `);
  }
}

renderBlogList();
