import React, { useState, useEffect } from "react";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./App.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
    city: "",
  });
  const [records, setRecords] = useState([]);
  const [errors, setErrors] = useState({});

  // Fetch countries from API
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => setCountries(data.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Load saved records
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

  // Update cities when country changes
  useEffect(() => {
    if (formData.country) {
      const selected = countries.find(
        (item) => item.country === formData.country
      );
      setCities(selected ? selected.cities : []);
      setFormData({ ...formData, city: "" });
    }
  }, [formData.country, countries]);

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
    if (!formData.city) newErrors.city = "Select city";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      const updatedRecords = [...records, data];
      setRecords(updatedRecords);
      localStorage.setItem("records", JSON.stringify(updatedRecords));

      setFormData({ name: "", email: "", gender: "", country: "", city: "" });
      alert("✅ Data submitted successfully!");
    } catch (error) {
      console.error("Error posting data:", error);
      alert("❌ Failed to post data!");
    }
  };

  // React Select handlers
  const handleCountryChange = (selectedOption) => {
    setFormData({ ...formData, country: selectedOption?.value || "", city: "" });
  };

  const handleCityChange = (selectedOption) => {
    setFormData({ ...formData, city: selectedOption?.value || "" });
  };

  const countryOptions = countries.map((item) => ({
    value: item.country,
    label: item.country,
  }));

  const cityOptions = cities.map((city) => ({
    value: city,
    label: city,
  }));

  return (
    <div className="container py-5 fade-in">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary title">
          <i className="bi bi-cloud-arrow-down-fill me-2"></i>
          Application Form
        </h1>
        <p className="text-muted">
          Fetch countries and cities dynamically
        </p>
      </div>

      {/* Form Card */}
      <div className="card shadow-lg p-4 mb-5 border-0 rounded-4 hover-scale">
        <h4 className="mb-4 text-info border-bottom pb-2">
          <i className="bi bi-pencil-square me-2"></i> Add New Record
        </h4>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-person-circle text-primary me-2"></i> Full Name
            </label>
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

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-envelope-fill text-primary me-2"></i> Email
            </label>
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

          {/* Gender */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-gender-ambiguous text-primary me-2"></i> Gender
            </label>
            <div className="d-flex gap-4 mt-1">
              {["Male", "Female"].map((g) => (
                <div className="form-check" key={g}>
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="form-check-input"
                    id={g}
                  />
                  <label htmlFor={g} className="form-check-label">
                    {g}
                  </label>
                </div>
              ))}
            </div>
            {errors.gender && (
              <div className="text-danger small mt-1">{errors.gender}</div>
            )}
          </div>

          {/* Country */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-globe2 text-primary me-2"></i> Country
            </label>
            <Select
              options={countryOptions}
              value={
                formData.country
                  ? { value: formData.country, label: formData.country }
                  : null
              }
              onChange={handleCountryChange}
              placeholder="Select or search country..."
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable
              isSearchable
            />
            {errors.country && (
              <div className="text-danger small mt-1">{errors.country}</div>
            )}
          </div>

          {/* City */}
          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-geo-alt-fill text-primary me-2"></i> City
            </label>
            <Select
              options={cityOptions}
              value={
                formData.city
                  ? { value: formData.city, label: formData.city }
                  : null
              }
              onChange={handleCityChange}
              placeholder={
                formData.country
                  ? "Select or search city..."
                  : "Select country first"
              }
              isDisabled={!formData.country}
              className="react-select-container"
              classNamePrefix="react-select"
              isClearable
              isSearchable
            />
            {errors.city && (
              <div className="text-danger small mt-1">{errors.city}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary text-white w-100 rounded-3 fw-semibold"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add to Table
          </button>
        </form>
      </div>

      {/* Table */} 
      <div className="card shadow-sm border-0 rounded-4 hover-scale">
        <div className="card-body">
          <h4 className="mb-3 text-info">
            <i className="bi bi-table me-2"></i> Saved Records
          </h4>
          {records.length === 0 ? (
            <p className="text-muted text-center">
              <i className="bi bi-exclamation-circle me-2"></i>
              No records found. Please add some data.
            </p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover align-middle text-center">
                <thead className="table-info">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Country</th>
                    <th>City</th>
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
                      <td>{item.city}</td>
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
