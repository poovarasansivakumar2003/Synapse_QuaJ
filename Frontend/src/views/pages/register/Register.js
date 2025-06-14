import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [role, setRole] = useState('student');
  const [university, setUniversity] = useState('');
  const [usn, setUsn] = useState('');
  const [batch, setBatch] = useState('');
  const [branch, setBranch] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const universityEmailRegex = /.+@uvce\.ac\.in$/;
    if (!universityEmailRegex.test(email)) {
      alert('Please enter a valid university email address!');
      return;
    }

    if (password !== repeatPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          university,
          usn,
          batch,
          branch,
          isVerified,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      alert('Server error');
      console.error(err);
    }
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Role</CInputGroupText>
                    <CFormSelect value={role} onChange={(e) => setRole(e.target.value)} required>
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                      <option value="alumni">Alumni</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>University</CInputGroupText>
                    <CFormInput
                      placeholder="University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>USN</CInputGroupText>
                    <CFormInput
                      placeholder="USN"
                      value={usn}
                      onChange={(e) => setUsn(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Batch</CInputGroupText>
                    <CFormInput
                      placeholder="Batch (e.g., 2021)"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Branch</CInputGroupText>
                    <CFormInput
                      placeholder="Branch (e.g., CSE)"
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4 align-items-center">
                    <input
                      type="checkbox"
                      id="isVerified"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                    />
                    <label htmlFor="isVerified" className="ms-2">
                      Is Verified
                    </label>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton type="submit" color="success">
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
