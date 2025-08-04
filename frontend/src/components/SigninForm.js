import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from "../utils/mixpanel";
import { setItemWithExpiry, getItemWithExpiry } from '../utils/localStorageWithExpiry';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show_password, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getItemWithExpiry('userId');
    if (userId) navigate('/');

  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Login successful! Redirecting...');
        const userData = data.user;
        const expiry = 3600000;
        setItemWithExpiry('token', data.token, expiry);
        setItemWithExpiry('userId', data.user._id, expiry);
        setItemWithExpiry('userRole', data.user.role, expiry);
        setItemWithExpiry('userName', data.user.name, expiry);
        setItemWithExpiry('userSpecialization', data.user.specialization);

        mixpanel.track('User Signed In', { email, role: userData.role });
        mixpanel.identify(userData._id);
        mixpanel.people.set({ $name: userData.name, role: userData.role, user_id: userData._id });

        setTimeout(() => navigate('/'), 1500);
      } else {
        setError(data.message || data.error || 'Invalid email or password.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container col-md-4 mt-5">
      <h2 className="mb-4 text-center">Login</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            placeholder='e.g. example@hospital.com'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3 position-relative">
          <label>Password:</label>
          <input
            type={show_password ? 'text' : 'password'}
            className="form-control pe-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <i
            className={`fa ${show_password ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
            onClick={() => setShowPassword(!show_password)}
            style={{ right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
          ></i>
        </div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
