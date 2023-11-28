// helpers/index.js

// A helper to format dates
const formatDate = (date) => {
  // Assuming date is a JavaScript Date object
  // You can modify this as per your requirement
  return date.toLocaleDateString();
};

// A helper to capitalize the first letter of a string
const capitalize = (text) => {
  if (text && typeof text === "string") {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text;
};

// Export your helpers
module.exports = {
  formatDate,
  capitalize,
};
