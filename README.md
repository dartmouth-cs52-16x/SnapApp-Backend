# Project Name

SnapApp is a web application that allows users to send "captionable" pictures to other users that will disappear after they are seen by the receiving user. Think of Snapchat but in your web browser, allowing you to communicate with your friends and family from your computer whenever it is open and in front of you instead of having to get your phone out, unlock it, and search for Snapchat to get the job done. SnapApp's smooth interface and speed makes it great for messing with your friends when you need a break from studying or your phone is too far out of your reach. You can find the current version at https://snap.surge.sh/.

Console:

This is the home of SnapApp, where you can see all the snaps you have received from friends.

![Image](./images/Main View.jpg)

Compose Snap Screen:

This is where you compose a snap by either using your webcame or uploading a photo from your machine.

![Image](./images/Snap View.jpg)

Profile Screen:

This is where you can see information about yourself and your account so you can let your friends know your username so they can add you!

![Image](./images/Profile View.jpg)

Friends Screen:

This is where you can add friends! Crazy right?

![Image](./images/Friends View.jpg)



Users will see all of their incoming snaps and activity on the console page which they reach after logging in or signing up. They can then click on the icons on the left to create a new Snap, to add new friends, or to delete or edit their account setting!


## Architecture

### Frontend

For the Front End of our application, we decided to use React and Redux to manage our data and display it to the user accordingly. This means that we can use actions, reducers, the redux store, and other built in libraries to accurately display and update the pictures a user receives. To authenticate users of SnapApp, we will be using Passport.js to make JSON Web Tokens for our application and for users.


### Backend

For the Back End of our application, we used a Node app running Express.js and using Mongoose to interact with a MongoDB database hosted on Heroku to store our data. This allowed us to persist data from the database and store various data types like photos, strings, identification numbers and more. We also used Amazon's S3 surface to store image data and reference this data by storing the keys for the images in the S3 bucket.

The result of this architecture was a responsive and fast application ready to handle all of your funny, inappropriate, and crazy snaps.



## Setup

To setup the frontend and backend projects, `git clone` the SnapApp-Frontend and SnapApp-Backend repositories from the Dartmouth-CS52 github account. Then when you `cd` to each repository in your terminal, follow the next directions:

`npm install`

Running this will install all the node modules and libraries that you need to compile and run the application on your end and to test that it works. If, for some reason, there are some unmet dependencies, simply npm install those manually as well and you should be up and running.

For the SnapApp-Frontend repository run:

`npm start`

This will allow you to test the project locally on your own localhost.

For the SnapApp-Backend repository run the following in a different terminal window:

For the SnapApp-Backend repository run:

Ensure that you have MongoDB installed on your local machine and running at port 27017 in order for the backend to connect to that instance. If not, check out MongoDB's guides to help you set that up, it is extremely easy and an important tool for any dev.

`npm run dev`

This will start the backend server at your own local host to test, typically port 9090.


## Deployment

Currently the most up to date versions of the frontend and backend are hosted on surge and Heroku respectively. In order to start the backend, ensure that you have MongoDB set up correctly on your computer. You should have a data/db directory at the root of your computer as MongoDB requires this. Navigate to the directory for the SnapApp-Backend and run `npm run dev` which will start the server at the localhost:9090 for the front end of your application to communicate with. You will also need to run `mongod &` in another terminal window at the root of your computer for the app to connect to.

Ensure that the SnapApp-Frontend points to the correct localhost port. Now, navigate to the SnapApp-Frontend directory and run `npm start` to launch the project running on a local host. Navigate to that local host path in your Chrome browser and begin testing.

To deploy your frontend changes to Surge, add, commit, and push your changes to your branch and create a PR to merge your additions into our master branch. Contact us and we can take a look at your PR and choose to merge it in or not. Then, you can pull the new master and run `npm run deploy` to deploy the updated version to snap.surge.sh.

To deploy your backend changes to Heroku, simply add, commit, and push your changes to your branch and create a PR for our review. Once accepted, you can pull the most recent master and then run `git push heroku master` to deploy the new backend to heroku. This may take several minutes.  

## Authors

Rajiv Ramaiah, Josh Kerber, Chris Davis, Zuff Idries, Brophy Tyree

## Acknowledgments

[The HW5 Part 1 instruction guide](http://cs52.me/assignments/hw5p2/)
Also see sources listed within different .js files!


Procfile set up to run on [heroku](https://devcenter.heroku.com/articles/getting-started-with-nodejs#deploy-the-app)
