import { useEffect, useState } from "react";
import api from "../api";

export default function AdminEmployees() {
  const [employees, setEmployees] = useState([]);

  // form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");

  // editing state
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    api.get("/employees").then(res => {
      setEmployees(res.data);
    });
  };

  // ADD EMPLOYEE
  const addEmployee = () => {
    if (!name || !email) {
      alert("Please enter name and email");
      return;
    }

    api.post("/employees", { name, email, role }).then(() => {
      alert("Employee added successfully");
      clearForm();
      loadEmployees();
    });
  };

  // START EDIT MODE
  const startEdit = (emp) => {
    setEditingId(emp.id);
    setName(emp.name);
    setEmail(emp.email);
    setRole(emp.role);
  };

  // UPDATE EMPLOYEE
  const updateEmployee = () => {
    if (!editingId) return;

    api.put(`/employees/${editingId}`, {
      name,
      email,
      role
    }).then(() => {
      alert("Employee updated successfully");
      clearForm();
      loadEmployees();
    });
  };

  // DELETE EMPLOYEE
  const deleteEmployee = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    api.delete(`/employees/${id}`).then(() => {
      alert("Employee deleted successfully");
      loadEmployees();   // VERY IMPORTANT
    });
  };

  // CLEAR FORM
  const clearForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setRole("employee");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin – Employee Management</h2>

      {/* ADD / UPDATE FORM */}
      <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
        <h3>{editingId ? "Update Employee" : "Add Employee"}</h3>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br /><br />

        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="admin">Admin</option>
        </select>

        <br /><br />

        {editingId ? (
          <>
            <button onClick={updateEmployee}>Update</button>{" "}
            <button onClick={clearForm}>Cancel</button>
          </>
        ) : (
          <button onClick={addEmployee}>Add</button>
        )}
      </div>

      {/* EMPLOYEES TABLE */}
      <h3>Employees List</h3>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.role}</td>
              <td>
                <button onClick={() => startEdit(emp)}>Edit</button>{" "}
                <button onClick={() => deleteEmployee(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
