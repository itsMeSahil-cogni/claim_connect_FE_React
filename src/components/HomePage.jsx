// src/components/HomePage.js
import React from 'react';
import { Card } from 'react-bootstrap';

const HomePage = ({ userData }) => {
  const getUserInfo = (data) => {
    if ('hospitalId' in data) {
      return {
        title: data.hospitalName,
        subtitle: data.hospitalEmail,
        idLabel: 'Hospital ID',
        idValue: data.hospitalId,
      };
    } else if ('patientId' in data) {
      return {
        title: data.patientName,
        subtitle: data.patientEmail,
        idLabel: 'Patient ID',
        idValue: data.patientId,
        insuranceLabel: 'Insurance Company ID',
        insuranceValue: data.insuranceCompId,
      };
    } else if ('insuranceCompId' in data) {
      return {
        title: data.insuranceCompName,
        subtitle: data.insuranceCompEmail,
        idLabel: 'Insurance Company ID',
        idValue: data.insuranceCompId,
      };
    }
    return {};
  };

  console.log("Inside home page: ", userData);
  const userInfo = getUserInfo(userData);

  return (
    <Card className="m-4">
      <Card.Body>
        <Card.Title>{userInfo.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{userInfo.subtitle}</Card.Subtitle>
        <Card.Text>
          {userInfo.idLabel}: {userInfo.idValue}
        </Card.Text>
        {userInfo.insuranceLabel && (
          <Card.Text>
            {userInfo.insuranceLabel}: {userInfo.insuranceValue}
          </Card.Text>
        )}
      </Card.Body>
    </Card>
  );
};

export default HomePage;
