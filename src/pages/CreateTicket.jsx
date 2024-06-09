// components/CreateTicket.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import { addTicket } from '../features/ticket/ticketSlice';

const CreateTicket = () => {
    const dispatch = useDispatch();
    const token = useSelector(state => state.userState.user.token);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await customFetch.post('/tickets',
                {
                    ...data, status: 'open', device_name: "iPhone 12", "created_by": 17
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 201) {
                dispatch(addTicket(response.data));
                toast.success('Ticket created successfully.');
                reset();
                // Redirect to the home page after submission
                // history.push('/');
            } else {
                toast.error('Error creating ticket. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Error creating ticket. Please try again.');
        }
    };

    return (
        <>
            <h1 className="mb-4 text-2xl font-bold text-center">Create New Ticket</h1>
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
                <div className="flex gap-4 mt-4 w-full justify-between">
                    <button type="submit" className="btn w-full btn-primary">Submit</button>
                </div>
            </form>
        </>
    );
};

export default CreateTicket;
