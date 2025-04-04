// Update time
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    
    // Update date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = now.toLocaleDateString('en-US', options);
    
    // Update greeting
    let greeting = "Good ";
    const hour = now.getHours();
    if (hour < 12) {
        greeting += "morning";
    } else if (hour < 18) {
        greeting += "afternoon";
    } else {
        greeting += "evening";
    }
    document.getElementById('greeting').textContent = greeting;
}

// Initial call
updateTime();

// Update every minute
setInterval(updateTime, 60000);

// Handle search
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search').value.trim().toLowerCase();
    
    if (query === 'help') {
        switchTab('terminal');
        executeCommand('help');
        return;
    } else if (query === 'terminal') {
        switchTab('terminal');
        document.getElementById('terminal-input').focus();
        return;
    } else if (query === 'games') {
        switchTab('games');
        return;
    } else if (query === 'links') {
        switchTab('quick-links');
        return;
    }
    
    if (query) {
        if (query.includes('.') && !query.includes(' ')) {
            // If it looks like a URL
            window.location.href = query.startsWith('http') ? query : `https://${query}`;
        } else {
            // Google search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }
}

// Switch tabs
function switchTab(tabName) {
    // Update active tab button
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(btn => {
        if (btn) {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().includes(tabName)) {
                btn.classList.add('active');
            }
        }
    });
    
    // Hide all tabs
    const tabs = ['quick-links-tab', 'terminal-tab', 'games-tab'];
    tabs.forEach(tab => {
        const tabElement = document.getElementById(tab);
        if (tabElement) {
            tabElement.classList.add('hidden');
        }
    });
    
    // Show selected tab
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.remove('hidden');
    }
    
    // Focus terminal input if terminal tab
    if (tabName === 'terminal') {
        setTimeout(() => {
            const terminalInput = document.getElementById('terminal-input');
            if (terminalInput) {
                terminalInput.focus();
            }
        }, 100);
    }
}

// Terminal commands
const commands = {
    help: {
        description: "Show available commands",
        execute: () => {
            let output = "<div class='mb-4'>Available commands:</div>";
            output += "<div class='grid grid-cols-2 gap-2'>";
            
            for (const [cmd, details] of Object.entries(commands)) {
                output += `<div class='flex'><span class='text-green-400 w-24'>${cmd}</span><span class='text-gray-400'>${details.description}</span></div>`;
            }
            
            output += "</div>";
            return output;
        }
    },
    clear: {
        description: "Clear terminal screen",
        execute: () => {
            document.getElementById('terminal-output').innerHTML = '';
            return '';
        }
    },
    time: {
        description: "Show current time",
        execute: () => {
            const now = new Date();
            return `Current time: ${now.toLocaleTimeString()}`;
        }
    },
    date: {
        description: "Show current date",
        execute: () => {
            const now = new Date();
            return `Current date: ${now.toLocaleDateString()}`;
        }
    },
    links: {
        description: "Show quick links",
        execute: () => {
            switchTab('quick-links');
            return 'Switched to Quick Links tab';
        }
    },
    games: {
        description: "Show game shortcuts",
        execute: () => {
            switchTab('games');
            return 'Switched to Games tab';
        }
    },
    theme: {
        description: "Change theme (light/dark)",
        execute: (args) => {
            if (args[0] === 'light') {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                return 'Switched to light theme';
            } else if (args[0] === 'dark') {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                return 'Switched to dark theme';
            } else {
                return 'Usage: theme [light|dark]';
            }
        }
    }
};

