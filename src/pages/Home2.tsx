import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import Footer from "../layouts/Footer";

type RouteCard = {
  id: number;
  tag: string;
  title: string;
  image: string;
  rows: { city: string; fare: string }[];
};

const routeCards: RouteCard[] = [
  {
    id: 1,
    tag: "SL4at",
    title: "Xuat phat tu Da Lat",
    image: "/images/Image1.png",
    rows: [
      { city: "TP. HCM", fare: "280.000 vnd" },
      { city: "Da Nang", fare: "420.000 vnd" },
      { city: "Can Tho", fare: "450.000 vnd" },
    ],
  },
  {
    id: 2,
    tag: "TE. NCM",
    title: "Xuat phat tu TP. HCM",
    image: "/images/Image2.png",
    rows: [
      { city: "Da Lat", fare: "250.000 vnd" },
      { city: "Can Tho", fare: "162.000 vnd" },
      { city: "Long Xuyen", fare: "200.000 vnd" },
    ],
  },
  {
    id: 3,
    tag: "Ss Hkig",
    title: "Xuat phat tu Da Nang",
    image: "/images/image 12.png",
    rows: [
      { city: "Da Lat", fare: "430.000 vnd" },
      { city: "Buon Ma Thuot", fare: "510.000 vnd" },
      { city: "Nha Trang", fare: "390.000 vnd" },
    ],
  },
  {
    id: 4,
    tag: "NS N6",
    title: "Xuat phat tu Ha Noi",
    image: "/images/Image3.png",
    rows: [
      { city: "TP. HCM", fare: "280.000 vnd" },
      { city: "Da Nang", fare: "420.000 vnd" },
      { city: "Can Tho", fare: "450.000 vnd" },
    ],
  },
];

