import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SigninForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [show_password, setShowPassword] = useState(false);
  const navigate = useNavigate();
 useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    navigate('/');  // redirect to homepage if already logged in
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill all required fields.');
      return;
    }

    const user = {
      email,
      password
    };

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Login successful! Redirecting...');
        setError('');
        if (data && data._id) {
    // When receiving login response
    localStorage.setItem('userId', data._id);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userName', data.name); // Store the name
    localStorage.setItem('userSpecialization', data.specialization);
        } else {
          console.error("User data missing in response:", data);
          setError("Unexpected server response. Please try again.");
          return;
        }


        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
    
          setError(data.message || data.error || ' Invalid email or password.');
        
        setSuccess('');
      }
    } catch (err) {
      setError(' Network error. Please try again.');
      console.error('Login error:', err); 
      setSuccess('');
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
  style={{
    right: '10px',
    top: '38px',
    cursor: 'pointer',
    color: 'black',
  }}
></i>
</div>

        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}
