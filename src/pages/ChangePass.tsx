import { useState } from "react";
import { Link } from "react-router-dom";

const BustripChangePassword: React.FC = () => {
  const [phone, setPhone] = useState<string>("");
  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [confirmNewPass, setConfirmNewPass] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // call API change password ở đây
    console.log({
      phone,
      oldPass,
      newPass,
      confirmNewPass,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-10">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Đổi <span className="text-orange-500">Mật Khẩu</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              placeholder="Nhập số điện thoại"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu cũ
            </label>
            <input
              type="password"
              value={oldPass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setOldPass(e.target.value)
              }
              placeholder="Nhập mật khẩu cũ"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPass(e.target.value)
              }
              placeholder="Mật khẩu mới"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmNewPass}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setConfirmNewPass(e.target.value)
              }
              placeholder="Nhập lại mật khẩu mới"
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg shadow-md transition"
          >
            Xác Nhận Đổi Mật Khẩu
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Quay lại{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BustripChangePassword;
