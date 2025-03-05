// src/components/ClaimHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailsPopup from './DetailsPopup';

const ClaimHistory = () => {
  const [claims, setClaims] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [editFormData, setEditFormData] = useState({
    synopsis: '',
    price: '',
  });
  const [patientData, setPatientData] = useState(null);
  const [icData, setIcData] = useState(null);

  // Fetch claims data
  useEffect(() => {
    const fetchClaims = async () => {
      const token = localStorage.getItem('Hospital');
      try {
        const response = await axios.get('http://localhost:3434/api/hospital/getClaimsByHosId', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.status === 'OK') {
          // const patId = response.data.data.
          // const patientOwned = await axios.get('http://localhost:3434/api/patient/getPatientById/5')

          setClaims(response.data.data);
        } else {
          toast.error(response.data.msg || 'Failed to retrieve claims.');
        }
      } catch (error) {
        toast.error('Error fetching claims data.');
        console.error('Error fetching claims:', error);
      }
    };

    fetchClaims();
  }, []);

  // Handle input changes in the edit form
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  // Handle edit button click
  const handleEditClick = (claim) => {
    setSelectedClaim(claim);
    setEditFormData({
      synopsis: claim.synopsis,
      price: claim.price,
    });
    setShowEditModal(true);
  };

  // Handle details button click
  const handleDetailsClick = async (claim) => {

    const token = localStorage.getItem('Hospital');
    try {
      const patientDataResponse = await axios.get(`http://localhost:3434/api/hospital/getPatientById/${claim.patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (patientDataResponse.data.status === 'OK') {
        // const patId = response.data.data.
        // const patientOwned = await axios.get('http://localhost:3434/api/patient/getPatientById/5')

        setPatientData(patientDataResponse.data.data);
      }

      const ictDataResponse = await axios.get(`http://localhost:3434/api/hospital/getIcById/${claim.insuranceCompId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (ictDataResponse.data.status === 'OK') {
        // const patId = response.data.data.
        // const patientOwned = await axios.get('http://localhost:3434/api/patient/getPatientById/5')

        setIcData(ictDataResponse.data.data);
      }



    } catch (error) {
      toast.error('Error fetching claims data.');
      console.error('Error fetching claims:', error);
    }

    setSelectedClaim(claim);
    setShowDetailsModal(true);
  };

  // Handle form submission for editing
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('Hospital');
    const updatedClaim = {
      ...selectedClaim,
      synopsis: editFormData.synopsis,
      price: parseFloat(editFormData.price),
      statusMessage: 'sent for patient approval',
    };

    try {
      const response = await axios.put(`http://localhost:3434/api/hospital/updateClaim`, updatedClaim, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'OK') {
        const updatedClaims = claims.map((claim) =>
          claim.id === selectedClaim.id ? { ...updatedClaim } : claim
        );
        setClaims(updatedClaims);
        toast.success(response.data.msg || 'Claim updated successfully.');
      } else {
        toast.error(response.data.msg || 'Failed to update claim.');
      }
    } catch (error) {
      toast.error('Error updating claim.');
      console.error('Error updating claim:', error);
    }

    setShowEditModal(false);
    setSelectedClaim(null);
  };

  return (
    <div>
      <ToastContainer position="top-center" />
      <h2 className="mb-4">Claim History</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Claim ID</th>
            <th>Synopsis</th>
            <th>Price</th>
            <th>Status</th>
            <th>Last Updated By</th>
            <th>Status Message</th>
            <th>Actions</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr key={claim.id}>
              <td>{claim.id}</td>
              <td>{claim.synopsis}</td>
              <td>{claim.price}</td>
              <td>{claim.status}</td>
              <td>{claim.lastUpdatedBy}</td>
              <td>{claim.statusMessage}</td>
              <td>
                {claim.status === 'reverted' && (
                  <Button variant="warning" onClick={() => handleEditClick(claim)}>
                    Edit
                  </Button>
                )}
              </td>
              <td>
                <Button variant="info" onClick={() => handleDetailsClick(claim)}>
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Claim Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Claim Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="editSynopsis">
              <Form.Label>Synopsis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="synopsis"
                value={editFormData.synopsis}
                onChange={handleEditInputChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="editPrice" className="mt-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={editFormData.price}
                onChange={handleEditInputChange}
                required
                min="0"
                step="0.01"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {/* Details Modal */}
      {selectedClaim && (
        <DetailsPopup
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          hospitalData={null}
          patientData={patientData}
          insuranceCompData={icData}
        />
      )}
    </div>
  );
};

export default ClaimHistory;
