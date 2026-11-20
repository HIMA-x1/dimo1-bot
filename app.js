const body = document.body;

const topCurrencyText = document.getElementById('topCurrencyText');
const currencyPill = document.getElementById('currencyPill');
const activeCurrencyTag = document.getElementById('activeCurrencyTag');
const modeStamp = document.getElementById('modeStamp');

const result = document.getElementById('result');
const resultTitle = document.getElementById('resultTitle');
const resultDetails = document.getElementById('resultDetails');
const resultCurrencyBadge = document.getElementById('resultCurrencyBadge');
const resultRemaining = document.getElementById('resultRemaining');
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
const amountLabelText = document.getElementById('amountLabelText');
const amountSubText = document.getElementById('amountSubText');
const amountSymbolIcon = document.getElementById('amountSymbolIcon');
const currencyBadge = document.getElementById('currencyBadge');
const submitBtnText = document.getElementById('submitBtnText');
const privacyText = document.getElementById('privacyText');
const footerCurrency = document.getElementById('footerCurrency');

let currentCurrency = 'egp'; // 'egp' | 'usd'

// أرصدة منفصلة لكل عملة داخل Cash Now
const balances = {
  egp: 50000.00,
  usd: 1500.00
};

const currencies = {
  egp: {
    code: 'EGP',
    unit: 'ج.م',
    label: 'مصري',
    badge: 'كاش',
    symbol: '¤',
    stamp: 'CASH NOW • EGP',
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
    stamp: 'CASH NOW • USD $',
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
  const cur = currencies[currentCurrency];
  const isUSD = currentCurrency === 'usd';

  body.classList.toggle('usd-mode', isUSD);

  modeStamp.textContent = cur.stamp;
  topCurrencyText.textContent = `${cur.label} (${cur.unit}) ✓`;
  currencyPill.textContent = `✓ العملة: ${cur.label} (${cur.unit})`;
  activeCurrencyTag.textContent = `${cur.label} ✓`;
  footerCurrency.textContent = isUSD ? '© ID CASH • USD $' : '© ID CASH • EGP';
  document.title = `ID CASH — Cash Now (${cur.label})`;

  document.querySelectorAll('[data-currency]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.currency === currentCurrency);
  });

  if (isUSD) {
    panelKicker.textContent = 'ID CASH • CASH NOW USD';
    panelTitle.textContent = 'قائمة تحويل Cash Now (بالدولار $)';
    panelSubtitle.textContent = 'أدخل رقم المستلم ومبلغ التحويل بالدولار الأمريكي ($)';
    panelIcon.textContent = '$';
    amountLabelText.textContent = 'مبلغ التحويل ($)';
    amountSubText.textContent = 'قيمة التحويل بالدولار';
    submitBtnText.textContent = 'إرسال التحويل ($)';
    privacyText.textContent = 'ID CASH • نظام تحويل Cash Now بالدولار الأمريكي ($).';
  } else {
    panelKicker.textContent = 'ID CASH • CASH NOW EGP';
    panelTitle.textContent = 'قائمة تحويل Cash Now';
    panelSubtitle.textContent = 'أدخل رقم المستلم ومبلغ التحويل ثم اضغط إرسال التحويل';
    panelIcon.textContent = '⇄';
    amountLabelText.textContent = 'مبلغ التحويل';
    amountSubText.textContent = 'قيمة التحويل';
    submitBtnText.textContent = 'إرسال التحويل';
    privacyText.textContent = 'ID CASH • نظام تحويل Cash Now المحلي.';
  }

  amountSymbolIcon.textContent = cur.symbol;
  currencyBadge.textContent = cur.badge;
  if (amount) amount.placeholder = cur.placeholder;

  renderChips();
  updateBalanceUI();
  if (result) result.hidden = true;
}

function setCurrency(curr) {
  if (!currencies[curr]) return;
  currentCurrency = curr;
  syncUI();
}

document.querySelectorAll('[data-currency]').forEach(btn => {
  btn.addEventListener('click', () => setCurrency(btn.dataset.currency));
});

if (userId) {
  userId.addEventListener('input', () => {
    userId.value = userId.value.replace(/\D/g, '').slice(0, 10);
    const count = userId.value.length;
    idHint.textContent = count === 10 ? 'اكتمل الرقم — جاهز للتحويل.' : `متبقي ${10 - count} أرقام.`;
    idHint.style.color = count === 10 ? '#60a5fa' : '';
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
      idHint.style.color = '#f87171';
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
      alert('رصيد الحساب المتاح بهذه العملة غير كافٍ لإتمام التحويل.');
      return;
    }

    balances[currentCurrency] -= chargeVal;
    updateBalanceUI();

    const cur = currencies[currentCurrency];
    const isUSD = currentCurrency === 'usd';
    const timeNow = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    resultTitle.textContent = 'تم إرسال التحويل عبر Cash Now بنجاح ✅';
    resultDetails.textContent = isUSD
      ? `ID: ${id} | Amount: $${chargeVal.toFixed(2)} USD`
      : `ID: ${id} | Amount: ${chargeVal.toFixed(2)} EGP`;

    resultCurrencyBadge.textContent = `العملة: ${cur.label} (${cur.unit})`;
    resultRemaining.textContent = `الرصيد المتبقي: ${cur.formatAmount(balances[currentCurrency])}`;
    resultMeta.textContent = `القناة: ID CASH • Cash Now • وقت التنفيذ: ${timeNow}`;

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
      msg.style.color = '#60a5fa';
      setTimeout(() => {
        loginPanel.hidden = true;
        msg.textContent = '';
      }, 450);
    } else {
      msg.textContent = 'بيانات الدخول غير صحيحة.';
      msg.style.color = '#f87171';
    }
    return false;
  });
}

function openAddBalanceModal() {
  if (!addBalancePanel) return;
  const desc = document.getElementById('addBalanceDesc');
  const label = document.getElementById('addAmountLabel');
  const cur = currencies[currentCurrency];
  if (desc) {
    desc.textContent = `أدخل المبلغ المراد إضافته إلى رصيدك الحالي (${cur.label} - ${cur.unit}).`;
  }
  if (label) {
    label.textContent = `المبلغ المراد إضافته (${cur.unit})`;
  }
  addBalancePanel.hidden = false;
  document.getElementById('addAmount').focus();
}

const adminBalanceBtn = document.getElementById('adminBalanceBtn');
const quickTopupBtn = document.getElementById('quickTopupBtn');

if (adminBalanceBtn) adminBalanceBtn.addEventListener('click', openAddBalanceModal);
if (quickTopupBtn) quickTopupBtn.addEventListener('click', openAddBalanceModal);

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
      msg.style.color = '#60a5fa';
      setTimeout(() => {
        if (addBalancePanel) addBalancePanel.hidden = true;
        msg.textContent = '';
        document.getElementById('addAmount').value = '';
      }, 850);
    }
  });
}