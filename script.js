const welcome = document.getElementById("welcome");
const lesson = document.getElementById("lesson");
const startButton = document.getElementById("start-button");

const WIDTH = 900;
const HEIGHT = 500;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 52;
const GRAVITY = 0.62;

const experimentObjects = {
    ball: { name: "Ball", emoji: "⚽", fallMs: 680, levels: ["kid", "teen", "adult"], airNote: "Its round shape catches only a little air." },
    apple: { name: "Apple", emoji: "🍎", fallMs: 820, levels: ["kid", "teen"], airNote: "It is not as round as a ball, so air can push on it more." },
    paper: { name: "Paper", emoji: "📄", fallMs: 1280, levels: ["kid", "teen", "adult"], airNote: "Its wide, flat shape catches more air." },
    feather: { name: "Feather", emoji: "🪶", fallMs: 1650, levels: ["kid", "teen", "adult"], airNote: "Its light, wide shape catches lots of air." },
    teddy: { name: "Teddy bear", emoji: "🧸", fallMs: 760, levels: ["kid"], airNote: "It is soft and fluffy, so air slows it down a little." },
    balloon: { name: "Balloon", emoji: "🎈", fallMs: 1900, levels: ["kid"], airNote: "It is big but very light, so air slows it down a lot." },
    basketball: { name: "Basketball", emoji: "🏀", fallMs: 700, levels: ["teen"], airNote: "Its smooth round shape cuts through air quite well." },
    phone: { name: "Phone", emoji: "📱", fallMs: 720, levels: ["teen"], airNote: "It is small and heavy for its size, so air hardly slows it." },
    leaf: { name: "Leaf", emoji: "🍃", fallMs: 1500, levels: ["teen", "adult"], airNote: "It is thin and flat, so it catches lots of air and flutters." },
    bowling: { name: "Bowling ball", emoji: "🎳", fallMs: 640, levels: ["teen", "adult"], airNote: "It is dense and compact, so air drag is tiny compared with its weight." },
    coin: { name: "Coin", emoji: "🪙", fallMs: 650, levels: ["adult"], airNote: "It is small and dense, so air drag barely matters." },
    hammer: { name: "Hammer", emoji: "🔨", fallMs: 660, levels: ["adult"], airNote: "It is dense and compact, so air drag barely matters." },
    parachute: { name: "Parachute", emoji: "🪂", fallMs: 1750, levels: ["adult"], airNote: "It is designed to catch as much air as possible, so drag is huge." }
};

const defaultPairs = {
    kid: { first: "ball", second: "feather" },
    teen: { first: "bowling", second: "leaf" },
    adult: { first: "hammer", second: "feather" }
};

const LEVEL_KEY = "fudool.gravity.level.v1";
const learnerLevels = {
    kid: { label: "Kid", range: "Ages 6–10", icon: "🧒", color: "#e05b53", tint: "#fff0ee", blurb: "Short words, toys and big pictures." },
    teen: { label: "Teen", range: "Ages 11–16", icon: "🎒", color: "#3478e5", tint: "#e8f3ff", blurb: "Real-world examples and the science words." },
    adult: { label: "Adult", range: "Ages 17+", icon: "🎓", color: "#36866a", tint: "#e8f7ef", blurb: "Precise physics, Apollo 15 and trickier questions." }
};

const lessonCopy = {
    kid: {
        answerPrompt: "Choose the picture that matches what you saw.",
        explain1: "Gravity is an invisible force that pulls things toward the ground. That is why Zippy comes back down after jumping!",
        explain3: "Gravity pulls Zippy toward the ground. It helps him land safely on each island after a jump.",
        vacuumFact: "Fun fact: with no air at all, they would land at the very same time!",
        q1: {
            prompt: "When Zippy jumped, what happened next?",
            context: "Think about the jump you just played.",
            explanation: "Gravity pulls Zippy toward the ground, so he comes back down after a jump.",
            hint: "Remember what you saw after Zippy reached the top of his jump.",
            correct: "down",
            options: [
                { id: "down", icon: "⬆️⬇️", label: "He came back down" },
                { id: "up", icon: "☁️⬆️", label: "He stayed up in the sky" }
            ]
        },
        q3: {
            prompt: "After a jump, which way did gravity pull Zippy?",
            context: "Think about the jumps you made to reach the floating island.",
            explanation: "Gravity pulls Zippy down toward the ground and helps him land on an island.",
            hint: "Zippy came back down onto the clouds. Which way was that?",
            correct: "ground",
            options: [
                { id: "ground", icon: "⬇️", label: "Toward the ground" },
                { id: "sky", icon: "⬆️", label: "Toward the sky" }
            ]
        }
    },
    teen: {
        answerPrompt: "Pick the best answer.",
        explain1: "Gravity is a force that pulls objects toward the center of the Earth. Zippy's jump gives him an upward push, but gravity keeps pulling, so he slows down, stops rising and falls back.",
        explain3: "Gravity never takes a break. Even in mid-air it keeps pulling Zippy toward the ground, which is why every jump ends with a landing.",
        vacuumFact: "Fun fact: in a vacuum (no air) they would land at the same time. Air resistance is what makes the difference.",
        q1: {
            prompt: "What pulled Zippy back to the ground after his jump?",
            context: "Think about the jump you just played.",
            explanation: "Gravity pulled Zippy back down. His jump gave him an upward push, but gravity kept pulling the whole time.",
            hint: "Which of these is a force that pulls everything toward the Earth?",
            correct: "gravity",
            options: [
                { id: "gravity", icon: "🌍", label: "Gravity" },
                { id: "wind", icon: "💨", label: "The wind" },
                { id: "magnet", icon: "🧲", label: "A magnet in the clouds" }
            ]
        },
        q3: {
            prompt: "Does gravity pull on Zippy while he is in the air?",
            context: "Think about the long jumps between the islands.",
            explanation: "Yes. Gravity pulls on Zippy the whole time, in the air and on the ground. That is why every jump ends in a landing.",
            hint: "Gravity does not need contact. What happens to Zippy in the middle of a jump?",
            correct: "always",
            options: [
                { id: "always", icon: "⬇️", label: "Yes, it always pulls down" },
                { id: "touch", icon: "☁️", label: "No, only when he touches a cloud" },
                { id: "fall", icon: "📉", label: "Only once he starts falling" }
            ]
        }
    },
    adult: {
        answerPrompt: "Pick the best answer. Some options are common misconceptions.",
        explain1: "Near the Earth's surface, gravity gives every falling object the same downward acceleration, about 9.8 m/s². A jump gives Zippy an initial upward velocity; gravity reduces it to zero at the peak, then speeds him up on the way down.",
        explain3: "Gravity acts continuously, including at the top of the jump. That is why the path is a smooth arc: rise, brief pause, fall.",
        vacuumFact: "In 1971 Apollo 15 astronaut David Scott dropped a hammer and a feather on the Moon, where there is no air. They hit the ground together.",
        q1: {
            prompt: "Zippy leaves the ground moving upward. Which statement best explains the rest of the jump?",
            context: "Think about the whole jump, not just the landing.",
            explanation: "Gravity pulls down for the entire jump. It slows his rise, brings him to a stop at the peak, then speeds up his fall.",
            hint: "Gravity does not switch on and off, and there is no leftover upward force. What acts on Zippy while he is in the air?",
            correct: "constant",
            options: [
                { id: "constant", icon: "⬇️", label: "Gravity pulls the whole time, slowing his rise and then speeding his fall" },
                { id: "peak", icon: "🔝", label: "Gravity only starts pulling once he reaches the top" },
                { id: "push", icon: "🚀", label: "His jump force keeps him rising until it runs out" },
                { id: "off", icon: "🔌", label: "Gravity switches off while he is in the air" }
            ]
        },
        q3: {
            prompt: "On a long jump between islands, which statement about gravity's pull on Zippy is true?",
            context: "Think about the arc of your longest jump.",
            explanation: "Over a jump this small, gravity's pull stays essentially constant. It is not zero at the top and it does not depend on which way he is moving.",
            hint: "Even at the very top of the arc, Zippy still comes back down. What does that say about gravity at that moment?",
            correct: "constant",
            options: [
                { id: "constant", icon: "⬇️", label: "It stays about the same all the way up and down" },
                { id: "zero", icon: "0️⃣", label: "It is zero at the top of the jump" },
                { id: "down", icon: "📉", label: "It only acts while he is falling" },
                { id: "weaker", icon: "🪶", label: "It gets much weaker the higher he jumps" }
            ]
        }
    }
};

