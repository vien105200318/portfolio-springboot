/**
 * 🎮 CHARACTER EXPLORATION PORTFOLIO GAME
 * 
 * Workflow:
 * 1. Load projects from API
 * 2. Initialize character & game systems
 * 3. Game loop: movement → camera → trail → collision
 * 4. User controls character with keyboard
 */

// === Global State ===
let projectsData = [];
let canvas, navLinks, character, characterBody;
let interactionPrompt, nearbyProjectName;
let projectModal, modalClose, modalBody;
let trailCanvas, trailCtx;

// === Character State ===
const player = {
    x: 2500,  // World position (center of canvas)
    y: 2500,
    speed: 4,
    facing: 'right'  // left or right
};

// === Keyboard State ===
const keys = {};

// === Trail System ===
const trail = [];
const MAX_TRAIL_LENGTH = 200;

// === Camera State ===
let cameraX = 0;
let cameraY = 0;

// === Nearby Project ===
let nearbyProject = null;

/**
 * 📚 JAVASCRIPT: Initialize DOM Elements
 */
function initDOMElements() {
    canvas = document.getElementById('canvas');
    navLinks = document.getElementById('navLinks');
    character = document.getElementById('character');
    interactionPrompt = document.getElementById('interactionPrompt');
    nearbyProjectName = document.getElementById('nearbyProjectName');
    projectModal = document.getElementById('projectModal');
    modalClose = document.getElementById('modalClose');
    modalBody = document.getElementById('modalBody');
    trailCanvas = document.getElementById('trailCanvas');

    // Null checks
    if (!canvas) console.error('❌ Canvas element not found!');
    if (!character) console.error('❌ Character element not found!');
    if (!trailCanvas) console.error('❌ Trail canvas element not found!');
    if (!interactionPrompt) console.error('❌ Interaction prompt element not found!');
    if (!projectModal) console.error('❌ Project modal element not found!');

    // Get character body
    if (character) {
        characterBody = character.querySelector('.character-body');
        if (!characterBody) console.error('❌ Character body element not found!');
    }

    // Get trail context
    if (trailCanvas) {
        trailCtx = trailCanvas.getContext('2d');
        if (!trailCtx) console.error('❌ Could not get 2D context for trail canvas!');
    }

    console.log('✅ DOM elements initialized');
}

/**
 * 📚 JAVASCRIPT: Initialize Game
 */
async function initGame() {
    console.log('🎮 Initializing Character Exploration Game...');

    // Initialize DOM elements first
    initDOMElements();

    // Check if critical elements exist
    if (!canvas || !character || !trailCanvas) {
        console.error('❌ Critical elements missing! Cannot start game.');
        return;
    }

    // Setup canvas size
    resizeTrailCanvas();
    window.addEventListener('resize', resizeTrailCanvas);

    // Load projects
    await loadProjects();

    // Setup controls
    setupKeyboardControls(); // Use keys to move 🚗

    // Setup navigation
    setupNavigation();

    // Setup modal
    setupModal();

    // Start game loop
    gameLoop();

    console.log('✅ Game initialized!');
}

/**
 * 📚 JAVASCRIPT: Resize Trail Canvas
 */
function resizeTrailCanvas() {
    if (!trailCanvas) return;
    trailCanvas.width = 5000;  // Match canvas size
    trailCanvas.height = 5000;
}

/**
 * 📚 JAVASCRIPT: Load Projects from API
 */
async function loadProjects() {
    try {
        console.log('📡 Fetching projects from API...');
        const response = await fetch('/api/projects');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        projectsData = await response.json();
        console.log('✅ Projects loaded:', projectsData);

        renderProjects();
        renderRoads(); // Draw roads to houses
        renderDecorations(); // Add world decorations

    } catch (error) {
        console.error('❌ Error loading projects:', error);
        navLinks.innerHTML = '<p style="color: #ff6b6b;">Failed to load projects</p>';
    }
}

/**
 * 📚 JAVASCRIPT: Render Projects as Houses
 */
