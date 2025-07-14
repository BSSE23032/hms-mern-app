import PatientForm from '../components/PatientForm';    //import syudent form
// 
export default function AddPatient() {
  return (
    <div className="container mt-4 ">
      <h3>Add a New Patient</h3>
      {/* render Patient form */}
      <PatientForm /> 
    </div>
  );
}
