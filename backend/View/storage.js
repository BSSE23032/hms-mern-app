// To toggle fields based on selected role during Sign Up and Login
function toggleFields(role, isLogin = false) {
    const roleSelect = isLogin ? document.getElementById('login_role') : document.getElementById('role');
    const usernameField = isLogin ? document.getElementById('login_username_field') : document.getElementById('username_field');
    const emailField = isLogin ? document.getElementById('login_email_field') : document.getElementById('email_field');
    const keyField = isLogin ? document.getElementById('login_key_field') : document.getElementById('key_field');
    const passwordField = isLogin ? document.getElementById('login_password_field') : document.getElementById('password_field');
    // Visibility based on role selection
    if (role === 'admin') {
        keyField.style.display = 'block'; // Admin has key 
    } else {
        keyField.style.display = 'none'; // Patient doesn't have key
    }
    // Show email and password
    emailField.style.display = 'block';
    passwordField.style.display = 'block';
    // Show username field for sign-up and login
    if (!isLogin) {
        usernameField.style.display = 'block'; // Show for signup
    }
}
// Sign-up functionality
function signUp(event) {
    event.preventDefault(); // To avoid page reload
    const username = document.getElementById('signup_username').value;
    const email = document.getElementById('signup_email').value;
    const key = document.getElementById('signup_key').value;
    const password = document.getElementById('signup_password').value;
    const role = document.getElementById('role').value;
    // Get users from localStorage or initialize an empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Check if username already exists
    if (users.some(user => user.username === username)) {
        alert('Username already exists!');
        return;
    }
    // Create new user object
    const newUser = {
        username,
        email,
        password, // Store the password
        role,
        key: role === 'admin' ? key : null // Admin has a key, patients do not
    };
    // Add new user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('User signed up:', newUser); 
    alert('Sign-up successful!');
    window.location.href = 'index.html'; // Redirect to homepage
}
// Login functionality
function login(event) {
    event.preventDefault(); // To avoid page reload
    const email = document.getElementById('login_email').value;
    const password = document.getElementById('login_password').value;
    const role = document.getElementById('login_role').value;
    const key = document.getElementById('login_key') ? document.getElementById('login_key').value : null;
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    // Find user by email and role
    const user = users.find(u => u.email === email && u.role === role);
    if (!user) {
        alert('Invalid Email or Role');
        return;
    }
    // Check for password
    if (user.password !== password) {
        alert('Incorrect password');
        return;
    }
    // If Admin role is selected, check if Admin Key is correct
    if (role === 'admin' && user.key !== key) {
        alert('Invalid Admin Key');
        return;
    }
    // Successful login
    alert(`${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully!`);
    window.location.href = `index.html`; // Redirect to Home page based on the role
}
// Save data to localStorage using Ctrl + S
function handleSave(event) {
    // Detect if Ctrl + S is pressed
    if (event.ctrlKey && event.key === 's') {
        event.preventDefault(); // Prevent the default save behavior (which is the browser's save dialog)
        
        const users = JSON.parse(localStorage.getItem('users')) || [];
        if (users.length > 0) {
            alert('Data has been saved!');
        } else {
            alert('No user data to save!');
        }
    }
}
// Attach the event listener for Ctrl + S
window.addEventListener('keydown', handleSave);