function renderProjects() {
    // House icons for different project types
    const houseIcons = ['🏠', '🏡', '🏘️', '🏚️', '🏗️'];

    projectsData.forEach((project, index) => {
        // Create house container
        const house = document.createElement('div');
        house.className = 'project-house';
        house.id = `project-${project.id}`;
        house.dataset.projectId = project.id;

        // Position - center the house
        const centerX = 2500 + project.x;
        const centerY = 2500 + project.y;

        house.style.left = `${centerX}px`;
        house.style.top = `${centerY}px`;

        // House icon
        const houseIcon = houseIcons[index % houseIcons.length];

        house.innerHTML = `
            <div class="house-icon">${houseIcon}</div>
            <div class="house-label">${project.title}</div>
        `;

        canvas.appendChild(house);
    });

    console.log(`✅ Rendered ${projectsData.length} project houses`);
}

/**
 * 🛣️ ROADS: Draw city street grid (Highway Style)
 */
function renderRoads() {
    if (!trailCtx) return;

    const centerX = 2500;
    const centerY = 2500;
    const roadWidth = 80;

    // Road segments definitions
    const streets = [
        { x1: centerX, y1: centerY - 800, x2: centerX, y2: centerY + 800 }, // Vertical
        { x1: centerX - 800, y1: centerY - 300, x2: centerX + 800, y2: centerY - 300 }, // Top Horizontal
        { x1: centerX - 800, y1: centerY + 300, x2: centerX + 800, y2: centerY + 300 }  // Bottom Horizontal
    ];

    // --- PHASE 1: ASPHALT BASE (Merge all asphalts into one flat surface) ---
    trailCtx.strokeStyle = '#222';
    trailCtx.lineWidth = roadWidth;
    trailCtx.lineCap = 'round';
    trailCtx.setLineDash([]);
    trailCtx.shadowBlur = 15;
    trailCtx.shadowColor = 'rgba(0, 0, 0, 0.5)';

    streets.forEach(s => {
        trailCtx.beginPath();
        trailCtx.moveTo(s.x1, s.y1);
        trailCtx.lineTo(s.x2, s.y2);
        trailCtx.stroke();
    });

    // --- PHASE 2: SHOULDERS (Faint borders) ---
    trailCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    trailCtx.lineWidth = roadWidth + 4;
    trailCtx.shadowBlur = 0;

    streets.forEach(s => {
        trailCtx.beginPath();
        trailCtx.moveTo(s.x1, s.y1);
        trailCtx.lineTo(s.x2, s.y2);
        trailCtx.stroke();
    });

    // --- PHASE 3: LANE MARKINGS (Yellow Dashes, but clean at junctions) ---
    trailCtx.strokeStyle = '#f1c40f';
    trailCtx.lineWidth = 3;
    trailCtx.setLineDash([40, 25]);

    // Draw horizontal lines but break around vertical center for clean junction
    const hStreets = [centerY - 300, centerY + 300];
    hStreets.forEach(y => {
        // Left part
        trailCtx.beginPath();
        trailCtx.moveTo(centerX - 800, y);
        trailCtx.lineTo(centerX - 50, y);
        trailCtx.stroke();
        // Right part
        trailCtx.beginPath();
        trailCtx.moveTo(centerX + 50, y);
        trailCtx.lineTo(centerX + 800, y);
        trailCtx.stroke();
    });

    // Draw vertical lines but break around horizontal streets for clean junction
    // Vertical Part 1 (Top)
    trailCtx.beginPath();
    trailCtx.moveTo(centerX, centerY - 800);
    trailCtx.lineTo(centerX, centerY - 350);
    trailCtx.stroke();
    // Vertical Part 2 (Middle)
    trailCtx.beginPath();
    trailCtx.moveTo(centerX, centerY - 250);
    trailCtx.lineTo(centerX, centerY + 250);
    trailCtx.stroke();
    // Vertical Part 3 (Bottom)
    trailCtx.beginPath();
    trailCtx.moveTo(centerX, centerY + 350);
    trailCtx.lineTo(centerX, centerY + 800);
    trailCtx.stroke();

    // Reset
    trailCtx.setLineDash([]);
    trailCtx.shadowBlur = 0;

    console.log('🛣️ Clean seamless intersections rendered');
}

