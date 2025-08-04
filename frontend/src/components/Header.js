import { Link, useNavigate } from 'react-router-dom';
import mixpanel from '../utils/mixpanel';
import {getItemWithExpiry} from '../utils/localStorageWithExpiry';
export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); 
    mixpanel.track('User Logged Out');
    navigate('/signin');
  };

  const userId = getItemWithExpiry('userId');
  const userRole = getItemWithExpiry('userRole');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">Patient Management</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/patients" className="nav-link">Patients</Link>
            </li>

            {userRole === 'admin' && (
              <li className="nav-item">
                <Link to="/add" className="nav-link">Add Patient</Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center">
            {userId ? (
              <>
                <span className="text-light me-3">Role: {userRole}</span>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/signin" className="btn btn-outline-primary me-2">Login</Link>
                <Link to="/signup" className="btn btn-outline-success">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