export default function Home2() {
  return (
    <div className="bg-[#ece7e2] text-[#2e1f16]">
      <header className="border-b border-[#eee4dc] bg-white">
        <div className="mx-auto flex h-[74px] w-full max-w-[1240px] items-center justify-between px-4">
          <div className="relative -ml-[39px] flex h-14 w-[260px] items-center sm:-ml-[63px] lg:-ml-[111px]">
            <img
              src="/images/logo1.png"
              alt="CoachTrip logo"
              className="h-14 w-auto object-contain"
            />
            <span className="absolute left-[58px] top-1/2 -translate-y-1/2 text-[24px] font-black uppercase leading-none tracking-[-0.01em] text-[#f28320]">
              COACHTRIP
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {["Trang chủ", "Lịch trình", "Tra cứu vé", "Hóa đơn", "Thêm"].map(
              (item, idx) => (
                <button
                  key={item}
                  type="button"
                  className={`relative py-7 text-[13px] font-semibold ${
                    idx === 0
                      ? "text-[#2f2118] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-[#e8a255]"
                      : "text-[#7c5f4a]"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </nav>

          <div className="hidden items-center gap-4 md:flex md:translate-x-3 lg:translate-x-14">
            <button
              type="button"
              className="rounded-xl border border-[#e6bc93] bg-[#fff4e8] px-4 py-2 text-sm font-semibold text-[#5f3e28] shadow-[0_8px_18px_-14px_rgba(165,96,35,0.7)] transition duration-200 hover:border-[#df9a5e] hover:bg-[#ffeddc] hover:text-[#b05e1b]"
            >
              Đăng kí
            </button>
            <button
              type="button"
              className="rounded-xl bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-5 py-2 text-sm font-bold text-white shadow-[0_14px_28px_-16px_rgba(216,113,28,0.95)] transition duration-200 hover:from-[#f8af4f] hover:to-[#ef8a31] hover:shadow-[0_16px_30px_-16px_rgba(216,113,28,1)]"
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <img
          src="/images/bg4.png"
          alt="Hero background"
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ imageRendering: "auto" }}
        />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-white/70 to-[#ece7e2]" />
        <div className="absolute inset-0 bg-[linear-gradient(96deg,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.93)_34%,rgba(255,255,255,0.64)_56%,rgba(255,255,255,0.16)_78%,rgba(255,255,255,0)_100%)]" />
        <div className="pointer-events-none absolute bottom-[5%] right-[2%] z-10 w-[66%] max-w-[860px] md:bottom-[2%] md:w-[62%]">
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
              className="w-full object-contain"
              style={{
                imageRendering: "auto",
                filter:
                  "drop-shadow(0 24px 28px rgba(15,23,42,0.28)) drop-shadow(0 0 22px rgba(255,255,255,0.5))",
              }}
            />

            <div className="pointer-events-none absolute inset-0">
              <div className="bus-front-left-passenger">
                <img
                  src="/images/loxe1.png"
                  alt="Front passenger"
                  className="bus-front-left-passenger-img"
                />
              </div>
              <div className="bus-driver-fit">
                <img
                  src="/images/1me1.png"
                  alt="Driver"
                  className="bus-driver-fit-img"
                />
              </div>
            </div>
          </div>
        </div>
 
 
        <div className="absolute bottom-[18.5%] right-[9%] z-20 flex gap-2">
          <span className="h-2 w-2 rounded-full bg-[#f39c45]" />
          <span className="h-2 w-2 rounded-full bg-[#f39c45]" />
          <span className="h-2 w-2 rounded-full bg-[#d5d3d2]" />
        </div>

        <div className="relative z-20 mx-auto flex min-h-[570px] w-full max-w-[1240px] items-center px-4 pb-24 pt-10 lg:min-h-[660px] lg:pt-6">
          <div className="relative isolate -ml-8 max-w-[760px] space-y-6 sm:-ml-14 lg:-ml-24">
            <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[360px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.72)_0%,rgba(255,255,255,0.46)_34%,rgba(255,255,255,0.18)_56%,rgba(255,255,255,0)_78%)] blur-[26px]" />
            <div className="pointer-events-none absolute left-[46%] top-[46%] z-0 h-[300px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(248,250,252,0.46)_0%,rgba(248,250,252,0.14)_58%,rgba(248,250,252,0)_84%)] blur-[18px]" />
            <h1 className="relative z-10 py-1 text-[48px] font-black leading-[0.95] tracking-[-0.03em] text-[#0d142a] sm:text-[58px] lg:text-[72px]">
              <span className="block whitespace-nowrap">Tìm và đặt ngay</span>
              <span className="mt-2 block whitespace-nowrap">những chuyến xe</span>
              <span className="mt-2 block whitespace-nowrap font-extrabold italic">
                <span className="text-[#0d142a]">thật</span>{" "}
                <span className="text-[#ff7a1b]">Dễ Dàng</span>
              </span>
            </h1>
            <p className="relative z-10 max-w-[510px] text-base leading-relaxed text-[#475569] lg:text-lg">
              Đặt vé mọi lúc mọi nơi, đi vững ngàn hành trình đa dạng và dịch vụ
              chắt lượng cao nhất.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-30 -mt-14">
        <div className="mx-auto w-full max-w-[1460px] px-3">
          <div className="w-full rounded-[10px] border border-[#f2e5d8] bg-white/95 p-2.5 shadow-[0_24px_35px_-24px_rgba(251,146,60,0.9)] backdrop-blur">
            <div className="grid items-stretch gap-0 md:grid-cols-[1.35fr_1.35fr_1.05fr_0.85fr_max-content]">
              <FieldInput
                icon={<MapPin size={14} />}
                label="Điểm đi"
                name="origin"
                placeholder="Nhập điểm đi"
                divider
              />
              <FieldInput
                icon={<MapPin size={14} />}
                label="Điểm đến"
                name="destination"
                placeholder="Nhập điểm đến"
                divider
              />
              <FieldInput
                icon={<CalendarDays size={14} />}
                label="Ngày đặt vé"
                name="departureDate"
                type="date"
                divider
              />
              <FieldInput
                icon={<Users size={14} />}
                label="Số lượng vé"
                name="tickets"
                type="number"
                defaultValue={1}
                min={1}
                max={6}
              />
              <button
                type="button"
                className="m-1.5 justify-self-start min-h-[52px] rounded-[8px] bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-8 text-sm font-bold text-white shadow-[0_18px_30px_-14px_rgba(216,113,28,0.95)] transition duration-200 hover:from-[#f8af4f] hover:to-[#ef8a31]"
              >
                Tim kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-transparent pb-20 pt-12">
        <div className="mx-auto max-w-[1240px] px-4">
          <div className="mb-12 text-center">
            <p className="mb-5 inline-flex rounded-full bg-[#ffe8cf] px-4 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#e58e2b]">
              Tuyến xe nổi bật
            </p>
            <h2 className="text-5xl font-black tracking-[-0.03em] text-[#2f2118]">
              Các tuyến xe phổ biến hiện nay
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {routeCards.map((route) => (
              <article
                key={route.id}
                className="overflow-hidden rounded-[10px] border border-[#f3dcc6] bg-white shadow-[0_28px_45px_-40px_rgba(181,98,27,0.9)]"
              >
                <div className="relative h-[180px]">
                  <img
                    src={route.image}
                    alt={route.title}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#fff8ef]/95 px-3 py-1 text-[11px] font-bold uppercase text-[#6b4c37]">
                    {route.tag}
                  </span>
                </div>

                <div className="space-y-4 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#b28d70]">
                    {route.title}
                  </p>

                  <div className="space-y-2">
                    {route.rows.map((row) => (
                      <div
                        key={`${route.id}-${row.city}`}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-[#6b4b39]">{row.city}</span>
                        <span className="font-black text-[#2f2118]">
                          {row.fare}
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-[7px] bg-gradient-to-r from-[#f39a32] to-[#e77416] px-4 py-3 text-sm font-bold text-white shadow-[0_18px_30px_-16px_rgba(216,113,28,0.88)] transition duration-200 hover:from-[#f7a73f] hover:to-[#ee8528]"
                  >
                    Đặt vé ngay
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-[#e4bb94] bg-[#fff4e7] px-7 py-3 text-sm font-bold text-[#6a4932] shadow-[0_10px_22px_-16px_rgba(180,95,21,0.78)] transition duration-200 hover:border-[#d99861] hover:bg-[#ffe9d4] hover:text-[#a45b1f]"
            >
              Xem tất cả các chuyến
                            <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        .bus-bob {
          animation: bus-bob 1.9s cubic-bezier(0.36, 0.06, 0.29, 0.97) infinite;
          transform-origin: 56% 74%;
          will-change: transform;
        }

        .bus-aero-overlay {
          transform: rotate(12deg);
          transform-origin: 22% 50%;
        }

        .bus-cloud {
          animation: bus-cloud-drift 1.75s ease-out infinite;
          will-change: transform, opacity;
        }

        .bus-cloud-1 {
          animation-delay: 0.06s;
          animation-duration: 1.95s;
        }

        .bus-cloud-2 {
          animation-delay: 0.26s;
          animation-duration: 1.55s;
        }

        .bus-cloud-3 {
          animation-delay: 0.42s;
          animation-duration: 1.58s;
        }

        .bus-cloud-4 {
          animation-delay: 0.62s;
          animation-duration: 1.84s;
        }

        .bus-cloud-5 {
          animation-delay: 0.78s;
          animation-duration: 1.72s;
        }

        .bus-cloud-6 {
          animation-delay: 0.94s;
          animation-duration: 1.6s;
        }

        .bus-aero-trail {
          transform: rotate(12deg);
          transform-origin: 22% 50%;
          will-change: transform;
        }

        .bus-tail-cloud {
          animation: bus-trail-cloud 1.55s ease-out infinite;
          will-change: transform, opacity;
        }

        .bus-tail-cloud-1 {
          animation-delay: 0.06s;
        }

        .bus-tail-cloud-2 {
          animation-delay: 0.32s;
        }

        .bus-tail-cloud-3 {
          animation-delay: 0.54s;
        }

        .bus-tail-cloud-4 {
          animation-delay: 0.76s;
        }

        .bus-tail-cloud-5 {
          animation-delay: 0.9s;
          animation-duration: 1.7s;
        }

        .bus-tail-cloud-6 {
          animation-delay: 0.22s;
          animation-duration: 1.45s;
        }

        .bus-tail-cloud-7 {
          animation-delay: 0.48s;
          animation-duration: 1.55s;
        }

        .bus-driver-fit {
          position: absolute;
          left: 26.3%;
          top: 30.7%;
          width: 11.6%;
          height: 15.8%;
          overflow: hidden;
          clip-path: polygon(8% 1%, 96% 5%, 100% 95%, 22% 98%, 2% 56%);
          transform: perspective(760px) rotateY(-12deg) rotate(-0.55deg);
          transform-origin: 54% 50%;
          box-shadow: inset 0 -14px 16px rgba(2, 6, 23, 0.28);
          animation: bus-driver-settle 1.9s cubic-bezier(0.36, 0.06, 0.29, 0.97)
            infinite;
          will-change: transform;
        }

        .bus-front-left-passenger {
          position: absolute;
          left: 48.4%;
          top: 26.2%;
          width: 11.6%;
          height: 15.6%;
          overflow: hidden;
          clip-path: polygon(18% 2%, 94% 6%, 98% 95%, 10% 97%, 4% 52%);
          transform: perspective(760px) rotateY(14deg) rotate(0.7deg);
          transform-origin: 50% 50%;
          box-shadow: inset 0 -14px 16px rgba(2, 6, 23, 0.34);
          animation: bus-driver-settle 2s cubic-bezier(0.36, 0.06, 0.29, 0.97)
            infinite;
          will-change: transform;
          z-index: 1;
        }

        .bus-front-left-passenger-img {
          position: absolute;
          left: 2%;
          top: 3%;
          width: 130%;
          height: 166%;
          object-fit: cover;
          object-position: center 10%;
          filter: saturate(0.8) contrast(1.05) brightness(0.88);
          opacity: 0.93;
          transform: scaleX(-1) rotate(-2deg);
          transform-origin: 50% 50%;
          animation: bus-passenger-idle 1.8s ease-in-out infinite;
          will-change: transform;
        }

        .bus-driver-fit::before {
          content: "";
          display: none;
          z-index: 2;
        }

        .bus-driver-fit::after {
          content: "";
          display: none;
          z-index: 2;
        }

        .bus-driver-fit-img {
          position: absolute;
          left: -2%;
          top: 3%;
          width: 95%;
          height: 112%;
          object-fit: cover;
          object-position: center 8%;
          filter: saturate(0.82) contrast(1.08) brightness(0.9);
          mix-blend-mode: normal;
          opacity: 0.95;
          transform: scaleX(-1) rotate(5deg);
          transform-origin: 50% 50%;
          animation: bus-driver-idle 1.65s ease-in-out infinite;
          will-change: transform;
          z-index: 1;
        }

        @keyframes bus-bob {
          0%,
          100% {
            transform: translateY(0) rotate(-0.35deg);
          }
          32% {
            transform: translateY(-4px) rotate(0.12deg);
          }
          62% {
            transform: translateY(-8px) rotate(0.24deg);
          }
          82% {
            transform: translateY(2px) rotate(-0.16deg);
          }
        }

        @keyframes bus-cloud-drift {
          0% {
            opacity: 0.2;
            transform: translateX(-18px) scale(0.84);
          }
          36% {
            opacity: 0.76;
          }
          100% {
            opacity: 0;
            transform: translateX(172px) scale(1.3);
          }
        }

        @keyframes bus-trail-cloud {
          0% {
            opacity: 0.62;
            transform: translateX(-6px) scale(0.78);
          }
          34% {
            opacity: 0.96;
          }
          100% {
            opacity: 0;
            transform: translateX(92px) scale(1.22);
          }
        }

        @keyframes bus-driver-settle {
          0%,
          100% {
            transform: perspective(760px) rotateY(-12deg) rotate(-0.55deg)
              translateY(0);
          }
          34% {
            transform: perspective(760px) rotateY(-12deg) rotate(-0.4deg)
              translateY(-1px);
          }
          68% {
            transform: perspective(760px) rotateY(-12deg) rotate(-0.75deg)
              translateY(1px);
          }
        }

        @keyframes bus-driver-idle {
          0%,
          100% {
            transform: scaleX(-1) rotate(5deg) translateY(0);
          }
          28% {
            transform: scaleX(-1) rotate(4.1deg) translateY(-1px);
          }
          62% {
            transform: scaleX(-1) rotate(5.9deg) translateY(1px);
          }
          82% {
            transform: scaleX(-1) rotate(4.6deg) translateY(0);
          }
        }

        @keyframes bus-passenger-idle {
          0%,
          100% {
            transform: scaleX(-1) rotate(-2deg) translateY(0);
          }
          34% {
            transform: scaleX(-1) rotate(-1.3deg) translateY(-1px);
          }
          72% {
            transform: scaleX(-1) rotate(-2.6deg) translateY(1px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bus-bob,
          .bus-cloud,
          .bus-tail-cloud,
          .bus-front-left-passenger,
          .bus-front-left-passenger-img,
          .bus-driver-fit,
          .bus-driver-fit-img {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

function FieldInput({
  icon,
  label,
  name,
  placeholder = "",
  type = "text",
  defaultValue,
  min,
  max,
  divider = false,
}: {
  icon: ReactNode;
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "date" | "number";
  defaultValue?: string | number;
  min?: string | number;
  max?: string | number;
  divider?: boolean;
}) {
  return (
    <div
      className={`relative min-h-[62px] px-4 py-1.5 ${
        divider
          ? "md:after:absolute md:after:right-0 md:after:top-1/2 md:after:h-[70%] md:after:w-px md:after:-translate-y-1/2 md:after:bg-[#d9b38f]"
          : ""
      }`}
    >
      <label
        htmlFor={name}
        className="mb-1 block text-[10px] font-bold uppercase tracking-[0.13em] text-[#b58460]"
      >
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-lg bg-[#fffdfb] px-2 py-1 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-[#edb785]">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ffecd9] text-[#e07a2b]">
          {icon}
        </span>
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          defaultValue={defaultValue}
          min={min}
          max={max}
          className="h-7 w-full bg-transparent text-[13px] font-semibold text-[#4a3426] outline-none placeholder:text-[#9f8570] [color-scheme:light]"
        />
      </div>
    </div>
  );
}
