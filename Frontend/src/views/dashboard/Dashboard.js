import React from 'react'
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
} from '@coreui/react'

const Dashboard = () => {
  // Minimal sample data — you can replace or remove this with your own data later
  const users = [
    { name: 'a', country: 'ind', usage: 75, lastLogin: '2 hours ago' },
    { name: 'b', country: 'ind', usage: 50, lastLogin: '1 day ago' },
    { name: 'c', country: 'ind', usage: 90, lastLogin: '30 mins ago' },
  ]

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>User Activity Overview</CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol>
              <CButton color="primary">Refresh Data</CButton>
            </CCol>
          </CRow>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Name</CTableHeaderCell>
                <CTableHeaderCell>Country</CTableHeaderCell>
                <CTableHeaderCell>Usage (%)</CTableHeaderCell>
                <CTableHeaderCell>Last Login</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {users.map((user, idx) => (
                <CTableRow key={idx}>
                  <CTableDataCell>{user.name}</CTableDataCell>
                  <CTableDataCell>{user.country}</CTableDataCell>
                  <CTableDataCell>{user.usage}</CTableDataCell>
                  <CTableDataCell>{user.lastLogin}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
