import Pharmacy from "../model/pharmacy.model.js";
export const statusCheck = async (req, res, next) => {
   try {
      const userId = req.user?._id;
      if (!userId) {
         return res.status(403).json({ message: "Unauthorized: User not found" });
      }

      console.log(userId);
      const pharmacy = await Pharmacy.findById(userId);

      if (!pharmacy) {
         return res.status(404).json({ message: "Invalid pharmacy ID" });
      }

      const stat = pharmacy.status;
      if (stat === "not-approved") {
         return res.status(403).json({ message: "Sorry, you're not allowed to access this action." });
      } 
      if (stat === "pending") {
         return res.status(403).json({ message: "Sorry, your account is on process. Please bear with us until we finish our filtering process." });
      }

      next();

   } catch (error) {
      console.log("There is an error in the statusCheck method:", error);
      res.status(500).json({ error: error.message });
   }
};
