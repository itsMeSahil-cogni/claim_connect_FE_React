// // src/components/HomePage.js
// import React from 'react';
// import { Card } from 'react-bootstrap';

// const HomePage = ({ userData }) => {
//   const getUserInfo = (data) => {
//     if ('hospitalId' in data) {
//       return {
//         title: data.hospitalName,
//         subtitle: data.hospitalEmail,
//         idLabel: 'Hospital ID',
//         idValue: data.hospitalId,
//       };
//     } else if ('patientId' in data) {
//       return {
//         title: data.patientName,
//         subtitle: data.patientEmail,
//         idLabel: 'Patient ID',
//         idValue: data.patientId,
//         insuranceLabel: 'Insurance Company ID',
//         insuranceValue: data.insuranceCompId,
//       };
//     } else if ('insuranceCompId' in data) {
//       return {
//         title: data.insuranceCompName,
//         subtitle: data.insuranceCompEmail,
//         idLabel: 'Insurance Company ID',
//         idValue: data.insuranceCompId,
//       };
//     }
//     return {};
//   };

//   console.log("Inside home page: ", userData);
//   const userInfo = getUserInfo(userData);

//   return (
//     <Card className="m-4">
//       <Card.Body>
//         <Card.Title>{userInfo.title}</Card.Title>
//         <Card.Subtitle className="mb-2 text-muted">{userInfo.subtitle}</Card.Subtitle>
//         <Card.Text>
//           {userInfo.idLabel}: {userInfo.idValue}
//         </Card.Text>
//         {userInfo.insuranceLabel && (
//           <Card.Text>
//             {userInfo.insuranceLabel}: {userInfo.insuranceValue}
//           </Card.Text>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default HomePage;





















