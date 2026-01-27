import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  Bus,
  User,
  Ticket,
  Wallet,
  Gift,
  Settings,
  Save,
  Camera,
  Loader2,
} from "lucide-react";

/* ================= CONFIG ================= */

const API_BASE_URL = "http://localhost:3000";

/* ================= TYPES ================= */

type UserProfile = {
  name: string;
  phone: string;
  avatar: string | null;
  role: string;
  joinDate: string;
};

/* ================= COMPONENT ================= */

export default function BusTripProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedFileRef = useRef<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    phone: "",
    avatar: null,
    role: "",
    joinDate: "",
  });

  const token = localStorage.getItem("token");

  /* ================= HELPERS ================= */

  const formatDate = (date?: string) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  /* ================= FETCH PROFILE ================= */

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/customer/check/getProfile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const raw = res.data;
        const u = raw?.data || raw?.user || raw;

        if (!u || !u.name) throw new Error("Profile data not found");

        setProfile({
          name: u.name ?? "",
          phone: u.phone ?? "",
          avatar: u.avatar ?? null,
          role: u.role?.name ?? "",
          joinDate: u.createdAt ?? "",
        });
      } catch (err) {
        console.error("FETCH PROFILE ERROR >>>", err);
        alert("Không lấy được thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /* ================= AVATAR HANDLERS ================= */

  const handleChangeAvatar = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    selectedFileRef.current = file;

    // 👉 Preview ảnh ngay lập tức
    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({
      ...prev,
      avatar: previewUrl,
    }));
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);

      const formData = new FormData();
      formData.append("name", profile.name);

      if (selectedFileRef.current) {
        formData.append("avatar", selectedFileRef.current);
      }

      await axios.put(
        `${API_BASE_URL}/api/customer/check/updateProfile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Cập nhật thông tin thành công");
    } catch (err) {
      console.error("UPDATE PROFILE ERROR >>>", err);
      alert("Cập nhật thất bại");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;

  /* ================= UI ================= */

  return (
    <div className="font-['Plus_Jakarta_Sans',sans-serif] bg-slate-50 min-h-screen">
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <Bus size={20} />
            </div>
            <span className="text-2xl font-extrabold text-orange-500">
              BUSTRIP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <img
              src={profile.avatar || "https://i.pravatar.cc/100"}
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="font-bold">{profile.name}</span>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="pt-28 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* -------- Sidebar -------- */}
        <aside className="bg-white rounded-3xl border sticky top-28 h-fit">
          <h2 className="p-6 font-extrabold">Tài khoản của tôi</h2>
          <nav className="divide-y">
            {[
              { label: "Thông tin cá nhân", icon: User },
              { label: "Lịch sử đặt vé", icon: Ticket },
              { label: "Ví của tôi", icon: Wallet },
              { label: "Ưu đãi", icon: Gift },
              { label: "Cài đặt", icon: Settings },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex items-center gap-3 px-6 py-4 ${
                    index === 0
                      ? "bg-orange-50 text-orange-500 font-bold border-r-4 border-orange-500"
                      : "text-slate-600"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </div>
              );
            })}
          </nav>
        </aside>

        {/* -------- Profile -------- */}
        <section className="bg-white rounded-3xl border p-10">
          <h1 className="text-2xl font-extrabold mb-8">
            Thông tin cá nhân
          </h1>

          {/* Avatar */}
          <div className="flex items-center gap-6 pb-10 border-b mb-10">
            <div className="relative">
              <div className="w-32 h-32 rounded-full ring-4 ring-orange-100 overflow-hidden">
                <img
                  src={profile.avatar || "https://i.pravatar.cc/300"}
                  className="w-full h-full object-cover"
                />
              </div>

              <button
                onClick={handleChangeAvatar}
                className="absolute bottom-1 right-1 bg-orange-500 text-white p-2 rounded-full shadow-lg border-2 border-white"
              >
                <Camera size={16} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold">{profile.name}</h3>
              <p className="text-sm text-slate-500">
                Ngày tham gia: {formatDate(profile.joinDate)}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Họ và tên"
              value={profile.name}
              onChange={(v) => setProfile({ ...profile, name: v })}
            />
            <Input label="Số điện thoại" value={profile.phone} disabled />
            <Input label="Vai trò" value={profile.role} disabled />
            <Input
              label="Ngày tham gia"
              value={formatDate(profile.joinDate)}
              disabled
            />
          </div>

          {/* Save */}
          <div className="flex justify-end mt-10">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-white shadow
                ${
                  isSaving
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }
              `}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ================= INPUT ================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  type?: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold text-slate-500 uppercase">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="mt-2 w-full rounded-2xl bg-slate-50 border px-5 py-3
                   disabled:bg-slate-100 disabled:text-slate-400"
      />
    </div>
  );
}
