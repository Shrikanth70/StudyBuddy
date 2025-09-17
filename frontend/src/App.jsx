import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StudyGroupsPage from "./components/StudyGroupsPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ChatInterface from "./components/ChatInterface";
import ResourcesPage from "./components/ResourcesPage";
import ProfilePage from "./components/ProfilePage";
import Footer from "./components/Footer";
import Layout from "./components/Layout";

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Layout>
            <Routes>
              <Route path="/" element={<Hero />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/study-groups" element={<StudyGroupsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </Layout>
          <Footer />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
