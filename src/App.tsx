import { Route, Routes } from "react-router-dom";
// import AppLayout from "./layouts/AppLayout";
// import Header from "./layouts/Header";
import { HomePage } from "./pages/Customer/HomePage";
import BustripLogin from "./pages/Customer/LoginPage";
import BustripRegister from "./pages/Customer/RegisterPage";
import BustripChangePassword from "./pages/Customer/ChangePass";
import BusTripProfile from "./pages/Customer/ProfileUser";
import ForgotPassword from "./pages/Customer/ForgotPassword";
import FaceLoginPage from "./pages/Driver/vefication";
import TransportBooking from "./pages/Driver/Home";
import { ViewTrip } from "./pages/Driver/ViewTrip";
import TripDetailsDemo from "./pages/Driver/TripDetail";
import FaceRegister from "./pages/Driver/RegisterAI";
// import Home2 from "./pages/Home2";
// import CreateCoach from "./pages/Admin/CreateCoach";
import Header2 from "./layouts/Header2";
import CreateCoach from "./pages/Admin/CreateCoach";
import LichTrinh from "./pages/Customer/LichTrinh";
import BusTripSearch from "./pages/Customer/ChiTietLichTrinh";
import BusSeatSelection from "./pages/Customer/DatVe";
import BusBookingUI from "./pages/Customer/ThongTinDatVe";
import ShippingCart from "./pages/Customer/DatHang";
import CheckoutPage from "./pages/Customer/ChiTietDatHang";
import { InformationUser } from "./pages/Customer/Profile/InformationUser";
import OrderHistory from "./pages/Customer/Profile/OrderHistory";
import AddressForm from "./pages/Customer/Profile/AddressUser";

export default function App() {
  return (
    <>
      {/* <AppLayout> */}
      <Routes>
        <Route path="/admin/create-coach" element={<CreateCoach />} />
        <Route path="/" element={<Header2 />} >
          <Route path="/" element={<HomePage />} />
          <Route path="/lichtrinh" element={<LichTrinh />} />
          <Route path="/lichtrinhdetail" element={<BusTripSearch />} />

          <Route path="/datve" element={<BusSeatSelection />} />
          <Route path="/dathang" element={<ShippingCart />} />
          <Route path="/chitietdathang" element={<CheckoutPage />} />

          <Route path="/thongtindatve" element={<BusBookingUI />} />
          <Route path="/login" element={<BustripLogin />} />
          <Route path="/register" element={<BustripRegister />} />

          <Route path="user" element={<BusTripProfile />} >
            <Route path="profile" element={<InformationUser />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="changpassword" element={<BustripChangePassword />} />
          </Route>
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/loginCamera" element={<FaceLoginPage />} />
          <Route path="/registerCamera" element={<FaceRegister />} />

          <Route path="driverBooking" element={<TransportBooking />} >
            <Route path="viewtrip" element={<ViewTrip />} />
            <Route path="tripdetail/:id" element={<TripDetailsDemo />} />
          </Route>
        </Route>
      </Routes>
      {/* </AppLayout> */}
    </>
  )
}
