document.addEventListener('DOMContentLoaded', () => {
    // setTimeout(function() {
    //     $('#notificationContainer').fadeOut('fast');
    // }, 2000);
    fetch('http://localhost:3000/message', {
        method: 'GET',
        headers: {
            'auth-token': localStorage.getItem('auth-token'),
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const data = await response.json()
                const email = localStorage.getItem('email')

                data.forEach((data) => {
                    if (email === data.sender.email) {
                        chatContainer.innerHTML += `<div class="self">
                    <p>${data.message}</p> </div>`
                    } else {
                        chatContainer.innerHTML += `<div class="other"> <h5>from ${data.sender.username}:</h5>
                        <p>${data.message}</p> </div>`
                    }
                })
                return;
            }
        })
        .catch(error => {
            window.alert(error)
        })
})

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/file', {
        method: 'GET',
        headers: {
            'auth-token': localStorage.getItem('auth-token'),
        },
    })
        .then(async (response) => {
            if (response.ok) {
                const data = await response.json()
                data.forEach((data) => {
                    fileContainer.innerHTML += `<div class="files">${data.title}<br>
                    <p class='fileSender'>sent by ${data.uploader.username}</p></div>`
                })
                return;
            }
        })
        .catch(error => {
            window.alert(error)
        })
})

document.addEventListener('DOMContentLoaded', () => {
    sendMessage.addEventListener('submit', (e) => {
        e.preventDefault();

        const message = { message: document.querySelector("#messageInput").value }
        const username = localStorage.getItem('username')


        fetch('http://localhost:3000/message', {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    chatContainer.innerHTML += `<div class="self">
                    <p>${data.message}</p></div>`

                    socket.emit('chat message', { msg: data.message, username })
                    document.getElementById('messageInput').value = ''
                    return
                }
            })
            .catch(error => {
                window.alert(error);
            })
    })
})

window.addEventListener('DOMContentLoaded', () => {
    uploadFile.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = localStorage.getItem('username')

        const fileFrm = document.getElementById('uploadFile');
        const formData = new FormData(fileFrm);
        formData.append('file', uploadedFile.file)


        fetch('http://localhost:3000/file/upload', {
            method: 'POST',
            headers: {
                'auth-token': localStorage.getItem('auth-token')
            },
            body: formData
        })
            .then(async (response) => {
                if (response.ok) {
                    const data = await response.json();
                    socket.emit('uploadFile', { msg: data.message, fileName: data.fileName, username })
                     document.getElementById('uploadedFile').value = ''
                }
            })
            .catch(error => {
                window.alert(error)
            })
    })
})

window.addEventListener('DOMContentLoaded', () => {

    socket.on('chat message', ({ msg, username }) => {
        chatContainer.innerHTML += `<div class="other"> <h5>from ${username}:</h5>
                        <p>${msg}</p> </div>`

        const reciever = localStorage.getItem('username')
        const isWindowClosed = window.closed
        if (isWindowClosed === false) {
            socket.emit('seenMessage', { isWindowClosed, reciever })
        }
    })

    socket.on('displayFile', ({ fileName, username }) => {
        fileContainer.innerHTML += `<div class="files">
        ${fileName}<br> 
        <p class='fileSender'>sent by ${username}</p>
        </div>`
    })

    socket.on('uploadFile', ({ username }) => {
        notificationContainer.innerHTML +=
            `<div id="notificationMessage"><p>${username} uploded a file</p></div>`

        setTimeout(function () {
            $('#notificationContainer').fadeOut('fast');
        }, 5000);
    })

    socket.on('seenMessage', ({ reciever }) => {
        notificationContainer.innerHTML +=
            `<div id="notificationMessage"><p>${reciever} see Message</p></div>`

        setTimeout(function () {
            $('#notificationContainer').fadeOut('fast');
        }, 5000);
    })
})

