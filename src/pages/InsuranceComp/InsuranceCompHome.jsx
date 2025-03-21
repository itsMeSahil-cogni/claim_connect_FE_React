import React, {useState, useEffect} from 'react';
import SideNavBar from '../../components/SideNav/SideNavBar';
import { insuranceNavLinks } from './insuranceNavLinks';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import MyClaims from '../../components/MyClaims';
import HomePage from '../../components/HomePage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InsuranceComp = () => {
  const navigate = useNavigate();
  const [insuranceCompData, SetInsuranceCompData] = useState(null);
  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const token = localStorage.getItem('InsuranceCompany');

        const response = await axios.get('http://localhost:3434/api/insuranceComp/getIc', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        console.log(response.data);
        SetInsuranceCompData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch patient information:', error);
        if(error.response.data.error === "Invalid token") {
          localStorage.removeItem("InsuranceCompany")
          //location.href = "/signin";
          navigate("/signin");
        }
      }
    };

    // if (!user) {
    fetchPatientInfo();
    // }
  }, []);

  if (!insuranceCompData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex'>
      <SideNavBar
        title='Insurance Portal'
        userName={insuranceCompData.insuranceCompName}
        navLinks={insuranceNavLinks}
        token="InsuranceCompany"
      />
      {/* <div className='flex-grow-1'> */}
      <div className='col'>
        <Routes>
          <Route path='dashboard' element={<HomePage userData={insuranceCompData} />} />
          <Route
            path='claim-requests'
            element={
              <MyClaims
                getClaimsApi='http://localhost:3434/api/insuranceComp/getClaimByICId'
                acceptClaimApi='http://localhost:3434/api/insuranceComp/approveClaim'
                revertClaimApi='http://localhost:3434/api/insuranceComp/revertClaim'
                rejectClaimApi='http://localhost:3434/api/insuranceComp/rejectClaim'
                tokenName='InsuranceCompany'
                editableStatus='accepted'
              />
            } />
          {/* Add more routes as needed */}
        </Routes>
      </div>
      {/* </div> */}
    </div>
  );
};

export default InsuranceComp;
