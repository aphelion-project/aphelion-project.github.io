// ==================== TOOL NAVIGATION ====================
const toolNavBtns = document.querySelectorAll('.tool-nav-btn');
const toolSections = document.querySelectorAll('.tool-section');

function switchTool(toolId) {
    // Remove active class from all tool sections
    toolSections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav buttons
    toolNavBtns.forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tool section
    const selectedTool = document.getElementById(`${toolId}-tool`);
    if (selectedTool) {
        selectedTool.classList.add('active');
    }

    // Update nav button state
    const selectedBtn = document.querySelector(`.tool-nav-btn[data-tool="${toolId}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }

    // Scroll to tool section smoothly
    setTimeout(() => {
        const toolNav = document.querySelector('.tool-nav');
        if (toolNav) {
            const navBottom = toolNav.getBoundingClientRect().bottom + window.scrollY;
            window.scrollTo({ top: navBottom - 100, behavior: 'smooth' });
        }
    }, 100);
}

// Tool navigation event listeners
toolNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        switchTool(btn.dataset.tool);
    });
});

// ==================== WORLD CREDITS GENERATOR ====================

// Credits data storage
let creditsData = [];
let currentFormat = 'textmeshpro';

// DOM Elements
const creditCategory = document.getElementById('credit-category');
const customCategoryGroup = document.getElementById('custom-category-group');
const customCategory = document.getElementById('custom-category');
const creditName = document.getElementById('credit-name');
const creditAuthor = document.getElementById('credit-author');
const creditLink = document.getElementById('credit-link');
const creditLicense = document.getElementById('credit-license');
const addCreditBtn = document.getElementById('add-credit-btn');
const creditsList = document.getElementById('credits-list');
const clearAllBtn = document.getElementById('clear-all-btn');
const formatBtns = document.querySelectorAll('.format-btn');
const includeLinks = document.getElementById('include-links');
const includeLicenses = document.getElementById('include-licenses');
const groupByCategory = document.getElementById('group-by-category');
const outputText = document.getElementById('output-text');
const copyOutputBtn = document.getElementById('copy-output-btn');
const downloadOutputBtn = document.getElementById('download-output-btn');

// Initialize Credits Generator
function initCreditsGenerator() {
    setupCreditsListeners();
    updateOutput();
}

// Event Listeners
function setupCreditsListeners() {
    // Show custom category input when "Custom" is selected
    creditCategory.addEventListener('change', () => {
        if (creditCategory.value === 'Custom') {
            customCategoryGroup.style.display = 'flex';
        } else {
            customCategoryGroup.style.display = 'none';
        }
    });

    // Add credit button
    addCreditBtn.addEventListener('click', addCredit);

    // Allow Enter key to add credit
    [creditName, creditAuthor, creditLink, creditLicense].forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addCredit();
            }
        });
    });

    // Clear all button
    clearAllBtn.addEventListener('click', clearAllCredits);

    // Format selection
    formatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            formatBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFormat = btn.dataset.format;
            updateOutput();
        });
    });

    // Output options
    [includeLinks, includeLicenses, groupByCategory].forEach(checkbox => {
        checkbox.addEventListener('change', updateOutput);
    });

    // Copy output
    copyOutputBtn.addEventListener('click', copyToClipboard);

    // Download output
    downloadOutputBtn.addEventListener('click', downloadOutput);
}

// Add credit to list
function addCredit() {
    const name = creditName.value.trim();
    const author = creditAuthor.value.trim();
    const link = creditLink.value.trim();
    const license = creditLicense.value.trim();
    
    let category = creditCategory.value;
    if (category === 'Custom') {
        category = customCategory.value.trim() || 'Other';
    }

    if (!name) {
        alert('Please enter an asset/creator name');
        return;
    }

    const credit = {
        id: Date.now(),
        category,
        name,
        author,
        link,
        license
    };

    creditsData.push(credit);
    renderCreditsList();
    updateOutput();
    clearForm();
}

// Render credits list
function renderCreditsList() {
    if (creditsData.length === 0) {
        creditsList.innerHTML = `
            <div class="empty-state">
                <p>NO CREDITS ADDED YET</p>
                <p class="empty-state-subtitle">Add credits using the form above</p>
            </div>
        `;
        return;
    }

    creditsList.innerHTML = creditsData.map(credit => `
        <div class="credit-item">
            <div class="credit-item-header">
                <span class="credit-category-badge">${credit.category.toUpperCase()}</span>
                <button class="credit-remove-btn" onclick="removeCredit(${credit.id})">REMOVE</button>
            </div>
            <div class="credit-item-name">${credit.name}</div>
            ${credit.author ? `<div class="credit-item-author">${credit.author}</div>` : ''}
            ${credit.link || credit.license ? `
                <div class="credit-item-meta">
                    ${credit.link ? `<div class="credit-meta-item"><span class="credit-meta-label">LINK:</span> ${credit.link}</div>` : ''}
                    ${credit.license ? `<div class="credit-meta-item"><span class="credit-meta-label">LICENSE:</span> ${credit.license}</div>` : ''}
                </div>
            ` : ''}
        </div>
    `).join('');
}

// Remove credit
function removeCredit(id) {
    creditsData = creditsData.filter(credit => credit.id !== id);
    renderCreditsList();
    updateOutput();
}

// Clear all credits
function clearAllCredits() {
    if (creditsData.length === 0) return;
    
    if (confirm('Are you sure you want to clear all credits?')) {
        creditsData = [];
        renderCreditsList();
        updateOutput();
    }
}

// Clear form
function clearForm() {
    creditName.value = '';
    creditAuthor.value = '';
    creditLink.value = '';
    creditLicense.value = '';
    creditCategory.value = 'World Creator';
    customCategory.value = '';
    customCategoryGroup.style.display = 'none';
}

// Update output
function updateOutput() {
    if (creditsData.length === 0) {
        outputText.textContent = 'Add credits to see formatted output...';
        return;
    }

    const options = {
        includeLinks: includeLinks.checked,
        includeLicenses: includeLicenses.checked,
        groupByCategory: groupByCategory.checked
    };

    let output = '';
    
    // Add header
    output += formatHeader(currentFormat);

    if (options.groupByCategory) {
        // Group by category
        const grouped = {};
        creditsData.forEach(credit => {
            if (!grouped[credit.category]) {
                grouped[credit.category] = [];
            }
            grouped[credit.category].push(credit);
        });

        Object.keys(grouped).sort().forEach(category => {
            output += formatCategoryHeader(category, currentFormat);
            grouped[category].forEach(credit => {
                output += formatCredit(credit, currentFormat, options);
            });
        });
    } else {
        // No grouping
        output += formatCategoryHeader('Credits', currentFormat);
        creditsData.forEach(credit => {
            output += formatCredit(credit, currentFormat, options);
        });
    }

    // Add footer
    output += formatFooter(currentFormat, creditsData.length);

    outputText.textContent = output.trim();
}

// Format header
function formatHeader(format) {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    switch (format) {
        case 'textmeshpro':
            return `<align="center"><size=180%><b><gradient="rainbow">WORLD CREDITS</gradient></b></size>

<color=#CCCCCC><i>Assets and creators that made this world possible</i></color>
<size=80%><color=#888888>Generated: ${date}</color></size></align>

<color=#FFFFFF>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</color>\n`;
        
        case 'markdown':
            return `# WORLD CREDITS

*Assets and creators that made this world possible*

**Generated:** ${date}

---
`;
        
        case 'bbcode':
            return `[center][size=20][b]WORLD CREDITS[/b][/size]

[i]Assets and creators that made this world possible[/i]
[size=9]Generated: ${date}[/size][/center]

[hr]
`;
        
        case 'plain':
        default:
            return `${'█'.repeat(60)}
${'█'.repeat(60)}

               WORLD CREDITS

  Assets and creators that made this world possible

  Generated: ${date}

${'█'.repeat(60)}
${'█'.repeat(60)}
`;
    }
}