function currentLevel() {
    return learnerLevels[game.level] ? game.level : "kid";
}

function levelCopy() {
    return lessonCopy[currentLevel()];
}

function objectIdsForLevel() {
    const level = currentLevel();
    return Object.keys(experimentObjects).filter(id => experimentObjects[id].levels.includes(level));
}

function experimentExplanation(outcome, withFact) {
    const level = currentLevel();
    const slower = outcome.slower;
    const firstId = game.experimentObjects.first;
    const secondId = game.experimentObjects.second;
    const isBallAndFeather = (firstId === "ball" && secondId === "feather") ||
        (firstId === "feather" && secondId === "ball");
    let text;
    if (level === "kid") {
        text = isBallAndFeather
            ? "Gravity pulls both objects down. But air can slow down a feather much more than a ball."
            : `Gravity pulls both things down. ${slower.name} falls more slowly. ${slower.airNote}`;
    } else if (level === "teen") {
        text = `Gravity pulls both objects down at the same rate. The ${slower.name.toLowerCase()} lost the race because of air resistance. ${slower.airNote}`;
    } else {
        text = `Gravity accelerates both objects equally, about 9.8 m/s². The ${slower.name.toLowerCase()} arrived later because of air drag. ${slower.airNote}`;
    }
    return withFact ? `${text} ${levelCopy().vacuumFact}` : text;
}

const PROGRESS_KEY = "fudool.gravity.progress.v1";
const scienceLevels = [
    { id: "gravity", title: "Gravity", story: "Zippy and the Floating Islands", icon: "🪐", color: "#3478e5", tint: "#e8f3ff" },
    { id: "light", title: "Light", story: "The Mystery of the Shadows", icon: "🔦", color: "#d68a19", tint: "#fff5d9" },
    { id: "sound", title: "Sound", story: "The Secret of the Echoes", icon: "🎵", color: "#8a60ce", tint: "#f2eaff" },
    { id: "magnetism", title: "Magnetism", story: "The Magnetic Treasure Hunt", icon: "🧲", color: "#e05b53", tint: "#fff0ee" },
    { id: "motion", title: "Forces and Motion", story: "The Great Machine", icon: "⚙️", color: "#36866a", tint: "#e8f7ef" },
    { id: "electricity", title: "Electricity", story: "The Lost Power", icon: "⚡", color: "#5674d8", tint: "#edf0ff" }
];

const game = {
    frame: 0,
    lastFrame: 0,
    cameraX: 0,
    keys: { left: false, right: false },
    player: null,
    mission: 1,
    completed: {},
    phase: "home",
    platforms: [],
    movingPlatforms: [],
    stars: [],
    coins: [],
    totalStars: 0,
    totalCoins: 0,
    collectedStarIds: new Set(),
    collectedCoinIds: new Set(),
    particles: [],
    hazards: [],
    worldWidth: WIDTH,
    checkpoint: null,
    falls: 0,
    soundEnabled: true,
    audioContext: null,
    musicTimer: 0,
    experimentToken: 0,
    progress: null,
    progressNotice: "",
    learningAttempts: 0,
    lessonStars: 0,
    lastExperimentOutcome: null,
    level: null
};

game.progress = loadProgress();
game.completed = {
    1: game.progress.missionStars[1] > 0,
    2: game.progress.missionStars[2] > 0,
    3: game.progress.missionStars[3] > 0
};
game.totalCoins = game.progress.coins;
game.level = loadLevel();

const playerStart = { x: 90, y: 398 };

if (startButton && lesson && welcome) {
    startButton.addEventListener("click", showAdventurePicker);
    lesson.addEventListener("click", handleGameClick);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", clearKeys);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) clearKeys();
    });
    lesson.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", clearPointerKeys);
    window.addEventListener("pointercancel", clearPointerKeys);
}

function loadLevel() {
    try {
        const saved = localStorage.getItem(LEVEL_KEY);
        return learnerLevels[saved] ? saved : null;
    } catch (error) {
        console.error("Could not load the saved level.", error);
        return null;
    }
}

function setLevel(id) {
    if (!learnerLevels[id]) return;
    game.level = id;
    try {
        localStorage.setItem(LEVEL_KEY, id);
    } catch (error) {
        console.error("Could not save the chosen level.", error);
    }
    showAdventurePicker();
}

function showLevelPicker() {
    stopGameLoop();
    stopMusic();
    game.phase = "level";
    welcome.classList.add("hidden");
    lesson.className = "lesson-section adventure-screen";
    const cards = Object.entries(learnerLevels).map(([id, level], index) => `
        <button class="map-level-card map-level-gravity" type="button" data-level="${id}" style="--level-color:${level.color};--level-tint:${level.tint}">
            <span class="map-level-top"><span class="map-level-number">${String(index + 1).padStart(2, "0")}</span><span class="map-level-icon">${level.icon}</span></span>
            <strong>${level.label}</strong>
            <span class="map-level-story">${level.range} · ${level.blurb}</span>
            <span class="map-level-action">I am a ${level.label.toLowerCase()} <b aria-hidden="true">→</b></span>
        </button>
    `).join("");
    lesson.innerHTML = `
        <button class="back-link" type="button" data-action="home">← Home</button>
        <section class="map-dashboard">
            <div class="map-heading">
                <img class="picker-zippy" src="assets/zippy-idle.png" alt="Zippy">
                <div>
                    <p class="small-title">WHO IS EXPLORING?</p>
                    <h1>Pick your level</h1>
                    <p>Zippy changes the words, the objects and the questions to fit you. You can change this later.</p>
                </div>
            </div>
            <div class="map-board"><div class="map-levels">${cards}</div></div>
        </section>
    `;
}

function emptyProgress() {
    return { missionStars: { 1: 0, 2: 0, 3: 0 }, coins: 0 };
}

function loadProgress() {
    const defaults = emptyProgress();
    try {
        const serialized = localStorage.getItem(PROGRESS_KEY);
        if (!serialized) return defaults;
        const saved = JSON.parse(serialized);
        if (!saved || typeof saved !== "object" || !saved.missionStars || typeof saved.missionStars !== "object") {
            throw new Error("Saved progress has an unexpected format.");
        }

        const missionStars = {};
        for (const mission of [1, 2, 3]) {
            const stars = saved.missionStars[mission];
            if (!Number.isInteger(stars) || stars < 0 || stars > 3) {
                throw new Error(`Saved stars for mission ${mission} are invalid.`);
            }
            missionStars[mission] = stars;
        }
        if (!Number.isInteger(saved.coins) || saved.coins < 0) {
            throw new Error("Saved coin total is invalid.");
        }
        return { missionStars, coins: saved.coins };
    } catch (error) {
        console.error("Could not load saved Fudool progress.", error);
        game.progressNotice = "Your saved progress could not be loaded. A new adventure is ready.";
        return defaults;
    }
}

function saveProgress() {
    try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(game.progress));
        game.progressNotice = "";
    } catch (error) {
        console.error("Could not save Fudool progress.", error);
        game.progressNotice = "Progress could not be saved on this device.";
    }
}

function completedMissionCount() {
    return [1, 2, 3].filter(mission => game.progress.missionStars[mission] > 0).length;
}

function totalLessonStars() {
    return [1, 2, 3].reduce((total, mission) => total + game.progress.missionStars[mission], 0);
}

