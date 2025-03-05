// src/components/SignUp.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
  const [role, setRole] = useState('');
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  //   const [formData, setFormData] = useState({
  //     hospital_email: '',
  //     hospital_name: '',
  //     hospital_pwd: '',
  //     insurance_comp_id: '',
  //     patient_email: '',
  //     patient_name: '',
  //     patient_password: '',
  //     insurance_comp_email: '',
  //     insurance_comp_name: '',
  //     insurance_comp_pwd: '',
  //   });

  // Handle role selection
  const handleRoleChange = (e) => {
    setRole(e.target.value);
    // Reset form data when role changes
    // setFormData({
    //   hospital_email: '',
    //   hospital_name: '',
    //   hospital_pwd: '',
    //   insurance_comp_id: '',
    //   patient_email: '',
    //   patient_name: '',
    //   patient_password: '',
    //   insurance_comp_email: '',
    //   insurance_comp_name: '',
    //   insurance_comp_pwd: '',
    // });
    setFormData({});
    setInsuranceCompanies([]);
  };

  // Fetch insurance companies when role is Patient
  useEffect(() => {
    if (role === 'Patient') {
      const fetchInsuranceCompanies = async () => {
        try {
          const response = await axios.get('http://localhost:3434/api/insuranceComp/getAllICs');
          if (response.data.status === 'OK') {
            setInsuranceCompanies(response.data.data);
          } else {
            console.error('Failed to fetch insurance companies:', response.data.msg);
          }
        } catch (error) {
          console.error('Error fetching insurance companies:', error);
        }
      };

      fetchInsuranceCompanies();
    }
  }, [role]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit form data
    let apiUrl = '';
    let payload = {};

    switch (role) {
      case "Patient":
        apiUrl = 'http://localhost:3434/api/patient/signup'
        payload = {
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          patientPassword: formData.patientPassword,
          insuranceCompId: formData.insuranceCompId
        };
        break;
      case "Hospital":
        apiUrl = 'http://localhost:3434/api/hospital/signup'
        payload = {
          hospitalName: formData.hospitalName,
          hospitalEmail: formData.hospitalEmail,
          hospitalPwd: formData.hospitalPwd,
        };
        break;
      case "InsuranceCompany":
        apiUrl = 'http://localhost:3434/api/insuranceComp/signup'
        payload = {
          insuranceCompName: formData.insuranceCompName,
          insuranceCompEmail: formData.insuranceCompEmail,
          insuranceCompPwd: formData.insuranceCompPwd,
        };
        break;
      default:
        toast.error('Please select a role.');
        return;
    }

    try {
      const response = await axios.post(apiUrl, payload);
      if (response.data.status === "CREATED") {
        toast.success(response.data.msg);
        // alert("codes inside success prompt");
        setTimeout(() => {
          navigate("/signin");
        }, 5000);
      }
      else {
        toast.error(response.data.msg || "Registration Failed");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('An error occurred during registration.');
      }
      console.error('Registration error:', error);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <ToastContainer position="top-center" />
      <div className="w-50 p-4 border rounded shadow-sm">
        <h2 className="text-center mb-4">Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <Form.Group controlId="formRole" className="mb-3">
            <Form.Label>Select Role</Form.Label>
            <Form.Select value={role} onChange={handleRoleChange} required>
              <option value="">-- Select Role --</option>
              <option value="Hospital">Hospital</option>
              <option value="Patient">Patient</option>
              <option value="InsuranceCompany">Insurance Company</option>
            </Form.Select>
          </Form.Group>

          {/* Conditional Fields Based on Role */}
          {role === 'Hospital' && (
            <>
              <Form.Group controlId="hospitalEmail" className="mb-3">
                <Form.Label>Hospital Email</Form.Label>
                <Form.Control
                  type="email"
                  name="hospitalEmail"
                  value={formData.hospitalEmail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="hospitalName" className="mb-3">
                <Form.Label>Hospital Name</Form.Label>
                <Form.Control
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="hospitalPwd" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="hospitalPwd"
                  value={formData.hospitalPwd}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {role === 'Patient' && (
            <>
              <Form.Group controlId="insuranceCompId" className="mb-3">
                <Form.Label>Insurance Company ID</Form.Label>
                <Form.Select
                  type="text"
                  name="insuranceCompId"
                  value={formData.insuranceCompId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Insurance Company --</option>
                  {insuranceCompanies.map((company) => (
                    <option key={company.insuranceCompId} value={company.insuranceCompId}>
                      {company.insuranceCompName}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="patientEmail" className="mb-3">
                <Form.Label>Patient Email</Form.Label>
                <Form.Control
                  type="email"
                  name="patientEmail"
                  value={formData.patientEmail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="patientName" className="mb-3">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="patientPassword" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="patientPassword"
                  value={formData.patientPassword}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {role === 'InsuranceCompany' && (
            <>
              <Form.Group controlId="insuranceName" className="mb-3">
                <Form.Label>Insurance Company Name</Form.Label>
                <Form.Control
                  type="text"
                  name="insuranceCompName"
                  value={formData.insuranceCompName}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="insuranceEmail" className="mb-3">
                <Form.Label>Insurance Company Email</Form.Label>
                <Form.Control
                  type="email"
                  name="insuranceCompEmail"
                  value={formData.insuranceCompEmail}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="insurancePwd" className="mb-3">
                <Form.Label>Insurance Company Password</Form.Label>
                <Form.Control
                  type="password"
                  name="insuranceCompPwd"
                  value={formData.insuranceCompPwd}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </>
          )}

          {/* Submit Button */}
          <Button variant="primary" type="submit" className="w-100 mb-3">
            Sign Up
          </Button>

          {/* Link to Sign In */}
          <div className="text-center">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};

export default SignUp;