// Format footer
function formatFooter(format, totalCredits) {
    switch (format) {
        case 'textmeshpro':
            return `\n<color=#FFFFFF>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</color>

<align="center"><size=90%><color=#AAAAAA>Total Credits: <b>${totalCredits}</b></color></size>

<size=110%><color=#00FF00>Thank you to all the creators</color></size></align>\n`;
        
        case 'markdown':
            return `\n---

**Total Credits:** ${totalCredits}

*Thank you to all the creators*
`;
        
        case 'bbcode':
            return `\n[hr]

[center][size=10]Total Credits: [b]${totalCredits}[/b][/size]

[size=12][color=#00FF00]Thank you to all the creators[/color][/size][/center]
`;
        
        case 'plain':
        default:
            return `\n${'═'.repeat(60)}

  Total Credits: ${totalCredits}

  Thank you to all the creators

${'═'.repeat(60)}
`;
    }
}

// Format category header
function formatCategoryHeader(category, format) {
    switch (format) {
        case 'textmeshpro':
            return `\n<color=#FFFFFF>╔═══════════════════════════════════════╗</color>\n<b><size=140%><color=#FFD700>  ${category.toUpperCase()}</color></size></b>\n<color=#FFFFFF>╚═══════════════════════════════════════╝</color>\n\n`;
        case 'markdown':
            return `\n---\n### ${category.toUpperCase()}\n`;
        case 'bbcode':
            return `\n[hr]\n[size=16][b][color=#FFD700]${category.toUpperCase()}[/color][/b][/size]\n`;
        case 'plain':
        default:
            return `\n${'═'.repeat(50)}\n  ${category.toUpperCase()}\n${'═'.repeat(50)}\n`;
    }
}

