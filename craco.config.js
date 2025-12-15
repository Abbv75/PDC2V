const path = require('path');  // Import the 'path' module

module.exports = {
  webpack: {
    configure: {
      output: {
        path: path.resolve(__dirname, 'PDC2V_map'),  // Replace with your target folder
      },
    },
  },
};
