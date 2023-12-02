import React from "react";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Authguard from "./routes/Authguard";
import Featured from "./pages/Featured/Featured";
import Saved from "./pages/saved/Saved";
import Profile from "./pages/profile/Profile";
import Explore from "./pages/explore/Explore";
import Trending from "./pages/trending/Trending";
import DetailPage from "./pages/detailpage/DetailPage";
import { useState } from "react";
import { getUserDetail } from "./services/user";
import WriteNew from "./pages/writenew/WriteNew";
import ViewAll from "./pages/viewall/ViewAll";
import AdminAuthguard from "./routes/AdminAuthguard";
import SuperAdminAuthguard from "./routes/SuperAdminAuthguard";

const App = () => {
  const [user] = useState(getUserDetail());

  return (
    <BrowserRouter>
      <div style={{ minHeight: "calc(100vh - 57px)" }}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/trending" element={<Trending />} />
          <Route
            path="/profile"
            element={<Authguard children={<Profile />} />}
          />
          <Route
            path="/featured"
            element={
              <SuperAdminAuthguard
                children={<Featured />}
                isSuperAdmin={user?.isSuperAdmin}
              />
            }
          />
          <Route path="/saved" element={<Authguard children={<Saved />} />} />
          <Route path="/detail/:id" element={<DetailPage />} />

          <Route
            path="/write"
            element={
              <AdminAuthguard children={<WriteNew />} isAdmin={user?.isAdmin} />
            }
          />
          <Route
            path="/view"
            element={
              <AdminAuthguard children={<ViewAll />} isAdmin={user?.isAdmin} />
            }
          />

          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
};

export default App;
