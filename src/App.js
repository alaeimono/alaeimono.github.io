import logo from './logo.svg';
import './App.css';
import SerialPortReader
 from './components/serialPort';

function App() {
  return (
    <div className="container mt-4">
        <div className='row'>
          <div className='col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12'>
            <SerialPortReader/>  
          </div>
        </div>
    </div>
  );
}

export default App;
