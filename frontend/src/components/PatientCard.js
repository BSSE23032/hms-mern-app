import { Link } from 'react-router-dom';

export default function PatientCard({ patient, onDelete }) {  //objects of Patients and delete function
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        {/* details of Patients */}
        <h5 className="card-title">{patient.name}</h5>
        <p className="card-text mb-1"><strong>Age:</strong> {patient.age}</p>
        <p className="card-text"><strong>Gender:</strong> {patient.gender}</p>
        <p className="card-text"><strong>Problem:</strong> {patient.med_problem}</p>
        <div className="d-flex gap-2">
          {/* for client-s_ide routing */}
          <Link to={`/edit/${patient._id}`} className="btn btn-sm btn-warning">  
            Edit
          </Link>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => onDelete(patient._id)}  // delete function
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
