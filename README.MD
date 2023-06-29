![Getting Started](./frontend/img/logo.pg)


# Scissors
Scissor is a simple tool which makes URLs as short as possible.
This repo consist of:
- The Frontend: HTML, CSS, Vanilla JavaScript
- The Backend: NODE.js, Express.js, MongoDB


## Base URL
- https://scly.live

## Backend API Documentation
- https://2bit2bit.stoplight.io/docs/scissors/branches/main/ge8qvyaii4v6b-scissors-url-shortner

# Features
- URL Shortening:
Scissor allows users to shorten URLs by pasting a long URL into the Scissor platform and a shorter URL gets automatically generated. The shortened URL is designed to be as short as possible, making it easy to share on social media or through other channels.
- Custom URLs:
Scissor also allows users to customize their shortened URLs. Users can choose their own custom domain name and customize the URL to reflect their brand or content. This feature is particularly useful for individuals or small businesses who want to create branded links for their
- QR Code Generation:
Scissor allows users to also generate QR codes for the shortened URLs. Users can download the QR code image and use it in their promotional materials or/and on their website. This feature will be implemented using a third-party QR code generator API, which can be integrated into the Scissor platform.
- Analytics:
Scissor provides basic analytics that allow users to track their shortened URL's performance. Users can see how many clicks their shortened URL has received and where the clicks are coming from. We need to track when a URL is used.
- Link History:
Scissor allows users to see the history of links they’ve created so they can easily find and reuse links they have previously created

  
## Setup Project

1. Clone repo
2. Navigate to the backend directory and run ```npm install``` to install dependencies
3. Create a .env file and add the following environment variables
    - PORT
    - MONGODB_URI
    - JWT_SECRET
    - CLOUD_NAME
    - CLOUDINARY_API_KEY
    - CLOUDINARY_API_SECRET
    - CLOUDINARY_URL
    - IPINFO_API_KEY
    - REDIS_USERNAME
    - REDIS_PORT
    - REDIS_HOST
    - REDIS_PASSWORD
4. run ```npm start``` to start the server
5. Update res.redirects in ```backend > routes > visitRoute.js``` to point to your frontend server
6. Navigate to ```Frontend > js > main.js``` and update ```host``` to your localhost (or server's url)
7. Visit the frontend homepage and get started!!

## License

[MIT](https://choosealicense.com/licenses/mit/)
   


