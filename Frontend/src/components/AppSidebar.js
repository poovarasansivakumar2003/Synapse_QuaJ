import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from 'src/assets/brand/logo'
import { sygnet } from 'src/assets/brand/sygnet'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        {/* add header if needeed */}
        
      </CSidebarHeader>
      {/* Sidebar navigation */}
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex justify-content-center align-items-center">
        {/* Toggler to fold/unfold sidebar */}
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
        {/* Custom footer text */}
        <span style={{ color: '#fff', marginLeft: '10px', fontSize: '0.9rem' }}>
          Synapse_QuaJ
        </span>
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