function showAdventurePicker() {
    if (!game.level) {
        showLevelPicker();
        return;
    }
    stopGameLoop();
    stopMusic();
    game.phase = "picker";
    welcome.classList.add("hidden");
    lesson.className = "lesson-section adventure-screen";
    const completed = completedMissionCount();
    const stars = totalLessonStars();
    const nextMission = [1, 2, 3].find(mission => game.progress.missionStars[mission] === 0);
    const stageNames = ["First Jump", "The Drop Test", "Floating Island"];
    const stageStars = [1, 2, 3].map((mission, index) => {
        const earned = game.progress.missionStars[mission];
        return `
            <span class="map-stage-star ${earned ? "earned" : ""}" aria-label="${stageNames[index]}: ${earned} stars">
                <b>${index + 1}</b><span>${earned ? "★".repeat(earned) : "☆"}</span>
            </span>
        `;
    }).join("");
    const levelCards = scienceLevels.map((level, index) => {
        const unlocked = level.id === "gravity";
        const style = `--level-color:${level.color};--level-tint:${level.tint}`;
        if (unlocked) {
            const status = completed === 3 ? "Gravity adventure complete" : `${completed} of 3 chapters complete`;
            const action = nextMission ? `Continue · ${stageNames[nextMission - 1]}` : "Replay Gravity";
            return `
                <button class="map-level-card map-level-gravity" type="button" data-subject="${level.id}" style="${style}">
                    <span class="map-level-top"><span class="map-level-number">01</span><span class="map-level-icon">${level.icon}</span></span>
                    <strong>${level.title}</strong>
                    <span class="map-level-story">${level.story}</span>
                    <span class="map-level-stars">${stageStars}</span>
                    <span class="map-level-status">${status}</span>
                    <span class="map-level-action">${action} <b aria-hidden="true">→</b></span>
                </button>
            `;
        }
        return `
            <button class="map-level-card map-level-locked" type="button" disabled style="${style}">
                <span class="map-level-top"><span class="map-level-number">${String(index + 1).padStart(2, "0")}</span><span class="map-level-icon">${level.icon}</span></span>
                <strong>${level.title}</strong>
                <span class="map-level-story">${level.story}</span>
                <span class="map-level-status">🔒 Future adventure · Coming soon</span>
            </button>
        `;
    }).join("");
    lesson.innerHTML = `
        <button class="back-link" type="button" data-action="home">← Home</button>
        <section class="map-dashboard">
        <div class="map-heading">
            <img class="picker-zippy" src="assets/zippy-idle.png" alt="Zippy, your cheerful gravity explorer">
            <div>
                <p class="small-title">YOUR SCIENCE ADVENTURE</p>
                <h1>Choose a world to explore!</h1>
                <p>Finish each chapter to earn stars and move along the adventure trail.</p>
                <button class="secondary-game-button level-change-button" type="button" data-action="change-level">${learnerLevels[game.level].icon} ${learnerLevels[game.level].label} level · change</button>
            </div>
            <div class="map-rewards" aria-label="Your rewards">
                <span><b>★ ${stars}</b><small>lesson stars</small></span>
                <span><b>● ${game.progress.coins}</b><small>coins</small></span>
            </div>
        </div>
        <div class="map-progress">
            <div><span>Gravity adventure progress</span><strong>${completed} / 3 chapters</strong></div>
            <progress max="3" value="${completed}" aria-label="Gravity adventure progress"></progress>
        </div>
        <div class="map-board">
            <svg class="map-trail" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
                <path d="M140 112 C260 65 355 160 500 112 S750 70 860 112 C975 170 850 245 690 266 S330 236 140 278"/>
            </svg>
            <div class="map-levels">${levelCards}</div>
        </div>
        <p class="map-caption">The Gravity Islands are ready! More science worlds are on the way.</p>
        ${game.progressNotice ? `<p class="progress-notice" role="status">${game.progressNotice}</p>` : ""}
        </section>
    `;
}

function returnHome() {
    stopGameLoop();
    stopMusic();
    game.phase = "home";
    welcome.classList.remove("hidden");
    lesson.className = "lesson-section";
    lesson.innerHTML = "";
}

function handleGameClick(event) {
    const button = event.target.closest("button");
    if (!button) return;

    if (button.dataset.action === "home") {
        returnHome();
    } else if (button.dataset.action === "change-level") {
        showLevelPicker();
    } else if (button.dataset.action === "levels") {
        showAdventurePicker();
    } else if (button.dataset.action === "begin") {
        startAdventure();
    } else if (button.dataset.action === "restart") {
        startAdventure();
    } else if (button.dataset.action === "pause") {
        pauseGame();
    } else if (button.dataset.action === "resume") {
        resumeGame();
    } else if (button.dataset.action === "restart-mission") {
        startMission(game.mission);
    } else if (button.dataset.action === "sound") {
        toggleSound();
    } else if (button.dataset.action === "continue") {
        startMission(game.mission + 1);
    } else if (button.dataset.action === "finish-gameplay" || button.dataset.action === "learn") {
        showLearningScreen();
    } else if (button.dataset.action === "begin-learning-check") {
        game.learningStep = "question";
        renderLearningScreen();
    } else if (button.dataset.action === "replay-level") {
        startMission(game.mission);
    } else if (button.dataset.action === "drop") {
        dropExperiment();
    } else if (button.dataset.action === "replay-drop") {
        replayExperiment(false);
    } else if (button.dataset.action === "change-pair") {
        replayExperiment(true);
    } else if (button.dataset.changeSlot) {
        game.objectMenuSlot = button.dataset.changeSlot;
        renderMissionPanel();
    } else if (button.dataset.objectId) {
        const otherSlot = button.dataset.objectSlot === "first" ? "second" : "first";
        if (game.experimentObjects[otherSlot] !== button.dataset.objectId) {
            game.experimentObjects[button.dataset.objectSlot] = button.dataset.objectId;
            game.objectMenuSlot = null;
            game.experimentDone = false;
            game.lastExperimentOutcome = null;
            renderMissionPanel();
        }
    } else if (button.dataset.level) {
        setLevel(button.dataset.level);
    } else if (button.dataset.learningAnswer) {
        answerLearningQuestion(button.dataset.learningAnswer);
    } else if (button.dataset.subject === "gravity") {
        startAdventure();
    } else if (button.dataset.control && event.detail === 0) {
        if (button.dataset.control === "jump") jump();
        else {
            game.keys[button.dataset.control] = true;
            window.setTimeout(() => { game.keys[button.dataset.control] = false; }, 180);
        }
    }
}

function handlePointerDown(event) {
    const control = event.target.closest("[data-control]");
    if (!control) return;

    if (control.dataset.control === "jump") {
        jump();
    } else {
        game.keys[control.dataset.control] = true;
    }
}

function clearPointerKeys() {
    game.keys.left = false;
    game.keys.right = false;
}

function handleKeyDown(event) {
    if (game.phase !== "playing") return;
    const key = event.key.toLowerCase();
    if (["arrowleft", "arrowright", " ", "arrowup"].includes(key)) event.preventDefault();

    if (key === "arrowleft" || key === "a") game.keys.left = true;
    if (key === "arrowright" || key === "d") game.keys.right = true;
    if (!event.repeat && (key === " " || key === "arrowup" || key === "w")) jump();
}

function handleKeyUp(event) {
    const key = event.key.toLowerCase();
    if (key === "arrowleft" || key === "a") game.keys.left = false;
    if (key === "arrowright" || key === "d") game.keys.right = false;
}

function clearKeys() {
    game.keys.left = false;
    game.keys.right = false;
}

function startAdventure() {
    game.completed = {
        1: game.progress.missionStars[1] > 0,
        2: game.progress.missionStars[2] > 0,
        3: game.progress.missionStars[3] > 0
    };
    game.totalStars = 0;
    game.totalCoins = 0;
    game.collectedStarIds = new Set();
    game.collectedCoinIds = new Set();
    const nextMission = [1, 2, 3].find(mission => !game.completed[mission]) || 1;
    startMission(nextMission);
}