// Format individual credit
function formatCredit(credit, format, options) {
    let line = '';
    
    switch (format) {
        case 'textmeshpro':
            line = `<color=#00FFFF>▸</color> <b><size=110%>${credit.name}</size></b>`;
            if (credit.author) {
                line += `\n  <color=#AAAAAA>└─</color> <i><color=#CCCCCC>${credit.author}</color></i>`;
            }
            if (options.includeLinks && credit.link) {
                line += `\n  <color=#AAAAAA>└─</color> <link="${credit.link}"><u><color=#4A9EFF>View Resource</color></u></link>`;
            }
            if (options.includeLicenses && credit.license) {
                line += `\n  <color=#AAAAAA>└─</color> <size=90%><color=#FFD700>${credit.license}</color></size>`;
            }
            break;

        case 'markdown':
            line = `> **${credit.name}**`;
            if (credit.author) {
                line += `\n> *${credit.author}*`;
            }
            if (options.includeLinks && credit.link) {
                line += `\n> [View Resource](${credit.link})`;
            }
            if (options.includeLicenses && credit.license) {
                line += `\n> \`${credit.license}\``;
            }
            line += '\n';
            break;

        case 'bbcode':
            line = `[color=#00FFFF]►[/color] [b][size=12]${credit.name}[/size][/b]`;
            if (credit.author) {
                line += `\n   [color=#AAAAAA]└─[/color] [i]${credit.author}[/i]`;
            }
            if (options.includeLinks && credit.link) {
                line += `\n   [color=#AAAAAA]└─[/color] [url=${credit.link}][color=#4A9EFF]View Resource[/color][/url]`;
            }
            if (options.includeLicenses && credit.license) {
                line += `\n   [color=#AAAAAA]└─[/color] [size=10][color=#FFD700]${credit.license}[/color][/size]`;
            }
            break;

        case 'plain':
        default:
            line = `▸ ${credit.name}`;
            if (credit.author) {
                line += `\n  └─ ${credit.author}`;
            }
            if (options.includeLinks && credit.link) {
                line += `\n  └─ ${credit.link}`;
            }
            if (options.includeLicenses && credit.license) {
                line += `\n  └─ License: ${credit.license}`;
            }
            break;
    }

    return line + '\n';
}

// Copy to clipboard
async function copyToClipboard() {
    const text = outputText.textContent;
    
    if (text === 'Add credits to see formatted output...') {
        alert('No credits to copy!');
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        
        // Visual feedback
        const originalText = copyOutputBtn.innerHTML;
        copyOutputBtn.innerHTML = '<span class="btn-icon">✓</span> COPIED!';
        copyOutputBtn.style.backgroundColor = '#00ff00';
        copyOutputBtn.style.color = '#000000';
        
        setTimeout(() => {
            copyOutputBtn.innerHTML = originalText;
            copyOutputBtn.style.backgroundColor = '';
            copyOutputBtn.style.color = '';
        }, 2000);
    } catch (err) {
        alert('Failed to copy to clipboard. Please copy manually.');
    }
}

