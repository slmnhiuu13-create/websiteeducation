/**
 * =========================================================
 * TJKT EDUCATION - QUIZ ENGINE
 * Manages timer, question renderer, scoring, and review modal.
 * =========================================================
 */

let quizQuestions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let quizTimerInterval = null;
let timeLeftSeconds = 600; // 10 minutes timer
let activeCategory = 'ALL';

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('quiz-app')) {
    loadQuizData();
  }
});

/**
 * Loads quiz data from JSON file.
 */
async function loadQuizData() {
  try {
    const res = await fetch('data/quiz.json');
    quizQuestions = await res.json();
    filterQuizQuestions('ALL');
  } catch (err) {
    console.error('Gagal memuat soal quiz:', err);
  }
}

/**
 * Filters questions by category ('ALL', 'TJKT', 'RPL').
 * @param {string} category 
 */
function filterQuizQuestions(category) {
  activeCategory = category;
  if (category === 'ALL') {
    filteredQuestions = [...quizQuestions];
  } else {
    filteredQuestions = quizQuestions.filter(q => q.category === category);
  }

  currentQuestionIndex = 0;
  userAnswers = new Array(filteredQuestions.length).fill(null);
  
  updateCategoryBtnActive(category);
  startQuizTimer();
  renderQuizQuestion();
}

function updateCategoryBtnActive(category) {
  document.querySelectorAll('.quiz-cat-btn').forEach(btn => {
    if (btn.dataset.cat === category) {
      btn.className = "quiz-cat-btn px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]";
    } else {
      btn.className = "quiz-cat-btn px-4 py-2 rounded-xl text-xs font-bold glass-card text-slate-300 hover:text-white";
    }
  });
}

/**
 * Starts the countdown timer.
 */
