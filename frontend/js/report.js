let urlContainer = document.getElementById('urldiv');

let sno = 0;

window.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    let token = localStorage.getItem('token');
    try {
        let response = await axios.get('http://localhost:3000/expense/getalldownloadurl', { headers: { 'Authorization': token } });
        if (response.status === 200) {
            showUrls(response.data);
        }
    } catch (error) {
        console.log(error);
    };
});
let report = document.getElementById('reportBtn');
report.addEventListener('click', async (e) => {
    e.preventDefault();
    let token = localStorage.getItem('token');
    try {
        let response = await axios.get('http://localhost:3000/expense/download', { headers: { 'Authorization': token } });
        if (response.status === 200) {
            // console.log(response.data.downloadURLData)
            showUrlOnscreen(response.data.downloadURLData);
            var a = document.createElement('a');
            a.href = response.data.fileURL;
            a.download = 'userexpense.csv';
            a.click();
        }
    } catch (err) {
        console.log(err)
    };

});

function showUrlOnscreen(data) {
    let child = `<li class="list" >
        <a href="${data.fileUrl}" class="expense-info">${sno + 1} ${data.fileName.split('/')[1]}</a>
    </li>`

    urlContainer.innerHTML += child
}

function showUrls(data) {
    urlContainer.innerHTML = ''
    data.urls.forEach(url => {
        let child = `
            <div class="row d-flex align-items-center justify-content-center
                min-vh-100 card shadow-sm w-50">
                <div class="col-12 col-md-8 col-lg-4 card-body" >
                    <li class="list" >
                        <a href="${url.fileUrl}" class="expense-info">${sno + 1}. ${url.fileName.split('/')[1]}</a>
                    </li>
                </div>
            </div>
            <br>`

        urlContainer.innerHTML += child

        sno++
    });
};