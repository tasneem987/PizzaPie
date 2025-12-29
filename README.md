# PizzaPie Web App 🍕

## Project Description
PizzaPie is a full-stack web app for browsing, adding, and ordering pizza menu items. Admins can manage the menu, and users can add items to their cart and checkout. The app features authentication, a responsive UI, and database-driven content.

**Key Features:**
- Browse pizza menu with images and prices
- Add items to cart
- Admin authentication for managing menu
- Add/Delete menu items (admin only)
- User registration and login
- Review system for menu items

---

## Technologies Used
- **Frontend:** React, React Router, Axios, CSS  
- **Backend:** Node.js, Express, MySQL, Multer, Bcrypt  
- **Hosting:** GitHub Pages (frontend), Render (backend)  
- **Version Control:** Git & GitHub

---

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)  
- npm  
- MySQL

### Backend Setup
1. Clone the repository:
```bash
git clone https://github.com/tasneem987/PizzaPie.git
cd PizzaPie/pizza-database

2. Install dependencies:
```bash
npm install

3. Create a .env file in pizza-database with your database credentials:
```bash
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
ADMIN_EMAIL=admin@pizzapie.com
PORT=5000

4. Start the backend server:
```bash
node server.js
//Backend runs at http://localhost:5000.

###Frontend Setup

1. Navigate to the frontend folder:
```bash
cd ../project-web2

2. Install dependencies:
```bash
npm install

3. Create a .env file in project-web2:
``bash
env
REACT_APP_API_URL=http://localhost:5000

4. Start the frontend:
```bash
npm start
Frontend runs at http://localhost:3000.
