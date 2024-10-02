import React, { useState } from 'react';
import './signin.css';
import Navbar from '../Navbar/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../Alert/Alert';

function SignIn() {
  const [responseMessage, setResponseMessage] = useState('');
  const server = "http://localhost:4001/";
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false); // Control alert visibility

  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    // console.log(values);
    try {
      // console.log(values);
      const response = await axios.post(`${server}api/auth/login`, values); // Change the endpoint as necessary
      // console.log(response)
      setResponseMessage(response.data.message);
      // Save response data if needed, e.g., tokens
      // console.log(response)
      setShowAlert(true);
      if (response.data.status === 'success') {  // Assuming your API responds with a success flag
        setTimeout(() => {
          console.log(response);
          localStorage.setItem('token',response.data.token)
          // Example of setting token and API key after login
          // localStorage.setItem('apiKey', response.data.apiKey); // Channel-specific API key

          // navigate(`/dashboard/${response.data.user.name}`,); // Redirect to the login page after a delay
          navigate('/landing');
        }, 2000); // 2-second delay for better UX
      }
    } catch (error) {
      // console.log(error.response);
      setResponseMessage(error.response ? error.response.data.message : 'Something went wrong');
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
      <div className="sign-in-container">
        <h2>Sign In to XTrans</h2>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="sign-in-form">
              <div className="sign-in-form-group">
                <label htmlFor="email">Email</label>
                <Field type="email" id="email" name="email" placeholder="Enter your email" />
                <ErrorMessage name="email" component="div" className="error-message" />
              </div>
              <div className="sign-in-form-group">
                <label htmlFor="password">Password</label>
                <Field type="password" id="password" name="password" placeholder="Enter your password" />
                <ErrorMessage name="password" component="div" className="error-message" />
              </div>
              <button type="submit" className="sign-in-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>
        {responseMessage && <p className="response-message">{responseMessage}</p>}
        <p>
          <a href="/forgot-password" className="sign-in-forgot-password-link">Forgot Password?</a>
        </p>
        <p>
          Don't have an account? <a href="/signup" className="sign-in-sign-up-link">Sign Up</a>
        </p>
        {showAlert && (
          <AlertModal message={responseMessage} onClose={handleCloseAlert} />
        )}
      </div>
    </>
  );
}

export default SignIn;