function startMission(number) {
    stopGameLoop();
    game.experimentToken++;
    game.mission = number;
    game.phase = "playing";
    game.cameraX = 0;
    game.falls = 0;
    game.keys.left = false;
    game.keys.right = false;
    startMusic();
    game.player = {
        x: playerStart.x,
        y: playerStart.y,
        vx: 0,
        vy: 0,
        onGround: true,
        hasJumped: false,
        landedAfterJump: false,
        landingFrames: 0
    };

    game.worldWidth = number === 3 ? 1530 : 1100;
    game.coins = number === 1
        ? [
            { id: "first-coin-1", x: 190, y: 420 },
            { id: "first-coin-2", x: 360, y: 350 },
            { id: "first-coin-3", x: 590, y: 290 }
        ]
        : number === 3
            ? [
                { id: "island-coin-1", x: 180, y: 420 },
                { id: "island-coin-2", x: 620, y: 285 },
                { id: "island-coin-3", x: 1080, y: 295 }
            ]
            : [];
    game.coins = game.coins.map(coin => ({
        ...coin,
        collected: game.collectedCoinIds.has(coin.id)
    }));
    game.platforms = number === 3
        ? [
            { x: 0, y: 450, w: 270 },
            { x: 270, y: 450, w: 80, bridge: true },
            { x: 350, y: 385, w: 145 },
            { x: 495, y: 385, w: 60, bridge: true },
            { x: 555, y: 320, w: 145 },
            { x: 765, y: 380, w: 155 },
            { x: 985, y: 330, w: 165 },
            { x: 1215, y: 280, w: 315 }
        ]
        : [
            { x: 0, y: 450, w: 1100 },
            { x: 285, y: 380, w: 145 },
            { x: 530, y: 320, w: 155 },
            { x: 790, y: 365, w: 150 }
        ];
    game.stars = number === 3
        ? [
            { id: "island-star-1", x: 416, y: 346, collected: game.collectedStarIds.has("island-star-1") },
            { id: "island-star-2", x: 621, y: 281, collected: game.collectedStarIds.has("island-star-2") },
            { id: "island-star-3", x: 1090, y: 291, collected: game.collectedStarIds.has("island-star-3") }
        ]
        : [];
    game.movingPlatforms = number === 3
        ? [{ x: 709, baseY: 345, y: 345, w: 72, h: 13, range: 19, phase: 0.6 }]
        : [];
    game.particles = [];
    game.hazards = number === 3 ? [{ x: 835, y: 350, w: 38, h: 30 }] : [];
    game.checkpoint = { x: playerStart.x, y: playerStart.y };
    game.mission1Step = "playing";
    game.objectMenuSlot = null;
    game.experimentObjects = { ...defaultPairs[currentLevel()] };
    game.experimentDone = false;
    game.experimentStarted = false;
    game.experimentRuns = 0;
    game.experimentResult = null;
    game.learningAttempts = 0;
    game.learningHint = "";
    game.lessonStars = 0;
    game.rewardCoins = 0;
    game.lastExperimentOutcome = null;
    game.toast = "";

    renderGameScreen();
    if (number !== 2) game.frame = requestAnimationFrame(gameLoop);
}

function renderGameScreen() {
    lesson.className = "lesson-section adventure-screen";
    lesson.innerHTML = `
        <div class="game-toolbar">
            <button class="back-link" type="button" data-action="levels">← Adventures</button>
            <div class="game-counters" aria-label="Collected items">
                <span id="star-counter" aria-label="Energy stars collected">★ ${game.totalStars}</span>
                <span id="coin-counter" aria-label="Coins collected">● ${game.totalCoins}</span>
            </div>
            <div class="game-progress">
                <span id="mission-label">Mission 1 of 3</span>
                <progress id="mission-progress" max="3" value="1" aria-label="Adventure progress"></progress>
            </div>
            <button class="sound-button" type="button" data-action="sound" aria-pressed="${game.soundEnabled}">♪ Sound ${game.soundEnabled ? "on" : "off"}</button>
            ${game.mission === 2 ? "" : '<button class="pause-button" type="button" data-action="pause">Ⅱ Pause</button>'}
            ${game.mission === 2 ? "" : '<button class="restart-button" type="button" data-action="restart">↻ Restart</button>'}
        </div>
        <div class="game-layout ${game.mission === 2 ? "experiment-only-layout" : ""}">
            ${game.mission === 2 ? "" : `
            <div class="game-stage" id="game-stage">
                <canvas id="game-canvas" width="900" height="500" aria-label="Zippy's floating island game world"></canvas>
                <img class="zippy-avatar" id="zippy-avatar" src="assets/zippy-idle.png" alt="">
                <div class="game-controls" aria-label="Touch controls">
                    <button type="button" data-control="left" aria-label="Move left">◀</button>
                    <button type="button" class="jump-control" data-control="jump">Jump</button>
                    <button type="button" data-control="right" aria-label="Move right">▶</button>
                </div>
                <div class="completion-overlay hidden" id="completion-overlay" role="status">
                    <div class="completion-card">
                        <div class="completion-stars" aria-hidden="true">✦ ✦ ✦</div>
                        <h2>We did it, gravity explorer!</h2>
                        <p>You collected every energy star and helped the floating world shine again.</p>
                        <button type="button" data-action="home">Back to Fudool</button>
                    </div>
                </div>
                <div class="pause-overlay hidden" id="pause-overlay" role="dialog" aria-modal="true" aria-labelledby="pause-title">
                    <div class="completion-card">
                        <div class="completion-stars" aria-hidden="true">☁ ✦ ☁</div>
                        <h2 id="pause-title">Take a little break</h2>
                        <p>Zippy will be right here when you’re ready.</p>
                        <button type="button" data-action="resume">Keep playing</button>
                        <button class="secondary-game-button" type="button" data-action="restart-mission">Try this mission again</button>
                        <button class="secondary-game-button" type="button" data-action="levels">Back to missions</button>
                    </div>
                </div>
            </div>
            `}
            <aside class="mission-card" id="mission-card" aria-live="polite"></aside>
        </div>
    `;

    const canvas = document.getElementById("game-canvas");
    game.canvas = canvas;
    game.context = canvas ? canvas.getContext("2d") : null;
    renderMissionPanel();
}

function renderMissionPanel() {
    const panel = document.getElementById("mission-card");
    if (!panel) return;

    const content = game.mission === 1
        ? missionOnePanel()
        : game.mission === 2
            ? missionTwoPanel()
            : missionThreePanel();
    panel.innerHTML = content;

    const label = document.getElementById("mission-label");
    const progress = document.getElementById("mission-progress");
    const stars = document.getElementById("star-counter");
    const coins = document.getElementById("coin-counter");
    if (label) label.textContent = `Mission ${game.mission} of 3`;
    if (progress) progress.value = game.mission;
    if (stars) stars.textContent = `★ ${game.totalStars}`;
    if (coins) coins.textContent = `● ${game.totalCoins}`;
}

function missionOnePanel() {
    const ready = game.mission1Step === "ready";
    return `
        <span class="mission-kicker">MISSION 1 · PLAY</span>
        <h2>Explore the floating islands.</h2>
        <p>Move Zippy, jump between the clouds, and watch him come back down.</p>
        <div class="mini-tip"><span aria-hidden="true">⌨️</span><span>Use ← → or A / D to move. Press Space to jump.</span></div>
        <p class="mission-note">${ready ? "Nice jump! You saw Zippy land safely." : "Try at least one jump. Your lesson will be ready when Zippy lands."}</p>
        <button class="primary-game-button" type="button" data-action="finish-gameplay" ${ready ? "" : "disabled"}>Go to the lesson →</button>
    `;
}

