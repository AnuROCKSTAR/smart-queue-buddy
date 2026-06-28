// Smart Queue Buddy - Main Script

// Update Clock
function updateClock() {
    const now = new Date();
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('en-US', dateOptions);
    document.getElementById('current-date').textContent = dateStr;
    
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    document.getElementById('current-time').textContent = timeStr;
}

// Initialize Clock
updateClock();
setInterval(updateClock, 1000);

// Menu Navigation
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const menu = item.dataset.menu;
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const selectedSection = document.getElementById(menu);
        if (selectedSection) {
            selectedSection.classList.add('active');
        }
        
        // Update active menu
        document.querySelectorAll('.menu-item').forEach(m => {
            m.classList.remove('active');
        });
        item.classList.add('active');
    });
});

// Queue Status Management
function updateQueueStatus() {
    const queueLength = parseInt(document.getElementById('queue-length').textContent);
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    
    if (queueLength < 20) {
        statusDot.style.backgroundColor = '#22C55E';
        statusText.textContent = '🟢 Queue Moving Normally';
    } else if (queueLength < 40) {
        statusDot.style.backgroundColor = '#F59E0B';
        statusText.textContent = '🟡 Moderate Wait';
    } else {
        statusDot.style.backgroundColor = '#EF4444';
        statusText.textContent = '🔴 Heavy Queue';
    }
}

// Cancel Token Modal
document.getElementById('logout-btn')?.addEventListener('click', () => {
    alert('Logout functionality - Session data will be cleared.');
});

// QR Code Button
document.getElementById('qr-btn')?.addEventListener('click', () => {
    alert('QR Code Generated!\n\nToken: B-1052\n\nYou can scan this code to share your token details.');
});

// Charts
let queueChart;
let waitingChart;

function initCharts() {
    // Queue Length Chart
    const queueCtx = document.getElementById('queueChart')?.getContext('2d');
    if (queueCtx) {
        queueChart = new Chart(queueCtx, {
            type: 'line',
            data: {
                labels: ['10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM'],
                datasets: [{
                    label: 'Queue Length',
                    data: [15, 22, 45, 52, 47, 35, 20],
                    borderColor: '#2563EB',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#2563EB',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 116, 139, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    // Waiting Time Chart
    const waitingCtx = document.getElementById('waitingChart')?.getContext('2d');
    if (waitingCtx) {
        waitingChart = new Chart(waitingCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                datasets: [{
                    label: 'Avg Wait Time (mins)',
                    data: [18, 15, 22, 19, 25, 12],
                    backgroundColor: [
                        '#14B8A6',
                        '#2563EB',
                        '#6366F1',
                        '#14B8A6',
                        '#8B5CF6',
                        '#2563EB'
                    ],
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(100, 116, 139, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Queue Simulation
let simulationInterval;
let simulationRunning = false;
let simulationTime = 0;

function startSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    simulationTime = 0;
    
    document.getElementById('simulation-btn').style.display = 'none';
    document.getElementById('simulation-status').style.display = 'block';
    
    simulationInterval = setInterval(() => {
        simulationTime++;
        document.getElementById('sim-time').textContent = simulationTime + 's';
        
        // Update token numbers
        const currentToken = parseInt(document.getElementById('current-token').textContent.replace('B-', ''));
        document.getElementById('current-token').textContent = 'B-' + (currentToken + 1);
        
        // Update your token
        const yourToken = parseInt(document.getElementById('your-token').textContent.replace('B-', ''));
        if (yourToken > 1) {
            document.getElementById('your-token').textContent = 'B-' + (yourToken - 1);
        }
        
        // Update wait time
        const waitTime = Math.max(1, Math.floor(Math.random() * 20));
        document.getElementById('wait-time').textContent = waitTime + ' mins';
        
        // Update queue length
        const queueLength = Math.max(1, Math.floor(Math.random() * 50));
        document.getElementById('queue-length').textContent = queueLength;
        
        // Update best arrival time
        const now = new Date();
        const arrival = new Date(now.getTime() + waitTime * 60000);
        const arrivalStr = arrival.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        document.getElementById('best-arrival').textContent = arrivalStr;
        
        // Update queue status
        updateQueueStatus();
        
        // Update charts if they exist
        if (queueChart) {
            queueChart.data.datasets[0].data.shift();
            queueChart.data.datasets[0].data.push(queueLength);
            queueChart.update('none');
        }
        
        // Show notification
        if (simulationTime % 5 === 0) {
            showNotification('Queue Updated', 'Queue status has been updated. Estimated wait: ' + waitTime + ' minutes');
        }
    }, 1000);
}

function stopSimulation() {
    if (!simulationRunning) return;
    
    simulationRunning = false;
    clearInterval(simulationInterval);
    
    document.getElementById('simulation-btn').style.display = 'inline-block';
    document.getElementById('simulation-status').style.display = 'none';
    document.getElementById('simulation-btn').textContent = '▶ Start Queue Simulation';
}

document.getElementById('simulation-btn')?.addEventListener('click', startSimulation);
document.getElementById('stop-simulation')?.addEventListener('click', stopSimulation);

// Notification System
function showNotification(title, message) {
    // Check if browser supports notifications
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="%232563EB"/><path d="M 20 10 L 28 26 L 12 26 Z" fill="white"/></svg>'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    }
}

// Request notification permission on load
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize
window.addEventListener('load', () => {
    updateQueueStatus();
    initCharts();
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        // Search functionality
    }
});