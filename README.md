
# **Role-Based Access Control (RBAC) System**

## **Overview**
This project is a web-based **Role-Based Access Control (RBAC)** system that enables user management and role management with granular permission settings. It provides an admin dashboard to perform CRUD operations on users and roles, with access restricted based on the roles and permissions defined in the system.

---

## **Features**

### **1. User Management**
- View a list of all users.
- Add, edit, or delete users.
- Assign roles to users dynamically.
- Status toggle (Active/Inactive) for users.
- Restrict non-admin users from:
  - Assigning the **Admin** role.
  - Modifying or deleting Admin users.
- Data persistence is handled via a `users.json` file located in the `data` folder.

### **2. Role Management**
- View a list of roles and their permissions.
- Add, edit, or delete roles.
- Assign permissions to roles (e.g., `Read`, `Write`, `Update`, `Delete`).
- Data persistence is handled via a `roles.json` file located in the `data` folder.

### **3. Dynamic Permissions**
- Role-based actions:
  - **Admin**: Full access to all actions.
  - Other roles: Access restricted based on their defined permissions.
- Permissions include:
  - `Read`: View users and roles.
  - `Write`: Create or edit users.
  - `Update`: Edit roles or user details.
  - `Delete`: Remove users or roles.

---

## **Technology Stack**

- **Frontend**: React with Next.js (Client-side rendering for interactive components)
- **Backend**: Next.js API Routes
- **State Management**: React's `useState` and `useEffect`
- **Styling**: Tailwind CSS
- **Data Storage**: JSON files (`users.json`, `roles.json`) in the `data` folder
- **Authentication**: JWT (JSON Web Token)
- **Permissions**: Dynamic role-based permissions fetched from `roles.json`

---


## **Setup and Installation**

### **1. Prerequisites**
- Node.js (v16 or higher)
- Git

### **2. Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/kjrockzz/rbac-system.git
   ```
   
2. Navigate to the project directory:
   ```bash
   cd rbac-system
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### **3. Running the Project**
- Start the development server:
  ```bash
  npm run dev
  ```
- The app will be available at [http://localhost:3000](http://localhost:3000).

---

## **Functionality Details**

### **1. CRUD Operations**
- **Users**:
  - Stored in `data/users.json`.
  - Can be fetched, created, updated, or deleted via `/api/users` API.
- **Roles**:
  - Stored in `data/roles.json`.
  - Can be fetched, created, updated, or deleted via `/api/roles` API.

### **2. Admin-Specific Privileges**
- Only Admin users can:
  - Modify or delete Admin users.
  - Assign the Admin role to other users.
  - Add or edit roles and permissions.

### **3. Data Handling**
- All data changes are directly reflected in the JSON files located in the `data` folder.

### **4. Protected Actions**
- Protected API routes and UI actions are validated via role-based permissions.
- Non-admin users cannot:
  - Assign Admin roles.
  - Delete Admin users.

---

## **API Endpoints**

### **1. Users**
| Method | Endpoint    | Description                  |
|--------|-------------|------------------------------|
| GET    | `/api/users` | Fetch all users.            |
| POST   | `/api/users` | Add a new user.             |
| PUT    | `/api/users` | Edit an existing user.      |
| DELETE | `/api/users` | Delete a user.              |

### **2. Roles**
| Method | Endpoint    | Description                  |
|--------|-------------|------------------------------|
| GET    | `/api/roles` | Fetch all roles.            |
| POST   | `/api/roles` | Add a new role.             |
| PUT    | `/api/roles` | Edit an existing role.      |
| DELETE | `/api/roles` | Delete a role.              |

---

## **How It Works**

### **1. Role and Permission Fetching**
- The user's role is fetched from `users.json` based on their email.
- The role's permissions are fetched from `roles.json` and set dynamically.

### **2. Authentication**
- JWT tokens are used for authenticating the user.
- Token verification ensures that only logged-in users can access the dashboard.

### **3. Role-Based Restrictions**
- Permissions are enforced both in the frontend (UI) and backend (API).

---

## **Future Enhancements**
- Integrate with a database (e.g., MongoDB, PostgreSQL) for better scalability.
- Implement pagination and search in user and role lists.
- Add a feature to reset forgotten passwords.

---

## **License**
This project is licensed under the MIT License.
