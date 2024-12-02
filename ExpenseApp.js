// implementation to load expenses from local storage when the page loads
window.onload = function () {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      expenses.push(...JSON.parse(savedExpenses));
      calculateExpensesByCategory();
      updateExpenseHistory();
      showTopCategories(); // To update top categories
      updateSummary(); // Call to update the summary section
    }
  };
  
// reset dat button clearing all data
  document.getElementById("reset-data").addEventListener("click", function() {
    // Clear expenses array and local storage
    expenses.length = 0;
    localStorage.removeItem("expenses");
  
    // Update UI
    calculateExpensesByCategory();
    updateExpenseHistory();
    showTopCategories(); // Update top categories
    updateSummary(); // Update the summary section
  
    // Clear the input fields
    document.querySelector("#expense-category").value = "";
    document.querySelector("#expense-amount").value = "";
    document.querySelector("#expense-date").value = "";
  });
  
  

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

// function to dowload report

function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Amount,Date\n"; // Add headers for expenses
  
    // Adding expenses data to CSV
    expenses.forEach((expense) => {
      csvContent += `${expense.category},${expense.amount},${new Date(expense.date).toLocaleDateString()}\n`;
    });
  
    // Calculate category totals
    const categoryTotals = {};
    expenses.forEach((expense) => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });
  
    // Adding a section for Category Totals
    csvContent += "\nCategory Totals\n";
    csvContent += "Category,Total Amount\n";
    for (const [category, total] of Object.entries(categoryTotals)) {
      csvContent += `${category},${total.toFixed(2)}\n`;
    }
  
    // Calculate summary data
    const weeklyTotal = calculateSpending(7);
    const monthlyTotal = calculateSpending(31);
    const yearlyTotal = calculateSpending(365);
    const overallTotal = expenses.reduce(
      (total, expense) => total + expense.amount,
      0
    );
  
    // Adding summary data to CSV
    csvContent += "\nSummary\n";
    csvContent += `Weekly Spending,$${weeklyTotal.toFixed(2)}\n`;
    csvContent += `Monthly Spending,$${monthlyTotal.toFixed(2)}\n`;
    csvContent += `Yearly Spending,$${yearlyTotal.toFixed(2)}\n`;
    csvContent += `Total Spending,$${overallTotal.toFixed(2)}\n`;
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "expense_report.csv");
    document.body.appendChild(link);
  
    link.click();
    document.body.removeChild(link);
  }
  
  // Attach event listener to the doload report button
  document.querySelector(".btn.btn-primary.mt-2").addEventListener("click", downloadCSV);
  
  //impentantation for search feature

 document.querySelector("form[role='search']").addEventListener("submit", function (event) {
  event.preventDefault();
  showSearchResults();
});

document.querySelector("input[type='search']").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    showSearchResults();
  }
});

function showSearchResults() {
  const searchQuery = document.querySelector("input[type='search']").value.trim().toLowerCase();
  const searchResultsSection = document.getElementById("search-results");
  const searchResultsContent = document.getElementById("search-results-content");

  // Clear previous search results
  searchResultsContent.innerHTML = "";

  if (searchQuery) {
    // Display the search results section
    searchResultsSection.style.display = "block";

    if (searchQuery.includes("all")) {
      // Show all expenses
      let resultsHTML = "<table class='custom-table'><thead><tr><th>Category</th><th>Amount</th><th>Date</th></tr></thead><tbody>";
      expenses.forEach(expense => {
        resultsHTML += `<tr><td>${expense.category}</td><td>$${expense.amount.toFixed(2)}</td><td>${new Date(expense.date).toLocaleDateString()}</td></tr>`;
      });
      resultsHTML += "</tbody></table>";
      searchResultsContent.innerHTML = resultsHTML;
    } else {
      // Show expenses for the specific category
      let resultsHTML = "<table class='custom-table'><thead><tr><th>Category</th><th>Amount</th><th>Date</th></tr></thead><tbody>";
      const filteredExpenses = expenses.filter(expense => expense.category.toLowerCase() === searchQuery);
      if (filteredExpenses.length > 0) {
        filteredExpenses.forEach(expense => {
          resultsHTML += `<tr><td>${expense.category}</td><td>$${expense.amount.toFixed(2)}</td><td>${new Date(expense.date).toLocaleDateString()}</td></tr>`;
        });
      } else {
        resultsHTML += "<tr><td colspan='3'>No expenses found for this category.</td></tr>";
      }
      resultsHTML += "</tbody></table>";
      searchResultsContent.innerHTML = resultsHTML;
    }

    // Smooth scroll to the search results section
    searchResultsSection.scrollIntoView({ behavior: 'smooth' });
  }
}

  
  