/**
 * 🌳 DECORATIONS: Add trees, houses, and ambient elements
 */
function renderDecorations() {
    if (!canvas) return;

    // Decorative positions following a city grid logic
    const decorations = [
        // Street Trees - Vertical (Main St) - Moved further out
        { emoji: '🌲', x: -120, y: -700, size: 6 },
        { emoji: '🌲', x: 120, y: -600, size: 6 },
        { emoji: '🌲', x: -120, y: -500, size: 6 },
        { emoji: '🌲', x: 120, y: -400, size: 6 },
        { emoji: '🌲', x: -120, y: -200, size: 6 },
        { emoji: '🌲', x: 120, y: -100, size: 6 },
        { emoji: '🌲', x: -120, y: 100, size: 6 },
        { emoji: '🌲', x: 120, y: 200, size: 6 },
        { emoji: '🌲', x: -120, y: 400, size: 6 },
        { emoji: '🌲', x: 120, y: 500, size: 6 },
        { emoji: '🌲', x: -50, y: 600, size: 4 },
        { emoji: '🌲', x: 50, y: 700, size: 4 },

        // Street Trees - Horizontal Top St - Moved further out
        { emoji: '🌳', x: -600, y: -400, size: 4.5 },
        { emoji: '🌳', x: -200, y: -400, size: 4.5 },
        { emoji: '🌳', x: 200, y: -400, size: 4.5 },
        { emoji: '🌳', x: 600, y: -400, size: 4.5 },

        // Street Trees - Horizontal Bottom St - Moved further out
        { emoji: '🌳', x: -600, y: 400, size: 4.5 },
        { emoji: '🌳', x: -200, y: 400, size: 4.5 },
        { emoji: '🌳', x: 200, y: 400, size: 4.5 },
        { emoji: '🌳', x: 600, y: 400, size: 4.5 },

        // Central Park Area (Garden)
        { emoji: '🌻', x: -200, y: -100, size: 3 },
        { emoji: '🌸', x: -150, y: -150, size: 3 },
        { emoji: '🌺', x: -100, y: -100, size: 3 },
        { emoji: '🌻', x: 200, y: 100, size: 3 },
        { emoji: '🌸', x: 150, y: 150, size: 3 },
        { emoji: '🌺', x: 100, y: 100, size: 3 },

        // Random wild elements at outskirts
        { emoji: '🌲', x: -800, y: -800, size: 5 },
        { emoji: '🌲', x: 800, y: 800, size: 5 },
        { emoji: '🍄', x: -700, y: 400, size: 2.5 },
        { emoji: '🍄', x: 700, y: -400, size: 2.5 },
    ];

    decorations.forEach(deco => {
        const element = document.createElement('div');
        element.className = 'decoration';
        element.style.left = `${2500 + deco.x}px`;
        element.style.top = `${2500 + deco.y}px`;
        element.style.fontSize = `${deco.size}rem`;
        element.textContent = deco.emoji;
        element.style.position = 'absolute';
        element.style.transform = 'translate(-50%, -50%)';
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
        element.style.zIndex = '5';
        element.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';

        canvas.appendChild(element);
    });

    console.log('🌳 Decorations rendered');
}

/**
 * 📚 GAME DEV: Keyboard Controls Setup
 */
function setupKeyboardControls() {
    // Key down - mark key as pressed
    document.addEventListener('keydown', (e) => {
        keys[e.key.toLowerCase()] = true;

        // Handle interaction (Space key)
        if ((e.key === ' ' || e.code === 'Space') && nearbyProject) {
            e.preventDefault();
            console.log('⌨️ SPACE pressed near:', nearbyProject.title);
            openProjectModal(nearbyProject);
        }

        // Prevent arrow key scrolling
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });

    // Key up - mark key as released
    document.addEventListener('keyup', (e) => {
        keys[e.key.toLowerCase()] = false;
    });

    console.log('⌨️ Keyboard controls ready');
}

