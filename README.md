# Spotify Buzz

Spotify Buzz uses your saved spotify songs to create an interactive trivia game where you have 10 seconds to guess the song playing. The app uses the spotify api for the track audio, and metadata.

![Video demo of app](/public/readme_assets/mobile_demo.gif)

## Setup

1. Create an app using the spotify developer dashboard to obtain a client id. In the app settings, set the <b>Redirect URI</b> to `http://localhost:3000/game`

2. Copy the project files to a directory, and create a .env file in the root directory with the following information:

    ```
    # Replace with the client id obtained from the spotify dashboard
    REACT_APP_CLIENT_ID=23943hj23jkl23sd9023klzkjldfal90
    ```

3. Install node version 16.0.0 manually or using [nvm](https://github.com/nvm-sh/nvm) and run:
    ```
    npm install
    ```
4. Run the following command to start the app, and go to localhost:3000 in your browser to start playing
    ```
    npm run start
    ```
