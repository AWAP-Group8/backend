# backend

## Overview
This project is a backend application developed with Node.js and Express for managing a courier management system. It provides functionalities for user management, parcel dispatching, locker operations, and driver registration and management.

## Introduction of the project: 
The GoGoShip is a web-based application that simulates an automated parcel delivery locker system. The system includes applications for `consumer users`, `delivery drivers`, a `parcel locker touchscreen simulator`, and a `parcel generator "robot"`. Parcels are transported more efficiently from senders to receivers with the help of a parcel delivery service, guaranteeing prompt and safe delivery. These services provide easy door-to-door solutions for both consumers and corporations by utilizing a network of carriers. This test plan outlines the testing approach, test cases, and requirements for ensuring the system's functionality, performance, and security.  

## Installation
1. Clone the repository.
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file and set the necessary environment variables such as database connection details and mail server credentials.
4. Run `npm start` or `yarn start` to start the server.

## Usage
- Use the provided API endpoints for user registration, login, parcel dispatch, locker management, and driver operations.
- Ensure proper authentication and authorization for accessing restricted endpoints using JWT tokens.
- Utilize the nodemailer integration for sending email notifications for parcel arrivals.

## API Endpoints
- `POST /api/user/register` - Register a new user.
- `POST /api/user/login` - User login.
- `POST /api/parcel/dispatch` - Dispatch a parcel.
- `GET /api/locker/available` - Get a list of available lockers.
- `POST /api/driver/register` - Register a driver.
- ...

## Folder Structure
- `app.js` - Main entry point for the application.
- `mail/` - Contains modules for email functionality.
- `modules/` - Includes database connection setup.
- `routers/` - Defines different route handlers for users, parcels, lockers, and drivers.
- `services/` - Contains modules for business logic and data management.
- `utils/` - Includes utility functions and modules for data handling.

## Technologies used in the project:
### Back-end:
   - `Node.js`
   - `Express.js`
   - `Axios.js`
### Database:
   - `MySQL`
### Deployment:
   - `Microsoft Azure Cloud Service`

## Implementation tools for the Project:
- Version Control System: `Git & GitHub`
- Project Management Tool: `Kanban Board`
- Code Editor: `Visual Studio Code`
- API Testing: `Postman`
- Database Design Tool: `MySQL Workbench`

## The architecture of The Project:
<img width="600" height="300" alt="image" src="https://github.com/AWAP-Group8/consumer-application-frontend/assets/143256533/3af80d1f-4ab2-4c0c-927a-69cbcc33fea9">

## Project Interface Description:
In this project, three parts of the front-end portion have been worked such as `consumer user’s application`, `driver application` and `touchscreen view`. For these three parts, we developed one backend and store date in database. We create a parcel generator robot, which shows how a parcel can be automatically created. We also use testing. 

  ### Consumer service:
  This part we have added `register` and `login` functionality for users. After login, a user can `create parcel` according to his/her needs, `delete` own account, `track parcels`, `view the history` of receiving or `sending parcels` and users also `receive reminders` when there is a parcel waiting to be picked up. 
  
  ### Driver service:
  This application created for parcel delivery man called driver. Driver needs to `login` this website first. After login, driver can `select lockers`, `view which cabinets are empty`, choose which parcels need to be kept in the cabinet, which parcels need to be picked up for `delivery` and completing parcels pickup or keep driver must `change the parcel status`. After finishing driver has to `logout`.

  ### Touchscreen service
  when user put or `pick up` the parcel in the specific locker where user use this touchscreen. User type `cabinet number`, `sender code` or `pickup code` for parcel and completing parcels send or pick up must `change the parcel status` and `free the cabinet`.

  ## API Interfaces
1. **User**
    - interface IUser { username: string, email: string, password: string }
    - Interface for user data, including username, email, and password fields.

2. **Parcel**
    - interface IParcel { id: string, recipient: string, destination: string, weight: number }
    - Interface for parcel data, including ID, recipient, destination, and weight fields.

3. **Locker**
    - interface ILocker { id: string, location: string, available: boolean }
    - Interface for locker data, including ID, location, and availability fields.

4. **Driver**
    - interface IDriver { name: string, license: string, vehicle: string }
    - Interface for driver data, including name, license information, and vehicle details.

## Testing
- Unit tests are available in the `/tests` directory. Run `npm test` to execute the tests.

## Deployment:
For deployment, we use `Microsoft Azure Cloud Service`
  ### Backend deployed link: 
    https://gogoship.azurewebsites.net

## GitHub Link: 
    https://github.com/orgs/AWAP-Group8/repositories
  ### backend: 
    https://github.com/AWAP-Group8/backend.git

## Contact
For any inquiries or support, please contact luoruimin01@outlook.com