// Download output as .txt file
function downloadOutput() {
    const text = outputText.textContent;
    
    if (text === 'Add credits to see formatted output...') {
        alert('No credits to download!');
        return;
    }

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `world-credits-${currentFormat}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==================== WORLD IDEA GENERATOR ====================

// Idea elements data
const IDEA_DATA = {
    themes: [
        'Cyberpunk Neon', 'Cozy Cottage', 'Dark Fantasy', 'Steampunk Victorian', 
        'Vaporwave Aesthetic', 'Gothic Architecture', 'Tropical Paradise', 'Winter Wonderland',
        'Retro 80s', 'Minimalist Modern', 'Post-Apocalyptic', 'Underwater Deep Sea',
        'Space Station Sci-Fi', 'Japanese Traditional', 'Desert Oasis', 'Enchanted Forest',
        'Industrial Warehouse', 'Art Deco Luxury', 'Pixel Art Retro', 'Brutalist Concrete',
        'Fairytale Storybook', 'Noir Mystery', 'Pastel Kawaii', 'Ancient Ruins',
        'Bioluminescent Nature', 'Crystal Caves', 'Floating Islands', 'Medieval Castle'
    ],
    settings: [
        'Rooftop Lounge', 'Underground Bunker', 'Mountaintop Observatory', 'Beach Resort',
        'Space Colony', 'Abandoned Mall', 'Treehouse Village', 'Desert Marketplace',
        'Underwater Research Station', 'Sky City', 'Library Archive', 'Art Gallery',
        'Music Venue', 'Zen Garden', 'Nightclub', 'Cafe/Coffee Shop',
        'Museum', 'Train Station', 'Airport Terminal', 'Movie Theater',
        'Arcade', 'Greenhouse Botanical Garden', 'Recording Studio', 'Dance Studio',
        'Penthouse Apartment', 'Hot Springs Bath House', 'Game Room', 'Meditation Temple'
    ],
    features: [
        'Interactive Particle Systems', 'Dynamic Day/Night Cycle', 'Weather Effects',
        'Secret Hidden Areas', 'Teleportation Network', 'Mirror Rooms', 
        'Customizable Lighting', 'Udon Game Systems', 'Video Players', 'Piano/Musical Instruments',
        'Photo Spots', 'Parkour Elements', 'Water Physics', 'Destructible Objects',
        'Collectibles to Find', 'Changing Seasons', 'NPC Characters', 'Quest System',
        'Minigames', 'Portal System', 'Vehicle System', 'Pet System',
        'Avatar Scaling Zones', 'Voice Amplification Areas', 'Drawing/Writing Surfaces', 'Portals to Other Worlds'
    ],
    moods: [
        'Peaceful and Relaxing', 'Energetic and Vibrant', 'Mysterious and Eerie',
        'Warm and Inviting', 'Cold and Isolating', 'Chaotic and Busy',
        'Melancholic and Nostalgic', 'Uplifting and Inspiring', 'Dark and Moody',
        'Bright and Cheerful', 'Tense and Suspenseful', 'Dreamy and Surreal',
        'Romantic and Intimate', 'Professional and Clean', 'Playful and Fun',
        'Elegant and Sophisticated', 'Raw and Gritty', 'Whimsical and Fantastical'
    ],
    activities: [
        'Socializing and Hangout', 'Events and Performances', 'Photography',
        'Exploration and Discovery', 'Meditation and Reflection', 'Dancing',
        'Gaming and Competitions', 'Roleplay', 'Movie Watching', 'Music Listening',
        'Art Creation', 'Learning and Education', 'Exercise and Movement',
        'Storytelling', 'Treasure Hunting', 'Puzzle Solving', 'Racing',
        'Building and Creating', 'Trading and Economy', 'Meeting New People'
    ]
};

// Generated ideas storage
let generatedIdeas = [];
let ideaCounter = 0;

// DOM Elements
const includeTheme = document.getElementById('include-theme');
const includeSetting = document.getElementById('include-setting');
const includeFeature = document.getElementById('include-feature');
const includeMood = document.getElementById('include-mood');
const includeActivity = document.getElementById('include-activity');
const generateIdeaBtn = document.getElementById('generate-idea-btn');
const generateMultipleBtn = document.getElementById('generate-multiple-btn');
const ideasList = document.getElementById('ideas-list');
const clearIdeasBtn = document.getElementById('clear-ideas-btn');

// Initialize World Idea Generator
function initWorldIdeaGenerator() {
    setupIdeaGeneratorListeners();
}

// Event Listeners
function setupIdeaGeneratorListeners() {
    generateIdeaBtn.addEventListener('click', () => generateIdeas(1));
    generateMultipleBtn.addEventListener('click', () => generateIdeas(5));
    clearIdeasBtn.addEventListener('click', clearAllIdeas);
}

// Generate random element from array
function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Generate ideas
function generateIdeas(count) {
    for (let i = 0; i < count; i++) {
        const idea = {};
        
        if (includeTheme.checked) {
            idea.theme = randomElement(IDEA_DATA.themes);
        }
        if (includeSetting.checked) {
            idea.setting = randomElement(IDEA_DATA.settings);
        }
        if (includeFeature.checked) {
            idea.feature = randomElement(IDEA_DATA.features);
        }
        if (includeMood.checked) {
            idea.mood = randomElement(IDEA_DATA.moods);
        }
        if (includeActivity.checked) {
            idea.activity = randomElement(IDEA_DATA.activities);
        }
        
        // Only add if at least one element is selected
        if (Object.keys(idea).length > 0) {
            ideaCounter++;
            idea.id = ideaCounter;
            generatedIdeas.push(idea);
        }
    }
    
    renderIdeasList();
    
    // Scroll to newest idea
    setTimeout(() => {
        const lastIdea = ideasList.querySelector('.idea-card:last-child');
        if (lastIdea) {
            lastIdea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, 100);
}

// Render ideas list
function renderIdeasList() {
    if (generatedIdeas.length === 0) {
        ideasList.innerHTML = `
            <div class="empty-state">
                <p>NO IDEAS GENERATED YET</p>
                <p class="empty-state-subtitle">Click "Generate Idea" to get started</p>
            </div>
        `;
        return;
    }
    
    ideasList.innerHTML = generatedIdeas.map(idea => {
        const elements = [];
        
        if (idea.theme) {
            elements.push({ label: 'Theme', value: idea.theme });
        }
        if (idea.setting) {
            elements.push({ label: 'Setting', value: idea.setting });
        }
        if (idea.feature) {
            elements.push({ label: 'Feature', value: idea.feature });
        }
        if (idea.mood) {
            elements.push({ label: 'Mood', value: idea.mood });
        }
        if (idea.activity) {
            elements.push({ label: 'Activity', value: idea.activity });
        }
        
        return `
            <div class="idea-card" data-id="${idea.id}">
                <div class="idea-card-header">
                    <span class="idea-number">IDEA #${idea.id}</span>
                    <div class="idea-actions">
                        <button class="idea-copy-btn" onclick="copyIdea(${idea.id})">COPY</button>
                        <button class="idea-remove-btn" onclick="removeIdea(${idea.id})">REMOVE</button>
                    </div>
                </div>
                <div class="idea-content">
                    ${elements.map(el => `
                        <div class="idea-element">
                            <span class="idea-element-label">${el.label}:</span>
                            <span class="idea-element-value">${el.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

// Copy idea to clipboard
function copyIdea(id) {
    const idea = generatedIdeas.find(i => i.id === id);
    if (!idea) return;
    
    let text = `WORLD IDEA #${id}\n\n`;
    
    if (idea.theme) text += `Theme: ${idea.theme}\n`;
    if (idea.setting) text += `Setting: ${idea.setting}\n`;
    if (idea.feature) text += `Feature: ${idea.feature}\n`;
    if (idea.mood) text += `Mood: ${idea.mood}\n`;
    if (idea.activity) text += `Activity: ${idea.activity}\n`;
    
    navigator.clipboard.writeText(text).then(() => {
        // Visual feedback
        const btn = document.querySelector(`.idea-card[data-id="${id}"] .idea-copy-btn`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'COPIED!';
            btn.style.backgroundColor = '#00ff00';
            btn.style.color = '#000000';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
            }, 2000);
        }
    }).catch(err => {
        alert('Failed to copy to clipboard');
    });
}

