// Enhanced particle configuration
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 80,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#ff6b35"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000000"
            }
        },
        "opacity": {
            "value": 0.4,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 1,
                "opacity_min": 0.2,
                "sync": false
            }
        },
        "size": {
            "value": 2,
            "random": true,
            "anim": {
                "enable": true,
                "speed": 2,
                "size_min": 0.5,
                "sync": false
            }
        },
        "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#ff6b35",
            "opacity": 0.2,
            "width": 1
        },
        "move": {
            "enable": true,
            "speed": 0.8,
            "direction": "none",
            "random": true,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
                "enable": true,
                "rotateX": 600,
                "rotateY": 1200
            }
        }
    },
    "interactivity": {
        "detect_on": "canvas",
        "events": {
            "onhover": {
                "enable": true,
                "mode": "grab"
            },
            "onclick": {
                "enable": false,
                "mode": "push"
            },
            "resize": true
        },
        "modes": {
            "grab": {
                "distance": 140,
                "line_linked": {
                    "opacity": 0.3
                }
            }
        }
    },
    "retina_detect": true
});

function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

function updateGreeting() {
    const now = new Date();
    const hour = now.getHours();
    let greeting = '';
    if (hour < 12) {
        greeting = 'Good morning, Srujan';
    } else if (hour < 18) {
        greeting = 'Good afternoon, Srujan';
    } else {
        greeting = 'Good evening, Srujan';
    }
    document.getElementById('greeting').textContent = greeting;
}
setInterval(updateGreeting, 60 * 1000);
updateGreeting();

// Store recent searches in localStorage
const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

function getRecentSearches() {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
}

function addToRecentSearches(query) {
    const searches = getRecentSearches();
    const newSearches = [query, ...searches.filter(s => s !== query)].slice(0, MAX_RECENT_SEARCHES);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(newSearches));
}

const CUSTOM_SHORTCUTS = {
    '/c': { name: 'ChatGPT', url: 'https://chat.openai.com', description: 'Search or start a new chat' },
    '/y': { name: 'YouTube', url: 'https://youtube.com', description: 'Search for videos' },
    '/g': { name: 'GitHub', url: 'https://github.com', description: 'Search repositories' },
    '/m': { name: 'Gmail', url: 'https://mail.google.com', description: 'Search emails' },
    '/d': { name: 'Google Drive', url: 'https://drive.google.com', description: 'Search files' },
};

let debounceTimer;
let currentFocusIndex = -1;

async function getSuggestions(event) {
    const input = event.target.value.trim();
    const suggestionsDiv = document.getElementById('search-suggestions');
    
    if (input.length < 1) {
        suggestionsDiv.style.display = 'none';
        return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        let suggestions = [];
        const slashCommand = input.split(' ')[0];

        if (input.startsWith('/')) {
            if (!input.includes(' ')) {
                // Show command suggestions
                suggestions = Object.entries(CUSTOM_SHORTCUTS)
                    .filter(([key]) => key.startsWith(input))
                    .map(([key, value]) => ({
                        text: `${key} - ${value.name}`,
                        type: 'Shortcut',
                        icon: getIconForCommand(key),
                        value: key + ' ',
                        description: value.description
                    }));
            }
        } else {
            // Show history suggestions
            const recentSearches = getRecentSearches()
                .filter(search => search.toLowerCase().includes(input.toLowerCase()))
                .map(search => ({
                    text: search,
                    type: 'History',
                    icon: 'fa-solid fa-clock-rotate-left',
                    value: search,
                    description: 'From your search history'
                }));

            suggestions.push(...recentSearches);
        }

        if (suggestions.length > 0) {
            suggestionsDiv.innerHTML = suggestions
                .map(suggestion => `
                    <div class="suggestion-item" 
                         data-value="${suggestion.value.replace(/"/g, '&quot;')}"
                         onclick="selectSuggestion('${suggestion.value.replace(/'/g, "\\'")}')">
                        <i class="${suggestion.icon} suggestion-icon"></i>
                        <div class="suggestion-content">
                            <div class="suggestion-text">${suggestion.text}</div>
                            <div class="suggestion-description">${suggestion.description}</div>
                        </div>
                        <span class="suggestion-category">${suggestion.type}</span>
                    </div>
                `)
                .join('');
            suggestionsDiv.style.display = 'block';
        } else {
            suggestionsDiv.style.display = 'none';
        }
    }, 150);
}

