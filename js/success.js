let currEmail = localStorage.getItem('currentUser');
if(currEmail){
    document.getElementById('curEmail').innerHTML = currEmail;
}