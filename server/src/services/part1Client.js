import axios from 'axios';

// Api calls for part 1 endpoints
const part1Client = axios.create({
  baseURL: process.env.PART1_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${process.env.PART1_API_KEY}`
  }
});

export default part1Client;