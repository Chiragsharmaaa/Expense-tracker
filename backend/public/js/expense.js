const form = document.getElementById("container-form");
const ExpenseDiv = document.getElementById("expense-div");
const logoutBtn = document.querySelector("#logout");
const leaderboarddiv = document.getElementById("table");
let token = localStorage.getItem("token");
const pagination = document.getElementById("pagination");
const perpage = document.getElementById("perpage");
let itemsPerPage = Number(localStorage.getItem("itemsperpage"));

window.addEventListener("DOMContentLoaded", screenLoader);

form.addEventListener("submit", addExpense);

logoutBtn.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  alert("Logged out!");
  window.location.href = "../html/login.html";
});

perpage.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(+e.target.itemsPerPage.value);
  localStorage.setItem("itemsperpage", +e.target.itemsPerPage.value);
  itemsPerPage = localStorage.getItem("itemsperpage");
  loadExpenses(1, +e.target.itemsPerPage.value);
});

document.getElementById("table-box-id-id").style.visibility = "hidden";
document.getElementById("generatereport").style.display = "none";

async function screenLoader(e) {
  e.preventDefault();
  let userAuth = localStorage.getItem("user");
  if (userAuth == "true") {
    document.getElementById("premiumbtn").remove();
    document.getElementById("messageprem").innerHTML =
      "You are a Premium User!";
    getPremiumLeaderBoard();
  }

  let page = 1;
  loadExpenses(page, itemsPerPage);
}

async function loadExpenses(page, itemsPerPage) {
  try {
    let response = await axios.post(
      `http://localhost:3000/expense/${page}`, {
      itempsperpage: itemsPerPage
    }, {
      headers: {
        Authorization: token
      }
    }
    );
    if (response.data.data.length === 0) {
      return;
    }
    displayExpenses(response.data.data);
    showPagination(response.data.info);
  } catch (err) {
    console.log(err);
    window.location.href("../html/login.html");
    alert("Please login to continue!");
  }
}

function showPagination({
  currentPage,
  hasNextPage,
  hasPreviousPage,
  nextPage,
  previousPage,
  lastPage,
}) {
  pagination.innerHTML = "";

  if (hasPreviousPage) {
    const button1 = document.createElement("a");
    const li = document.createElement("li");
    li.classList.add("page-item");
    button1.classList.add("page-link");
    button1.innerHTML = previousPage;
    button1.addEventListener("click", () =>
      loadExpenses(previousPage, itemsPerPage)
    );
    li.appendChild(button1);
    pagination.appendChild(li);
  }
  const li2 = document.createElement("li");
  li2.classList.add("page-item");
  const button2 = document.createElement("a");
  button2.classList.add("active");
  button2.classList.add("page-link");
  button2.innerHTML = currentPage;
  button2.addEventListener("click", () =>
    loadExpenses(currentPage, itemsPerPage)
  );
  li2.appendChild(button2);
  pagination.appendChild(li2);

  if (hasNextPage) {
    const li3 = document.createElement("li");
    li3.classList.add("page-item");
    const button3 = document.createElement("a");
    button3.classList.add("page-link");
    button3.innerHTML = nextPage;
    button3.addEventListener("click", () =>
      loadExpenses(nextPage, itemsPerPage)
    );
    li3.appendChild(button3);
    pagination.appendChild(li3);
  }

  if (currentPage != lastPage && nextPage != lastPage && lastPage != 0) {
    const li4 = document.createElement("li");
    li4.classList.add("page-item");
    const button4 = document.createElement("a");
    button4.classList.add("page-link");
    button4.innerHTML = lastPage;
    button4.addEventListener("click", () =>
      loadExpenses(lastPage, itemsPerPage)
    );
    li4.appendChild(button4);
    pagination.appendChild(li4);
  }
}

