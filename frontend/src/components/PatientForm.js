import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mixpanel from "../utils/mixpanel";
export default function PatientForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [med_problem, setProblem] = useState('');
  const [error, setError] = useState('');
  const [doctor, setDoctor] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCancel = () => {
    mixpanel.track('Press Cancel Button');
    navigate('/'); 
  };
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`/api/users/doctors?specialization=${encodeURIComponent(med_problem)}`);
        const data = await response.json();

        if (response.ok) {
          setFilteredDoctors(data);
        } else {
          console.error('Error fetching doctors:', data.message);
          setFilteredDoctors([]);
        }
      } catch (err) {
        console.error('Doctor fetch error:', err);
        setFilteredDoctors([]);
      }
      mixpanel.track("Visited Add Patient Form");
    };

    if (med_problem) {
      fetchDoctors();
    } else {
      setFilteredDoctors([]);
    }
  }, [med_problem]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !gender || !med_problem || !doctor) {
      setError("All fields are required.");
      return;
    }
    if (name.trim().length > 20) {
      setError('Name cannot exceed 20 characters.');
      return;
    } else if (age < 1 || age > 100) {
      setError('Age should be between 1 and 100.');
      return;
    }
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, gender, med_problem, doctor }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Patient added successfully');
         mixpanel.track('Patient Added', {
              name: name,
              doctor: doctor,
  });
        setName('');
        setAge('');
        setGender('');
        setProblem('');
        setDoctor('');
      } else {
        setMessage(data.message || 'Failed to add patient');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setMessage('Something went wrong');
      mixpanel.track('Add Patient Failed', {
      error: err.message || 'Unknown Error',e});

    }
  };

  return (
    <div className="container mt-4">
      <center><small>All the fields with <b className='text-danger'>*</b> are required.</small></center>
      <div className="card p-4 shadow">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="form-group">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="mb-3">
                <label>Name: <b className='text-danger'>*</b></label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <small>The name should not exceed 20 characters</small>
              </div>

              <div className="mb-3">
                <label>Age: <b className='text-danger'>*</b></label>
                <input
                  type="number"
                  className="form-control"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
                <small>Age should be between 1 and 100</small>
              </div>

              <div className="mb-3">
                <label>Gender: <b className='text-danger'>*</b></label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">-- Select Gender --</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Problem (Specialization): <b className='text-danger'>*</b></label>
                <select
                  className="form-control"
                  value={med_problem}
                  onChange={(e) => setProblem(e.target.value)}
                  required
                >
                  <option value="">-- Select Problem --</option>
                  <option value="Cardiologist">Heart Issues (Cardiologist)</option>
                  <option value="Oncologist">Cancer Treatment (Oncologist)</option>
                  <option value="Gastroenterologist">Digestive Issues (Gastroenterologist)</option>
                  <option value="Dermatologist">Skin Issues (Dermatologist)</option>
                  <option value="Eye Specialists">Vision Problems (Eye Specialists)</option>
                  <option value="Urologist">Urinary Issues (Urologist)</option>
                  <option value="Gynecologist">Women's Health (Gynecologist)</option>
                  <option value="Neurosurgeon">Brain/Spinal Issues (Neurosurgeon)</option>
                </select>
              </div>

              <div className="mb-3">
                <label>Doctor: <b className='text-danger'>*</b></label>
                <select
                  className="form-control"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  required
                >
                  <option value="">-- Select Doctor --</option>
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doc) => (
                      <option key={doc._id} value={doc.name}>
                        {doc.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No doctors found</option>
                  )}
                </select>
                <small>Problem should be selected first from list</small>
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>

              {message && <div className="mt-3 alert alert-info">{message}</div>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );

}
