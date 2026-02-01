import React, { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Button, Row, Col, Card, Badge } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Login from './components/Login';
import Signup from './components/Signup';
import PatientDashboard from './components/PatientDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Logo from './components/Logo';
import { auth } from './firebase';

function LandingPage({ message }) {
  return (
    <div className="overflow-hidden">
      <div className="hero-section text-center">
        <Container>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="display-3 fw-bold mb-4"
          >
            Telehealth for Rural & Remote Areas
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="lead mb-5"
          >
            Bridging the gap in healthcare. Connect with top professionals from the comfort of your home.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <Button as={Link} to="/signup" variant="light" size="lg" className="me-3 btn-lg">Get Started</Button>
            <Button as={Link} to="/login" variant="outline-light" size="lg">Log In</Button>
          </motion.div>
        </Container>
      </div>

      <Container className="py-5 mt-n5">
        <Row className="justify-content-center">
          <Col md={10}>
            <Row className="g-4">
              {[
                { title: 'Secure Consultations', text: 'Talk to doctors via encrypted video and chat.', icon: 'bi-shield-lock' },
                { title: 'Easy Booking', text: 'Schedule appointments with a single click.', icon: 'bi-calendar-check' },
                { title: 'Health Records', text: 'Access your history and prescriptions anytime.', icon: 'bi-file-earmark-medical' }
              ].map((feature, idx) => (
                <Col key={idx} md={4}>
                  <motion.div
                    whileHover={{ y: -10 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <Card className="glass-card text-center h-100 p-3 border-0">
                      <Card.Body>
                        <div className="mb-3 text-primary">
                          <i className={`bi ${feature.icon} display-4`}></i>
                        </div>
                        <Card.Title className="fw-bold">{feature.title}</Card.Title>
                        <Card.Text className="text-muted">{feature.text}</Card.Text>
                      </Card.Body>
                    </Card>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>

        {message && (
          <Row className="mt-5 text-center">
            <Col>
              <Badge bg="success" className="status-badge">
                <i className="bi bi-cpu me-2"></i>
                Backend Status: {message}
              </Badge>
            </Col>
          </Row>
        )}
      </Container>

      <footer className="bg-white py-4 mt-5 border-top">
        <Container className="text-center text-muted">
          <p>© 2026 Telehealth Portal. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}

function Navigation() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
          <Logo width={35} height={35} className="bg-white rounded-circle p-1" />
          <span className="fw-bold tracking-tight">TeleHealth</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user ? (
              <>
                <Nav.Link as={Link} to={localStorage.getItem('userRole') === 'doctor' ? '/doctor-dashboard' : '/dashboard'}>Dashboard</Nav.Link>
                <Button variant="outline-light" className="ms-2" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Button as={Link} to="/signup" variant="outline-light" className="ms-2">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error('Error fetching backend:', err));
  }, []);

  return (
    <Router>
      <div>
        <Navigation />
        <Routes>
          <Route path="/" element={<LandingPage message={message} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="patient">
              <PatientDashboard />
            </ProtectedRoute>
          } />
          <Route path="/doctor-dashboard" element={
            <ProtectedRoute requiredRole="doctor">
              <DoctorDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
