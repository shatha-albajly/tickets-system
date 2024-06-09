// features/tickets/ticketsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: [

    ],
    reducers: {
        addTicket: (state, action) => {
            state.push({ id: state.length + 1, ...action.payload });
        },
        updateTicketStatus: (state, action) => {
            const { id, status } = action.payload;
            const ticket = state.find(ticket => ticket.id === id);
            if (ticket) {
                ticket.status = status;
            }
        },
        addComment: (state, action) => {
            const { id, comment } = action.payload;
            const ticket = state.find(ticket => ticket.id === id);
            if (ticket) {
                ticket.comments.push(comment);
            }
        },
        setTickets: (state, action) => {
            return action.payload;
        }
    }
});

export const { addTicket, updateTicketStatus, addComment, setTickets } = ticketsSlice.actions;

export default ticketsSlice.reducer;