/**
 * 🖱️ MOUSE CONTROLS: Click to move character
 */
let targetPosition = null;
let isMovingToTarget = false;

function setupMouseControls() {
    canvas.addEventListener('click', (e) => {
        // Get screen click position
        const clickScreenX = e.clientX;
        const clickScreenY = e.clientY;

        // Convert to world coordinates (Accounting for 1.5x scale)
        // Offset from screen center / scale + world player position
        const worldX = (clickScreenX - window.innerWidth / 2) / 1.5 + player.x;
        const worldY = (clickScreenY - window.innerHeight / 2) / 1.5 + player.y;

        targetPosition = { x: worldX, y: worldY };
        isMovingToTarget = true;

        console.log(`🖱️ Click @ 1.5x scale: Screen (${clickScreenX}, ${clickScreenY}) → World (${worldX.toFixed(0)}, ${worldY.toFixed(0)})`);
    });
}

/**
 * 📚 GAME DEV: Main Game Loop
 * 
 * Runs 60 times per second (60 FPS)
 * Updates game state and renders
 */
function gameLoop() {
    updatePlayerPosition();
    updateCamera();
    updateTrail();
    checkProjectCollisions();
    updateBackgroundParticles();
    drawMiniMap();

    // Continue loop
    requestAnimationFrame(gameLoop);
}

/**
 * 📚 GAME DEV: Check if position is on any road
 */
function isPositionOnRoad(x, y) {
    const W = 80; // Road width
    const margin = W / 2 + 15; // Leeway

    // Vertical Main Street (X=2500, Y from 1700 to 3300)
    if (Math.abs(x - 2500) < margin && y >= 1700 && y <= 3300) return true;

    // Horizontal Top Street (Y=2200, X from 1700 to 3300)
    if (Math.abs(y - 2200) < margin && x >= 1700 && x <= 3300) return true;

    // Horizontal Bottom Street (Y=2800, X from 1700 to 3300)
    if (Math.abs(y - 2800) < margin && x >= 1700 && x <= 3300) return true;

    return false;
}

let isAutoDriving = false;

/**
 * 📚 GAME DEV: Update Player Position with Keyboard (Driving 🚗)
 */
function updatePlayerPosition() {
    if (!character || !characterBody || isAutoDriving) return;

    let dx = 0, dy = 0;
    let isMoving = false;

    // Keyboard movement
    if (keys['a'] || keys['arrowleft']) {
        dx -= player.speed;
        player.facing = 'left';
        isMoving = true;
    }
    if (keys['d'] || keys['arrowright']) {
        dx += player.speed;
        player.facing = 'right';
        isMoving = true;
    }
    if (keys['w'] || keys['arrowup']) {
        dy -= player.speed;
        isMoving = true;
    }
    if (keys['s'] || keys['arrowdown']) {
        dy += player.speed;
        isMoving = true;
    }

    // Diagonal normalization
    if (dx !== 0 && dy !== 0) {
        const mag = Math.sqrt(dx * dx + dy * dy);
        dx = (dx / mag) * player.speed;
        dy = (dy / mag) * player.speed;
    }

    // CONSTRAIN TO ROAD
    if (isMoving) {
        let finalDx = 0;
        let finalDy = 0;

        // Check combined movement
        if (isPositionOnRoad(player.x + dx, player.y + dy)) {
            finalDx = dx;
            finalDy = dy;
        } else {
            // Try individual axes for sliding
            if (isPositionOnRoad(player.x + dx, player.y)) {
                finalDx = dx;
            } else if (isPositionOnRoad(player.x, player.y + dy)) {
                finalDy = dy;
            }
        }

        player.x += finalDx;
        player.y += finalDy;

        // If movement was blocked on both axes, it's not actually moving
        if (finalDx === 0 && finalDy === 0) isMoving = false;
    }

    // Update character DOM element
    character.style.left = player.x + 'px';
    character.style.top = player.y + 'px';

    // 🚗 Direction persistence: Always apply transform based on facing direction
    // Car emoji (🚗) faces LEFT by default. 
    // Move LEFT -> scaleX(1), move RIGHT -> scaleX(-1)
    if (player.facing === 'left') {
        characterBody.style.transform = 'scaleX(1)';
    } else {
        characterBody.style.transform = 'scaleX(-1)';
    }

    // Update animations/classes
    if (isMoving) {
        character.classList.add('moving');
    } else {
        character.classList.remove('moving');
    }
}

