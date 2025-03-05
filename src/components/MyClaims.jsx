// // src/components/MyClaims.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Table, Button, Modal, Form } from 'react-bootstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const MyClaims = ({ getClaimsApi, acceptClaimApi, revertClaimApi, rejectClaimApi, tokenName, editableStatus }) => {
//     const [claims, setClaims] = useState([]);
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [selectedClaim, setSelectedClaim] = useState(null);
//     const [statusMessage, setStatusMessage] = useState('');
//     const [action, setAction] = useState('');

//     // Fetch claims data
//     useEffect(() => {
//         const fetchClaims = async () => {
//             const token = localStorage.getItem(tokenName);
//             try {
//                 const response = await axios.get(getClaimsApi, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 if (response.data.status === 'OK') {
//                     setClaims(response.data.data);
//                 } else {
//                     toast.error(response.data.msg || 'Failed to retrieve claims.');
//                 }
//             } catch (error) {
//                 toast.error('Error fetching claims data.');
//                 console.error('Error fetching claims:', error);
//             }
//         };

//         fetchClaims();
//     }, [getClaimsApi, tokenName]);

//     // Handle input changes in the edit form
//     const handleInputChange = (e) => {
//         setStatusMessage(e.target.value);        
//     };

//     // Handle accept button click
//     const handleAcceptClick = async (claim) => {
//         console.log("in handleAccept: ", claim);

//         setSelectedClaim(claim);
//         setStatusMessage('');
//         setAction('Accepted');
//         // console.log("in handleAccept: ",selectedClaim);

//         await handleActionSubmit("Accepted", claim);
//     };

//     // Handle revert button click
//     const handleRevertClick = (claim) => {
//         setSelectedClaim(claim);
//         console.log("in handleRevertClick: ", selectedClaim);

//         setStatusMessage('');
//         setAction('Reverted');
//         setShowEditModal(true);
//     };

//     // Handle reject button click
//     const handleRejectClick = (claim) => {
//         setSelectedClaim(claim);
//         setStatusMessage('');
//         setAction('Rejected');
//         setShowEditModal(true);
//     };

//     // Handle form submission for editing
//     const handleEditSubmit = async (e) => {
//         e.preventDefault();
//         await handleActionSubmit(action, selectedClaim)
//     }
//     // Handle action final submission
//     const handleActionSubmit = async (action, selectedClaim) => {
//         console.log(action, selectedClaim);


//         const token = localStorage.getItem(tokenName);
//         const updatedClaim = {
//             ...selectedClaim,
//             ...(action !== "Accepted" && { statusMessage })
//         };
//         console.log("inside handle action: ", updatedClaim);

//         // if (action !== "Accepted") {

//         //     const updatedClaim = {
//         //         ...selectedClaim,
//         //         statusMessage,
//         //     };
//         // }
//         // else {
//         //     const updatedClaim = {
//         //         ...selectedClaim
//         //     };
//         // }

//         var apiEndpoint = '';
//         if (action === "Accepted") apiEndpoint = acceptClaimApi;
//         else if (action === "Reverted") apiEndpoint = revertClaimApi;
//         else if (action === "Rejected") apiEndpoint = rejectClaimApi;


//         try {

//             // const reqBody = action !== "Accepted" ? statusMessage : {};
//             if (action !== "Accepted") {

//                 const response = await axios.put(`${apiEndpoint}/${selectedClaim.id}`, { statusMessage }, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//             }
//             else {
//                 const response = await axios.put(`${apiEndpoint}/${selectedClaim.id}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//             }

//             if (response.data.status === 'OK') {
//                 const updatedClaims = claims.map((claim) =>
//                     claim.id === selectedClaim.id ? { ...updatedClaim } : claim
//                 );
//                 setClaims(updatedClaims);
//                 toast.success(response.data.msg || 'Claim updated successfully.');
//             } else {
//                 toast.error(response.data.msg || 'Failed to update claim.');
//             }
//         } catch (error) {
//             toast.error('Error updating claim.');
//             console.error('Error updating claim:', error);
//         }

//         setShowEditModal(false);
//         setSelectedClaim(null);
//     };

