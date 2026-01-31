import axios from 'axios';
import { API_BASE_URL } from './constants.js';

// We create an axios instance. 
// Think of this as a pre-configured "Messenger" that knows where to go.
const API = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * For now, this is a simple instance. 
 * Later, when we add Authentication, we will add an "Intercepter" here 
 * to automatically attach the User Token to every request.
 */

export default API;