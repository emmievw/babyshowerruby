// ===== Mobile Nav Toggle =====
document.querySelector('.nav-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

// Close mobile nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ===== Countdown Timer =====
function updateCountdown() {
    const target = new Date('2026-07-03T16:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
        document.getElementById('countdown').innerHTML = '<p style="font-size:1.3rem; color: var(--blue-primary);">Het is zover! 🎉</p>';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== RSVP Form =====
const rsvpForm = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');

rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('rsvp-name').value;
    const attending = document.getElementById('rsvp-attending').value;
    const diet = document.getElementById('rsvp-diet').value;

    // Store in localStorage
    const rsvpData = JSON.parse(localStorage.getItem('babyshower-rsvp') || '[]');
    rsvpData.push({ name, attending, diet, timestamp: new Date().toISOString() });
    localStorage.setItem('babyshower-rsvp', JSON.stringify(rsvpData));

    // Show success
    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
});

// Check if already RSVP'd
const existingRsvp = JSON.parse(localStorage.getItem('babyshower-rsvp') || '[]');
if (existingRsvp.length > 0) {
    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
}

// ===== Quiz =====
const questions = [
    {
        type: 'multiple',
        forWho: 'Vraag voor iedereen',
        question: 'Hoe lang zijn Ruby en Tobias al samen?',
        options: ['2 jaar', '4 jaar', '6 jaar', '8 jaar'],
        correct: 1
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor iedereen',
        question: 'Wat wordt het? 👶',
        options: ['Een meisje 🎀', 'Een jongetje 💙', 'Een tweeling 👯', 'Het is nog een verrassing'],
        correct: 1
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor iedereen',
        question: 'Hoe denk je dat de baby gaat heten? 🤔',
        options: ['Ruben', 'Tobey', 'Roan', 'Tygo'],
        correct: null
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor Ruby',
        question: 'Wat is je guilty pleasure snack tijdens de zwangerschap?',
        options: ['Augurken met pindakaas', 'Nutella uit de pot', 'Zure matjes', 'Chips met ijs'],
        correct: 1
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor iedereen',
        question: 'Wie gaat er het vaakst oppassen denk je?',
        options: ['Oma', 'Opa', 'Tante Francis', 'Oom Rutger'],
        correct: 2
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor Tobias',
        question: 'Wat gaat jouw signature move als vader worden?',
        options: ['De baby overal mee naartoe nemen', 'Matching outfits', 'Elke dag 100 foto\'s maken', 'Alles baby-proofen wat niet nodig is'],
        correct: 2
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor Tobias',
        question: 'Gaat de kleine later Rocket League leuk vinden? 🚗⚽',
        options: ['Sowieso, dat zit in de genen', 'Nee, hij wordt een FIFA-kind', 'Alleen als ie bij papa op schoot mag', 'Hij gaat het haten (sorry Tobias)'],
        correct: 0
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor Tobias',
        question: 'Van welke voetbalclub wordt de baby later fan? ⚽',
        options: ['Ajax', 'Feyenoord', 'PSV', 'AZ'],
        correct: null
    },
    {
        type: 'multiple',
        forWho: 'Vraag voor Rutger & Francis',
        question: 'Wat gaan jullie de baby als eerste leren?',
        options: ['\"Oom Rutger\" zeggen', 'High-fives geven', 'Een slechte grap', 'Hoe je ouders om je vinger windt'],
        correct: 3
    },
    {
        type: 'open',
        forWho: 'Vraag voor iedereen',
        question: 'Geef Ruby & Tobias je beste (of slechtste) opvoedtip! 😂',
        answer: null
    }
];

let currentQuestion = 0;
let score = 0;
let quizAnswers = [];

function startQuiz() {
    currentQuestion = 0;
    score = 0;
    quizAnswers = [];
    document.getElementById('quiz-container').hidden = false;
    document.getElementById('quiz-result').hidden = true;
    showQuestion();
}

function showQuestion() {
    const q = questions[currentQuestion];
    const questionEl = document.getElementById('quiz-question');
    const optionsEl = document.getElementById('quiz-options');
    const nextBtn = document.getElementById('quiz-next');
    const progressText = document.getElementById('quiz-progress-text');
    const progressFill = document.getElementById('quiz-progress-fill');

    progressText.textContent = `Vraag ${currentQuestion + 1} van ${questions.length}`;
    progressFill.style.width = `${((currentQuestion) / questions.length) * 100}%`;

    questionEl.innerHTML = `<span class="quiz-for-who">${q.forWho}</span>${q.question}`;
    optionsEl.innerHTML = '';
    nextBtn.hidden = true;

    if (q.type === 'multiple') {
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.addEventListener('click', () => selectOption(i));
            optionsEl.appendChild(btn);
        });
    } else if (q.type === 'open') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'quiz-input';
        input.placeholder = 'Typ je antwoord...';
        input.id = 'quiz-open-input';
        optionsEl.appendChild(input);

        const submitBtn = document.createElement('button');
        submitBtn.className = 'quiz-submit-btn';
        submitBtn.textContent = 'Bevestig';
        submitBtn.addEventListener('click', () => submitOpenAnswer());
        optionsEl.appendChild(submitBtn);

        // Allow Enter key
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') submitOpenAnswer();
        });
    }
}