function startQuizTimer() {
  clearInterval(quizTimerInterval);
  timeLeftSeconds = 600; // Reset to 10 mins

  const timerEl = document.getElementById('quiz-timer');
  
  quizTimerInterval = setInterval(() => {
    timeLeftSeconds--;
    
    const mins = Math.floor(timeLeftSeconds / 60);
    const secs = timeLeftSeconds % 60;
    
    if (timerEl) {
      timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    if (timeLeftSeconds <= 0) {
      clearInterval(quizTimerInterval);
      finishQuiz();
    }
  }, 1000);
}

/**
 * Renders current question.
 */
function renderQuizQuestion() {
  if (filteredQuestions.length === 0) return;

  const q = filteredQuestions[currentQuestionIndex];
  
  // Progress Bar
  const progressPercent = ((currentQuestionIndex + 1) / filteredQuestions.length) * 100;
  const progressBar = document.getElementById('quiz-progress-bar');
  if (progressBar) progressBar.style.width = `${progressPercent}%`;

  // Question Info
  const qNum = document.getElementById('quiz-q-num');
  const qTotal = document.getElementById('quiz-q-total');
  const qText = document.getElementById('quiz-q-text');
  const qCat = document.getElementById('quiz-q-cat');

  if (qNum) qNum.textContent = currentQuestionIndex + 1;
  if (qTotal) qTotal.textContent = filteredQuestions.length;
  if (qText) qText.textContent = q.question;
  if (qCat) qCat.textContent = q.category;

  // Options List
  const optionsContainer = document.getElementById('quiz-options-container');
  if (optionsContainer) {
    optionsContainer.innerHTML = q.options.map((opt, idx) => {
      const isSelected = userAnswers[currentQuestionIndex] === idx;
      return `
        <div onclick="selectQuizAnswer(${idx})" class="p-4 rounded-xl glass-card cursor-pointer transition-all flex items-center justify-between ${isSelected ? 'border-cyan-400 bg-cyan-950/40 box-glow-cyan' : 'hover:border-slate-700'}">
          <span class="text-sm font-medium text-slate-200">${opt}</span>
          <div class="w-5 h-5 rounded-full border ${isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-700'} flex items-center justify-center">
            ${isSelected ? '<i class="fa-solid fa-check text-black text-xs"></i>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  // Prev / Next button state
  const prevBtn = document.getElementById('quiz-prev-btn');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (prevBtn) prevBtn.disabled = currentQuestionIndex === 0;
  if (nextBtn) {
    if (currentQuestionIndex === filteredQuestions.length - 1) {
      nextBtn.textContent = 'Selesai & Lihat Hasil';
      nextBtn.className = 'px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs hover:opacity-90 transition-all';
    } else {
      nextBtn.textContent = 'Selanjutnya';
      nextBtn.className = 'px-6 py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs hover:bg-cyan-300 transition-all';
    }
  }
}

/**
 * Saves selected answer.
 * @param {number} optionIndex 
 */
function selectQuizAnswer(optionIndex) {
  userAnswers[currentQuestionIndex] = optionIndex;
  renderQuizQuestion();
}

function prevQuizQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuizQuestion();
  }
}

function nextQuizQuestion() {
  if (currentQuestionIndex < filteredQuestions.length - 1) {
    currentQuestionIndex++;
    renderQuizQuestion();
  } else {
    finishQuiz();
  }
}

/**
 * Calculates score and displays modal.
 */
function finishQuiz() {
  clearInterval(quizTimerInterval);

  let correctCount = 0;
  userAnswers.forEach((ans, idx) => {
    if (ans === filteredQuestions[idx].answer) {
      correctCount++;
    }
  });

  const finalScore = Math.round((correctCount / filteredQuestions.length) * 100);

  // Save to LocalStorage
  if (typeof saveQuizResult === 'function') {
    saveQuizResult(finalScore, activeCategory);
  }

  // Render Result Modal
  const modal = document.getElementById('quiz-result-modal');
  const scoreText = document.getElementById('quiz-result-score');
  const correctText = document.getElementById('quiz-result-correct');
  const feedbackText = document.getElementById('quiz-result-feedback');

  if (scoreText) scoreText.textContent = finalScore;
  if (correctText) correctText.textContent = `${correctCount} dari ${filteredQuestions.length} Soal Benar`;

  if (feedbackText) {
    if (finalScore >= 80) {
      feedbackText.textContent = 'Luar Biasa! Pemahaman Anda tentang TJKT & RPL sangat matang!';
    } else if (finalScore >= 60) {
      feedbackText.textContent = 'Bagus! Anda sudah menguasai sebagian besar konsep dasar.';
    } else {
      feedbackText.textContent = 'Tetap Semangat! Pelajari kembali modul materi TJKT & RPL lalu coba lagi.';
    }
  }

  if (modal) modal.classList.remove('hidden');
}

/**
 * Renders review modal with answers and explanations.
 */
function showQuizReview() {
  const reviewContainer = document.getElementById('quiz-review-container');
  if (!reviewContainer) return;

  reviewContainer.innerHTML = filteredQuestions.map((q, idx) => {
    const userAns = userAnswers[idx];
    const isCorrect = userAns === q.answer;

    return `
      <div class="p-4 rounded-xl border ${isCorrect ? 'border-emerald-500/40 bg-emerald-950/20' : 'border-rose-500/40 bg-rose-950/20'} space-y-2 mb-4">
        <div class="flex items-center justify-between text-xs font-mono">
          <span class="text-slate-400">Soal ${idx + 1} (${q.category})</span>
          <span class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-bold">${isCorrect ? 'BENAR (+5 Poin)' : 'SALAH'}</span>
        </div>
        <h5 class="font-bold text-white text-sm">${q.question}</h5>
        <div class="text-xs space-y-1 pt-1">
          <div class="text-slate-300">Jawaban Anda: <strong class="${isCorrect ? 'text-emerald-400' : 'text-rose-400'}">${userAns !== null ? q.options[userAns] : 'Tidak dijawab'}</strong></div>
          ${!isCorrect ? `<div class="text-emerald-400">Jawaban Benar: <strong>${q.options[q.answer]}</strong></div>` : ''}
        </div>
        <div class="p-3 bg-dark-base rounded-lg border border-slate-800 text-xs text-slate-300 italic mt-2">
          <strong class="text-cyan-400 not-italic block mb-0.5">Pembahasan:</strong>
          ${q.explanation}
        </div>
      </div>
    `;
  }).join('');

  document.getElementById('quiz-review-modal').classList.remove('hidden');
}

function closeQuizReviewModal() {
  document.getElementById('quiz-review-modal').classList.add('hidden');
}

function restartQuiz() {
  document.getElementById('quiz-result-modal').classList.add('hidden');
  filterQuizQuestions(activeCategory);
}
