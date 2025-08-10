document.addEventListener('DOMContentLoaded', () => {
    const reposContainer = document.getElementById('repos');
    const repoCount = document.getElementById('repo-count');
    const starCount = document.getElementById('star-count');
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const themeToggle = document.querySelector('.theme-toggle');
    const terminalContent = document.querySelector('.terminal-content');

    // Typewriter effect (only for home page)
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

    // Theme toggle
    if (themeToggle) {
        const isDark = localStorage.getItem('theme') === 'dark';
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeToggle.textContent = '☀️';
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const isDarkMode = document.body.classList.contains('dark-mode');
            themeToggle.textContent = isDarkMode ? '☀️' : '🌙';
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }

    // Page transition
    if (terminalContent) {
        terminalContent.style.opacity = '0';
        setTimeout(() => {
            terminalContent.style.opacity = '1';
        }, 100);
    }

    // GitHub integration (only for github page)
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

    // Animate stats (only for github page)
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

    // Contact form submission (only for contact page)
    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Sending...';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                formStatus.textContent = 'Failed to send message. Please try again.';
                formStatus.className = 'form-status error';
            }
        });
    }
});