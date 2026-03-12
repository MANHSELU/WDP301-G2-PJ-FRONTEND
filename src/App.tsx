import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/Customer/HomePage";
import BustripLogin from "./pages/Customer/LoginPage";
import BustripRegister from "./pages/Customer/RegisterPage";
import BustripChangePassword from "./pages/Customer/Profile/ChangePass";
import BusTripProfile from "./pages/Customer/ProfileUser";
import ForgotPassword from "./pages/Customer/ForgotPassword";
import FaceLoginPage from "./pages/Driver/vefication";
import TransportBooking from "./pages/Driver/Home";
import { ViewTrip } from "./pages/Driver/ViewTrip";
import TripDetailsDemo from "./pages/Driver/TripDetail";
import FaceRegister from "./pages/Driver/RegisterAI";
import Header2 from "./layouts/Header2";
import CreateCoach from "./pages/Admin/CreateCoach";
import CreateStopLocation from "./pages/Admin/CreateStopLocation";
import LichTrinh from "./pages/Customer/LichTrinh";
import BusTripSearch from "./pages/Customer/ChiTietLichTrinh";
import BusSeatSelection from "./pages/Customer/DatVe";
import BusBookingUI from "./pages/Customer/ThongTinDatVe";
import ShippingCart from "./pages/Customer/DatHang";
import CheckoutPage from "./pages/Customer/ChiTietDatHang";
import { InformationUser } from "./pages/Customer/Profile/InformationUser";
import OrderHistory from "./pages/Customer/Profile/OrderHistory";
import AddressForm from "./pages/Customer/Profile/AddressUser";
import TripListPage from "./pages/Phuxe/Home";
import { DanhSachChuyenDi } from "./pages/Phuxe/DanhSachChuyenDi";
import ManageBus from "./pages/Admin/ManageBus";
import ManageRoute from "./pages/Admin/ManageRoute";
import ManageUser from "./pages/Admin/ManageUser";
import CreateRoute from "./pages/Admin/CreateRoute";
import TicketBooking from "./pages/LeTan/DatVeChoKhach";
import TripListPageLeTan from "./pages/LeTan/Home";
import CargoBooking from "./pages/LeTan/GuiHangChoKhach";
import CargoOrderList from "./pages/LeTan/DanhSachHangHoa";
import RevenueDashboard from "./pages/Admin/Revenue";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateTrip from "./pages/Admin/CreateTrips";
import AssistantShiftsPage from "./pages/Phuxe/DanhSachCalai";
import DriverShiftsPage from "./pages/Driver/DanhSachCaLai";
import { ChiTietChuyenDi } from "./pages/Phuxe/ChiTietChuyenDi";
import ManageTrip from "./pages/Admin/ManageTrip";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="admin" element={<HomeAdmin />}>
          {/* <Route path="create-coach" element={<CreateCoach />} /> */}
          <Route index element={<AdminDashboard />} />
          <Route path="create-route" element={<CreateRoute />} />
          <Route path="manage-buses" element={<ManageBus />} />
          <Route path="manage-routes" element={<ManageRoute />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-revenue" element={<RevenueDashboard />} />
          <Route path="create-coach" element={<CreateCoach />} />
          <Route path="create-stop-location" element={<CreateStopLocation />} />
          <Route path="create-trips" element={<CreateTrip />} />
          <Route path="manage-trips" element={<ManageTrip />} />
        </Route>
        <Route
          path="/admin/create-stop-location"
          element={<CreateStopLocation />}
        />
        {/* <Route path="/admin/create-route" element={<CreateRoute />} />
        <Route path="/admin/manage-buses" element={<ManageBus />} />
        <Route path="/admin/manage-routes" element={<ManageRoute />} />
        <Route path="/admin/manage-users" element={<ManageUser />} />
        <Route path="/admin/manage-revenue" element={<RevenueDashboard />} />  */}

        <Route path="/" element={<Header2 />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lichtrinh" element={<LichTrinh />} />
          <Route path="/lichtrinhdetail" element={<BusTripSearch />} />

          <Route path="/datve" element={<BusSeatSelection />} />
          <Route path="/dathang" element={<ShippingCart />} />
          <Route path="/chitietdathang" element={<CheckoutPage />} />

          <Route path="/thongtindatve" element={<BusBookingUI />} />
          <Route path="/login" element={<BustripLogin />} />
          <Route path="/register" element={<BustripRegister />} />

          <Route path="user" element={<BusTripProfile />}>
            <Route path="profile" element={<InformationUser />} />
            <Route path="orderhistory" element={<OrderHistory />} />
            <Route path="address" element={<AddressForm />} />
            <Route path="changpassword" element={<BustripChangePassword />} />
          </Route>
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/loginCamera" element={<FaceLoginPage />} />
          <Route path="/registerCamera" element={<FaceRegister />} />

          <Route path="driverBooking" element={<TransportBooking />}>
            <Route path="viewtrip" element={<ViewTrip />} />
            <Route path="viewSlot" element={<DriverShiftsPage />} />
            <Route path="tripdetail/:id" element={<TripDetailsDemo />} />
          </Route>
          <Route path="assistant" element={<TripListPage />}>
            <Route path="chuyendi" element={<DanhSachChuyenDi />} />
            <Route path="viewSlot" element={<AssistantShiftsPage />} />
            <Route path="chitietchuyendi" element={<ChiTietChuyenDi />} />
          </Route>
          <Route path="letan" element={<TripListPageLeTan />}>
            <Route path="chuyendi" element={<DanhSachChuyenDi />} />
            {/* <Route path="chitietchuyendi" element={<TripDetailPage />} /> */}

            <Route path="CargoOrderList" element={<CargoOrderList />} />
            <Route path="ticketBooking" element={<TicketBooking />} />
            <Route path="cargoBooking" element={<CargoBooking />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
