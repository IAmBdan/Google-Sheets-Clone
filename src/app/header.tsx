import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from 'react-router-dom';
import Login from 'src/app/_components/login';
import Register from 'src/app/_components/register';
// import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Header() {
  return (<>
  <header className="bg-gray-200 p-8">Welcome to Husksheet!</header>
  {/* <>
  <Routes>
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
    </Routes>
  </> */}
  <div className="btn-toolbar">
    <div className='btn-group'>
      <button className='btn-primary'>Log In</button>
      <button className='btn-primary'>Sign Up</button>
    </div>
  </div>
  </>
  )
}
