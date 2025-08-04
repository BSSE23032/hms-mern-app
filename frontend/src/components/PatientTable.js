import { Link } from 'react-router-dom';

export default function PatientTable({ patient, on_delete, on_mark_visited, role, doctor }) {
  return (
    <tr>
      <td>{patient.name}</td>
      <td>{patient.age}</td>
      <td>{patient.gender}</td>
      <td>{patient.med_problem}</td>
      <td>{patient.doctor}</td>
      <td>

        {role === 'admin' && !patient.visited && (
          <div className="btn-group">
            <Link to={`/edit/${patient._id}`} className="btn btn-sm btn-warning me-2">
              Edit
            </Link>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => on_delete(patient._id)}
            >
              Delete
            </button>
          </div>
        )}

        {role === 'admin' && patient.visited && (
          <span className="badge bg-success">Visited</span>
        )}
        {role === 'doctor' && patient.doctor === doctor && !patient.visited && (
          <button
            className="btn btn-sm btn-success"
            onClick={() => on_mark_visited(patient._id)}
          >
            Mark as Visited
          </button>
        )}

        {role === 'doctor' && patient.doctor === doctor && patient.visited && (
          <span className="badge bg-success">Visited</span>
        )}
      </td>
    </tr>
  );
}
