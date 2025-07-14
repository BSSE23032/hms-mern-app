import { Link } from 'react-router-dom';      //to allow client-side navigation
//header
export default function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark dark bg-dark">
      <div className="container">
        {/* to reload pages */}
        <Link to="/" className="navbar-brand">Patient Management</Link> 
        {/* set margin auto */}
          <ul className="navbar-nav ms-auto">   
            <li className="nav-item">
              {/* nav item */}
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/Patients" className="nav-link">Patients</Link>
            </li>
            <li className="nav-item">
              <Link to="/add" className="nav-link">Add Patient</Link>
            </li>
          </ul>
        </div>
    </nav>
  );
}
