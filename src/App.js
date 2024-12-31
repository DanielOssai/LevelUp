import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/Login";
import MainPage from "./components/MainPage";
import LoadingBar from "./components/LoadingBar";
import CreateAccount from "./components/CreateAccount";
import MainQuest from "./pages/MainQuest";
import SideQuest from "./pages/SideQuest";
import ChatPage from "./pages/ChatPage";
import Store from "./pages/Store";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (email, password) => {
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsLoggedIn(true);
        setCurrentUser(user);
      }, 3000);
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  const handleCreateAccount = (username, email, password) => {
    if (users.find((u) => u.email === email)) {
      alert("An account with this email already exists.");
    } else {
      setUsers([
        ...users,
        {
          username,
          email,
          password,
          stats: [
            {
              title: "Level",
              value: 1,
              exp: 0,
              nextLevelExp: 100,
              tokens: 0,
            },
            {
              title: "Custom Bar",
              value: 20,
              max: 100,
            },
          ],
        },
      ]);
      setIsCreatingAccount(false);
      alert("Account created successfully! You can now log in.");
    }
  };

  const updateStats = (newStats) => {
    setCurrentUser((prevUser) => {
      const updatedUser = { ...prevUser, stats: newStats };
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === prevUser.email ? updatedUser : user
        )
      );
      return updatedUser;
    });
  };

  return (
    <Router>
      <div className="App">
        {isLoading ? (
          <LoadingBar />
        ) : isLoggedIn && currentUser ? (
          <>
            <nav className="navbar">
              <Link to="/">Home</Link>
              <Link to="/main-quest">Main Quest</Link>
              <Link to="/side-quest">Side Quest</Link>
              <Link to="/chat">Chat</Link>
              <Link to="/store">Store</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </nav>
            <Routes>
              <Route
                path="/"
                element={
                  <MainPage
                    user={currentUser}
                    stats={currentUser.stats}
                    updateStats={updateStats}
                    onLogout={handleLogout}
                  />
                }
              />
              <Route path="/main-quest" element={<MainQuest />} />
              <Route path="/side-quest" element={<SideQuest />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/store" element={<Store />} />
            </Routes>
          </>
        ) : isCreatingAccount ? (
          <CreateAccount
            onCreateAccount={handleCreateAccount}
            onGoBack={() => setIsCreatingAccount(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onCreateAccount={() => setIsCreatingAccount(true)}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
