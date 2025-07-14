import homeBanner from '../assets/img1.jpg';      // Importing the home banner image
import PatientImg from '../assets/img2.jpg';      // Importing the Patient image
export default function Home() {
  return (
    <div className="container mt-4">
      {/* Top banner card */}
      <div className="card shadow border-0 mb-4">
        <img src={homeBanner} alt="Patient Management" className="card-img-top rounded" />
        <div className="card-body text-center"> 
          {/* centeralized text beneath photo  */}
          <h2 className="card-title mb-3">Welcome to the Patient Management System</h2>
          <p className="card-text">
            Manage Patient information easily with our user-friendly React.js application.
            Use the navigation bar above to add new Patients, view all Patients, or update records.
          </p>
        </div>
      </div>
      {/* Info & image row */}
      <div className="row align-items-center mt-5">
        <div className="col-md-6">
          <h3>Why Use This App?</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"> Add & Edit Patient records</li>
            <li className="list-group-item"> View all Patients in one place</li>
            <li className="list-group-item"> Data saved using browser LocalStorage</li>
            <li className="list-group-item"> Fast, responsive UI with React.js & Bootstrap</li>
          </ul>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={PatientImg}
            alt="Patients"        // alignment of image
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '250px', objectFit: 'cover', marginLeft: '260px' }}
          />
        </div>
      </div>
    </div>
  );
}
