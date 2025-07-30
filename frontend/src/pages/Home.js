import mixpanel from '../utils/mixpanel';
import homeBanner from '../assets/img1.jpg';     
import PatientImg from '../assets/img2.jpg';     
export default function Home() {
  mixpanel.track('Visit Home Page');
  return (
    <div className="container mt-4">
      {/* Top banner card */}
      <div className="card shadow border-0 mb-4">
        <img src={homeBanner} alt="Hospital Banner" className="card-img-top rounded" />
        <div className="card-body text-center">
          <h2 className="card-title mb-3">Welcome to HMS</h2>
          <p className="card-text">
            Your health is our priority. At Aftab Medical & General Hospital, we provide compassionate care,
            advanced diagnostics, and treatment under expert supervision.
          </p>
        </div>
      </div>

      {/* Info & image row */}
      <div className="row align-items-center mt-5">
        <div className="col-md-6">
          <h3>Why Choose Us?</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Qualified and Experienced Doctors</li>
            <li className="list-group-item">24/7 Emergency Services</li>
            <li className="list-group-item">Modern Diagnostic and Treatment Facilities</li>
            <li className="list-group-item">Compassionate Patient-Centered Care</li>
            <li className="list-group-item">Affordable and Accessible Health Services</li>
          </ul>
        </div>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <img
            src={PatientImg}
            alt="Hospital Environment"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '250px', objectFit: 'cover' }}
          />
        </div>
      </div>
    </div>
  );
}
