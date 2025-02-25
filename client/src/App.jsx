import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { loading } from "./states/atoms/User";

// Components
import Loader from "./components/Loader";
import PeerProvider from "./Contexts/peer"; // Import PeerProvider

// Pages
import Start from "./Pages/Start";
import Join from "./Pages/Join";


function App() {
  const isLoading = useRecoilValue(loading);
  return (
    <PeerProvider>
      <Router>
        {/* Render Loader outside Routes */}
        {isLoading &&  <Loader>Loading...</Loader>}
        <Routes>

          <Route path="/" element={<Start />} />
          <Route path="/meeting" element={<Join />} />
        </Routes>
      </Router>
    </PeerProvider>
  );
}

export default App;
