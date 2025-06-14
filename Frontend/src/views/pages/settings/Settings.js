import React from 'react';
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton } from '@coreui/react';

const Settings = () => {
  return (
    <div className="settings-page">
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Settings</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <p>Manage your account settings, preferences, and notifications.</p>
              <CButton color="primary">Update Profile</CButton>
              <CButton color="success" className="ms-3">
                Change Password
              </CButton>
              <CButton color="danger" className="ms-3">
                Delete Account
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Settings;
