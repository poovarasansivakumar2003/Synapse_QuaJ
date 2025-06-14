import React from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Welcome, Admin</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <p>Manage users, monitor platform activity, and generate reports.</p>
              <CButton color="primary">Manage Users</CButton>
              <CButton color="success" className="ms-3">
                Generate Reports
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default AdminDashboard;
