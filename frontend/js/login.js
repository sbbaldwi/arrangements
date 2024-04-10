document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const googleLoginBtn = document.getElementById('google-login-btn');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;

        fetch('/accounts/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.ok) {
                window.location.href = '/api-docs';
            } else {
                console.error('Login failed:', response.statusText);
                alert('Login failed: ' + response.statusText);
            }
        }).catch(error => {
            console.error('Error during login:', error);
            alert('Login error: ' + error.message);
        });
    });

    googleLoginBtn.addEventListener('click', function () {
        window.location.href = '/auth/google';
    });
});
