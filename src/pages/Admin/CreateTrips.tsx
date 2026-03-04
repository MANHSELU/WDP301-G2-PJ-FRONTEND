import { useState, useEffect, type FormEvent } from "react";
import { ChevronLeft, ChevronDown, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import baseAPIAuth from "../../api/auth";
import type { AllRoutes } from "../../model/getRoutes";
import type { getBuses } from "../../model/getBuses";
import type { searchDrivers } from "../../model/searchDrivers";

type DriverStatus = "PENDING" | "RUNNING" | "DONE";

interface DriverForm {
  id: number;
  driver_id: string;
  shift_start: string;
  shift_end: string;
  status: DriverStatus;
  keyword: string;
  suggestions: searchDrivers[];
}
interface AssistantForm {
  assistant_id: string;
  keyword: string;
  suggestions: searchDrivers[];
}
export default function CreateTrip() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<AllRoutes[]>([]);
  const [buses, setBuses] = useState<getBuses[]>([]);
  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");

  const [departureTime, setDepartureTime] = useState("");
  const [arrivalTime, setArrivalTime] = useState("");
  // đơn vị: giờ (float, ví dụ 3.706)
  const [scheduledDuration, setScheduledDuration] = useState<number | "">("");

  const [drivers, setDrivers] = useState<DriverForm[]>([
    {
      id: 1,
      driver_id: "",
      shift_start: "",
      shift_end: "",
      status: "PENDING",
      keyword: "",
      suggestions: [],
    },
  ]);
  const [assistant, setAssistant] = useState<AssistantForm>({
    assistant_id: "",
    keyword: "",
    suggestions: [],
  });

  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // Use Effect lấy tất cả routes
  useEffect(() => {
    getAllRoutes();
  }, []);

  // Use Effect lấy tất cả buses
  useEffect(() => {
    getAllBuses();
  }, []);
  //format time
        const formatLocalDateTime = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
  // Hàm tính thời gian kết thúc từ giờ khởi hành + duration (giờ)
useEffect(() => {
  if (
    departureTime &&
    typeof scheduledDuration === "number"
  ) {
    const departure = new Date(departureTime);
    const arrival = new Date(
      departure.getTime() + scheduledDuration * 3600000
    );
    setArrivalTime(formatLocalDateTime(arrival));
  }
}, [departureTime, scheduledDuration]);

  // Helper tính shiftEnd từ giờ (dùng chung cho search)
  const calcShiftEnd = (): string | null => {

    if (arrivalTime) return arrivalTime;
    if (scheduledDuration && typeof scheduledDuration === "number" && departureTime) {
      const departure = new Date(departureTime);
      const arrival = new Date(departure.getTime() + scheduledDuration * 3600000);
      return formatLocalDateTime(arrival);    }
    return null;
  };

  // Hàm search Tài xế
  const searchDriver = async (rowId: number, keyword: string) => {
    if (!keyword.trim() || !departureTime) return;
    const shiftEnd = calcShiftEnd();
    if (!shiftEnd) return;
    try {
      const res = await baseAPIAuth.get("/api/admin/check/searchDrivers", {
        params: {
          keyword,
          shift_start: new Date(departureTime).toISOString(),
          shift_end: new Date(shiftEnd).toISOString(),
        },
      });
      setDrivers((prev) =>
        prev.map((d) => (d.id === rowId ? { ...d, suggestions: res.data } : d)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm search Phụ xe
  const searchAssistant = async (keyword: string) => {
    if (!keyword.trim() || !departureTime) return;
    const shiftEnd = calcShiftEnd();
    if (!shiftEnd) return;
    try {
      const res = await baseAPIAuth.get("/api/admin/check/searchAssistant", {
        params: {
          keyword,
          departure_time: new Date(departureTime).toISOString(),
          arrival_time: new Date(shiftEnd).toISOString(),
        },
      });
      setAssistant((prev) => ({ ...prev, suggestions: res.data }));
    } catch (error) {
      console.error(error);
    }
  };

  // Hàm lấy tất cả các routes
  const getAllRoutes = async () => {
    try {
      const res = await baseAPIAuth.get("/api/admin/check/getRoutes");
      setRoutes(res.data);
      alert("Lấy danh sách tuyến thành công!");
    } catch (error) {
      console.error(error);
      alert("Lấy danh sách tuyến thất bại!");
    }
  };

  // Hàm lấy tất cả các buses
  const getAllBuses = async () => {
    try {
      const res = await baseAPIAuth.get("/api/admin/check/getBuses");
      setBuses(res.data);
      alert("Lấy danh sách xe thành công!");
    } catch (error) {
      console.error(error);
      alert("Lấy danh sách xe thất bại!");
    }
  };

  // Handle route selection and auto-fill duration (giờ)
  const handleRouteChange = (selectedRouteId: string) => {
    setRouteId(selectedRouteId);
    if (selectedRouteId) {
      const selectedRoute = routes.find((route) => route._id === selectedRouteId);
      if (selectedRoute && selectedRoute.estimated_duration) {
        // estimated_duration từ backend là giờ (float)
        setScheduledDuration(selectedRoute.estimated_duration);
      }
    } else {
      setScheduledDuration("");
    }
  };

  const handleDepartureTimeChange = (newDepartureTime: string) => {
    setDepartureTime(newDepartureTime);
  };

  const handleAddDriver = () => {
    setDrivers((prev) => [
      ...prev,
      {
        id: Date.now(),
        driver_id: "",
        shift_start: "",
        shift_end: "",
        status: "PENDING",
        keyword: "",
        suggestions: [],
      },
    ]);
  };

  const handleRemoveDriver = (id: number) => {
    setDrivers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateDriver = <K extends keyof DriverForm>(
    id: number,
    key: K,
    value: DriverForm[K],
  ) => {
    setDrivers((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!routeId || !busId || !departureTime || !arrivalTime) {
      setFormError(
        "Vui lòng nhập đầy đủ route, bus và thời gian khởi hành/kết thúc.",
      );
      return;
    }

    const validDrivers = drivers.filter(
      (d) => d.driver_id.trim() && d.shift_start && d.shift_end,
    );

    if (validDrivers.length === 0) {
      setFormError("Vui lòng nhập ít nhất một tài xế hợp lệ.");
      return;
    }

    const payload = {
      route_id: routeId,
      bus_id: busId,
      assistant_id: assistant.assistant_id || undefined,
      departure_time: new Date(departureTime),
      arrival_time: new Date(arrivalTime),
      // lưu đúng đơn vị giờ (float) như backend trả về
      scheduled_duration:
        typeof scheduledDuration === "number" ? scheduledDuration : undefined,
      status: "SCHEDULED",
      drivers: validDrivers.map((d) => ({
        driver_id: d.driver_id.trim(),
        shift_start: new Date(d.shift_start),
        shift_end: new Date(d.shift_end),
        status: d.status,
      })),
    };

    try {
      await baseAPIAuth.post("/api/admin/check/trips", payload);
      setFormSuccess("Tạo chuyến đi thành công.");
      setFormError("");

      setRouteId("");
      setBusId("");
      setDepartureTime("");
      setArrivalTime("");
      setScheduledDuration("");
      setAssistant({ assistant_id: "", keyword: "", suggestions: [] });
      setDrivers([
        {
          id: 1,
          driver_id: "",
          shift_start: "",
          shift_end: "",
          status: "PENDING",
          keyword: "",
          suggestions: [],
        },
      ]);
      alert(" Tạo chuyến thành công!");
    } catch (err: any) {
      console.error(err);
      setFormError(
        err?.response?.data?.message ??
          err?.message ??
          "Tạo chuyến đi thất bại.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-[#1f2937]">
      <section className="w-full">
        <div className="mx-auto w-full max-w-[1200px] space-y-6 px-4 pb-16 pt-10 lg:px-4">
          {/* HEADER */}
          <div className="mb-6 flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-[#e1e5ec] bg-white text-[#c2c8d2]"
            >
              <ChevronLeft size={25} strokeWidth={2.3} />
            </button>
            <div>
              <h1 className="text-[24px] font-black leading-[1.05] tracking-[-0.015em] text-[#111827]">
                Tạo chuyến đi mới
              </h1>
              <p className="mt-1 text-[13px] font-medium text-[#9aa2af]">
                Định nghĩa chuyến đi theo tuyến, xe, tài xế và thời gian dự
                kiến.
              </p>
            </div>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5 rounded-[20px] border border-[#e7eaf0] bg-white p-5 shadow-[0_16px_36px_-26px_rgba(15,23,42,0.34)]"
          >
            {/* Thông tin tuyến */}
            <section className="space-y-4">
              <h2 className="text-lg font-black text-[#1f2430]">Chọn tuyến</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Tuyến xe
                  </span>
                  <select
                    value={routeId}
                    onChange={(e) => handleRouteChange(e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                    required
                  >
                    <option value="">-- Chọn tuyến --</option>
                    {routes.map((route) => (
                      <option key={route._id} value={route._id}>
                        {route.start_id.name} - {route.stop_id.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Thời gian dự kiến (giờ)
                  </span>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.1}
                      step="any"
                      value={scheduledDuration === "" ? "" : scheduledDuration}
                      onChange={(e) =>
                        setScheduledDuration(
                          e.target.value
                            ? Math.max(0.1, Number(e.target.value))
                            : "",
                        )
                      }
                      placeholder="Tự động từ tuyến"
                      className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                      required
                    />
                    {scheduledDuration && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-600">
                        ✓ Từ tuyến
                      </span>
                    )}
                  </div>
                </label>
              </div>
            </section>

            {/* Thời gian */}
            <section className="space-y-4 border-t border-[#e5e7eb] pt-4">
              <h2 className="text-lg font-black text-[#1f2430]">
                Thời gian chuyến đi
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Thời gian khởi hành
                  </span>
                  <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => handleDepartureTimeChange(e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                    required
                  />
                </label>

                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Thời gian kết thúc
                    <span className="ml-1 text-[10px] font-normal lowercase text-[#9ca3af]">
                      (tự động)
                    </span>
                  </span>
                  <input
                    type="datetime-local"
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#e8f4f8] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                    required
                  />
                </label>
              </div>
            </section>

            {/* Thông tin chung */}
            <section className="space-y-4 border-t border-[#e5e7eb] pt-4">
              <h2 className="text-lg font-black text-[#1f2430]">
                Thông tin xe và phụ xe
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {/* DROPDOWN XE */}
                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Chọn Xe
                  </span>
                  <select
                    value={busId}
                    onChange={(e) => setBusId(e.target.value)}
                    className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                    required
                  >
                    <option value="">-- Chọn xe --</option>
                    {buses.map((bus) => (
                      <option key={bus._id} value={bus._id}>
                        {bus.bus_type_id.name} - [{bus.license_plate}]
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1">
                  <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                    Phụ xe (tùy chọn)
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={assistant.keyword}
                      onChange={(e) => {
                        setAssistant((prev) => ({
                          ...prev,
                          keyword: e.target.value,
                        }));
                        searchAssistant(e.target.value);
                      }}
                      placeholder="Tìm phụ xe..."
                      className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                    />
                    {assistant.suggestions.length > 0 && (
                      <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow">
                        {assistant.suggestions.map((a) => (
                          <li
                            key={a._id}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                            onClick={() => {
                              setAssistant({
                                assistant_id: a._id,
                                keyword: a.name,
                                suggestions: [],
                              });
                            }}
                          >
                            {a.name} - {a.phone}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </label>
              </div>
            </section>

            {/* Tài xế */}
            <section className="space-y-4 border-t border-[#e5e7eb] pt-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-black text-[#1f2430]">
                  Danh sách tài xế
                </h2>
                <button
                  type="button"
                  onClick={handleAddDriver}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white shadow-[0_14px_28px_-16px_rgba(216,113,28,0.95)] transition duration-200 hover:from-[#f8af4f] hover:to-[#ef8a31] hover:shadow-[0_16px_30px_-16px_rgba(216,113,28,1)]"
                >
                  <Plus size={14} />
                  Thêm tài xế
                </button>
              </div>

              <div className="space-y-3">
                {drivers.map((d) => (
                  <article
                    key={d.id}
                    className="space-y-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-[13px] font-semibold text-[#374151]">
                        Tài xế #{d.id}
                      </h3>
                      {drivers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDriver(d.id)}
                          className="inline-flex items-center gap-1 rounded-[6px] border border-[#e5e7eb] bg-white px-2 py-1 text-[11px] font-semibold text-[#b91c1c] hover:bg-red-50"
                        >
                          <Trash2 size={12} />
                          Xoá
                        </button>
                      )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                          Tài xế
                        </span>
                        <div className="relative">
                          <input
                            type="text"
                            value={d.keyword}
                            onChange={(e) => {
                              handleUpdateDriver(d.id, "keyword", e.target.value);
                              searchDriver(d.id, e.target.value);
                            }}
                            placeholder="Tìm tài xế..."
                            className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151]"
                          />

                          {d.suggestions.length > 0 && (
                            <ul className="absolute z-50 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow">
                              {d.suggestions.map((driver) => (
                                <li
                                  key={driver._id}
                                  className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                                  onClick={() => {
                                    handleUpdateDriver(d.id, "driver_id", driver._id);
                                    handleUpdateDriver(d.id, "keyword", driver.name);
                                    handleUpdateDriver(d.id, "suggestions", []);
                                  }}
                                >
                                  {driver.name} - {driver.phone}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </label>

                      <label className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                          Trạng thái tài xế
                        </span>
                        <div className="relative">
                          <select
                            value={d.status}
                            onChange={(e) =>
                              handleUpdateDriver(
                                d.id,
                                "status",
                                e.target.value as DriverStatus,
                              )
                            }
                            className="h-11 w-full appearance-none rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 pr-9 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="RUNNING">RUNNING</option>
                            <option value="DONE">DONE</option>
                          </select>
                          <ChevronDown
                            size={16}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280]"
                          />
                        </div>
                      </label>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                          Bắt đầu ca (shift_start)
                        </span>
                        <input
                          type="datetime-local"
                          value={d.shift_start}
                          onChange={(e) =>
                            handleUpdateDriver(d.id, "shift_start", e.target.value)
                          }
                          className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                          required
                        />
                      </label>

                      <label className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#6b7280]">
                          Kết thúc ca (shift_end)
                        </span>
                        <input
                          type="datetime-local"
                          value={d.shift_end}
                          onChange={(e) =>
                            handleUpdateDriver(d.id, "shift_end", e.target.value)
                          }
                          className="h-11 w-full rounded-[8px] border border-[#d1d5db] bg-[#f8fafc] px-3 text-sm font-semibold text-[#374151] outline-none transition focus:border-[#9ca3af]"
                          required
                        />
                      </label>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            {/* Messages + submit */}
            {formError ? (
              <p className="rounded-[8px] border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
                {formError}
              </p>
            ) : null}

            {formSuccess ? (
              <p className="rounded-[8px] border border-green-300 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                {formSuccess}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-5 py-3 text-sm font-black uppercase text-white shadow-[0_14px_28px_-16px_rgba(216,113,28,0.95)] transition duration-200 hover:from-[#f8af4f] hover:to-[#ef8a31] hover:shadow-[0_16px_30px_-16px_rgba(216,113,28,1)]"
            >
              Tạo chuyến đi
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}