// Terminal command execution
function executeCommand(input) {
    const terminalOutput = document.getElementById('terminal-output');
    if (!terminalOutput) return; // Exit if terminal output element doesn't exist
    
    const parts = input.split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);
    
    // Add command to output
    terminalOutput.innerHTML += `<div class="mb-1"><span class="text-green-400">$</span> ${input}</div>`;
    
    // Execute command
    if (commands[cmd]) {
        const result = commands[cmd].execute(args);
        if (result) {
            terminalOutput.innerHTML += `<div class="mb-4">${result}</div>`;
        }
    } else {
        terminalOutput.innerHTML += `<div class="mb-4 text-red-400">Command not found: ${cmd}. Type 'help' for available commands.</div>`;
    }
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Search form
    document.getElementById('search-form').addEventListener('submit', handleSearch);
    
    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // Command links
    document.querySelectorAll('.command-link').forEach(link => {
        link.addEventListener('click', function() {
            document.getElementById('search').value = this.dataset.command;
            document.getElementById('search-form').dispatchEvent(new Event('submit'));
        });
    });
    
    // Terminal input
    document.getElementById('terminal-input').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            executeCommand(this.value);
            this.value = '';
        }
    });
    
    // Terminal area click to focus
    document.querySelector('.terminal-body').addEventListener('click', function(e) {
        // Only focus if the click wasn't on the input itself (to avoid focus issues)
        if (e.target.id !== 'terminal-input') {
            document.getElementById('terminal-input').focus();
        }
    });
});

// Load a random quote
const quotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Innovation distinguishes between a leader and a follower. - Steve Jobs",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "Stay hungry, stay foolish. - Steve Jobs",
    "The best way to predict the future is to invent it. - Alan Kay",
    "Talk is cheap. Show me the code. - Linus Torvalds",
    "First, solve the problem. Then, write the code. - John Johnson",
    "Simplicity is the soul of efficiency. - Austin Freeman",
    "Make it work, make it right, make it fast. - Kent Beck",
    "Code is like humor. When you have to explain it, it's bad. - Cory House"
];

document.getElementById('quote').textContent = quotes[Math.floor(Math.random() * quotes.length)];

// Set focus on search bar when page loads
// Use DOMContentLoaded instead of window.onload
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('search')?.focus();
    loadQuickLinks();
    loadTheme();
    getLocationAndWeather();
});

// Modal functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
    modal.setAttribute('data-visible', 'true');
    
    if (modalId === 'settings-modal') {
        loadSettingsForm();
    } else if (modalId === 'bookmarks-modal') {
        loadBookmarks();
    } else if (modalId === 'history-modal') {
        loadHistory();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
    modal.setAttribute('data-visible', 'false');
}

// Event listeners for modal buttons
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('settings-btn').addEventListener('click', () => openModal('settings-modal'));
    document.getElementById('bookmarks-btn').addEventListener('click', () => openModal('bookmarks-modal'));
    document.getElementById('history-btn').addEventListener('click', () => openModal('history-modal'));
    
    // Close modals when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
            event.target.setAttribute('data-visible', 'false');
        }
    });

    // Initialize tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const tabName = e.target.textContent.toLowerCase().trim().split(' ')[0];
            switchTab(tabName);
        });
    });

    // Initialize with quick-links tab active
    switchTab('quick-links');
});

// Get icon from URL
function getIconFromUrl(url) {
    const domain = new URL(url.includes('://') ? url : `https://${url}`).hostname;
    
    // Common domains with specific icons
    const domainIcons = {
        'google.com': 'google',
        'youtube.com': 'youtube',
        'github.com': 'github',
        'twitter.com': 'twitter',
        'facebook.com': 'facebook',
        'instagram.com': 'instagram',
        'linkedin.com': 'linkedin',
        'reddit.com': 'reddit',
        'pinterest.com': 'pinterest',
        'tumblr.com': 'tumblr',
        'wordpress.com': 'wordpress',
        'amazon.com': 'amazon',
        'wikipedia.org': 'wikipedia-w',
        'stackoverflow.com': 'stack-overflow',
        'medium.com': 'medium',
        'quora.com': 'quora',
        'dropbox.com': 'dropbox',
        'drive.google.com': 'google-drive',
        'mail.google.com': 'envelope',
        'calendar.google.com': 'calendar',
        'maps.google.com': 'map',
        'netflix.com': 'netflix',
        'spotify.com': 'spotify',
        'twitch.tv': 'twitch',
        'discord.com': 'discord',
        'slack.com': 'slack',
        'trello.com': 'trello',
        'notion.so': 'sticky-note',
        'figma.com': 'figma',
        'adobe.com': 'adobe',
        'apple.com': 'apple',
        'microsoft.com': 'microsoft',
        'windows.com': 'windows',
        'linux.org': 'linux',
        'android.com': 'android',
        'npmjs.com': 'npm',
        'docker.com': 'docker',
        'kubernetes.io': 'kubernetes'
    };
    
    // Check if domain matches any known domains
    for (const [key, value] of Object.entries(domainIcons)) {
        if (domain.includes(key)) {
            return `fab fa-${value}`;
        }
    }
    
    // Default icon based on TLD
    const tld = domain.split('.').pop();
    const tldIcons = {
        'org': 'building',
        'gov': 'landmark',
        'edu': 'graduation-cap',
        'net': 'network-wired',
        'io': 'code',
        'dev': 'code',
        'co': 'building',
        'com': 'globe',
        'me': 'user'
    };
    
    return `fas fa-${tldIcons[tld] || 'link'}`;
}

