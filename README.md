## unity_win

Ứng dụng Electron hỗ trợ thiết lập và tối ưu Windows 11/10 với giao diện Ant Design hiện đại. Công cụ tập trung vào tối ưu hiệu năng, quản lý dịch vụ, mạng, sao lưu/dọn dẹp, di chuyển dữ liệu Zalo, và tải nhanh ứng dụng phổ biến.

### Tính năng nổi bật
- **Thông tin hệ thống**: CPU, RAM, Disk, VGA, phiên bản Windows, thiết bị mạng… cập nhật nhanh, chính xác.
- **Tối ưu Windows**:
  - Quản lý Services: xem trạng thái/kiểu khởi động, chọn và tắt các dịch vụ không cần thiết an toàn.
  - RAM ảo (Virtual Memory): đặt dung lượng cụ thể hoặc khôi phục mặc định.
  - Windows Update: bật/tắt và xem trạng thái.
  - Tối ưu hiệu năng giao diện và hệ thống (điều chỉnh hiệu ứng, nguồn điện, hibernation...).
- **Mạng (Network)**:
  - Bật/tắt IPv6 theo từng adapter (yêu cầu quyền Administrator), đồng bộ trạng thái.
  - Cấu hình Proxy (WinINET) và đồng bộ WinHTTP.
  - DNS, kiểm tra tốc độ mạng, và các tiện ích khác.
- **Công cụ hệ thống**:
  - Zalo Manager: di chuyển dữ liệu Zalo sang ổ khác và tạo Junction để tiết kiệm dung lượng ổ hệ thống.
  - Sao lưu/Khôi phục, Dọn dẹp rác hệ thống, Công cụ hiệu năng nhanh.
- **Tải nhanh ứng dụng (Quick Apps)**: Lấy danh sách từ JSON từ xa, hiển thị icon, mô tả, phân loại; cho phép tải xuống trực tiếp về thư mục Downloads của người dùng và mở nhanh thư mục này.

## Yêu cầu hệ thống
- Windows 10/11 (64-bit khuyến nghị).
- Quyền Administrator cho các thao tác hệ thống (services, registry, mạng...).
- Node.js 18+ và Yarn.

## Cài đặt và chạy ở chế độ phát triển
1) Cài đặt phụ thuộc
```bash
yarn install
```
2) Chạy ứng dụng (dev hot-reload)
```bash
yarn dev
```
Sau khi build xong, cửa sổ Electron sẽ tự mở. Không cần chạy riêng lẻ các lệnh `tsc` hay build renderer.

## Đóng gói (Build/Package)
- Đóng gói Windows (NSIS installer, yêu cầu quyền admin):
```bash
yarn package:win64
# hoặc
yarn package:win
```
File cài đặt sẽ nằm trong thư mục `release/`.

## Hướng dẫn sử dụng nhanh

### 1) Thông tin hệ thống
- Tab hiển thị cấu hình máy: CPU, RAM, Disk, GPU, phiên bản Windows, adapter mạng…

### 2) Tối ưu hóa Windows
- **Services**:
  - Nhấn Làm mới để cập nhật danh sách.
  - Cột Trạng thái hiển thị rõ: Running/Stopped/Pending/Paused (không còn Unknown).
  - Lọc theo Trạng thái, StartType, SafeToDisable; chọn nhiều service và bấm Tối ưu để tắt.
- **Virtual Memory**:
  - Nhập dung lượng (GB) và bấm Cài đặt. Có thể khôi phục mặc định.
- **Windows Update**: Bật lại hoặc xem trạng thái cập nhật tự động.
- **Hiệu năng**: Áp dụng gói tối ưu giao diện và hệ thống.

Lưu ý: Một số thao tác yêu cầu khởi động lại Explorer hoặc máy để áp dụng ngay.

### 3) Mạng (Network)
- **IPv6**: Chọn adapter cụ thể để bật/tắt IPv6. Ứng dụng sử dụng PowerShell (`Set/Disable/Enable-NetAdapterBinding`, `Restart-NetAdapter`) và xác thực trạng thái.
- **Proxy**: Thiết lập qua WinINET registry và đồng bộ WinHTTP.
- **Khác**: Kiểm tra tốc độ mạng, cấu hình DNS.

Yêu cầu chạy ứng dụng với quyền Administrator để đảm bảo thao tác thành công.

### 4) Công cụ hệ thống
- **Zalo Manager**:
  - Chọn ổ đích (ví dụ `D:\`), bấm Di chuyển Zalo.
  - Ứng dụng sẽ tự dừng tiến trình `Zalo.exe`, sao chép dữ liệu sang ổ mới, và tạo junction (`mklink /J`) để ứng dụng Zalo tiếp tục hoạt động bình thường.
  - Thành công sẽ báo đường dẫn backup/đích. Nếu thất bại, kiểm tra quyền ghi và tắt hoàn toàn Zalo.
- **Sao lưu/Dọn dẹp/Hiệu năng nhanh**: Các công cụ thao tác nhanh cho người dùng phổ thông.

### 5) Tải nhanh ứng dụng (Quick Apps)
- Danh sách lấy từ JSON (bao gồm icon, mô tả, phiên bản, loại ứng dụng…).
- Tìm kiếm, lọc theo danh mục, bấm Tải để tải xuống.
- File tải về sẽ nằm trong thư mục Downloads của người dùng (Windows). Có nút “Mở thư mục tải về” để mở File Explorer đến đúng vị trí.

## Cấu trúc thư mục chính
```
unity_win/
  renderer/        # UI (React + Ant Design)
    dev/components # Các trang & thành phần (SystemInfo, NetworkManager, WindowsOptimization, ToolsManager, ZaloManager, QuickApps...)
  src/dev/         # Quy trình chính Electron (main, preload, services)
    services/      # WindowsOptimizationService, NetworkService, ...
  assets/          # Icon, tài nguyên
  release/         # Đầu ra khi đóng gói
```

## Quyền & lưu ý an toàn
- Nhiều tính năng can thiệp registry, services, và adapter mạng → cần quyền Administrator.
- Thao tác với Windows Defender/Update có thể ảnh hưởng bảo mật. Cân nhắc trước khi tắt.
- Di chuyển Zalo: đảm bảo Zalo đã tắt hoàn toàn; junction được tạo bằng `mklink /J` để tương thích tốt trên Windows.

## Khắc phục sự cố (Troubleshooting)
- **Trạng thái dịch vụ hiển thị Unknown**: Nhấn Làm mới. Ứng dụng đã chuyển sang đọc bằng PowerShell để hiển thị chính xác.
- **Bật/tắt IPv6 báo “Access is denied.”**: Chạy ứng dụng bằng quyền Administrator. Một số adapter cần `Restart-NetAdapter` để áp dụng.
- **Di chuyển Zalo thất bại**: Đảm bảo đủ dung lượng ở ổ đích và Zalo đã tắt (đã `taskkill /IM Zalo.exe /F`).
- **Không tải được ứng dụng (Quick Apps)**: Kiểm tra kết nối mạng hoặc đường dẫn JSON nguồn.

## Giấy phép
Phần mềm phát hành theo giấy phép MIT. Xem `package.json` để biết thêm chi tiết.
