import React, { useState, useRef } from 'react';
import { FormGroup, Label, Button, Row, Col } from 'reactstrap';
import { AvForm, AvField, AvInput, AvGroup } from 'availity-reactstrap-validation';
import { toast } from 'react-toastify';
import { BallTriangle } from 'react-loader-spinner'

const Registration = (props) => {
    const [isCompany, setIsCompany] = useState(false);
    const [loading, setLoading] = useState(false);
    const formRef = useRef();

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
                        formRef.current.reset();
                        const phoneNumber = '+91' + v.mobile; // Replace with your desired WhatsApp number
                        const message = 'Hello, this is a predefined message!'; // Replace with your desired message
                        // Encode the phone number and message for the URL
                        const encodedPhoneNumber = encodeURIComponent(phoneNumber);
                        const encodedMessage = encodeURIComponent(message);
                        // Create the WhatsApp URL
                        window.open(`https://wa.me/${encodedPhoneNumber}?text=${encodedMessage}`);
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

    return (
        <div className="container mt-3">
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
            <h2 className='page-title'>Registration</h2>
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
                                    required: { value: true, errorMessage: 'Email is required' },
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
                                validate={{
                                    required: { value: true, errorMessage: 'mobile is required' },
                                    minLength: { value: 8, errorMessage: 'Mobile must be at least 8 characters' },
                                    maxLength: { value: 10, errorMessage: 'Mobile must be most 10 characters' },
                                }}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={6} style={{ display: 'flex' }}>
                        <FormGroup style={{ marginRight: 5 }}>
                            <AvGroup check style={{ display: 'flex', alignItems: 'center' }}>
                                <AvInput className="check" type="checkbox" name="checkbox" onChange={e => setIsCompany(e.target.value === "false" ? true : false)} />
                                <Label check for="checkbox" style={{ marginLeft: 10 }}>Company</Label>
                            </AvGroup>
                        </FormGroup>
                        {isCompany &&
                            <FormGroup style={{ width: '100%' }}>
                                <Label >Name</Label>
                                <AvField
                                    type="text"
                                    name="companyName"
                                    validate={{
                                        required: { value: true, errorMessage: 'Company name is required' },
                                    }}
                                />
                            </FormGroup>
                        }
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
                        onClick={()=>formRef.current.reset()}
                    >
                        Reset
                    </Button>
                    <Button style={{ backgroundColor: "#ff0000", border: "1px solid #fff", width: '20%', height: 40, marginLeft:20 }} type="submit">
                        Register
                    </Button>
                </Row>
            </AvForm>
        </div>
    );
};

export default Registration;