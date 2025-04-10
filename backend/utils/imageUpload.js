import cloudinary from "./cloudinary.js";
 const uploadImage= async(file)=>{
    if(!file)
        {
            console.log("there is error in the file");
         // return res.status(404).json({"message":"profile picture is required"});
        }
      const uploadResponse= await cloudinary.uploader.upload(file);
      return uploadResponse.secure_url;

}
export default uploadImage;