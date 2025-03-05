import SideNavBar from '../../components/SideNav/SideNavBar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { hospitalNavData } from './hospitalNavData';
import HomePage from '../../components/HomePage';
import NewClaimRequest from '../../components/NewClaimRequest';
import ClaimHistory from '../../components/ClaimHistory';

const HospitalHome = () => {
  const navigate = useNavigate();
  const [hospitalData, setHospitalData] = useState(null);
  useEffect(() => {
    const fetchHospitalInfo = async () => {
      try {
        const token = localStorage.getItem('Hospital');

        const response = await axios.get('http://localhost:3434/api/hospital/getHospital', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        console.log("Under hospital home: ",response.data);
        setHospitalData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch hospital information:', error);
        if(error.response.data.error === "Invalid token") {
          localStorage.removeItem("Hospital")
          //location.href = "/signin";
          navigate("/signin");
        } 
      }
    };
  
    // if (!user) {
    fetchHospitalInfo();
    // }
    // <HomePage userData={hospitalData} />
  }, [navigate]);

  if (!hospitalData) {
    return <div>Loading...</div>;
  }

  return (
    <div className='d-flex'>
      <SideNavBar
        title='Hospital Portal'
        userName={hospitalData.hospitalName}
        navLinks={hospitalNavData}
        token={"Hospital"}
      />
      {/* <div className='flex-grow-1'> */}
      <div className='col'>
        <Routes>
          <Route path='dashboard' element={<HomePage userData={hospitalData} />} />
          <Route path='create-claim' element={<NewClaimRequest />} />
          <Route path='claim-history' element={<ClaimHistory />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
      {/* </div> */}
    </div>
  );
};

export default HospitalHome;
