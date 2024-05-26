import mongoose from "mongoose";

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: 'https://studyonline.rmit.edu.au/sites/default/files/KP%20RMIT%20MM%20-%20Mini%20IG%20Header_0.jpg'
    },
    targetURL: {
        type: String,
        required: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true});

const Ad = mongoose.model('Ad',adSchema);

export default Ad;