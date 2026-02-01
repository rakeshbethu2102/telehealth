import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Bypass Firebase for testing if placeholders are present
    if (auth.config?.apiKey === "YOUR_API_KEY" || !auth.config?.apiKey) {
      console.warn("Using Mock Login because Firebase API Key is missing.");
      try {
        const response = await fetch(`/api/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email }) // Find user by email in mock mode
        });
        const userData = await response.json();
        console.log("Login Sync Response:", userData);
        
        if (!userData || !userData.role) {
          throw new Error("User not found. Please Sign Up first.");
        }
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userId', userData._id);
        console.log("Login Redirecting to:", userData.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
        navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
        return;
      } catch (err) {
        console.error("Mock Login Error:", err);
        setError(err.message || "Backend connection failed.");
        return;
      }
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch role from backend
      const response = await fetch(`/api/users/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid: user.uid, email: user.email })
      });
      const userData = await response.json();
      
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userId', userData._id);
      navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/dashboard'); 
    } catch (err) {
      setError('Failed to log in. Please check your credentials.');
    }
  };

  return (
    <div className="bg-light py-5" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container className="d-flex align-items-center justify-content-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-100" 
          style={{ maxWidth: '450px' }}
        >
          <Card className="glass-card border-0 shadow-lg overflow-hidden">
            <div className="bg-primary p-4 text-center text-white">
              <motion.div
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 120 }}
              >
                <i className="bi bi-shield-lock display-4 mb-2"></i>
                <h2 className="fw-bold mb-0">Welcome Back</h2>
                <p className="small mb-0 opacity-75">Secure Access to Your Health Portal</p>
              </motion.div>
            </div>
            <Card.Body className="p-4 p-md-5">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Alert variant="danger" className="py-2 small">{error}</Alert>
                </motion.div>
              )}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" id="email">
                  <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-envelope text-primary"></i></span>
                    <Form.Control 
                      className="bg-light border-0"
                      type="email" 
                      placeholder="name@example.com"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4" id="password">
                  <Form.Label className="small fw-bold text-muted">PASSWORD</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-key text-primary"></i></span>
                    <Form.Control 
                      className="bg-light border-0"
                      type="password" 
                      placeholder="Your secure password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </Form.Group>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-100 btn-primary py-2 fw-bold" type="submit">
                    Sign In <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                </motion.div>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="text-muted small">
                  Don't have an account? <Link to="/signup" className="text-primary fw-bold text-decoration-none">Create One</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default Login;

