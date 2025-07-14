// Function to load suggestions from localStorage
function loadSuggestions(datalistId, storageKey) {
    const datalist = document.getElementById(datalistId);
    const suggestions = JSON.parse(localStorage.getItem(storageKey)) || [];
    suggestions.forEach(suggestion => {
        const option = document.createElement('option');
        option.value = suggestion;
        datalist.appendChild(option);
    });
}
// Function to add new suggestions and update localStorage
function addSuggestion(storageKey, newValue) {
    let suggestions = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (!suggestions.includes(newValue)) {
        suggestions.push(newValue);
        localStorage.setItem(storageKey, JSON.stringify(suggestions));
    }
}
// Function to handle form submission and add patient data to the table
function addPatientsIntoTheTable(event) {
    event.preventDefault();
    var name = document.pat_sample.name.value;
    var age = document.pat_sample.age.value;
    var gender = document.pat_sample.gender.value;
    var condition = document.pat_sample.condition.value;
    addSuggestion("nameSuggestionsStorage", name);
    addSuggestion("conditionSuggestionsStorage", condition);
    var tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${name}</td>
        <td>${age}</td>
        <td>${gender}</td>
        <td>${condition}</td>
        <td>
            <button class="btn btn-sm btn-primary me-2" onclick="editPatient(this)">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
    var tbody = document.querySelector('#pat_data tbody');
    tbody.appendChild(tr);
    // Reset the form after adding a patient
    document.pat_sample.reset();
}
// Function to edit a patient row
function editPatient(button) {
    const row = button.closest('tr');
    const name = row.cells[0].textContent;
    const age = row.cells[1].textContent;
    const gender = row.cells[2].textContent;
    const condition = row.cells[3].textContent;
    document.pat_sample.name.value = name;
    document.pat_sample.age.value = age;
    document.pat_sample.gender.value = gender;
    document.pat_sample.condition.value = condition;
    // Change button text to "Update Patient" and set the function for update
    document.getElementById("addPatientBtn").innerText = "Update Patient";
    document.getElementById("addPatientBtn").setAttribute("onclick", `updatePatient(event, this, row)`); // Set update function on click
}
// Function to update patient data
function updatePatient(event, button, row) {
    event.preventDefault();
    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const gender = document.getElementById("gender").value;
    const condition = document.getElementById("condition").value.trim();
    if (confirm("Are you sure you want to update this record?")) {
        row.cells[0].textContent = name;
        row.cells[1].textContent = age;
        row.cells[2].textContent = gender;
        row.cells[3].textContent = condition;
        // Reset the button back to "Add Patient" and set the function for adding patient
        document.getElementById("addPatientBtn").innerText = "Add Patient";
        document.getElementById("addPatientBtn").setAttribute("onclick", "addPatientsIntoTheTable(event)");
        // Reset form
        document.pat_sample.reset();
    }
}
// Function to delete a patient row
function deleteRow(button) {
    if (confirm("Are you sure you want to delete this record?")) {
        const row = button.closest('tr');
        row.remove();
    }
}
// Function to sort the table by Name column
function sortTableByName() {
    const table = document.getElementById("pat_data");
    const rows = Array.from(table.rows).slice(1); // Skip the header row
    const sortedRows = rows.sort((a, b) => {
        const nameA = a.cells[0].textContent.toLowerCase();
        const nameB = b.cells[0].textContent.toLowerCase();
        return nameA.localeCompare(nameB);
    });
    const tbody = table.querySelector('tbody');
    sortedRows.forEach(row => tbody.appendChild(row));
}
// Load suggestions on page load
document.addEventListener('DOMContentLoaded', () => {
    loadSuggestions("nameSuggestions", "nameSuggestionsStorage");
    loadSuggestions("conditionSuggestions", "conditionSuggestionsStorage");
});
async function addPatient() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const gender = document.getElementById("gender").value.trim();
  const med_problem = document.getElementById("condition").value.trim();
  
  if (!name || !age || !gender || !med_problem) return alert("Please fill all fields");

  const res = await fetch("/api/patients", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, age,gender,med_problem })
  });

  const data = await res.json();
  console.log("Patient added:", data);
  loadPatients();
}

async function loadPatients() {
  const res = await fetch("/api/patients");
  const users = await res.json();

  const list = document.getElementById("pat_data");
  list.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("table");
    li.className = "table table-striped";
    li.textContent = `${user.name} (${user.age}) (${user.gender}) (${user.med_problem})`;
    list.appendChild(li);
  });
}

loadPatients();
