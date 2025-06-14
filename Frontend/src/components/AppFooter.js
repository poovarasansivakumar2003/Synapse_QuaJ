import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          Synapse_QuaJ
        </a>
        <span className="ms-1">&copy; 2025 UVCE.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a  rel="noopener noreferrer">
          Shubham Taple &amp; Team
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