// src/components/HomePage.js
import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = ({ userData }) => {
  // Determine role-specific data from userData
  const getUserInfo = (data) => {
    if (!data) return {};
    if ('hospitalId' in data) {
      return {
        role: 'Hospital',
        title: data.hospitalName,
        subtitle: data.hospitalEmail,
        idLabel: 'Hospital ID',
        idValue: data.hospitalId,
      };
    } else if ('patientId' in data) {
      return {
        role: 'Patient',
        title: data.patientName,
        subtitle: data.patientEmail,
        idLabel: 'Patient ID',
        idValue: data.patientId,
        insuranceLabel: 'Insurance Company ID',
        insuranceValue: data.insuranceCompId,
      };
    } else if ('insuranceCompId' in data) {
      return {
        role: 'InsuranceCompany',
        title: data.insuranceCompName,
        subtitle: data.insuranceCompEmail,
        idLabel: 'Insurance Company ID',
        idValue: data.insuranceCompId,
      };
    }
    return {};
  };

  const userInfo = getUserInfo(userData);

  // State for modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // For profile update form
  const [profileFormData, setProfileFormData] = useState({
    name: userInfo.title || '',
    insuranceCompId: userInfo.insuranceValue || '', // relevant for patient
    currentPwd: '',
  });

  // For password update form
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  // Handle profile update form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password update form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submitting profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    // Retrieve the token; here key is same as role (Hospital, Patient, InsuranceCompany)
    const token = localStorage.getItem(userInfo.role);
    try {
      let response;
      if (userInfo.role === 'Hospital') {
        response = await axios.put(
          'http://localhost:3434/api/hospital/updateHospital',
          {
            hospitalName: profileFormData.name,
            hospitalPwd: profileFormData.currentPwd,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (userInfo.role === 'Patient') {
        response = await axios.put(
          'http://localhost:3434/api/patient/updatePatient',
          {
            patientName: profileFormData.name,
            patientPassword: profileFormData.currentPwd,
            insuranceCompId: profileFormData.insuranceCompId,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (userInfo.role === 'InsuranceCompany') {
        response = await axios.put(
          'http://localhost:3434/api/insuranceComp/update',
          {
            insuranceCompName: profileFormData.name,
            insuranceCompPwd: profileFormData.currentPwd,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (response.data.status === 'OK') {
        toast.success(response.data.msg || 'Profile updated successfully.');
        setShowProfileModal(false);
      } else {
        toast.error(response.data.msg || 'Failed to update profile.');
      }
    } catch (error) {
      toast.error('Error updating profile.');
      console.error('Error updating profile:', error);
    }
  };

  // Handle submitting password update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem(userInfo.role);
    try {
      let response;
      if (userInfo.role === 'Hospital') {
        response = await axios.put(
          'http://localhost:3434/api/hospital/updatePassword',
          {
            oldHospitalPwd: passwordFormData.oldPassword,
            newHospitalPwd: passwordFormData.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (userInfo.role === 'Patient') {
        response = await axios.put(
          'http://localhost:3434/api/patient/updatePassword',
          {
            oldPatientPassword: passwordFormData.oldPassword,
            newPatientPassword: passwordFormData.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (userInfo.role === 'InsuranceCompany') {
        // Adjust the endpoint if necessary
        response = await axios.put(
          'http://localhost:3434/api/insuranceComp/updatePassword',
          {
            oldInsuranceCompPwd: passwordFormData.oldPassword,
            newInsuranceCompPwd: passwordFormData.newPassword,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      if (response.data.status === 'OK') {
        toast.success(response.data.msg || 'Password updated successfully.');

        localStorage.removeItem(userInfo.role);
        setShowPasswordModal(false);
        // Show a message and redirect to the sign-in page
        setTimeout(() => {
          toast.info('Please log in again with your new password.');
          window.location.href = '/signin'; // Redirect to the sign-in page
        }, 2000);
      } else {
        toast.error(response.data.msg || 'Failed to update password.');
      }
    } catch (error) {
      toast.error('Error updating password.');
      console.error('Error updating password:', error);
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <Card className="m-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <Card.Title>{userInfo.title}</Card.Title>
            <Button variant="link" onClick={() => setShowProfileModal(true)}>
              <FaEdit />
            </Button>
          </div>
          <Card.Subtitle className="mb-2 text-muted">{userInfo.subtitle}</Card.Subtitle>
          <Card.Text>
            {userInfo.idLabel}: {userInfo.idValue}
          </Card.Text>
          {userInfo.insuranceLabel && (
            <Card.Text>
              {userInfo.insuranceLabel}: {userInfo.insuranceValue}
            </Card.Text>
          )}
          <Button variant="outline-primary" onClick={() => setShowPasswordModal(true)}>
            Update Password
          </Button>
        </Card.Body>
      </Card>

      {/* Update Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group controlId="updateName">
              <Form.Label>
                {userInfo.role === 'Hospital'
                  ? 'Update Hospital Name'
                  : userInfo.role === 'Patient'
                    ? 'Update Patient Name'
                    : 'Update Insurance Company Name'}
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profileFormData.name}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>
            {userInfo.role === 'Patient' && (
              <Form.Group controlId="updateInsuranceCompId" className="mt-3">
                <Form.Label>Update Insurance Company ID</Form.Label>
                <Form.Control
                  type="number"
                  name="insuranceCompId"
                  value={profileFormData.insuranceCompId}
                  onChange={handleProfileChange}
                  required
                />
              </Form.Group>
            )}
            <Form.Group controlId="currentPwd" className="mt-3">
              <Form.Label>
                {userInfo.role === 'Hospital'
                  ? 'Current Hospital Password'
                  : userInfo.role === 'Patient'
                    ? 'Current Patient Password'
                    : 'Current Insurance Company Password'}
              </Form.Label>
              <Form.Control
                type="password"
                name="currentPwd"
                value={profileFormData.currentPwd}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                value={passwordFormData.oldPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="newPassword" className="mt-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                name="newPassword"
                value={passwordFormData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default HomePage;