function missionTwoPanel() {
    const firstId = game.experimentObjects.first;
    const secondId = game.experimentObjects.second;
    const first = experimentObjects[firstId];
    const second = experimentObjects[secondId];
    const outcome = getExperimentOutcome();
    const heading = `
        <div class="experiment-intro">
            <img class="experiment-zippy" src="assets/zippy-idle.png" alt="Zippy">
            <span class="mission-kicker">MISSION 2 · ${game.experimentDone ? "EXPERIMENT COMPLETE" : "PLAY THE DROP TEST"}</span>
        </div>
    `;

    if (game.experimentDone) {
        const explanation = experimentExplanation(outcome, true);
        return `
            ${heading}
            <h2>${outcome.faster.name} reached the ground first!</h2>
            <p class="learning-explanation">${explanation}</p>
            <p class="feedback good-feedback">Zippy saw both objects fall. Try another pair, or continue to the lesson.</p>
            <div class="experiment-actions">
                <button type="button" data-action="replay-drop">↻ Replay this drop</button>
                <button type="button" data-action="change-pair">Change objects</button>
            </div>
            <button class="primary-game-button" type="button" data-action="learn">Continue to the lesson →</button>
        `;
    }

    const choices = objectIdsForLevel().map(id => {
        const object = experimentObjects[id];
        const disabled = game.experimentObjects[game.objectMenuSlot === "first" ? "second" : "first"] === id;
        return `
            <button type="button" class="object-option" data-object-id="${id}" data-object-slot="${game.objectMenuSlot}" ${disabled ? "disabled" : ""}>
                <span aria-hidden="true">${object.emoji}</span>${object.name}
            </button>
        `;
    }).join("");
    const objectPicker = game.objectMenuSlot
        ? `
            <div class="object-options" aria-label="Choose an object">
                <p>Choose the ${game.objectMenuSlot} object:</p>
                <div>${choices}</div>
            </div>
        `
        : "";
    const dropping = game.experimentStarted ? "dropping" : "";

    return `
        ${heading}
        <h2>Choose two things to drop.</h2>
        <p>Watch both objects fall, then see what Zippy discovers.</p>
        <div class="experiment-pair">
            <button type="button" data-change-slot="first" ${game.experimentStarted ? "disabled" : ""}>
                <small>First object · change</small><span aria-hidden="true">${first.emoji}</span><b>${first.name}</b>
            </button>
            <span class="pair-versus" aria-hidden="true">VS</span>
            <button type="button" data-change-slot="second" ${game.experimentStarted ? "disabled" : ""}>
                <small>Second object · change</small><span aria-hidden="true">${second.emoji}</span><b>${second.name}</b>
            </button>
        </div>
        ${objectPicker}
        <div class="experiment-arena ${dropping}" aria-label="Falling objects experiment">
            <div class="experiment-lane">
                <span class="falling-object" data-object-id="${firstId}" style="--fall-duration:${first.fallMs}ms">${first.emoji}</span>
                <span class="falling-label">${first.name}</span>
            </div>
            <div class="experiment-lane">
                <span class="falling-object" data-object-id="${secondId}" style="--fall-duration:${second.fallMs}ms">${second.emoji}</span>
                <span class="falling-label">${second.name}</span>
            </div>
            <span class="experiment-ground" aria-hidden="true"></span>
        </div>
        <button class="primary-game-button" type="button" data-action="drop" ${game.experimentStarted || game.objectMenuSlot ? "disabled" : ""}>Drop them!</button>
    `;
}

function getExperimentOutcome() {
    const firstId = game.experimentObjects.first;
    const secondId = game.experimentObjects.second;
    const fasterId = experimentObjects[firstId].fallMs < experimentObjects[secondId].fallMs ? firstId : secondId;
    const slowerId = fasterId === firstId ? secondId : firstId;
    return {
        fasterId,
        faster: experimentObjects[fasterId],
        slower: experimentObjects[slowerId]
    };
}

function missionThreePanel() {
    const total = game.stars.filter(star => star.collected).length;
    return `
        <span class="mission-kicker">MISSION 3 · FLOATING ISLAND</span>
        <h2>Reach the glowing island!</h2>
        <p>Collect every energy star, then step onto the island. Jump across the clouds!</p>
        <div class="star-progress" aria-live="polite"><span aria-hidden="true">★</span> Energy stars: <b>${total} / 3</b></div>
        <div class="mini-tip"><span aria-hidden="true">🪄</span><span>Press and release Jump. Gravity brings Zippy back down onto each island.</span></div>
        <p class="mission-note" id="world-message">${game.toast || "A little jump is enough to reach the next cloud."}</p>
        <div class="gravity-arrow" aria-hidden="true"><span>↑</span><span>↓</span><small>gravity</small></div>
    `;
}

function getLearningQuestion() {
    if (game.mission === 1) return levelCopy().q1;

    if (game.mission === 2) {
        const outcome = getExperimentOutcome();
        return {
            prompt: "Which object reached the ground first?",
            context: `Think about your drop with the ${experimentObjects[game.experimentObjects.first].name.toLowerCase()} and ${experimentObjects[game.experimentObjects.second].name.toLowerCase()}.`,
            explanation: experimentExplanation(outcome, false),
            hint: "Remember which object touched the green ground first.",
            correct: game.lastExperimentOutcome,
            options: [game.experimentObjects.first, game.experimentObjects.second].map(id => ({
                id,
                icon: experimentObjects[id].emoji,
                label: experimentObjects[id].name
            }))
        };
    }

    if (game.mission === 3) return levelCopy().q3;

    return null;
}

function showLearningScreen() {
    stopGameLoop();
    stopMusic();
    clearKeys();
    game.phase = "learning";
    game.learningAttempts = 0;
    game.learningHint = "";
    game.learningStep = game.mission === 2 ? "question" : "explain";
    renderLearningScreen();
}

function renderLearningScreen() {
    if (game.learningStep === "explain") {
        const explanation = game.mission === 1 ? levelCopy().explain1 : levelCopy().explain3;
        lesson.className = "lesson-section adventure-screen learning-screen";
        lesson.innerHTML = `
            <button class="back-link" type="button" data-action="levels">← Science map</button>
            <section class="learning-panel gravity-explain-panel">
                <div class="learning-progress">
                    <span>CHAPTER ${game.mission} · DISCOVER</span>
                    <progress max="3" value="${game.mission}" aria-label="Gravity lesson progress"></progress>
                </div>
                <div class="learning-zippy"><img src="assets/zippy-jump.png" alt="Zippy jumping"></div>
                <p class="learning-context">What Zippy discovered</p>
                <h1>Why did Zippy come back down?</h1>
                <p class="learning-explanation">${explanation}</p>
                <div class="gravity-demonstration" aria-label="Gravity pulls Zippy down toward the ground">
                    <img class="gravity-demo-zippy" src="assets/zippy-fall.png" alt="">
                    <span class="gravity-demo-arrows" aria-hidden="true">↓　↓　↓</span>
                    <span class="gravity-demo-ground">THE GROUND</span>
                </div>
                <button class="primary-game-button" type="button" data-action="begin-learning-check">I understand—let’s try! →</button>
            </section>
        `;
        return;
    }

    const question = getLearningQuestion();
    if (!question) {
        console.error("Could not find a learning question for the current mission.", game.mission);
        showAdventurePicker();
        return;
    }

    lesson.className = "lesson-section adventure-screen learning-screen";
    const answers = question.options.map(option => `
        <button type="button" class="learning-answer" data-learning-answer="${option.id}">
            <span aria-hidden="true">${option.icon}</span>${option.label}
        </button>
    `).join("");
    lesson.innerHTML = `
        <button class="back-link" type="button" data-action="levels">← Science map</button>
        <section class="learning-panel">
            <div class="learning-progress">
                <span>CHAPTER ${game.mission} · LEARN</span>
                <progress max="3" value="${game.mission}" aria-label="Gravity lesson progress"></progress>
            </div>
            <div class="learning-zippy"><img src="assets/zippy-idle.png" alt="Zippy"></div>
            <p class="learning-context">${question.context}</p>
            <h1>${question.prompt}</h1>
            <p>${levelCopy().answerPrompt}</p>
            <div class="learning-answers">${answers}</div>
            ${game.learningHint ? `<div class="friendly-hint" role="status"><span class="hint-arrow" aria-hidden="true">↓</span><span>${game.learningHint}</span></div>` : ""}
        </section>
    `;
}

