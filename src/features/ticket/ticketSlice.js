import { createSlice } from '@reduxjs/toolkit';

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: [
        { id: 1, title: "Cy Ganderton", description: "Quality Control Specialist", status: "active", comments: ['1', '2'] },
        { id: 2, title: "Hart Hagerty", description: "Desktop Support Technician", status: "solved", comments: [] },
        { id: 3, title: "Brice Swyre", description: "Tax Accountant", status: "active", comments: [] }
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
        }
    }
});

export const { addTicket, updateTicketStatus, addComment } = ticketsSlice.actions;

export default ticketsSlice.reducer;

