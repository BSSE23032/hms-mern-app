import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from "../utils/mixpanel";
import {getItemWithExpiry} from '../utils/localStorageWithExpiry';
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
    if (getItemWithExpiry('userId')) navigate('/');
  }, [navigate]);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setAdminCode('');
    setSpecialization('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || !email || !password || !name ||
      (role === 'admin' && !adminCode) ||
      (role === 'doctor' && !specialization)) {
      setError(' Please fill all required fields.');
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
        setSuccess('Registration Successful. Redirecting to Login...');
        mixpanel.track('User Signed Up', { email, role });
        setTimeout(() => navigate('/signin'), 1500);
      } else {
        setError(data.error || ' Signup failed. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
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

        {role === 'admin' && (
          <div className="mb-3">
            <label>Admin Key:</label>
            <input
              type="number"
              className="form-control"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              required
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
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3 position-relative">
          <label>Password:</label>
          <input
            type={show_password ? 'text' : 'password'}
            className="form-control pe-5"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            className={`fa ${show_password ? 'fa-eye-slash' : 'fa-eye'} position-absolute`}
            onClick={() => setShowPassword(!show_password)}
            style={{ right: '10px', top: '38px', cursor: 'pointer', color: 'black' }}
          ></i>
        </div>

        <button type="submit" className="btn btn-success w-100">Sign Up</button>
      </form>
    </div>
  );
}
