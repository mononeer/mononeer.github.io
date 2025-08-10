document.addEventListener('DOMContentLoaded', () => {
    const views = document.querySelectorAll('.content');
    const navLinks = document.querySelectorAll('.nav-link');
    const breadcrumbs = document.querySelector('.breadcrumbs .path');
    const reposContainer = document.getElementById('repos');
    const repoCount = document.getElementById('repo-count');
    const starCount = document.getElementById('star-count');

    // Typewriter effect
    const typewriter = document.querySelector('.typewriter');
    if (typewriter) {
        const text = typewriter.textContent;
        typewriter.textContent = '';
        let i = 0;
        const typing = setInterval(() => {
            if (i < text.length) {
                typewriter.textContent += text[i];
                i++;
            } else {
                clearInterval(typing);
            }
        }, 50);
    }

    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const view = link.dataset.view;
            switchView(view);
            updateBreadcrumbs(`~/portfolio/${view === 'home' ? '' : view}`);
            navLinks.forEach(l => l.removeAttribute('aria-current'));
            link.setAttribute('aria-current', 'page');
        });
    });

    function switchView(viewName) {
        views.forEach(view => {
            view.classList.toggle('active', view.dataset.view === viewName);
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function updateBreadcrumbs(path) {
        if (breadcrumbs) breadcrumbs.textContent = path;
    }

    // GitHub integration
    if (reposContainer) {
        fetch('https://api.github.com/users/mononeer/repos?sort=updated&per_page=5', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('GitHub API request failed');
                return response.json();
            })
            .then(repos => {
                let html = '<h3 class="slide-up">Recent repositories</h3><ul class="repo-list">';
                repos.forEach((repo, index) => {
                    html += `
                        <li class="repo-item" style="--delay: ${0.2 + index * 0.1}s">
                            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link">
                                <span class="repo-name">${repo.name}</span>
                                <span class="repo-meta">
                                    <span class="repo-stars">★ ${repo.stargazers_count}</span>
                                    <span class="repo-forks">⑂ ${repo.forks_count}</span>
                                </span>
                            </a>
                            <p class="repo-desc">${repo.description || 'No description available'}</p>
                        </li>
                    `;
                });
                html += '</ul>';
                reposContainer.innerHTML = html;
            })
            .catch(() => {
                reposContainer.innerHTML = '<p class="error" role="alert">Failed to load repositories. Try refreshing.</p>';
            });
    }

    // Animate stats
    function animateValue(element, start, end, duration) {
        if (!element) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) window.requestAnimationFrame(step);
        };
        window.requestAnimationFrame(step);
    }

    if (repoCount && starCount) {
        fetch('https://api.github.com/users/mononeer', {
            headers: { 'Accept': 'application/vnd.github.v3+json' }
        })
            .then(response => {
                if (!response.ok) throw new Error('GitHub API request failed');
                return response.json();
            })
            .then(data => {
                animateValue(repoCount, 0, data.public_repos, 1000);
                return fetch('https://api.github.com/users/mononeer/repos', {
                    headers: { 'Accept': 'application/vnd.github.v3+json' }
                });
            })
            .then(response => {
                if (!response.ok) throw new Error('GitHub API request failed');
                return response.json();
            })
            .then(repos => {
                const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
                animateValue(starCount, 0, totalStars, 1000);
            })
            .catch(() => {
                if (repoCount) repoCount.textContent = 'N/A';
                if (starCount) starCount.textContent = 'N/A';
            });
    }
});