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
            console.log('success! user logged in!');
        } else {
            console.log('failure! check your credentials!')
        }
    } catch (error) {
        document.body.innerHTML = `<div style="color:red;text-align:center">${error}</div>`
    };
};