/**
 * 📚 GAME DEV: Camera Follow with Lerp
 * 
 * Lerp = Linear Interpolation (smooth transition)
 * Formula: current + (target - current) * factor
 */
function updateCamera() {
    if (!canvas || !trailCanvas) return;

    // Target position (keep character centered)
    const targetX = window.innerWidth / 2 - player.x;
    const targetY = window.innerHeight / 2 - player.y;

    // Smooth interpolation (0.1 = 10% per frame)
    cameraX += (targetX - cameraX) * 0.1;
    cameraY += (targetY - cameraY) * 0.1;

    // Apply transform to canvas
    canvas.style.transform = `translate(${cameraX}px, ${cameraY}px)`;

    // Also move trail canvas
    trailCanvas.style.transform = `translate(${cameraX}px, ${cameraY}px)`;
}

/**
 * 📚 GAME DEV: Trail System with Canvas API
 */
function updateTrail() {
    // Add current position to trail
    if (keys['w'] || keys['s'] || keys['a'] || keys['d'] ||
        keys['arrowup'] || keys['arrowdown'] || keys['arrowleft'] || keys['arrowright']) {

        trail.push({
            x: player.x,
            y: player.y,
            alpha: 1.0
        });

        // Limit trail length
        if (trail.length > MAX_TRAIL_LENGTH) {
            trail.shift();
        }
    }

    // Fade trail points
    trail.forEach(point => {
        point.alpha -= 0.008;  // Fade speed
    });

    // Remove fully faded points
    for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].alpha <= 0) {
            trail.splice(i, 1);
        }
    }

    // Draw trail
    drawTrail();
}

/**
 * 📚 HTML5 CANVAS: Draw Trail with Gradient & Glow
 */
function drawTrail() {
    if (!trailCtx) return;

    // Clear canvas
    trailCtx.clearRect(0, 0, 5000, 5000);

    // Redraw static roads first (so trail is on top)
    renderRoads();

    if (trail.length < 2) return;

    // Draw trail as connected lines with gradient
    for (let i = 0; i < trail.length - 1; i++) {
        const point = trail[i];
        const nextPoint = trail[i + 1];
        const alpha = point.alpha;

        // Create gradient from purple to cyan
        const gradient = trailCtx.createLinearGradient(
            point.x, point.y,
            nextPoint.x, nextPoint.y
        );
        gradient.addColorStop(0, `rgba(102, 126, 234, ${alpha * 0.8})`);
        gradient.addColorStop(0.5, `rgba(0, 212, 255, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(255, 0, 255, ${alpha * 0.4})`);

        trailCtx.strokeStyle = gradient;
        trailCtx.lineWidth = 6 * alpha;
        trailCtx.lineCap = 'round';
        trailCtx.shadowBlur = 15;
        trailCtx.shadowColor = `rgba(0, 212, 255, ${alpha})`;

        // Draw line
        trailCtx.beginPath();
        trailCtx.moveTo(point.x, point.y);
        trailCtx.lineTo(nextPoint.x, nextPoint.y);
        trailCtx.stroke();
    }
}

/**
 * 📚 GAME DEV: Collision Detection
 * 
 * Calculate distance between character and each project
 * If distance < threshold, show interaction prompt
 */