// Get color gradient based on URL
function getColorFromUrl(url) {
    // Simple hash function to generate consistent colors from URL
    let hash = 0;
    for (let i = 0; i < url.length; i++) {
        hash = url.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    
    // Generate a pastel color from the hue
    const h = hue;
    const s = 70 + (hash % 20); // 70-90% saturation
    const l = 50 + (hash % 10); // 50-60% lightness
    
    // Convert HSL to RGB
    const c = (1 - Math.abs(2 * l/100 - 1)) * s/100;
    const x = c * (1 - Math.abs((h/60) % 2 - 1));
    const m = l/100 - c/2;
    
    let r, g, b;
    if (h >= 0 && h < 60) {
        [r, g, b] = [c, x, 0];
    } else if (h >= 60 && h < 120) {
        [r, g, b] = [x, c, 0];
    } else if (h >= 120 && h < 180) {
        [r, g, b] = [0, c, x];
    } else if (h >= 180 && h < 240) {
        [r, g, b] = [0, x, c];
    } else if (h >= 240 && h < 300) {
        [r, g, b] = [x, 0, c];
    } else {
        [r, g, b] = [c, 0, x];
    }
    
    // Convert to 0-255 range
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    // Generate two colors for gradient
    const color1 = `rgb(${r},${g},${b})`;
    const color2 = `rgb(${Math.max(0, r-50)},${Math.max(0, g-50)},${Math.max(0, b-50)})`;
    
    return `from-[${color1}] to-[${color2}]`;
}

// Quick Links Management
function loadQuickLinks() {
    const container = document.getElementById('quick-links-container');
    container.innerHTML = '';
    
    let links = localStorage.getItem('quickLinks');
    if (!links) {
        // Default links
        links = [
            { name: 'Gmail', url: 'https://mail.google.com' },
            { name: 'YouTube', url: 'https://youtube.com' },
            { name: 'GitHub', url: 'https://github.com' },
            { name: 'Twitter', url: 'https://twitter.com' },
            { name: 'Calendar', url: 'https://calendar.google.com' }
        ];
        localStorage.setItem('quickLinks', JSON.stringify(links));
    } else {
        links = JSON.parse(links);
    }
    
    links.forEach(link => {
        const iconClass = getIconFromUrl(link.url);
        const colorClass = getColorFromUrl(link.url);
        
        const linkElement = document.createElement('a');
        linkElement.href = link.url;
        linkElement.className = 'quick-link flex flex-col items-center p-4 rounded-xl bg-black bg-opacity-10 backdrop-blur-sm';
        linkElement.innerHTML = `
            <div class="w-12 h-12 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center mb-2">
                <i class="${iconClass} text-white"></i>
            </div>
            <span class="text-sm terminal-font">${link.name}</span>
        `;
        container.appendChild(linkElement);
    });
}

function loadSettingsForm() {
    const theme = localStorage.getItem('theme') || 'dark';
    document.getElementById('theme-select').value = theme;
    
    const linkEditors = document.getElementById('link-editors');
    linkEditors.innerHTML = '';
    
    let links = localStorage.getItem('quickLinks');
    if (links) {
        links = JSON.parse(links);
        
        links.forEach((link, index) => {
            const editor = document.createElement('div');
            editor.className = 'link-editor';
            editor.innerHTML = `
                <input type="text" class="form-control" placeholder="Name" value="${link.name}" data-index="${index}" data-field="name">
                <input type="text" class="form-control" placeholder="URL" value="${link.url}" data-index="${index}" data-field="url">
                <button class="remove-link" data-index="${index}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            // Add event listener to the remove button
            const removeButton = editor.querySelector('.remove-link');
            removeButton.addEventListener('click', () => removeLink(index));
            
            linkEditors.appendChild(editor);
        });
    }
}

function addLink() {
    const linkEditors = document.getElementById('link-editors');
    const editor = document.createElement('div');
    editor.className = 'link-editor';
    editor.innerHTML = `
        <input type="text" class="form-control" placeholder="Name" data-index="-1" data-field="name">
        <input type="text" class="form-control" placeholder="URL" data-index="-1" data-field="url">
        <button class="remove-link" data-index="-1">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    // Add event listener to the remove button
    const removeButton = editor.querySelector('.remove-link');
    removeButton.addEventListener('click', () => removeLink(-1));
    
    linkEditors.appendChild(editor);
}

function removeLink(index) {
    if (index === -1) {
        // Remove the last empty editor
        const editors = document.querySelectorAll('.link-editor');
        const lastEditor = editors[editors.length - 1];
        if (lastEditor) {
            lastEditor.remove();
        }
        return;
    }
    
    let links = localStorage.getItem('quickLinks');
    if (links) {
        links = JSON.parse(links);
        links.splice(index, 1);
        localStorage.setItem('quickLinks', JSON.stringify(links));
        loadSettingsForm();
    }
}

document.getElementById('add-link-btn').addEventListener('click', addLink);

function saveSettings() {
    // Save theme
    const themeSelect = document.getElementById('theme-select');
    const theme = themeSelect?.value || 'dark';
    localStorage.setItem('theme', theme);
    
    // Add null check before accessing classList
    if (document.body) {
        document.body.classList.toggle('light-mode', theme === 'light');
    }
    
    // Save quick links
    const inputs = document.querySelectorAll('#link-editors input');
    const links = [];
    
    let currentLink = {};
    inputs.forEach(input => {
        const index = parseInt(input.dataset.index || '-1');
        const field = input.dataset.field;
        const value = input.value.trim();
        
        if (index === -1) {
            // New link
            if (value && field) {
                currentLink[field] = value;
                
                if (Object.keys(currentLink).length === 2) {
                    // Both fields are filled
                    links.push(currentLink);
                    currentLink = {};
                }
            }
        } else {
            // Existing link
            if (!links[index]) {
                links[index] = {};
            }
            
            if (value && field) {
                links[index][field] = value;
            }
        }
    });
    
    // Filter out any incomplete links
    const completeLinks = links.filter(link => 
        link.name && link.url
    );
    
    localStorage.setItem('quickLinks', JSON.stringify(completeLinks));
    loadQuickLinks();
    closeModal('settings-modal');
}

function loadTheme() {
    const theme = localStorage.getItem('theme') || 'dark';
    // Add null check before accessing classList
    if (document.body) {
        document.body.classList.toggle('light-mode', theme === 'light');
    }
}

// Browser Bookmarks Integration
function loadBookmarks() {
    const bookmarksList = document.getElementById('bookmarks-list');
    
    // Check if browser supports bookmarks API
    if (chrome && chrome.bookmarks) {
        chrome.bookmarks.getTree(function(bookmarkTreeNodes) {
            const bookmarks = flattenBookmarks(bookmarkTreeNodes);
            
            if (bookmarks.length === 0) {
                bookmarksList.innerHTML = `
                    <div class="no-items">
                        <i class="fas fa-bookmark text-2xl mb-2"></i>
                        <p>No bookmarks found</p>
                    </div>
                `;
                return;
            }
            
            bookmarksList.innerHTML = '';
            
            // Sort by title
            bookmarks.sort((a, b) => a.title.localeCompare(b.title));
            
            // Display bookmarks
            bookmarks.forEach(bookmark => {
                const iconClass = getIconFromUrl(bookmark.url);
                
                const bookmarkItem = document.createElement('div');
                bookmarkItem.className = 'bookmark-item';
                bookmarkItem.innerHTML = `
                    <div class="bookmark-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="bookmark-details">
                        <div class="bookmark-title">${bookmark.title}</div>
                        <div class="bookmark-url">${bookmark.url}</div>
                    </div>
                `;
                
                bookmarkItem.addEventListener('click', () => {
                    window.open(bookmark.url, '_blank');
                });
                
                bookmarksList.appendChild(bookmarkItem);
            });
        });
    } else {
        // Fallback for browsers without bookmarks API
        bookmarksList.innerHTML = `
            <div class="no-items">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>Bookmarks API not available in this browser</p>
            </div>
        `;
    }
}

// Flatten bookmarks tree into array
function flattenBookmarks(bookmarkTreeNodes) {
    let bookmarks = [];
    
    bookmarkTreeNodes.forEach(function(node) {
        if (node.children) {
            bookmarks = bookmarks.concat(flattenBookmarks(node.children));
        }
        
        if (node.url) {
            bookmarks.push({
                title: node.title,
                url: node.url
            });
        }
    });
    
    return bookmarks;
}

// Browser History Integration
function loadHistory() {
    const historyList = document.getElementById('history-list');
    
    // Check if browser supports history API
    if (chrome && chrome.history) {
        chrome.history.search({
            text: '',
            maxResults: 50,
            startTime: 0
        }, function(historyItems) {
            if (historyItems.length === 0) {
                historyList.innerHTML = `
                    <div class="no-items">
                        <i class="fas fa-history text-2xl mb-2"></i>
                        <p>No history items found</p>
                    </div>
                `;
                return;
            }
            
            historyList.innerHTML = '';
            
            // Sort by most recent
            historyItems.sort((a, b) => b.lastVisitTime - a.lastVisitTime);
            
            // Display history
            historyItems.forEach(item => {
                const iconClass = getIconFromUrl(item.url);
                const visitTime = new Date(item.lastVisitTime);
                const timeString = formatTimeAgo(visitTime);
                
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <div class="history-details">
                        <div class="history-title">${item.title || item.url}</div>
                        <div class="history-url">${item.url}</div>
                    </div>
                    <div class="history-time">${timeString}</div>
                `;
                
                historyItem.addEventListener('click', () => {
                    window.open(item.url, '_blank');
                });
                
                historyList.appendChild(historyItem);
            });
        });
    } else {
        // Fallback for browsers without history API
        historyList.innerHTML = `
            <div class="no-items">
                <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                <p>History API not available in this browser</p>
            </div>
        `;
    }
}

// Format time ago string
function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays}d ago`;
    }
    
    return date.toLocaleDateString();
}

// Location and Weather
function getLocationAndWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                getCityName(latitude, longitude);
                getWeather(latitude, longitude);
            },
            error => {
                console.error("Error getting location:", error);
                document.getElementById('location').textContent = "Location blocked";
            }
        );
    } else {
        document.getElementById('location').textContent = "Geolocation not supported";
    }
}

function getCityName(latitude, longitude) {
    // Using OpenStreetMap Nominatim API for reverse geocoding
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const city = data.address.city || data.address.town || data.address.village || data.address.county;
            const country = data.address.country;
            document.getElementById('location').textContent = city ? `${city}, ${country}` : country;
        })
        .catch(error => {
            console.error("Error getting city name:", error);
            document.getElementById('location').textContent = "Unknown location";
        });
}

function getWeather(latitude, longitude) {
    const apiKey = 'API_KEY';
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.main.temp);
            const weather = data.weather[0];
            const icon = getWeatherIcon(weather.id);
            
            document.getElementById('temperature').textContent = `${temp}°F`;
            
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.innerHTML = `<i class="fas ${icon} text-xl"></i>`;
            weatherIcon.className = `weather-icon ${getWeatherColorClass(weather.id)}`;
        })
        .catch(error => {
            console.error("Error getting weather:", error);
            document.getElementById('temperature').textContent = "--°F";
            document.getElementById('weather-icon').innerHTML = '<i class="fas fa-question text-xl"></i>';
        });
}

