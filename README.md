# GOLDPULSE — Phân tích XAUUSD hằng tuần

Website tĩnh (GitHub Pages) với giao diện tối hiện đại, trình bày bản tin phân tích **XAU/USD** hằng tuần:
tổng quan thị trường, biểu đồ nến tương tác, chỉ báo kỹ thuật, động lực vĩ mô, kịch bản và kế hoạch giao dịch.

## Nội dung

- **Tổng quan** — giá đóng cửa tuần, biến động WoW, chỉ số xu hướng tổng hợp (gauge), bảng giá nhanh.
- **Biểu đồ** — nến D1 vẽ bằng SVG thuần (không thư viện ngoài), hỗ trợ:
  - chuyển khung 1 tháng / 3 tháng;
  - bật/tắt SMA20, SMA50, mức then chốt, khối lượng;
  - crosshair + tooltip OHLCV khi di chuột.
- **Kỹ thuật** — RSI, MACD, SMA, Stochastic, Bollinger, ATR và bản đồ mức hỗ trợ/kháng cự.
- **Cơ bản** — bốn động lực vĩ mô chi phối giá vàng.
- **Kịch bản** — ba kịch bản cho tuần giao dịch kèm xác suất, mục tiêu, mức vô hiệu + bảng kế hoạch giao dịch.
- **Lịch kinh tế** — sự kiện then chốt của tuần (GMT+7).
- **FAQ, đăng ký nhận bản tin, footer với tuyên bố miễn trừ trách nhiệm.**

## Cấu trúc

```
index.html            # toàn bộ nội dung trang
assets/css/style.css  # theme tối, biến CSS, responsive
assets/js/app.js      # engine biểu đồ SVG + tương tác UI (vanilla JS)
assets/js/data.js     # dữ liệu OHLCV mô phỏng (70 phiên)
tools/gen-data.js     # script sinh dữ liệu: node tools/gen-data.js
```

## Chạy thử

Mở trực tiếp `index.html` bằng trình duyệt, hoặc:

```bash
python3 -m http.server 8080
# truy cập http://localhost:8080
```

## Lưu ý dữ liệu

Dữ liệu giá, chỉ báo và lịch kinh tế được **dựng lại cho mục đích minh họa phương pháp phân tích**,
neo theo các mốc giá công bố trong tuần 21–26/09/2026 (đóng cửa 4.321, đỉnh tháng 8 tại 4.755,
ngưỡng phân kỳ 4.190). Nội dung mang tính giáo dục, không phải khuyến nghị đầu tư.
