const root = document.documentElement;
const body = document.body;

const heroBrand = document.getElementById('heroBrand');
const heroDesc = document.getElementById('heroDesc');
const heroLogo = document.getElementById('heroLogo');
const modeStamp = document.getElementById('modeStamp');
const currencyPill = document.getElementById('currencyPill');
const activeCurrencyTag = document.getElementById('activeCurrencyTag');

const result = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultDetails = document.getElementById('resultDetails');
const resultMeta = document.getElementById('resultMeta');

const userId = document.getElementById('userId');
const amount = document.getElementById('amount');
const idHint = document.getElementById('idHint');
const loginPanel = document.getElementById('loginPanel');
const addBalancePanel = document.getElementById('addBalancePanel');
const accountBalanceDisplay = document.getElementById('accountBalanceDisplay');
const accountCurrencyUnit = document.getElementById('accountCurrencyUnit');

const panelKicker = document.getElementById('panelKicker');
const panelTitle = document.getElementById('panelTitle');
const panelSubtitle = document.getElementById('panelSubtitle');
const panelIcon = document.getElementById('panelIcon');
const modeBanner = document.getElementById('modeBanner');
const amountLabelText = document.getElementById('amountLabelText');
const amountSubText = document.getElementById('amountSubText');
const amountSymbolIcon = document.getElementById('amountSymbolIcon');
const currencyBadge = document.getElementById('currencyBadge');
const submitBtnText = document.getElementById('submitBtnText');
const privacyText = document.getElementById('privacyText');
const footerBrand = document.getElementById('footerBrand');
const footerCurrency = document.getElementById('footerCurrency');

let currentBrand = 'linebet';
let currentCurrency = 'egp'; // 'egp' | 'usd'

// أرصدة منفصلة لكل عملة
const balances = {
  egp: 50000.00,
  usd: 1500.00
};

const brands = {
  linebet: {
    name: 'LINEBET',
    color: '#25c26e',
    rgb: '37,194,110',
    logo: 'assets/linebet-logo.jpg',
    alt: 'شعار LINEBET',
    actionWord: 'الشحن',
    desc: 'نموذج واجهة حديث لعمليات الشحن في منصة LINEBET عبر ID CASH.'
  },
  megapari: {
    name: 'MEGAPARI',
    color: '#ff4b55',
    rgb: '255,75,85',
    logo: 'assets/megapari-logo.jpg',
    alt: 'شعار MEGAPARI',
    actionWord: 'الشحن',
    desc: 'نموذج واجهة حديث لعمليات الشحن في منصة MEGAPARI عبر ID CASH.'
  },
  cashnow: {
    name: 'Cash Now',
    color: '#2563eb',
    rgb: '37,99,235',
    logo: 'assets/cashnow-logo.png',
    alt: 'شعار Cash Now',
    actionWord: 'التحويل',
    desc: 'واجهة مخصصة لعمليات التحويل الفوري عبر Cash Now ضمن ID CASH بالدولار أو المصري.'
  }
};

