export async function loadProjects(){
  const list = document.getElementById('repo-list');
  if(!list) return;
  const repos = await fetch('https://api.github.com/users/mononeer/repos?per_page=100&sort=updated').then(r=>r.json());
  list.innerHTML = repos.map(r=>`
    <li class="card">
      <strong><a href="${r.html_url}" target="_blank">${r.name}</a></strong>
      <p>${r.description||''}</p>
      <small>Updated: ${new Date(r.updated_at).toLocaleString()}</small>
    </li>`).join('');
}