function selectOption(index) {
    const q = questions[currentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const nextBtn = document.getElementById('quiz-next');

    // Disable all options
    options.forEach((opt, i) => {
        opt.style.pointerEvents = 'none';
        if (q.correct !== null && i === q.correct) opt.classList.add('correct');
        if (q.correct !== null && i === index && i !== q.correct) opt.classList.add('wrong');
        if (i === index) opt.classList.add('selected');
    });

    if (q.correct !== null && index === q.correct) score++;
    quizAnswers.push({ question: q.question, answer: q.options[index] });

    nextBtn.hidden = false;
}

function submitOpenAnswer() {
    const input = document.getElementById('quiz-open-input');
    const answer = input.value.trim();
    if (!answer) return;

    const q = questions[currentQuestion];
    quizAnswers.push({ question: q.question, answer: answer });

    // Show confirmation
    const optionsEl = document.getElementById('quiz-options');
    optionsEl.innerHTML = `<div class="quiz-answer-reveal">Je antwoord: <strong>${answer}</strong> — opgeslagen! 👍</div>`;

    document.getElementById('quiz-next').hidden = false;
}

document.getElementById('quiz-next').addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        showResult();
    } else {
        showQuestion();
    }
});

function showResult() {
    document.getElementById('quiz-container').hidden = true;
    const resultEl = document.getElementById('quiz-result');
    resultEl.hidden = false;

    const multipleCount = questions.filter(q => q.type === 'multiple' && q.correct !== null).length;
    document.getElementById('quiz-score').textContent = `${score} / ${multipleCount} goed!`;

    let message;
    if (score === multipleCount) {
        message = 'Perfect! Jij kent Ruby & Tobias door en door! 🏆';
    } else if (score >= multipleCount / 2) {
        message = 'Netjes! Je weet al aardig wat over de aanstaande ouders 👏';
    } else {
        message = 'Hmm, misschien moet je wat vaker langsgaan bij Ruby & Tobias 😄';
    }
    document.getElementById('quiz-message').textContent = message;

    // Build overview of all answers
    let overviewHtml = '<div class="quiz-overview"><h3>Overzicht</h3>';
    quizAnswers.forEach((item, i) => {
        const q = questions[i];
        const correctAnswer = (q.type === 'multiple' && q.correct !== null) ? q.options[q.correct] : null;
        const isCorrect = correctAnswer && item.answer === correctAnswer;
        const icon = correctAnswer ? (isCorrect ? '✓' : '✗') : '💬';
        
        overviewHtml += `<div class="quiz-overview-item ${correctAnswer ? (isCorrect ? 'correct' : 'wrong') : ''}">`;
        overviewHtml += `<span class="quiz-overview-icon">${icon}</span>`;
        overviewHtml += `<div class="quiz-overview-content">`;
        overviewHtml += `<p class="quiz-overview-q"><strong>${q.forWho}:</strong> ${item.question}</p>`;
        overviewHtml += `<p class="quiz-overview-a">Antwoord: ${item.answer}</p>`;
        if (correctAnswer && !isCorrect) {
            overviewHtml += `<p class="quiz-overview-correct">Juiste antwoord: ${correctAnswer}</p>`;
        }
        overviewHtml += `</div></div>`;
    });
    overviewHtml += '</div>';
    
    document.getElementById('quiz-overview-container').innerHTML = overviewHtml;

    // Store quiz answers
    localStorage.setItem('babyshower-quiz', JSON.stringify(quizAnswers));

    // Update progress bar
    document.getElementById('quiz-progress-fill').style.width = '100%';
}

// Start quiz on page load
startQuiz();

// ===== Page Navigation =====
function navigateTo(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show target page
    const target = document.querySelector(`[data-page="${pageId}"]`);
    if (target) {
        target.classList.add('active');
    }

    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${pageId}`) {
            link.classList.add('active');
        }
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const pageId = this.getAttribute('href').substring(1);
        navigateTo(pageId);
    });
});

// Set Home as active on load
document.querySelector('.nav-links a[href="#home"]').classList.add('active');