async function addExpense(e) {
  e.preventDefault();
  let token = localStorage.getItem("token");

  try {
    const expenseDetails = {
      amount: e.target.amount.value,
      description: e.target.description.value,
      category: e.target.category.value,
    };

    let response = await axios.post(
      "http://localhost:3000/expense/add-expense",
      expenseDetails, {
      headers: {
        Authorization: token
      }
    }
    );
    if (response.status === 201) {
      displayExpenses(response.data.data);
    } else {
      throw new Error("unable to add Expense!");
    }
    e.target.amount.value = "";
    e.target.description.value = "";
    e.target.category.value = "";
  } catch (err) {
    console.log(err);
  }
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

window.addEventListener("DOMContentLoaded", () => {
  // const token = localStorage.getItem("token");
  // const decodedToken = parseJwt(token);
  // const isPremiumUser = decodedToken.ispremiumuser;
  const user = localStorage.getItem('user');
  if (user == 'true') {
    document.getElementById("showleaderboardbtn").style.display = "block";
    document.getElementById("generatereport").style.display = "block";
    document.getElementById("messageprem").innerHTML =
      "You are a Premium User!";
  } else {
    document.getElementById("showleaderboardbtn").style.display = "none";
    document.getElementById("generatereport").style.display = "none";
  }
});

function displayExpenses(data) {
  ExpenseDiv.innerHTML = "";
  data.map((data) => {
    const childElement = `<li class="list" id=${data.id}>
        <span class="expense-info"><div class="expense-amt-amount">₹ ${data.amount}</div><div class="expense-desc-desc">${data.description}</div> <div class="expense-cat-cat">${data.category}</span></div>
        <span class="btns">
            <input onclick="removeExpense('${data.id}')" type="submit" name="add" class="btn-sm" value="Delete">
        </span>
    </li>`;
    ExpenseDiv.innerHTML += childElement;
  });
}

async function removeExpense(id) {
  let token = localStorage.getItem("token");
  try {
    await axios.delete(`http://localhost:3000/expense/delete-expense/${id}`, {
      headers: {
        Authorization: token
      },
    });
    removeFromScreen(id);
  } catch (err) {
    console.log(err);
  }
}

function removeFromScreen(id) {
  let childElement = document.getElementById(id);
  ExpenseDiv.removeChild(childElement);
}

document.getElementById("premiumbtn").onclick = async function (e) {
  var x = false;
  let token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      "http://localhost:3000/payment/premiummembership",
      x, {
      headers: {
        Authorization: token
      }
    }
    );
    checkout(response.data);
  } catch (err) {
    console.log(err);
  }
};

function checkout(order) {
  let token = localStorage.getItem("token");
  var options = {
    key: order.key_id,
    amount: order.order.amount,
    currency: "INR",
    order_id: order.order.id,
    handler: function (response) {
      alert("Payment Successful");
      axios
        .post("http://localhost:3000/payment/updatestatus", response, {
          headers: {
            Authorization: token
          },
        })
        .then((response) => {
          console.log(response);
          alert("You are a premium user now!");
          document.getElementById("premiumbtn").style.display = "hidden";
          document.getElementById("showleaderboardbtn").style.display =
            "visible";
          document.getElementById("messageprem").innerHTML =
            "You are a Premium User!";
          localStorage.setItem("user", 'true');
        }).catch((err) => console.log(err));
    },
    prefill: {
      name: "Chirag",
      email: "chirag@gmail.com",
      contact: "7067445600",
    },
  };

  var rzp = new Razorpay(options);

  rzp.on("payment.failed", function (res) {
    alert(res.error.description);
  });
  rzp.open();
}

document.getElementById("logout").onclick = function (e) {
  e.preventDefault();
  localStorage.clear();
  window.location.href = "../html/login.html";
};
document.getElementById("showleaderboardbtn").onclick = function (e) {
  leaderboarddiv.scrollIntoView();
  e.preventDefault();
  getPremiumLeaderBoard();
  leaderboarddiv.innerHTML = "";
  document.getElementById("table-box-id-id").style.visibility = "visible";
};

async function getPremiumLeaderBoard() {
  try {
    const response = await axios.get(
      "http://localhost:3000/premium/premiumleaderboard", {
      headers: {
        Authorization: token
      }
    }
    );
    console.log('response', response)
    response.data.data.map((user) => {
      showLeaderboard(user);
    });
  } catch (err) {
    console.log(err);
  }
}

function showLeaderboard(user) {
  const child = `<tr>
    <th scope="row">${user.user._id}</th>
    <td>${user.user.name}</td>
    <td>₹ ${user.totalExpense}</td>
  </tr>`;

  leaderboarddiv.innerHTML += child;
}

document.getElementById("generatereport").onclick = function (e) {
  e.preventDefault();
  let user = localStorage.getItem("user");
  if (user == "true") {
    window.location.href = "../html/report.html";
  };
};