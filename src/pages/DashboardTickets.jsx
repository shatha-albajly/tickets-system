// components/TicketTable.js
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
import { setTickets, updateTicketStatus } from '../features/ticket/ticketSlice';

const DashboardTickets = () => {
    const tickets = useSelector(state => state.ticketState);
    const dispatch = useDispatch();
    const token = useSelector(state => state?.userState?.user?.token);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await customFetch.get('/tickets', {
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    dispatch(setTickets(response.data));
                }
            } catch (error) {
                console.error(error);
                toast.error('Error fetching tickets. Please try again.');
            }
        };

        if (token) {
            fetchTickets();
        }
    }, [dispatch, token]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await customFetch.put(`/tickets/${id}`, { status: newStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                dispatch(updateTicketStatus({ id, status: newStatus }));
                toast.success('Ticket status updated successfully.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error updating ticket status. Please try again.');
        }
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

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center ">
                <h1 className="text-2xl font-bold mb-4">You must be logged in to view this page.</h1>
                <Link to="/login" className="btn btn-primary">Login</Link>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className='flex mb-6 justify-between items-center'>
                <h1 className='text-2xl font-bold leading-none tracking-tight sm:text-2xl'>
                    Tickets Dashboard
                </h1>
                <Link to="/create-ticket" className="btn btn-primary">
                    Add New Ticket
                </Link>
            </div>

            <div className='flex gap-4 mb-4 justify-between items-center'>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search by name or description"
                    className="input w-full input-bordered"
                />
                <select
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    className="select select-bordered"
                >
                    <option value="">All Statuses</option>
                    <option value="open">open</option>
                    <option value="closed">closed</option>
                </select>
            </div>

            <table className="table border table-zebra w-full">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Status</th>
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
                                    <option value="open">open</option>
                                    <option value="closed">closed</option>
                                </select>
                            </td>
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

export default DashboardTickets;
