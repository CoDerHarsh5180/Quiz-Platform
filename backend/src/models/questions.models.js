import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const questionSchema = new mongoose.Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    index: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    image:{
        type: String,
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    }
});

export const Question = mongoose.model('Question', questionSchema);