const currencies = {
  egp: {
    code: 'EGP',
    unit: 'ج.م',
    label: 'مصري',
    badge: 'كاش',
    symbol: '¤',
    stamp: 'CASH EGP',
    placeholder: 'مثال: 250.00',
    chips: ['100', '250', '500', '1000'],
    formatAmount(num) {
      return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ج.م`;
    }
  },
  usd: {
    code: 'USD',
    unit: '$',
    label: 'دولار',
    badge: 'USD $',
    symbol: '$',
    stamp: 'USD $',
    placeholder: 'مثال: 50.00',
    chips: ['10', '25', '50', '100'],
    formatAmount(num) {
      return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }
};

function updateBalanceUI() {
  const cur = currencies[currentCurrency];
  const bal = balances[currentCurrency];
  if (accountBalanceDisplay) {
    accountBalanceDisplay.textContent = bal.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  if (accountCurrencyUnit) {
    accountCurrencyUnit.textContent = cur.unit;
  }
}

function renderChips() {
  const chipsWrap = document.getElementById('amountChips');
  if (!chipsWrap) return;
  const list = currencies[currentCurrency].chips;
  chipsWrap.innerHTML = list
    .map(val => `<button type="button" data-amount="${val}">${currentCurrency === 'usd' ? '$' + val : val}</button>`)
    .join('');

  chipsWrap.querySelectorAll('[data-amount]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (amount) {
        amount.value = btn.dataset.amount;
        amount.focus();
      }
    });
  });
}

function syncUI() {
  const b = brands[currentBrand];
  const cur = currencies[currentCurrency];
  const isCashNow = currentBrand === 'cashnow';
  const isUSD = currentCurrency === 'usd';

  root.style.setProperty('--accent', b.color);
  root.style.setProperty('--accent-rgb', b.rgb);

  body.classList.toggle('usd-mode', isUSD);
  body.classList.toggle('cashnow-transfer-mode', isCashNow);

  heroBrand.textContent = b.name;
  heroDesc.textContent = b.desc;
  heroLogo.src = b.logo;
  heroLogo.alt = b.alt;
  modeStamp.textContent = isCashNow && isUSD ? 'TRANSFER $' : isCashNow ? 'TRANSFER' : cur.stamp;

  currencyPill.textContent = `✓ العملة: ${cur.label} (${cur.unit})`;
  activeCurrencyTag.textContent = `${cur.label} ✓`;
  footerBrand.textContent = `ID CASH • ${b.name}`;
  footerCurrency.textContent = isUSD ? '© ID CASH • USD $' : '© ID CASH • EGP';
  document.title = `ID CASH — ${b.name} (${cur.label})`;

  document.querySelectorAll('[data-brand]').forEach(el => {
    const active = el.dataset.brand === currentBrand;
    if (el.classList.contains('nav-tab')) el.classList.toggle('active', active);
    if (el.classList.contains('brand-choice')) el.classList.toggle('selected', active);
  });

  document.querySelectorAll('[data-currency]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currentCurrency);
  });

  if (isCashNow) {
    panelKicker.textContent = isUSD ? 'ID CASH • CASH NOW USD TRANSFER' : 'ID CASH • CASH NOW TRANSFER PANEL';
    panelTitle.textContent = isUSD ? 'قائمة تحويل Cash Now (بالدولار $)' : 'قائمة تحويل Cash Now';
    panelSubtitle.textContent = isUSD
      ? 'أدخل رقم المستلم ومبلغ التحويل بالدولار الأمريكي ($)'
      : 'أدخل بيانات التحويل ثم اضغط إرسال التحويل';
    panelIcon.textContent = isUSD ? '$' : '⇄';
    amountLabelText.textContent = isUSD ? 'Transfer Amount ($)' : 'مبلغ التحويل';
    amountSubText.textContent = isUSD ? 'قيمة التحويل بالدولار' : 'قيمة التحويل';
    submitBtnText.textContent = isUSD ? 'تحويل الآن ($)' : 'إرسال التحويل';
    privacyText.textContent = isUSD
      ? 'تحويل فوري بعملة الدولار الأمريكي ($) عبر Cash Now — ID CASH.'
      : 'تحويل فوري عبر واجهة Cash Now — ID CASH.';
  } else {
    panelKicker.textContent = isUSD ? `ID CASH • ${b.name} USD PANEL` : 'ID CASH • CASH PANEL';
    panelTitle.textContent = isUSD ? `نموذج شحن ${b.name} (بالدولار $)` : 'نموذج لعملية الشحن';
    panelSubtitle.textContent = isUSD
      ? 'أدخل بيانات الشحن بالدولار الأمريكي ($) ثم اضغط Submit'
      : 'أدخل بيانات الشحن ثم اضغط Submit';
    panelIcon.textContent = isUSD ? '$' : '⌁';
    amountLabelText.textContent = isUSD ? 'Amount ($)' : 'Amount';
    amountSubText.textContent = isUSD ? 'مبلغ الشحن بالدولار' : 'مبلغ الشحن';
    submitBtnText.textContent = isUSD ? 'Submit ($)' : 'Submit';
    privacyText.textContent = isUSD ? 'بيانات الشحن بعملة الدولار ($) — ID CASH.' : 'بيانات الشحن — ID CASH.';
  }

  amountSymbolIcon.textContent = cur.symbol;
  currencyBadge.textContent = cur.badge;
  if (amount) amount.placeholder = cur.placeholder;

  if (isCashNow || isUSD) {
    modeBanner.hidden = false;
    if (isCashNow && isUSD) {
      modeBanner.textContent = '💵 وضع التحويل بالدولار ($): عند إرسال التحويل سيتم عرض المبلغ بعلامة الدولار ($) وخصمه من رصيد الدولار.';
    } else if (isCashNow) {
      modeBanner.textContent = '⇄ واجهة التحويل لـ Cash Now: يمكنك التبديل بين (دولار $) و (مصري ج.م) في أي وقت وتنفيذ التحويل مباشرة.';
    } else {
      modeBanner.textContent = '💵 تم تفعيل وضع الدولار ($): تم تحويل شارات العملة والمبالغ إلى نظام الدولار الأمريكي.';
    }
  } else {
    modeBanner.hidden = true;
    modeBanner.textContent = '';
  }

  renderChips();
  updateBalanceUI();
  if (result) result.hidden = true;
}

function setBrand(name) {
  if (!brands[name]) return;
  currentBrand = name;
  syncUI();
}

function setCurrency(curr) {
  if (!currencies[curr]) return;
  currentCurrency = curr;
  syncUI();
}

document.querySelectorAll('[data-brand]').forEach(el => {
  el.addEventListener('click', () => setBrand(el.dataset.brand));
});

document.querySelectorAll('[data-currency]').forEach(btn => {
  btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
});

if (userId) {
  userId.addEventListener('input', () => {
    userId.value = userId.value.replace(/\D/g, '').slice(0, 10);
    const count = userId.value.length;
    idHint.textContent = count === 10 ? 'اكتمل الرقم — جاهز للتنفيذ.' : `متبقي ${10 - count} أرقام.`;
    idHint.style.color = count === 10 ? 'var(--accent)' : '';
  });
}

const demoForm = document.getElementById('demoForm');
if (demoForm) {
  demoForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = userId.value.trim();
    const value = amount.value.trim();

    if (!/^\d{10}$/.test(id)) {
      idHint.textContent = 'من فضلك أدخل 10 أرقام بالضبط.';
      idHint.style.color = '#ff777f';
      userId.focus();
      return;
    }

    const chargeVal = Number(value);
    if (!/^\d+(?:\.\d{1,2})?$/.test(value) || chargeVal <= 0) {
      amount.setCustomValidity('أدخل مبلغ صحيح أكبر من صفر.');
      amount.reportValidity();
      amount.setCustomValidity('');
      amount.focus();
      return;
    }

    if (chargeVal > balances[currentCurrency]) {
      alert('رصيد الحساب المتاح بهذه العملة غير كافٍ لإتمام العملية.');
      return;
    }

    balances[currentCurrency] -= chargeVal;
    updateBalanceUI();

    const b = brands[currentBrand];
    const cur = currencies[currentCurrency];
    const isUSD = currentCurrency === 'usd';
    const isCashNow = currentBrand === 'cashnow';

    resultTitle.textContent = isCashNow
      ? `تم تنفيذ التحويل عبر ${b.name} بنجاح ✅`
      : `تم تنفيذ عملية الشحن في ${b.name} بنجاح ✅`;

    resultDetails.textContent = isUSD
      ? `ID: ${id} | Amount: $${chargeVal.toFixed(2)} USD`
      : `ID: ${id} | Amount: ${chargeVal.toFixed(2)} EGP`;

    resultMeta.textContent = `المنصة: ID CASH • ${b.name} • العملة: ${cur.label} (${cur.unit}) • المتبقي: ${cur.formatAmount(balances[currentCurrency])}`;

    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  if (loginPanel) loginPanel.hidden = false;
  const usernameInput = document.getElementById('username');
  if (usernameInput) usernameInput.focus();
  syncUI();
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim().toLowerCase();
    const p = document.getElementById('password').value.trim();
    const msg = document.getElementById('loginMessage');

    if (u === 'demo' && p === 'demo123') {
      msg.textContent = 'تم تسجيل الدخول بنجاح ✓';
      msg.style.color = 'var(--accent)';
      setTimeout(() => {
        loginPanel.hidden = true;
        msg.textContent = '';
      }, 500);
    } else {
      msg.textContent = 'بيانات الدخول غير صحيحة.';
      msg.style.color = '#ff777f';
    }
    return false;
  });
}

const adminBalanceBtn = document.getElementById('adminBalanceBtn');
if (adminBalanceBtn) {
  adminBalanceBtn.addEventListener('click', () => {
    if (addBalancePanel) {
      const desc = document.getElementById('addBalanceDesc');
      if (desc) {
        desc.textContent = `أدخل المبلغ المراد إضافته إلى رصيدك الحالي (${currencies[currentCurrency].label}).`;
      }
      addBalancePanel.hidden = false;
      document.getElementById('addAmount').focus();
    }
  });
}

const closeAddBalance = document.getElementById('closeAddBalance');
if (closeAddBalance) {
  closeAddBalance.addEventListener('click', () => {
    if (addBalancePanel) addBalancePanel.hidden = true;
  });
}

const addBalanceForm = document.getElementById('addBalanceForm');
if (addBalanceForm) {
  addBalanceForm.addEventListener('submit', e => {
    e.preventDefault();
    const addVal = Number(document.getElementById('addAmount').value);
    const msg = document.getElementById('addBalanceMsg');

    if (addVal > 0) {
      balances[currentCurrency] += addVal;
      updateBalanceUI();
      msg.textContent = `تم إضافة ${currencies[currentCurrency].formatAmount(addVal)} للرصيد بنجاح ✓`;
      setTimeout(() => {
        if (addBalancePanel) addBalancePanel.hidden = true;
        msg.textContent = '';
        document.getElementById('addAmount').value = '';
      }, 900);
    }
  });
}