import axios from "axios";

const getCoordinates = async (address) => {
  const apiKey = 'YOUR_LOCATIONIQ_API_KEY';
  const endpoint = `https://us1.locationiq.com/v1/search.php?key=${apiKey}&q=${encodeURIComponent(address)}&format=json`;

  try {
    const response = await axios.get(endpoint);
    console.log(response.data[0]); // Latitude and Longitude
  } catch (error) {
    console.error('Error:', error.message);
  }
};

getCoordinates("Addis Ababa, Ethiopia");