//     return (
//         <div>
//             <ToastContainer position="top-center" />
//             <h2 className="mb-4">My Claims</h2>
//             <Table striped bordered hover responsive>
//                 <thead>
//                     <tr>
//                         <th>Claim ID</th>
//                         <th>Synopsis</th>
//                         <th>Price</th>
//                         <th>Status</th>
//                         <th>Status Message</th>
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {claims.map((claim) => (
//                         <tr key={claim.id}>
//                             <td>{claim.id}</td>
//                             <td>{claim.synopsis}</td>
//                             <td>{claim.price}</td>
//                             <td>{claim.status}</td>
//                             <td>{claim.statusMessage}</td>
//                             <td>
//                                 {claim.status === editableStatus && (
//                                     <div>
//                                         <Button variant="success" className="me-2" onClick={() => handleAcceptClick(claim)}>
//                                             Accept
//                                         </Button>
//                                         <Button variant="warning" className="me-2" onClick={() => handleRevertClick(claim)}>
//                                             Revert
//                                         </Button>
//                                         <Button variant="danger" onClick={() => handleRejectClick(claim)}>
//                                             Reject
//                                         </Button>
//                                     </div>
//                                 )}
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </Table>

//             {/* Edit Claim Modal */}
//             <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Edit Claim Status</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form onSubmit={handleEditSubmit}>
//                         <Form.Group controlId="statusMessage">
//                             <Form.Label>Status Message</Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="statusMessage"
//                                 value={statusMessage}
//                                 onChange={handleInputChange}
//                                 required
//                             />
//                         </Form.Group>
//                         <Button variant="primary" type="submit" className="mt-3">
//                             Save Changes
//                         </Button>
//                     </Form>
//                 </Modal.Body>
//             </Modal>
//         </div>
//     );
// };

// export default MyClaims;
































// src/components/MyClaims.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DetailsPopup from './DetailsPopup';

const MyClaims = ({ getClaimsApi, acceptClaimApi, revertClaimApi, rejectClaimApi, tokenName, editableStatus }) => {
    const [claims, setClaims] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [action, setAction] = useState('');
    const [patientData, setPatientData] = useState(null);
    const [icData, setIcData] = useState(null);
    const [hospitalData, setHospitalData] = useState(null);

    // Fetch claims data
    useEffect(() => {
        const fetchClaims = async () => {
            const token = localStorage.getItem(tokenName);
            try {
                const response = await axios.get(getClaimsApi, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.status === 'OK') {
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
    }, [getClaimsApi, tokenName]);

    // Handle input changes in the edit form
    const handleInputChange = (e) => {
        setStatusMessage(e.target.value);
    };

    // Handle accept button click
    const handleAcceptClick = async (claim) => {
        setSelectedClaim(claim);
        setStatusMessage('');
        setAction('Accepted');
        await handleActionSubmit("Accepted", claim);
    };

    // Handle revert button click
    const handleRevertClick = (claim) => {
        setSelectedClaim(claim);
        setStatusMessage('');
        setAction('Reverted');
        setShowEditModal(true);
    };

    // Handle reject button click
    const handleRejectClick = (claim) => {
        setSelectedClaim(claim);
        setStatusMessage('');
        setAction('Rejected');
        setShowEditModal(true);
    };

    // Handle form submission for editing
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await handleActionSubmit(action, selectedClaim);
    };

    const handleDetailsClick = async (claim) => {

        const token = localStorage.getItem(tokenName);
        let commonApi = '';
        try {
            if (tokenName === "Patient") {
                commonApi = 'http://localhost:3434/api/patient';
                const icDataResponse = await axios.get(`${commonApi}/getIcById/${claim.insuranceCompId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (icDataResponse.data.status === 'OK') {
                    setIcData(icDataResponse.data.data);
                }
            }
            else if (tokenName === "InsuranceCompany") {
                commonApi = 'http://localhost:3434/api/insuranceComp';

                const patientDataResponse = await axios.get(`${commonApi}/getPatientById/${claim.patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (patientDataResponse.data.status === 'OK') {
                    setPatientData(patientDataResponse.data.data);
                }
            }


            const hospitalDataResponse = await axios.get(`${commonApi}/getHospitalById/${claim.hospitalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (hospitalDataResponse.data.status === 'OK') {
                // const patId = response.data.data.
                // const patientOwned = await axios.get('http://localhost:3434/api/patient/getPatientById/5')

                setHospitalData(hospitalDataResponse.data.data);
            }

        } catch (error) {
            toast.error('Error fetching claims data.');
            console.error('Error fetching claims:', error);
        }

        setSelectedClaim(claim);
        setShowDetailsModal(true);
    };

    // Handle action final submission
    const handleActionSubmit = async (action, claim) => {
        const token = localStorage.getItem(tokenName);
        const updatedClaim = {
            ...claim,
            ...(action !== "Accepted" && { statusMessage: statusMessage })
        };
        // console.log("updated claim ka req msg: ",updatedClaim.statusMessage);
        const apiEndpoint = action === "Accepted" ? acceptClaimApi
            : action === "Reverted" ? revertClaimApi
                : rejectClaimApi;

        try {
            console.log("updated claim ka req msg:", updatedClaim.statusMessage);
            //   const reqBody = action !== "Accepted" ? { statusMessage: statusMessage } : {};
            const response = await axios.put(`${apiEndpoint}/${claim.id}`, updatedClaim.statusMessage, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
            });

            if (response.data.status === 'OK') {
                const updatedClaims = claims.map((c) =>
                    c.id === claim.id ? { ...updatedClaim } : c
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
            <h2 className="mb-4">My Claims</h2>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Claim ID</th>
                        <th>Synopsis</th>
                        <th>Price</th>
                        <th>Status</th>
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
                            <td>{claim.statusMessage}</td>
                            <td>
                                {claim.status === editableStatus && (
                                    <div>
                                        <Button variant="success" className="me-2" onClick={() => handleAcceptClick(claim)}>
                                            Accept
                                        </Button>
                                        <Button variant="warning" className="me-2" onClick={() => handleRevertClick(claim)}>
                                            Revert
                                        </Button>
                                        <Button variant="danger" onClick={() => handleRejectClick(claim)}>
                                            Reject
                                        </Button>
                                    </div>
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
                    <Modal.Title>Edit Claim Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="statusMessage">
                            <Form.Label>Status Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="statusMessage"
                                value={statusMessage}
                                onChange={handleInputChange}
                                required
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
                    hospitalData={hospitalData}
                    patientData={patientData}
                    insuranceCompData={icData}
                />
            )}
        </div>
    );
};

export default MyClaims;

