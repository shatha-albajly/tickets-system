// components/CreateTicket.js
import React from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
// import { useHistory } from 'react-router-dom';
import { addTicket } from '../features/ticket/ticketSlice';
import { comment } from 'postcss';


const CreateTicket = () => {
    const dispatch = useDispatch();
    // const history = useHistory();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        console.log({ ...data, status: 'open', comments: [] });
        dispatch(addTicket({ ...data, status: 'open', comments: [] }));
        reset();
        // history.push('/'); // Redirect to the home page after submission
    };

    return (
        <>
            <h1 className="mb-4 text-2xl font-bold  text-center">Create New Ticket</h1>
            <form className="max-w-md mx-auto border shadow rounded-lg p-7" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-control">
                    <label className="label">Name</label>
                    <input
                        {...register("title", { required: "Name is required" })}
                        className="input input-bordered"
                    />
                    {errors.title && <p className="text-red-500">{errors.title.message}</p>}
                </div>
                <div className="form-control w-full">
                    <label className="label">Description</label>
                    <textarea
                        {...register("description", { required: "Description is required" })}
                        className="textarea textarea-bordered"
                    ></textarea>
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>


                {/* <div className="form-control">
                    <label className="label">Comments</label>
                    <textarea
                        {...register("comments", { required: "Comments are required" })}
                        className="textarea textarea-bordered"
                    ></textarea>
                    {errors.comments && <p className="text-red-500">{errors.comments.message}</p>}
                </div> */}
                <div className="flex gap-4  mt-4 w-full justify-between">
                    <button type="submit" className="btn w-full  btn-primary">Submit</button>
                </div>
            </form>
        </>
    );
};

export default CreateTicket;
