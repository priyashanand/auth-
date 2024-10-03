import React, { useState, useEffect } from 'react';
import './CreateChannelForm.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';

const CreateChannelForm = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [responseMessage, setResponseMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const checkChannelExistence = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/signin'); // Redirect if no token exists
                return;
            }
            try {
                const response = await axios.get('http://localhost:4001/api/auth/channels', {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                },
                });

                if (response.data.length > 0) {
                    // If channels exist, redirect to dashboard
                    setResponseMessage('Channel already exists. Redirecting to dashboard...');
                    setShowAlert(true);
                    setTimeout(() => navigate(`/dashboard/${response.data[0]._id}`), 2000);
                }
            } catch (error) {
                // Handle errors, but do not display anything if token is invalid
                console.error('Error checking channels:', error);
                if (error.response && error.response.status === 403) {
                    setResponseMessage('Access forbidden: invalid token.');
                    setShowAlert(true);
                }
            }
        };

        checkChannelExistence(); // Check on component mount
    }, [navigate]);

    const validationSchema = Yup.object({
        name: Yup.string().required('Channel name is required'),
        description: Yup.string().required('Description is required'),
        fields: Yup.array().of(Yup.string().required('Field name is required')).min(1, 'At least one field is required'),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        const token = localStorage.getItem('token');
        const server = "http://localhost:4001/";

        try {
            const response = await axios.post(`${server}api/auth/channels`, values, {
              headers: {
                'Authorization': `Bearer ${token}`,
            },
            });

            
            if (response.statusText === "Created") {
              console.log(response.data.channel);
                localStorage.setItem('x-api-key', response.data.channel.apiKey);
                setResponseMessage('Channel created successfully!');
                setShowAlert(true);
                setTimeout(() => {
                    navigate(`/dashboard/${response.data.channel._id}`); // Redirect to the channel dashboard
                }, 2000);
            }
        } catch (error) {
            setResponseMessage(error.response ? error.response.data.message : 'Something went wrong');
            setShowAlert(true);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseAlert = () => {
        setShowAlert(false);
    };

    return (
        <div className="create-channel-form-container">
            <h2>Create a New Channel</h2>
            <Formik
                initialValues={{ name: '', description: '', fields: [''] }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form className="create-channel-form">
                        <div>
                            <label htmlFor="name">Channel Name</label>
                            <Field type="text" id="name" name="name" placeholder="Enter channel name" />
                            <ErrorMessage name="name" component="div" className="error-message" />
                        </div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <Field type="text" id="description" name="description" placeholder="Enter description" />
                            <ErrorMessage name="description" component="div" className="error-message" />
                        </div>
                        <div>
                            <label>Fields</label>
                            {values.fields.map((field, index) => (
                                <div key={index}>
                                    <Field type="text" name={`fields[${index}]`} placeholder={`Field ${index + 1}`} />
                                    <ErrorMessage name={`fields[${index}]`} component="div" className="error-message" />
                                    <button type="button" onClick={() => setFieldValue('fields', [...values.fields, ''])}>
                                        Add Field
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Creating...' : 'Create Channel'}
                        </button>
                    </Form>
                )}
            </Formik>
            {showAlert && <AlertModal message={responseMessage} onClose={handleCloseAlert} />}
        </div>
    );
};

export default CreateChannelForm;
