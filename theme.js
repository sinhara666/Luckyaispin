// theme.js - Universal Multi-Theme Engine

let currentRotation = 0;
let isSpinning = false;

function initWheel(canvasId, btnId, themeData) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById(btnId);

    // Dynamic rendering layout using the theme color inputs passed by the page
    function draw() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(currentRotation);

        const radii = [270, 185, 100]; 
        const angleStep = Math.PI / 2;
        const baseOffset = -Math.PI / 2;

        // 1. Outer Ring
        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.arc(0, 0, radii[0], baseOffset + (i * angleStep), baseOffset + ((i + 1) * angleStep));
            ctx.fillStyle = themeData.outer[i]; ctx.fill();
        }
        // 2. Middle Ring
        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.arc(0, 0, radii[1], baseOffset + (i * angleStep), baseOffset + ((i + 1) * angleStep));
            ctx.fillStyle = themeData.middle[i]; ctx.fill();
        }
        // 3. Inner Ring (Features the Gold or custom accent segment at index 0)
        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.arc(0, 0, radii[2], baseOffset + (i * angleStep), baseOffset + ((i + 1) * angleStep));
            ctx.fillStyle = themeData.inner[i]; ctx.fill();
        }

        // Section Dividers using theme border selection
        ctx.strokeStyle = themeData.borders || '#15161c';
        ctx.lineWidth = 5;
        radii.forEach(r => { ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke(); });

        for (let i = 0; i < 4; i++) {
            ctx.beginPath(); ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(baseOffset + i * angleStep) * radii[0], Math.sin(baseOffset + i * angleStep) * radii[0]);
            ctx.stroke();
        }

        // Center Hub Accent Ball
        ctx.beginPath(); ctx.arc(0, 0, 32, 0, Math.PI * 2);
        ctx.fillStyle = themeData.centerBall || '#f4c742'; ctx.fill();
        ctx.restore();
    }

    window.spinWheel = function() {
        if (isSpinning) return;
        isSpinning = true;
        if (spinBtn) spinBtn.disabled = true;

        const extraDegrees = Math.random() * (2 * Math.PI);
        const totalTargetRotation = currentRotation + (Math.PI * 2 * 5) + extraDegrees;
        const duration = 4000;
        const startTimestamp = performance.now();

        function animate(now) {
            const elapsed = now - startTimestamp;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuad = 1 - (1 - progress) * (1 - progress);

            currentRotation = currentRotation + (totalTargetRotation - currentRotation) * (easeOutQuad * progress);
            draw();

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentRotation = totalTargetRotation % (Math.PI * 2);
                isSpinning = false;
                if (spinBtn) spinBtn.disabled = false;
            }
        }
        requestAnimationFrame(animate);
    };

    draw();
}

