import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilUser, cilBriefcase, cilSettings } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'Pages',
  },
  {
    component: CNavItem,
    name: 'Login',
    to: '/login',
  },
  {
    component: CNavItem,
    name: 'Register',
    to: '/register',
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
