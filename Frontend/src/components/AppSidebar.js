import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

// Sidebar navigation config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom d-flex align-items-center justify-content-center">
        <CIcon icon="logo" height={35} className="me-2" />
        <span className="fw-bold">Synapse_QuaJ</span>
      </CSidebarHeader>
      {/* Sidebar navigation */}
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-flex justify-content-between align-items-center px-3">
        <span style={{ color: '#fff', fontSize: '0.9rem' }}>Powered by Synapse_QuaJ</span>
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
