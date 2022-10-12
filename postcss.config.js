const tailwindcss = require("tailwindcss")
module.exports = {
    plugins: [
        tailwindcss("./tailwind.config.js"), 
        require("postcss-import"), 
        process.env.NODE_ENV === 'production' && require("cssnano")
    ]
  }