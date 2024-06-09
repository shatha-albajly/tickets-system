// components/TicketDetails.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateTicketStatus, addComment, setTickets } from "../features/ticket/ticketSlice";
import { customFetch } from "../utils"; // Import your customFetch function
import { toast } from "react-toastify";

const TicketDetails = () => {
    const { id } = useParams();
    let tickets = useSelector(state => state.ticketState);
    const ticket = tickets.find((ticket) => ticket.id === Number(id))

    console.log("tickets", tickets);
    const dispatch = useDispatch();
    const token = useSelector(state => state.userState.user.token);


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
                    console.log(response);
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


    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await customFetch.put(`/tickets/${id}`, { status: newStatus }, {
                headers: {
                    'Content-Type': 'application/json',
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                console.log(response);

                dispatch(updateTicketStatus({ id: ticket.id, status: newStatus }));

                // return { id, status };

            }
        } catch (error) {
            return rejectWithValue(error.response);
        }

    };

    const onSubmit = (data) => {
        if (ticket) {
            dispatch(addComment({ id: ticket.id, comment: data.comment }));
            // setTicket({ ...ticket, comments: [...ticket.comments, data.comment] }); // Update local state with new comment
            reset();
        }
    };

    if (!ticket) {
        return <p>Ticket not found</p>;
    }

    return (
        <div className="max-w-lg mx-auto shadow rounded-lg p-6 border">
            <h1 className='text-2xl mb-8 text-center font-bold leading-none tracking-tight sm:text-2xl'>
                {ticket.title}
            </h1>
            <p className="text-lg mb-6">
                <span className="font-bold">Description: </span>{ticket.description}
            </p>
            <p className="text-lg mb-6">
                <span className="font-bold">Status: </span>
                <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="select select-bordered select-sm"
                >
                    <option value="open">open</option>
                    <option value="closed">closed</option>
                </select>
            </p>
            <p></p>
            {/* <h3>Comments</h3> */}
            {/* <ul>
                {ticket.comments.map((comment, index) => (
                    <div key={index} className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <div className="chat-bubble max-w-sm">{comment}</div>
                    </div>
                ))}
            </ul> */}
            {/* {ticket.status === "open" &&
                <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control my-4">
                        <label className="label">Add Comment</label>
                        <textarea
                            {...register("comment", { required: "Comment is required" })}
                            className="textarea textarea-bordered"
                        ></textarea>
                        {errors.comment && (
                            <p className="text-red-500">{errors.comment.message}</p>
                        )}
                    </div>
                    <button type="submit" className="mt-1 btn btn-primary w-full">
                        Submit
                    </button>
                </form>} */}
        </div>
    );
};

export default TicketDetails;