function getIconForCommand(command) {
    const iconMap = {
        '/y': 'fa-brands fa-youtube',
        '/c': 'fa-solid fa-robot',
        '/g': 'fa-brands fa-github',
        '/m': 'fa-solid fa-envelope',
        '/d': 'fa-brands fa-google-drive'
    };
    return iconMap[command] || 'fa-solid fa-bolt';
}

function handleInput(event) {
    const suggestionsDiv = document.getElementById('search-suggestions');
    const suggestions = Array.from(suggestionsDiv.querySelectorAll('.suggestion-item'));
    const searchInput = document.getElementById('search-input');
    
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            if (suggestionsDiv.style.display === 'block') {
                currentFocusIndex = (currentFocusIndex + 1) % suggestions.length;
                updateFocus(suggestions);
            }
            break;
            
        case 'ArrowUp':
            event.preventDefault();
            if (suggestionsDiv.style.display === 'block') {
                currentFocusIndex = currentFocusIndex <= 0 ? suggestions.length - 1 : currentFocusIndex - 1;
                updateFocus(suggestions);
            }
            break;
            
        case 'Enter':
            if (currentFocusIndex >= 0 && suggestions[currentFocusIndex]) {
                event.preventDefault();
                const suggestion = suggestions[currentFocusIndex].getAttribute('data-value');
                selectSuggestion(suggestion);
                handleSearch(suggestion);
            } else {
                const input = searchInput.value.trim();
                suggestionsDiv.style.display = 'none';
                handleSearch(input);
            }
            currentFocusIndex = -1;
            break;
            
        case 'Escape':
            suggestionsDiv.style.display = 'none';
            searchInput.blur();
            currentFocusIndex = -1;
            break;

        case 'Tab':
            if (suggestionsDiv.style.display === 'block') {
                event.preventDefault();
                if (event.shiftKey) {
                    currentFocusIndex = currentFocusIndex <= 0 ? suggestions.length - 1 : currentFocusIndex - 1;
                } else {
                    currentFocusIndex = (currentFocusIndex + 1) % suggestions.length;
                }
                updateFocus(suggestions);
            }
            break;
    }
}

function updateFocus(suggestions) {
    suggestions.forEach((item, index) => {
        if (index === currentFocusIndex) {
            item.classList.add('selected');
            item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            item.classList.remove('selected');
        }
    });
}

function selectSuggestion(suggestion) {
    const searchInput = document.getElementById('search-input');
    searchInput.value = suggestion;
    document.getElementById('search-suggestions').style.display = 'none';
    searchInput.focus();
}

