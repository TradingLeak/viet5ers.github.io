# viet5ers.github.io

Dedicated to sharing in-depth knowledge and strategies for trading with The5ers proprietary firm. We also provide comprehensive market analysis tailored to community requests.

## Bản đồ địa hình Việt Nam

### 1. Bản đồ 3D — `index.html` (trang chủ)
- Dựng bằng **MapLibre GL JS** + DEM **Terrarium** (AWS Open Data – Mapzen/Joerd), không cần API key.
- Nghiêng / xoay / thu phóng như Google Earth; có **chế độ quả cầu (globe)** và **quay quanh**.
- Đổi lớp nền: vệ tinh, địa hình (OpenTopoMap), tối, sáng (OpenFreeMap).
- Bay tới địa danh; marker đỉnh núi, thành phố, đảo có thông tin khi nhấp.
- Điều chỉnh độ nhấn địa hình (×0.4 – ×3) và độ nghiêng.

### 2. Bản đồ 2D — `vietnam-terrain-map.html`
- Nền OpenTopoMap / bóng địa hình / bản đồ vật lý / vệ tinh, ranh giới quốc gia, đỉnh núi, biển đảo, vườn quốc gia.
- **Tra cứu độ cao** tại điểm: giải mã tile DEM Terrarium trong trình duyệt, dự phòng API OpenTopoData (SRTM 30 m) và Open-Elevation.
- **Mặt cắt địa hình**: 5 tuyến có sẵn + tự vẽ 2 điểm, biểu đồ độ cao, thống kê chênh cao.

Mã dùng chung: `assets/terrain3d.js` (module `VN3D`, khởi tạo bằng `VN3D.init({container:'map3d'})`) và `assets/terrain3d.css`.

> Lưu ý: các trang cần Internet (thư viện CDN, tile bản đồ và dữ liệu độ cao). Vị trí quần đảo Hoàng Sa / Trường Sa hiển thị chỉ mang tính tham khảo cho khu vực quần đảo.
