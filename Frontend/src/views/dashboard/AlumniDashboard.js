import React from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react';

const AlumniDashboard = () => {
  return (
    <div className="alumni-dashboard">
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Welcome, Alumni</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <p>Engage with your alumni network, post job opportunities, and mentor students.</p>
              <CButton color="primary">Post Job</CButton>
              <CButton color="success" className="ms-3">
                View Mentorship Requests
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AlumniDashboard;
