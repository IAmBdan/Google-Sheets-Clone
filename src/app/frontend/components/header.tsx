import 'bootstrap/dist/css/bootstrap.min.css';
// import "bootstrap/dist/js/bootstrap.bundle.min";

export default function Header() {
  return <>
  <header className="bg-gray-200 p-8">Welcome to Husksheet!</header>

  <div className="btn-toolbar">
    <div className='btn-group'>
      <button className='btn-primary'>Log In</button>
      <button className='btn-primary'>Sign Up</button>
    </div>
  </div>
  </>
}
