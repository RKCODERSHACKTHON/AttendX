// 1. DATA INITIALIZATION
const currentUser = JSON.parse(localStorage.getItem('attendx_current_user'));

if (!currentUser) {
    window.location.href = '../login.html';
} else {
    const initials = currentUser.name.charAt(0).toUpperCase();
    const firstName = currentUser.name.split(' ')[0];

    // Dynamic Header & Welcome
    if(document.getElementById('headerAvatar')) document.getElementById('headerAvatar').innerText = initials;
    if(document.getElementById('welcomeText')) document.getElementById('welcomeText').innerText = `Hello, Prof. ${firstName}! 👋`;
    
    // Profile Data
    if(document.getElementById('pName')) {
        document.getElementById('pName').innerText = currentUser.name;
        document.getElementById('pEmail').innerText = currentUser.email;
        document.getElementById('pId').innerText = currentUser.uniqueId;
        document.getElementById('pAvatar').innerText = initials;
    }
}

// 2. NAVIGATION LOGIC
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.footer-item').forEach(f => f.classList.remove('active'));
    
    document.getElementById(pageId).classList.add('active');
    
    // Update footer selection based on active page
    const footerItems = document.querySelectorAll('.footer-item');
    if(pageId === 'dashboard') footerItems[0].classList.add('active');
    if(pageId === 'qr-session') footerItems[1].classList.add('active');
    if(pageId === 'profile') footerItems[2].classList.add('active');
}

// 3. QR LOGIC
let timerInterval;
const startBtn = document.getElementById("startSessionBtn");
const endBtn = document.getElementById("endSessionBtn");
const setupForm = document.getElementById("setupForm");
const qrBox = document.getElementById("qrBox");

startBtn.addEventListener("click", () => {
    const subject = document.getElementById("subjectInput").value;
    const duration = parseInt(document.getElementById("durationSelect").value);

    if (!subject) {
        alert("Please enter a subject name");
        return;
    }

    const qrData = JSON.stringify({
        subject: subject,
        teacher: currentUser.name,
        expires: Date.now() + (duration * 1000)
    });

    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 180,
        height: 180,
        colorDark : "#1e293b",
        colorLight : "#ffffff"
    });

    document.getElementById("activeSubject").innerText = subject;
    setupForm.style.display = "none";
    qrBox.style.display = "block";
    
    startTimer(duration);
});

function startTimer(seconds) {
    let timeLeft = seconds;
    const timerEl = document.getElementById("timer");
    timerEl.innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) endSession();
    }, 1000);
}

function endSession() {
    clearInterval(timerInterval);
    qrBox.style.display = "none";
    setupForm.style.display = "block";
}

endBtn.addEventListener("click", endSession);

function handleLogout() {
    localStorage.clear();
    window.location.href = '../index.html';
}