function answerLearningQuestion(answer) {
    const question = getLearningQuestion();
    if (game.phase !== "learning" || !question || !question.options.some(option => option.id === answer)) {
        console.error("Received an invalid answer for the current learning question.", answer);
        return;
    }
    if (answer !== question.correct) {
        game.learningAttempts++;
        game.learningHint = game.learningAttempts > 1
            ? question.explanation
            : `Good try! ${question.hint}`;
        renderLearningScreen();
        return;
    }

    game.lessonStars = Math.max(1, 3 - Math.min(game.learningAttempts, 2));
    const previousBest = game.progress.missionStars[game.mission];
    game.progress.missionStars[game.mission] = Math.max(previousBest, game.lessonStars);
    game.completed[game.mission] = true;
    game.rewardCoins = game.lessonStars;
    game.progress.coins += game.rewardCoins;
    saveProgress();
    renderRewardScreen(question);
}

function renderRewardScreen(question) {
    game.phase = "reward";
    stopGameLoop();
    stopMusic();
    lesson.className = "lesson-section adventure-screen reward-screen";
    const stars = Array.from({ length: 3 }, (_, index) =>
        `<span class="${index < game.lessonStars ? "earned" : ""}" aria-hidden="true">★</span>`
    ).join("");
    const action = game.mission < 3
        ? `<button class="primary-game-button" type="button" data-action="continue">Continue to Chapter ${game.mission + 1} →</button>`
        : '<button class="primary-game-button" type="button" data-action="levels">Return to the science map →</button>';
    lesson.innerHTML = `
        <section class="reward-panel">
            <div class="reward-confetti" aria-hidden="true">✦　☁　✦</div>
            <img class="reward-zippy" src="assets/zippy-celebrate.png" alt="Zippy celebrating">
            <p class="small-title">CHAPTER ${game.mission} COMPLETE</p>
            <h1>Wonderful exploring!</h1>
            <p class="learning-explanation">${question.explanation}</p>
            <div class="reward-stars" aria-label="${game.lessonStars} stars earned">${stars}</div>
            <p>You earned <b>${game.lessonStars} stars</b> and <b>${game.rewardCoins} coins</b>!</p>
            <p class="reward-total">Gravity lesson stars: ${totalLessonStars()} / 9</p>
            <div class="reward-actions">
                <button class="secondary-game-button" type="button" data-action="replay-level">Play this chapter again</button>
                ${action}
            </div>
        </section>
    `;
}

function pauseGame() {
    if (game.phase !== "playing") return;
    game.phase = "paused";
    clearKeys();
    if (game.frame) cancelAnimationFrame(game.frame);
    game.frame = 0;
    game.lastFrame = 0;
    const overlay = document.getElementById("pause-overlay");
    if (overlay) overlay.classList.remove("hidden");
    stopMusic();
}

function resumeGame() {
    if (game.phase !== "paused") return;
    game.phase = "playing";
    const overlay = document.getElementById("pause-overlay");
    if (overlay) overlay.classList.add("hidden");
    game.lastFrame = 0;
    startMusic();
    game.frame = requestAnimationFrame(gameLoop);
}

function toggleSound() {
    game.soundEnabled = !game.soundEnabled;
    if (game.soundEnabled) startMusic();
    else stopMusic();
    const button = document.querySelector('[data-action="sound"]');
    if (button) {
        button.textContent = game.soundEnabled ? "♪ Sound on" : "♪ Sound off";
        button.setAttribute("aria-pressed", String(game.soundEnabled));
    }
}

function startMusic() {
    if (!game.soundEnabled || game.musicTimer) return;
    const AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!game.audioContext && AudioContextType) game.audioContext = new AudioContextType();
    if (!game.audioContext) {
        game.soundEnabled = false;
        return;
    }
    if (game.audioContext.state === "suspended") game.audioContext.resume();

    const notes = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
    let noteIndex = 0;
    game.musicTimer = window.setInterval(() => {
        playTone(notes[noteIndex % notes.length], 0.28, 0.018);
        noteIndex++;
    }, 560);
}

function stopMusic() {
    if (game.musicTimer) window.clearInterval(game.musicTimer);
    game.musicTimer = 0;
}

function playTone(frequency, duration, volume) {
    if (!game.soundEnabled || !game.audioContext) return;
    const oscillator = game.audioContext.createOscillator();
    const gain = game.audioContext.createGain();
    const start = game.audioContext.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(volume, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(gain);
    gain.connect(game.audioContext.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
}

function playEffect(effect) {
    const sounds = {
        jump: [440, 0.16, 0.045],
        land: [220, 0.12, 0.035],
        coin: [880, 0.18, 0.045],
        star: [1046.5, 0.28, 0.05],
        bump: [164.8, 0.2, 0.04]
    };
    if (game.audioContext && sounds[effect]) playTone(...sounds[effect]);
}

function dropExperiment() {
    if (game.experimentDone || game.experimentStarted || game.objectMenuSlot) return;
    const arena = document.querySelector(".experiment-arena");
    const dropButton = document.querySelector('[data-action="drop"]');
    if (!arena || !dropButton) return;

    game.experimentStarted = true;
    arena.classList.add("dropping");
    dropButton.disabled = true;
    const token = ++game.experimentToken;
    const outcome = getExperimentOutcome();
    const duration = Math.max(
        experimentObjects[game.experimentObjects.first].fallMs,
        experimentObjects[game.experimentObjects.second].fallMs
    ) + 180;
    window.setTimeout(() => {
        if (token !== game.experimentToken || game.mission !== 2 || !["playing", "paused"].includes(game.phase)) return;
        game.experimentStarted = false;
        game.experimentDone = true;
        game.experimentResult = outcome.fasterId;
        game.lastExperimentOutcome = outcome.fasterId;
        game.experimentRuns++;
        renderMissionPanel();
    }, duration);
}

function replayExperiment(changeObjects) {
    if (game.mission !== 2) return;
    game.experimentToken++;
    game.experimentStarted = false;
    game.experimentDone = false;
    game.experimentResult = null;
    game.lastExperimentOutcome = null;
    game.objectMenuSlot = changeObjects ? "first" : null;
    renderMissionPanel();
}

function jump() {
    if (game.phase !== "playing" || !game.player || !game.player.onGround) return;
    game.player.vy = -13.6;
    game.player.onGround = false;
    game.player.hasJumped = true;
    game.player.landingFrames = 0;
    playEffect("jump");
}

function gameLoop(timestamp) {
    if (game.phase !== "playing" || !game.context) return;
    const elapsed = game.lastFrame ? Math.min((timestamp - game.lastFrame) / 16.67, 2) : 1;
    game.lastFrame = timestamp;

    updateWorld(elapsed);
    if (game.phase !== "playing") return;
    drawWorld();
    updateZippyPosition();
    game.frame = requestAnimationFrame(gameLoop);
}

function updateWorld(elapsed) {
    const player = game.player;
    const acceleration = game.mission === 3 ? 0.72 : 0.82;
    const speedLimit = game.mission === 3 ? 5.2 : 5.5;
    const previousBottom = player.y + PLAYER_HEIGHT;
    const wasGrounded = player.onGround;
    const now = performance.now() / 1000;
    for (const platform of game.movingPlatforms) {
        platform.y = platform.baseY + Math.sin(now * 1.6 + platform.phase) * platform.range;
    }

    if (game.keys.left) player.vx -= acceleration * elapsed;
    if (game.keys.right) player.vx += acceleration * elapsed;
    if (!game.keys.left && !game.keys.right) player.vx *= Math.pow(0.82, elapsed);
    player.vx = Math.max(-speedLimit, Math.min(speedLimit, player.vx));
    player.x = Math.max(0, Math.min(game.worldWidth - PLAYER_WIDTH, player.x + player.vx * elapsed));
    player.vy = Math.min(15, player.vy + GRAVITY * elapsed);
    player.y += player.vy * elapsed;
    player.onGround = false;

    for (const platform of game.platforms.concat(game.movingPlatforms)) {
        const overlapsPlatform = player.x + PLAYER_WIDTH > platform.x &&
            player.x < platform.x + platform.w;
        if (overlapsPlatform &&
            previousBottom <= platform.y &&
            player.y + PLAYER_HEIGHT >= platform.y &&
            player.vy >= 0) {
            player.y = platform.y - PLAYER_HEIGHT;
            player.vy = 0;
            player.onGround = true;
            if (!wasGrounded) {
                player.landingFrames = 9;
                spawnParticles(player.x + PLAYER_WIDTH / 2, platform.y, "#ffffff", 5);
                playEffect("land");
            }
            if (game.mission === 1 && game.mission1Step === "playing" && player.hasJumped && !player.landedAfterJump) {
                player.landedAfterJump = true;
                game.mission1Step = "ready";
                renderMissionPanel();
            }
            if (game.mission === 3 && platform.x > 700) {
                game.checkpoint = { x: platform.x + 12, y: platform.y - PLAYER_HEIGHT };
            }
        }
    }

    if (player.landingFrames > 0) player.landingFrames -= elapsed;
    updateCollectibles();
    updateParticles(elapsed);
    if (game.mission === 3) updateIslandChallenge();

    const cameraTarget = Math.max(0, Math.min(game.worldWidth - WIDTH, player.x - 340));
    game.cameraX += (cameraTarget - game.cameraX) * Math.min(1, 0.12 * elapsed);
}

function updateCollectibles() {
    const player = game.player;
    for (const coin of game.coins) {
        if (coin.collected || !overlaps(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, coin.x - 9, coin.y - 12, 18, 24)) continue;
        coin.collected = true;
        game.collectedCoinIds.add(coin.id);
        game.totalCoins++;
        game.progress.coins++;
        saveProgress();
        spawnParticles(coin.x, coin.y, "#ffd34e", 8);
        playEffect("coin");
        renderMissionPanel();
    }
    for (const star of game.stars) {
        if (star.collected || !overlaps(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, star.x - 15, star.y - 15, 30, 30)) continue;
        star.collected = true;
        game.collectedStarIds.add(star.id);
        game.totalStars++;
        spawnParticles(star.x, star.y, "#ffe16a", 12);
        playEffect("star");
        renderMissionPanel();
    }
}

function spawnParticles(x, y, color, count) {
    for (let index = 0; index < count; index++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2.4;
        game.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.2,
            color,
            life: 24 + Math.random() * 14
        });
    }
}

