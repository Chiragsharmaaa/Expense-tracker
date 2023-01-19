const form = document.getElementById('reset');
form.addEventListener('submit', forgotpassword);

function forgotpassword(e) {
    e.preventDefault();
    let email = document.getElementById('email').value;
    axios.post('http://localhost:3000/password/forgotpassword', { email: email }).then(response => {
        if (response.status === 200) {
            document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
        } else {
            throw new Error('Something went wrong!!!')
        }
    }).catch(err => {
        document.body.innerHTML += `<div style="color:red;">${err} <div>`;
    })
}