function getWeatherIcon(weatherId) {
    // Map weather codes to Font Awesome icons
    if (weatherId >= 200 && weatherId < 300) return 'fa-bolt'; // Thunderstorm
    if (weatherId >= 300 && weatherId < 400) return 'fa-cloud-rain'; // Drizzle
    if (weatherId >= 500 && weatherId < 600) return 'fa-umbrella'; // Rain
    if (weatherId >= 600 && weatherId < 700) return 'fa-snowflake'; // Snow
    if (weatherId >= 700 && weatherId < 800) return 'fa-smog'; // Atmosphere
    if (weatherId === 800) return 'fa-sun'; // Clear
    if (weatherId > 800) return 'fa-cloud'; // Clouds
    return 'fa-question';
}

function getWeatherColorClass(weatherId) {
    // Map weather codes to color classes
    if (weatherId >= 200 && weatherId < 300) return 'text-purple-300'; // Thunderstorm
    if (weatherId >= 300 && weatherId < 600) return 'text-blue-300'; // Rain/Drizzle
    if (weatherId >= 600 && weatherId < 700) return 'text-white'; // Snow
    if (weatherId >= 700 && weatherId < 800) return 'text-gray-300'; // Atmosphere
    if (weatherId === 800) return 'text-yellow-300'; // Clear
    if (weatherId > 800) return 'text-gray-300'; // Clouds
    return 'text-gray-300';
}

