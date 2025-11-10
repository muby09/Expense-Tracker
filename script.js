// Get DOM elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('income-amount');
const moneyMinusEl = document.getElementById('expense-amount');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('transaction-form');
const textEl = document.getElementById('description');
const amountEl = document.getElementById('amount');

// Initialize transactions array from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (textEl.value.trim() === '' || amountEl.value.trim() === '') {
        alert('Please add a text and amount');
        return;
    }

    const transaction = {
        id: generateID(),
        text: textEl.value,
        amount: +amountEl.value
    };

    transactions.push(transaction);
    updateLocalStorage(); // Add this line
    addTransactionDOM(transaction);
    updateValues();

    textEl.value = '';
    amountEl.value = '';
}

// Add this new function to update localStorage
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    // Format amount as currency
    const formattedAmount = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(Math.abs(transaction.amount));

    // Add the transaction class and the appropriate income/expense class
    item.classList.add('transaction');
    item.classList.add(transaction.amount < 0 ? 'expense' : 'income');
    
    item.innerHTML = `
        ${transaction.text} <span>${sign}${formattedAmount}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    listEl.appendChild(item);
}

// Update balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balanceEl.innerText = `$${total}`;
    moneyPlusEl.innerText = `$${income}`;
    moneyMinusEl.innerText = `$${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage(); // Add this line
    init();
}

// Initialize app
function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

// Event listeners
formEl.addEventListener('submit', addTransaction);

// Initialize app
init();