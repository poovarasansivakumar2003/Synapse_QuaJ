import React from 'react';
import { CFooter } from '@coreui/react';

const AppFooter = () => {
  return (
    <CFooter className="px-4 text-white">
      <div>
        <a href="https://uvce.ac.in" target="_blank" rel="noopener noreferrer" className="text-white">
          Alumni Connect
        </a>
        <span className="ms-1">&copy; {new Date().getFullYear()} UVCE.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" rel="noopener noreferrer" className="text-white">
          Synapse_QuaJ Team
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
