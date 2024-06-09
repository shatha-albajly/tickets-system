// components/TicketTable.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateTicketStatus } from '../features/ticket/ticketSlice';

const TicketTable = () => {
    const tickets = useSelector(state => state.ticketState);
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleStatusChange = (id, newStatus) => {
        dispatch(updateTicketStatus({ id, status: newStatus }));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearchTerm = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatusFilter = statusFilter ? ticket.status === statusFilter : true;
        return matchesSearchTerm && matchesStatusFilter;
    });

    return (
        <div className="overflow-x-auto ">
            <div className='flex mb-6 justify-between items-center'>
                <h1 className='text-2xl font-bold leading-none tracking-tight sm:text-2xl'>
                    Tickets Dashboard</h1>

                <Link to="/create-ticket" className="btn btn-primary ">
                    Add New Ticket
                </Link>
            </div>

            <div className='flex gap-4  mb-4 justify-between items-center'>

                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name or description"
                    className="input w-full input-bordered "
                />
                <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="select select-bordered "
                >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="solved">Solved</option>
                </select>

            </div>


            <table className="table border table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Comments</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <th>{ticket.id}</th>
                            <td>{ticket.title}</td>
                            <td>{ticket.description}</td>
                            <td>
                                <select
                                    value={ticket.status}
                                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                    className="select select-bordered select-sm"
                                >
                                    <option value="active">active</option>
                                    <option value="solved">solved</option>
                                </select>
                            </td>
                            <td>{ticket.comments.length}</td>
                            <td>
                                <Link to={`/ticket/${ticket.id}`} className="btn btn-primary btn-sm">
                                    View Details
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketTable;
