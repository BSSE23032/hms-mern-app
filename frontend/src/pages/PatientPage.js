import { useEffect, useState } from 'react';
import PatientCard from '../components/PatientCard';

export default function PatientPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch('/api/patients');
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch patients');
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) return;
    
    try {
      const response = await fetch(`/api/patients/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete patient');
      }

      setPatients(patients.filter(p => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading patients...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container mt-4">
      <h3>All Patients</h3>
      {patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        patients.map(patient => (
          <PatientCard 
            key={patient._id} 
            patient={patient} 
            onDelete={handleDelete} 
          />
        ))
      )}
    </div>
  );
}