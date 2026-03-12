import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  BookOpen,
  List,
  Truck,
} from "lucide-react";

type StopPoint = {
  _id: string;
  route_id: string;
  stop_order: number;
  is_pickup: boolean;
  stop_id: {
    _id: string;
    name: string;
    province: string;
    is_active: boolean;
    location: { type: string; coordinates: number[] };
  };
};

type LocationPoint = {
  _id: string;
  stop_id: string;
  location_name: string;
  status: boolean;
  location_type: "PICKUP" | "DROPOFF";
  is_active: boolean;
  location: { type: string; coordinates: number[] };
};

type ParcelItem = {
  _id: string;
  code: string;
  status: string;
  approval_status: string;
  total_price: number;
  weight_kg: number;
  created_at: string;
  trip_id: {
    _id: string;
    departure_time: string;
    arrival_time: string;
    status: string;
    route_id: {
      start_id: { province: string; name: string };
      stop_id: { province: string; name: string };
    };
  } | null;
  start_id: { stop_id: { province: string; name: string }; stop_order: number } | null;
  end_id: { stop_id: { province: string; name: string }; stop_order: number } | null;
  pickup_location_id: { location_name: string } | null;
  dropoff_location_id: { location_name: string } | null;
};

enum ParcelStatus {
  RECEIVED = "RECEIVED",
  ON_BUS = "ON_BUS",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export default function DatHangOrder() {
  const location = useLocation();
  const navigate = useNavigate();

  const { tripId, bus_type_id } = (location.state || {}) as {
    tripId?: string;
    bus_type_id?: string;
  };

  const [trip, setTrip] = useState<any>(null);

  const [pickupPoints, setPickupPoints] = useState<StopPoint[]>([]);
  const [dropoffPoints, setDropoffPoints] = useState<StopPoint[]>([]);
  const [selectedPickupId, setSelectedPickupId] = useState<string>("");
  const [selectedPickupStopId, setSelectedPickupStopId] = useState<string>("");
  const [selectedDropoffId, setSelectedDropoffId] = useState<string>("");
  const [selectedDropoffStopId, setSelectedDropoffStopId] = useState<string>("");

  const [pickupLocationPoints, setPickupLocationPoints] = useState<LocationPoint[]>([]);
  const [dropoffLocationPoints, setDropoffLocationPoints] = useState<LocationPoint[]>([]);
  const [selectedPickupLocationId, setSelectedPickupLocationId] = useState<string>("");
  const [selectedDropoffLocationId, setSelectedDropoffLocationId] = useState<string>("");

  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [parcelType, setParcelType] = useState("");
  const [weight, setWeight] = useState("0");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [remainingWeight, setRemainingWeight] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<"order" | "history">("order");

  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPagination, setHistoryPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [parcels, setParcels] = useState<ParcelItem[]>([]);
  const [selectedParcel, setSelectedParcel] = useState<ParcelItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const weightNumber = Number(weight);
  const totalPrice = Number.isFinite(weightNumber) ? Math.max(0, weightNumber) * 20000 : 0;

  const pickupPoint = pickupPoints.find((p) => p._id === selectedPickupId) ?? null;
  const dropoffPoint = dropoffPoints.find((p) => p._id === selectedDropoffId) ?? null;
  const pickupLocation = pickupLocationPoints.find((p) => p._id === selectedPickupLocationId) ?? null;
  const dropoffLocation = dropoffLocationPoints.find((p) => p._id === selectedDropoffLocationId) ?? null;

  const formatCurrency = (n: number) => n.toLocaleString("vi-VN") + "đ";

  const formatTime = (d?: string) => {
    if (!d) return "--:--";
    return new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (d?: string) => {
    if (!d) return "--/--/----";
    return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const shouldAllowCancel = (status: string) => {
    return status === ParcelStatus.RECEIVED;
  };

  const getCancelHintMessage = (status: string) => {
    if (status === ParcelStatus.CANCELLED) return "Đơn đã hủy.";
    if (status === ParcelStatus.RECEIVED) return null;
    return "Đơn đang trên đường giao, không thể hủy.";
  };

  const fetchParcelHistory = async (page = 1) => {
    setHistoryError(null);
    setHistoryLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setHistoryError("Bạn cần đăng nhập để xem lịch sử gửi hàng.");
        return;
      }

      const res = await fetch(`http://localhost:3000/api/customer/check/parcels?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        setHistoryError(json.message || "Không thể tải lịch sử gửi hàng.");
        return;
      }

      setParcels(json.data || []);
      setHistoryPagination(json.pagination || { page, limit: 10, total: 0, totalPages: 1 });
    } catch (err) {
      setHistoryError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchParcelDetail = async (id: string) => {
    setDetailLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await fetch(`http://localhost:3000/api/customer/check/parcels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        setHistoryError(json.message || "Không thể tải chi tiết đơn.");
        return;
      }
      setSelectedParcel(json.data);
    } catch (err) {
      setHistoryError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setDetailLoading(false);
    }
  };

  const cancelParcel = async (parcelId: string) => {
    setCancelingId(parcelId);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await fetch(`http://localhost:3000/api/customer/check/parcels/${parcelId}/cancel`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        setHistoryError(json.message || "Không thể hủy đơn.");
        return;
      }
      await fetchParcelHistory(historyPage);
      if (selectedParcel?._id === parcelId) {
        await fetchParcelDetail(parcelId);
      }
    } catch (err) {
      setHistoryError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setCancelingId(null);
    }
  };

  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    fetch("http://localhost:3000/api/customer/notcheck/diagram-bus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route_id: tripId }),
    })
      .then((r) => r.json())
      .then((res) => {
        setTrip(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [tripId]);

  useEffect(() => {
    if (!trip?.route_id?._id) return;
    fetch("http://localhost:3000/api/customer/notcheck/start-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ route_id: trip.route_id._id }),
    })
      .then((r) => r.json())
      .then((res) => {
        const data: StopPoint[] = res.data ?? [];
        setPickupPoints(data.sort((a, b) => a.stop_order - b.stop_order));
      })
      .catch(console.error);
  }, [trip]);

  useEffect(() => {
    if (!trip?.route_id?._id) return;
    setDropoffPoints([]);
    setSelectedDropoffId("");
    setSelectedDropoffStopId("");
    setDropoffLocationPoints([]);
    setSelectedDropoffLocationId("");

    if (!selectedPickupStopId) return;
    const dto: any = { route_id: trip.route_id._id, start_id: selectedPickupStopId };
    if (bus_type_id) dto.bus_type_id = bus_type_id;
    fetch("http://localhost:3000/api/customer/notcheck/end-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    })
      .then((r) => r.json())
      .then((res) => {
        const data: StopPoint[] = res.data ?? [];
        setDropoffPoints(data.sort((a, b) => a.stop_order - b.stop_order));
      })
      .catch(console.error);
  }, [selectedPickupStopId, trip, bus_type_id]);

  useEffect(() => {
    if (!selectedPickupStopId || !trip?.route_id?._id) {
      setPickupLocationPoints([]);
      setSelectedPickupLocationId("");
      return;
    }
    fetch("http://localhost:3000/api/customer/notcheck/location-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stop_id: selectedPickupStopId, route_id: trip.route_id._id }),
    })
      .then((r) => r.json())
      .then((res) => {
        const data: LocationPoint[] = (res.data ?? []).filter((p: LocationPoint) => p.is_active && p.status);
        setPickupLocationPoints(data);
      })
      .catch(console.error);
  }, [selectedPickupStopId, trip]);

  useEffect(() => {
    if (!selectedDropoffStopId || !trip?.route_id?._id) {
      setDropoffLocationPoints([]);
      setSelectedDropoffLocationId("");
      return;
    }
    fetch("http://localhost:3000/api/customer/notcheck/location-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stop_id: selectedDropoffStopId, route_id: trip.route_id._id }),
    })
      .then((r) => r.json())
      .then((res) => {
        const data: LocationPoint[] = (res.data ?? []).filter((p: LocationPoint) => p.is_active && p.status);
        setDropoffLocationPoints(data);
      })
      .catch(console.error);
  }, [selectedDropoffStopId, trip]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchParcelHistory(historyPage);
    }
  }, [activeTab, historyPage]);

  const canSubmit =
    !!trip &&
    !!pickupPoint &&
    !!dropoffPoint &&
    receiverName.trim() &&
    receiverPhone.trim() &&
    weightNumber > 0;

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);
    setRemainingWeight(null);

    if (!canSubmit) {
      setError("Vui lòng điền đầy đủ thông tin và chọn điểm đón/trả.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("Bạn cần đăng nhập để đặt đơn.");
      return;
    }

    setSubmitting(true);
    try {
      const body: any = {
        trip_id: trip._id,
        receiver_name: receiverName.trim(),
        receiver_phone: receiverPhone.trim(),
        start_id: pickupPoint._id,
        end_id: dropoffPoint._id,
        weight_kg: weightNumber,
        total_price: totalPrice,
        payment_method: "ONLINE",
        parcel_type: parcelType.trim() || null,
      };

      if (pickupLocation) body.pickup_location_id = pickupLocation._id;
      if (dropoffLocation) body.dropoff_location_id = dropoffLocation._id;

      const res = await fetch("http://localhost:3000/api/customer/check/parcels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.message || "Đặt hàng thất bại");
        return;
      }

      const parcel = json.data?.parcel;
      if (parcel?.approval_status === "REJECTED" || parcel?.status === "CANCELLED") {
        setError(json.message || "Đơn không được chấp nhận.");
        setRemainingWeight(json.remaining_weight_kg ?? null);
        return;
      }

      setSuccess(`Đặt hàng thành công. Mã đơn: ${parcel?.code || "(n/a)"}`);
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };


  const renderHero = () => (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.93)_34%,rgba(255,255,255,0.64)_56%,rgba(255,255,255,0.16)_78%,rgba(255,255,255,0)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#f3ece5] to-[#ece7e2]" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#ece7e2]" />
      <div className="pointer-events-none absolute top-[18%] right-[0%] z-10 w-[66%] max-w-[860px] md:top-[9%] md:w-[62%]">
        <div className="bus-aero-overlay absolute inset-[-16%] z-0">
          <span className="bus-cloud bus-cloud-1 absolute left-[-10%] top-[-10%] h-[28%] w-[68%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.25)_54%,rgba(255,255,255,0)_100%)] blur-[30px]" />
          <span className="bus-cloud bus-cloud-2 absolute left-[-20%] top-[28%] h-[26%] w-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.66)_0%,rgba(255,255,255,0.2)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
          <span className="bus-cloud bus-cloud-3 absolute right-[-16%] top-[34%] h-[26%] w-[42%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0.18)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
          <span className="bus-cloud bus-cloud-4 absolute left-[-16%] top-[66%] h-[30%] w-[58%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.68)_0%,rgba(255,255,255,0.24)_54%,rgba(255,255,255,0)_100%)] blur-[28px]" />
          <span className="bus-cloud bus-cloud-5 absolute right-[-4%] top-[70%] h-[28%] w-[54%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.64)_0%,rgba(255,255,255,0.2)_54%,rgba(255,255,255,0)_100%)] blur-[26px]" />
          <span className="bus-cloud bus-cloud-6 absolute left-[4%] top-[90%] h-[16%] w-[72%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.56)_0%,rgba(255,255,255,0.14)_54%,rgba(255,255,255,0)_100%)] blur-[24px]" />
        </div>
        <div className="bus-aero-trail absolute right-[-14%] top-[30%] z-0 h-[54%] w-[46%]">
          <span className="bus-tail-cloud bus-tail-cloud-1 absolute right-[10%] top-[14%] h-[42%] w-[34%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.48)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
          <span className="bus-tail-cloud bus-tail-cloud-2 absolute right-[28%] top-[28%] h-[38%] w-[32%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.84)_0%,rgba(255,255,255,0.4)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
          <span className="bus-tail-cloud bus-tail-cloud-3 absolute right-[12%] top-[50%] h-[34%] w-[30%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0.36)_54%,rgba(255,255,255,0)_100%)] blur-[10px]" />
          <span className="bus-tail-cloud bus-tail-cloud-4 absolute right-[38%] top-[20%] h-[26%] w-[24%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.32)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
          <span className="bus-tail-cloud bus-tail-cloud-5 absolute right-[44%] top-[42%] h-[24%] w-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.74)_0%,rgba(255,255,255,0.3)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
          <span className="bus-tail-cloud bus-tail-cloud-6 absolute right-[24%] top-[44%] h-[26%] w-[24%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.38)_54%,rgba(255,255,255,0)_100%)] blur-[8px]" />
          <span className="bus-tail-cloud bus-tail-cloud-7 absolute right-[18%] top-[64%] h-[22%] w-[22%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0.34)_54%,rgba(255,255,255,0)_100%)] blur-[9px]" />
        </div>
        <div className="bus-bob relative z-10">
          <img
            src="/images/bus7.png"
            alt="Bus overlay"
            className="w-full object-contain block relative"
            style={{ imageRendering: "auto", filter: "drop-shadow(0 24px 28px rgba(15,23,42,0.28)) drop-shadow(0 0 22px rgba(255,255,255,0.5))" }}
          />
          <div className="pointer-events-none absolute inset-0">
            <div className="bus-front-left-passenger">
              <img src="/images/loxe1.png" alt="Front passenger" className="bus-front-left-passenger-img" />
            </div>
            <div className="bus-driver-fit">
              <img src="/images/1me1.png" alt="Driver" className="bus-driver-fit-img" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative z-20 mx-auto flex min-h-[520px] w-full max-w-[1240px] items-center px-4 pb-16 pt-24 lg:min-h-[580px] lg:pt-20">
        <div className="page-enter-copy relative isolate -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
          <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[360px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.46)_34%,rgba(255,255,255,0.18)_56%,rgba(255,255,255,0)_78%)] blur-[26px]" />
          <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[300px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(248,250,252,0.46)_0%,rgba(248,250,252,0.14)_58%,rgba(248,250,252,0)_84%)] blur-[18px]" />
          <h1 className="hero-title relative z-10 py-1 text-[48px] font-black leading-[1.05] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
            <span className="hero-title-line block whitespace-nowrap">Gửi hàng dễ dàng</span>
            <span className="hero-title-line mt-2 block whitespace-nowrap">Giữa các chặng đường</span>
            <span className="hero-title-line mt-2 block whitespace-nowrap font-extrabold italic">
              <span className="text-[#0d142a]">Nhanh</span> <span className="hero-title-shimmer">-</span> <span className="text-[#0d142a]">An toàn</span>
            </span>
          </h1>
          <p className="relative z-10 max-w-[510px] text-base leading-relaxed text-[#475569] lg:text-lg">
            Chọn chuyến, điền thông tin và thanh toán nhanh chóng với giá cố định 20.000đ/kg.
          </p>
        </div>
      </div>
    </>
  );

  const renderOrderForm = () => {
    if (!tripId || !trip) {
      return (
        <div className="rounded-2xl bg-white shadow border border-orange-100 p-10 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Chọn chuyến để bắt đầu gửi hàng</h2>
          <p className="text-sm text-slate-600 mb-6">
            Vui lòng chọn chuyến trên trang lịch trình để đặt đơn gửi hàng. Hoặc bạn có thể xem lại lịch sử đơn hàng bên dưới.
          </p>
          <button
            onClick={() => navigate("/lichtrinh")}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600"
          >
            Xem lịch trình
          </button>
        </div>
      );
    }

    return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500">Chuyến</p>
              <p className="text-lg font-bold text-slate-900">
                {trip?.route_id?.start_id?.province || "..."} → {trip?.route_id?.stop_id?.province || "..."}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {formatDate(trip?.departure_time)} • {formatTime(trip?.departure_time)} → {formatTime(trip?.arrival_time)}
              </p>
            </div>
            <div className="rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 text-center">
              <p className="text-xs font-semibold text-orange-600">Loại xe</p>
              <p className="text-sm font-bold text-orange-700 mt-1">{trip?.bus_id?.bus_type_id?.name ?? "--"}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Chọn điểm đón và điểm trả</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white font-bold">A</div>
                <p className="text-sm font-semibold text-slate-700">Điểm đón</p>
              </div>
              <select
                value={selectedPickupId}
                onChange={(e) => {
                  const chosenId = e.target.value;
                  setSelectedPickupId(chosenId);
                  const found = pickupPoints.find((p) => p._id === chosenId);
                  setSelectedPickupStopId(found?.stop_id?._id ?? "");
                }}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-green-400 focus:ring-2 focus:ring-green-100"
              >
                <option value="">Chọn điểm đón</option>
                {pickupPoints.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.stop_order}. {p.stop_id.province}
                  </option>
                ))}
              </select>

              {selectedPickupId && (
                <>
                  {pickupLocationPoints.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">Vị trí cụ thể</p>
                      <select
                        value={selectedPickupLocationId}
                        onChange={(e) => setSelectedPickupLocationId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-green-400 focus:ring-2 focus:ring-green-100"
                      >
                        <option value="">Chọn vị trí</option>
                        {pickupLocationPoints.map((lp) => (
                          <option key={lp._id} value={lp._id}>
                            {lp.location_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Không có vị trí chi tiết cho điểm đón này.</p>
                  )}
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold">B</div>
                <p className="text-sm font-semibold text-slate-700">Điểm trả</p>
              </div>
              <select
                value={selectedDropoffId}
                onChange={(e) => {
                  const chosenId = e.target.value;
                  setSelectedDropoffId(chosenId);
                  const found = dropoffPoints.find((p) => p._id === chosenId);
                  setSelectedDropoffStopId(found?.stop_id?._id ?? "");
                }}
                disabled={!selectedPickupId}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
              >
                <option value="">{selectedPickupId ? "Chọn điểm trả" : "Chọn điểm đón trước"}</option>
                {dropoffPoints.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.stop_order}. {p.stop_id.province}
                  </option>
                ))}
              </select>

              {selectedDropoffId && (
                <>
                  {dropoffLocationPoints.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-slate-500">Vị trí cụ thể</p>
                      <select
                        value={selectedDropoffLocationId}
                        onChange={(e) => setSelectedDropoffLocationId(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                      >
                        <option value="">Chọn vị trí</option>
                        {dropoffLocationPoints.map((lp) => (
                          <option key={lp._id} value={lp._id}>
                            {lp.location_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">Không có vị trí chi tiết cho điểm trả này.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Thông tin đơn hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Tên người nhận <span className="text-red-500">*</span>
              </label>
              <input
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Tên người nhận"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Số điện thoại người nhận"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Khối lượng (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Kg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Loại hàng</label>
              <input
                value={parcelType}
                onChange={(e) => setParcelType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400"
                placeholder="Ví dụ: dễ vỡ, đồ điện tử"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-slate-500">Tổng giá (tạm tính)</p>
              <p className="text-2xl font-black text-orange-600">{formatCurrency(totalPrice)}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Đang gửi..." : "Đặt hàng ngay"}
            </button>
          </div>

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
          {remainingWeight !== null && (
            <p className="mt-2 text-sm text-orange-700">
              Sức chứa còn lại của chuyến: {remainingWeight} kg. Vui lòng giảm khối lượng hoặc chọn chuyến khác.
            </p>
          )}
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow border border-orange-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Tổng quan</h3>
              <p className="text-xs text-slate-500">Kiểm tra nhanh thông tin và giá</p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="flex justify-between"><span>Chuyến</span><span className="font-semibold">{trip?.route_id?.start_id?.province} → {trip?.route_id?.stop_id?.province}</span></div>
            <div className="flex justify-between"><span>Khối lượng</span><span className="font-semibold">{weightNumber.toLocaleString()} kg</span></div>
            <div className="flex justify-between"><span>Giá tạm tính</span><span className="font-semibold text-orange-600">{formatCurrency(totalPrice)}</span></div>
            <div className="flex justify-between"><span>Thanh toán</span><span className="font-semibold">Online</span></div>
          </div>
        </div>
      </div>
    </div>
  );
  };

  const renderHistory = () => {
    const pageNumbers = () => {
      const total = historyPagination.totalPages;
      if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
      if (historyPage <= 3) return [1, 2, 3, 4, 5];
      if (historyPage >= total - 2) return [total - 4, total - 3, total - 2, total - 1, total];
      return [historyPage - 2, historyPage - 1, historyPage, historyPage + 1, historyPage + 2];
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Lịch sử gửi hàng</h2>
            <p className="text-sm text-slate-500">Xem lại đơn hàng và hủy nếu còn trong trạng thái chờ.</p>
          </div>
          <button
            onClick={() => fetchParcelHistory(historyPage)}
            disabled={historyLoading}
            className="flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={historyLoading ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>

        {historyLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="animate-spin text-orange-500" />
            <p className="text-slate-500 font-medium">Đang tải lịch sử...</p>
          </div>
        ) : historyError ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <AlertCircle size={40} className="text-red-400" />
            <p className="text-slate-600 font-semibold">{historyError}</p>
            <button
              onClick={() => fetchParcelHistory(historyPage)}
              className="mt-2 px-5 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition"
            >
              Thử lại
            </button>
          </div>
        ) : parcels.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Truck size={48} className="text-slate-300" />
            <p className="text-slate-500 font-semibold text-lg">Chưa có đơn gửi hàng</p>
            <p className="text-slate-400 text-sm">Hãy đặt đơn gửi hàng đầu tiên của bạn.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {parcels.map((parcel) => {
              const canCancel = shouldAllowCancel(parcel.status);
              return (
                <div key={parcel._id} className="bg-white rounded-2xl shadow-md border border-orange-100/60 overflow-hidden">
                  <div className={`h-1 ${parcel.status === ParcelStatus.RECEIVED ? "bg-yellow-400" : parcel.status === ParcelStatus.CANCELLED ? "bg-slate-300" : "bg-green-400"}`} />
                  <div className="p-6">
                    <div className="flex flex-wrap gap-3 items-start justify-between">
                      <div className="min-w-[220px]">
                        <div className="text-xs text-slate-500">Mã đơn</div>
                        <div className="text-sm font-semibold text-slate-800">{parcel.code}</div>
                        <div className="text-[11px] text-slate-400 mt-1">{formatDate(parcel.created_at)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${parcel.status === ParcelStatus.RECEIVED ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : parcel.status === ParcelStatus.CANCELLED ? "bg-slate-100 text-slate-500 border border-slate-200" : "bg-green-100 text-green-700 border border-green-200"}`}>
                          {parcel.status === ParcelStatus.RECEIVED ? "Chờ xử lý" : parcel.status === ParcelStatus.CANCELLED ? "Đã hủy" : "Đang giao"}
                        </span>
                        <span className="text-xs text-slate-500">{parcel.approval_status}</span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <div className="space-y-1">
                        <div className="font-semibold">Chuyến</div>
                        <div>{parcel.trip_id ? `${parcel.trip_id.route_id.start_id.province} → ${parcel.trip_id.route_id.stop_id.province}` : "-"}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold">Khối lượng</div>
                        <div>{parcel.weight_kg?.toLocaleString()} kg</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold">Giá</div>
                        <div className="text-orange-600 font-bold">{formatCurrency(parcel.total_price)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold">Điểm đón</div>
                        <div>{parcel.pickup_location_id?.location_name ?? parcel.start_id?.stop_id?.province}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold">Điểm trả</div>
                        <div>{parcel.dropoff_location_id?.location_name ?? parcel.end_id?.stop_id?.province}</div>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <button
                        onClick={() => fetchParcelDetail(parcel._id)}
                        disabled={detailLoading}
                        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition disabled:opacity-60"
                      >
                        {detailLoading ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={16} />
                            Đang tải
                          </span>
                        ) : (
                          <>
                            <BookOpen size={16} /> Xem chi tiết
                          </>
                        )}
                      </button>
                      {canCancel ? (
                        <button
                          onClick={() => cancelParcel(parcel._id)}
                          disabled={cancelingId === parcel._id}
                          className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50"
                        >
                          <X size={16} /> {cancelingId === parcel._id ? "Đang hủy..." : "Hủy đơn"}
                        </button>
                      ) : (
                        <span className="text-sm font-semibold text-slate-500">
                          {getCancelHintMessage(parcel.status)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {historyPagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <button
                  onClick={() => setHistoryPage((p) => Math.max(1, p - 1))}
                  disabled={historyPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  ‹
                </button>
                {pageNumbers().map((p) => (
                  <button
                    key={p}
                    onClick={() => setHistoryPage(p)}
                    className={`w-9 h-9 rounded-full text-sm font-semibold ${p === historyPage ? "bg-orange-500 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setHistoryPage((p) => Math.min(historyPagination.totalPages, p + 1))}
                  disabled={historyPage === historyPagination.totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}

        {selectedParcel && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Chi tiết đơn hàng</h3>
                  <p className="text-xs text-slate-500">Mã: {selectedParcel.code}</p>
                </div>
                <button onClick={() => setSelectedParcel(null)} className="text-slate-500 hover:text-slate-700">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="space-y-2">
                  <div className="font-semibold">Trạng thái</div>
                  <div>{selectedParcel.status}</div>
                  <div className="font-semibold mt-3">Thời gian tạo</div>
                  <div>{formatDate(selectedParcel.created_at)}</div>
                  <div className="font-semibold mt-3">Khối lượng</div>
                  <div>{selectedParcel.weight_kg.toLocaleString()} kg</div>
                  <div className="font-semibold mt-3">Tổng giá</div>
                  <div className="text-orange-600 font-bold">{formatCurrency(selectedParcel.total_price)}</div>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold">Tuyến</div>
                  <div>
                    {selectedParcel.trip_id
                      ? `${selectedParcel.trip_id.route_id.start_id.province} → ${selectedParcel.trip_id.route_id.stop_id.province}`
                      : "-"}
                  </div>
                  <div className="font-semibold mt-3">Điểm đón</div>
                  <div>{selectedParcel.pickup_location_id?.location_name ?? selectedParcel.start_id?.stop_id?.province}</div>
                  <div className="font-semibold mt-3">Điểm trả</div>
                  <div>{selectedParcel.dropoff_location_id?.location_name ?? selectedParcel.end_id?.stop_id?.province}</div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedParcel(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Đóng
                </button>
                {shouldAllowCancel(selectedParcel.status) && (
                  <button
                    onClick={() => cancelParcel(selectedParcel._id)}
                    className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                  >
                    Hủy đơn
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-slate-100">
      {renderHero()}
      {loading && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/70">
          <Loader2 className="animate-spin text-orange-500" size={40} />
        </div>
      )}
      <div className="relative z-20 mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Gửi hàng</h1>
            <p className="text-sm text-slate-600">Chọn chuyến, điền đơn và theo dõi lịch sử gửi hàng của bạn.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("order")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "order"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Truck size={16} className="inline -mt-0.5" /> Đặt hàng
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeTab === "history"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <List size={16} className="inline -mt-0.5" /> Lịch sử
            </button>
          </div>
        </div>

        <div className="mt-8">{activeTab === "order" ? renderOrderForm() : renderHistory()}</div>
      </div>
    </div>
  );
}