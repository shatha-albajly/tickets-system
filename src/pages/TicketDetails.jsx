// components/TicketDetails.js
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateTicketStatus, addComment } from "../features/ticket/ticketSlice";

const TicketDetails = () => {
    const { id } = useParams();


    const ticket = useSelector((state) =>
        state.ticketState.find((ticket) => ticket.id === Number(id))
    );
    console.log(ticket);
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const handleStatusChange = (newStatus) => {
        dispatch(updateTicketStatus({ id: ticket.id, status: newStatus }));
    };

    const onSubmit = (data) => {
        console.log(data);
        dispatch(addComment({ id: ticket.id, comment: data.comment }));
        reset();
    };

    if (!ticket) {
        return <p>Ticket not found</p>;
    }

    return (
        <div className="max-w-lg mx-auto shadow rounded-lg p-6 border">
            <h1 className='text-2xl mb-8 text-center font-bold leading-none tracking-tight sm:text-2xl'>

                {ticket.title}</h1>
            <p className="text-lg mb-6"> <span className="font-bold">Description : </span>{ticket.description}</p>
            <p className="text-lg mb-6"> <span className="font-bold">Status : </span>

                <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="select select-bordered select-sm"
                >
                    <option value="active">active</option>
                    <option value="solved">solved</option>
                </select>
            </p>
            <h3>Comments</h3>

            <ul>
                {ticket.comments.map((comment, index) => (
                    <div key={index} className="chat chat-start">
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                <img alt="Tailwind CSS chat bubble component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                            </div>
                        </div>
                        <div className="chat-bubble  max-w-sm">{comment}</div>
                    </div>
                ))}
            </ul>
            {ticket.status == "active" &&
                <form className="max-w-md" onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-control my-4">
                        <label className="label">Add Comment</label>
                        <textarea
                            {...register("comment", { required: "Comment is required" })}
                            className="textarea textarea-bordered "
                        ></textarea>
                        {errors.comment && (
                            <p className="text-red-500">{errors.comment.message}</p>
                        )}
                    </div>
                    <button type="submit" className="mt-1 btn btn-primary w-full">
                        Submit
                    </button>
                </form>}
        </div>
    );
};

export default TicketDetails;
