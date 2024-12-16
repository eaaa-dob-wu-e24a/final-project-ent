# LendR Project

This project revolves around a fictional concept of a company called **LendR**, which acts as a connection between two users, meeting their needs through the platform.

---

## System Structure

The project consists of three main components:

1. **Backend**:

   - Built using **MySQL** and **PHP**.
   - Hosted on **Simply**, which manages the database hosting. In the final version, you will see this integrated.
   - A single `index.php` file handles multiple queries under the **Read** operation. Depending on the parameters sent to the endpoint, it can return a specific order or all orders.
   - Implements full **CRUD functionality**, though not all operations are fully utilized on the frontends (yet).

2. **Frontends**:
   - Two separate frontends have been developed:
     - **User Frontend**: Built using **Next.js** for LendR’s users.
     - **Support Frontend**: Built using **Remix** for the admin dashboard, intended for the LendR team or support staff.

---

## Frontend Details

### **User Frontend (Next.js)**

- The **Next.js** frontend is focused on handling actions for server functionality, while many components themselves are server-based.
- Some functionalities, like the login flow, are currently client-based. However, future development will transition these to run on the server for better performance and security.
- **Key Features**:
  - Reusable components can be found in the `components` folder.
  - Additional functionality is organized in folders for actions, hooks, and helpers.

---

### **Support Frontend (Remix)**

- The **Remix** frontend is built for the admin dashboard.
- Takes full advantage of Remix's **loader functions** for fetching data.
- **Key Features**:
  - A folder called `utils` contains files corresponding to backend endpoints. For example:
    - For the `order` endpoint, there is an `order_util.jsx` file in the `utils` folder to fetch data.
    - These utility files are used in the respective pages where data from the backend is displayed (e.g., an "Order" page).

---

## Authentication and Authorization

Both frontends fetch data from the same backend and use an authentication flow:

- Upon login, a cookie is set containing an **access token**.
- The access token is used to verify authorization depending on whether the user logs in through the user or admin interface.

---

## Environment Files

Environment variables are required for each part of the system:

### **Backend**

- For security reasons, the database connection details are not included here.
- For access, contact **eaanharm.students@gmail.com**.

### **User Frontend**

NEXT_PUBLIC_API_URL=http://localhost:4000

### **User Frontend**

BACKEND_URL=http://localhost:4000

### TO RUN THE SOLUTION

Its important to run the backend on port 4000. To do this make sure your in the backend folder

- cd backend
  -> php -S localhost:4000

In the frontend solution you want to open, after you installed all the needed files, run "npn run dev"
