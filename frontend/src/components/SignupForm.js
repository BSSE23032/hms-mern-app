import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from "../utils/mixpanel";
export default function SignupForm() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [specialization, setSpecialization] = useState('');
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
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setAdminCode('');
    setSpecialization('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Local field validation before sending to backend
    if (!role || !email || !password || !name ||
      (role === 'admin' && !adminCode) ||
      (role === 'doctor' && !specialization)) {
      setError(' Please fill all required fields.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    const user = {
      role,
      name,
      email,
      password,
      ...(role === 'admin' && { key: adminCode }),
      ...(role === 'doctor' && { specialization })
    };

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Registeration Successfull.');
        mixpanel.track('User Signed Up', {
          email: email,
          role: role,
          id: data.id,
        });
        navigate('/')
        setError('');
        setRole('');
        setName('');
        setEmail('');
        setPassword('');
        setAdminCode('');
        setSpecialization('');

      } else {
        if (data.error === 'This email is already in use') {
          setError(' This email is already registered. Please use another.');
        } else if (data.error === 'Wrong admin key') {
          setError(' Admin code is incorrect.');
        } else if (data.error === 'Admin key is required') {
          setError('Admin key is required to register as an admin.');
        } else {
          setError(data.error || ' Signup failed. Please try again.');
        }
        setSuccess('');
      }
    } catch (err) {
      setError('Something went wrong. Please check your internet and try again.');
      mixpanel.track('Sign Up Failed', {
        error: err.message || 'Unknown Error',
        email: email,
      });
      setSuccess('');
    }
  };

  return (
    <div className="container col-md-4 mt-5">
      <h2 className="mb-4 text-center">Sign Up</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Register as:</label>
          <select className="form-select" value={role} onChange={handleRoleChange} required>
            <option value="">-- Select Role --</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        {role && (
          <h5 className="text-center mb-3">
            <b>Role:</b> <span>{role}</span>
          </h5>
        )}

        {role === 'admin' && (
          <div className="mb-3">
            <label>Admin Key:</label>
            <input
              type="number"
              className="form-control"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
              placeholder="Enter admin key"
            />
          </div>
        )}

        {role === 'doctor' && (
          <div className="mb-3">
            <label>Specialization:</label>
            <select
              className="form-control"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              required
            >
              <option value="">-- Select Specialization --</option>
              <option value="Cardiologist">Cardiologist</option>
              <option value="Oncologist">Oncologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Eye Specialists">Eye Specialists</option>
              <option value="Urologist">Urologist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Neurosurgeon">Neurosurgeon</option>
            </select>
          </div>
        )}

        <div className="mb-3">
          <label>Name:</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="e.g. example@hospital.com"
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

        <button type="submit" className="btn btn-success w-100">Sign Up</button>
      </form>
    </div>
  );
}
