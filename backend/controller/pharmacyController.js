import Medicine from "../model/medicine.model.js";
import Pharmacy from "../model/pharmacy.model.js"
import bcrypt from "bcrypt";
import  {generateToken}  from "../utils/utils.js";


// authentication starts here let's go

// think of the google authentication and facebook authentication.


// Email validation function
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const signup = async (req, res) => {
  try {
      const { name, email, password, logo, location, certificate } = req.body;

      // Validate email format
      if (!isValidEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
      }

      if (password.length < 6) {
          return res.status(400).json({ message: "Password must be at least 6 characters" });
      }

      const pharma = await Pharmacy.findOne({ email: email });
      if (pharma) {
          return res.status(400).json({ message: "Email already exists" });
      }


      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newPharma = new Pharmacy({
          name,
          email,
          certificate,
          location,
          logo,
          password: hashedPassword
      });

      if (newPharma) {
          generateToken(newPharma._id,res);
          await newPharma.save();
          res.status(201).json({
              _id: newPharma._id,
              name: newPharma.name,
              certificate: newPharma.certificate,
              email: newPharma.email,
              logo: newPharma.logo
          });
      } else {
          res.status(400).json({ message: "Invalid pharmacy data" });
      }

  } catch (error) {
      console.log("Error in signing up controller: " + error.message);
      res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const pharma = await Pharmacy.findOne({ email: email });
        if (!pharma) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPassword = await bcrypt.compare(password, pharma.password);
        if (!isPassword) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = generateToken(pharma._id, res);
        return res.status(200).json({
            _id: pharma._id,
            email: pharma.email,
            name: pharma.fullName,
        });

    } catch (err) {
        console.log({ message: err.message });
        res.status(500).json({ message: "Internal error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
        console.log("Error in logout controller", err.message);
        res.status(500).json({ message: "Internal error" });
    }
};


export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
  };


//   here the authentication ends ryt ?




export const getMyPosts=async(req,res)=>
{
   try {
    const userId=req.user._id;
    const myPosts=await Medicine.find({pharmacyId:userId});
    if(!myPosts){
        res.status.json({"message":"there is no items in this id"});
    }
    res.status(200).json(myPosts);
   } catch (error) {
        console.log("Error in getMyPosts controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
   }
}
export const addMed = async (req, res) => {
  try {
      const { name, information, price, pharmacyId } = req.body;
      const existingMed = await Medicine.findOne({ name });
      if (existingMed) {
          return res.status(400).json({ message: "Medicine with this name already exists" });
      }

      const newMed = new Medicine({
          name,
          information,
          pharmacyId,
          price
      });
      await newMed.save();

      res.status(201).json(newMed);
  } catch (error) {
      console.error("There is an error in addMed:", error.message);
      res.status(500).json({ message: "Internal server error" });
  }
};



export const deleteMed= async (req, res) => {
    try {
        const userId=req.user._id;      
        const { id } = req.params;
        
         
       
        const item = await Medicine.findById(id);
        if (!item) {
            return res.status(404).json({ "message": "Medicine not found" });
        }

        // Extract the publicId from the image URL (adjust based on your URL format)
        const publicId = item.photo_id;

        // Delete the image from Cloudinary
        // await cloudinary.uploader.destroy(publicId, (error, result) => {
        //     if (error) {
        //         console.error('Error deleting image from Cloudinary:', error);
        //         throw new Error('Failed to delete image from Cloudinary');
        //     }
        //     console.log('Cloudinary deletion result:', result);
        // });

        // Delete the item from MongoDB
        const deletedItem = await Medicine.findByIdAndDelete(id);
        return res.status(200).json(deletedItem);

    } catch (error) {
        console.error("There is an error in Delete Method:", error.message);
        res.status(500).json({ "message": error.message });
       
    }
};
export const editMed = async (req, res) => {
  try {
      

      const userId =req.user._id;
      console.log(userId);
      if (!userId) {
          return res.status(403).json({ message: "Unauthorized: User not found" });
      }

      const medicineId = req.params.id;
      const updates = req.body;

      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
          return res.status(404).json({ message: "medicine not found" });
      }
        console.log(medicine.pharmacyId);
      if (userId.toString() !== medicine.pharmacyId.toString()) {
          return res.status(403).json({ message: "Unauthorized: ID mistatch" });
      }

      const allowedUpdates = ["name", "price", "information", "photo", "photo_id"];
      const filteredUpdates = Object.keys(updates).filter((key) => allowedUpdates.includes(key));

      filteredUpdates.forEach((key) => {
          medicine[key] = updates[key];
      });

      await medicine.save();

      res.status(200).json({ message: "Product updated successfully", medicine });
  } catch (error) {
      console.error("Error in editMed:", error.message);

      if (error.name === "CastError") {
          return res.status(400).json({ message: "Invalid product ID" });
      }

      res.status(500).json({ message: "An error occurred", error: error.message });
  }
};