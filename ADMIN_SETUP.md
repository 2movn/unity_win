# Hướng dẫn chạy Windows System Manager với quyền Administrator

## Tại sao cần quyền Administrator?

Ứng dụng Windows System Manager cần quyền Administrator để:
- Quản lý Windows Services
- Truy cập thông tin hệ thống chi tiết
- Thực hiện các tác vụ tối ưu hóa hệ thống
- Sao lưu và khôi phục dữ liệu hệ thống
- Quản lý registry và cài đặt hệ thống

## Cách chạy ứng dụng

### 1. Sử dụng script PowerShell (Khuyến nghị)

```powershell
# Chạy development mode
.\run-as-admin.ps1 -Dev

# Build ứng dụng
.\run-as-admin.ps1 -Build

# Chạy ứng dụng đã build
.\run-as-admin.ps1 -Start
```

### 2. Sử dụng script Batch

```cmd
# Chạy development mode
run-as-admin.bat

# Hoặc sử dụng script dev có sẵn
dev.bat
```

### 3. Chạy thủ công với quyền Administrator

#### Development Mode:
```cmd
# Mở Command Prompt với quyền Administrator
# Sau đó chạy:
yarn dev
```

#### Build và chạy:
```cmd
# Build ứng dụng
yarn build

# Chạy ứng dụng đã build
yarn start
```

## Cấu hình tự động

### 1. File Manifest
Ứng dụng đã được cấu hình với file `app.manifest` để yêu cầu quyền Administrator tự động.

### 2. Electron Builder
Cấu hình trong `package.json` đã được thiết lập để tạo installer yêu cầu quyền Administrator.

## Troubleshooting

### Lỗi "Access Denied"
- Đảm bảo chạy với quyền Administrator
- Kiểm tra UAC (User Account Control) settings
- Thử chạy PowerShell/Command Prompt với quyền Administrator

### Lỗi "Cannot find module"
- Chạy `yarn install` trước khi chạy ứng dụng
- Đảm bảo tất cả dependencies đã được cài đặt

### Lỗi "Port already in use"
- Kiểm tra xem có process nào đang sử dụng port 3000 không
- Tắt các ứng dụng khác đang chạy trên port này

## Cấu trúc file

```
├── app.manifest              # File manifest yêu cầu quyền Administrator
├── run-as-admin.ps1         # Script PowerShell chạy với quyền Administrator
├── run-as-admin.bat         # Script Batch chạy với quyền Administrator
├── dev.bat                  # Script development với kiểm tra quyền
└── package.json             # Cấu hình Electron Builder
```

## Lưu ý bảo mật

- Chỉ chạy ứng dụng từ nguồn đáng tin cậy
- Kiểm tra mã nguồn trước khi chạy với quyền Administrator
- Đóng ứng dụng khi không sử dụng
- Không chia sẻ file executable với người khác

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra log trong console
2. Đảm bảo đã chạy với quyền Administrator
3. Kiểm tra tất cả dependencies đã được cài đặt
4. Thử restart máy tính nếu cần thiết