// Remove idea
function removeIdea(id) {
    generatedIdeas = generatedIdeas.filter(idea => idea.id !== id);
    renderIdeasList();
}

// Clear all ideas
function clearAllIdeas() {
    if (generatedIdeas.length === 0) return;
    
    if (confirm('Are you sure you want to clear all generated ideas?')) {
        generatedIdeas = [];
        ideaCounter = 0;
        renderIdeasList();
    }
}

// ==================== NEVER HAVE I EVER BINGO ====================

// VRChat "Never Have I Ever" bingo squares - categorized
const BINGO_SQUARES = {
    wholesome: [
        'Made a genuine friend',
        'Attended a VRChat wedding',
        'Helped a new player',
        'Been to a movie night',
        'Joined a group photo',
        'Danced in a club world',
        'Sung karaoke',
        'Had a 4 AM conversation',
        'Met IRL friends in VR',
        'Celebrated a holiday',
        'Explored alone peacefully',
        'Attended a DJ set',
        'Been to karaoke night',
        'Watched virtual concert',
    ],
    
    technical: [
        'Crashed someone with an avatar',
        'Switched to Red just to ERP',
        'Bought a new PC just for VRChat',
        'Bought full-body trackers',
        'Ripped an avatar',
        'Ripped a world',
        'Stopped caring about Quest compatability',
        'Reinstalled VRChat hoping it would help',
        'Avatar crashed you',
        'Had tracking completely break',
        'Own more than 1 headset',
        'Own more than 3 trackers',
        'Created your own avatar',
        'Created your own world',
    ],
    
    embarrassing: [
        'Forgot to mute and said something you shouldn\'t have',
        'Walked in on ERP',
        'Fallen asleep in VR',
        'Fallen asleep in public instance',
        'Been blackout drunk in VR',
        'Thrown up in VR',
        'Cried in VR',
        'Cried in a public instance',
        'Mirror dwelled 1+ hours',
        'Mirror dwelled for 3+ hours',
        'Mirror dwelled for 5+ hours',
        'Been caught staring',
    ],
    
    lies: [
        'Lied about your age',
        'Lied about your gender',
        'Used a voice changer',
        'Pretended to be mute',
        'Pretended to be deaf',
        'Ghosted someone',
        'Been ghosted',
        'Blocked someone you were once friends with',
        'Been blocked',
        'Left without saying bye',
        'Lied about accepting a friend request, then didn\'t',
    ],
    
    relationships: [
        'Had/have a VRChat crush',
        'Confessed feelings',
        'Previously in VRC relationship',
        'Currently in a VRC relationship',
        'Had a VRChat breakup',
        'Been involved in drama',
        'Witnessed a public argument',
        'Was a part of a public argument',
        'Been kicked from an instance',
        'Kicked someone from an instance',
        'Removed someone from friends list',
        'Been the third wheel',
        'Met VRC partner IRL',
    ],
    
    spicy: [
        'Been to an ERP world',
        'Witnessed ERPing in public',
        'Been asked for ERP',
        'Accepted ERP',
        'Went to go "hangout" with a friend, but it was really ERP',
        'Used NSFW avatars',
        'Deliberately added SPS/DPS to avatar',
        'Been hit on',
        'Hit on someone',
        'Had someone get too touchy',
    ],
    
    avatars: [
        'Unironically used Ugandan Knuckles',
        'Bought an outfit only to be disappointed in the actual product',
        'Booth enjoyer',
        'Gumroad/Jinxxy enjoyer',
        'Spent real money on commissioning an avatar',
        'Been furry avatar',
        'Used meme avatar',
        'Wore NSFW avatar in public',
    ],
    
    behavior: [
        'Head patted someone',
        'Sat on someone\'s lap',
        'Aggressively flirted',
        'Roleplayed',
        'Used pickup lines',
        'Started drama',
        'Overshared personal info',
    ],
    
    addiction: [
        'Spent more time in VRC than sleeping',
        'Chosen VRC over real plans',
        'Hidden VRC from family',
        'Lied about VRC time',
        'All-nighter in VRC',
        'VRC was main social life',
        'Skipped work/school for VRC',
        'Been in VRC 8+ hours straight',
        'Been in VRC 12+ hours straight',
        'Been in VRC 16+ hours straight',
        'Been in VRC 24+ hours straight',
        'Forgot to eat because VRC',
        '100+ hours',
        '500+ hours',
        '1,000+ hours',
        '2,500+ hours',
        '5,000+ hours',
        '10,000+ hours',
    ],
    
    worlds: [
        'Visited The Great Pug',
        'World hopped for 2+ hours',
        'Got lost in big world',
    ],
    
    content: [
        'Currently a DJ',
        'Been in a TikTok',
        'Been on a YouTube video',
        'Streamed VRChat',
        'Asked to be in content',
        'Made VRChat content',
        'Met a VRC celebrity',
    ],
    
    misc: [
        'Seen bot accounts',
        'Been scammed/asked for money',
    ],
    
    deep: [
        'Discovered own sexuality',
        'Discovered you\'re trans because of VRC',
        'Had panic attack in VR',
        'Used VRC to escape reality',
        'Done drugs while in VR',
        'Confided deep secrets',
        'Questioned reality in VR',
        'Felt more yourself in VR',
        'Preferred VR self to real self',
    ]
};

