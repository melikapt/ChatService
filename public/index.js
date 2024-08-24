function showRegisterForm() {
    if (document.getElementById('loginForm').style.display === 'block') {
        document.getElementById('loginForm').style.display = 'none';
    }
    document.getElementById('registerForm').style.display = 'block';
}

function showLoginForm() {
    if (document.getElementById('registerForm').style.display === 'block') {
        document.getElementById('registerForm').style.display = 'none'
    }
    document.getElementById('loginForm').style.display = 'block';
}


window.addEventListener("DOMContentLoaded", () => {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const warningIcon = document.getElementsByClassName('fa fa-warning');
        if (warningIcon[0].style.display === 'block') {
            warningIcon[0].style.display = 'none'
        }

        document.getElementById('errMsg').innerHTML = ''

        const register = {
            username: document.querySelector("#usernameReg").value,
            email: document.querySelector("#emailReg").value,
            password: document.querySelector("#passwordReg").value
        }

        fetch('http://localhost:3000/user', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(register)
        })
            .then(async (response) => {
                if (response.ok) {
                    window.alert('successfully registered')
                    document.getElementById('usernameReg').value = ''
                    document.getElementById('passwordReg').value = ''
                    document.getElementById('emailReg').value = ''
                    return;
                }
                warningIcon[0].style.display = 'block';
                document.getElementById('errMsg').innerHTML = await response.text()
            })
            .catch(async (error) => {
                console.log(error);
                window.alert(error)
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const warningIcon = document.getElementsByClassName('fa fa-warning')
        if (warningIcon[1].style.display === 'block') {
            warningIcon[1].style.display = 'none'
        }
        document.getElementById('errMsgLogin').innerHTML = ''

        const login = {
            username: document.querySelector('#usernameLogin').value,
            password: document.querySelector('#passwordLogin').value
        }

        fetch('http://localhost:3000/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(login)
        })
            .then(async (response) => {
                if (response.ok) {
                    const data=await response.json();
                    localStorage.setItem('username',data.username);
                    localStorage.setItem('auth-token', data.token)
                    localStorage.setItem('email', data.email)
                    document.getElementById('usernameLogin').value = ''
                    document.getElementById('passwordLogin').value = ''
                    window.location.href = 'http://localhost:3000/chat.html'
                    return;
                }

                if (warningIcon[1].style.display === 'none') {
                    warningIcon[1].style.display = 'block'
                }
                document.getElementById('errMsgLogin').innerHTML = await response.text()
            })
            .catch(error => {
                window.alert(error)
                console.log(error);
            })
    })
})
