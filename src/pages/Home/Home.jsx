import React from 'react';
import {Button, Container, Nav} from 'react-bootstrap';
import {NavLink} from 'react-router-dom';

const Home = () => {

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{minHeight: '100vh'}}>
            <Button variant="outline-info" className="mx-3 w-25">
                <Nav.Link as={NavLink} to="/login" className="text-white">Login</Nav.Link>
            </Button>
            <Button variant="outline-info" className="mx-3 w-25">
                <Nav.Link as={NavLink} to="/register" className="text-white">Register</Nav.Link>
            </Button>
        </Container>
    );
};

export default Home;