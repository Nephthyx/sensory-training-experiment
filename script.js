// Variables to store state
let currentStage = 'intro'; // The current stage (intro, pre-feedback, feedback, post-feedback, results)
let feedbackType = ''; // The feedback type selected by the participant
let participantID = ''; // The optional participant ID

// Variables for timing and accuracy
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let startTime;
let endTime;
let points = []; // To store points for accuracy calculation

// Canvas and context
const canvas = document.getElementById('experiment-canvas');
const ctx = canvas.getContext('2d');

// Tone.js synth for auditory feedback
const synth = new Tone.Synth().toDestination();

// Function to initialize the experiment (show intro screen)
function showIntro() {
    document.getElementById('experiment-screen').classList.add('hidden');
    document.getElementById('thank-you').classList.add('hidden');
    document.getElementById('results-screen').classList.add('hidden');
    currentStage = 'intro';
}

// Function to start the experiment
function startExperiment() {
    alert('Start Experiment button clicked!'); // Debugging log
    participantID = document.getElementById('participant-id').value;
    feedbackType = document.getElementById('feedback-type').value;

    alert(`Participant ID: ${participantID}, Feedback Type: ${feedbackType}`); // Debugging log

    // Hide start screen and show the experiment screen
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('experiment-screen').classList.remove('hidden');
    currentStage = 'pre-feedback'; // Move to pre-feedback stage
}

// Function to move to the feedback stage
function startFeedbackStage() {
    alert('Starting Feedback Stage'); // Debugging log
    currentStage = 'feedback';

    // Add feedback-specific instructions
    if (feedbackType === 'visual') {
        drawPath(); // Visual feedback
    } else if (feedbackType === 'auditory') {
        playPathSequence(); // Auditory feedback
    }
}

// Function to finish the experiment
function finishExperiment() {
    alert('Finishing Experiment'); // Debugging log
    currentStage = 'results';

    document.getElementById('experiment-screen').classList.add('hidden');
    document.getElementById('thank-you').classList.remove('hidden');
}

// Placeholder: Drawing a pentagon path on the canvas
function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw a pentagon
    const points = 5;
    const radius = 100;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

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
    ctx.stroke(); // Render the path
}

// Function to start drawing (triggered by pointerdown)
function startDrawing(e) {
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    startTime = new Date(); // Start timing for speed calculation

    points.push({ x: lastX, y: lastY }); // Store the starting point
}

// Function to draw on the canvas
function draw(e) {
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

// Function to stop drawing (triggered by pointerup or pointerleave)
function stopDrawing() {
    if (!isDrawing) return;
    isDrawing = false;

    endTime = new Date();
    const timeTaken = (endTime - startTime) / 1000; // Time in seconds

    // Call function to calculate and store the results
    calculateResults(points, timeTaken);
}

// Function to calculate results (accuracy and speed)
function calculateResults(points, timeTaken) {
    // Placeholder for accuracy and speed calculation
    let accuracy = 0; // Replace with actual calculation
    let speed = timeTaken;

    alert(`Accuracy: ${accuracy}, Speed: ${speed}`); // Debugging log

    displayResults(accuracy, speed);
}

// Function to display results on the results screen
function displayResults(accuracy, speed) {
    const results = {
        participantID: participantID,
        feedbackType: feedbackType,
        accuracy: accuracy.toFixed(3), // Use at least 3 decimal places
        speed: speed.toFixed(3),
    };

    document.getElementById('results-display').textContent = JSON.stringify(results, null, 2);
}

// Create a synth to generate sound
function playNote(note, duration) {
    synth.triggerAttackRelease(note, duration);
}

// Function to play the sequence of notes for auditory feedback
function playPathSequence() {
    const notes = ['C4', 'D4', 'E4', 'F4', 'G4'];
    const duration = '0.5';

    notes.forEach((note, index) => {
        Tone.Transport.scheduleOnce(() => {
            playNote(note, duration);
        }, index);
    });

    Tone.Transport.start();
}

// Event listeners
document.getElementById('start-button').addEventListener('touchstart', startExperiment);
document.getElementById('start-trial').addEventListener('click', startFeedbackStage);
document.getElementById('view-results').addEventListener('click', finishExperiment);

// Event listeners for canvas drawing
canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointerleave', stopDrawing);

// Call showIntro to initialize the page correctly
showIntro();
