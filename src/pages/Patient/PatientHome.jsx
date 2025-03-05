import React, { useState, useEffect } from 'react';
import SideNavBar from '../../components/SideNav/SideNavBar';
import { patientNavLinks } from './patientNavLinks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from '../../components/HomePage';
import MyClaims from '../../components/MyClaims';

const PatientHome = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const token = localStorage.getItem('Patient');

        const response = await axios.get('http://localhost:3434/api/patient/getPatient', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setPatientData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch patient information:', error);
        if(error.response.data.error === "Invalid token") {
          localStorage.removeItem("Patient")
          //location.href = "/signin";
          navigate("/signin");
        }
      }
    };

    // if (!user) {
    fetchPatientInfo();
    // }
  }, []);

  if (!patientData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex'>
      <SideNavBar
        title='Patient Portal'
        userName={patientData.patientName}
        navLinks={patientNavLinks}
        token = "Patient"
      />
      {/* <div className='flex-grow-1'> */}
      <div className='col'>
        <Routes>
          <Route path='dashboard' element={<HomePage userData={patientData} />} />
          <Route
            path='my-claims'
            element={
              <MyClaims
                getClaimsApi='http://localhost:3434/api/patient/getClaims'
                acceptClaimApi='http://localhost:3434/api/patient/acceptClaim'
                revertClaimApi='http://localhost:3434/api/patient/revertClaim'
                rejectClaimApi='http://localhost:3434/api/patient/rejectClaim'
                tokenName='Patient'
                editableStatus='pending'
              />
            } />
          {/* Add more routes as needed */}
        </Routes>
      </div>
      {/* </div> */}
    </div>
  );
}

export default PatientHome;
