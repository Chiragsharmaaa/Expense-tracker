const form = document.getElementById('container-form');
const ExpenseDiv = document.getElementById('expense-div');

window.addEventListener('DOMContentLoaded', screenLoader);

async function screenLoader(e) {
    e.preventDefault();

    try {
        let response = await axios.get('http://localhost:3000/expense');
        response.data.map(expense => displayExpenses(expense));
    } catch (err) {
        console.log(err);
    };
};

form.addEventListener('submit', addExpense);

async function addExpense(e) {
    e.preventDefault();
    try {
        const expenseDetails = {
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        };

        let response = await axios.post('http://localhost:3000/expense/add-expense', expenseDetails)
        if (response.status === 201) {
            console.log(response.data.data)
            displayExpenses(response.data.data);
        } else {
            throw new Error('unable to add Expense!')
        };
    } catch (err) {
        console.log(err)
    };
};

function displayExpenses(data) {
    const childElement = `<li class="list" id=${data.id}>
        <span class="expense-info"> ${data.amount} -${data.description} - ${data.category}</span>
        <span class="btns">
            <input type="submit" class="btn" value="Edit">
            <input onclick="removeExpense('${data.id}')" type="submit" name="add" class="btn" value="Delete">
        </span>
    </li>`;

    ExpenseDiv.innerHTML += childElement;
};

async function removeExpense(id) {
    try {
        await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`);
        removeFromScreen(id);
    } catch(err) {
        console.log(err)
    };
};

function removeFromScreen(id) {
    let childElement = document.getElementById(id);
    ExpenseDiv.removeChild(childElement);
};