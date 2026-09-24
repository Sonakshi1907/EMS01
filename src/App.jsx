import { useAuth } from "./context/AuthContext.jsx";

function App() {
  const { currentUser, login } = useAuth();

  const handleTestLogin = () => {
    const result = login("rahul@gmail.com", "123456");

    console.log(result);
  };

  return (
    <div>
      <h1>Employee Management System</h1>

      <p>Current User: {currentUser ? currentUser.name : "Nobody logged in"}</p>

      <button onClick={handleTestLogin}>Test Login</button>
    </div>
  );
}

export default App;
