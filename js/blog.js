const parseYML = txt => {
  const [meta,...body] = txt.split('\n---\n');
  const obj={};
  meta.split('\n').forEach(l=>{
    const [k,v] = l.split(': ');
    if(k) obj[k.trim()] = v.trim();
  });
  obj.content = body.join('\n---\n').trim();
  return obj;
};

export async function loadBlog(){
  const holder = document.getElementById('blog-list');
  if(!holder) return;
  try{
    const index = await fetch('../posts/index.json').then(r=>r.json());
    const posts = await Promise.all(index.map(slug=>
      fetch(`../posts/${slug}.yml`).then(r=>r.text()).then(parseYML)
    ));
    holder.innerHTML = posts.map(p=>`
      <article class="card">
        <h2>${p.title}</h2>
        <small>${p.date}</small>
        ${p.content.split('\n').map(l=>`<p>${l}</p>`).join('')}
      </article>`).join('');
  }catch{holder.textContent='No posts yet.';}
}
