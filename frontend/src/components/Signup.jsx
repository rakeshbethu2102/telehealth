import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Bypass Firebase for testing if placeholders are present
    if (auth.config?.apiKey === "YOUR_API_KEY" || !auth.config?.apiKey) {
      console.warn("Using Mock Signup because Firebase API Key is missing.");
      try {
        const mockUid = "mock-uid-" + Date.now();
        const response = await fetch('/api/users/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: mockUid,
            email: email,
            role: role,
            displayName: email.split('@')[0]
          })
        });
        const userData = await response.json();
        console.log("Sync Response:", userData);
        
        if (userData && userData.role) {
          localStorage.setItem('userRole', userData.role);
          localStorage.setItem('userId', userData._id);
          console.log("Redirecting to:", userData.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
          navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
        } else {
          throw new Error("Failed to sync user data with server.");
        }
        return;
      } catch (err) {
        console.error("Mock Signup Error:", err);
        setError(`Backend connection failed: ${err.message}`);
        return;
      }
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Sync with backend
      const response = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: role
        })
      });
      const userData = await response.json();

      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userData._id);
      navigate(role === 'doctor' ? '/doctor-dashboard' : '/dashboard');
    } catch (err) {
      console.error('Signup Error:', err);
      setError(`Failed to create an account: ${err.message}`);
    }
  };

  return (
    <div className="bg-light py-5" style={{ minHeight: '90vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Container className="d-flex align-items-center justify-content-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-100" 
          style={{ maxWidth: '500px' }}
        >
          <Card className="glass-card border-0 shadow-lg overflow-hidden">
            <div className="bg-primary p-4 text-center text-white">
              <h2 className="fw-bold mb-0">Join Our Community</h2>
              <p className="small mb-0 opacity-75">Start your journey to better healthcare today</p>
            </div>
            <Card.Body className="p-4 p-md-5">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                  <Alert variant="danger" className="py-2 small">{error}</Alert>
                </motion.div>
              )}
              <Form onSubmit={handleSignup}>
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
                <Form.Group className="mb-3" id="password">
                  <Form.Label className="small fw-bold text-muted">PASSWORD</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0"><i className="bi bi-key text-primary"></i></span>
                    <Form.Control 
                      className="bg-light border-0"
                      type="password" 
                      placeholder="Create a strong password"
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-4" id="role">
                  <Form.Label className="small fw-bold text-muted">REGISTRATION TYPE</Form.Label>
                  <Row className="g-2">
                    <Col>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          variant={role === 'patient' ? 'primary' : 'outline-primary'} 
                          className="w-100 border-2"
                          onClick={() => setRole('patient')}
                        >
                          <i className="bi bi-person me-2"></i> Patient
                        </Button>
                      </motion.div>
                    </Col>
                    <Col>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          variant={role === 'doctor' ? 'primary' : 'outline-primary'} 
                          className="w-100 border-2"
                          onClick={() => setRole('doctor')}
                        >
                          <i className="bi bi-person-badge me-2"></i> Doctor
                        </Button>
                      </motion.div>
                    </Col>
                  </Row>
                </Form.Group>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-100 btn-primary py-2 fw-bold" type="submit">
                    Create Account <i className="bi bi-person-plus ms-2"></i>
                  </Button>
                </motion.div>
              </Form>
              <div className="mt-4 text-center">
                <p className="text-muted small">
                  Already have an account? <Link to="/login" className="text-primary fw-bold text-decoration-none">Log In</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
}

export default Signup;

