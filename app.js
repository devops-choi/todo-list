// 기존 코드 전체 삭제 후, 순수 DOM + 개발자 감성 + 자연스러운 애니메이션으로 재작성

let todos = [];
let history = [];
let goal = 0;
let filter = 'all';
const devMemes = [
  '이게 왜 안돼?', '커밋 메시지: 욕설', '퇴근은 내일의 나에게',
  'console.log("왜 안돼?")', '이거 고치면 또 뭐가 터질까?',
  '코드리뷰: "이거 누가 짰냐?"', '야근각...🔥', '이력서에 추가 완료',
  '이게 맞나 싶다', '커피 없인 못 살아', '이 밤이 지나면...',
  '이게 진짜 최선인가?', '이거 merge하면 진짜 끝?',
  '테스트는 내일의 나에게', '이거 배포해도 되나...?',
  '눈물의 똥꼬쇼', '이게 바로 개발자의 삶', '코드가 나를 배신했다',
  '이거 왜 되는 거지?', '이거 왜 안 되는 거지?'
];
const motivationList = [
  '오늘도 할 수 있다!', '작은 성공이 큰 변화를 만듭니다.',
  '포기하지 마세요, 당신은 성장하고 있습니다.', '목표를 향해 한 걸음 더!',
  '성공은 꾸준함에서 온다.', '오늘의 할 일, 내일의 나를 만든다.',
  '시작이 반이다!', '할 수 있다!'
];

const $ = sel => document.querySelector(sel);
const todoForm = $('#todo-form');
const todoInput = $('#todo-input');
const todoList = $('#todo-list');
const doneList = $('#done-list');
const priorityInput = $('#priority-input');
const deadlineInput = $('#deadline-input');
const categoryInput = $('#category-input');
const motivationDiv = $('#motivation');
const themeToggle = $('#theme-toggle');
const goalInput = $('#goal-input');
const setGoalBtn = $('#set-goal-btn');
const progressBar = $('#progress-bar');
const progressText = $('#progress-text');
const historyList = $('#history-list');
const allTasksBtn = $('#all-tasks-btn');
const todayTasksBtn = $('#today-tasks-btn');
const historyBtn = $('#history-btn');
const mainBoard = $('.main-board');
const sidebar = $('.sidebar');
const cardBoard = $('.card-board');
const historySection = $('#history-section');

// localStorage 키
const STORAGE_KEY = 'dev_todo_list_v1';
const HISTORY_KEY = 'dev_todo_history_v1';
const GOAL_KEY = 'dev_todo_goal_v1';

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  localStorage.setItem(GOAL_KEY, goal);
}
function loadTodos() {
  const t = localStorage.getItem(STORAGE_KEY);
  const h = localStorage.getItem(HISTORY_KEY);
  const g = localStorage.getItem(GOAL_KEY);
  if (t) todos = JSON.parse(t);
  if (h) history = JSON.parse(h);
  if (g) goal = parseInt(g, 10) || 0;
}

