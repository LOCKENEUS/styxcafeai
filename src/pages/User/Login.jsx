import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Login = () => {
  return (
    <div style={{height:"100vh"}} className='d-flex flex-column justify-content-center gap-2 align-items-center'>
      <h1>Hii I am Login Page for User Coming Soon</h1>
      <Link to="/admin/login"><Button>Admin Login</Button></Link>
      <Link to="/superadmin/login"><Button>Superadmin Login</Button></Link>
    </div>
  )
}

export default Login