// Initialize all event listeners
function initializeEventListeners() {
    // Modal buttons
    document.getElementById('settings-btn')?.addEventListener('click', () => openModal('settings-modal'));
    document.getElementById('bookmarks-btn')?.addEventListener('click', () => openModal('bookmarks-modal'));
    document.getElementById('history-btn')?.addEventListener('click', () => openModal('history-modal'));

    // Close modal buttons
    document.querySelectorAll('.close-modal').forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                const modalId = e.target.closest('.modal')?.id;
                if (modalId) closeModal(modalId);
            });
        }
    });

    // Tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                const tabName = button.getAttribute('data-tab');
                if (tabName) switchTab(tabName);
            });
        }
    });

    // Search form
    document.getElementById('search-form')?.addEventListener('submit', handleSearch);

    // Command links
    document.querySelectorAll('.command-link').forEach(link => {
        if (link) {
            link.addEventListener('click', (e) => {
                const command = e.target.getAttribute('data-command');
                if (command) {
                    const searchInput = document.getElementById('search');
                    if (searchInput) {
                        searchInput.value = command;
                        searchInput.focus();
                    }
                }
            });
        }
    });

    // Add link button
    document.getElementById('add-link-btn')?.addEventListener('click', addLink);

    // Save settings button
    document.getElementById('save-settings')?.addEventListener('click', saveSettings);

    // Terminal input
    document.getElementById('terminal-input')?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = e.target.value.trim();
            if (input) {
                executeCommand(input);
                e.target.value = '';
            }
        }
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal.id);
                }
            });
        }
    });
}

// DOM Ready event handler
document.addEventListener('DOMContentLoaded', () => {
    // Initialize event listeners
    initializeEventListeners();
    
    // Initial setup
    updateTime();
    setInterval(updateTime, 60000);
    document.getElementById('search')?.focus();
    loadQuickLinks();
    loadTheme();
    getLocationAndWeather();
    document.getElementById('quote').textContent = quotes[Math.floor(Math.random() * quotes.length)];
});