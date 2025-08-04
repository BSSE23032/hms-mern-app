import { useEffect, useState } from 'react';
import mixpanel from "../utils/mixpanel";
import PatientTable from '../components/PatientTable';
import authFetch from "../utils/authFetch";
import {getItemWithExpiry} from '../utils/localStorageWithExpiry';
export default function PatientPage() {
  const user_id = getItemWithExpiry('userId');
  const user_role = getItemWithExpiry('userRole');
  const doctor_name = getItemWithExpiry('userName');

  const [patients, setPatients] = useState([]);
  const [tot_patients, setTotalPatients] = useState(0);
  const [tot_pages, setTotalPages] = useState(0);
  const [curr_page, setCurrentPage] = useState(1);
  const [entries_per_page] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search_term, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      let baseUrl = `/api/patients?page=${curr_page}&limit=${entries_per_page}&search=${search_term}`;
      if (user_role === 'doctor') {
        baseUrl = `/api/patients/doctor/${encodeURIComponent(doctor_name)}?page=${curr_page}&limit=${entries_per_page}&search=${search_term}`;
      }

      const response = await authFetch(baseUrl);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Failed to fetch patients');

      setPatients(data.patients);
      setTotalPages(data.tot_pages || 0);
      setTotalPatients(data.tot_patients || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchPatients();
      mixpanel.track("Visited Patient Page", { user_id, role: user_role });
      mixpanel.identify(user_id);
      mixpanel.people.set({ $name: doctor_name, role: user_role, user_id });
    } else {
      setError("Please log in to view patients.");
    }
  }, [curr_page, user_id, entries_per_page, search_term]);

  const handleDelete = async (id) => {
    if (user_role !== 'admin') return;
    if (!window.confirm('Are you sure you want to delete this patient?')) return;

    mixpanel.track('Click Delete Patient Button', { user_id, role: user_role });

    try {
      const response = await authFetch(`/api/patients/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete patient');
      }
      setCurrentPage(1);
      fetchPatients();
    } catch (err) {
      setError(err.message);
      mixpanel.track('Delete Patient Failed', { error: err.message, patientId: id, user_id });
    }
  };

  const handleMarkVisited = async (id) => {
    const patient_name = patients.find(p => p._id === id)?.name;
    mixpanel.track('Click mark as visited button', { doctor: doctor_name, user_id, patient: patient_name });

    try {
      const res = await authFetch(`/api/patients/${id}/mark-visited`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        fetchPatients();
      } else {
        console.error('Error:', data.error);
      }
    } catch (err) {
      console.error('Network error:', err);
      mixpanel.track('Mark Patient as visited failed', { doctor: doctor_name, user_id, patient: patient_name });
    }
  };
  const last_entry = curr_page * entries_per_page;
  const first_entry = last_entry - entries_per_page;

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container flex-grow-1 mt-4">
      <h3 className="mb-4">{user_role === 'doctor' ? 'My Patients' : 'All Patients'}</h3>
      <center><input
        type="text"
        className="form-control mb-3 w-50"
        placeholder="Search by name"
        value={search_term}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }
        }
      /></center>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="table-responsive">
          <center>
            Showing {first_entry + 1}–{Math.min(last_entry, tot_patients)} of {tot_patients} patients
          </center>
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

          <div className="d-flex justify-content-between align-items-center mt-3">
            <button
              className="btn btn-primary"
              onClick={() => {
                setLoading(true);
                setCurrentPage(prev => Math.max(prev - 1, 1));
              }}
              disabled={curr_page === 1}

            >
              Previous
            </button>

            <span>
              Page {curr_page} of {tot_pages}
            </span>


            <button
              className="btn btn-primary"

              onClick={() => {
                setLoading(true);
                setCurrentPage(prev => (prev < tot_pages ? prev + 1 : prev));
              }}
              disabled={curr_page >= tot_pages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
