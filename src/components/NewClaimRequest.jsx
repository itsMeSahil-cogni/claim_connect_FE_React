// src/pages/Hospital/NewClaimRequest.js
import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewClaimRequest = () => {
  const [formData, setFormData] = useState({
    synopsis: '',
    price: '',
    patientEmail: '',
  });
  const [patientData, setPatientData] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to search for patient by email
  const handlePatientSearch = async () => {
    const token = localStorage.getItem('Hospital');

    if (!formData.patientEmail) {
      toast.error('Please enter a patient email.');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3434/api/hospital/getPatientByEmail?email=${formData.patientEmail}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'OK') {
        setPatientData(response.data.data);
        toast.success('Patient found.');
      } else {
        setPatientData(null);
        toast.error(response.data.msg || 'Patient not found.');
      }

    } catch (error) {
      setPatientData(null);
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('Error fetching patient data.');
      }
      console.error('Error fetching patient:', error);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!patientData) {
      toast.error('Please search and select a patient before submitting.');
      return;
    }

    const token = localStorage.getItem('Hospital');

    const payload = {
      synopsis: formData.synopsis,
      price: parseFloat(formData.price),
      patientId: patientData.patientId,
      insuranceCompId: patientData.insuranceCompId,
    };

    try {
      const response = await axios.post(
        'http://localhost:3434/api/hospital/addClaim',
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === 'CREATED') {
        toast.success(response.data.msg || 'Claim added successfully.');
        // Reset the form
        setFormData({
          synopsis: '',
          price: '',
          patientEmail: '',
        });
        setPatientData(null);
      } else {
        toast.error(response.data.msg || 'Error adding claim.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error('An error occurred while adding the claim.');
      }
      console.error('Error adding claim:', error);
    }
  };

  return (
    <Container fluid>
      <ToastContainer position="top-center" />
      <h2 className="mb-4">New Claim Request</h2>
      <Form onSubmit={handleSubmit}>
        {/* Patient Email and Search */}
        <Row className="mb-3 align-items-center">
          <Col xs={12} md={8}>
            <Form.Group controlId="patientEmail">
              <Form.Label>Patient Email</Form.Label>
              <Form.Control
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleInputChange}
                required
                placeholder="Enter patient email"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={4} className="mt-2 mt-md-0">
            <Button
              variant="primary"
              onClick={handlePatientSearch}
              className="w-100"
            >
              Search
            </Button>
          </Col>
        </Row>

        {/* Display Patient Information if Found */}
        {patientData && (
          <Row className="mb-3">
            <Col>
              <p>
                <strong>Patient Name:</strong> {patientData.patientName}
              </p>
              <p>
                <strong>Insurance Company ID:</strong>{' '}
                {patientData.insuranceCompId}
              </p>
            </Col>
          </Row>
        )}

        {/* Synopsis */}
        <Form.Group controlId="synopsis" className="mb-3">
          <Form.Label>Synopsis</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="synopsis"
            value={formData.synopsis}
            onChange={handleInputChange}
            required
            placeholder="Enter synopsis"
          />
        </Form.Group>

        {/* Price */}
        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            min="0"
            step="0.01"
            placeholder="Enter price"
          />
        </Form.Group>

        {/* Submit Button */}
        <Button
          variant="success"
          type="submit"
          disabled={!patientData}
          className="w-100"
        >
          Submit Claim
        </Button>
      </Form>
    </Container>
  );
};

export default NewClaimRequest;
