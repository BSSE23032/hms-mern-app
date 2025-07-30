import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientForm from '../components/PatientForm';
import mixpanel from "../utils/mixpanel";
export default function AddPatient() {
  const [isAllowed, setIsAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkIfAdmin = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        alert('You must log in first as Admin');
        navigate('/signin');
        return;
      }

      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        if (res.ok && data.role === 'admin') {
          setIsAllowed(true);
        } else {
          setIsAllowed(false)
          alert('Only admins can access this page');
          mixpanel.track('Visit the Add Patient page without being an admin', {
            role: 'doctor',
            name: localStorage.getItem('userName'),
            id: localStorage.getItem('userId'),
          });
          navigate('/');
        }
      } catch (err) {
        console.error(err);
        alert('Error checking admin access');
        navigate('/');
      }
    };

    checkIfAdmin();
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

