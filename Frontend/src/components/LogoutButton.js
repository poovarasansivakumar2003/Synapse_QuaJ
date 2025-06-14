import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../utils/auth';
import { CButton } from '@coreui/react';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <CButton 
      color="link" 
      className="text-white px-0" 
      onClick={handleLogout}
    >
      Logout
    </CButton>
  );
};

export default LogoutButton;
