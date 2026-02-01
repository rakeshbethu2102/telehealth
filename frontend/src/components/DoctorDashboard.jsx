import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { auth } from '../firebase';

function DoctorDashboard() {
  const [patients, setPatients] = useState([
    { id: '1', name: 'John Doe', lastUpdate: 'Health is stable', time: '2 hours ago', status: 'Healthy' },
    { id: '2', name: 'Jane Smith', lastUpdate: 'Experienced mild cough', time: '5 hours ago', status: 'Follow-up' }
  ]);

  return (
    <Container className="mt-4 pb-5">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="mb-4 fw-bold text-primary">
          <i className="bi bi-person-badge-fill me-2"></i>
          Doctor Dashboard
        </h2>
      </motion.div>

      <Row>
        <Col md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="dashboard-card shadow-sm border-0 mb-4">
              <Card.Header className="bg-success text-white py-3 border-0 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">Active Consultations</h6>
                <Badge bg="light" text="success">1 Active</Badge>
              </Card.Header>
              <Card.Body className="p-4">
                <ListGroup variant="flush">
                  <ListGroup.Item className="px-0 py-3 border-0 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                      <div className="bg-light rounded-circle p-3 me-3">
                        <i className="bi bi-person-fill text-primary h4 mb-0"></i>
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0">Meeting with John Doe</h6>
                        <small className="text-muted">General Checkup • Started 5m ago</small>
                      </div>
                    </div>
                    <div>
                      <Button variant="success" className="me-2 rounded-pill px-4">
                        <i className="bi bi-camera-video me-2"></i> Join
                      </Button>
                      <Button variant="light" className="rounded-circle">
                        <i className="bi bi-three-dots-vertical"></i>
                      </Button>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="dashboard-card shadow-sm border-0">
              <Card.Header className="bg-white py-3 border-bottom d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold text-dark">Patient Monitoring</h6>
                <Button variant="link" className="text-decoration-none p-0">View All</Button>
              </Card.Header>
              <Card.Body className="p-4">
                <ListGroup variant="flush">
                  {patients.map((patient, idx) => (
                    <motion.div
                      key={patient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                    >
                      <ListGroup.Item className="px-0 py-3 border-0 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center">
                            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0">{patient.name}</h6>
                              <small className="text-muted">{patient.time}</small>
                            </div>
                          </div>
                          <Badge bg={patient.status === 'Healthy' ? 'success' : 'warning'} className="rounded-pill">
                            {patient.status}
                          </Badge>
                        </div>
                        <p className="mb-0 text-secondary ps-5">{patient.lastUpdate}</p>
                      </ListGroup.Item>
                    </motion.div>
                  ))}
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
                <h6 className="mb-0 fw-bold text-center">Your Schedule</h6>
              </Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item className="p-3 border-0 border-bottom d-flex align-items-center">
                    <div className="text-center me-3" style={{ width: '60px' }}>
                      <h5 className="mb-0 fw-bold">10</h5>
                      <small className="text-muted">AM</small>
                    </div>
                    <div className="border-start ps-3 py-1">
                      <h6 className="mb-1 fw-bold">John Doe</h6>
                      <small className="text-muted">Follow-up</small>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item className="p-3 border-0 border-bottom d-flex align-items-center">
                    <div className="text-center me-3" style={{ width: '60px' }}>
                      <h5 className="mb-0 fw-bold">11</h5>
                      <small className="text-muted">30 AM</small>
                    </div>
                    <div className="border-start ps-3 py-1">
                      <h6 className="mb-1 fw-bold">Jane Smith</h6>
                      <small className="text-muted">Consultation</small>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Card.Footer className="bg-white border-0 py-3 text-center">
                <Button variant="outline-primary" size="sm" className="w-100 rounded-pill">View Calendar</Button>
              </Card.Footer>
            </Card>

            <Card className="dashboard-card shadow-sm border-0 bg-info text-white">
              <Card.Body className="p-4">
                <h6 className="fw-bold mb-3">System Alerts</h6>
                <div className="d-flex gap-2 mb-2 align-items-center">
                  <i className="bi bi-info-circle"></i>
                  <span className="small">2 prescriptions pending</span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <i className="bi bi-info-circle"></i>
                  <span className="small">Network stable</span>
                </div>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default DoctorDashboard;

