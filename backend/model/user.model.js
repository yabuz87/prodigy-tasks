import mongoose from "mongoose";
const userSchema=mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
    },
    phone:{
        type:String
    },
    location:{
            type:Object,
            default:""
    },
    password:{
        type:String,
        
    },
    profile:{
        type:String,
        default:""
    },
    
})

export default mongoose.model("User",userSchema);
