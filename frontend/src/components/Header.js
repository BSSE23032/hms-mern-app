import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/signin');
  };

  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

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
          {/* Left-aligned nav items */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/patients" className="nav-link">Patients</Link>
            </li>

            {/* Conditionally show Add Patient only for admin */}
            {userRole === 'admin' && (
              <li className="nav-item">
                <Link to="/add" className="nav-link">Add Patient</Link>
              </li>
            )}
          </ul>

          {/* Right-aligned auth buttons */}
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
