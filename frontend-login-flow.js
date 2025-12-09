// frontend-login-flow.js

// 1. Login Button Click
function handleGoogleLogin() {
  // Redirect to Composite service
  window.location.href = 'https://your-cloud-run-url/auth/google';
}

// 2. OAuth Callback Page (e.g., /callback.html)
async function handleCallback() {
  try {
    // Get the authorization code from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // Exchange code for JWT via Composite
      const response = await fetch('https://your-cloud-run-url/auth/google/callback?code=' + code);
      const data = await response.json();

      if (data.jwt) {
        // Store JWT
        localStorage.setItem('token', data.jwt);

        // Redirect to main app
        window.location.href = '/dashboard';
      }
    }
  } catch (error) {
    console.error('OAuth callback failed:', error);
  }
}

// 3. Making Authenticated Requests
async function fetchUserProfile() {
  const token = localStorage.getItem('token');

  if (!token) {
    // Redirect to login
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch('https://your-cloud-run-url/api/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch profile:', error);
  }
}

// 4. Logout
function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}