import { useEffect, useState, useCallback } from 'react';
import PatientTable from '../components/PatientTable';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user_id = localStorage.getItem('userId');
  const user_role = localStorage.getItem('userRole');
  const doctor_name = localStorage.getItem('userName');

  // Moved fetchPatients outside useEffect so we can reuse it
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/patients';
      if (user_role === 'doctor') {
        url = `/api/patients/doctor/${encodeURIComponent(doctor_name)}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch patients');
      setPatients(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user_role, doctor_name]);

  useEffect(() => {
    if (user_id) {
      fetchPatients();
    } else {
      setError('Please log in to view patients');
      setLoading(false);
    }
  }, [user_id, fetchPatients]);

  const handleDelete = async (id) => {
    if (user_role !== 'admin') return;
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete patient');
      }

      setPatients(patients.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkVisited = async (id) => {
    try {
      const res = await fetch(`/api/patients/${id}/mark-visited`, {
        method: 'PATCH',
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Patient marked as visited:', data);
        await fetchPatients(); // ⬅️ Refresh the patient list after marking as visited
      } else {
        console.error('Error:', data.error);
      }
    } catch (err) {
      console.error('Network error:', err);
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container flex-grow-1 mt-4">
      <h3 className="mb-4">{user_role === 'doctor' ? 'My Patients' : 'All Patients'}</h3>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Problem</th>
                <th>Doctor</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <PatientTable
                  key={patient._id}
                  patient={patient}
                  on_delete={handleDelete}
                  on_mark_visited={handleMarkVisited}
                  role={user_role}
                  doctor={doctor_name}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