function checkProjectCollisions() {
    let closestProject = null;
    let closestDistance = Infinity;

    // Character center position
    const charX = player.x + 35; // centered
    const charY = player.y + 35;

    projectsData.forEach(project => {
        // --- INTERACTION POINT ON THE ROAD ---
        // We want the interaction to happen when the car is ON THE ROAD segment near the house.
        let interactX = 2500 + project.x;
        let interactY = 2500 + project.y;

        // Adjust interaction point to be on the road center
        if (project.id === 'p1' || project.id === 'p2') {
            interactY = 2200; // Top horizontal road center
        } else if (project.id === 'p3' || project.id === 'p4') {
            interactY = 2800; // Bottom horizontal road center
        } else if (project.id === 'p5') {
            interactX = 2500; // Vertical road center
        }

        const dx = charX - interactX;
        const dy = charY - interactY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Check if within interaction range (on road)
        if (distance < 80 && distance < closestDistance) {
            closestDistance = distance;
            closestProject = project;
        }
    });

    // Update nearby project
    if (closestProject) {
        if (nearbyProject !== closestProject) {
            nearbyProject = closestProject;
            showInteractionPrompt(closestProject);
        }
    } else {
        if (nearbyProject !== null) {
            hideInteractionPrompt();
            nearbyProject = null;
        }
    }
}

/**
 * Show Interaction Prompt
 */
function showInteractionPrompt(project) {
    nearbyProjectName.textContent = project.title;
    interactionPrompt.classList.add('show');
}

/**
 * Hide Interaction Prompt
 */
function hideInteractionPrompt() {
    interactionPrompt.classList.remove('show');
}

/**
 * 📚 JAVASCRIPT: Open Project Modal
 */