function showDevMeme() {
  const meme = devMemes[Math.floor(Math.random() * devMemes.length)];
  motivationDiv.textContent = meme;
  motivationDiv.animate([
    { opacity: 0, transform: 'translateY(-10px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 500, fill: 'forwards' });
}
function showMotivation() {
  const msg = motivationList[Math.floor(Math.random() * motivationList.length)];
  motivationDiv.textContent = msg;
  motivationDiv.animate([
    { opacity: 0, transform: 'translateY(-10px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 500, fill: 'forwards' });
}
function updateProgress() {
  const done = todos.filter(t => t.completed).length;
  if (goal > 0) {
    const percent = Math.min(100, Math.round((done / goal) * 100));
    progressBar.animate([
      { width: progressBar.style.width },
      { width: percent + '%' }
    ], { duration: 400, fill: 'forwards' });
    progressBar.style.width = percent + '%';
    progressText.textContent = `${done} / ${goal} 완료 (${percent}%)`;
  } else {
    progressBar.style.width = '0%';
    progressText.textContent = '';
  }
}
function renderTodos() {
  todoList.innerHTML = '';
  doneList.innerHTML = '';
  let filtered = todos;
  if (filter === 'today') {
    const today = new Date().toISOString().slice(0, 10);
    filtered = todos.filter(todo => todo.deadline && todo.deadline.startsWith(today));
  }
  filtered.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.setAttribute('draggable', 'true');
    li.className = [
      todo.priority === '높음' ? 'high' : '',
      todo.priority === '긴급' ? 'urgent' : '',
      todo.priority === '보통' ? 'low' : '',
      todo.completed ? 'completed' : ''
    ].filter(Boolean).join(' ');
    li.dataset.idx = idx;
    const span = document.createElement('span');
    span.textContent = todo.text;
    if (todo.completed) span.className = 'completed';
    if (todo.deadline) {
      const deadlineSpan = document.createElement('span');
      deadlineSpan.className = 'deadline';
      deadlineSpan.textContent = '⏰ ' + todo.deadline.replace('T', ' ');
      span.appendChild(deadlineSpan);
    }
    if (todo.category) {
      const catSpan = document.createElement('span');
      catSpan.className = 'category';
      catSpan.textContent = '🏷️ ' + todo.category;
      span.appendChild(catSpan);
    }
    const btnDiv = document.createElement('div');
    btnDiv.className = 'todo-actions';
    const completeBtn = document.createElement('button');
    completeBtn.className = 'toggle-complete';
    completeBtn.dataset.idx = idx;
    completeBtn.textContent = '✔';
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-todo';
    deleteBtn.dataset.idx = idx;
    deleteBtn.textContent = '🗑';
    btnDiv.appendChild(completeBtn);
    btnDiv.appendChild(deleteBtn);
    li.appendChild(span);
    li.appendChild(btnDiv);
    li.animate([
      { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
      { opacity: 1, transform: 'translateY(0) scale(1)' }
    ], { duration: 350, fill: 'forwards' });
    if (todo.completed) {
      doneList.appendChild(li);
    } else {
      todoList.appendChild(li);
    }
  });
  updateProgress();
}
function renderHistory() {
  historyList.innerHTML = '';
  history.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.text} (${item.completedAt})`;
    li.animate([
      { opacity: 0, transform: 'translateX(-10px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ], { duration: 300, fill: 'forwards' });
    historyList.appendChild(li);
  });
}
todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const text = todoInput.value.trim();
  const priority = priorityInput.value;
  const deadline = deadlineInput.value;
  const category = categoryInput.value.trim();
  if (text) {
    todos.push({ text, completed: false, priority, deadline, category });
    todoInput.value = '';
    deadlineInput.value = '';
    categoryInput.value = '';
    if (Math.random() < 0.5) showDevMeme();
    else showMotivation();
    saveTodos();
    renderTodos();
  }
});
todoList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-todo')) {
    const idx = e.target.dataset.idx;
    if (!confirm('정말 지워도 되겠습니까? (이력서에 추가됨)')) return;
    if (todos[idx].completed) {
      history.push({
        text: todos[idx].text,
        completedAt: new Date().toLocaleString()
      });
      renderHistory();
    }
    const li = e.target.closest('li');
    li.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.8)' }
    ], { duration: 250, fill: 'forwards' }).onfinish = () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    };
  } else if (e.target.classList.contains('toggle-complete')) {
    const idx = e.target.dataset.idx;
    todos[idx].completed = !todos[idx].completed;
    showDevMeme();
    saveTodos();
    renderTodos();
  }
});
doneList.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-todo')) {
    const idx = e.target.dataset.idx;
    if (!confirm('정말 지워도 되겠습니까? (이력서에 추가됨)')) return;
    if (todos[idx].completed) {
      history.push({
        text: todos[idx].text,
        completedAt: new Date().toLocaleString()
      });
      renderHistory();
    }
    const li = e.target.closest('li');
    li.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.8)' }
    ], { duration: 250, fill: 'forwards' }).onfinish = () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    };
  } else if (e.target.classList.contains('toggle-complete')) {
    const idx = e.target.dataset.idx;
    todos[idx].completed = !todos[idx].completed;
    showDevMeme();
    saveTodos();
    renderTodos();
  }
});
setGoalBtn.addEventListener('click', function() {
  goal = parseInt(goalInput.value, 10) || 0;
  updateProgress();
  saveTodos();
});
themeToggle.addEventListener('click', function() {
  const isDark = document.body.classList.toggle('dark');
  sidebar.classList.toggle('dark', isDark);
  mainBoard.classList.toggle('dark', isDark);
  document.querySelectorAll('.card-column').forEach(col => col.classList.toggle('dark', isDark));
  document.querySelector('.todo-title').classList.toggle('dark', isDark);
  themeToggle.textContent = isDark ? '☀️ 라이트모드' : '🌙 다크모드';
});
let dragIdx = null;
todoList.addEventListener('dragstart', function(e) {
  if (e.target.tagName === 'LI') {
    dragIdx = e.target.dataset.idx;
    e.target.classList.add('dragging');
    e.target.animate([
      { boxShadow: '0 0 0 rgba(0,0,0,0)' },
      { boxShadow: '0 8px 24px rgba(59,130,246,0.18)' }
    ], { duration: 200, fill: 'forwards' });
  }
});
todoList.addEventListener('dragend', function(e) {
  if (e.target.tagName === 'LI') {
    e.target.classList.remove('dragging');
  }
});
todoList.addEventListener('dragover', function(e) {
  e.preventDefault();
  const after = Array.from(todoList.children).find(
    li => {
      const rect = li.getBoundingClientRect();
      return e.clientY < rect.top + rect.height / 2;
    }
  );
  const dragging = todoList.querySelector('.dragging');
  if (after) {
    todoList.insertBefore(dragging, after);
  } else {
    todoList.appendChild(dragging);
  }
});
todoList.addEventListener('drop', function(e) {
  e.preventDefault();
  const newOrder = Array.from(todoList.children).map(li => todos[li.dataset.idx]);
  const completed = todos.filter(t => t.completed);
  todos = newOrder.concat(completed);
  renderTodos();
});
setInterval(() => {
  const now = new Date();
  todos.forEach(todo => {
    if (!todo.completed && todo.deadline) {
      const deadline = new Date(todo.deadline);
      if (deadline - now < 60000 && deadline - now > 0) {
        alert(`'${todo.text}'의 마감이 곧 도래합니다!`);
      }
    }
  });
}, 60000);
allTasksBtn.addEventListener('click', () => {
  filter = 'all';
  historySection.style.display = 'none';
  cardBoard.style.display = 'flex';
  renderTodos();
  saveTodos();
});
todayTasksBtn.addEventListener('click', () => {
  filter = 'today';
  historySection.style.display = 'none';
  cardBoard.style.display = 'flex';
  renderTodos();
  saveTodos();
});
historyBtn.addEventListener('click', () => {
  renderHistory();
  historySection.style.display = 'block';
  cardBoard.style.display = 'none';
  saveTodos();
});
setInterval(() => {
  if (document.hidden) return;
  const coffee = document.createElement('button');
  coffee.textContent = '☕ 커피 타임!';
  coffee.style.position = 'fixed';
  coffee.style.bottom = '32px';
  coffee.style.right = '32px';
  coffee.style.zIndex = 9999;
  coffee.style.background = '#23272f';
  coffee.style.color = '#fff';
  coffee.style.border = 'none';
  coffee.style.borderRadius = '12px';
  coffee.style.padding = '1rem 2rem';
  coffee.style.fontSize = '1.2rem';
  coffee.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
  coffee.style.cursor = 'pointer';
  coffee.animate([
    { opacity: 0, transform: 'translateY(40px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 600, fill: 'forwards' });
  coffee.onclick = () => {
    coffee.remove();
    alert('커피 한 잔의 여유를 즐기세요! (그리고 다시 코딩...)');
  };
  document.body.appendChild(coffee);
  setTimeout(() => {
    coffee.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: 0, transform: 'translateY(40px)' }
    ], { duration: 600, fill: 'forwards' }).onfinish = () => coffee.remove();
  }, 10000);
}, 1000 * 60 * 30);
// 초기화
loadTodos();
showMotivation();
renderTodos();
renderHistory();