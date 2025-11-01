import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
  });
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch API
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        const cities = [...new Set(data.map((user) => user.address.city))];
        setCountries(cities);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Load data from localStorage
  useEffect(() => {
    const savedRecords = JSON.parse(localStorage.getItem("records"));
    if (savedRecords) setRecords(savedRecords);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem("records", JSON.stringify(records));
    }
  }, [records]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.gender) newErrors.gender = "Select gender";
    if (!formData.country) newErrors.country = "Select country";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedRecords = [...records, formData];
    setRecords(updatedRecords);
    localStorage.setItem("records", JSON.stringify(updatedRecords));

    setFormData({
      name: "",
      email: "",
      gender: "",
      country: "",
    });

    alert("✅ Data added successfully!");
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1 className="fw-bold text-primary">🌍 API Integration Form</h1>
        <p className="text-muted">Fetch data, store locally, and display records elegantly</p>
      </div>

      {/* Card Form */}
      <div className="card shadow-lg p-4 mb-5 border-0 rounded-4">
        <h4 className="mb-4 text-secondary border-bottom pb-2">
          📝 Add New Record
        </h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Gender</label>
            <div className="d-flex gap-4 mt-1">
              <div className="form-check">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="male"
                />
                <label htmlFor="male" className="form-check-label">
                  Male
                </label>
              </div>

              <div className="form-check">
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === "Female"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="female"
                />
                <label htmlFor="female" className="form-check-label">
                  Female
                </label>
              </div>
            </div>
            {errors.gender && (
              <div className="text-danger small mt-1">{errors.gender}</div>
            )}
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Country (From API)</label>
            <select
              name="country"
              className={`form-select ${errors.country ? "is-invalid" : ""}`}
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countries.map((country, i) => (
                <option key={i} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && (
              <div className="invalid-feedback">{errors.country}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-3 fw-semibold">
            Add to Table
          </button>
        </form>
      </div>

      {/* Records Table */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h4 className="mb-3 text-secondary">📋 Saved Records</h4>
          {records.length === 0 ? (
            <p className="text-muted text-center">No records found. Please add some data.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle text-center">
                <thead className="table-primary">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {records.slice(0, 20).map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.gender}</td>
                      <td>{item.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
