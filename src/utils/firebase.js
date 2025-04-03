// src/utils/firebase.js
/**
 * Safely handle Firebase timestamps in API responses
 * @param {Object} data - API response data that might contain timestamps
 * @returns {Object} - Sanitized data with ISO formatted dates
 */
export const handleFirebaseTimestamps = (data) => {
    if (!data) return data;
    
    if (typeof data !== 'object') return data;
    
    // If data is an array, process each item
    if (Array.isArray(data)) {
      return data.map(item => handleFirebaseTimestamps(item));
    }
    
    // Process object fields
    const result = {};
    
    for (const [key, value] of Object.entries(data)) {
      // Process nested objects and arrays
      if (typeof value === 'object' && value !== null) {
        result[key] = handleFirebaseTimestamps(value);
      }
      // Handle timestamps (value is null but key suggests it's a timestamp)
      else if (
        value === null && 
        (key.toLowerCase().includes('time') || 
         key.toLowerCase().includes('date') || 
         key.toLowerCase().includes('created') || 
         key.toLowerCase().includes('updated'))
      ) {
        result[key] = new Date().toISOString(); // Default to current time if timestamp is null
      } 
      // Normal values
      else {
        result[key] = value;
      }
    }
    
    return result;
};