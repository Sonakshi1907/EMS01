// import { useAuth } from "./context/AuthContext.jsx";

// function App() {
//   const { currentUser, login } = useAuth();

//   const handleTestLogin = () => {
//     const result = login("rahul@gmail.com", "123456");

//     console.log(result);
//   };

//   return (
//     <div>
//       <h1>Employee Management System</h1>

//       <p>Current User: {currentUser ? currentUser.name : "Nobody logged in"}</p>

//       <button onClick={handleTestLogin}>Test Login</button>
//     </div>
//   );
// }

// export default App;

// import Login from "./pages/Login.jsx";

// function App() {
//   return <Login />;
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import { useAuth } from "./context/AuthContext.jsx";
import Login from "./components/Auth/Login.jsx";
import AdminDashboard from "./components/Dashboard/AdminDashboard.jsx";
import EmployeeDashboard from "./components/Dashboard/EmployeeDashboard.jsx";

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate
              to={currentUser.role === "admin" ? "/admin" : "/employee"}
              replace
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/admin"
        element={
          currentUser?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/employee"
        element={
          currentUser?.role === "employee" ? (
            <EmployeeDashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
