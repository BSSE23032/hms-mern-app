import { useEffect, useState, useCallback } from 'react';
import mixpanel from "../utils/mixpanel";
import PatientTable from '../components/PatientTable';
export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [curr_page, setCurrPage] = useState(1);
  const [enteries_per_page, setEnteriesPerPage] = useState(10);

  const user_id = localStorage.getItem('userId');
  const user_role = localStorage.getItem('userRole');
  const doctor_name = localStorage.getItem('userName');

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      let url = '/api/patients';
      if (user_role === 'doctor') {
        url = `/api/patients/doctor/${encodeURIComponent(doctor_name)}`;
      }
      setEnteriesPerPage(10);
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
     mixpanel.track("Visited Patient Page");
  }, [user_id, fetchPatients]);

  const handleDelete = async (id) => {
    if (user_role !== 'admin') return;
    mixpanel.track('Click Delete Patient Button');
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
      mixpanel.track('Delete Patient Failed',{
        name:patients.name
      }
      )
    }
  };

  const handleMarkVisited = async (id) => {
    mixpanel.track('Click mark as visitd button',
      {doctor: localStorage.getItem('userName'),
        patient: patients.find(patient => patient._id === id).name
      }
    );
    try {
      const res = await fetch(`/api/patients/${id}/mark-visited`, {
        method: 'PATCH',
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Patient marked as visited:', data);
        await fetchPatients();
      } else {
        console.error('Error:', data.error);
      }
    } catch (err) {
      console.error('Network error:', err);
      mixpanel.track('Mark Patient as visited failed',
        {
          doctor: localStorage.getItem('userName'),
          patient: patients.find(patient => patient._id === id).name,
        })
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  const last_entry = curr_page * enteries_per_page;
  const first_entry = last_entry - enteries_per_page;
  const visible_patients = patients.slice(first_entry, last_entry);

  return (

    <div className="container flex-grow-1 mt-4">
      <h3 className="mb-4">{user_role === 'doctor' ? 'My Patients' : 'All Patients'}</h3>

      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <center>Showing {first_entry + 1}–{Math.min(last_entry, patients.length)} of {patients.length} patients</center>
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
              {visible_patients.map((patient) => (

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
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => setCurrPage((prev) => Math.max(prev - 1, 1))}
              disabled={curr_page === 1}
            >
              Previous
            </button>

            <span>
              Page {curr_page} of {Math.ceil(patients.length / enteries_per_page)}
            </span>

            <button
              className="btn btn-primary"
              onClick={() =>
                setCurrPage((prev) =>
                  prev < Math.ceil(patients.length / enteries_per_page)
                    ? prev + 1
                    : prev
                )
              }
              disabled={curr_page >= Math.ceil(patients.length / enteries_per_page)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