function updateParticles(elapsed) {
    game.particles = game.particles.filter(particle => {
        particle.x += particle.vx * elapsed;
        particle.y += particle.vy * elapsed;
        particle.vy += 0.09 * elapsed;
        particle.life -= elapsed;
        return particle.life > 0;
    });
}

function updateIslandChallenge() {
    const player = game.player;
    for (const hazard of game.hazards) {
        if (overlaps(player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT, hazard.x, hazard.y, hazard.w, hazard.h)) {
            respawnAtCheckpoint();
            return;
        }
    }

    if (player.y > HEIGHT + 80) {
        respawnAtCheckpoint();
        return;
    }

    const allStarsCollected = game.stars.every(star => star.collected);
    if (allStarsCollected && player.x > 1400 && player.y < 300) {
        finishAdventure();
    } else if (!allStarsCollected && player.x > 1400 && player.y < 300 && !game.toast) {
        game.toast = "The island needs all 3 energy stars. Look for their golden sparkle!";
        renderMissionPanel();
    }
}

function overlaps(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function respawnAtCheckpoint() {
    game.falls++;
    game.player.x = game.checkpoint.x;
    game.player.y = game.checkpoint.y;
    game.player.vx = 0;
    game.player.vy = 0;
    game.player.onGround = true;
    game.player.landingFrames = 0;
    playEffect("bump");
    game.cameraX = Math.max(0, game.player.x - 340);
    game.toast = game.falls > 1
        ? "Try a short jump, then let go. Gravity brings Zippy gently back onto the next island."
        : "Boing! Zippy is safe. Try a smaller jump to land on the next cloud.";
    renderMissionPanel();
}

function finishAdventure() {
    game.keys.left = false;
    game.keys.right = false;
    showLearningScreen();
}

function updateZippyPosition() {
    const avatar = document.getElementById("zippy-avatar");
    if (!avatar || !game.player) return;

    const player = game.player;
    const pose = game.phase === "finished"
        ? "celebrate"
        : !player.onGround
            ? player.vy < 0 ? "jump" : "fall"
            : player.landingFrames > 0
                ? "land"
            : Math.abs(player.vx) > 0.5
                ? Math.abs(player.vx) > 3.6 ? "run" : "walk"
                : "idle";
    const spriteName = pose === "land" ? "idle" : pose;
    const spriteSource = `assets/zippy-${spriteName}.png`;
    if (avatar.getAttribute("src") !== spriteSource) avatar.setAttribute("src", spriteSource);
    avatar.style.left = `${((player.x - game.cameraX - 18) / WIDTH) * 100}%`;
    avatar.style.top = `${((player.y + PLAYER_HEIGHT - 92) / HEIGHT) * 100}%`;
    avatar.style.width = `${(78 / WIDTH) * 100}%`;
    avatar.style.height = `${(96 / HEIGHT) * 100}%`;
    avatar.classList.toggle("facing-left", player.vx < -0.3);
}

function stopGameLoop() {
    if (game.frame) cancelAnimationFrame(game.frame);
    game.frame = 0;
    game.lastFrame = 0;
    clearKeys();
}

function drawWorld() {
    const ctx = game.context;
    const cameraX = game.cameraX;
    const now = performance.now() / 1000;
    const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    sky.addColorStop(0, "#75bce9");
    sky.addColorStop(1, "#e5f7ff");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "#ffe16a";
    ctx.beginPath();
    ctx.arc(780 - cameraX * 0.12, 72, 35, 0, Math.PI * 2);
    ctx.fill();
    drawCloud(ctx, 125 - cameraX * 0.16 + Math.sin(now * 0.35) * 8, 110, 0.95);
    drawCloud(ctx, 465 - cameraX * 0.14 + Math.sin(now * 0.25 + 2) * 11, 90, 0.75);
    drawCloud(ctx, 735 - cameraX * 0.11 + Math.sin(now * 0.3 + 4) * 9, 155, 1.05);
    drawMountains(ctx, cameraX);

    ctx.save();
    ctx.translate(-cameraX, 0);
    drawDistantIslands(ctx);
    drawPlatforms(ctx);
    drawStars(ctx, now);
    drawCoins(ctx, now);
    drawHazards(ctx, now);
    if (game.mission === 3) drawFinishFlag(ctx);
    drawParticles(ctx);
    ctx.restore();
}

function drawMountains(ctx, cameraX) {
    for (const layer of [
        { parallax: 0.09, base: 363, color: "#b1d5e8", peak: 112 },
        { parallax: 0.16, base: 405, color: "#83b8d5", peak: 80 }
    ]) {
        ctx.save();
        ctx.translate(-cameraX * layer.parallax, 0);
        ctx.fillStyle = layer.color;
        ctx.beginPath();
        ctx.moveTo(-360, HEIGHT);
        for (let x = -360; x <= WIDTH + 400; x += 180) {
            const peak = layer.base - layer.peak * (0.72 + Math.sin(x * 0.018) * 0.22);
            ctx.lineTo(x + 90, peak);
            ctx.lineTo(x + 180, layer.base);
        }
        ctx.lineTo(WIDTH + 400, HEIGHT);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function drawCloud(ctx, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = "rgba(255,255,255,.82)";
    ctx.beginPath();
    ctx.arc(0, 16, 21, 0, Math.PI * 2);
    ctx.arc(24, 7, 28, 0, Math.PI * 2);
    ctx.arc(53, 17, 21, 0, Math.PI * 2);
    ctx.roundRect(-14, 15, 82, 27, 16);
    ctx.fill();
    ctx.restore();
}

function drawDistantIslands(ctx) {
    const baseY = 405;
    for (let x = 70; x < game.worldWidth; x += 310) {
        ctx.fillStyle = "#69a96b";
        ctx.beginPath();
        ctx.ellipse(x + 95, baseY, 80, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#a98162";
        ctx.beginPath();
        ctx.moveTo(x + 25, baseY);
        ctx.lineTo(x + 165, baseY);
        ctx.lineTo(x + 135, baseY + 25);
        ctx.lineTo(x + 82, baseY + 31);
        ctx.closePath();
        ctx.fill();
        drawTree(ctx, x + 82, baseY - 10, 0.7);
        drawRock(ctx, x + 133, baseY - 7, 0.7);
    }
}

function drawPlatforms(ctx) {
    for (const platform of game.platforms) {
        if (platform.bridge) {
            drawBridge(ctx, platform);
            continue;
        }
        ctx.fillStyle = "rgba(35, 91, 104, .2)";
        ctx.beginPath();
        ctx.ellipse(platform.x + platform.w / 2, platform.y + 14, platform.w / 2, 17, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#a96f43";
        ctx.beginPath();
        if (platform.y > 430) {
            ctx.roundRect(platform.x, platform.y, platform.w, HEIGHT - platform.y + 45, 12);
        } else {
            ctx.moveTo(platform.x + 5, platform.y + 5);
            ctx.lineTo(platform.x + platform.w - 5, platform.y + 5);
            ctx.lineTo(platform.x + platform.w - 22, platform.y + 25);
            ctx.lineTo(platform.x + platform.w * 0.62, platform.y + 36);
            ctx.lineTo(platform.x + platform.w * 0.29, platform.y + 31);
            ctx.lineTo(platform.x + 13, platform.y + 20);
            ctx.closePath();
        }
        ctx.fill();
        ctx.fillStyle = "#65bb69";
        ctx.beginPath();
        ctx.roundRect(platform.x, platform.y - 7, platform.w, 19, 10);
        ctx.fill();
        ctx.fillStyle = "#8cdb77";
        ctx.beginPath();
        ctx.roundRect(platform.x + 8, platform.y - 5, platform.w - 16, 6, 3);
        ctx.fill();
        drawTree(ctx, platform.x + platform.w - 30, platform.y - 5, 0.58);
        drawFlower(ctx, platform.x + 28, platform.y - 7, "#ff8e69");
        drawFlower(ctx, platform.x + 44, platform.y - 7, "#ffe16a");
        drawRock(ctx, platform.x + platform.w * 0.57, platform.y + 16, 0.65);
        if (platform.x > 900) drawCave(ctx, platform.x + platform.w * 0.45, platform.y + 25);
    }
    for (const platform of game.movingPlatforms) {
        ctx.fillStyle = "rgba(35, 91, 104, .25)";
        ctx.beginPath();
        ctx.ellipse(platform.x + platform.w / 2, platform.y + 13, platform.w / 2, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        drawBridge(ctx, { x: platform.x, y: platform.y, w: platform.w });
    }
}

function drawBridge(ctx, platform) {
    ctx.strokeStyle = "#815534";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(platform.x, platform.y - 8);
    ctx.quadraticCurveTo(platform.x + platform.w / 2, platform.y + 7, platform.x + platform.w, platform.y - 8);
    ctx.stroke();
    for (let x = platform.x; x < platform.x + platform.w; x += 12) {
        const sag = Math.sin(((x - platform.x) / platform.w) * Math.PI) * 7;
        ctx.fillStyle = "#c98a4f";
        ctx.fillRect(x, platform.y - 5 + sag, 10, 8);
        ctx.strokeStyle = "#815534";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, platform.y - 5 + sag, 10, 8);
    }
}

function drawTree(ctx, x, groundY, scale) {
    ctx.save();
    ctx.translate(x, groundY);
    ctx.scale(scale, scale);
    ctx.fillStyle = "#80563a";
    ctx.fillRect(-3, -18, 7, 20);
    ctx.fillStyle = "#3e9363";
    ctx.beginPath();
    ctx.arc(-5, -24, 10, 0, Math.PI * 2);
    ctx.arc(5, -29, 11, 0, Math.PI * 2);
    ctx.arc(0, -37, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#70c878";
    ctx.beginPath();
    ctx.arc(-3, -36, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawFlower(ctx, x, y, color) {
    ctx.strokeStyle = "#438c4c";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 9);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x - 3, y - 10, 3, 0, Math.PI * 2);
    ctx.arc(x + 3, y - 10, 3, 0, Math.PI * 2);
    ctx.arc(x, y - 13, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f3ba32";
    ctx.beginPath();
    ctx.arc(x, y - 10, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawRock(ctx, x, y, scale) {
    ctx.fillStyle = "#7e9cad";
    ctx.beginPath();
    ctx.ellipse(x, y, 10 * scale, 6 * scale, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#c4d6db";
    ctx.beginPath();
    ctx.ellipse(x - 3 * scale, y - 2 * scale, 4 * scale, 2 * scale, -0.15, 0, Math.PI * 2);
    ctx.fill();
}

function drawCave(ctx, x, y) {
    ctx.fillStyle = "#3d4758";
    ctx.beginPath();
    ctx.ellipse(x, y, 19, 20, 0, Math.PI, 0);
    ctx.lineTo(x + 19, y + 10);
    ctx.lineTo(x - 19, y + 10);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#705341";
    ctx.fillRect(x - 20, y + 8, 40, 4);
}

function drawStars(ctx, now) {
    for (const star of game.stars) {
        if (star.collected) continue;
        const pulse = 1 + Math.sin(now * 4 + star.x) * 0.1;
        ctx.save();
        ctx.translate(star.x, star.y);
        ctx.rotate(now * 0.45);
        ctx.scale(pulse, pulse);
        drawStarShape(ctx, 0, 0, 16, "#ffe16a");
        ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,.7)";
        ctx.beginPath();
        ctx.arc(star.x + 17, star.y - 13, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawCoins(ctx, now) {
    for (const coin of game.coins) {
        if (coin.collected) continue;
        const pulse = 1 + Math.sin(now * 5 + coin.x) * 0.08;
        ctx.save();
        ctx.translate(coin.x, coin.y);
        ctx.scale(pulse, 1);
        ctx.fillStyle = "#ffc83d";
        ctx.strokeStyle = "#e08a25";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(0, 0, 8, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff2a1";
        ctx.fillRect(-1, -6, 2, 12);
        ctx.restore();
    }
}

function drawParticles(ctx) {
    for (const particle of game.particles) {
        ctx.globalAlpha = Math.min(1, particle.life / 18);
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function drawStarShape(ctx, x, y, radius, color) {
    ctx.beginPath();
    for (let point = 0; point < 10; point++) {
        const angle = -Math.PI / 2 + point * Math.PI / 5;
        const size = point % 2 === 0 ? radius : radius * 0.46;
        const px = x + Math.cos(angle) * size;
        const py = y + Math.sin(angle) * size;
        if (point === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.strokeStyle = "#c98f22";
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();
}

function drawHazards(ctx, now) {
    for (const hazard of game.hazards) {
        ctx.fillStyle = "#f28c38";
        ctx.beginPath();
        ctx.ellipse(hazard.x + hazard.w / 2, hazard.y + 18 + Math.sin(now * 5) * 2, hazard.w / 2, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#a85135";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#263653";
        ctx.beginPath();
        ctx.arc(hazard.x + 13, hazard.y + 17, 2, 0, Math.PI * 2);
        ctx.arc(hazard.x + 25, hazard.y + 17, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#a85135";
        ctx.beginPath();
        ctx.moveTo(hazard.x + 8, hazard.y + 4);
        ctx.lineTo(hazard.x + 4, hazard.y - 4);
        ctx.moveTo(hazard.x + 30, hazard.y + 4);
        ctx.lineTo(hazard.x + 35, hazard.y - 4);
        ctx.stroke();
    }
}

function drawFinishFlag(ctx) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(1430, 209, 5, 73);
    ctx.fillStyle = "#f28c38";
    ctx.beginPath();
    ctx.moveTo(1435, 211);
    ctx.lineTo(1474, 223);
    ctx.lineTo(1435, 237);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,225,106,.55)";
    ctx.beginPath();
    ctx.arc(1435, 250, 33, 0, Math.PI * 2);
    ctx.fill();
}
