// Variables to store state
let feedbackType = '';
let participantID = '';
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let points = [];
let shapeDrawn = false; // To track whether the bottom shape has been removed
let startTime, endTime;

// Canvas and context
const topCanvas = document.getElementById('top-canvas');
const topCtx = topCanvas.getContext('2d');
const bottomCanvas = document.getElementById('bottom-canvas');
const bottomCtx = bottomCanvas.getContext('2d');

// Prevent touch actions (like scrolling) on the canvas
topCanvas.addEventListener('touchstart', preventDefault, { passive: false });
topCanvas.addEventListener('touchmove', preventDefault, { passive: false });
bottomCanvas.addEventListener('touchstart', preventDefault, { passive: false });
bottomCanvas.addEventListener('touchmove', preventDefault, { passive: false });

function preventDefault(e) {
    e.preventDefault(); // Prevent the default behavior like scrolling
}

// Start Experiment
document.getElementById('start-button').addEventListener('click', function() {
    participantID = document.getElementById('participant-id').value;
    feedbackType = document.getElementById('feedback-type').value;

    // Hide start screen and show experiment screen
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('experiment-screen').classList.remove('hidden');

    // Draw the shape on both canvases
    drawShape(topCtx, false); // Dots only on top
    drawShape(bottomCtx, true); // Full shape on bottom
});

// Function to draw the shape (pentagon for example)
function drawShape(ctx, fullShape = true) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const points = 5;
    const radius = 100;
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;

    if (fullShape) {
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
            const angle = (2 * Math.PI / points) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();
    } else {
        // Draw dots at the vertices
        for (let i = 0; i < points; i++) {
            const angle = (2 * Math.PI / points) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

// Handle drawing on the bottom canvas (mirror task)
bottomCanvas.addEventListener('pointerdown', (e) => {
    if (!shapeDrawn) {
        startDrawing(e, bottomCanvas, bottomCtx);
        // Remove bottom shape after pen down
        shapeDrawn = true;
        bottomCtx.clearRect(0, 0, bottomCanvas.width, bottomCanvas.height);
    }
});

bottomCanvas.addEventListener('pointermove', (e) => {
    if (isDrawing) draw(e, bottomCanvas, bottomCtx);
});

bottomCanvas.addEventListener('pointerup', stopDrawing);
bottomCanvas.addEventListener('pointerleave', stopDrawing);

// Start drawing function
function startDrawing(e, canvas, ctx) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    startTime = new Date(); // Start time for speed calculation
}

// Drawing function
function draw(e, canvas, ctx) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    lastX = currentX;
    lastY = currentY;
    points.push({ x: currentX, y: currentY });
}

// Stop drawing function
function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;
    endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000;

    console.log(`Time taken: ${timeTaken} seconds`);
    // Add logic to calculate accuracy and speed
}

// Results and restart logic
document.getElementById('view-results').addEventListener('click', function() {
    const results = {
        participantID: participantID,
        feedbackType: feedbackType,
        time: (endTime - startTime) / 1000,
    };

    document.getElementById('results-display').textContent = JSON.stringify(results, null, 2);
});

document.getElementById('restart').addEventListener('click', function() {
    location.reload(); // Reload the page to restart
});
