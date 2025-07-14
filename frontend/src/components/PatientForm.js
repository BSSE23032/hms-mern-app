import { useState } from 'react';

export default function PatientForm() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [med_problem, setProblem] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim() || !age.trim() || !gender.trim() || !med_problem.trim()) {
      setError('All fields are required.');
      return;
    }

    const newPatient = {
      name,
      age: Number(age),
      gender,
      med_problem,
    };

    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        setSuccess('Patient added successfully!');
        setName('');
        setAge('');
        setGender('');
        setProblem('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || newPatient.name+' '+newPatient.age+' '+newPatient.gender+' '+newPatient.med_problem);
      }
    } catch (err) {
      console.error('Add patient error:', err);
      setError('Something went wrong. Please try again later.');
    }
  };

  return (
    <div className="card shadow p-4">
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter Patient name"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Age</label>
          <input
            className="form-control"
            type="number"
            value={age}
            onChange={e => setAge(e.target.value)}
            placeholder="Enter Patient's Age"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gender</label>
          <select
            className="form-control"
            value={gender}
            onChange={e => setGender(e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>


        <div className="mb-3">
          <label className="form-label">Problem</label>
          <input
            className="form-control"
            name="med_problem"
            value={med_problem}
            onChange={e => setProblem(e.target.value)}
            placeholder="Enter Patient's Problem"
          />
        </div>

        <button className="btn btn-success" type="submit">
          Add Patient
        </button>
      </form>
    </div>
  );
}
