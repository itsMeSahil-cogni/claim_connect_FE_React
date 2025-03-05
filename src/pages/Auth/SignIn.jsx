// src/components/SignIn.js
import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, Link } from 'react-router-dom';

const SignIn = () => {
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    // Handle role selection
    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData({});
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        let apiUrl = '';
        let payload = {};

        // Set API URL and payload based on role
        switch (role) {
            case 'Hospital':
                apiUrl = 'http://localhost:3434/api/hospital/authenticate';
                payload = {
                    hospitalEmail: formData.hospitalEmail,
                    hospitalPwd: formData.hospitalPwd,
                };
                break;
            case 'Patient':
                apiUrl = 'http://localhost:3434/api/patient/authenticate';
                payload = {
                    patientEmail: formData.patientEmail,
                    patientPassword: formData.patientPassword,
                };
                break;
            case 'InsuranceCompany':
                apiUrl = 'http://localhost:3434/api/insuranceComp/authenticate';
                payload = {
                    insuranceCompEmail: formData.insuranceCompEmail,
                    insuranceCompPwd: formData.insuranceCompPwd,
                };
                break;
            default:
                toast.error('Please select a role.');
                return;
        }
        console.log(payload);
        try {
            const response = await axios.post(apiUrl, payload);
            if (response.data != null) {
                toast.success("JWT Token Received");
                // Handle successful sign-in (e.g., store token, navigate to dashboard)
                // Example: Navigate to role-specific dashboard
                setTimeout(() => {
                    const token = response.data;
                    console.log(token);
                    localStorage.setItem(role, token);
                    if (role === 'Hospital') {
                        navigate('/hospital/dashboard');
                    } else if (role === 'Patient') {
                        navigate('/patient/dashboard');
                    } else if (role === 'InsuranceCompany') {
                        navigate('/insurance/dashboard');
                    }
                }, 2000);
            } else {
                toast.error(response.data.msg || 'Sign-in failed.');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.msg) {
                toast.error(error.response.data.msg);
            } else {
                toast.error('An error occurred during sign-in.');
            }
            console.error('Sign-in error:', error);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <ToastContainer position="top-center" />
            <div className="w-50 p-4 border rounded shadow-sm">
                <h2 className="text-center mb-4">Sign In</h2>
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
                                    value={formData.hospitalEmail || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="hospitalPwd" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="hospitalPwd"
                                    value={formData.hospitalPwd || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}

                    {role === 'Patient' && (
                        <>
                            <Form.Group controlId="patientEmail" className="mb-3">
                                <Form.Label>Patient Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="patientEmail"
                                    value={formData.patientEmail || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="patientPassword" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="patientPassword"
                                    value={formData.patientPassword || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}

                    {role === 'InsuranceCompany' && (
                        <>
                            <Form.Group controlId="insuranceCompEmail" className="mb-3">
                                <Form.Label>Insurance Company Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="insuranceCompEmail"
                                    value={formData.insuranceCompEmail || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="insuranceCompPwd" className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="insuranceCompPwd"
                                    value={formData.insuranceCompPwd || ''}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </>
                    )}

                    {/* Submit Button */}
                    <Button variant="primary" type="submit" className="w-100 mb-3">
                        Sign In
                    </Button>

                    {/* Link to Sign Up */}
                    <div className="text-center">
                        Don't have an account? <Link to="/signup">Sign In</Link>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default SignIn;
