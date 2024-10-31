let startTime, intervalId;
let velocityX = 0, velocityY = 0, velocityZ = 0;
let distanceX = 0, distanceY = 0, distanceZ = 0;
let lastTimestamp;

const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const distanceDisplay = document.getElementById('distanceDisplay');
const errorDisplay = document.getElementById('errorDisplay');

function startMeasurement() {
    // Reset values
    velocityX = 0; velocityY = 0; velocityZ = 0;
    distanceX = 0; distanceY = 0; distanceZ = 0;
    lastTimestamp = null;

    // Start listening to accelerometer
    if (window.DeviceMotionEvent) {
        window.addEventListener('devicemotion', handleMotionEvent);
        startButton.disabled = true;
        stopButton.disabled = false;
        errorDisplay.textContent = '';
    } else {
        errorDisplay.textContent = 'Accelerometer not supported on this device.';
    }
}

function stopMeasurement() {
    // Stop listening to accelerometer
    window.removeEventListener('devicemotion', handleMotionEvent);
    startButton.disabled = false;
    stopButton.disabled = true;
}

function handleMotionEvent(event) {
    const acceleration = event.acceleration;
    const timestamp = event.timeStamp;

    // Ignore null accelerations
    if (!acceleration || !acceleration.x || !acceleration.y || !acceleration.z) return;

    if (lastTimestamp) {
        const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert ms to seconds

        // Integrate acceleration to velocity
        velocityX += acceleration.x * deltaTime;
        velocityY += acceleration.y * deltaTime;
        velocityZ += acceleration.z * deltaTime;

        // Integrate velocity to distance
        distanceX += velocityX * deltaTime;
        distanceY += velocityY * deltaTime;
        distanceZ += velocityZ * deltaTime;

        // Calculate total distance and update display
        const totalDistance = Math.sqrt(distanceX ** 2 + distanceY ** 2 + distanceZ ** 2);
        distanceDisplay.textContent = `Distance: ${totalDistance.toFixed(2)} m`;
    }

    lastTimestamp = timestamp;
}

startButton.addEventListener('click', startMeasurement);
stopButton.addEventListener('click', stopMeasurement);
