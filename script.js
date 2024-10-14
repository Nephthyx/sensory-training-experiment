// Variables to store state
let currentStage = 'pre-feedback'; // The current stage (pre-feedback, feedback, post-feedback, etc.)
let feedbackType = ''; // The feedback type selected by the participant
let participantID = ''; // The optional participant ID

// Event listener for start button
document.getElementById('start-button').addEventListener('click', function() {
    participantID = document.getElementById('participant-id').value;
    feedbackType = document.getElementById('feedback-type').value;

    // Show instructions and canvas for the experiment
    document.getElementById('instructions').classList.remove('hidden');
});

// Placeholder: Drawing a pentagon path on the canvas
function drawPath() {
    const canvas = document.getElementById('experiment-canvas');
    const ctx = canvas.getContext('2d');

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

// Event listener to start the trial
document.getElementById('start-trial').addEventListener('click', function() {
    drawPath(); // Placeholder to draw the path when trial starts
    startTrial();
});

// Example function to start a trial
function startTrial() {
    // Logic for tracking the participant's attempt, using the Apple Pencil/mouse.
    console.log('Trial started for feedback type:', feedbackType);
    
    // Add logic for collecting speed and accuracy data here
}

// Placeholder for displaying results
document.getElementById('view-results').addEventListener('click', function() {
    const results = {
        participantID: participantID,
        feedbackType: feedbackType,
        accuracy: 0, // Placeholder for calculated accuracy
        speed: 0, // Placeholder for calculated speed
    };

    document.getElementById('results-display').textContent = JSON.stringify(results, null, 2);
});
