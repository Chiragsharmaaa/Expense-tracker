document.getElementById('report').onclick = function(e){
    e.preventDefault()
    let user = localStorage.getItem('user');
    if(user == "true"){
        window.location.href = '../html/report.html'
    };
}