import mongoose from "mongoose";
const medicineSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
    },
    pharmacyId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pharmacy"
    },
    price: {
        type: Number,
        required: true,
    },
    information: {
        type: Object
    },
    view: {
        users: [],
        count: { type: Number, default: 0 }
    },
    photo: {
        image: []
    },
    photo_id: {
        type: String
    }
}, { timestamps: true });


export default mongoose.model("Medicine",medicineSchema);