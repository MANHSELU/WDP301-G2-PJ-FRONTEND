import { Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Header from "./layouts/Header";
import { HomePage } from "./pages/HomePage";
import BustripLogin from "./pages/LoginPage";
import BustripRegister from "./pages/RegisterPage";
import BustripChangePassword from "./pages/ChangePass";
import BusTripProfile from "./pages/ProfileUser";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Header />} >
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<BustripLogin />} />
            <Route path="/register" element={<BustripRegister />} />
            <Route path="/changePass" element={<BustripChangePassword />} />
            <Route path="/profile" element={<BusTripProfile />} />
            <Route path="/forgot" element={<ForgotPassword />} />
          </Route>
        </Routes>
      </AppLayout>
    </>
  )
}