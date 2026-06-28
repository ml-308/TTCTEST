
const globalLoginBtn = document.getElementById('globalLoginBtn');
const globalLogoutBtn = document.getElementById('globalLogoutBtn');
const loginModalBtn = document.getElementById('login-btn'); // 提交登录按钮
const closeBtn = document.getElementById('close_login_btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const globalLoginModal = document.getElementById('globalLoginModal');
const loginsuccess = document.getElementById('globalUserInfo');
const displayName = document.getElementById('globalDisplayName');


globalLoginBtn.addEventListener('click', loginshow);
loginModalBtn.addEventListener('click', login);
closeBtn.addEventListener('click', closeLogin);


//showmsg
function showMessage(msg, isError) {
  const box = document.getElementById('errormsg');
  if (box) {
    box.textContent = msg;
    box.style.display = 'block';
    box.style.color = isError ? 'red' : 'green';
  }
  const popup = document.createElement('div');
  popup.textContent = msg;
  popup.style = 'position:fixed; top:20px; left:50%; padding:10px 20px; border-radius:5px; z-index:9999; color:#fff; font-size:0.85rem; animation: fadeInOut 2s ease forwards;';
  popup.style.backgroundColor = isError ? '#f44336' : '#4CAF50';
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
  
  // 注入动画关键帧（仅一次）
  if (!document.getElementById('showMsgAnimStyles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'showMsgAnimStyles';
    styleSheet.textContent = `
      @keyframes fadeInOut {
        0%   { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        85%  { opacity: 1; transform: translateX(-50%) translateY(0); }
        100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
      }
    `;
    document.head.appendChild(styleSheet);
  }
}


function validateEmail(value) {
  const email = value.trim();
  if (!email) return '邮箱不能为空';
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return '邮箱格式不正确';
  return '邮箱格式正确';
}


function loginshow() {
  globalLoginModal.style.display = 'block';
  globalLoginBtn.style.display = 'none';
  globalLogoutBtn.style.display = 'none';
  closeBtn.style.display = 'block';
}


function login(e) {
  e.preventDefault(); 
  const email = usernameInput.value.trim();
  const password = passwordInput.value;
  const msg = validateEmail(email);
  if (msg === '邮箱格式正确') {
    loginread(email, password); 
  } else {
    showMessage(msg, true);
  }
}


async function loginread(email, password) {
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      showMessage(data.message || '登录失败', true);
      return;
    }


    const user = await fetchUserInfo();
    if (user) {
      displayName.textContent = user.email; 
      loginsuccess.textContent = '登录成功';
      globalLoginModal.style.display = 'none';
      globalLoginBtn.style.display = 'none';
      globalLogoutBtn.style.display = 'block';
      closeBtn.style.display = 'none';
    }
  } catch (err) {
    showMessage('网络错误', true);
  }
}

async function fetchUserInfo() {
  try {
    const res = await fetch('/api/profile', { credentials: 'include' });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch {
    return null;
  }
}


function closeLogin() {
  globalLoginModal.style.display = 'none';
  globalLoginBtn.style.display = 'block';
  globalLogoutBtn.style.display = 'none';
  closeBtn.style.display = 'none';
}


