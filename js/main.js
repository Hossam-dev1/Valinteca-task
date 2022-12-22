const form = document.getElementById('register-form'),
    usernameElem = document.getElementById('username'),
    emailElem = document.getElementById('email'),
    passwordElem = document.getElementById('password'),
    confirm_passwordElem = document.getElementById('confirm-password'),
    pwShowHide = document.querySelectorAll('.showHidePw'),
    pwFields = document.querySelectorAll('.password');

let isUnameValid, isEmailValid, isPassValid, isCoPassValid;

form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (isInputsValid()) {
        fetchForm(form);
    };
})

usernameElem.addEventListener('keyup', () => {
    const usernameValue = usernameElem.value.trim();
    validateUserName(usernameValue);
})

emailElem.addEventListener('keyup', () => {
    const emailValue = emailElem.value.trim();
    validateEmail(emailValue)
})

passwordElem.addEventListener('keyup', () => {
    validatePassword(passwordElem)
})

confirm_passwordElem.addEventListener('keyup', () => {
    let isPassValid = validatePassword(confirm_passwordElem)
    if (isPassValid) {
        confirmPassword(passwordElem.value, confirm_passwordElem.value);
    }
})

function isInputsValid() {

    if (isUnameValid && isEmailValid && isPassValid && isCoPassValid) {
        console.log('all valid');
        return true
    }
    console.log('all not valid');
    return false
}
function fetchForm(formElem) {
    const formData = new FormData(formElem);
    const data = Object.fromEntries(formData)
    console.log(data);

    fetch('https://goldblv.com/api/hiring/tasks/register', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then(data => {
            if (data.errors?.username) { // username error message
                showErrorMsg(usernameElem, data.errors.username[0])
                return
            }
            else if (data.errors?.email) { // email error message
                showErrorMsg(emailElem, data.errors.email[0])
                return
            }
            else if (data.errors?.password) {  // password error message
                showErrorMsg(confirm_passwordElem, data.errors.password[0])
                showErrorMsg(passwordElem, '')
                return
            }
            handleSuccessReq(data.email)
        })
        .catch(err => console.log(err));
}

function handleSuccessReq(curUserEmail) {
    localStorage.setItem('currentUser', curUserEmail)
    const baseUrl = window.location.origin;
    // Redirect to Success page
    window.location.replace(`${origin}/success.html`)
}
function validateUserName(usernameValue) {

    if (usernameValue === '') {
        showErrorMsg(usernameElem, 'Username is required.')
        return isUnameValid = false
    }
    // check username char length
    if (usernameValue.length < 5 || usernameValue.length > 15) {
        showErrorMsg(usernameElem, 'Username must consist of 5 to 15 characters.')
        return isUnameValid = false
    }
    // check only letters && numbers
    const regexNoSpecialChar = new RegExp(/^[A-Za-z0-9]*$/);
    if (!regexNoSpecialChar.test(usernameValue)) {
        showErrorMsg(usernameElem, 'Username must has only letters and numbers.')
        return isUnameValid = false
    }

    // check start && end with string letter
    const regexLength = new RegExp(/^[A-Za-z]+[A-Za-z0-9]+[A-Za-z]$/);
    if (!regexLength.test(usernameValue)) {
        showErrorMsg(usernameElem, 'Username must start && end with string letter ')
        return isUnameValid = false
    }

    showSuccessFor(usernameElem);
    return isUnameValid = true
}
function validateEmail(emailValue) {

    if (emailValue === '') {
        showErrorMsg(emailElem, 'Email is required.')
        return isEmailValid = false
    }
    // check if email is valid
    const regexIsEmail = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!regexIsEmail.test(emailValue)) {
        showErrorMsg(emailElem, 'Email must be valid.')
        return isEmailValid = false
    }

    showSuccessFor(emailElem);
    return isEmailValid = true
}

function validatePassword(passwordElem) {

    if (passwordElem.value === '') {
        showErrorMsg(passwordElem, 'Password is required.')
        return isPassValid = false;
    }
    else if (passwordElem.value.length < 8) {
        showErrorMsg(passwordElem, 'Password must be at least 8 characters.')
        return isPassValid = false;
    }

    showSuccessFor(passwordElem)
    return isPassValid = true;
}

function confirmPassword(passwordVal, confirmPasswordVal) {

    if (passwordVal !== confirmPasswordVal) {
        showErrorMsg(confirm_passwordElem, 'Password must match confirm password.')
        return isCoPassValid = false;
    }

    showSuccessFor(passwordElem);
    return isCoPassValid = true;
}


function showErrorMsg(input, errorMsg) {
    const formControl = input.parentNode.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control error';
    small.className = 'v-msg show';
    small.innerText = errorMsg;
}

function showSuccessFor(input) {
    const formControl = input.parentNode.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-control success';
    small.className = 'v-msg';
    small.innerText = '';
}


//  show/hide password and change icon
pwShowHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        pwFields.forEach(pwField => {
            if (pwField.type === "password") {
                pwField.type = "text";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                })
            } else {
                pwField.type = "password";
                pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash");
                })
            }
        })
    })
})