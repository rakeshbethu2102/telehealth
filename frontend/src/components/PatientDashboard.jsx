import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { auth } from '../firebase';

function PatientDashboard() {
  const [updates, setUpdates] = useState([]);
  const [newUpdate, setNewUpdate] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const userId = localStorage.getItem('userId');
        if (userId) {
          fetch(`/api/updates/${userId}`)
            .then((res) => res.json())
            .then((data) => setUpdates(data))
            .catch((err) => console.error('Error fetching updates:', err));
        }
      }
    });
    return unsubscribe;
  }, []);

  const handleAddUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate) return;
    
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      const response = await fetch('/api/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: userId,
          content: newUpdate,
          type: 'health_status'
        })
      });
      const data = await response.json();
      setUpdates([data, ...updates]);
      setNewUpdate('');
    } catch (err) {
      console.error('Error adding update:', err);
    }
  };

  return (
    <Container className="mt-4 pb-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 fw-bold text-primary">
          <i className="bi bi-person-circle me-2"></i>
          Patient Dashboard
        </h2>
      </motion.div>

      <Row>
        <Col md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="dashboard-card shadow-sm mb-4 border-0">
              <Card.Body className="p-4">
                <Card.Title className="fw-bold mb-4">Quick Actions</Card.Title>
                <div className="d-flex flex-wrap gap-3">
                  <Button variant="primary" className="d-flex align-items-center gap-2">
                    <i className="bi bi-mic-fill"></i> Audio Call
                  </Button>
                  <Button variant="success" className="d-flex align-items-center gap-2">
                    <i className="bi bi-camera-video-fill"></i> Video Call
                  </Button>
                  <Button variant="info" className="text-white d-flex align-items-center gap-2">
                    <i className="bi bi-chat-dots-fill"></i> Live Chat
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="dashboard-card shadow-sm border-0">
              <Card.Body className="p-4">
                <Card.Title className="fw-bold mb-4">Share Health Update</Card.Title>
                <Form onSubmit={handleAddUpdate} className="mb-4">
                  <Form.Group>
                    <Form.Control 
                      as="textarea" 
                      rows={3} 
                      placeholder="How are you feeling today? Any new symptoms?" 
                      className="border-0 bg-light p-3"
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                    />
                  </Form.Group>
                  <div className="text-end mt-3">
                    <Button type="submit" variant="primary">Post Update</Button>
                  </div>
                </Form>

                <h6 className="fw-bold mb-3">Previous Updates</h6>
                <ListGroup variant="flush">
                  {updates.length > 0 ? updates.map((update, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ListGroup.Item className="px-0 py-3 border-0 border-bottom">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i>
                            {new Date(update.createdAt).toLocaleString()}
                          </small>
                          <Badge bg="light" text="dark" className="border">Health Status</Badge>
                        </div>
                        <p className="mb-0 text-dark">{update.content}</p>
                      </ListGroup.Item>
                    </motion.div>
                  )) : (
                    <p className="text-muted text-center py-4">No updates yet.</p>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col md={4}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="dashboard-card shadow-sm border-0 mb-4">
              <Card.Header className="bg-primary text-white py-3 border-0">
                <h6 className="mb-0 fw-bold">Upcoming Appointments</h6>
              </Card.Header>
              <Card.Body className="text-center py-5">
                <i className="bi bi-calendar-x display-4 text-light mb-3"></i>
                <p className="text-muted mb-0">No appointments scheduled</p>
                <Button variant="link" className="mt-2 text-decoration-none">Book Now</Button>
              </Card.Body>
            </Card>

            <Card className="dashboard-card shadow-sm border-0 bg-primary text-white">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">Emergency Support</h6>
                <p className="small mb-4">Need immediate help? Contact our emergency response team.</p>
                <Button variant="light" className="w-100 fw-bold text-primary">Call SOS</Button>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default PatientDashboard;