function handleSearch(input) {
    const slashCommand = input.split(' ')[0];
    const query = input.slice(slashCommand.length + 1);

    if (input.startsWith('/') && CUSTOM_SHORTCUTS[slashCommand]) {
        const shortcut = CUSTOM_SHORTCUTS[slashCommand];
        if (query.trim()) {
            // If there's a query after the command, search on that platform
            switch(slashCommand) {
                case '/y':
                    window.location = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                    break;
                case '/g':
                    window.location = `https://github.com/search?q=${encodeURIComponent(query)}`;
                    break;
                case '/c':
                    window.location = `https://chat.openai.com/chat?q=${encodeURIComponent(query)}`;
                    break;
                case '/m':
                    window.location = `https://mail.google.com/mail/u/0/#search/${encodeURIComponent(query)}`;
                    break;
                case '/d':
                    window.location = `https://drive.google.com/drive/search?q=${encodeURIComponent(query)}`;
                    break;
            }
        } else {
            // If just the command, go to the main URL
            window.location = shortcut.url;
        }
    } else {
        if (!input.startsWith('/')) {
            addToRecentSearches(input);
        }

        if (input.match(/^https?:\/\//) || input.includes('.')) {
            window.location = input.startsWith('http') ? input : 'https://' + input;
        } else {
            window.location = `https://www.google.com/search?q=${encodeURIComponent(input)}`;
        }
    }
}

// Update click outside handler to reset focus
document.addEventListener('click', (event) => {
    const suggestionsDiv = document.getElementById('search-suggestions');
    const searchInput = document.getElementById('search-input');
    
    if (!searchInput.contains(event.target) && !suggestionsDiv.contains(event.target)) {
        suggestionsDiv.style.display = 'none';
        currentFocusIndex = -1;
    }
});

// Color picker functionality
function changeAccentColor(color, element) {
    // Update CSS custom properties
    document.documentElement.style.setProperty('--text-accent', color);
    
    // Calculate glow color with opacity
    const glowColor = color + '1a'; // 10% opacity in hex
    document.documentElement.style.setProperty('--glow-color', glowColor);
    
    // Update particle colors
    if (window.pJSDom && window.pJSDom[0]) {
        const particles = window.pJSDom[0].pJS.particles;
        particles.color.value = color;
        particles.line_linked.color = color;
        window.pJSDom[0].pJS.fn.particlesRefresh();
    }
    
    // Update clock text color
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.style.color = color;
    }
    
    // Update shortcut icons color
    const shortcutIcons = document.querySelectorAll('.shortcut-icon');
    shortcutIcons.forEach(icon => {
        icon.style.color = color;
    });
    
    // Update suggestion icons color
    const suggestionIcons = document.querySelectorAll('.suggestion-icon');
    suggestionIcons.forEach(icon => {
        icon.style.color = color;
    });
    
    // Update suggestion categories background
    const suggestionCategories = document.querySelectorAll('.suggestion-category');
    suggestionCategories.forEach(category => {
        category.style.background = color;
    });
    
    // Update active state
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    element.classList.add('active');
    
    // Save preference to localStorage
    localStorage.setItem('accentColor', color);
}

// Load saved color preference
function loadSavedColor() {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        const colorOption = document.querySelector(`[data-color="${savedColor}"]`);
        if (colorOption) {
            changeAccentColor(savedColor, colorOption);
        }
    } else {
        // Set default to orange if no saved color
        const defaultColor = '#ff6b35';
        const defaultOption = document.querySelector(`[data-color="${defaultColor}"]`);
        if (defaultOption) {
            changeAccentColor(defaultColor, defaultOption);
        }
    }
}

// Initialize color on page load
function initializeColor() {
    const savedColor = localStorage.getItem('accentColor') || '#ff6b35';
    
    // Update CSS custom properties immediately
    document.documentElement.style.setProperty('--text-accent', savedColor);
    const glowColor = savedColor + '1a';
    document.documentElement.style.setProperty('--glow-color', glowColor);
    
    // Update all elements that use the accent color
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.style.color = savedColor;
    }
    
    // Force update shortcut icons with inline styles
    const shortcutIcons = document.querySelectorAll('.shortcut-icon');
    shortcutIcons.forEach(icon => {
        icon.style.setProperty('color', savedColor, 'important');
    });
    
    // Set the active state in color picker
    const colorOption = document.querySelector(`[data-color="${savedColor}"]`);
    if (colorOption) {
        colorOption.classList.add('active');
    }
}

// Initialize color as soon as possible
initializeColor();

// Add subtle hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Load saved color preference (for particles and other elements)
    loadSavedColor();
    
    const shortcuts = document.querySelectorAll('.shortcut-item');
    shortcuts.forEach(shortcut => {
        shortcut.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        shortcut.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}); 