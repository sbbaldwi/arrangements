document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = registerForm.username.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;

        fetch('/accounts/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            if (response.ok) {
                alert('Account created successfully. Please log in.');
                window.location.href = '/accounts/login'; // Redirect to login page
            } else {
                console.error('Registration failed:', response.statusText);
                alert('Registration failed: ' + response.statusText);
            }
        }).catch(error => {
            console.error('Error during registration:', error);
            alert('Registration error: ' + error.message);
        });
    });
});