import Medicine from "../model/medicine.model.js";




export const editMed=async(req,res)=>{
    

};

export const getAllMed= async (req,res)=>
    {
    try {
      
      const products= await Medicine.find({});
        res.status(200).json(products);
    } catch (error) {
      console.log("there is error in getAllMed method check it out");
      res.status(500).json({"message":error.message})
    }
    
    }
    
export const findOneMed = async (req, res) => {
        try {
          const productId = req.params.id;
          // Validate ID
          if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid Product ID!" });
          }
      
          // Retrieve product
          const foundProduct = await Medicine.findById(productId);
          if (!foundProduct) {
            return res.status(404).json({ message: "Product not found!" });
          }
          console.log("Step 2: Found Product:", foundProduct);
      
          // Increment views count and update interaction counts
          const userId = req.user?.id; // Assuming you're tracking userId
          const updatedProduct = await Medicine.findByIdAndUpdate(
            productId,
            {
              $inc: { 
          
                "views.count": 1, 
              },
              $addToSet: { "views.users": userId} // Add userId to users array
            },
            { new: true } // Return the updated document
          );
          console.log("Step 3: Updated Product:", updatedProduct);
      
          // Retrieve seller information
          const pharmacyId = updatedProduct.pharmacyId;
          const pharmacy = await Seler.findById(pharmacyId);
      
          // Build response
          const fullInfoAboutProduct = pharmacy
            ? { updatedProduct, pharmacy }
            : { updatedProduct };
          console.log("Step 5: Full Info About Product:", fullInfoAboutProduct);
      
          res.status(200).json(fullInfoAboutProduct);
        } catch (error) {
          console.error("Error in getOneProduct method, check it out:", error);
          res.status(500).json({ message: error.message });
        }
      };
      


export const filterMed= async (req, res) => {
    try {
      const { name, price} = req.body;
  
      // Build the query dynamically
      const query = {};
      if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match for name
      if (price) query.price = { $lte: price }; // Price less than or equal to the given value
  
      // Perform the search
      const filteredProduct = await Medicine.find(query);
      res.status(200).json(filteredProduct);
    } catch (error) {
      console.error("Error in filterMed method, check it out:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

export const searchMed= async (req, res) => {
    try {
      const { name, price} = req.body;
  
      // Build the query dynamically
      const query = {};
      if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive partial match for name
      if (price) query.price = { $lte: price }; // Price less than or equal to the given value
  
      // Perform the search
      const foundProducts = await Medicine.find(query);
  
  
  
      // Handle the results
      if (foundProducts.length > 0) {
       
        res.status(200).json(foundProducts);
  
      } else {
        res.status(404).json({ message: "No matching products found" });
      }
    } catch (error) {
      console.error("Error in searchMed method:", error);
      res.status(500).json({ message: error.message });
    }
  };
