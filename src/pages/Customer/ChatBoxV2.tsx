import { useState, useRef, useEffect, useMemo } from "react";
import { MessageCircle, X, Send, Bot, User, RotateCcw } from "lucide-react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatContext {
  step?: string;
  [key: string]: unknown;
}

// Format tin nhắn bot cho đẹp
function FormatMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} className="h-1" />;

        // Dòng có số thứ tự đầu dòng: "1. Bến xe..." → card style
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.+)/);
        if (numberedMatch) {
          const [, num, rest] = numberedMatch;
          return (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-white/60 border border-[#e5e7eb] px-2.5 py-2 mt-1"
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f7a53a] to-[#e8791c] text-[10px] font-bold text-white mt-0.5">
                {num}
              </span>
              <span className="text-[13px] leading-snug">{formatInlineText(rest)}</span>
            </div>
          );
        }

        // Dòng bullet: "• Tìm chuyến..."
        if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
          const content = trimmed.replace(/^[•-]\s*/, "");
          return (
            <div key={i} className="flex items-start gap-1.5 pl-1">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f7a53a]" />
              <span className="text-[13px] leading-snug">{formatInlineText(content)}</span>
            </div>
          );
        }

        // Dòng có ":" → label: value (VD: "Mã đơn: xxx", "Ghế: A1, A2")
        const kvMatch = trimmed.match(/^(.+?):\s+(.+)/);
        if (kvMatch && !trimmed.startsWith("Ví dụ") && kvMatch[1].length < 25) {
          const [, label, value] = kvMatch;
          return (
            <div key={i} className="flex items-start gap-1 text-[13px] leading-snug">
              <span className="font-semibold text-[#374151] shrink-0">{label}:</span>
              <span>{formatInlineValue(value)}</span>
            </div>
          );
        }

        // Dòng thường
        return (
          <p key={i} className="text-[13px] leading-snug">
            {formatInlineText(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

// Highlight giá tiền, tên ghế, ngày giờ trong text
function formatInlineText(text: string) {
  // Highlight giá tiền VND
  const parts = text.split(/(\d{1,3}(?:\.\d{3})+\s*(?:đ|VND|vnđ))/gi);
  return parts.map((part, i) => {
    if (/\d{1,3}(?:\.\d{3})+\s*(?:đ|VND|vnđ)/i.test(part)) {
      return (
        <span key={i} className="font-bold text-[#e8791c]">
          {part}
        </span>
      );
    }
    return part;
  });
}

// Highlight value trong key:value (giá, mã đơn...)
function formatInlineValue(value: string) {
  // Giá tiền
  if (/\d{1,3}(?:\.\d{3})+\s*(?:đ|VND|vnđ)/i.test(value)) {
    return <span className="font-bold text-[#e8791c]">{value}</span>;
  }
  // Mã đơn (ObjectId-like)
  if (/^[a-f0-9]{24}$/i.test(value.trim())) {
    return <code className="rounded bg-[#e5e7eb] px-1 py-0.5 text-[11px] font-mono">{value}</code>;
  }
  return <span>{value}</span>;
}

// ============ SƠ ĐỒ GHẾ XE MINI ============
interface SeatLayoutData {
  floors?: number;
  rows?: number;
  columns?: { name: string; seats_per_row: number }[];
  row_overrides?: {
    row_index: number;
    floor: number;
    column_overrides?: { column_name: string; seats: number }[];
  }[];
}

interface SeatInfo {
  code: string;
  floor: number;
  state: "EMPTY" | "SOLD" | "SELECTED";
}

interface ColumnSeats {
  columnName: string;
  seats: SeatInfo[];
}

interface RowData {
  rowIndex: number;
  columns: ColumnSeats[];
}

function buildSeatMap(
  layout: SeatLayoutData,
  bookedSeats: string[],
  selectedSeats: string[]
): { floor: number; rows: RowData[]; columns: { name: string; seats_per_row: number }[] }[] {
  const floors = layout.floors || 1;
  const rows = layout.rows || 0;
  const columns = layout.columns || [];
  const overrides = layout.row_overrides || [];
  const result: { floor: number; rows: RowData[]; columns: typeof columns }[] = [];

  for (let f = 1; f <= floors; f++) {
    const floorRows: RowData[] = [];
    let seatCounter = 1;
    const prefix = floors > 1 ? (f === 1 ? "A" : "B") : "A";

    for (let r = 1; r <= rows; r++) {
      const rowColumns: ColumnSeats[] = [];
      const override = overrides.find((o) => o.row_index === r && o.floor === f);

      columns.forEach((col) => {
        let seatsInCol = col.seats_per_row;
        if (override) {
          const colOv = override.column_overrides?.find(
            (c) => c.column_name === col.name
          );
          if (colOv) seatsInCol = colOv.seats;
        }
        const colSeats: SeatInfo[] = [];
        for (let s = 0; s < seatsInCol; s++) {
          const code = `${prefix}${seatCounter++}`;
          const state = bookedSeats.includes(code)
            ? "SOLD"
            : selectedSeats.includes(code)
              ? "SELECTED"
              : "EMPTY";
          colSeats.push({ code, floor: f, state });
        }
        rowColumns.push({ columnName: col.name, seats: colSeats });
      });
      floorRows.push({ rowIndex: r, columns: rowColumns });
    }
    result.push({ floor: f, rows: floorRows, columns });
  }
  return result;
}

function getSeatStyle(state: "EMPTY" | "SOLD" | "SELECTED") {
  if (state === "SELECTED")
    return {
      frame: "border-[#ea5b2a] bg-[#fff6f1]",
      detail: "border-[#ea5b2a] bg-[#fffaf7]",
      label: "text-[#d84e1f]",
      leg: "bg-[#ea5b2a]",
    };
  if (state === "SOLD")
    return {
      frame: "border-[#a5acb8] bg-[#f4f5f7]",
      detail: "border-[#a5acb8] bg-[#f8f9fb]",
      label: "text-[#868e9b]",
      leg: "bg-[#a5acb8]",
    };
  return {
    frame: "border-[#1e8f2a] bg-white",
    detail: "border-[#1e8f2a] bg-white",
    label: "text-[#1e8f2a]",
    leg: "bg-[#1e8f2a]",
  };
}

function MiniSeat({ seat }: { seat: SeatInfo }) {
  const s = getSeatStyle(seat.state);
  return (
    <div className="relative h-[28px] w-[44px] overflow-visible">
      {/* Headrest */}
      <span
        className={`pointer-events-none absolute left-[8px] top-[0px] h-[8px] w-[27px] rounded-t-[4px] border-[1.5px] border-b-0 ${s.detail}`}
      />
      {/* Body */}
      <span
        className={`pointer-events-none absolute left-[4px] top-[7px] flex h-[14px] w-[36px] items-center justify-center rounded-[3px] border-[1.5px] text-[8px] font-black leading-none ${s.frame} ${s.label}`}
      >
        {seat.code}
      </span>
      {/* Legs */}
      <span
        className={`pointer-events-none absolute left-[14px] top-[21px] h-[5px] w-[1.5px] rounded-b-[1px] ${s.leg}`}
      />
      <span
        className={`pointer-events-none absolute right-[14px] top-[21px] h-[5px] w-[1.5px] rounded-b-[1px] ${s.leg}`}
      />
    </div>
  );
}

function SeatLayoutDiagram({ context }: { context: ChatContext }) {
  const layout = context.seatLayout as SeatLayoutData | undefined;
  const bookedSeats = (context.bookedSeats as string[]) || [];
  const selectedSeats = (context.selectedSeats as string[]) || [];

  const floorData = useMemo(() => {
    if (!layout) return [];
    return buildSeatMap(layout, bookedSeats, selectedSeats);
  }, [layout, bookedSeats, selectedSeats]);

  const [activeFloor, setActiveFloor] = useState(1);

  if (!layout || !floorData.length) return null;

  const currentFloor = floorData.find((f) => f.floor === activeFloor) || floorData[0];
  const columns = currentFloor.columns;

  // Build grid template: each column group separated by gap
  // e.g. LEFT(2 seats) [gap] RIGHT(2 seats) → "44px 44px 16px 44px 44px"
  const gridCols: string[] = [];
  columns.forEach((col, ci) => {
    if (ci > 0) gridCols.push("12px"); // gap between column groups
    for (let i = 0; i < col.seats_per_row; i++) {
      gridCols.push("44px");
    }
  });

  return (
    <div className="mt-2 rounded-xl border border-[#e5e7eb] bg-white p-2.5">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold text-[#374151]">Sơ đồ ghế</span>
        {floorData.length > 1 && (
          <div className="flex gap-1">
            {floorData.map((f) => (
              <button
                key={f.floor}
                onClick={() => setActiveFloor(f.floor)}
                className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${activeFloor === f.floor
                    ? "bg-gradient-to-br from-[#f7a53a] to-[#e8791c] text-white"
                    : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
                  }`}
              >
                Tầng {f.floor}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Driver + Door header row */}
      <div
        className="mb-1"
        style={{ display: "grid", gridTemplateColumns: gridCols.join(" "), gap: "3px", justifyContent: "center" }}
      >
        {/* First column: driver icon in first slot */}
        {columns.map((col, ci) => {
          const slots = col.seats_per_row;
          const cells = [];
          if (ci > 0) cells.push(<div key={`gap-h-${ci}`} />); // spacer
          for (let i = 0; i < slots; i++) {
            if (ci === 0 && i === 0) {
              // Driver
              cells.push(
                <div key="driver" className="flex h-[28px] w-[44px] items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
                  </svg>
                </div>
              );
            } else if (ci === columns.length - 1 && i === slots - 1) {
              // Door
              cells.push(
                <div key="door" className="flex h-[28px] w-[44px] items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                </div>
              );
            } else {
              cells.push(<div key={`empty-h-${ci}-${i}`} className="h-[28px] w-[44px]" />);
            }
          }
          return cells;
        })}
      </div>

      {/* Seat grid rows */}
      <div className="flex flex-col items-center gap-1">
        {currentFloor.rows.map((row) => (
          <div
            key={row.rowIndex}
            style={{ display: "grid", gridTemplateColumns: gridCols.join(" "), gap: "3px", justifyContent: "center" }}
          >
            {row.columns.map((col, ci) => {
              const cells = [];
              if (ci > 0) cells.push(<div key={`gap-${row.rowIndex}-${ci}`} />); // spacer
              if (col.seats.length > 0) {
                col.seats.forEach((seat) => {
                  cells.push(<MiniSeat key={seat.code} seat={seat} />);
                });
              } else {
                // Empty column slots
                const defaultSlots = columns[ci]?.seats_per_row || 0;
                for (let i = 0; i < defaultSlots; i++) {
                  cells.push(<div key={`empty-${row.rowIndex}-${ci}-${i}`} className="h-[28px] w-[44px]" />);
                }
              }
              return cells;
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-3">
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border-[1.5px] border-[#1e8f2a] bg-white" />
          <span className="text-[9px] text-[#6b7280]">Trống</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border-[1.5px] border-[#a5acb8] bg-[#f4f5f7]" />
          <span className="text-[9px] text-[#6b7280]">Đã đặt</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm border-[1.5px] border-[#ea5b2a] bg-[#fff6f1]" />
          <span className="text-[9px] text-[#6b7280]">Đang chọn</span>
        </div>
      </div>
    </div>
  );
}

export default function ChatBoxV2() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! 👋 Tôi có thể giúp bạn tìm chuyến xe và đặt vé. Bạn muốn đi đâu?\n\nVí dụ: \"Tôi muốn đi Đà Nẵng ra Huế ngày mai\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<ChatContext>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const getToken = (): string | null => {
    return localStorage.getItem("accessToken");
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const token = getToken();

      // Nếu bước đặt vé cần auth và có token → gọi route có auth
      // Ngược lại gọi route không auth
      const needAuth = context.step === "confirm_booking" && token;
      const url = needAuth
        ? `${API_BASE}/api/ai/check/chat`
        : `${API_BASE}/api/ai/notcheck/v2/chat`;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Gửi history (chỉ 10 tin gần nhất để giảm payload)
      const historyToSend = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await axios.post(
        url,
        {
          message: input.trim(),
          history: historyToSend,
          context,
        },
        { headers, timeout: 30000 }
      );

      const data = res.data;

      // Nếu server yêu cầu đăng nhập
      if (data.requireAuth && !token) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Bạn cần đăng nhập để đặt vé. Vui lòng đăng nhập rồi quay lại chat nhé!",
          },
        ]);
        setContext(data.context || {});
        setLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
      setContext(data.context || {});
    } catch (err: unknown) {
      console.error("Chat error:", err);

      let errorMsg = "Có lỗi xảy ra. Vui lòng thử lại sau!";
      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          errorMsg = "Phản hồi quá lâu. AI đang bận, bạn thử lại nhé!";
        } else if (err.response?.status === 401) {
          errorMsg = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!";
        } else if (!err.response) {
          errorMsg = "Không thể kết nối server. Vui lòng kiểm tra kết nối!";
        }
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Xin chào! 👋 Tôi có thể giúp bạn tìm chuyến xe và đặt vé. Bạn muốn đi đâu?\n\nVí dụ: \"Tôi muốn đi Đà Nẵng ra Huế ngày mai\"",
      },
    ]);
    setContext({});
  };

  return (
    <>
      {/* NÚT MỞ CHATBOX */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f7a53a] to-[#e8791c] shadow-[0_8px_24px_-6px_rgba(232,121,28,0.7)] transition-all duration-300 hover:scale-110"
        >
          <MessageCircle size={26} className="text-white" />
        </button>
      )}

      {/* CHATBOX POPUP */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-[9999] flex flex-col rounded-[20px] border border-[#e7eaf0] bg-white shadow-[0_24px_60px_-12px_rgba(15,23,42,0.3)]"
          style={{ width: 380, height: 560 }}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between rounded-t-[20px] bg-gradient-to-r from-[#f7a53a] to-[#e8791c] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-black text-white">Trợ lý đặt vé</p>
                <p className="text-[11px] text-white/70">
                  {context.step
                    ? `Bước: ${context.step === "select_route"
                      ? "Chọn tuyến"
                      : context.step === "select_trip"
                        ? "Chọn chuyến"
                        : context.step === "select_seat"
                          ? "Chọn ghế"
                          : context.step === "confirm_booking"
                            ? "Xác nhận đặt vé"
                            : "Hỗ trợ"
                    }`
                    : "Luôn sẵn sàng hỗ trợ"}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={resetChat}
                title="Bắt đầu lại"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
              >
                {/* AVATAR */}
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${msg.role === "assistant"
                      ? "bg-gradient-to-br from-[#f7a53a] to-[#e8791c]"
                      : "bg-[#e5e7eb]"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={14} className="text-white" />
                  ) : (
                    <User size={14} className="text-[#6b7280]" />
                  )}
                </div>

                {/* BUBBLE */}
                <div
                  className={`max-w-[75%] rounded-[14px] px-3 py-2 text-sm leading-relaxed ${msg.role === "user"
                      ? "rounded-br-[4px] bg-gradient-to-br from-[#f7a53a] to-[#e8791c] text-white whitespace-pre-line"
                      : "rounded-bl-[4px] bg-[#f3f4f6] text-[#1f2937]"
                    }`}
                >
                  {msg.role === "assistant" ? (
                    <FormatMessage text={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {/* SƠ ĐỒ GHẾ */}
            {(context.step === "select_seat" || context.step === "confirm_booking") &&
              !!context.seatLayout && (
                <SeatLayoutDiagram context={context} />
              )}

            {/* LOADING */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f7a53a] to-[#e8791c]">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="rounded-[14px] rounded-bl-[4px] bg-[#f3f4f6] px-4 py-3">
                  <div className="flex gap-1">
                    <span
                      className="h-2 w-2 rounded-full bg-[#9ca3af] animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-[#9ca3af] animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="h-2 w-2 rounded-full bg-[#9ca3af] animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="border-t border-[#e5e7eb] px-3 py-3">
            <div className="flex items-center gap-2 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-transparent text-sm text-[#1f2937] outline-none placeholder:text-[#9ca3af]"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#f7a53a] to-[#e8791c] text-white disabled:opacity-40 transition hover:scale-105"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-[#9ca3af]">
              Powered by AI · Hỗ trợ 24/7
            </p>
          </div>
        </div>
      )}
    </>
  );
}
