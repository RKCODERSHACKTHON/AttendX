// 1. DATA LOADING
const currentUser = JSON.parse(localStorage.getItem('attendx_current_user'));

if (!currentUser) {
    window.location.href = '../login.html';
}

// Set UI Data
document.getElementById('welcomeName').innerText = currentUser.name || 'Student';
document.getElementById('headerAvatar').innerText = (currentUser.name || 'S').charAt(0).toUpperCase();
document.getElementById('pNameHeader').innerText = currentUser.name;
document.getElementById('pEmail').innerText = currentUser.email || 'N/A';
document.getElementById('pId').innerText = currentUser.uniqueId;
document.getElementById('profileAvatarLarge').innerText = (currentUser.name || 'S').charAt(0).toUpperCase();

// 2. PAGE NAVIGATION
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.footer-item').forEach(f => f.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    event.currentTarget.classList.add('active');

    // Stop camera if leaving scan page
    if (pageId !== 'scan') stopCamera();
}

// 3. CAMERA & QR LOGIC
const video = document.getElementById('cameraPreview');
const canvas = document.getElementById('qrCanvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const statusText = document.getElementById('scanStatus');
const startBtn = document.getElementById('startScanBtn');
let stream = null;
let animationId = null;

async function startCamera() {
    try {
        statusText.innerText = "Accessing camera...";
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" } 
        });
        video.srcObject = stream;
        startBtn.style.display = 'none';
        statusText.innerText = "Scanning for QR code...";
        animationId = requestAnimationFrame(tick);
    } catch (err) {
        statusText.innerText = "Error: Camera not found or denied.";
    }
}

function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    if (animationId) cancelAnimationFrame(animationId);
    video.srcObject = null;
    startBtn.style.display = 'block';
    statusText.innerText = "";
}

function tick() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
            handleScanSuccess(code.data);
            return; // Stop scanning
        }
    }
    animationId = requestAnimationFrame(tick);
}

function handleScanSuccess(data) {
    // 1. Stop the camera immediately to save resources
    stopCamera();

    // 2. Immediate Visual Feedback
    statusText.style.color = "#10b981";
    statusText.innerText = "✅ Attendance Marked!";
    
    // 3. (Optional) Vibrate mobile device for haptic feedback
    if (window.navigator.vibrate) {
        window.navigator.vibrate(100);
    }

    console.log("QR Data detected:", data);

    // 4. Faster Redirect (500ms is standard for "snappy" UI)
    setTimeout(() => {
        // Reset status for next time
        statusText.style.color = "";
        statusText.innerText = "";
        
        // Switch page instantly
        switchPage('dashboard');
    }, 500); 
}

function handleLogout() {
    // This removes the user session AND any cached data
    localStorage.clear(); 
    window.location.href = '../index.html';
}

// Listeners
startBtn.addEventListener('click', startCamera);
document.getElementById('closeCamera').addEventListener('click', stopCamera);