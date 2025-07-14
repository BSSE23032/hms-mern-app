import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  // Fetch patient from MongoDB
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

  const handleChange = (e) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient.name || !patient.age || !patient.gender || !patient.med_problem) {
      setError("All fields are required.");
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
        navigate('/patients');
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update patient.");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  };

  if (!patient) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow">
        <h4>Edit Patient</h4>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input className="form-control" name="name" value={patient.name} onChange={handleChange} />
          </div>
          <div className="mb-3">
            <label className="form-label">Age</label>
            <input className="form-control" type="number" name="age" value={patient.age} onChange={handleChange} />
          </div>
       <div className="mb-3">
            <label className="form-label">Gender</label>
            <select
              className="form-control"
              name="gender"
              value={patient.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Problem</label>
            <input className="form-control" name="med_problem" value={patient.med_problem} onChange={handleChange} />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
