const root = document.documentElement;
const heroBrand = document.getElementById('heroBrand');
const heroLogo = document.getElementById('heroLogo');
const result = document.getElementById('result');
const resultDetails = document.getElementById('resultDetails');
const userId = document.getElementById('userId');
const amount = document.getElementById('amount');
const idHint = document.getElementById('idHint');
const loginPanel = document.getElementById('loginPanel');
let currentBrand = 'linebet';

const brands = {
  linebet: {name:'LINEBET', color:'#25c26e', rgb:'37,194,110', logo:'assets/linebet-logo.jpg', alt:'شعار LINEBET'},
  megapari: {name:'MEGAPARI', color:'#ff4b55', rgb:'255,75,85', logo:'assets/megapari-logo.jpg', alt:'شعار MEGAPARI'}
};

function setBrand(name) {
  currentBrand = name;
  const b = brands[name];
  root.style.setProperty('--accent', b.color);
  root.style.setProperty('--accent-rgb', b.rgb);
  heroBrand.textContent = b.name;
  heroLogo.src = b.logo;
  heroLogo.alt = b.alt;
  document.title = `${b.name} — شحن`;
  document.querySelectorAll('[data-brand]').forEach(el => {
    const active = el.dataset.brand === name;
    if (el.classList.contains('nav-tab')) el.classList.toggle('active', active);
    if (el.classList.contains('brand-choice')) el.classList.toggle('selected', active);
  });
  result.hidden = true;
}
document.querySelectorAll('[data-brand]').forEach(el => el.addEventListener('click', () => setBrand(el.dataset.brand)));

userId.addEventListener('input', () => {
  userId.value = userId.value.replace(/\D/g, '').slice(0, 10);
  const count = userId.value.length;
  idHint.textContent = count === 10 ? 'اكتمل الرقم — جاهز للشحن.' : `متبقي ${10 - count} أرقام.`;
  idHint.style.color = count === 10 ? 'var(--accent)' : '';
});

document.querySelectorAll('[data-amount]').forEach(btn => btn.addEventListener('click', () => {
  amount.value = btn.dataset.amount;
  amount.focus();
}));

document.getElementById('demoForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = userId.value.trim();
  const value = amount.value.trim();
  if (!/^\d{10}$/.test(id)) {
    idHint.textContent = 'من فضلك أدخل 10 أرقام بالضبط.';
    idHint.style.color = '#ff777f';
    userId.focus();
    return;
  }
  // Accept positive decimal amounts only; no network or financial operation occurs.
  if (!/^\d+(?:\.\d{1,2})?$/.test(value) || Number(value) <= 0) {
    amount.setCustomValidity('أدخل مبلغ شحن صحيح أكبر من صفر.');
    amount.reportValidity();
    amount.setCustomValidity('');
    amount.focus();
    return;
  }
  resultDetails.textContent = `ID: ${id} | Amount: ${Number(value).toFixed(2)}`;
  result.hidden = false;
  result.scrollIntoView({behavior:'smooth', block:'nearest'});
});

const openLogin = () => { loginPanel.hidden = false; document.getElementById('username').focus(); };
document.getElementById('loginToggle').addEventListener('click', openLogin);
document.getElementById('closeLogin').addEventListener('click', () => loginPanel.hidden = true);
loginPanel.addEventListener('click', e => { if (e.target === loginPanel) loginPanel.hidden = true; });
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('username').value;
  const p = document.getElementById('password').value;
  const msg = document.getElementById('loginMessage');
  if (u === 'demo' && p === 'demo123') {
    msg.textContent = 'تم تسجيل الدخول بنجاح ✓';
    setTimeout(() => { loginPanel.hidden = true; msg.textContent = ''; }, 900);
  } else {
    msg.textContent = 'بيانات الدخول غير صحيحة. استخدم البيانات الموضحة أدناه.';
  }
});