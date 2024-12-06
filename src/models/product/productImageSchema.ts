import mongoose from 'mongoose';

export const productImageSchema = new mongoose.Schema({   
    url: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },  
}, {_id: false})

