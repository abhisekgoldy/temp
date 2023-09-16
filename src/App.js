import './App.css';
import Registration from './screens/Registration';
import { Button, Col, Row } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import { BallTriangle } from 'react-loader-spinner';

function App() {

  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const onUpload = () => {
    if (isOnline) {
      if (!loading) {
        setLoading(true);
        let time = localStorage.getItem("last_updated");
        if (!time)
          time = '2023-09-13T00:00:00.000Z';
        fetch("http://localhost:5000/upload", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ time })
        }).then(json => json.json())
          .then(res => {
            setLoading(false);
            if (res.statusCode === 200) {
              localStorage.setItem("last_updated", new Date().toISOString());
              toast.success("Successfully Uploaded!");
            } else {
              toast.error(res?.error);
            }
          })
          .catch(err => {
            setLoading(false);
            console.log('error while submitting data', err);
            toast.error(err);
          });
      }
    } else {
      toast.error("Please connect the internet!");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {loading &&
          <div className='loader'>
            <BallTriangle
              height={100}
              width={100}
              radius={5}
              color="#ff0000"
              ariaLabel="ball-triangle-loading"
              wrapperClass={{}}
              wrapperStyle=""
              visible={true}
            />
          </div>
        }
        <ToastContainer />
        <Row style={{ alignItems: 'center', display: 'flex' }}>
          <Col md={10}>
            <img src={require("./assets/img/logo.png")} alt="logo" style={{ width: 150 }} />
          </Col>
          <Col md={2}>
            <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", float: 'right', height: 40 }}
              onClick={onUpload}
            >
              Upload
            </Button>
          </Col>
        </Row>
      </header>
      <Registration />
    </div>
  );
}

export default App;
