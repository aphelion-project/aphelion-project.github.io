function updateTerminalTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;
    
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

updateTerminalTime();
setInterval(updateTerminalTime, 1000);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        window.location.href = 'index.html';
    }

    if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = 'index.html';
    }
});

window.addEventListener('load', () => {
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
        terminalBody.style.opacity = '0';
        setTimeout(() => {
            terminalBody.style.transition = 'opacity 0.5s ease';
            terminalBody.style.opacity = '1';
        }, 100);
    }
});