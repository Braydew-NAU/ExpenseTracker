const expenses = []; // Array to store all expense entries

function calculateExpensesByCategory() {
  const categoryTotals = {};

  // Calculate total expenses for each category
  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  // Update the UI in the Category section
  const categoryTableBody = document.querySelector("#category tbody");
  categoryTableBody.innerHTML = ""; // Clear existing rows

  for (const [category, total] of Object.entries(categoryTotals)) {
    const row = `<tr><td>${category}</td><td>$${total.toFixed(2)}</td></tr>`;
    categoryTableBody.innerHTML += row;
  }
}

function getLatestDateByCategory() {
  const latestDates = {};

  expenses.forEach((expense) => {
    if (
      !latestDates[expense.category] ||
      new Date(expense.date) > new Date(latestDates[expense.category])
    ) {
      latestDates[expense.category] = expense.date;
    }
  });

  console.log(latestDates);
}

function showAllExpensesByCategory() {
  const newWindow = window.open("", "_blank");
  newWindow.document.write("<h1>All Expenses by Category</h1>");
  newWindow.document.write(
    '<table border="1"><tr><th>Category</th><th>Total Amount</th><th>Most Recent Date</th></tr>'
  );

  const categoryTotals = {};
  const latestDates = {};

  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }

    if (
      !latestDates[expense.category] ||
      new Date(expense.date) > new Date(latestDates[expense.category])
    ) {
      latestDates[expense.category] = expense.date;
    }
  });

  for (const category in categoryTotals) {
    newWindow.document.write(
      `<tr><td>${category}</td><td>$${categoryTotals[category].toFixed(
        2
      )}</td><td>${latestDates[category]}</td></tr>`
    );
  }

  newWindow.document.write("</table>");
}

function showAllExpenseHistory() {
  const newWindow = window.open("", "_blank");
  newWindow.document.write("<h1>ExpenseHistory</h1>");
  newWindow.document.write(
    '<table border="1"><tr><th>Category</th><th>Amount</th><th>Date</th></tr>'
  );

  expense.forEach((expense) => {
    newWindow.document.write(
      `<tr><td>${expense.category}</td><td>$${expense.amount}</td><td>${expense.date}</td></tr>`
    );
  });

  newWindow.document.write("</table>");
}

function showTopCategories() {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (categoryTotals[expense.category]) {
      categoryTotals[expense.category] += expense.amount;
    } else {
      categoryTotals[expense.category] = expense.amount;
    }
  });

  const sortedCategories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  const topCategories = sortedCategories.slice(0, 8);

  const categoryTableBody = document.querySelector("#category tbody");
  categoryTableBody.innerHTML = ""; // Clear existing rows

  topCategories.forEach(([category, total]) => {
    const row = `<tr><td>${category}</td><td>$${total.toFixed(2)}</td></tr>`;
    categoryTableBody.innerHTML += row;
  });
}

function sortExpensesByDate() {
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function updateExpenseHistory() {
  // Sort expenses by date in descending order
  expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Limit to the top 8 most recent expenses
  const recentExpenses = expenses.slice(0, 8);

  // Update the history table with the recent expenses
  const historyTableBody = document.querySelector("#history tbody");
  historyTableBody.innerHTML = ""; // Clear existing rows

  recentExpenses.forEach((expense) => {
    const row = `<tr><td>${expense.category}</td><td>$${expense.amount.toFixed(
      2
    )}</td><td>${expense.date}</td></tr>`;
    historyTableBody.innerHTML += row;
  });
}

function updateSummary() {
  const weeklyTotal = calculateSpending(7);
  const monthlyTotal = calculateSpending(31);
  const yearlyTotal = calculateSpending(365);
  const overallTotal = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  // Update the HTML elements with the calculated totals
  document.getElementById(
    "weekly-spending"
  ).textContent = `$${weeklyTotal.toFixed(2)}`;
  document.getElementById(
    "monthly-spending"
  ).textContent = `$${monthlyTotal.toFixed(2)}`;
  document.getElementById(
    "yearly-spending"
  ).textContent = `$${yearlyTotal.toFixed(2)}`;
  document.getElementById(
    "total-spending"
  ).textContent = `$${overallTotal.toFixed(2)}`;
}

function calculateSpending(days) {
  const today = new Date();
  const filteredExpenses = expenses.filter((expense) => {
    const diffTime = Math.abs(today - new Date(expense.date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= days;
  });

  // Calculate the total for the filtered expenses
  return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
}

document
  .querySelector("#expenseForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const category = document.querySelector("#expense-category").value;
    const amount = parseFloat(document.querySelector("#expense-amount").value);
    const date = document.querySelector("#expense-date").value;

    if (category && !isNaN(amount) && date) {
      expenses.push({ category, amount, date });
      calculateExpensesByCategory();
      updateExpenseHistory();
      showTopCategories(); // To update top 4 categories
      updateSummary(); // Call to update the summary section

      // Clear the input fields
      document.querySelector("#expense-category").value = "";
      document.querySelector("#expense-amount").value = "";
      document.querySelector("#expense-date").value = "";
    }
  });
