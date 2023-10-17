
import React, { useState } from "react";
// import Chart from "./sensorChart";
import CarImage from "./carImage";

const SerialPortReader = () => {
  // const [sensorValues, setSensorValues] = useState({  time:0, 
  //                                                     AccX: 0, 
  //                                                     AccY: 0, 
  //                                                     AccZ: 0, 
  //                                                     GyroX:0, 
  //                                                     GyroY:0, 
  //                                                     GyroZ:0 }); 
  const [sensorIsConnected, setSensorIsConnected] = useState(false);
  const [data, setData] = useState("");
  const [baudRate, setBaudRate] = useState(115200);
  const [command, setCommand] = useState('');
  const [serialWriter, setSerialWriter] = useState(null);
  const [serialReader, setSerialReader] = useState(null);


  const handleSetBaudRate = (newBaudRate)=>{
    setBaudRate(newBaudRate);
  }

  const handleSetCommand = async (newCommand)=>{
    setCommand(newCommand);

    if (serialWriter){
      const encoder = new TextEncoder();
      await serialWriter.write(encoder.encode(newCommand));
      if (command === 'M'){
        readLines();
      }
    }
  }

  const handleSelectComPort = async () => {
    try{
      const port = await navigator.serial.requestPort();
      await port.open({ baudRate: baudRate });
      const reader = port.readable.getReader();
      const writer = port.writable.getWriter();
      setSerialWriter(writer);
      setSerialReader(reader);
      setSensorIsConnected(true);
    } catch(error){
      console.error('Serial port permission denied:', error);
      setSensorIsConnected(false);
    }
  };

  async function readLines() {
    const textDecoder = new TextDecoder('utf-8');
    let partialLine = ''; 
    console.error('Start Reading...');

    while (true) {
        try{
          if(command === 'M'){
              setSensorIsConnected(true);
              const { value, done } = await serialReader.read();
              if (done) break;
              const text = textDecoder.decode(value);
              const lines = (partialLine + text).split('\n');
              for (let i = 0; i < lines.length - 1; i++) {
                  const line = lines[i].trim();
                  if (line) {
                      processData(line);
                  }
              }
              partialLine = lines[lines.length - 1];
          }
          else{
            console.error('Stop Reading');
            setSensorIsConnected(false);
            break;
          }
        }catch(error){
          console.error('Serial port disconnected:', error);
          setSensorIsConnected(false);
          break;
        }
    }
}

function getCurrentTime() {
  const now = new Date().getTime();
  return `${now}`;
}

  function processData(line) {
    console.log(line);
    const dataParts = line.split('|');
    if (dataParts.length === 6) {
        const accX = parseFloat(dataParts[0].split(':')[1]);
        const accY = parseFloat(dataParts[1].split(':')[1]);
        const accZ = parseFloat(dataParts[2].split(':')[1]);
        const gyroX = parseFloat(dataParts[3].split(':')[1]);
        const gyroY = parseFloat(dataParts[4].split(':')[1]);
        const gyroZ = parseFloat(dataParts[5].split(':')[1]);
        const time = getCurrentTime();
        // console.log(line);
        
        setData((prevState) => prevState + "\n" + line);

        // setSensorValues({ time:time, AccX: accX, AccY: accY, AccZ: accZ, GyroX: gyroX, GyroY: gyroY, GyroZ: gyroZ });
    }
}

  return (
<div className="container">
  <h4 className="text-center">Serial Monitor</h4>
  <div className="d-flex flex-column align-items-center justify-content-center my-2" hidden={sensorIsConnected ? true : false}>
      <button className="btn btn-sm btn-success" onClick={handleSelectComPort}  hidden={sensorIsConnected ? true : false}>
        Select COM Port
      </button>
  </div>
  <div className="input-group row d-flex align-items-center justify-content-center mt-2" >
        <input type="text" className="col-6 col-md-6 col-lg-6 form-control mx-2" width="25%" aria-label="Baud Rate" placeholder="BaudRate" value={baudRate} onChange={(e)=>handleSetBaudRate(e.target.value)}/>
        {/* <input type="text" className="col-6 col-md-6 col-lg-6 form-control" width="25%" aria-label="Command" placeholder="Command" value={command} onChange={(e)=>handleSetCommand(e.target.value)}/> */}
  </div>
  <button disabled={!sensorIsConnected} className="btn btn-success rounded mt-2" onClick={(e)=>handleSetCommand('M')} >Start</button>
  <button disabled={!sensorIsConnected} className="btn btn-warning rounded mt-2 mx-2" onClick={(e)=>handleSetCommand('S')}>Stop</button>


  <div key="Acc-Row" className="row">
    <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6">
      <div hidden={sensorIsConnected ? false : true}>
      <div className="form-group">
        <label >Data</label>
        <textarea className="form-control" rows="20" value={data} readOnly></textarea>
      </div>
        {/* <Chart key="AccX" name="AccX" lineColor="red" time={sensorValues.time} value={sensorValues.AccX} />
        <Chart key="AccY" name="AccY" lineColor="blue" time={sensorValues.time} value={sensorValues.AccY} />
        <Chart key="AccZ" name="AccZ" lineColor="green" time={sensorValues.time} value={sensorValues.AccZ} /> */}
      </div>
    </div>

    <div key="Car-Img" className= {sensorIsConnected ? "col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 my-2" : "col-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 my-2"}>
      <div className="d-flex flex-column align-items-center justify-content-center">
        <CarImage enabled={sensorIsConnected} />
      </div>
    </div>
  </div>
</div>

  );
};
export default SerialPortReader;
