/**
 * =========================================================
 * TJKT EDUCATION - PROGRESS MANAGER
 * Tracks completed modules, badges, and quiz scores using localStorage.
 * =========================================================
 */

const STORAGE_PROGRESS_KEY = 'tjkt_completed_topics';
const STORAGE_QUIZ_KEY = 'tjkt_quiz_history';

/**
 * Returns array of completed topic IDs.
 * @returns {Array<string>}
 */
function getCompletedTopics() {
  const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Marks a topic ID as completed or uncompleted.
 * @param {string} topicId 
 * @returns {boolean} New state (true if completed)
 */
function toggleTopicCompletion(topicId) {
  let completed = getCompletedTopics();
  let newState = false;
  if (completed.includes(topicId)) {
    completed = completed.filter(id => id !== topicId);
    newState = false;
  } else {
    completed.push(topicId);
    newState = true;
  }
  localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(completed));
  updateProgressUI();
  return newState;
}

/**
 * Returns true if a topic ID is completed.
 * @param {string} topicId 
 * @returns {boolean}
 */
function isTopicCompleted(topicId) {
  return getCompletedTopics().includes(topicId);
}

/**
 * Saves a new quiz score entry.
 * @param {number} score 
 * @param {string} category 
 */
function saveQuizResult(score, category) {
  const history = getQuizHistory();
  const entry = {
    date: new Date().toLocaleDateString('id-ID'),
    time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    score: score,
    category: category
  };
  history.unshift(entry);
  localStorage.setItem(STORAGE_QUIZ_KEY, JSON.stringify(history.slice(0, 10))); // keep max 10
}

/**
 * Returns quiz history array.
 * @returns {Array<Object>}
 */
function getQuizHistory() {
  const saved = localStorage.getItem(STORAGE_QUIZ_KEY);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Updates UI components across pages that display progress stats.
 */
function updateProgressUI() {
  const completed = getCompletedTopics();
  const totalModules = 19; // 7 TJKT + 7 RPL + 5 OS Tutorials
  const percent = Math.min(100, Math.round((completed.length / totalModules) * 100));

  // Update progress percentage elements
  document.querySelectorAll('.user-progress-percent').forEach(el => {
    el.textContent = `${percent}%`;
  });

  document.querySelectorAll('.user-progress-count').forEach(el => {
    el.textContent = `${completed.length} / ${totalModules}`;
  });

  // Update progress bar width
  document.querySelectorAll('.user-progress-bar').forEach(bar => {
    bar.style.width = `${percent}%`;
  });

  // Check and unlock badges
  updateBadges(completed.length, getQuizHistory());
}

/**
 * Unlocks badges based on progress.
 * @param {number} completedCount 
 * @param {Array<Object>} quizHistory 
 */
function updateBadges(completedCount, quizHistory) {
  const badges = [
    { id: 'badge-novice', name: 'Networking Novice', req: 1, icon: 'fa-user-graduate', desc: 'Selesaikan 1 modul pertama' },
    { id: 'badge-tjkt', name: 'TJKT Specialist', req: 7, icon: 'fa-network-wired', desc: 'Selesaikan 7 modul TJKT' },
    { id: 'badge-rpl', name: 'Fullstack Dev', req: 14, icon: 'fa-code', desc: 'Selesaikan 14 modul pembelajaran' },
    { id: 'badge-quiz', name: 'Quiz Master', reqQuiz: 80, icon: 'fa-trophy', desc: 'Raih nilai quiz minimal 80' }
  ];

  const highestScore = quizHistory.length > 0 ? Math.max(...quizHistory.map(q => q.score)) : 0;

  badges.forEach(b => {
    const badgeEl = document.getElementById(b.id);
    if (badgeEl) {
      let unlocked = false;
      if (b.req && completedCount >= b.req) unlocked = true;
      if (b.reqQuiz && highestScore >= b.reqQuiz) unlocked = true;

      if (unlocked) {
        badgeEl.classList.remove('opacity-40', 'grayscale');
        badgeEl.classList.add('border-cyan-400', 'box-glow-cyan');
      } else {
        badgeEl.classList.add('opacity-40', 'grayscale');
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateProgressUI();
});
