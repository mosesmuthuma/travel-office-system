import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    duration: { 
      type: Number, 
      required: true 
    },
    location: { 
      type: String, 
      required: true 
    },
    image: { 
      type: String, 
      default: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828' 
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;