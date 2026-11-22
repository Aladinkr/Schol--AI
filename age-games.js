// Teens and adults get different GAMES (kids keep the Zippy platformer in gravity-game.js).
(() => {
    const baseStart = startAdventure;
    startAdventure = () => {
        const level = currentLevel();
        return level === "teen" ? teenGame() : level === "adult" ? adultGame() : baseStart();
    };

    const $ = selector => document.querySelector(selector);
    let fails = 0;

    function shell(body) {
        stopGameLoop();
        stopMusic();
        game.phase = "age";
        lesson.className = "lesson-section adventure-screen learning-screen";
        lesson.innerHTML = `<button class="back-link" type="button" data-action="levels">← Science map</button><section class="learning-panel">${body}</section>`;
    }

    function ask(title, text, options, correct, why, done) {
        shell(`<h1>${title}</h1><p>${text}</p><div class="learning-answers">${options.map((o, i) => `<button type="button" class="learning-answer" data-i="${i}">${o}</button>`).join("")}</div><div id="msg"></div>`);
        lesson.querySelectorAll("[data-i]").forEach(button => {
            button.onclick = () => {
                if (Number(button.dataset.i) === correct) return done();
                fails++;
                $("#msg").innerHTML = `<div class="friendly-hint"><span>Not quite. ${why}</span></div>`;
            };
        });
    }

    function finish(line) {
        const stars = fails === 0 ? 3 : fails <= 2 ? 2 : 1;
        [1, 2, 3].forEach(m => { game.progress.missionStars[m] = Math.max(game.progress.missionStars[m], stars); });
        saveProgress();
        shell(`<img class="reward-zippy" src="assets/zippy-celebrate.png" alt=""><p class="small-title">LEVEL COMPLETE</p><h1>${"★".repeat(stars)}${"☆".repeat(3 - stars)}</h1><p class="learning-explanation">${line}</p><button class="primary-game-button" type="button" data-action="levels">Back to the science map →</button>`);
    }

    // ---------- TEEN: basketball on other worlds ----------
    const PLANETS = { Earth: 9.8, Moon: 1.6, Mars: 3.7 };
    const X0 = 40, Y0 = 270, HX = 390, HY = 210;

    function path(g, v, angle) {
        const points = [];
        for (let t = 0; t < 40; t += 1 / 30) {
            const x = X0 + v * Math.cos(angle) * t * 10;
            const y = Y0 - (v * Math.sin(angle) * t - 0.5 * g * t * t) * 10;
            if ((y > Y0 && t > 0) || x > 600) break;
            points.push({ x, y });
        }
        return points;
    }

    function teenGame(planet = "Earth", scored = {}) {
        fails = fails || 0;
        const tabs = Object.keys(PLANETS).map(p => `<button type="button" class="learning-answer" data-planet="${p}">${scored[p] ? "✅" : p === planet ? "▶" : "○"} ${p} · g = ${PLANETS[p]}</button>`).join("");
        shell(`<p class="small-title">TEEN LAB · HOOPS ON OTHER WORLDS</p><h1>Sink a shot on every world</h1>
            <p>Same ball, same hoop. Tune the angle and power, then see what changes when gravity does.</p>
            <div class="learning-answers">${tabs}</div>
            <canvas id="hoop" width="600" height="300" style="width:100%;max-width:600px;background:#e8f3ff;border-radius:14px"></canvas>
            <p>Angle <b id="av">45</b>° <input id="ang" type="range" min="20" max="75" value="45"> Power <b id="pv">15</b> <input id="pow" type="range" min="5" max="25" value="15"></p>
            <button class="primary-game-button" type="button" id="shoot">Shoot 🏀</button>
            <div class="friendly-hint" id="msg" role="status"><span>Pick a world and take your shot. Scoring on ${planet} first? Try 45° and adjust the power.</span></div>`);
        const ctx = $("#hoop").getContext("2d");
        const draw = trail => {
            ctx.clearRect(0, 0, 600, 300);
            ctx.fillStyle = "#7fcf8b"; ctx.fillRect(0, Y0, 600, 30);
            ctx.fillStyle = "#c98a4f"; ctx.fillRect(HX + 22, HY - 40, 6, 40 + 60);
            ctx.strokeStyle = "#e05b53"; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(HX - 20, HY); ctx.lineTo(HX + 22, HY); ctx.stroke();
            ctx.fillStyle = "rgba(52,120,229,.35)";
            trail.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill(); });
            const last = trail[trail.length - 1] || { x: X0, y: Y0 };
            ctx.font = "26px serif"; ctx.fillText("🏀", last.x - 13, last.y + 9);
        };
        draw([]);
        $("#ang").oninput = () => { $("#av").textContent = $("#ang").value; };
        $("#pow").oninput = () => { $("#pv").textContent = $("#pow").value; };
        lesson.querySelectorAll("[data-planet]").forEach(b => { b.onclick = () => teenGame(b.dataset.planet, scored); });
        $("#shoot").onclick = () => {
            $("#shoot").disabled = true;
            const points = path(PLANETS[planet], Number($("#pow").value), $("#ang").value * Math.PI / 180);
            let i = 0;
            const step = () => {
                i = Math.min(i + 1, points.length);
                draw(points.slice(0, i));
                if (i < points.length) return requestAnimationFrame(step);
                $("#shoot").disabled = false;
                const hit = points.some(p => Math.hypot(p.x - HX, p.y - HY) < 20);
                const land = points[points.length - 1] || { x: X0 };
                if (hit) {
                    scored[planet] = true;
                    if (Object.keys(PLANETS).every(p => scored[p])) return teenQuiz();
                    $("#msg").innerHTML = `<span>🎯 Swish on ${planet}! Now try another world.</span>`;
                } else {
                    fails++;
                    const hint = land.x < HX
                        ? "Too short. Add power or tilt the angle toward 45°."
                        : planet === "Earth" ? "Too far. Use a little less power." : `Too far! With weaker gravity on ${planet}, the ball stays in the air longer. Use less power.`;
                    $("#msg").innerHTML = `<span>${hint}</span>`;
                }
            };
            step();
        };
    }

    function teenQuiz() {
        ask("Why did the Moon shot need less power?",
            "You used the same ball and the same hoop on all three worlds.",
            ["Gravity pulls less on the Moon, so the ball keeps flying longer before it comes down",
             "The ball weighs less on the Moon, so it moves faster",
             "Gravity is switched off on the Moon"],
            0, "The ball is the same, so think about what pulls it down.",
            () => finish("Gravity is the pull that bends every shot back down. A weaker pull means a longer, flatter flight, which is why Moon basketball is so different."));
    }

    // ---------- ADULT: site safety inspector ----------
    function adultGame() {
        fails = 0;
        shell(`<p class="small-title">ADULT · SITE SAFETY INSPECTOR</p><h1>The scaffold rule</h1>
            <p>A hammer slips off scaffolding. The site's hard hats are rated for impacts up to <b>50 km/h</b> (illustrative figure). Set the highest platform height where a falling tool is still within that rating. Air drag is ignored.</p>
            <p>Height <b id="hv">20</b> m <input id="h" type="range" min="2" max="60" value="20"></p>
            <div class="friendly-hint" id="ro"></div>
            <button class="primary-game-button" type="button" id="ok">Set this height limit</button><div id="msg"></div>`);
        const calc = h => { const t = Math.sqrt(2 * h / 9.8); return { t, kmh: 9.8 * t * 3.6 }; };
        const show = () => {
            const h = Number($("#h").value), r = calc(h);
            $("#hv").textContent = h;
            $("#ro").innerHTML = `<span>Fall time <b>${r.t.toFixed(1)} s</b> · Impact speed <b>${r.kmh.toFixed(0)} km/h</b></span>`;
        };
        $("#h").oninput = show;
        show();
        $("#ok").onclick = () => {
            const h = Number($("#h").value), r = calc(h);
            if (h >= 8.5 && h <= 11.5) return ask("Heavier tool, same drop",
                "A 5 kg sledgehammer slips from the same height. Compared with the 1 kg hammer, what happens?",
                ["It hits at the same speed, but with much more energy", "It hits about 5× faster", "It hits slower, because heavy things resist falling"],
                0, "Gravity speeds up every object equally; it does not care about mass.",
                () => ask("The 'double it' rule",
                    "A manager wants to double the limit, from 10 m to 20 m. The impact speed becomes about...",
                    ["2× higher (about 100 km/h)", "1.4× higher (about 71 km/h)", "4× higher (about 200 km/h)"],
                    1, "Speed grows with the square root of the height, not in proportion to it.",
                    () => finish("Real sites use tethers and exclusion zones because impact speed rises with height, and a heavier tool carries far more energy at the same speed.")));
            fails++;
            $("#msg").innerHTML = `<div class="friendly-hint"><span>${r.kmh > 50 ? `At ${h} m impact is ${r.kmh.toFixed(0)} km/h, above the rating.` : `At ${h} m impact is only ${r.kmh.toFixed(0)} km/h. Safe, but you can go higher.`} Move the slider until impact is close to 50 km/h.</span></div>`;
        };
    }
})();