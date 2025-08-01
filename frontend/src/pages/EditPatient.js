import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import mixpanel from '../utils/mixpanel';
export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');
  const [filtered_doctors, setfilteredDoctors] = useState([]);

  const handleCancel = () => {
    navigate('/');
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await fetch(`/api/patients/${id}`);
        const data = await res.json();
        if (res.ok) {
          setPatient(data);
        } else {
          navigate('/patients');
        }
      } catch (err) {
        console.error(err);
        navigate('/patients');
      }
    };
    fetchPatient();
  }, [id, navigate]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!patient?.med_problem) return;
      try {
        const res = await fetch(`/api/users/doctors?specialization=${encodeURIComponent(patient.med_problem)}`);
        const data = await res.json();
        if (res.ok) {
          setfilteredDoctors(data);
        } else {
          setfilteredDoctors([]);
        }
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setfilteredDoctors([]);
      }
    };
    mixpanel.track('Visit Edit Patient Page');
    mixpanel.identify(localStorage.getItem('userId'));
    mixpanel.people.set({
      $name: localStorage.getItem('userName'),
      role: localStorage.getItem('userRole'),
      user_id: localStorage.getItem('userId')
    });
    fetchDoctors();
  }, [patient?.med_problem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patient.name || !patient.age || !patient.gender || !patient.med_problem || !patient.doctor) {
      setError("All fields are required.");
      return;
    }
    if (patient.name.trim().length > 20) {
      setError('Name cannot exceed 20 characters.');
      return;
    } else if (patient.age < 1 || patient.age > 100) {
      setError('Age should be between 1 and 100.');
      return;
    }

    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patient),
      });

      if (res.ok) {
        mixpanel.track('Patient Updated', {
          patint_id: patient._id,
          patient: patient.name,
          admin: localStorage.getItem('userName'),
          user_id: localStorage.getItem('userId'),
        });
        navigate('/patients');
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update patient.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
      mixpanel.track('Update Patient Failed', {
        error: err.message || 'Unknown Error',
        patientId: patient._id,
        id: localStorage.getItem('userId'),
        role: localStorage.getItem('userRole'),
      });
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <h3 className="text-dark mb-4 text-center border-bottom pb-2">Edit Patient</h3>
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
                      name="name"
                      className="form-control"
                      value={patient.name}
                      onChange={handleChange}
                      required
                    />
                    <small>The name should not exceed 20 characters</small>
                  </div>

                  <div className="mb-3">
                    <label>Age: <b className='text-danger'>*</b></label>
                    <input
                      type="number"
                      name="age"
                      className="form-control"
                      value={patient.age}
                      onChange={handleChange}
                      required
                    />
                    <small>Age should be between 1 and 100</small>
                  </div>

                  <div className="mb-3">
                    <label>Gender: <b className='text-danger'>*</b></label>
                    <select
                      name="gender"
                      className="form-control"
                      value={patient.gender}
                      onChange={handleChange}
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
                      name="med_problem"
                      className="form-control"
                      value={patient.med_problem}
                      onChange={handleChange}
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
                      name="doctor"
                      className="form-control"
                      value={patient.doctor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select Doctor --</option>
                      {filtered_doctors.length > 0 ? (
                        filtered_doctors.map((doc) => (
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
                    <button type="submit" className="btn btn-primary">Save Changes</button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}