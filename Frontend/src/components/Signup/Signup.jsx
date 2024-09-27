import React, { useState } from 'react';
import './signup.css';
import Navbar from '../Navbar/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';

function SignUp() {
  const [responseMessage, setResponseMessage] = useState('');
  const server = "http://localhost:4001/";
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false); // Control alert visibility

  // Yup validation schema
  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post(`${server}api/auth/signup`, values);
      setResponseMessage(response.data.message); // Handle success response
      setShowAlert(true); // Show the alert modal

      if (response.data.status === 'success') {  // Assuming your API responds with a success flag
        setTimeout(() => {
          navigate("/signin"); // Redirect to the login page after a delay
        }, 2000); // 2-second delay for better UX
      }
    } catch (error) {
      setResponseMessage(error.response ? error.response.data.message : 'Something went wrong'); // Handle error response
      setShowAlert(true); // Show the alert modal
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false); // Close the alert modal
  };

  return (
    <>
      <Navbar />
      <div className="sign-up-container">
        <h2>Sign Up to XTrans Cloud</h2>
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="sign-up-form">
              <div className="sign-up-form-group">
                <label htmlFor="username">Username</label>
                <Field type="text" id="username" name="username" placeholder="Enter Username" />
                <ErrorMessage name="username" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" placeholder="Enter Email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" placeholder="Create Password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <div className="sign-up-form-group">
                <label htmlFor="confirmPassword">Retype Password</label>
                <Field type="password" id="confirmPassword" name="confirmPassword" placeholder="Retype Password" />
                <ErrorMessage name="confirmPassword" component="div" className="error-message" />
              </div>
              <button type="submit" className="sign-up-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Signing up...' : 'Sign up'}
              </button>
            </Form>
          )}
        </Formik>
        {showAlert && (
          <AlertModal message={responseMessage} onClose={handleCloseAlert} />
        )}
      </div>
    </>
  );
}

export default SignUp;
