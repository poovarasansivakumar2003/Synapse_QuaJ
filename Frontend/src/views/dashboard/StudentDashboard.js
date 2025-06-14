import React from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CWidgetStatsA,
  CWidgetStatsB,
  CWidgetStatsC,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilPeople, cilBriefcase, cilSchool } from '@coreui/icons';

const StudentDashboard = () => {
  const batchmates = [
    { name: 'John Doe', branch: 'CSE', batch: 2021 },
    { name: 'Jane Smith', branch: 'ECE', batch: 2021 },
    { name: 'Alice Johnson', branch: 'MECH', batch: 2021 },
  ];

  return (
    <div className="student-dashboard">
      <CRow className="mb-4">
        <CCol sm={4}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value="45"
            title="Batchmates"
            icon={<CIcon icon={cilPeople} height={36} />}
          />
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsB
            className="mb-4"
            color="success"
            value="12"
            title="Mentorship Requests"
            icon={<CIcon icon={cilBriefcase} height={36} />}
          />
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsC
            className="mb-4"
            color="info"
            value="85%"
            title="Academic Progress"
            icon={<CIcon icon={cilSchool} height={36} />}
          />
        </CCol>
      </CRow>

      <CCard className="mb-4">
        <CCardHeader>
          <h4>Batchmates</h4>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Branch</CTableHeaderCell>
                <CTableHeaderCell>Batch</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {batchmates.map((batchmate, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{batchmate.name}</CTableDataCell>
                  <CTableDataCell>{batchmate.branch}</CTableDataCell>
                  <CTableDataCell>{batchmate.batch}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      <CCard className="mb-4">
        <CCardHeader>
          <h4>Actions</h4>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol>
              <CButton color="primary">View Batchmates</CButton>
              <CButton color="success" className="ms-3">
                Request Mentorship
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default StudentDashboard;
