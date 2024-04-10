document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const googleLoginBtn = document.getElementById('google-login-btn');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');

    // Function to toggle between login and registration forms
    function toggleForms() {
        loginForm.style.display = (loginForm.style.display === 'none' ? '' : 'none');
        registerForm.style.display = (registerForm.style.display === 'none' ? '' : 'none');
    }

    // Link to switch to the registration form
    registerLink.addEventListener('click', function (e) {
        e.preventDefault();
        toggleForms();
    });

    // Link to switch back to the login form
    loginLink.addEventListener('click', function (e) {
        e.preventDefault();
        toggleForms();
    });

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = loginForm.email.value;
        const password = loginForm.password.value;

        // Send login request to server using fetch
        fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // If login is successful, redirect the user to the dashboard or home page
                window.location.href = '/api-docs'; // Change '/dashboard' to the appropriate URL
            } else {
                // If login fails, display an error message to the user
                console.error('Login failed:', response.statusText);
            }
        }).catch(error => {
            console.error('Error during login:', error);
        });
    });

    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const username = registerForm.username.value;
        const email = registerForm.email.value;
        const password = registerForm.password.value;

        // Send registration request to server using fetch
        fetch('/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                alert('Account created successfully. Please log in.');
                toggleForms(); // Switch to the login form
            } else {
                // If registration fails, display an error message to the user
                console.error('Registration failed:', response.statusText);
            }
        }).catch(error => {
            console.error('Error during registration:', error);
        });
    });

    googleLoginBtn.addEventListener('click', function () {
        // Redirect user to Google login page
        window.location.href = '/auth/google';
    });
});
