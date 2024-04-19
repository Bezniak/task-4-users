import React, {useState} from 'react';
import {Alert, Spinner, Table} from 'react-bootstrap';
import useFetchAllData from "../../hooks/useFetchAllData";
import {FaLock, FaLockOpen} from "react-icons/fa";
import {RiDeleteBin6Line} from "react-icons/ri";
import axios from "axios";
import {formatDate} from "../helpers/helpers";

const UsersTable = () => {
    const {data, loading, error, refetch} = useFetchAllData(`/app-users`);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const handleAction = async (status) => {
        try {
            await Promise.all(selectedUsers.map(async (userId) => {
                await axios.put(`${process.env.REACT_APP_API_URL}/app-users/${userId}`, {
                    data: {
                        status: status
                    }
                });
            }));
            await refetch();
        } catch (error) {
            console.error(`Error ${status === 'blocked' ? 'blocking' : 'unblocking'} user:`, error);
        }
    };

    const handleDeleteUser = async () => {
        try {
            await Promise.all(selectedUsers.map(async (userId) => {
                await axios.delete(`${process.env.REACT_APP_API_URL}/app-users/${userId}`);
            }));
            setSelectedUsers([]);
            refetch();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleSelectAll = () => {
        setSelectedUsers(selectedUsers.length === data.length
            ? []
            : data.map(user => user.id));
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId]);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spinner animation="border" variant="primary" style={{ width: '100px', height: '100px' }} />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="m-5">
                Error: {error.message}
            </Alert>
        );
    }

    return (
        <div className="container m-5">
            <h1 className="text-center mb-4 fs-2">Users</h1>
            <div className='mb-3 d-flex justify-content-start'>
                <button className="btn btn-primary me-3 d-flex align-items-center justify-content-center"
                        onClick={() => handleAction('blocked')}>
                    <FaLock className="me-1"/>
                    <span>Block</span>
                </button>
                <button className="btn btn-secondary me-3 d-flex align-items-center justify-content-center"
                        onClick={() => handleAction('active')}>
                    <FaLockOpen className="me-1"/>
                </button>
                <button className="btn btn-danger d-flex align-items-center justify-content-center"
                        onClick={handleDeleteUser}>
                    <RiDeleteBin6Line className="me-1"/>
                </button>
            </div>
            <Table striped bordered hover responsive="md" className="w-100">
                <thead className="bg-dark text-white">
                <tr>
                    <th>
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={selectedUsers.length === data.length}
                            onChange={handleSelectAll}
                        />
                    </th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Registration Date</th>
                    <th>Last Login Date</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {data.map((user) => (
                    <tr key={user.id} className={user.attributes.status === 'blocked' ? 'table-primary' : ''}>
                        <td>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={selectedUsers.includes(user.id)}
                                onChange={() => handleSelectUser(user.id)}
                            />
                        </td>
                        <td>{user.id}</td>
                        <td>{user.attributes.userName}</td>
                        <td>{user.attributes.userEmail}</td>
                        <td>{formatDate(user.attributes.registrationDate)}</td>
                        <td>{formatDate(user.attributes.lastLoginDate, true)}</td>
                        <td>{user.attributes.status}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UsersTable;