import React, { useState, useRef } from 'react';
import { FormGroup, Label, Button, Row, Col } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
import { BallTriangle } from 'react-loader-spinner'
import CameraComponent from '../../component/Camera';

const Registration = (props) => {
    const [isCompany, setIsCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();
    const [isCamera, setIsCamera] = useState(false);
    const [mobile, setMobile] = useState("");
    const [whatsapp, setWhatsapp] = useState(true);

    const handleSubmit = (e, v) => {
        console.log('Form submitted with values:', v);
        if (!loading) {
            setLoading(true);
            delete v.checkbox;
            fetch("http://localhost:5000/register", {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(v)
            }).then(json => json.json())
                .then(res => {
                    setLoading(false);
                    if (res.statusCode === 200) {
                        toast.success("Success");
                        setIsCompany(false);
                        formRef.current.reset();
                        if (whatsapp) {
                            const phoneNumber = '+91' + v.mobile;
                            // const imageUrl = "https://eeasy.s3.ap-south-1.amazonaws.com/Continent/1686995938199.webp";
                            const message = `Dear ${v?.name}, \nWe want to extend our heartfelt thanks for joining us. Your presence made the event truly special and memorable. We appreciate your support and enthusiasm.\nOnce again, thank you for being a part. We hope to see you at future events! \nBest regards, \nShree Associates`;
                            const encodedPhoneNumber = encodeURIComponent(phoneNumber);
                            const encodedMessage = encodeURIComponent(message);
                            window.open(`https://wa.me/${encodedPhoneNumber}?text=${encodedMessage}`);
                            // const whatsappUrl = `https://api.whatsapp.com/send?phone=${encodedPhoneNumber}&text=${encodedMessage}`;
                            // window.open(whatsappUrl);
                        }
                    } else {
                        toast.error(res?.error)
                    }
                })
                .catch(err => {
                    toast.error(err);
                    console.log('error while submitting data', err);
                });
        }
    };

    const handleGiftInput = (val) => {
        if (val)
            if (mobile) {
                if (mobile?.length == 10) {
                    setIsCamera(val);
                } else
                    toast.error("Enter a valid 10 digit mobile number!")
            } else
                toast.error("Enter mobile number to capture image!")
    }

    return (
        <div className="container mt-3">
            <CameraComponent
                isOpen={isCamera}
                setIsOpen={setIsCamera}
                mobile={mobile}
            />
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
            <Row>
                <Col md={8}>
                    <h2 className='page-title'>Registration</h2>
                </Col>
                <Col md={4}>
                    <AvForm>
                        <div className='second__1'>
                            <FormGroup style={{ marginRight: 5 }}>
                                <AvGroup check style={{ display: 'flex', alignItems: 'center' }}>
                                    <AvInput className="check" type="checkbox" name="checkbox" value={whatsapp} onChange={e =>{console.log('changing thanks whatsapp', e.target.value); setWhatsapp(e.target.value === "false" ? true : false)}} />
                                    <Label check for="checkbox" style={{ marginLeft: 10 }}>Whatsapp Thanks</Label>
                                </AvGroup>
                            </FormGroup>
                        </div>
                    </AvForm>
                </Col>
            </Row>
            <AvForm onValidSubmit={handleSubmit} className="form" ref={formRef}>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="username">Full Name</Label>
                            <AvField
                                type="text"
                                name="name"
                                validate={{ required: { value: true, errorMessage: 'Full name is required' } }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <AvField
                                type="email"
                                name="email"
                                validate={{
                                    email: { value: true, errorMessage: 'Invalid email address' },
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6}>
                        <FormGroup>
                            <Label >Mobile</Label>
                            <AvField
                                type="number"
                                name="mobile"
                                onChange={(e) => setMobile(e.target.value)}
                                validate={{
                                    required: { value: true, errorMessage: 'mobile is required' },
                                    minLength: { value: 8, errorMessage: 'Mobile must be at least 8 characters' },
                                    maxLength: { value: 10, errorMessage: 'Mobile must be most 10 characters' },
                                }}
                            />
                        </FormGroup>
                    </Col>

                    <Col md={6} className='company_section'>
                        <div className='second__1'>
                            <FormGroup style={{ marginRight: 5 }}>
                                <AvGroup check style={{ display: 'flex', alignItems: 'center' }}>
                                    <AvInput className="check" type="checkbox" name="checkbox" onChange={e => setIsCompany(e.target.value === "false" ? true : false)} />
                                    <Label check for="checkbox" style={{ marginLeft: 10 }}>Company</Label>
                                </AvGroup>
                            </FormGroup>
                        </div>
                        <div className='second_i'>
                            {isCompany &&

                                <FormGroup style={{ width: '100%' }}>
                                    <Label> Company Name</Label>
                                    <AvField
                                        type="text"
                                        name="companyName"
                                        validate={{
                                            required: { value: true, errorMessage: 'Company name is required' },
                                        }}
                                    />
                                </FormGroup>

                            }
                        </div>
                    </Col>

                    <Col md={6}>
                        <FormGroup style={{ marginRight: 5 }}>
                            <AvGroup check style={{ display: 'flex', alignItems: 'center' }}>
                                <AvInput className="check" type="checkbox" name="gifted" checked={isCamera} onChange={e => handleGiftInput(e.target.value === "false" ? true : false)} />
                                <Label check for="gifted" style={{ marginLeft: 10 }}>Gifted ?</Label>
                            </AvGroup>
                        </FormGroup>
                    </Col>
                </Row>
                <FormGroup>
                    <Label >Address</Label>
                    <AvField
                        type="text"
                        name="address"
                        validate={{
                            required: { value: true, errorMessage: 'Address is required' },
                        }}
                    />
                </FormGroup>
                <Row style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                    <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40 }} type="reset"
                        onClick={() => formRef.current.reset()}
                    >
                        Reset
                    </Button>
                    <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40, marginLeft: 20 }} type="submit">
                        Register
                    </Button>
                </Row>
            </AvForm>
        </div>
    );
};

export default Registration;