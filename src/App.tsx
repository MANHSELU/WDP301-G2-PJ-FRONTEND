import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Header from "./layouts/Header";
import { HomePage } from "./pages/HomePage";
import BustripLogin from "./pages/LoginPage";
import BustripRegister from "./pages/RegisterPage";
import AdminPage from "./pages/AdminPage";
import ChangePass from "./pages/ChangePass";
import ProfileHome from "./pages/ProfileUser";

export default function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Header />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<BustripLogin />} />
            <Route path="/register" element={<BustripRegister />} />
            <Route path="/adminPage" element={<AdminPage />} />
            <Route path="/changePass" element={<ChangePass />} />
            <Route path="/profileHome" element={<ProfileHome />} />

          </Route>
        </Routes>
      </AppLayout>  

    </>
  )
}