const form = document.getElementById('container-form');
const ExpenseDiv = document.getElementById('expense-div');
const logoutBtn = document.querySelector('#logout');
window.addEventListener('DOMContentLoaded', screenLoader);
let token = localStorage.getItem('token');
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    localStorage.removeItem('token');
    alert('Logged out!');
    window.location.href = '../html/login.html';
});

async function screenLoader(e) {
    e.preventDefault();
   

    try {
        let response = await axios.get('http://localhost:3000/expense/', {headers: {'Authorization': token}});
        response.data.map(expense => displayExpenses(expense));
    } catch (err) {
        console.log(err);
        window.location.href('../html/login.html');
        alert('Please login to continue!');
       
    };
};

form.addEventListener('submit', addExpense);

async function addExpense(e) {
    e.preventDefault();
    let token = localStorage.getItem('token');

    try {
        const expenseDetails = {
            amount: e.target.amount.value,
            description: e.target.description.value,
            category: e.target.category.value
        };

        let response = await axios.post('http://localhost:3000/expense/add-expense', expenseDetails, {headers:{'Authorization':token}});
        if (response.status === 201) {
            displayExpenses(response.data.data);
        } else {
            throw new Error('unable to add Expense!')
        };
        e.target.amount.value = '';
        e.target.description.value = '';
        e.target.category.value = '';
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
    let token = localStorage.getItem('token');
    try {
        await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, {headers:{'Authorization':token}});
        removeFromScreen(id);
    } catch(err) {
        console.log(err)
    };
};

function removeFromScreen(id) {
    let childElement = document.getElementById(id);
    ExpenseDiv.removeChild(childElement);
};

document.getElementById('premiumbtn').onclick = async function(e) {
    var x = true;
    let token = localStorage.getItem('token');
    try{
        const response = await axios.post('http://localhost:3000/payment/premiummembership', x, {headers:{'Authorization': token}});
        checkout(response.data);
    } catch(err) {
        console.log(err)
    };
};

function checkout(order) {
    let token = localStorage.getItem('token');
    var options = {
        "key": order.key_id,
        "amount": order.order.amount,
        "currency":"INR",
        "order_id": order.order.id,
        "handler": function (response) {
            alert('Payment Successful');
            axios.post('http://localhost:3000/payment/updatestatus', response, {headers:{'Authorization': token}})
            .then(res => {
                alert('You are a premium user now!');
                localStorage.setItem('user' , 'true')
            }).catch(err => console.log(err));
        },
        "prefill": {
            "email":"chirag@gmail.com",
            "contact":"7067445600"
        }
    };

    var rzp = new Razorpay(options);

    rzp.on('payment.failed', function(res) {
        alert(res.error.description);
    });
    rzp.open();
};

document.getElementById('logout').onclick = function(e) {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../html/login.html'
};