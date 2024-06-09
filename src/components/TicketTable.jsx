// components/TicketTable.js
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateTicketStatus } from '../features/ticket/ticketSlice';

const ordersQuery = (params, user) => {
    console.log({ params, user });
    return {
        queryKey: [
            'orders',
            user.username,
            params.page ? parseInt(params.page) : 1,
        ],
        queryFn: () =>
            customFetch.get('/orders', {
                params,
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            }),
    };
};

export const loader =
    (store, queryClient) =>
        async ({ request }) => {
            const user = store.getState().userState.user;

            if (!user) {
                toast.warn('You must logged in to view orders');
                return redirect('/login');
            }
            const params = Object.fromEntries([
                ...new URL(request.url).searchParams.entries(),
            ]);
            try {
                const response = await queryClient.ensureQueryData(
                    ordersQuery(params, user)
                );

                return { orders: response.data.data, meta: response.data.meta };
            } catch (error) {
                console.log(error);
                const errorMessage =
                    error?.response?.data?.error?.message ||
                    'there was an error placing your order';
                toast.error(errorMessage);
                if (error?.response?.status === 401 || 403) return redirect('/login');
                return null;
            }
        };
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
                    <option value="closed">closed</option>
                    <option value="open">open</option>
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
                                    <option value="open">open</option>
                                    <option value="closed">closed</option>
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
