const form = document.getElementById('container-form');

form.addEventListener('submit', login);

async function login(e) {
    e.preventDefault();

    try {
        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        };

        const response = await axios.post('http://localhost:3000/user/login', loginDetails)
        if(response.status == 200) {
            alert('Logged in Successfully!');
            localStorage.setItem('token', response.data.token);
            window.location.href = '../html/expense.html';
        } else {
            e.target.password.value = '';
            console.log('failure! check your credentials!')
        }
    } catch (error) {
        window.alert('Login Failed!')
        console.log(error);
    };
};

