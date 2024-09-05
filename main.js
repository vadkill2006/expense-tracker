document.addEventListener("DOMContentLoaded", () => {
    const totalIncomeEl = document.getElementById("totalIncome");
    const totalExpenseEl = document.getElementById("totalExpense");
    const remainingBalanceEl = document.getElementById("remainingBalance");
    const expenseListEl = document.getElementById("expenseList");

    let totalIncome = parseFloat(localStorage.getItem("totalIncome")) || 0;
    let totalExpense = parseFloat(localStorage.getItem("totalExpense")) || 0;
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    function updateSummary() {
        totalIncomeEl.textContent = `₹${totalIncome.toFixed(2)}`;
        totalExpenseEl.textContent = `₹${totalExpense.toFixed(2)}`;
        remainingBalanceEl.textContent = `₹${(totalIncome - totalExpense).toFixed(2)}`;
    }

    function saveToLocalStorage() {
        localStorage.setItem("totalIncome", totalIncome.toFixed(2));
        localStorage.setItem("totalExpense", totalExpense.toFixed(2));
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    function renderExpenses() {
        expenseListEl.innerHTML = "";
        expenses.forEach((expense, index) => {
            const li = document.createElement("li");
            li.classList.add("expense-item");
            if (expense.completed) {
                li.classList.add("completed");
            }

            li.innerHTML = `
            <div>
                <input type="checkbox" ${expense.completed ? "checked" : ""} data-index="${index}">
                <span>${expense.description} - ₹${expense.amount.toFixed(2)}</span>
                </div>
                <button data-index="${index}" class="editBtn">Edit</button>
                <button data-index="${index}" class="deleteBtn">Delete</button>
            `;

            expenseListEl.appendChild(li);
        });
    }

    document.getElementById("incomeForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const incomeAmount = parseFloat(document.getElementById("incomeAmount").value);
        if (!isNaN(incomeAmount)) {
            totalIncome += incomeAmount;
            saveToLocalStorage();
            updateSummary();
        }
        document.getElementById("incomeAmount").value = "";
    });

    document.getElementById("expenseForm").addEventListener("submit", function(e) {
        e.preventDefault();
        const expenseDescription = document.getElementById("expenseDescription").value;
        const expenseAmount = parseFloat(document.getElementById("expenseAmount").value);
        if (!isNaN(expenseAmount) && expenseDescription.trim() !== "") {
            expenses.push({
                description: expenseDescription,
                amount: expenseAmount,
                completed: false,
            });
            totalExpense += expenseAmount;
            saveToLocalStorage();
            updateSummary();
            renderExpenses();
        }

        document.getElementById("expenseDescription").value = "";
        document.getElementById("expenseAmount").value = "";
    });

    expenseListEl.addEventListener("change", function(e) {
        if (e.target.tagName === "INPUT" && e.target.type === "checkbox") {
            const index = e.target.getAttribute("data-index");
            const expense = expenses[index];
            expense.completed = e.target.checked;

            if (expense.completed) {
                totalExpense -= expense.amount;
            } else {
                totalExpense += expense.amount;
            }

            saveToLocalStorage();
            updateSummary();
            renderExpenses();
        }
    });

    expenseListEl.addEventListener("click", function(e) {
        const index = e.target.getAttribute("data-index");
        if (e.target.classList.contains("deleteBtn")) {
            totalExpense -= expenses[index].amount;
            expenses.splice(index, 1);
            saveToLocalStorage();
            updateSummary();
            renderExpenses();
        } else if (e.target.classList.contains("editBtn")) {
            const newDescription = prompt("Enter new description:", expenses[index].description);
            const newAmount = parseFloat(prompt("Enter new amount:", expenses[index].amount));

            if (newDescription && !isNaN(newAmount)) {
                totalExpense -= expenses[index].amount; // Subtract old amount
                expenses[index].description = newDescription;
                expenses[index].amount = newAmount;
                totalExpense += newAmount; // Add new amount
                saveToLocalStorage();
                updateSummary();
                renderExpenses();
            }
        }
    });

    resetButton.addEventListener("click", function() {
        totalIncome = 0;
        saveToLocalStorage();
        updateSummary();
        renderExpenses();
    });

    updateSummary();
    renderExpenses();
});