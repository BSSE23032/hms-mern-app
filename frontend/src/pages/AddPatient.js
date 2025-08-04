import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import mixpanel from "../utils/mixpanel";
import authFetch from "../utils/authFetch";
import { getItemWithExpiry } from "../utils/localStorageWithExpiry";

export default function AddPatient() {

  const user_id = getItemWithExpiry('userId');
  const user_role = getItemWithExpiry('userRole');
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    if (!user_id || !user_role) {
      alert('Session expired. Please log in again.');
      mixpanel.track("Session expired on Add Patient");
      navigate('/signin');
      return;
    }

    const fetchRole = async () => {
      try {
        const res = await authFetch(`/api/users/${user_id}`);
        const data = await res.json();
        console.log('Role from API:', data.role);
        console.log('Role from localStorage:', user_role);

        if (res.ok && data.role?.toLowerCase() === 'admin') {

          setIsAllowed(true);
        } else {
          setIsAllowed(false);
          alert(`Only admins can access this page. You are: "${data.role}"`);

          mixpanel.track('Visit Add Patient without admin access', {
            role: user_role,
            id: user_id,
          });
        }
      } catch (err) {
        console.error("Error verifying role:", err);
        alert('Error verifying user role');
      }
    };

    fetchRole();
  }, [navigate]);

    if (!isAllowed) return <p>Checking access...</p>;

  return (
    <div className="container mt-3">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <h3 className="text-dark mb-4 text-center border-bottom pb-2">Add a New Patient</h3>
          <PatientForm />
        </div>
      </div>
    </div>
  );
}