// Flatten all categories into single array for selection
function getAllSquares() {
    const allSquares = [];
    Object.values(BINGO_SQUARES).forEach(category => {
        allSquares.push(...category);
    });
    return allSquares;
}

// Bingo state
let currentBingoCard = [];
let markedSquares = new Set();

// DOM Elements
const includeFreeSpace = document.getElementById('include-free-space');
const generateBingoBtn = document.getElementById('generate-bingo-btn');
const resetBingoBtn = document.getElementById('reset-bingo-btn');
const downloadBingoBtn = document.getElementById('download-bingo-btn');
const bingoGrid = document.getElementById('bingo-grid');
const bingoCard = document.getElementById('bingo-card');

// Initialize Bingo Generator
function initBingoGenerator() {
    setupBingoListeners();
    renderEmptyBingo();
    loadHtml2Canvas();
}

// Load html2canvas library dynamically
function loadHtml2Canvas() {
    if (window.html2canvas) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    document.head.appendChild(script);
}

// Event Listeners
function setupBingoListeners() {
    generateBingoBtn.addEventListener('click', generateBingoCard);
    resetBingoBtn.addEventListener('click', resetBingoCard);
    downloadBingoBtn.addEventListener('click', downloadBingoCard);
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Generate bingo card
function generateBingoCard() {
    markedSquares.clear();
    
    // Get all squares and shuffle
    const allSquares = getAllSquares();
    const shuffled = shuffleArray(allSquares);
    const squareCount = includeFreeSpace.checked ? 24 : 25;
    currentBingoCard = shuffled.slice(0, squareCount);
    
    renderBingoCard();
}

// Render empty bingo state
function renderEmptyBingo() {
    bingoGrid.innerHTML = `
        <div class="bingo-empty" style="grid-column: 1 / -1;">
            <p>NO CARD GENERATED YET</p>
            <p class="bingo-empty-subtitle">Click "Generate Card" to create your bingo card</p>
        </div>
    `;
}

// Render bingo card
function renderBingoCard() {
    bingoGrid.innerHTML = '';
    
    let cardIndex = 0;
    for (let i = 0; i < 25; i++) {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        
        // Center square (index 12) is free space if enabled
        if (i === 12 && includeFreeSpace.checked) {
            cell.classList.add('free-space', 'marked');
            cell.innerHTML = '<span class="bingo-cell-text">FREE SPACE</span>';
            markedSquares.add(i);
        } else {
            const text = currentBingoCard[cardIndex];
            cell.innerHTML = `<span class="bingo-cell-text">${text}</span>`;
            cell.dataset.index = i;
            cell.addEventListener('click', () => toggleSquare(i));
            cardIndex++;
        }
        
        bingoGrid.appendChild(cell);
    }
}

// Toggle square marked state
function toggleSquare(index) {
    const cell = bingoGrid.querySelector(`[data-index="${index}"]`);
    if (!cell) return;
    
    if (markedSquares.has(index)) {
        markedSquares.delete(index);
        cell.classList.remove('marked');
    } else {
        markedSquares.add(index);
        cell.classList.add('marked');
    }
}

// Reset bingo card
function resetBingoCard() {
    if (currentBingoCard.length === 0) return;
    
    markedSquares.clear();
    
    // Re-render current card without marks (except free space)
    const cells = bingoGrid.querySelectorAll('.bingo-cell:not(.free-space)');
    cells.forEach(cell => {
        cell.classList.remove('marked');
    });
    
    // Keep free space marked if it exists
    if (includeFreeSpace.checked) {
        markedSquares.add(12);
    }
}

// Download bingo card as image
async function downloadBingoCard() {
    if (currentBingoCard.length === 0) {
        alert('Generate a bingo card first!');
        return;
    }
    
    if (!window.html2canvas) {
        alert('Loading download functionality... Please try again in a moment.');
        return;
    }
    
    try {
        // Capture the bingo card as canvas
        const canvas = await html2canvas(bingoCard, {
            backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
            scale: 2, // Higher quality
            logging: false
        });
        
        // Convert to blob and download
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'vrchat-bingo.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    } catch (error) {
        console.error('Download error:', error);
        alert('Failed to download image. Please try taking a screenshot instead.');
    }
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initCreditsGenerator();
    initWorldIdeaGenerator();
    initBingoGenerator();
});