function openProjectModal(project) {
    modalBody.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}" 
             style="width: 100%; border-radius: 12px; margin-bottom: 1rem;">
        <h2>${project.title}</h2>
        <p style="font-size: 1.1rem; margin: 1rem 0;">${project.description}</p>
        <a href="${project.linkUrl}" target="_blank" class="project-link">
            View on GitHub →
        </a>
    `;

    projectModal.classList.add('show');
    console.log('📖 Opened project:', project.title);
}

/**
 * Close Modal
 */
function closeModal() {
    projectModal.classList.remove('show');
}

/**
 * Setup Modal Events
 */
function setupModal() {
    modalClose.addEventListener('click', closeModal);

    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            closeModal();
        }
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeModal();
        }
    });
}

/**
 * 📚 JAVASCRIPT: Setup Navigation (Fast Travel)
 */
function setupNavigation() {
    navLinks.innerHTML = '';

    projectsData.forEach(project => {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.textContent = project.title;

        // Fast travel on click
        btn.addEventListener('click', () => {
            fastTravelTo(project);
        });

        navLinks.appendChild(btn);
    });
}

/**
 * 📚 GSAP: Fast Travel Animation (Auto-Drive 🚗)
 * 
 * Instead of teleporting, the car will follow the road grid.
 */
function fastTravelTo(project) {
    // --- DETERMINE ROAD-BASED DESTINATION ---
    let finalTargetX = 2500 + project.x;
    let finalTargetY = 2500 + project.y;

    // Adjust to stay on road center for parking
    if (project.id === 'p1' || project.id === 'p2') {
        finalTargetY = 2200; // Park on Top Horizontal Road
    } else if (project.id === 'p3' || project.id === 'p4') {
        finalTargetY = 2800; // Park on Bottom Horizontal Road
    } else if (project.id === 'p5') {
        finalTargetX = 2500; // Park on Vertical Road
    }

    console.log(`✈️ Auto-driving to Road Spot for: ${project.title}`);

    const tl = gsap.timeline({
        onStart: () => {
            isAutoDriving = true;
        },
        onUpdate: () => {
            character.style.left = player.x + 'px';
            character.style.top = player.y + 'px';
        },
        onComplete: () => {
            isAutoDriving = false;
            console.log(`✅ Arrived at Road Spot for: ${project.title}`);
        }
    });

    // --- STEP 1: Get to the Main Vertical Road (X=2500) ---
    if (Math.abs(player.x - 2500) > 5) {
        tl.to(player, {
            duration: 0.8,
            x: 2500,
            ease: "power1.inOut",
            onStart: () => {
                player.facing = (2500 > player.x) ? 'right' : 'left';
                updateCarDirection();
            }
        });
    }

    // --- STEP 2: Move along Vertical Road to the correct Latitude/Y ---
    let targetLatY = finalTargetY;

    if (Math.abs(player.y - targetLatY) > 5) {
        tl.to(player, {
            duration: 1.2,
            y: targetLatY,
            ease: "power2.inOut"
        });
    }

    // --- STEP 3: Move along Horizontal Road to Project X (If applicable) ---
    if (Math.abs(player.x - finalTargetX) > 5) {
        tl.to(player, {
            duration: 1.0,
            x: finalTargetX,
            ease: "power1.inOut",
            onStart: () => {
                player.facing = (finalTargetX > player.x) ? 'right' : 'left';
                updateCarDirection();
            }
        });
    }
}

/**
 * 🚗 UI Helper: Update car rotation/flipping
 */
function updateCarDirection() {
    if (!characterBody) return;
    if (player.facing === 'left') {
        characterBody.style.transform = 'scaleX(1)';
    } else {
        characterBody.style.transform = 'scaleX(-1)';
    }
}

/**
 * 🌟 PARTICLES: Background Particle System
 */
const bgParticles = [];
const bgParticlesCanvas = document.getElementById('bgParticles');
const bgParticlesCtx = bgParticlesCanvas ? bgParticlesCanvas.getContext('2d') : null;

function initBackgroundParticles() {
    if (!bgParticlesCanvas || !bgParticlesCtx) return;

    bgParticlesCanvas.width = window.innerWidth;
    bgParticlesCanvas.height = window.innerHeight;

    // Create 100 ambient particles
    for (let i = 0; i < 100; i++) {
        bgParticles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radius: Math.random() * 2 + 1,
            alpha: Math.random() * 0.5 + 0.3
        });
    }
}

function updateBackgroundParticles() {
    if (!bgParticlesCtx) return;

    bgParticlesCtx.clearRect(0, 0, bgParticlesCanvas.width, bgParticlesCanvas.height);

    bgParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = bgParticlesCanvas.width;
        if (p.x > bgParticlesCanvas.width) p.x = 0;
        if (p.y < 0) p.y = bgParticlesCanvas.height;
        if (p.y > bgParticlesCanvas.height) p.y = 0;

        // Draw particle
        bgParticlesCtx.fillStyle = `rgba(102, 126, 234, ${p.alpha})`;
        bgParticlesCtx.beginPath();
        bgParticlesCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        bgParticlesCtx.fill();
    });
}

/**
 * 🗺️ MINI-MAP: Render mini-map with character and projects
 */
function drawMiniMap() {
    const miniMapCanvas = document.getElementById('miniMapCanvas');
    if (!miniMapCanvas) return;

    const ctx = miniMapCanvas.getContext('2d');
    const scale = 0.04; // 5000px canvas → 200px minimap

    // Clear
    ctx.clearRect(0, 0, 200, 200);

    // Background
    ctx.fillStyle = 'rgba(15, 15, 35, 0.8)';
    ctx.fillRect(0, 0, 200, 200);

    // Grid Lines
    ctx.strokeStyle = 'rgba(102, 126, 234, 0.2)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 200; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 200);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(200, i);
        ctx.stroke();
    }

    // Projects
    projectsData.forEach(project => {
        const x = (2500 + project.x) * scale;
        const y = (2500 + project.y) * scale;

        ctx.fillStyle = 'rgba(102, 126, 234, 0.7)';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Project glow
        ctx.fillStyle = 'rgba(102, 126, 234, 0.2)';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });

    // Character
    const charX = player.x * scale;
    const charY = player.y * scale;

    ctx.fillStyle = '#00d4ff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00d4ff';
    ctx.beginPath();
    ctx.arc(charX, charY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center marker
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(100, 100, 3, 0, Math.PI * 2);
    ctx.stroke();
}

/**
 * 📚 JAVASCRIPT: Start Game on Load
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Character Exploration Portfolio Game');

    initBackgroundParticles();
    initGame();
});
