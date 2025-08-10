export interface DefaultService {
  Name: string;
  DisplayName: string;
  Description: string;
  VietnameseName: string;
  VietnameseDescription: string;
  Category: string;
  Impact: string;
  SafeToDisable: boolean;
}

export interface DefaultServicesData {
  services: DefaultService[];
}

export const defaultServicesData: DefaultServicesData = {
  services: [
    {
      "Name": "AJRouter",
      "DisplayName": "AllJoyn Router Service",
      "Description": "Routes AllJoyn messages for the local AllJoyn clients. If this service is stopped the AllJoyn clients that do not have their own bundled routers will be unable to run.",
      "VietnameseName": "AllJoyn Router",
      "VietnameseDescription": "Định tuyến các thông điệp AllJoyn giữa các ứng dụng hỗ trợ AllJoyn trên máy tính. Đây là một phần của nền tảng IoT giúp các thiết bị trong mạng cục bộ giao tiếp với nhau. Nếu tắt, các ứng dụng phụ thuộc vào AllJoyn có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "ALG",
      "DisplayName": "Application Layer Gateway Service",
      "Description": "Provides support for 3rd party protocol plug-ins for Internet Connection Sharing",
      "VietnameseName": "Ứng dụng Layer Gateway",
      "VietnameseDescription": "Hỗ trợ các plugin giao thức của bên thứ ba phục vụ cho Chia sẻ Kết nối Internet (ICS). Nó giúp các phần mềm như VPN hoặc ứng dụng VoIP hoạt động xuyên qua tường lửa. Nếu tắt, một số phần mềm mạng có thể không kết nối được.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "AppIDSvc",
      "DisplayName": "Application Identity",
      "Description": "Determines and verifies the identity of an application. Disabling this service will prevent AppLocker from being enforced.",
      "VietnameseName": "Ứng dụng Identity",
      "VietnameseDescription": "Xác định và xác minh danh tính của ứng dụng, được sử dụng bởi AppLocker để kiểm soát việc thực thi phần mềm. Nếu tắt, các quy tắc AppLocker sẽ không được áp dụng.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "Appinfo",
      "DisplayName": "Application Information",
      "Description": "Facilitates the running of interactive applications with additional administrative privileges.  If this service is stopped, users will be unable to launch applications with the additional administrative privileges they may require to perform desired user tasks.",
      "VietnameseName": "Ứng dụng Thông tin",
      "VietnameseDescription": "Cung cấp quyền nâng cao để khởi chạy ứng dụng với quyền quản trị viên (UAC). Nếu tắt, người dùng sẽ không thể khởi chạy ứng dụng yêu cầu quyền cao hơn.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "AppMgmt",
      "DisplayName": "Application Management",
      "Description": "Processes installation, removal, and enumeration requests for software deployed through Group Policy. If the service is disabled, users will be unable to install, remove, or enumerate software deployed through Group Policy. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Ứng dụng Quản lý",
      "VietnameseDescription": "Xử lý các yêu cầu cài đặt, gỡ bỏ và quản lý phần mềm thông qua Group Policy. Nếu tắt, các thao tác triển khai phần mềm qua mạng sẽ không thực hiện được.",
      "Category": "Administration",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "AppReadiness",
      "DisplayName": "App Readiness",
      "Description": "Gets apps ready for use the first time a user signs in to this PC and when adding new apps.",
      "VietnameseName": "App Readiness",
      "VietnameseDescription": "Chuẩn bị ứng dụng mới cài đặt để sử dụng khi người dùng đăng nhập lần đầu. Nếu tắt, một số ứng dụng có thể không hoạt động đúng sau khi cài đặt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "AppVClient",
      "DisplayName": "Microsoft App-V Client",
      "Description": "Manages App-V users and virtual applications",
      "VietnameseName": "Microsoft App-V Client",
      "VietnameseDescription": "Dịch vụ máy khách của Microsoft Application Virtualization (App-V), cho phép chạy các ứng dụng ảo hóa. Nếu không sử dụng App-V, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "AppXSvc",
      "DisplayName": "AppX Deployment Service (AppXSVC)",
      "Description": "Provides infrastructure support for deploying Store applications. This service is started on demand and if disabled Store applications will not be deployed to the system, and may not function properly.",
      "VietnameseName": "AppX Deployment  (AppXSVC)",
      "VietnameseDescription": "Cung cấp hạ tầng để triển khai, cài đặt và cập nhật các ứng dụng từ Microsoft Store. Nếu tắt, các ứng dụng Store có thể không hoạt động hoặc không cập nhật được.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "AssignedAccessManagerSvc",
      "DisplayName": "AssignedAccessManager Service",
      "Description": "AssignedAccessManager Service supports kiosk experience in Windows.",
      "VietnameseName": "AssignedAccessManager",
      "VietnameseDescription": "Quản lý chế độ truy cập hạn chế (Assigned Access), cho phép người dùng bị giới hạn chỉ sử dụng một ứng dụng cụ thể. Nếu không dùng chế độ này, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "AudioEndpointBuilder",
      "DisplayName": "Windows Audio Endpoint Builder",
      "Description": "Manages audio devices for the Windows Audio service.  If this service is stopped, audio devices and effects will not function properly.  If this service is disabled, any services that explicitly depend on it will fail to start",
      "VietnameseName": "Windows Âm thanh Endpoint Builder",
      "VietnameseDescription": "Xử lý các chức năng âm thanh của hệ thống như phát nhạc, âm báo. Nếu tắt, hệ thống có thể không phát được âm thanh.",
      "Category": "Media",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "Audiosrv",
      "DisplayName": "Windows Audio",
      "Description": "Manages audio for Windows-based programs.  If this service is stopped, audio devices and effects will not function properly.  If this service is disabled, any services that explicitly depend on it will fail to start",
      "VietnameseName": "Âm thanh Windows",
      "VietnameseDescription": "Xử lý các chức năng âm thanh của hệ thống như phát nhạc, âm báo. Nếu tắt, hệ thống có thể không phát được âm thanh.",
      "Category": "Media",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "autotimesvc",
      "DisplayName": "Cellular Time",
      "Description": "This service sets time based on NITZ messages from a Mobile Network",
      "VietnameseName": "Cellular Thời gian",
      "VietnameseDescription": "Đồng bộ thời gian qua mạng di động (Cellular Network). Nếu thiết bị không sử dụng mạng di động, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "AxInstSV",
      "DisplayName": "ActiveX Installer (AxInstSV)",
      "Description": "Provides User Account Control validation for the installation of ActiveX controls from the Internet and enables management of ActiveX control installation based on Group Policy settings. This service is started on demand and if disabled the installation of ActiveX controls will behave according to default browser settings.",
      "VietnameseName": "ActiveX Installer (AxInstSV)",
      "VietnameseDescription": "Cho phép cài đặt ActiveX trong Internet Explorer với quyền quản trị. Nếu tắt, một số trang web sử dụng ActiveX sẽ không hoạt động đúng.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "BDESVC",
      "DisplayName": "BitLocker Drive Encryption Service",
      "Description": "BDESVC hosts the BitLocker Drive Encryption service. BitLocker Drive Encryption provides secure startup for the operating system, as well as full volume encryption for OS, fixed or removable volumes. This service allows BitLocker to prompt users for various actions related to their volumes when mounted, and unlocks volumes automatically without user interaction. Additionally, it stores recovery information to Active Directory, if available, and, if necessary, ensures the most recent recovery certificates are used.  Stopping or disabling the service would prevent users from leveraging this functionality.",
      "VietnameseName": "BitLocker Drive Encryption",
      "VietnameseDescription": "Cung cấp dịch vụ mã hóa ổ đĩa bằng BitLocker. Nếu tắt, quá trình bảo vệ hoặc khôi phục dữ liệu bằng BitLocker có thể bị ảnh hưởng.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "BFE",
      "DisplayName": "Base Filtering Engine",
      "Description": "The Base Filtering Engine (BFE) is a service that manages firewall and Internet Protocol security (IPsec) policies and implements user mode filtering. Stopping or disabling the BFE service will significantly reduce the security of the system. It will also result in unpredictable behavior in IPsec management and firewall applications.",
      "VietnameseName": "Base Filtering Engine",
      "VietnameseDescription": "Là nền tảng cho tường lửa của Windows và bộ lọc gói (IPsec). Nếu tắt, nhiều ứng dụng bảo mật và mạng có thể không hoạt động đúng.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "BITS",
      "DisplayName": "Background Intelligent Transfer Service",
      "Description": "Transfers files in the background using idle network bandwidth. If the service is disabled, then any applications that depend on BITS, such as Windows Update or MSN Explorer, will be unable to automatically download programs and other information.",
      "VietnameseName": "Background Intelligent Transfer",
      "VietnameseDescription": "Truyền tệp trong nền, đặc biệt dùng cho cập nhật Windows hoặc tải xuống gián đoạn. Nếu tắt, cập nhật và đồng bộ có thể thất bại.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "BrokerInfrastructure",
      "DisplayName": "Background Tasks Infrastructure Service",
      "Description": "Windows infrastructure service that controls which background tasks can run on the system.",
      "VietnameseName": "Background Tasks Infrastructure",
      "VietnameseDescription": "Quản lý các nhiệm vụ nền của ứng dụng hiện đại (UWP). Nếu tắt, các chức năng như thông báo nền có thể ngừng hoạt động.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "BTAGService",
      "DisplayName": "Bluetooth Audio Gateway Service",
      "Description": "Service supporting the audio gateway role of the Bluetooth Handsfree Profile.",
      "VietnameseName": "Bluetooth Âm thanh Gateway",
      "VietnameseDescription": "Xử lý các chức năng âm thanh của hệ thống như phát nhạc, âm báo. Nếu tắt, hệ thống có thể không phát được âm thanh.",
      "Category": "Media",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "BthAvctpSvc",
      "DisplayName": "AVCTP service",
      "Description": "This is Audio Video Control Transport Protocol service",
      "VietnameseName": "AVCTP service",
      "VietnameseDescription": "Hỗ trợ giao thức điều khiển thiết bị Bluetooth như tai nghe hoặc bộ điều khiển. Nếu tắt, các thiết bị Bluetooth điều khiển từ xa có thể không hoạt động đúng.",
      "Category": "Media",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "bthserv",
      "DisplayName": "Bluetooth Support Service",
      "Description": "The Bluetooth service supports discovery and association of remote Bluetooth devices.  Stopping or disabling this service may cause already installed Bluetooth devices to fail to operate properly and prevent new devices from being discovered or associated.",
      "VietnameseName": "Bluetooth Support",
      "VietnameseDescription": "Quản lý kết nối và dịch vụ Bluetooth cơ bản. Nếu tắt, bạn không thể sử dụng thiết bị Bluetooth với máy tính.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "camsvc",
      "DisplayName": "Capability Access Manager Service",
      "Description": "Provides facilities for managing UWP apps access to app capabilities as well as checking an app's access to specific app capabilities",
      "VietnameseName": "Capability Access Manager",
      "VietnameseDescription": "Hỗ trợ quản lý camera và thiết bị ghi hình trong hệ thống. Nếu tắt, một số ứng dụng có thể không truy cập được webcam.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "CDPSvc",
      "DisplayName": "Connected Devices Platform Service",
      "Description": "This service is used for Connected Devices Platform scenarios",
      "VietnameseName": "Connected Devices Platform",
      "VietnameseDescription": "Thu thập dữ liệu về kết nối và thiết bị để cải thiện trải nghiệm người dùng (liên kết thiết bị, điện thoại...). Có thể tắt nếu không dùng tính năng liên kết.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "CertPropSvc",
      "DisplayName": "Certificate Propagation",
      "Description": "Copies user certificates and root certificates from smart cards into the current user's certificate store, detects when a smart card is inserted into a smart card reader, and, if needed, installs the smart card Plug and Play minidriver.",
      "VietnameseName": "Certificate Propagation",
      "VietnameseDescription": "Quản lý thuộc tính chứng chỉ thông qua smartcard. Nếu không dùng thẻ thông minh, có thể tắt.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "ClipSVC",
      "DisplayName": "Client License Service (ClipSVC)",
      "Description": "Provides infrastructure support for the Microsoft Store. This service is started on demand and if disabled applications bought using Windows Store will not behave correctly.",
      "VietnameseName": "Client License  (ClipSVC)",
      "VietnameseDescription": "Cung cấp dịch vụ cơ sở hạ tầng cho các ứng dụng Microsoft Store. Nếu tắt, một số ứng dụng Store có thể không hoạt động.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "cloudidsvc",
      "DisplayName": "Microsoft Cloud Identity Service",
      "Description": "Supports integrations with Microsoft cloud identity services.  If disabled, tenant restrictions will not be enforced properly.",
      "VietnameseName": "Microsoft Cloud Identity",
      "VietnameseDescription": "Hỗ trợ tích hợp với dịch vụ định danh đám mây của Microsoft. Quản lý các hạn chế tenant và chính sách bảo mật. Nếu tắt, các hạn chế tenant có thể không được thực thi đúng cách.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "COMSysApp",
      "DisplayName": "COM+ System Application",
      "Description": "Manages the configuration and tracking of Component Object Model (COM)+-based components. If the service is stopped, most COM+-based components will not function properly. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "COM+ System Ứng dụng",
      "VietnameseDescription": "Hỗ trợ quản lý COM+ Event System. Nếu tắt, các ứng dụng sử dụng COM+ sẽ không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "CoreMessagingRegistrar",
      "DisplayName": "CoreMessaging",
      "Description": "Manages communication between system components.",
      "VietnameseName": "CoreMessaging",
      "VietnameseDescription": "Hỗ trợ nền tảng nhắn tin giữa các thành phần của ứng dụng hiện đại. Nếu tắt, các ứng dụng UWP có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "CryptSvc",
      "DisplayName": "Cryptographic Services",
      "Description": "Provides three management services: Catalog Database Service, which confirms the signatures of Windows files and allows new programs to be installed; Protected Root Service, which adds and removes Trusted Root Certification Authority certificates from this computer; and Automatic Root Certificate Update Service, which retrieves root certificates from Windows Update and enable scenarios such as SSL. If this service is stopped, these management services will not function properly. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Cryptographic s",
      "VietnameseDescription": "Dịch vụ mật mã học cung cấp chức năng mã hóa và chứng thực. Là thiết yếu cho hoạt động bảo mật của hệ điều hành.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "CscService",
      "DisplayName": "Offline Files",
      "Description": "The Offline Files service performs maintenance activities on the Offline Files cache, responds to user logon and logoff events, implements the internals of the public API, and dispatches interesting events to those interested in Offline Files activities and changes in cache state.",
      "VietnameseName": "Offline Files",
      "VietnameseDescription": "Quản lý tệp offline và đồng bộ hóa dữ liệu khi không có kết nối mạng. Duy trì cache tệp và xử lý sự kiện đăng nhập/đăng xuất. Nếu tắt, tính năng tệp offline sẽ không hoạt động.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DcomLaunch",
      "DisplayName": "DCOM Server Process Launcher",
      "Description": "The DCOMLAUNCH service launches COM and DCOM servers in response to object activation requests. If this service is stopped or disabled, programs using COM or DCOM will not function properly. It is strongly recommended that you have the DCOMLAUNCH service running.",
      "VietnameseName": "DCOM Server Process Launcher",
      "VietnameseDescription": "Khởi động các dịch vụ DCOM cần thiết cho hoạt động COM. Dịch vụ hệ thống quan trọng, không nên tắt.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "dcsvc",
      "DisplayName": "Declared Configuration(DC) service",
      "Description": "Process Declared Configuration documents recevied from MDM and other channels and perform configurations on device",
      "VietnameseName": "Declared Configuration(DC) service",
      "VietnameseDescription": "Xử lý tài liệu cấu hình được khai báo từ MDM và các kênh khác để thực hiện cấu hình trên thiết bị. Quản lý cài đặt từ xa cho doanh nghiệp. Nếu tắt, cấu hình từ xa có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "defragsvc",
      "DisplayName": "Optimize drives",
      "Description": "Helps the computer run more efficiently by optimizing files on storage drives.",
      "VietnameseName": "Optimize drives",
      "VietnameseDescription": "Tối ưu hóa hiệu suất ổ cứng bằng cách sắp xếp lại các tệp và phân mảnh ổ đĩa. Giúp máy tính chạy hiệu quả hơn. Nếu tắt, ổ cứng có thể chậm dần theo thời gian.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DeviceAssociationService",
      "DisplayName": "Device Association Service",
      "Description": "Enables pairing between the system and wired or wireless devices.",
      "VietnameseName": "Device Association",
      "VietnameseDescription": "Cho phép ghép nối thiết bị không dây như tai nghe, bàn phím. Nếu tắt, có thể không kết nối được thiết bị mới.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "DeviceInstall",
      "DisplayName": "Device Install Service",
      "Description": "Enables a computer to recognize and adapt to hardware changes with little or no user input. Stopping or disabling this service will result in system instability.",
      "VietnameseName": "Device Install",
      "VietnameseDescription": "Quản lý quá trình cài đặt trình điều khiển cho phần cứng. Nếu tắt, thiết bị mới có thể không nhận được.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DevQueryBroker",
      "DisplayName": "DevQuery Background Discovery Broker",
      "Description": "Enables apps to discover devices with a backgroud task",
      "VietnameseName": "DevQuery Background Discovery Broker",
      "VietnameseDescription": "Cho phép ứng dụng khám phá thiết bị thông qua tác vụ nền. Hỗ trợ tìm kiếm và kết nối thiết bị tự động. Nếu tắt, một số ứng dụng có thể không tìm thấy thiết bị mới.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "Dhcp",
      "DisplayName": "DHCP Client",
      "Description": "Registers and updates IP addresses and DNS records for this computer. If this service is stopped, this computer will not receive dynamic IP addresses and DNS updates. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "DHCP Client",
      "VietnameseDescription": "Gán địa chỉ IP động tự động cho máy tính từ router. Nếu tắt, phải cấu hình IP thủ công để có mạng.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "diagnosticshub.standardcollector.service",
      "DisplayName": "Microsoft (R) Diagnostics Hub Standard Collector Service",
      "Description": "Diagnostics Hub Standard Collector Service. When running, this service collects real time ETW events and processes them.",
      "VietnameseName": "Microsoft (R) Diagnostics Hub Standard Collector",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "diagsvc",
      "DisplayName": "Diagnostic Execution Service",
      "Description": "Executes diagnostic actions for troubleshooting support",
      "VietnameseName": "Diagnostic Execution",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DiagTrack",
      "DisplayName": "Connected User Experiences and Telemetry",
      "Description": "The Connected User Experiences and Telemetry service enables features that support in-application and connected user experiences. Additionally, this service manages the event driven collection and transmission of diagnostic and usage information (used to improve the experience and quality of the Windows Platform) when the diagnostics and usage privacy option settings are enabled under Feedback and Diagnostics.",
      "VietnameseName": "Connected User Experiences and Telemetry",
      "VietnameseDescription": "Thu thập dữ liệu chẩn đoán và hiệu suất hệ thống gửi về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": true
    },
    {
      "Name": "DialogBlockingService",
      "DisplayName": "DialogBlockingService",
      "Description": "Dialog Blocking Service",
      "VietnameseName": "DialogBlocking",
      "VietnameseDescription": "Quản lý và chặn các hộp thoại hệ thống không mong muốn. Hỗ trợ kiểm soát các thông báo và popup. Nếu tắt, có thể xuất hiện nhiều hộp thoại không cần thiết.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "DispBrokerDesktopSvc",
      "DisplayName": "Display Policy Service",
      "Description": "Manages the connection and configuration of local and remote displays",
      "VietnameseName": "Display Policy",
      "VietnameseDescription": "Quản lý kết nối và cấu hình màn hình cục bộ và từ xa. Hỗ trợ thiết lập đa màn hình và kết nối màn hình ngoài. Nếu tắt, cấu hình màn hình có thể không hoạt động đúng.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "DisplayEnhancementService",
      "DisplayName": "Display Enhancement Service",
      "Description": "A service for managing display enhancement such as brightness control.",
      "VietnameseName": "Display Enhancement",
      "VietnameseDescription": "Quản lý các tính năng nâng cao cho màn hình như điều chỉnh độ sáng tự động, tối ưu hóa hiển thị. Nếu tắt, một số tính năng màn hình có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "DmEnrollmentSvc",
      "DisplayName": "Device Management Enrollment Service",
      "Description": "Performs Device Enrollment Activities for Device Management",
      "VietnameseName": "Device Quản lý Enrollment",
      "VietnameseDescription": "Thực hiện các hoạt động đăng ký thiết bị cho quản lý thiết bị từ xa. Hỗ trợ MDM (Mobile Device Management) cho doanh nghiệp. Nếu tắt, quản lý thiết bị từ xa có thể không hoạt động.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "dmwappushservice",
      "DisplayName": "Device Management Wireless Application Protocol (WAP) Push message Routing Service",
      "Description": "Routes Wireless Application Protocol (WAP) Push messages received by the device and synchronizes Device Management sessions",
      "VietnameseName": "Device Quản lý Wireless Ứng dụng Protocol (WAP) Push message Routing",
      "VietnameseDescription": "Định tuyến tin nhắn WAP Push và đồng bộ hóa phiên quản lý thiết bị. Hỗ trợ nhận thông báo cấu hình từ xa qua mạng di động. Nếu tắt, có thể không nhận được cấu hình từ xa.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "Dnscache",
      "DisplayName": "DNS Client",
      "Description": "The DNS Client service (dnscache) caches Domain Name System (DNS) names and registers the full computer name for this computer. If the service is stopped, DNS names will continue to be resolved. However, the results of DNS name queries will not be cached and the computer's name will not be registered. If the service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "DNS Client",
      "VietnameseDescription": "Dịch vụ phân giải tên miền (DNS) cục bộ. Lưu cache tên miền để tăng tốc độ truy cập website. Nếu tắt, có thể gây lỗi khi truy cập Internet.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "DoSvc",
      "DisplayName": "Delivery Optimization",
      "Description": "Performs content delivery optimization tasks",
      "VietnameseName": "Delivery Optimization",
      "VietnameseDescription": "Cung cấp dịch vụ phân phối nội dung tối ưu, đặc biệt cho Windows Update (Delivery Optimization). Nếu tắt, việc tải cập nhật có thể chậm hơn.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "dot3svc",
      "DisplayName": "Wired AutoConfig",
      "Description": "The Wired AutoConfig (DOT3SVC) service is responsible for performing IEEE 802.1X authentication on Ethernet interfaces. If your current wired network deployment enforces 802.1X authentication, the DOT3SVC service should be configured to run for establishing Layer 2 connectivity and/or providing access to network resources. Wired networks that do not enforce 802.1X authentication are unaffected by the DOT3SVC service.",
      "VietnameseName": "Wired AutoConfig",
      "VietnameseDescription": "Thực hiện xác thực IEEE 802.1X trên giao diện Ethernet. Hỗ trợ kết nối mạng có dây với bảo mật cao. Nếu tắt, có thể không kết nối được mạng có dây yêu cầu xác thực.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "DPS",
      "DisplayName": "Diagnostic Policy Service",
      "Description": "The Diagnostic Policy Service enables problem detection, troubleshooting and resolution for Windows components.  If this service is stopped, diagnostics will no longer function.",
      "VietnameseName": "Diagnostic Policy",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "Administration",
      "Impact": "Cao",
      "SafeToDisable": true
    },
    {
      "Name": "DsmSvc",
      "DisplayName": "Device Setup Manager",
      "Description": "Enables the detection, download and installation of device-related software. If this service is disabled, devices may be configured with outdated software, and may not work correctly.",
      "VietnameseName": "Device Setup Manager",
      "VietnameseDescription": "Quản lý không gian lưu trữ và nhóm đĩa động (Storage Spaces). Nếu không sử dụng chức năng này, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DsSvc",
      "DisplayName": "Data Sharing Service",
      "Description": "Provides data brokering between applications.",
      "VietnameseName": "Data Sharing",
      "VietnameseDescription": "Cung cấp dịch vụ đồng bộ hóa dữ liệu giữa ứng dụng và tài khoản Microsoft. Có thể tắt nếu không sử dụng đồng bộ.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DusmSvc",
      "DisplayName": "Data Usage",
      "Description": "Network data usage, data limit, restrict background data, metered networks.",
      "VietnameseName": "Data Usage",
      "VietnameseDescription": "Theo dõi và quản lý sử dụng dữ liệu mạng, giới hạn dữ liệu, hạn chế dữ liệu nền, mạng có giới hạn. Nếu tắt, không thể kiểm soát được việc sử dụng dữ liệu.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "EapHost",
      "DisplayName": "Extensible Authentication Protocol",
      "Description": "The Extensible Authentication Protocol (EAP) service provides network authentication in such scenarios as 802.1x wired and wireless, VPN, and Network Access Protection (NAP).  EAP also provides application programming interfaces (APIs) that are used by network access clients, including wireless and VPN clients, during the authentication process.  If you disable this service, this computer is prevented from accessing networks that require EAP authentication.",
      "VietnameseName": "Extensible Authentication Protocol",
      "VietnameseDescription": "Cung cấp xác thực mạng cho các kịch bản như 802.1x có dây và không dây, VPN, và Network Access Protection (NAP). Hỗ trợ các giao thức bảo mật mạng. Nếu tắt, không thể kết nối mạng yêu cầu xác thực EAP.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "edgeupdate",
      "DisplayName": "Microsoft Edge Update Service (edgeupdate)",
      "Description": "Keeps your Microsoft software up to date. If this service is disabled or stopped, your Microsoft software will not be kept up to date, meaning security vulnerabilities that may arise cannot be fixed and features may not work. This service uninstalls itself when there is no Microsoft software using it.",
      "VietnameseName": "Microsoft Edge Cập nhật  (edgeupdate)",
      "VietnameseDescription": "Giữ cho phần mềm Microsoft luôn được cập nhật. Nếu tắt, Microsoft Edge sẽ không được cập nhật tự động, có thể gây lỗi bảo mật và tính năng không hoạt động.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "edgeupdatem",
      "DisplayName": "Microsoft Edge Update Service (edgeupdatem)",
      "Description": "Keeps your Microsoft software up to date. If this service is disabled or stopped, your Microsoft software will not be kept up to date, meaning security vulnerabilities that may arise cannot be fixed and features may not work. This service uninstalls itself when there is no Microsoft software using it.",
      "VietnameseName": "Microsoft Edge Cập nhật  (edgeupdatem)",
      "VietnameseDescription": "Giữ cho phần mềm Microsoft luôn được cập nhật. Nếu tắt, Microsoft Edge sẽ không được cập nhật tự động, có thể gây lỗi bảo mật và tính năng không hoạt động.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "EFS",
      "DisplayName": "Encrypting File System (EFS)",
      "Description": "Provides the core file encryption technology used to store encrypted files on NTFS file system volumes. If this service is stopped or disabled, applications will be unable to access encrypted files.",
      "VietnameseName": "Encrypting File System (EFS)",
      "VietnameseDescription": "Cung cấp công nghệ mã hóa tệp cốt lõi để lưu trữ tệp được mã hóa trên ổ đĩa NTFS. Nếu tắt, không thể truy cập các tệp đã được mã hóa.",
      "Category": "System Update",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "embeddedmode",
      "DisplayName": "Embedded Mode",
      "Description": "The Embedded Mode service enables scenarios related to Background Applications.  Disabling this service will prevent Background Applications from being activated.",
      "VietnameseName": "Embedded Mode",
      "VietnameseDescription": "Hỗ trợ chế độ nhúng (Embedded Mode) dành cho các thiết bị chuyên dụng chạy Windows. Nếu là máy cá nhân, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "EntAppSvc",
      "DisplayName": "Enterprise App Management Service",
      "Description": "Enables enterprise application management.",
      "VietnameseName": "Enterprise App Quản lý",
      "VietnameseDescription": "Cung cấp hạ tầng cho ứng dụng doanh nghiệp hiện đại. Nếu không dùng ứng dụng UWP doanh nghiệp, có thể tắt.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "EventLog",
      "DisplayName": "Windows Event Log",
      "Description": "This service manages events and event logs. It supports logging events, querying events, subscribing to events, archiving event logs, and managing event metadata. It can display events in both XML and plain text format. Stopping this service may compromise security and reliability of the system.",
      "VietnameseName": "Windows Event Log",
      "VietnameseDescription": "Ghi lại sự kiện của hệ thống và phần mềm để chẩn đoán lỗi. Là dịch vụ hệ thống quan trọng, không nên tắt.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "EventSystem",
      "DisplayName": "COM+ Event System",
      "Description": "Supports System Event Notification Service (SENS), which provides automatic distribution of events to subscribing Component Object Model (COM) components. If the service is stopped, SENS will close and will not be able to provide logon and logoff notifications. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "COM+ Event System",
      "VietnameseDescription": "Quản lý sự kiện hệ thống COM+ và thông báo sự kiện. Dịch vụ lõi của Windows, không nên tắt.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "fdPHost",
      "DisplayName": "Function Discovery Provider Host",
      "Description": "The FDPHOST service hosts the Function Discovery (FD) network discovery providers. These FD providers supply network discovery services for the Simple Services Discovery Protocol (SSDP) and Web Services – Discovery (WS-D) protocol. Stopping or disabling the FDPHOST service will disable network discovery for these protocols when using FD. When this service is unavailable, network services using FD and relying on these discovery protocols will be unable to find network devices or resources.",
      "VietnameseName": "Function Discovery Provider Host",
      "VietnameseDescription": "Hỗ trợ các giao thức tên điểm-kết-nối trên mạng như PNRP. Có thể tắt nếu không sử dụng chia sẻ mạng nội bộ nâng cao.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "FDResPub",
      "DisplayName": "Function Discovery Resource Publication",
      "Description": "Publishes this computer and resources attached to this computer so they can be discovered over the network.  If this service is stopped, network resources will no longer be published and they will not be discovered by other computers on the network.",
      "VietnameseName": "Function Discovery Resource Publication",
      "VietnameseDescription": "Xuất bản tên máy tính và tài nguyên chia sẻ lên mạng. Nếu tắt, thiết bị khác có thể không tìm thấy bạn trong mạng LAN.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "fhsvc",
      "DisplayName": "File History Service",
      "Description": "Protects user files from accidental loss by copying them to a backup location",
      "VietnameseName": "File History",
      "VietnameseDescription": "Quản lý tính năng File History (Lịch sử tệp). Nếu không dùng chức năng sao lưu này, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "FontCache",
      "DisplayName": "Windows Font Cache Service",
      "Description": "Optimizes performance of applications by caching commonly used font data. Applications will start this service if it is not already running. It can be disabled, though doing so will degrade application performance.",
      "VietnameseName": "Windows Font Cache",
      "VietnameseDescription": "Tăng tốc quá trình tải và hiển thị phông chữ. Nếu tắt, hiệu suất hiển thị văn bản có thể giảm.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "FrameServer",
      "DisplayName": "Windows Camera Frame Server",
      "Description": "Enables multiple clients to access video frames from camera devices.",
      "VietnameseName": "Windows Camera Frame Server",
      "VietnameseDescription": "Cung cấp luồng hình ảnh cho các ứng dụng camera hoặc quay video. Nếu không sử dụng quay video trực tiếp, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "FrameServerMonitor",
      "DisplayName": "Windows Camera Frame Server Monitor",
      "Description": "Monitors the health and state for the Windows Camera Frame Server service.",
      "VietnameseName": "Windows Camera Frame Server Monitor",
      "VietnameseDescription": "Cung cấp luồng hình ảnh cho các ứng dụng camera hoặc quay video. Nếu không sử dụng quay video trực tiếp, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "FvSvc",
      "DisplayName": "NVIDIA FrameView SDK service",
      "Description": "NVIDIA FrameView SDK service",
      "VietnameseName": "NVIDIA FrameView SDK service",
      "VietnameseDescription": "Dịch vụ hỗ trợ NVIDIA FrameView SDK. Nếu tắt, Các ứng dụng sử dụng NVIDIA FrameView SDK có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "GameInputSvc",
      "DisplayName": "GameInput Service",
      "Description": "Enables keyboards, mice, gamepads, and other input devices to be used with the GameInput API.",
      "VietnameseName": "GameInput",
      "VietnameseDescription": "Hỗ trợ bàn phím, chuột, gamepad và các thiết bị đầu vào khác thông qua GameInput API. Cần thiết cho game và ứng dụng đa phương tiện. Nếu tắt, một số game có thể không nhận được input.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "gpsvc",
      "DisplayName": "Group Policy Client",
      "Description": "The service is responsible for applying settings configured by administrators for the computer and users through the Group Policy component. If the service is disabled, the settings will not be applied and applications and components will not be manageable through Group Policy. Any components or applications that depend on the Group Policy component might not be functional if the service is disabled.",
      "VietnameseName": "Group Policy Client",
      "VietnameseDescription": "Áp dụng các cài đặt được cấu hình bởi quản trị viên cho máy tính và người dùng thông qua Group Policy. Quản lý chính sách bảo mật và cài đặt hệ thống. Nếu tắt, các cài đặt chính sách sẽ không được áp dụng.",
      "Category": "Administration",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "GraphicsPerfSvc",
      "DisplayName": "GraphicsPerfSvc",
      "Description": "Graphics performance monitor service",
      "VietnameseName": "GraphicsPerfSvc",
      "VietnameseDescription": "Theo dõi hiệu suất đồ họa để tối ưu. Nếu không cần giám sát hiệu suất GPU, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "hidserv",
      "DisplayName": "Human Interface Device Service",
      "Description": "Activates and maintains the use of hot buttons on keyboards, remote controls, and other multimedia devices. It is recommended that you keep this service running.",
      "VietnameseName": "Human Interface Device",
      "VietnameseDescription": "Hỗ trợ các thiết bị đầu vào đặc biệt như nút media, bàn phím mở rộng. Có thể tắt nếu không dùng thiết bị phụ trợ.",
      "Category": "Media",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "HvHost",
      "DisplayName": "HV Host Service",
      "Description": "Provides an interface for the Hyper-V hypervisor to provide per-partition performance counters to the host operating system.",
      "VietnameseName": "HV Host",
      "VietnameseDescription": "Cung cấp hỗ trợ ảo hóa cho Hyper-V. Nếu không dùng máy ảo trên Windows, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "icssvc",
      "DisplayName": "Windows Mobile Hotspot Service",
      "Description": "Provides the ability to share a cellular data connection with another device.",
      "VietnameseName": "Windows Mobile Hotspot",
      "VietnameseDescription": "Đồng bộ lịch, email và danh bạ từ tài khoản như Outlook hoặc Exchange. Nếu không dùng, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "IKEEXT",
      "DisplayName": "IKE and AuthIP IPsec Keying Modules",
      "Description": "The IKEEXT service hosts the Internet Key Exchange (IKE) and Authenticated Internet Protocol (AuthIP) keying modules. These keying modules are used for authentication and key exchange in Internet Protocol security (IPsec). Stopping or disabling the IKEEXT service will disable IKE and AuthIP key exchange with peer computers. IPsec is typically configured to use IKE or AuthIP; therefore, stopping or disabling the IKEEXT service might result in an IPsec failure and might compromise the security of the system. It is strongly recommended that you have the IKEEXT service running.",
      "VietnameseName": "IKE and AuthIP IPsec Keying Modules",
      "VietnameseDescription": "Hỗ trợ các giao thức bảo mật cho kết nối VPN như IPsec và IKE. Nếu tắt, kết nối VPN bảo mật sẽ không hoạt động.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "InstallService",
      "DisplayName": "Microsoft Store Install Service",
      "Description": "Provides infrastructure support for the Microsoft Store.  This service is started on demand and if disabled then installations will not function properly.",
      "VietnameseName": "Microsoft Store Install",
      "VietnameseDescription": "Dịch vụ nền cho Windows Installer. Hỗ trợ cập nhật và cài đặt ứng dụng. Nếu tắt, việc cập nhật có thể bị lỗi.",
      "Category": "System Update",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "InventorySvc",
      "DisplayName": "Inventory and Compatibility Appraisal service",
      "Description": "This service performs background system inventory, compatibility appraisal, and maintenance used by numerous system components.",
      "VietnameseName": "Inventory and Compatibility Appraisal service",
      "VietnameseDescription": "Thực hiện kiểm kê hệ thống nền, đánh giá tương thích và bảo trì được sử dụng bởi nhiều thành phần hệ thống. Hỗ trợ Windows Update và cài đặt ứng dụng. Nếu tắt, có thể ảnh hưởng đến việc cập nhật.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "iphlpsvc",
      "DisplayName": "IP Helper",
      "Description": "Provides tunnel connectivity using IPv6 transition technologies (6to4, ISATAP, Port Proxy, and Teredo), and IP-HTTPS. If this service is stopped, the computer will not have the enhanced connectivity benefits that these technologies offer.",
      "VietnameseName": "IP Helper",
      "VietnameseDescription": "Cung cấp giao thức mạng như IPv6 transition và IP-HTTPS. Nếu không dùng tính năng mạng nâng cao, có thể tắt.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "IpxlatCfgSvc",
      "DisplayName": "IP Translation Configuration Service",
      "Description": "Configures and enables translation from v4 to v6 and vice versa",
      "VietnameseName": "IP Translation Configuration",
      "VietnameseDescription": "Cấu hình và bật chuyển đổi từ IPv4 sang IPv6 và ngược lại. Hỗ trợ kết nối mạng trong môi trường hỗn hợp IPv4/IPv6. Nếu tắt, có thể gặp vấn đề khi kết nối mạng IPv6.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "KeyIso",
      "DisplayName": "CNG Key Isolation",
      "Description": "The CNG key isolation service is hosted in the LSA process. The service provides key process isolation to private keys and associated cryptographic operations as required by the Common Criteria. The service stores and uses long-lived keys in a secure process complying with Common Criteria requirements.",
      "VietnameseName": "CNG Key Isolation",
      "VietnameseDescription": "Quản lý khóa mã hóa được bảo vệ, đặc biệt trong các thao tác bảo mật với chứng chỉ. Nên giữ chạy nếu dùng mã hóa.",
      "Category": "System Update",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "KtmRm",
      "DisplayName": "KtmRm for Distributed Transaction Coordinator",
      "Description": "Coordinates transactions between the Distributed Transaction Coordinator (MSDTC) and the Kernel Transaction Manager (KTM). If it is not needed, it is recommended that this service remain stopped. If it is needed, both MSDTC and KTM will start this service automatically. If this service is disabled, any MSDTC transaction interacting with a Kernel Resource Manager will fail and any services that explicitly depend on it will fail to start.",
      "VietnameseName": "KtmRm for Distributed Transaction Coordinator",
      "VietnameseDescription": "Hỗ trợ giao dịch phân tán (Distributed Transaction Coordinator). Ít khi dùng trên máy cá nhân, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "LanmanServer",
      "DisplayName": "Server",
      "Description": "Supports file, print, and named-pipe sharing over the network for this computer. If this service is stopped, these functions will be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Server",
      "VietnameseDescription": "Cho phép chia sẻ tệp và máy in qua mạng. Nếu tắt, máy sẽ không thể được truy cập từ thiết bị khác.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "LanmanWorkstation",
      "DisplayName": "Workstation",
      "Description": "Creates and maintains client network connections to remote servers using the SMB protocol. If this service is stopped, these connections will be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Workstation",
      "VietnameseDescription": "Kết nối đến máy khác qua mạng chia sẻ tệp. Nếu tắt, bạn không thể truy cập thư mục/máy in mạng.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "lfsvc",
      "DisplayName": "Geolocation Service",
      "Description": "This service monitors the current location of the system and manages geofences (a geographical location with associated events).  If you turn off this service, applications will be unable to use or receive notifications for geolocation or geofences.",
      "VietnameseName": "Geolocation",
      "VietnameseDescription": "Theo dõi vị trí hiện tại của hệ thống và quản lý geofences (vị trí địa lý với các sự kiện liên quan). Hỗ trợ ứng dụng cần thông tin vị trí. Nếu tắt, ứng dụng không thể sử dụng hoặc nhận thông báo về vị trí.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "LicenseManager",
      "DisplayName": "Windows License Manager Service",
      "Description": "Provides infrastructure support for the Microsoft Store.  This service is started on demand and if disabled then content acquired through the Microsoft Store will not function properly.",
      "VietnameseName": "Windows License Manager",
      "VietnameseDescription": "Quản lý giấy phép ứng dụng UWP. Có thể tắt nếu không dùng ứng dụng Microsoft Store.",
      "Category": "System Update",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "lltdsvc",
      "DisplayName": "Link-Layer Topology Discovery Mapper",
      "Description": "Creates a Network Map, consisting of PC and device topology (connectivity) information, and metadata describing each PC and device.  If this service is disabled, the Network Map will not function properly.",
      "VietnameseName": "Link-Layer Topology Discovery Mapper",
      "VietnameseDescription": "Cung cấp thông tin sơ đồ mạng cho Network Map. Nếu không cần hiển thị bản đồ mạng, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "lmhosts",
      "DisplayName": "TCP/IP NetBIOS Helper",
      "Description": "Provides support for the NetBIOS over TCP/IP (NetBT) service and NetBIOS name resolution for clients on the network, therefore enabling users to share files, print, and log on to the network. If this service is stopped, these functions might be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "TCP/IP NetBIOS Helper",
      "VietnameseDescription": "Hỗ trợ phân giải tên NetBIOS qua TCP/IP. Nếu không dùng mạng LAN cũ, có thể tắt.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "LSM",
      "DisplayName": "Local Session Manager",
      "Description": "Core Windows Service that manages local user sessions. Stopping or disabling this service will result in system instability.",
      "VietnameseName": "Local Session Manager",
      "VietnameseDescription": "Dịch vụ quản lý phiên người dùng. Nếu tắt, hệ thống người dùng có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "LxpSvc",
      "DisplayName": "Language Experience Service",
      "Description": "Provides infrastructure support for deploying and configuring localized Windows resources. This service is started on demand and, if disabled, additional Windows languages will not be deployed to the system, and Windows may not function properly.",
      "VietnameseName": "Language Experience",
      "VietnameseDescription": "Cung cấp hỗ trợ cơ sở hạ tầng cho việc triển khai và cấu hình tài nguyên Windows được bản địa hóa. Hỗ trợ cài đặt ngôn ngữ và gói ngôn ngữ. Nếu tắt, các ngôn ngữ Windows bổ sung sẽ không được triển khai và Windows có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "MapsBroker",
      "DisplayName": "Downloaded Maps Manager",
      "Description": "Windows service for application access to downloaded maps. This service is started on-demand by application accessing downloaded maps. Disabling this service will prevent apps from accessing maps.",
      "VietnameseName": "Downloaded Maps Manager",
      "VietnameseDescription": "Dịch vụ Windows cho phép ứng dụng truy cập bản đồ đã tải xuống. Hỗ trợ ứng dụng bản đồ và định vị. Nếu tắt, ứng dụng sẽ không thể truy cập bản đồ đã tải.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "McpManagementService",
      "DisplayName": "McpManagementService",
      "Description": "",
      "VietnameseName": "McpQuản lý",
      "VietnameseDescription": "Dịch vụ quản lý MCP (Microsoft Cloud Platform). Hỗ trợ quản lý và cấu hình các dịch vụ đám mây Microsoft. Nếu tắt, có thể ảnh hưởng đến các dịch vụ đám mây.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "MicrosoftEdgeElevationService",
      "DisplayName": "Microsoft Edge Elevation Service (MicrosoftEdgeElevationService)",
      "Description": "Keeps Microsoft Edge up to update. If this service is disabled, the application will not be kept up to date.",
      "VietnameseName": "Microsoft Edge Elevation  (MicrosoftEdgeElevation)",
      "VietnameseDescription": "Hỗ trợ kiểm tra, tải và cài đặt các bản cập nhật cho Windows. Nếu tắt, hệ điều hành sẽ không được cập nhật bảo mật hoặc tính năng mới.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "MixedRealityOpenXRSvc",
      "DisplayName": "Windows Mixed Reality OpenXR Service",
      "Description": "Enables Mixed Reality OpenXR runtime functionality",
      "VietnameseName": "Windows Mixed Reality OpenXR",
      "VietnameseDescription": "Bật chức năng runtime Mixed Reality OpenXR. Hỗ trợ thực tế ảo và thực tế tăng cường. Nếu tắt, ứng dụng Mixed Reality có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "mpssvc",
      "DisplayName": "Windows Defender Firewall",
      "Description": "Windows Defender Firewall helps protect your computer by preventing unauthorized users from gaining access to your computer through the Internet or a network.",
      "VietnameseName": "Windows Defender Firewall",
      "VietnameseDescription": "Bảo vệ máy tính khỏi truy cập trái phép bằng cách kiểm soát lưu lượng mạng. Nếu tắt, hệ thống dễ bị tấn công hơn.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "MSDTC",
      "DisplayName": "Distributed Transaction Coordinator",
      "Description": "Coordinates transactions that span multiple resource managers, such as databases, message queues, and file systems. If this service is stopped, these transactions will fail. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Distributed Transaction Coordinator",
      "VietnameseDescription": "Điều phối các giao dịch trải dài trên nhiều trình quản lý tài nguyên như cơ sở dữ liệu, hàng đợi tin nhắn và hệ thống tệp. Hỗ trợ ứng dụng doanh nghiệp. Nếu tắt, các giao dịch này sẽ thất bại.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "MSiSCSI",
      "DisplayName": "Microsoft iSCSI Initiator Service",
      "Description": "Manages Internet SCSI (iSCSI) sessions from this computer to remote iSCSI target devices. If this service is stopped, this computer will not be able to login or access iSCSI targets. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Microsoft iSCSI Initiator",
      "VietnameseDescription": "Quản lý phiên Internet SCSI (iSCSI) từ máy tính này đến thiết bị đích iSCSI từ xa. Hỗ trợ kết nối lưu trữ mạng. Nếu tắt, không thể đăng nhập hoặc truy cập các đích iSCSI.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "msiserver",
      "DisplayName": "Windows Installer",
      "Description": "Adds, modifies, and removes applications provided as a Windows Installer (*.msi, *.msp) package. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Windows Installer",
      "VietnameseDescription": "Thêm, sửa đổi và gỡ bỏ ứng dụng được cung cấp dưới dạng gói Windows Installer (*.msi, *.msp). Hỗ trợ cài đặt và quản lý phần mềm. Nếu tắt, không thể cài đặt hoặc gỡ bỏ phần mềm.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "MsKeyboardFilter",
      "DisplayName": "Microsoft Keyboard Filter",
      "Description": "Controls keystroke filtering and mapping",
      "VietnameseName": "Microsoft Keyboard Filter",
      "VietnameseDescription": "Kiểm soát lọc và ánh xạ phím. Hỗ trợ chặn và thay đổi các phím tắt. Nếu tắt, tính năng lọc phím có thể không hoạt động.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "NaturalAuthentication",
      "DisplayName": "Natural Authentication",
      "Description": "Signal aggregator service, that evaluates signals based on time, network, geolocation, bluetooth and cdf factors. Supported features are Device Unlock, Dynamic Lock and Dynamo MDM policies",
      "VietnameseName": "Natural Authentication",
      "VietnameseDescription": "Cho phép dùng xác thực sinh trắc học (ví dụ: khuôn mặt). Nếu không dùng Windows Hello, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "NcaSvc",
      "DisplayName": "Network Connectivity Assistant",
      "Description": "Provides DirectAccess status notification for UI components",
      "VietnameseName": "Network Connectivity Assistant",
      "VietnameseDescription": "Cung cấp thông báo trạng thái DirectAccess cho các thành phần giao diện. Hỗ trợ kết nối mạng doanh nghiệp từ xa. Nếu tắt, có thể không nhận được thông báo về trạng thái kết nối DirectAccess.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "NcbService",
      "DisplayName": "Network Connection Broker",
      "Description": "Brokers connections that allow Windows Store Apps to receive notifications from the internet.",
      "VietnameseName": "Network Connection Broker",
      "VietnameseDescription": "Môi giới kết nối cho phép ứng dụng Windows Store nhận thông báo từ internet. Hỗ trợ thông báo đẩy cho ứng dụng. Nếu tắt, ứng dụng có thể không nhận được thông báo từ internet.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "NcdAutoSetup",
      "DisplayName": "Network Connected Devices Auto-Setup",
      "Description": "Network Connected Devices Auto-Setup service monitors and installs qualified devices that connect to a qualified network. Stopping or disabling this service will prevent Windows from discovering and installing qualified network connected devices automatically. Users can still manually add network connected devices to a PC through the user interface.",
      "VietnameseName": "Network Connected Devices Auto-Setup",
      "VietnameseDescription": "Giám sát và cài đặt tự động các thiết bị mạng đủ tiêu chuẩn. Hỗ trợ phát hiện và cài đặt thiết bị mạng mới. Nếu tắt, Windows sẽ không tự động phát hiện và cài đặt thiết bị mạng mới.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "Netlogon",
      "DisplayName": "Netlogon",
      "Description": "Maintains a secure channel between this computer and the domain controller for authenticating users and services. If this service is stopped, the computer may not authenticate users and services and the domain controller cannot register DNS records. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Netlogon",
      "VietnameseDescription": "Hỗ trợ kết nối với miền (domain). Nếu máy không tham gia domain doanh nghiệp, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "Netman",
      "DisplayName": "Network Connections",
      "Description": "Manages objects in the Network and Dial-Up Connections folder, in which you can view both local area network and remote connections.",
      "VietnameseName": "Network Connections",
      "VietnameseDescription": "Quản lý kết nối mạng (bao gồm cả dial-up và VPN). Nếu không dùng dial-up hoặc VPN cũ, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "netprofm",
      "DisplayName": "Network List Service",
      "Description": "Identifies the networks to which the computer has connected, collects and stores properties for these networks, and notifies applications when these properties change.",
      "VietnameseName": "Network List",
      "VietnameseDescription": "Xác định các mạng mà máy tính đã kết nối, thu thập và lưu trữ thuộc tính của các mạng này, thông báo cho ứng dụng khi thuộc tính thay đổi. Nếu tắt, có thể không nhận được thông báo về thay đổi mạng.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "NetSetupSvc",
      "DisplayName": "Network Setup Service",
      "Description": "The Network Setup Service manages the installation of network drivers and permits the configuration of low-level network settings.  If this service is stopped, any driver installations that are in-progress may be cancelled.",
      "VietnameseName": "Network Setup",
      "VietnameseDescription": "Hỗ trợ cấu hình và kết nối mạng mới. Nếu tắt, có thể không kết nối được mạng mới.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "NetTcpPortSharing",
      "DisplayName": "Net.Tcp Port Sharing Service",
      "Description": "Provides ability to share TCP ports over the net.tcp protocol.",
      "VietnameseName": "Net.Tcp Port Sharing",
      "VietnameseDescription": "Cung cấp khả năng chia sẻ cổng TCP qua giao thức net.tcp. Hỗ trợ ứng dụng WCF (Windows Communication Foundation). Nếu tắt, các ứng dụng WCF có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "NgcCtnrSvc",
      "DisplayName": "Microsoft Passport Container",
      "Description": "Manages local user identity keys used to authenticate user to identity providers as well as TPM virtual smart cards. If this service is disabled, local user identity keys and TPM virtual smart cards will not be accessible. It is recommended that you do not reconfigure this service.",
      "VietnameseName": "Microsoft Passport Container",
      "VietnameseDescription": "Hỗ trợ đăng nhập và xác thực người dùng bằng thẻ thông minh. Có thể tắt nếu không sử dụng thiết bị này.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "NgcSvc",
      "DisplayName": "Microsoft Passport",
      "Description": "Provides process isolation for cryptographic keys used to authenticate to a user’s associated identity providers. If this service is disabled, all uses and management of these keys will not be available, which includes machine logon and single-sign on for apps and websites. This service starts and stops automatically. It is recommended that you do not reconfigure this service.",
      "VietnameseName": "Microsoft Passport",
      "VietnameseDescription": "Cung cấp cách ly quy trình cho khóa mã hóa được sử dụng để xác thực với nhà cung cấp danh tính của người dùng. Hỗ trợ đăng nhập máy và đăng nhập đơn cho ứng dụng và website. Nếu tắt, tất cả việc sử dụng và quản lý các khóa này sẽ không khả dụng.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "NlaSvc",
      "DisplayName": "Network Location Awareness",
      "Description": "Collects and stores configuration information for the network and notifies programs when this information is modified. If this service is stopped, configuration information might be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Network Location Awareness",
      "VietnameseDescription": "Xác định vị trí mạng (Network Location Awareness). Nếu tắt, một số dịch vụ phụ thuộc mạng có thể không hoạt động đúng.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "nsi",
      "DisplayName": "Network Store Interface Service",
      "Description": "This service delivers network notifications (e.g. interface addition/deleting etc) to user mode clients. Stopping this service will cause loss of network connectivity. If this service is disabled, any other services that explicitly depend on this service will fail to start.",
      "VietnameseName": "Network Store Interface",
      "VietnameseDescription": "Cung cấp thông báo mạng (như thêm/xóa giao diện) cho các ứng dụng người dùng. Nếu tắt, sẽ mất kết nối mạng và các dịch vụ phụ thuộc sẽ không khởi động được.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "NvContainerLocalSystem",
      "DisplayName": "NVIDIA LocalSystem Container",
      "Description": "Container service for NVIDIA root features",
      "VietnameseName": "NVIDIA LocalSystem Container",
      "VietnameseDescription": "Dịch vụ container cho các tính năng gốc của NVIDIA. Hỗ trợ quản lý driver và phần mềm NVIDIA. Nếu tắt, các tính năng NVIDIA có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "NVDisplay.ContainerLocalSystem",
      "DisplayName": "NVIDIA Display Container LS",
      "Description": "Container service for NVIDIA root features",
      "VietnameseName": "NVIDIA Display Container LS",
      "VietnameseDescription": "Dịch vụ container cho các tính năng hiển thị NVIDIA. Hỗ trợ quản lý màn hình và đồ họa NVIDIA. Nếu tắt, hiển thị NVIDIA có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "ose",
      "DisplayName": "Office  Source Engine",
      "Description": "Saves installation files used for updates and repairs and is required for the downloading of Setup updates and Watson error reports.",
      "VietnameseName": "Office  Source Engine",
      "VietnameseDescription": "Hỗ trợ kiểm tra, tải và cài đặt các bản cập nhật cho Windows. Nếu tắt, hệ điều hành sẽ không được cập nhật bảo mật hoặc tính năng mới.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "p2pimsvc",
      "DisplayName": "Peer Networking Identity Manager",
      "Description": "Provides identity services for the Peer Name Resolution Protocol (PNRP) and Peer-to-Peer Grouping services.  If disabled, the Peer Name Resolution Protocol (PNRP) and Peer-to-Peer Grouping services may not function, and some applications, such as HomeGroup and Remote Assistance, may not function correctly.",
      "VietnameseName": "Peer Networking Identity Manager",
      "VietnameseDescription": "Cung cấp dịch vụ định danh cho giao thức PNRP và dịch vụ nhóm ngang hàng. Hỗ trợ HomeGroup và Remote Assistance. Nếu tắt, các ứng dụng như HomeGroup và Remote Assistance có thể không hoạt động đúng.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "p2psvc",
      "DisplayName": "Peer Networking Grouping",
      "Description": "Enables multi-party communication using Peer-to-Peer Grouping.  If disabled, some applications, such as HomeGroup, may not function.",
      "VietnameseName": "Peer Networking Grouping",
      "VietnameseDescription": "Cho phép giao tiếp đa bên sử dụng nhóm ngang hàng. Hỗ trợ HomeGroup và các ứng dụng chia sẻ mạng. Nếu tắt, các ứng dụng như HomeGroup có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "PcaSvc",
      "DisplayName": "Program Compatibility Assistant Service",
      "Description": "This service provides support for the Program Compatibility Assistant (PCA).  PCA monitors programs installed and run by the user and detects known compatibility problems. If this service is stopped, PCA will not function properly.",
      "VietnameseName": "Program Compatibility Assistant",
      "VietnameseDescription": "Phát hiện và khắc phục các vấn đề tương thích ứng dụng. Nếu tắt, Windows có thể không cảnh báo khi ứng dụng cũ gặp lỗi.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "PeerDistSvc",
      "DisplayName": "BranchCache",
      "Description": "This service caches network content from peers on the local subnet.",
      "VietnameseName": "BranchCache",
      "VietnameseDescription": "Cho phép truyền dữ liệu qua mạng ngang hàng (P2P), hỗ trợ tối ưu cập nhật. Nếu không dùng trong môi trường doanh nghiệp, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "perceptionsimulation",
      "DisplayName": "Windows Perception Simulation Service",
      "Description": "Enables spatial perception simulation, virtual camera management and spatial input simulation.",
      "VietnameseName": "Windows Perception Simulation",
      "VietnameseDescription": "Hỗ trợ mô phỏng đầu vào thực tế ảo hoặc thiết bị tương tác ảo. Nếu không dùng thiết bị AR/VR, có thể tắt.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PerfHost",
      "DisplayName": "Performance Counter DLL Host",
      "Description": "Enables remote users and 64-bit processes to query performance counters provided by 32-bit DLLs. If this service is stopped, only local users and 32-bit processes will be able to query performance counters provided by 32-bit DLLs.",
      "VietnameseName": "Performance Counter DLL Host",
      "VietnameseDescription": "Thu thập dữ liệu hiệu suất từ dịch vụ khác. Nếu tắt, một số công cụ giám sát hiệu năng có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PhoneSvc",
      "DisplayName": "Phone Service",
      "Description": "Manages the telephony state on the device",
      "VietnameseName": "Phone",
      "VietnameseDescription": "Hỗ trợ đồng bộ điện thoại và thông báo giữa PC và điện thoại. Nếu không dùng liên kết điện thoại, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "pla",
      "DisplayName": "Performance Logs & Alerts",
      "Description": "Performance Logs and Alerts Collects performance data from local or remote computers based on preconfigured schedule parameters, then writes the data to a log or triggers an alert. If this service is stopped, performance information will not be collected. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Performance Logs & Alerts",
      "VietnameseDescription": "Thu thập dữ liệu hiệu suất từ máy tính cục bộ hoặc từ xa dựa trên tham số lịch trình được cấu hình trước, sau đó ghi dữ liệu vào nhật ký hoặc kích hoạt cảnh báo. Nếu tắt, thông tin hiệu suất sẽ không được thu thập.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PlugPlay",
      "DisplayName": "Plug and Play",
      "Description": "Enables a computer to recognize and adapt to hardware changes with little or no user input. Stopping or disabling this service will result in system instability.",
      "VietnameseName": "Plug and Play",
      "VietnameseDescription": "Phát hiện và cấu hình thiết bị mới tự động. Là dịch vụ thiết yếu, không nên tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "PNRPAutoReg",
      "DisplayName": "PNRP Machine Name Publication Service",
      "Description": "This service publishes a machine name using the Peer Name Resolution Protocol.  Configuration is managed via the netsh context 'p2p pnrp peer' ",
      "VietnameseName": "PNRP Machine Name Publication",
      "VietnameseDescription": "Đăng ký tên máy tính vào mạng ngang hàng (Peer Name Resolution Protocol). Có thể tắt nếu không dùng mạng P2P.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PNRPsvc",
      "DisplayName": "Peer Name Resolution Protocol",
      "Description": "Enables serverless peer name resolution over the Internet using the Peer Name Resolution Protocol (PNRP). If disabled, some peer-to-peer and collaborative applications, such as Remote Assistance, may not function.",
      "VietnameseName": "Peer Name Resolution Protocol",
      "VietnameseDescription": "Giải quyết tên trong mạng P2P. Nếu không dùng chia sẻ ngang hàng, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PolicyAgent",
      "DisplayName": "IPsec Policy Agent",
      "Description": "Internet Protocol security (IPsec) supports network-level peer authentication, data origin authentication, data integrity, data confidentiality (encryption), and replay protection.  This service enforces IPsec policies created through the IP Security Policies snap-in or the command-line tool \"netsh ipsec\".  If you stop this service, you may experience network connectivity issues if your policy requires that connections use IPsec.  Also,remote management of Windows Defender Firewall is not available when this service is stopped.",
      "VietnameseName": "IPsec Policy Agent",
      "VietnameseDescription": "Hỗ trợ kết nối bảo mật bằng IPsec. Nếu tắt, kết nối VPN hoặc các dịch vụ mạng bảo mật có thể bị gián đoạn.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "Power",
      "DisplayName": "Power",
      "Description": "Manages power policy and power policy notification delivery.",
      "VietnameseName": "Power",
      "VietnameseDescription": "Quản lý nguồn và trạng thái pin. Là thiết yếu cho laptop, không nên tắt.",
      "Category": "Administration",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "PrintNotify",
      "DisplayName": "Printer Extensions and Notifications",
      "Description": "This service opens custom printer dialog boxes and handles notifications from a remote print server or a printer. If you turn off this service, you won’t be able to see printer extensions or notifications.",
      "VietnameseName": "Printer Extensions and Notifications",
      "VietnameseDescription": "Thông báo và quản lý hàng đợi in. Nếu tắt, người dùng sẽ không thấy thông báo khi in.",
      "Category": "Printing",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "ProfSvc",
      "DisplayName": "User Profile Service",
      "Description": "This service is responsible for loading and unloading user profiles. If this service is stopped or disabled, users will no longer be able to successfully sign in or sign out, apps might have problems getting to users' data, and components registered to receive profile event notifications won't receive them.",
      "VietnameseName": "User Profile",
      "VietnameseDescription": "Chịu trách nhiệm tải và dỡ tải hồ sơ người dùng. Nếu tắt, người dùng sẽ không thể đăng nhập hoặc đăng xuất thành công, ứng dụng có thể gặp vấn đề khi truy cập dữ liệu người dùng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "PushToInstall",
      "DisplayName": "Windows PushToInstall Service",
      "Description": "Provides infrastructure support for the Microsoft Store.  This service is started automatically and if disabled then remote installations will not function properly.",
      "VietnameseName": "Windows PushToInstall",
      "VietnameseDescription": "Cho phép cài đặt ứng dụng từ thiết bị khác qua mạng. Nếu không dùng tính năng này, có thể tắt.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "QWAVE",
      "DisplayName": "Quality Windows Audio Video Experience",
      "Description": "Quality Windows Audio Video Experience (qWave) is a networking platform for Audio Video (AV) streaming applications on IP home networks. qWave enhances AV streaming performance and reliability by ensuring network quality-of-service (QoS) for AV applications. It provides mechanisms for admission control, run time monitoring and enforcement, application feedback, and traffic prioritization.",
      "VietnameseName": "Quality Windows Âm thanh Video Experience",
      "VietnameseDescription": "Cải thiện chất lượng truyền dữ liệu mạng, đặc biệt âm thanh/video. Nếu không truyền media qua mạng, có thể tắt.",
      "Category": "Media",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "RasAuto",
      "DisplayName": "Remote Access Auto Connection Manager",
      "Description": "Creates a connection to a remote network whenever a program references a remote DNS or NetBIOS name or address.",
      "VietnameseName": "Remote Access Auto Connection Manager",
      "VietnameseDescription": "Tự động quay số kết nối mạng khi ứng dụng yêu cầu. Nếu không dùng dial-up, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "RasMan",
      "DisplayName": "Remote Access Connection Manager",
      "Description": "Manages dial-up and virtual private network (VPN) connections from this computer to the Internet or other remote networks. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Remote Access Connection Manager",
      "VietnameseDescription": "Quản lý kết nối VPN và dial-up. Nếu không dùng VPN/dial-up, có thể tắt.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "RemoteAccess",
      "DisplayName": "Routing and Remote Access",
      "Description": "Offers routing services to businesses in local area and wide area network environments.",
      "VietnameseName": "Routing and Remote Access",
      "VietnameseDescription": "Dịch vụ định tuyến và truy cập từ xa (RRAS). Nếu không làm máy chủ truy cập từ xa, có thể tắt.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "RemoteRegistry",
      "DisplayName": "Remote Registry",
      "Description": "Enables remote users to modify registry settings on this computer. If this service is stopped, the registry can be modified only by users on this computer. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Đăng ký Từ xa",
      "VietnameseDescription": "Cho phép chỉnh sửa Registry từ xa. Tắt nếu không quản trị hệ thống từ xa để tăng bảo mật.",
      "Category": "Administration",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "RetailDemo",
      "DisplayName": "Retail Demo Service",
      "Description": "The Retail Demo service controls device activity while the device is in retail demo mode.",
      "VietnameseName": "Retail Demo",
      "VietnameseDescription": "Chế độ trình diễn bán lẻ. Nếu không dùng làm thiết bị demo trưng bày, nên tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "RmSvc",
      "DisplayName": "Radio Management Service",
      "Description": "Radio Management and Airplane Mode Service",
      "VietnameseName": "Radio Quản lý",
      "VietnameseDescription": "Quản lý kết nối từ xa tới máy tính khác (Remote Desktop). Nếu không dùng Remote Desktop hoặc Quick Assist, có thể tắt.",
      "Category": "Administration",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "RpcEptMapper",
      "DisplayName": "RPC Endpoint Mapper",
      "Description": "Resolves RPC interfaces identifiers to transport endpoints. If this service is stopped or disabled, programs using Remote Procedure Call (RPC) services will not function properly.",
      "VietnameseName": "RPC Endpoint Mapper",
      "VietnameseDescription": "Giải quyết định danh giao diện RPC thành các điểm cuối vận chuyển. Nếu tắt, các chương trình sử dụng dịch vụ Remote Procedure Call (RPC) sẽ không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "RpcLocator",
      "DisplayName": "Remote Procedure Call (RPC) Locator",
      "Description": "In Windows 2003 and earlier versions of Windows, the Remote Procedure Call (RPC) Locator service manages the RPC name service database. In Windows Vista and later versions of Windows, this service does not provide any functionality and is present for application compatibility.",
      "VietnameseName": "Remote Procedure Call (RPC) Locator",
      "VietnameseDescription": "Định vị dịch vụ RPC cũ (Remote Procedure Call). Ít dùng trong hệ thống hiện đại, có thể tắt nếu không dùng phần mềm cũ.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "RpcSs",
      "DisplayName": "Remote Procedure Call (RPC)",
      "Description": "The RPCSS service is the Service Control Manager for COM and DCOM servers. It performs object activations requests, object exporter resolutions and distributed garbage collection for COM and DCOM servers. If this service is stopped or disabled, programs using COM or DCOM will not function properly. It is strongly recommended that you have the RPCSS service running.",
      "VietnameseName": "Remote Procedure Call (RPC)",
      "VietnameseDescription": "Dịch vụ lõi cho hệ thống gọi thủ tục từ xa (RPC). Hệ thống phụ thuộc, tuyệt đối không được tắt.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "SamSs",
      "DisplayName": "Security Accounts Manager",
      "Description": "The startup of this service signals other services that the Security Accounts Manager (SAM) is ready to accept requests.  Disabling this service will prevent other services in the system from being notified when the SAM is ready, which may in turn cause those services to fail to start correctly. This service should not be disabled.",
      "VietnameseName": "Bảo mật Accounts Manager",
      "VietnameseDescription": "Quản lý tài khoản bảo mật (Security Accounts Manager). Thiết yếu để đăng nhập hệ thống, không được tắt.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "SCardSvr",
      "DisplayName": "Smart Card",
      "Description": "Manages access to smart cards read by this computer. If this service is stopped, this computer will be unable to read smart cards. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Smart Card",
      "VietnameseDescription": "Hỗ trợ đăng nhập và xác thực người dùng bằng thẻ thông minh. Có thể tắt nếu không sử dụng thiết bị này.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "ScDeviceEnum",
      "DisplayName": "Smart Card Device Enumeration Service",
      "Description": "Creates software device nodes for all smart card readers accessible to a given session. If this service is disabled, WinRT APIs will not be able to enumerate smart card readers.",
      "VietnameseName": "Smart Card Device Enumeration",
      "VietnameseDescription": "Liệt kê thiết bị thẻ thông minh. Nếu không sử dụng smartcard, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "Schedule",
      "DisplayName": "Task Scheduler",
      "Description": "Enables a user to configure and schedule automated tasks on this computer. The service also hosts multiple Windows system-critical tasks. If this service is stopped or disabled, these tasks will not be run at their scheduled times. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Task Scheduler",
      "VietnameseDescription": "Cho phép người dùng cấu hình và lên lịch các tác vụ tự động trên máy tính này. Dịch vụ cũng lưu trữ nhiều tác vụ quan trọng của hệ thống Windows. Nếu tắt, các tác vụ này sẽ không chạy theo lịch trình.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "SCPolicySvc",
      "DisplayName": "Smart Card Removal Policy",
      "Description": "Allows the system to be configured to lock the user desktop upon smart card removal.",
      "VietnameseName": "Smart Card Removal Policy",
      "VietnameseDescription": "Quản lý chính sách smartcard. Nếu không dùng xác thực bằng thẻ thông minh, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SDRSVC",
      "DisplayName": "Windows Backup",
      "Description": "Provides Windows Backup and Restore capabilities.",
      "VietnameseName": "Windows Backup",
      "VietnameseDescription": "Cung cấp khả năng sao lưu và khôi phục Windows. Hỗ trợ tạo và quản lý bản sao lưu hệ thống. Nếu tắt, tính năng sao lưu và khôi phục sẽ không hoạt động.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "seclogon",
      "DisplayName": "Secondary Logon",
      "Description": "Enables starting processes under alternate credentials. If this service is stopped, this type of logon access will be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Secondary Logon",
      "VietnameseDescription": "Lưu trữ và quản lý thông tin đăng nhập để xác thực người dùng và ứng dụng. Nếu tắt, quá trình xác thực có thể gặp lỗi.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "SEMgrSvc",
      "DisplayName": "Payments and NFC/SE Manager",
      "Description": "Manages payments and Near Field Communication (NFC) based secure elements.",
      "VietnameseName": "Payments and NFC/SE Manager",
      "VietnameseDescription": "Quản lý thiết bị bảo mật như TPM và xác thực sinh trắc học. Nếu không dùng Windows Hello hoặc TPM, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SENS",
      "DisplayName": "System Event Notification Service",
      "Description": "Monitors system events and notifies subscribers to COM+ Event System of these events.",
      "VietnameseName": "System Event Notification",
      "VietnameseDescription": "Giám sát sự kiện hệ thống và thông báo cho các ứng dụng đăng ký. Hỗ trợ thông báo về thay đổi mạng, đăng nhập/đăng xuất. Nếu tắt, các ứng dụng có thể không nhận được thông báo sự kiện hệ thống.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "Sense",
      "DisplayName": "Sense",
      "Description": "",
      "VietnameseName": "Sense",
      "VietnameseDescription": "Phát hiện và phản hồi các mối đe dọa bảo mật. Nếu có phần mềm diệt virus thay thế, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SensorDataService",
      "DisplayName": "Sensor Data Service",
      "Description": "Delivers data from a variety of sensors",
      "VietnameseName": "Sensor Data",
      "VietnameseDescription": "Cung cấp dữ liệu từ nhiều loại cảm biến khác nhau. Hỗ trợ ứng dụng cần thông tin cảm biến. Nếu tắt, ứng dụng có thể không nhận được dữ liệu cảm biến.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SensorService",
      "DisplayName": "Sensor Service",
      "Description": "A service for sensors that manages different sensors' functionality. Manages Simple Device Orientation (SDO) and History for sensors. Loads the SDO sensor that reports device orientation changes.  If this service is stopped or disabled, the SDO sensor will not be loaded and so auto-rotation will not occur. History collection from Sensors will also be stopped.",
      "VietnameseName": "Sensor",
      "VietnameseDescription": "Quản lý chức năng của các cảm biến khác nhau. Hỗ trợ xoay màn hình tự động và lưu trữ lịch sử cảm biến. Nếu tắt, tính năng xoay màn hình tự động sẽ không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SensrSvc",
      "DisplayName": "Sensor Monitoring Service",
      "Description": "Monitors various sensors in order to expose data and adapt to system and user state.  If this service is stopped or disabled, the display brightness will not adapt to lighting conditions. Stopping this service may affect other system functionality and features as well.",
      "VietnameseName": "Sensor Monitoring",
      "VietnameseDescription": "Giám sát các cảm biến để điều chỉnh độ sáng màn hình theo điều kiện ánh sáng. Hỗ trợ thích ứng hệ thống với trạng thái người dùng. Nếu tắt, độ sáng màn hình sẽ không tự động điều chỉnh.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SessionEnv",
      "DisplayName": "Remote Desktop Configuration",
      "Description": "Remote Desktop Configuration service (RDCS) is responsible for all Remote Desktop Services and Remote Desktop related configuration and session maintenance activities that require SYSTEM context. These include per-session temporary folders, RD themes, and RD certificates.",
      "VietnameseName": "Remote Desktop Configuration",
      "VietnameseDescription": "Quản lý cấu hình và phiên làm việc của Remote Desktop Services. Hỗ trợ thư mục tạm, chủ đề và chứng chỉ RD. Nếu tắt, Remote Desktop có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SharedAccess",
      "DisplayName": "Internet Connection Sharing (ICS)",
      "Description": "Provides network address translation, addressing, name resolution and/or intrusion prevention services for a home or small office network.",
      "VietnameseName": "Internet Connection Sharing (ICS)",
      "VietnameseDescription": "Cung cấp tính năng chia sẻ kết nối Internet (ICS). Nếu không chia sẻ mạng, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "SharedRealitySvc",
      "DisplayName": "Spatial Data Service",
      "Description": "This service is used for Spatial Perception scenarios",
      "VietnameseName": "Spatial Data",
      "VietnameseDescription": "Hỗ trợ các kịch bản nhận thức không gian. Cần thiết cho ứng dụng thực tế ảo và thực tế tăng cường. Nếu tắt, ứng dụng AR/VR có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "ShellHWDetection",
      "DisplayName": "Shell Hardware Detection",
      "Description": "Provides notifications for AutoPlay hardware events.",
      "VietnameseName": "Shell Hardware Detection",
      "VietnameseDescription": "Phát hiện và xử lý sự kiện phần cứng như ổ USB, CD/DVD. Nếu tắt, Windows có thể không phản hồi khi cắm thiết bị.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "shpamsvc",
      "DisplayName": "Shared PC Account Manager",
      "Description": "Manages profiles and accounts on a SharedPC configured device",
      "VietnameseName": "Shared PC Account Manager",
      "VietnameseDescription": "Quản lý hồ sơ và tài khoản trên thiết bị được cấu hình SharedPC. Hỗ trợ môi trường máy tính dùng chung. Nếu tắt, quản lý tài khoản dùng chung có thể không hoạt động.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "smphost",
      "DisplayName": "Microsoft Storage Spaces SMP",
      "Description": "Host service for the Microsoft Storage Spaces management provider. If this service is stopped or disabled, Storage Spaces cannot be managed.",
      "VietnameseName": "Microsoft Storage Spaces SMP",
      "VietnameseDescription": "Dịch vụ quản lý Storage Spaces cho ổ cứng ảo và RAID. Hỗ trợ tạo và quản lý các ổ đĩa ảo. Nếu tắt, không thể quản lý Storage Spaces.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SmsRouter",
      "DisplayName": "Microsoft Windows SMS Router Service.",
      "Description": "Routes messages based on rules to appropriate clients.",
      "VietnameseName": "Microsoft Windows SMS Router .",
      "VietnameseDescription": "Định tuyến tin nhắn văn bản từ modem di động. Nếu không dùng thiết bị hỗ trợ SIM, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SNMPTrap",
      "DisplayName": "SNMP Trap",
      "Description": "Receives trap messages generated by local or remote Simple Network Management Protocol (SNMP) agents and forwards the messages to SNMP management programs running on this computer. If this service is stopped, SNMP-based programs on this computer will not receive SNMP trap messages. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "SNMP Trap",
      "VietnameseDescription": "Nhận thông báo từ các thiết bị SNMP. Nếu không quản lý mạng SNMP, có thể tắt.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "spectrum",
      "DisplayName": "Windows Perception Service",
      "Description": "Enables spatial perception, spatial input, and holographic rendering.",
      "VietnameseName": "Windows Perception",
      "VietnameseDescription": "Hỗ trợ radio software-defined (SDR). Nếu không dùng thiết bị SDR, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "Spooler",
      "DisplayName": "Print Spooler",
      "Description": "This service spools print jobs and handles interaction with the printer.  If you turn off this service, you won’t be able to print or see your printers.",
      "VietnameseName": "Dịch vụ in",
      "VietnameseDescription": "Giống PrintSpooler – quản lý in ấn. Nếu không in, có thể tắt.",
      "Category": "Printing",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "sppsvc",
      "DisplayName": "Software Protection",
      "Description": "Enables the download, installation and enforcement of digital licenses for Windows and Windows applications. If the service is disabled, the operating system and licensed applications may run in a notification mode. It is strongly recommended that you not disable the Software Protection service.",
      "VietnameseName": "Software Protection",
      "VietnameseDescription": "Quản lý giấy phép kỹ thuật số cho Windows và ứng dụng. Tải xuống, cài đặt và thực thi các giấy phép. Nếu tắt, hệ thống có thể chạy ở chế độ thông báo.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "SSDPSRV",
      "DisplayName": "SSDP Discovery",
      "Description": "Discovers networked devices and services that use the SSDP discovery protocol, such as UPnP devices. Also announces SSDP devices and services running on the local computer. If this service is stopped, SSDP-based devices will not be discovered. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "SSDP Discovery",
      "VietnameseDescription": "Phát hiện thiết bị UPnP như máy in mạng. Nếu không chia sẻ thiết bị qua mạng, có thể tắt.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "ssh-agent",
      "DisplayName": "OpenSSH Authentication Agent",
      "Description": "Agent to hold private keys used for public key authentication.",
      "VietnameseName": "OpenSSH Authentication Agent",
      "VietnameseDescription": "Quản lý khoá SSH cho xác thực từ xa. Nếu không dùng SSH trong Windows, có thể tắt.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "SstpSvc",
      "DisplayName": "Secure Socket Tunneling Protocol Service",
      "Description": "Provides support for the Secure Socket Tunneling Protocol (SSTP) to connect to remote computers using VPN. If this service is disabled, users will not be able to use SSTP to access remote servers.",
      "VietnameseName": "Secure Socket Tunneling Protocol",
      "VietnameseDescription": "Hỗ trợ VPN dùng giao thức SSTP. Nếu không dùng VPN SSTP, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "StateRepository",
      "DisplayName": "State Repository Service",
      "Description": "Provides required infrastructure support for the application model.",
      "VietnameseName": "State Repository",
      "VietnameseDescription": "Cung cấp hạ tầng hỗ trợ cho mô hình ứng dụng. Lưu trữ trạng thái và dữ liệu ứng dụng. Nếu tắt, các ứng dụng có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "StiSvc",
      "DisplayName": "Windows Image Acquisition (WIA)",
      "Description": "Provides image acquisition services for scanners and cameras",
      "VietnameseName": "Windows Image Acquisition (WIA)",
      "VietnameseDescription": "Cung cấp dịch vụ thu thập hình ảnh cho máy quét và máy ảnh. Hỗ trợ kết nối và sử dụng thiết bị hình ảnh. Nếu tắt, máy quét và máy ảnh có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "StorSvc",
      "DisplayName": "Storage Service",
      "Description": "Provides enabling services for storage settings and external storage expansion",
      "VietnameseName": "Storage",
      "VietnameseDescription": "Quản lý lưu trữ và cấu hình thiết bị lưu trữ. Nếu tắt, việc nhận diện ổ cứng hoặc USB có thể gặp vấn đề.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "svsvc",
      "DisplayName": "Spot Verifier",
      "Description": "Verifies potential file system corruptions.",
      "VietnameseName": "Spot Verifier",
      "VietnameseDescription": "Kiểm tra và xác minh lỗi hệ thống tệp tiềm ẩn. Hỗ trợ phát hiện và sửa chữa lỗi ổ đĩa. Nếu tắt, có thể không phát hiện được lỗi hệ thống tệp.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "swprv",
      "DisplayName": "Microsoft Software Shadow Copy Provider",
      "Description": "Manages software-based volume shadow copies taken by the Volume Shadow Copy service. If this service is stopped, software-based volume shadow copies cannot be managed. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Microsoft Software Shadow Copy Provider",
      "VietnameseDescription": "Quản lý bản sao shadow dựa trên phần mềm cho ổ đĩa. Hỗ trợ sao lưu và khôi phục dữ liệu. Nếu tắt, không thể tạo hoặc quản lý bản sao shadow.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "SysMain",
      "DisplayName": "SysMain",
      "Description": "Maintains and improves system performance over time.",
      "VietnameseName": "SysMain",
      "VietnameseDescription": "Phân tích hành vi sử dụng và tối ưu hiệu suất bằng cách tải trước dữ liệu (Superfetch). Nếu gây hao tài nguyên, có thể tắt.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "SystemEventsBroker",
      "DisplayName": "System Events Broker",
      "Description": "Coordinates execution of background work for WinRT application. If this service is stopped or disabled, then background work might not be triggered.",
      "VietnameseName": "System Events Broker",
      "VietnameseDescription": "Điều phối thực thi tác vụ nền cho ứng dụng WinRT. Hỗ trợ các ứng dụng hiện đại chạy trong nền. Nếu tắt, các tác vụ nền có thể không được kích hoạt.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "TapiSrv",
      "DisplayName": "Telephony",
      "Description": "Provides Telephony API (TAPI) support for programs that control telephony devices on the local computer and, through the LAN, on servers that are also running the service.",
      "VietnameseName": "Telephony",
      "VietnameseDescription": "Cung cấp dịch vụ điện thoại cho các ứng dụng (TAPI). Nếu không dùng phần mềm gọi điện, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "TermService",
      "DisplayName": "Remote Desktop Services",
      "Description": "Allows users to connect interactively to a remote computer. Remote Desktop and Remote Desktop Session Host Server depend on this service.  To prevent remote use of this computer, clear the checkboxes on the Remote tab of the System properties control panel item.",
      "VietnameseName": "Remote Desktop s",
      "VietnameseDescription": "Cho phép kết nối từ xa qua Remote Desktop. Nếu không sử dụng Remote Desktop, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "TextInputManagementService",
      "DisplayName": "Text Input Management Service",
      "Description": "Enables text input, expressive input, touch keyboard, handwriting, and IMEs.",
      "VietnameseName": "Text Input Quản lý",
      "VietnameseDescription": "Hỗ trợ nhập liệu văn bản, bàn phím cảm ứng, viết tay và IME. Cần thiết cho các thiết bị cảm ứng. Nếu tắt, bàn phím cảm ứng và nhập liệu có thể không hoạt động.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": true
    },
    {
      "Name": "Themes",
      "DisplayName": "Themes",
      "Description": "Provides user experience theme management.",
      "VietnameseName": "Themes",
      "VietnameseDescription": "Quản lý giao diện và chủ đề hình ảnh. Nếu tắt, Windows sẽ dùng giao diện cổ điển.",
      "Category": "Administration",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "TieringEngineService",
      "DisplayName": "Storage Tiers Management",
      "Description": "Optimizes the placement of data in storage tiers on all tiered storage spaces in the system.",
      "VietnameseName": "Storage Tiers Quản lý",
      "VietnameseDescription": "Tối ưu hóa vị trí dữ liệu trong các tầng lưu trữ trên tất cả không gian lưu trữ phân tầng. Hỗ trợ quản lý hiệu suất lưu trữ. Nếu tắt, hiệu suất lưu trữ có thể bị ảnh hưởng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "TimeBrokerSvc",
      "DisplayName": "Time Broker",
      "Description": "Coordinates execution of background work for WinRT application. If this service is stopped or disabled, then background work might not be triggered.",
      "VietnameseName": "Thời gian Broker",
      "VietnameseDescription": "Quản lý tác vụ nền theo thời gian cho ứng dụng UWP. Nếu không dùng ứng dụng Store, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "TokenBroker",
      "DisplayName": "Web Account Manager",
      "Description": "This service is used by Web Account Manager to provide single-sign-on to apps and services.",
      "VietnameseName": "Web Account Manager",
      "VietnameseDescription": "Hỗ trợ xác thực tài khoản Microsoft và ứng dụng Store. Nếu không dùng tài khoản Microsoft, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "TrkWks",
      "DisplayName": "Distributed Link Tracking Client",
      "Description": "Maintains links between NTFS files within a computer or across computers in a network.",
      "VietnameseName": "Distributed Link Tracking Client",
      "VietnameseDescription": "Duy trì liên kết giữa các tệp NTFS trong máy tính hoặc qua mạng. Hỗ trợ theo dõi thay đổi tệp và liên kết. Nếu tắt, có thể mất liên kết tệp khi di chuyển.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "TroubleshootingSvc",
      "DisplayName": "Recommended Troubleshooting Service",
      "Description": "Enables automatic mitigation for known problems by applying recommended troubleshooting. If stopped, your device will not get recommended troubleshooting for problems on your device.",
      "VietnameseName": "Recommended Troubleshooting",
      "VietnameseDescription": "Cho phép tự động khắc phục các vấn đề đã biết bằng cách áp dụng khắc phục sự cố được khuyến nghị. Nếu tắt, thiết bị sẽ không nhận được khắc phục sự cố được khuyến nghị.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "TrustedInstaller",
      "DisplayName": "Windows Modules Installer",
      "Description": "Enables installation, modification, and removal of Windows updates and optional components. If this service is disabled, install or uninstall of Windows updates might fail for this computer.",
      "VietnameseName": "Windows Modules Installer",
      "VietnameseDescription": "Hỗ trợ kiểm tra, tải và cài đặt các bản cập nhật cho Windows. Nếu tắt, hệ điều hành sẽ không được cập nhật bảo mật hoặc tính năng mới.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "tzautoupdate",
      "DisplayName": "Auto Time Zone Updater",
      "Description": "Automatically sets the system time zone.",
      "VietnameseName": "Auto Thời gian Zone Cập nhậtr",
      "VietnameseDescription": "Tự động cập nhật múi giờ hệ thống dựa trên vị trí địa lý. Hỗ trợ đồng bộ thời gian chính xác. Nếu tắt, múi giờ có thể không được cập nhật tự động.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "UevAgentService",
      "DisplayName": "User Experience Virtualization Service",
      "Description": "Provides support for application and OS settings roaming",
      "VietnameseName": "User Experience Virtualization",
      "VietnameseDescription": "Quản lý đồng bộ trải nghiệm người dùng qua nhiều thiết bị. Nếu không dùng tính năng này, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "uhssvc",
      "DisplayName": "Microsoft Update Health Service",
      "Description": "Maintains Update Health",
      "VietnameseName": "Microsoft Cập nhật Health",
      "VietnameseDescription": "Hỗ trợ kiểm tra, tải và cài đặt các bản cập nhật cho Windows. Nếu tắt, hệ điều hành sẽ không được cập nhật bảo mật hoặc tính năng mới.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "UltraViewService",
      "DisplayName": "UltraViewer Service",
      "Description": "UltraViewer service",
      "VietnameseName": "UltraViewer",
      "VietnameseDescription": "Dịch vụ hỗ trợ phần mềm điều khiển từ xa UltraViewer. Hỗ trợ kết nối và điều khiển máy tính từ xa. Nếu tắt, UltraViewer có thể không hoạt động.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "UmRdpService",
      "DisplayName": "Remote Desktop Services UserMode Port Redirector",
      "Description": "Allows the redirection of Printers/Drives/Ports for RDP connections",
      "VietnameseName": "Remote Desktop s UserMode Port Redirector",
      "VietnameseDescription": "Hỗ trợ kết nối máy tính từ xa thông qua RemoteFX. Có thể tắt nếu không dùng Remote Desktop.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "upnphost",
      "DisplayName": "UPnP Device Host",
      "Description": "Allows UPnP devices to be hosted on this computer. If this service is stopped, any hosted UPnP devices will stop functioning and no additional hosted devices can be added. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "UPnP Device Host",
      "VietnameseDescription": "Hỗ trợ các thiết bị UPnP như camera IP hoặc máy in. Nếu không chia sẻ thiết bị, có thể tắt.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "UserManager",
      "DisplayName": "User Manager",
      "Description": "User Manager provides the runtime components required for multi-user interaction.  If this service is stopped, some applications may not operate correctly.",
      "VietnameseName": "User Manager",
      "VietnameseDescription": "Quản lý thông tin người dùng đang đăng nhập. Là dịch vụ hệ thống cần thiết.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "UsoSvc",
      "DisplayName": "Update Orchestrator Service",
      "Description": "Manages Windows Updates. If stopped, your devices will not be able to download and install the latest updates.",
      "VietnameseName": "Cập nhật Orchestrator",
      "VietnameseDescription": "Dịch vụ cập nhật Windows. Không nên tắt để đảm bảo hệ thống nhận cập nhật.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "VacSvc",
      "DisplayName": "Volumetric Audio Compositor Service",
      "Description": "Hosts spatial analysis for Mixed Reality audio simulation.",
      "VietnameseName": "Volumetric Âm thanh Compositor",
      "VietnameseDescription": "Xử lý các chức năng âm thanh của hệ thống như phát nhạc, âm báo. Nếu tắt, hệ thống có thể không phát được âm thanh.",
      "Category": "Media",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "VaultSvc",
      "DisplayName": "Credential Manager",
      "Description": "Provides secure storage and retrieval of credentials to users, applications and security service packages.",
      "VietnameseName": "Credential Manager",
      "VietnameseDescription": "Quản lý lưu trữ thông tin xác thực. Nếu tắt, có thể ảnh hưởng đăng nhập tự động hoặc ứng dụng cần lưu mật khẩu.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "vds",
      "DisplayName": "Virtual Disk",
      "Description": "Provides management services for disks, volumes, file systems, and storage arrays.",
      "VietnameseName": "Virtual Disk",
      "VietnameseDescription": "Quản lý dịch vụ ổ đĩa (Volume Shadow Copy, disk partition). Nếu không dùng quản trị nâng cao ổ đĩa, có thể tắt.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "vmicguestinterface",
      "DisplayName": "Hyper-V Guest Service Interface",
      "Description": "Provides an interface for the Hyper-V host to interact with specific services running inside the virtual machine.",
      "VietnameseName": "Hyper-V Guest  Interface",
      "VietnameseDescription": "Cung cấp giao diện cho Hyper-V host tương tác với các dịch vụ cụ thể chạy trong máy ảo. Hỗ trợ quản lý máy ảo. Nếu tắt, Hyper-V có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmicheartbeat",
      "DisplayName": "Hyper-V Heartbeat Service",
      "Description": "Monitors the state of this virtual machine by reporting a heartbeat at regular intervals. This service helps you identify running virtual machines that have stopped responding.",
      "VietnameseName": "Hyper-V Heartbeat",
      "VietnameseDescription": "Giám sát trạng thái máy ảo bằng cách báo cáo heartbeat theo chu kỳ. Hỗ trợ phát hiện máy ảo không phản hồi. Nếu tắt, không thể giám sát trạng thái máy ảo.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmickvpexchange",
      "DisplayName": "Hyper-V Data Exchange Service",
      "Description": "Provides a mechanism to exchange data between the virtual machine and the operating system running on the physical computer.",
      "VietnameseName": "Hyper-V Data Exchange",
      "VietnameseDescription": "Trao đổi thông tin giữa máy ảo và máy chủ Hyper-V. Nếu không chạy máy ảo, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmicrdv",
      "DisplayName": "Hyper-V Remote Desktop Virtualization Service",
      "Description": "Provides a platform for communication between the virtual machine and the operating system running on the physical computer.",
      "VietnameseName": "Hyper-V Remote Desktop Virtualization",
      "VietnameseDescription": "Cung cấp nền tảng giao tiếp giữa máy ảo và hệ điều hành chạy trên máy tính vật lý. Hỗ trợ Remote Desktop cho máy ảo. Nếu tắt, Remote Desktop cho máy ảo có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmicshutdown",
      "DisplayName": "Hyper-V Guest Shutdown Service",
      "Description": "Provides a mechanism to shut down the operating system of this virtual machine from the management interfaces on the physical computer.",
      "VietnameseName": "Hyper-V Guest Shutdown",
      "VietnameseDescription": "Cung cấp cơ chế tắt hệ điều hành của máy ảo từ giao diện quản lý trên máy tính vật lý. Hỗ trợ quản lý máy ảo từ xa. Nếu tắt, không thể tắt máy ảo từ giao diện quản lý.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmictimesync",
      "DisplayName": "Hyper-V Time Synchronization Service",
      "Description": "Synchronizes the system time of this virtual machine with the system time of the physical computer.",
      "VietnameseName": "Hyper-V Thời gian Synchronization",
      "VietnameseDescription": "Đồng bộ thời gian hệ thống của máy ảo với thời gian hệ thống của máy tính vật lý. Hỗ trợ đồng bộ thời gian chính xác. Nếu tắt, thời gian máy ảo có thể không đồng bộ.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "vmicvmsession",
      "DisplayName": "Hyper-V PowerShell Direct Service",
      "Description": "Provides a mechanism to manage virtual machine with PowerShell via VM session without a virtual network.",
      "VietnameseName": "Hyper-V PowerShell Direct",
      "VietnameseDescription": "Cung cấp cơ chế quản lý máy ảo bằng PowerShell thông qua phiên VM mà không cần mạng ảo. Hỗ trợ quản lý máy ảo trực tiếp. Nếu tắt, PowerShell Direct có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "vmicvss",
      "DisplayName": "Hyper-V Volume Shadow Copy Requestor",
      "Description": "Coordinates the communications that are required to use Volume Shadow Copy Service to back up applications and data on this virtual machine from the operating system on the physical computer.",
      "VietnameseName": "Hyper-V Volume Shadow Copy Requestor",
      "VietnameseDescription": "Điều phối giao tiếp cần thiết để sử dụng Volume Shadow Copy Service để sao lưu ứng dụng và dữ liệu trên máy ảo. Hỗ trợ sao lưu máy ảo. Nếu tắt, sao lưu máy ảo có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "VSS",
      "DisplayName": "Volume Shadow Copy",
      "Description": "Manages and implements Volume Shadow Copies used for backup and other purposes. If this service is stopped, shadow copies will be unavailable for backup and the backup may fail. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Volume Shadow Copy",
      "VietnameseDescription": "Quản lý và thực hiện Volume Shadow Copies được sử dụng cho sao lưu và các mục đích khác. Hỗ trợ tạo bản sao shadow cho ổ đĩa. Nếu tắt, bản sao shadow sẽ không khả dụng cho sao lưu.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "W32Time",
      "DisplayName": "Windows Time",
      "Description": "Maintains date and time synchronization on all clients and servers in the network. If this service is stopped, date and time synchronization will be unavailable. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Thời gian Windows",
      "VietnameseDescription": "Đồng bộ thời gian với máy chủ Internet. Nếu tắt, đồng hồ hệ thống có thể lệch thời gian.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "WaaSMedicSvc",
      "DisplayName": "WaaSMedicSvc",
      "Description": "",
      "VietnameseName": "WaaSMedicSvc",
      "VietnameseDescription": "Dịch vụ khắc phục sự cố Windows Update. Hỗ trợ sửa chữa các vấn đề liên quan đến cập nhật hệ thống. Nếu tắt, có thể không khắc phục được lỗi cập nhật.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WalletService",
      "DisplayName": "WalletService",
      "Description": "Hosts objects used by clients of the wallet",
      "VietnameseName": "Wallet",
      "VietnameseDescription": "Lưu trữ thông tin thanh toán và thẻ tín dụng. Hỗ trợ ứng dụng cần thông tin thanh toán. Nếu tắt, ứng dụng thanh toán có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WarpJITSvc",
      "DisplayName": "Warp JIT Service",
      "Description": "Enables JIT compilation support in d3d10warp.dll for processes in which code generation is disabled.",
      "VietnameseName": "Warp JIT",
      "VietnameseDescription": "Hỗ trợ biên dịch JIT trong d3d10warp.dll cho các quy trình bị vô hiệu hóa tạo mã. Hỗ trợ tối ưu hóa đồ họa. Nếu tắt, hiệu suất đồ họa có thể bị ảnh hưởng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "wbengine",
      "DisplayName": "Block Level Backup Engine Service",
      "Description": "The WBENGINE service is used by Windows Backup to perform backup and recovery operations. If this service is stopped by a user, it may cause the currently running backup or recovery operation to fail. Disabling this service may disable backup and recovery operations using Windows Backup on this computer.",
      "VietnameseName": "Block Level Backup Engine",
      "VietnameseDescription": "Dịch vụ sao lưu cấp độ khối được sử dụng bởi Windows Backup để thực hiện sao lưu và khôi phục. Hỗ trợ sao lưu toàn bộ hệ thống. Nếu tắt, sao lưu và khôi phục có thể thất bại.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WbioSrvc",
      "DisplayName": "Windows Biometric Service",
      "Description": "The Windows biometric service gives client applications the ability to capture, compare, manipulate, and store biometric data without gaining direct access to any biometric hardware or samples. The service is hosted in a privileged SVCHOST process.",
      "VietnameseName": "Windows Biometric",
      "VietnameseDescription": "Cung cấp khả năng thu thập, so sánh, xử lý và lưu trữ dữ liệu sinh trắc học cho ứng dụng. Hỗ trợ vân tay, khuôn mặt. Nếu tắt, tính năng sinh trắc học sẽ không hoạt động.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "Wcmsvc",
      "DisplayName": "Windows Connection Manager",
      "Description": "Makes automatic connect/disconnect decisions based on the network connectivity options currently available to the PC and enables management of network connectivity based on Group Policy settings.",
      "VietnameseName": "Windows Connection Manager",
      "VietnameseDescription": "Đưa ra quyết định kết nối/ngắt kết nối tự động dựa trên các tùy chọn kết nối mạng hiện có. Hỗ trợ quản lý kết nối mạng theo Group Policy. Nếu tắt, kết nối mạng có thể không hoạt động đúng.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "wcncsvc",
      "DisplayName": "Windows Connect Now - Config Registrar",
      "Description": "WCNCSVC hosts the Windows Connect Now Configuration which is Microsoft's Implementation of Wireless Protected Setup (WPS) protocol. This is used to configure Wireless LAN settings for an Access Point (AP) or a Wireless Device. The service is started programmatically as needed.",
      "VietnameseName": "Windows Connect Now - Config Registrar",
      "VietnameseDescription": "Hỗ trợ cấu hình Wireless Protected Setup (WPS) cho điểm truy cập hoặc thiết bị không dây. Hỗ trợ thiết lập mạng Wi-Fi tự động. Nếu tắt, cấu hình Wi-Fi WPS có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WdiServiceHost",
      "DisplayName": "Diagnostic Service Host",
      "Description": "The Diagnostic Service Host is used by the Diagnostic Policy Service to host diagnostics that need to run in a Local Service context.  If this service is stopped, any diagnostics that depend on it will no longer function.",
      "VietnameseName": "Diagnostic  Host",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WdiSystemHost",
      "DisplayName": "Diagnostic System Host",
      "Description": "The Diagnostic System Host is used by the Diagnostic Policy Service to host diagnostics that need to run in a Local System context.  If this service is stopped, any diagnostics that depend on it will no longer function.",
      "VietnameseName": "Diagnostic System Host",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "Administration",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "WebClient",
      "DisplayName": "WebClient",
      "Description": "Enables Windows-based programs to create, access, and modify Internet-based files. If this service is stopped, these functions will not be available. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "WebClient",
      "VietnameseDescription": "Cho phép chương trình Windows tạo, truy cập và sửa đổi tệp dựa trên Internet. Hỗ trợ WebDAV và tệp đám mây. Nếu tắt, các chức năng này sẽ không khả dụng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "webthreatdefsvc",
      "DisplayName": "Web Threat Defense Service",
      "Description": "Web Threat Defense Endpoint Service helps protect your computer by identifying unauthorized entities attempting to gain access to user credentials",
      "VietnameseName": "Web Threat Defense",
      "VietnameseDescription": "Lưu trữ và quản lý thông tin đăng nhập để xác thực người dùng và ứng dụng. Nếu tắt, quá trình xác thực có thể gặp lỗi.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "Wecsvc",
      "DisplayName": "Windows Event Collector",
      "Description": "This service manages persistent subscriptions to events from remote sources that support WS-Management protocol. This includes Windows Vista event logs, hardware and IPMI-enabled event sources. The service stores forwarded events in a local Event Log. If this service is stopped or disabled event subscriptions cannot be created and forwarded events cannot be accepted.",
      "VietnameseName": "Windows Event Collector",
      "VietnameseDescription": "Ghi lại sự kiện của hệ thống và phần mềm để hỗ trợ chuẩn đoán lỗi. Nếu tắt, việc kiểm tra lỗi sẽ gặp khó khăn.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WEPHOSTSVC",
      "DisplayName": "Windows Encryption Provider Host Service",
      "Description": "Windows Encryption Provider Host Service brokers encryption related functionalities from 3rd Party Encryption Providers to processes that need to evaluate and apply EAS policies. Stopping this will compromise EAS compliancy checks that have been established by the connected Mail Accounts",
      "VietnameseName": "Windows Encryption Provider Host",
      "VietnameseDescription": "Môi giới chức năng mã hóa từ nhà cung cấp mã hóa bên thứ 3 cho các quy trình cần đánh giá và áp dụng chính sách EAS. Hỗ trợ bảo mật email doanh nghiệp. Nếu tắt, kiểm tra tuân thủ EAS có thể bị ảnh hưởng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "wercplsupport",
      "DisplayName": "Problem Reports Control Panel Support",
      "Description": "This service provides support for viewing, sending and deletion of system-level problem reports for the Problem Reports control panel.",
      "VietnameseName": "Problem Reports Control Panel Support",
      "VietnameseDescription": "Cung cấp hỗ trợ xem, gửi và xóa báo cáo sự cố cấp hệ thống cho bảng điều khiển Problem Reports. Hỗ trợ chẩn đoán lỗi hệ thống. Nếu tắt, báo cáo sự cố có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WerSvc",
      "DisplayName": "Windows Error Reporting Service",
      "Description": "Allows errors to be reported when programs stop working or responding and allows existing solutions to be delivered. Also allows logs to be generated for diagnostic and repair services. If this service is stopped, error reporting might not work correctly and results of diagnostic services and repairs might not be displayed.",
      "VietnameseName": "Windows Error Reporting",
      "VietnameseDescription": "Gửi dữ liệu chẩn đoán và sử dụng hệ thống về Microsoft. Có thể tắt nếu không muốn chia sẻ dữ liệu này.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WFDSConMgrSvc",
      "DisplayName": "Wi-Fi Direct Services Connection Manager Service",
      "Description": "Manages connections to wireless services, including wireless display and docking.",
      "VietnameseName": "Wi-Fi Direct s Connection Manager",
      "VietnameseDescription": "Quản lý kết nối đến các dịch vụ không dây, bao gồm hiển thị không dây và docking. Hỗ trợ kết nối thiết bị không dây trực tiếp. Nếu tắt, kết nối Wi-Fi Direct có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "WiaRpc",
      "DisplayName": "Still Image Acquisition Events",
      "Description": "Launches applications associated with still image acquisition events.",
      "VietnameseName": "Still Image Acquisition Events",
      "VietnameseDescription": "Khởi chạy ứng dụng liên quan đến sự kiện thu thập hình ảnh tĩnh. Hỗ trợ máy quét và máy ảnh. Nếu tắt, ứng dụng xử lý hình ảnh có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WinHttpAutoProxySvc",
      "DisplayName": "WinHTTP Web Proxy Auto-Discovery Service",
      "Description": "WinHTTP implements the client HTTP stack and provides developers with a Win32 API and COM Automation component for sending HTTP requests and receiving responses. In addition, WinHTTP provides support for auto-discovering a proxy configuration via its implementation of the Web Proxy Auto-Discovery (WPAD) protocol.",
      "VietnameseName": "WinHTTP Web Proxy Auto-Discovery",
      "VietnameseDescription": "Thực hiện HTTP client stack và cung cấp API cho việc gửi HTTP requests. Hỗ trợ tự động phát hiện cấu hình proxy qua giao thức WPAD. Nếu tắt, các ứng dụng sử dụng HTTP có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "Winmgmt",
      "DisplayName": "Windows Management Instrumentation",
      "Description": "Provides a common interface and object model to access management information about operating system, devices, applications and services. If this service is stopped, most Windows-based software will not function properly. If this service is disabled, any services that explicitly depend on it will fail to start.",
      "VietnameseName": "Windows Quản lý Instrumentation",
      "VietnameseDescription": "Cung cấp giao diện chung và mô hình đối tượng để truy cập thông tin quản lý về hệ điều hành, thiết bị, ứng dụng và dịch vụ. Nếu tắt, hầu hết phần mềm Windows sẽ không hoạt động đúng.",
      "Category": "Administration",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "WinRM",
      "DisplayName": "Windows Remote Management (WS-Management)",
      "Description": "Windows Remote Management (WinRM) service implements the WS-Management protocol for remote management. WS-Management is a standard web services protocol used for remote software and hardware management. The WinRM service listens on the network for WS-Management requests and processes them. The WinRM Service needs to be configured with a listener using winrm.cmd command line tool or through Group Policy in order for it to listen over the network. The WinRM service provides access to WMI data and enables event collection. Event collection and subscription to events require that the service is running. WinRM messages use HTTP and HTTPS as transports. The WinRM service does not depend on IIS but is preconfigured to share a port with IIS on the same machine.  The WinRM service reserves the /wsman URL prefix. To prevent conflicts with IIS, administrators should ensure that any websites hosted on IIS do not use the /wsman URL prefix.",
      "VietnameseName": "Windows Remote Quản lý (WS-Quản lý)",
      "VietnameseDescription": "Thực hiện giao thức WS-Management cho quản lý từ xa. Hỗ trợ quản lý phần mềm và phần cứng từ xa. Nếu tắt, không thể quản lý máy tính từ xa.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "wisvc",
      "DisplayName": "Windows Insider Service",
      "Description": "Provides infrastructure support for the Windows Insider Program. This service must remain enabled for the Windows Insider Program to work.",
      "VietnameseName": "Windows Insider",
      "VietnameseDescription": "Cung cấp hỗ trợ hạ tầng cho chương trình Windows Insider. Cần thiết cho việc tham gia chương trình Windows Insider. Nếu tắt, chương trình Windows Insider sẽ không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WlanSvc",
      "DisplayName": "WLAN AutoConfig",
      "Description": "The WLANSVC service provides the logic required to configure, discover, connect to, and disconnect from a wireless local area network (WLAN) as defined by IEEE 802.11 standards. It also contains the logic to turn your computer into a software access point so that other devices or computers can connect to your computer wirelessly using a WLAN adapter that can support this. Stopping or disabling the WLANSVC service will make all WLAN adapters on your computer inaccessible from the Windows networking UI. It is strongly recommended that you have the WLANSVC service running if your computer has a WLAN adapter.",
      "VietnameseName": "WLAN AutoConfig",
      "VietnameseDescription": "Cung cấp logic cần thiết để cấu hình, khám phá, kết nối và ngắt kết nối từ mạng WLAN. Hỗ trợ biến máy tính thành điểm truy cập phần mềm. Nếu tắt, tất cả adapter WLAN sẽ không thể truy cập từ giao diện mạng Windows.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "wlidsvc",
      "DisplayName": "Microsoft Account Sign-in Assistant",
      "Description": "Enables user sign-in through Microsoft account identity services. If this service is stopped, users will not be able to logon to the computer with their Microsoft account.",
      "VietnameseName": "Microsoft Account Sign-in Assistant",
      "VietnameseDescription": "Cho phép đăng nhập người dùng thông qua dịch vụ định danh Microsoft Account. Hỗ trợ đăng nhập bằng tài khoản Microsoft. Nếu tắt, người dùng sẽ không thể đăng nhập vào máy tính bằng Microsoft Account.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "wlpasvc",
      "DisplayName": "Local Profile Assistant Service",
      "Description": "This service provides profile management for subscriber identity modules",
      "VietnameseName": "Local Profile Assistant",
      "VietnameseDescription": "Cung cấp quản lý hồ sơ cho các module định danh thuê bao. Hỗ trợ quản lý SIM card và thông tin thuê bao. Nếu tắt, quản lý hồ sơ thuê bao có thể không hoạt động.",
      "Category": "Security",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WManSvc",
      "DisplayName": "Windows Management Service",
      "Description": "Performs management including Provisioning and Enrollment activities",
      "VietnameseName": "Windows Quản lý",
      "VietnameseDescription": "Thực hiện các hoạt động quản lý bao gồm Provisioning và Enrollment. Hỗ trợ cấu hình và đăng ký thiết bị từ xa. Nếu tắt, quản lý thiết bị từ xa có thể không hoạt động.",
      "Category": "Administration",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "wmiApSrv",
      "DisplayName": "WMI Performance Adapter",
      "Description": "Provides performance library information from Windows Management Instrumentation (WMI) providers to clients on the network. This service only runs when Performance Data Helper is activated.",
      "VietnameseName": "WMI Performance Adapter",
      "VietnameseDescription": "Cung cấp thông tin thư viện hiệu suất từ WMI providers cho các client trên mạng. Chỉ chạy khi Performance Data Helper được kích hoạt. Nếu tắt, các công cụ giám sát hiệu suất mạng có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "WMPNetworkSvc",
      "DisplayName": "Windows Media Player Network Sharing Service",
      "Description": "Shares Windows Media Player libraries to other networked players and media devices using Universal Plug and Play",
      "VietnameseName": "Windows Media Player Network Sharing",
      "VietnameseDescription": "Chia sẻ thư viện Windows Media Player với các thiết bị phát media khác trên mạng sử dụng Universal Plug and Play. Hỗ trợ phát nhạc/video qua mạng. Nếu tắt, không thể chia sẻ media qua mạng.",
      "Category": "Media",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "workfolderssvc",
      "DisplayName": "Work Folders",
      "Description": "This service syncs files with the Work Folders server, enabling you to use the files on any of the PCs and devices on which you've set up Work Folders.",
      "VietnameseName": "Work Folders",
      "VietnameseDescription": "Đồng bộ hóa tệp với Work Folders server, cho phép sử dụng tệp trên bất kỳ PC hoặc thiết bị nào đã thiết lập Work Folders. Hỗ trợ làm việc từ xa. Nếu tắt, đồng bộ hóa tệp làm việc sẽ không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WpcMonSvc",
      "DisplayName": "Parental Controls",
      "Description": "Enforces parental controls for child accounts in Windows. If this service is stopped or disabled, parental controls may not be enforced.",
      "VietnameseName": "Parental Controls",
      "VietnameseDescription": "Thực thi kiểm soát phụ huynh cho tài khoản trẻ em trong Windows. Hỗ trợ giới hạn thời gian sử dụng và nội dung. Nếu tắt, kiểm soát phụ huynh có thể không được thực thi.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "WPDBusEnum",
      "DisplayName": "Portable Device Enumerator Service",
      "Description": "Enforces group policy for removable mass-storage devices. Enables applications such as Windows Media Player and Image Import Wizard to transfer and synchronize content using removable mass-storage devices.",
      "VietnameseName": "Portable Device Enumerator",
      "VietnameseDescription": "Thực thi chính sách nhóm cho thiết bị lưu trữ di động. Cho phép ứng dụng như Windows Media Player và Image Import Wizard chuyển và đồng bộ nội dung. Nếu tắt, không thể kết nối thiết bị di động.",
      "Category": "Media",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "WpnService",
      "DisplayName": "Windows Push Notifications System Service",
      "Description": "This service runs in session 0 and hosts the notification platform and connection provider which handles the connection between the device and WNS server.",
      "VietnameseName": "Windows Push Notifications System",
      "VietnameseDescription": "Chạy trong session 0 và lưu trữ nền tảng thông báo và nhà cung cấp kết nối xử lý kết nối giữa thiết bị và WNS server. Hỗ trợ thông báo đẩy. Nếu tắt, thông báo đẩy sẽ không hoạt động.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "WSearch",
      "DisplayName": "Windows Search",
      "Description": "Provides content indexing, property caching, and search results for files, e-mail, and other content.",
      "VietnameseName": "Windows Search",
      "VietnameseDescription": "Cung cấp lập chỉ mục nội dung, lưu cache thuộc tính và kết quả tìm kiếm cho tệp, email và nội dung khác. Hỗ trợ tìm kiếm nhanh trong hệ thống. Nếu tắt, tìm kiếm Windows sẽ không hoạt động.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "wuauserv",
      "DisplayName": "Windows Update",
      "Description": "Enables the detection, download, and installation of updates for Windows and other programs. If this service is disabled, users of this computer will not be able to use Windows Update or its automatic updating feature, and programs will not be able to use the Windows Update Agent (WUA) API.",
      "VietnameseName": "Cập nhật Windows",
      "VietnameseDescription": "Hỗ trợ kiểm tra, tải và cài đặt các bản cập nhật cho Windows. Nếu tắt, hệ điều hành sẽ không được cập nhật bảo mật hoặc tính năng mới.",
      "Category": "System Update",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "WwanSvc",
      "DisplayName": "WWAN AutoConfig",
      "Description": "This service manages mobile broadband (GSM & CDMA) data card/embedded module adapters and connections by auto-configuring the networks. It is strongly recommended that this service be kept running for best user experience of mobile broadband devices.",
      "VietnameseName": "WWAN AutoConfig",
      "VietnameseDescription": "Quản lý mobile broadband (GSM & CDMA) data card/embedded module adapters và kết nối bằng cách tự động cấu hình mạng. Hỗ trợ kết nối mạng di động. Nếu tắt, kết nối mobile broadband có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "XblAuthManager",
      "DisplayName": "Xbox Live Auth Manager",
      "Description": "Provides authentication and authorization services for interacting with Xbox Live. If this service is stopped, some applications may not operate correctly.",
      "VietnameseName": "Xbox Live Auth Manager",
      "VietnameseDescription": "Cung cấp dịch vụ xác thực và ủy quyền cho tương tác với Xbox Live. Hỗ trợ đăng nhập và bảo mật Xbox. Nếu tắt, một số ứng dụng có thể không hoạt động đúng.",
      "Category": "Security",
      "Impact": "Cao",
      "SafeToDisable": true
    },
    {
      "Name": "XblGameSave",
      "DisplayName": "Xbox Live Game Save",
      "Description": "This service syncs save data for Xbox Live save enabled games.  If this service is stopped, game save data will not upload to or download from Xbox Live.",
      "VietnameseName": "Xbox Live Game Save",
      "VietnameseDescription": "Đồng bộ hóa dữ liệu lưu game cho các game có bật Xbox Live save. Hỗ trợ lưu và tải dữ liệu game từ đám mây. Nếu tắt, dữ liệu lưu game sẽ không được tải lên hoặc tải xuống từ Xbox Live.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "XboxGipSvc",
      "DisplayName": "Xbox Accessory Management Service",
      "Description": "This service manages connected Xbox Accessories.",
      "VietnameseName": "Xbox Accessory Quản lý",
      "VietnameseDescription": "Quản lý các phụ kiện Xbox đã kết nối. Hỗ trợ tay cầm, headset và các thiết bị Xbox khác. Nếu tắt, phụ kiện Xbox có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "XboxNetApiSvc",
      "DisplayName": "Xbox Live Networking Service",
      "Description": "This service supports the Windows.Networking.XboxLive application programming interface.",
      "VietnameseName": "Xbox Live Networking",
      "VietnameseDescription": "Hỗ trợ Windows.Networking.XboxLive application programming interface. Cung cấp kết nối mạng cho Xbox Live. Nếu tắt, kết nối Xbox Live có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "AarSvc_58998",
      "DisplayName": "Agent Activation Runtime_58998",
      "Description": "Runtime for activating conversational agent applications",
      "VietnameseName": "Agent Activation Runtime_58998",
      "VietnameseDescription": "Runtime để kích hoạt ứng dụng agent hội thoại. Hỗ trợ trợ lý ảo và chatbot. Nếu tắt, các ứng dụng agent hội thoại có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "BcastDVRUserService_58998",
      "DisplayName": "GameDVR and Broadcast User Service_58998",
      "Description": "This user service is used for Game Recordings and Live Broadcasts",
      "VietnameseName": "GameDVR and Broadcast User _58998",
      "VietnameseDescription": "Dịch vụ người dùng được sử dụng cho Game Recordings và Live Broadcasts. Hỗ trợ ghi lại game và phát trực tiếp. Nếu tắt, tính năng ghi game và phát trực tiếp có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "BluetoothUserService_58998",
      "DisplayName": "Bluetooth User Support Service_58998",
      "Description": "The Bluetooth user service supports proper functionality of Bluetooth features relevant to each user session.",
      "VietnameseName": "Bluetooth User Support _58998",
      "VietnameseDescription": "Dịch vụ Bluetooth người dùng hỗ trợ chức năng Bluetooth phù hợp cho mỗi phiên người dùng. Hỗ trợ kết nối Bluetooth cho từng tài khoản. Nếu tắt, tính năng Bluetooth có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "CaptureService_58998",
      "DisplayName": "CaptureService_58998",
      "Description": "Enables optional screen capture functionality for applications that call the Windows.Graphics.Capture API.",
      "VietnameseName": "Capture_58998",
      "VietnameseDescription": "Bật tính năng chụp màn hình tùy chọn cho ứng dụng gọi Windows.Graphics.Capture API. Hỗ trợ ghi lại màn hình. Nếu tắt, tính năng chụp màn hình có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "cbdhsvc_58998",
      "DisplayName": "Clipboard User Service_58998",
      "Description": "This user service is used for Clipboard scenarios",
      "VietnameseName": "Clipboard User _58998",
      "VietnameseDescription": "Dịch vụ người dùng được sử dụng cho các kịch bản Clipboard. Hỗ trợ sao chép và dán dữ liệu giữa các ứng dụng. Nếu tắt, tính năng clipboard có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "CDPUserSvc_58998",
      "DisplayName": "Connected Devices Platform User Service_58998",
      "Description": "This user service is used for Connected Devices Platform scenarios",
      "VietnameseName": "Connected Devices Platform User _58998",
      "VietnameseDescription": "Dịch vụ người dùng được sử dụng cho các kịch bản Connected Devices Platform. Hỗ trợ kết nối và quản lý thiết bị. Nếu tắt, kết nối thiết bị có thể không hoạt động.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "CloudBackupRestoreSvc_58998",
      "DisplayName": "Cloud Backup and Restore Service_58998",
      "Description": "Monitors the system for changes in application and setting states and performs cloud backup and restore operations when required.",
      "VietnameseName": "Cloud Backup and Restore _58998",
      "VietnameseDescription": "Giám sát hệ thống để phát hiện thay đổi trong trạng thái ứng dụng và cài đặt, thực hiện sao lưu và khôi phục đám mây khi cần thiết. Hỗ trợ bảo vệ dữ liệu tự động. Nếu tắt, sao lưu đám mây có thể không hoạt động.",
      "Category": "System Update",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "ConsentUxUserSvc_58998",
      "DisplayName": "ConsentUX User Service_58998",
      "Description": "Allows the system to request user consent to allow apps to access sensitive resources and information such as the device's location",
      "VietnameseName": "ConsentUX User _58998",
      "VietnameseDescription": "Cho phép hệ thống yêu cầu sự đồng ý của người dùng để ứng dụng truy cập tài nguyên nhạy cảm như vị trí thiết bị. Hỗ trợ bảo mật quyền truy cập. Nếu tắt, quyền truy cập có thể không được kiểm soát.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "CredentialEnrollmentManagerUserSvc_58998",
      "DisplayName": "CredentialEnrollmentManagerUserSvc_58998",
      "Description": "Credential Enrollment Manager",
      "VietnameseName": "CredentialEnrollmentManagerUserSvc_58998",
      "VietnameseDescription": "Lưu trữ và quản lý thông tin đăng nhập để xác thực người dùng và ứng dụng. Nếu tắt, quá trình xác thực có thể gặp lỗi.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": false
    },
    {
      "Name": "DeviceAssociationBrokerSvc_58998",
      "DisplayName": "DeviceAssociationBroker_58998",
      "Description": "Enables apps to pair devices",
      "VietnameseName": "DeviceAssociationBroker_58998",
      "VietnameseDescription": "Cho phép ứng dụng ghép đôi thiết bị. Hỗ trợ kết nối và cấu hình thiết bị mới. Nếu tắt, quá trình ghép đôi thiết bị có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DevicePickerUserSvc_58998",
      "DisplayName": "DevicePicker_58998",
      "Description": "This user service is used for managing the Miracast, DLNA, and DIAL UI",
      "VietnameseName": "DevicePicker_58998",
      "VietnameseDescription": "Dịch vụ người dùng được sử dụng để quản lý giao diện Miracast, DLNA và DIAL. Hỗ trợ kết nối màn hình và thiết bị media. Nếu tắt, giao diện chọn thiết bị có thể không hoạt động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "DevicesFlowUserSvc_58998",
      "DisplayName": "DevicesFlow_58998",
      "Description": "Allows ConnectUX and PC Settings to Connect and Pair with WiFi displays and Bluetooth devices.",
      "VietnameseName": "DevicesFlow_58998",
      "VietnameseDescription": "Cho phép ConnectUX và PC Settings kết nối và ghép đôi với màn hình WiFi và thiết bị Bluetooth. Hỗ trợ kết nối thiết bị không dây. Nếu tắt, kết nối thiết bị có thể không hoạt động.",
      "Category": "Networking",
      "Impact": "Trung bình",
      "SafeToDisable": true
    },
    {
      "Name": "MessagingService_58998",
      "DisplayName": "MessagingService_58998",
      "Description": "Service supporting text messaging and related functionality.",
      "VietnameseName": "Messaging_58998",
      "VietnameseDescription": "Hỗ trợ nhắn tin giữa các thiết bị Windows. Có thể tắt nếu không dùng chia sẻ thiết bị.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "NPSMSvc_58998",
      "DisplayName": "NPSMSvc_58998",
      "Description": "",
      "VietnameseName": "NPSMSvc_58998",
      "VietnameseDescription": "Dịch vụ hỗ trợ SMS và tin nhắn. Hỗ trợ gửi và nhận tin nhắn văn bản. Nếu tắt, tính năng SMS có thể không hoạt động.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "OneSyncSvc_58998",
      "DisplayName": "Sync Host_58998",
      "Description": "This service synchronizes mail, contacts, calendar and various other user data. Mail and other applications dependent on this functionality will not work properly when this service is not running.",
      "VietnameseName": "Sync Host_58998",
      "VietnameseDescription": "Đồng bộ hóa email, danh bạ, lịch và các dữ liệu người dùng khác. Hỗ trợ đồng bộ dữ liệu với đám mây. Nếu tắt, email và ứng dụng phụ thuộc có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": true
    },
    {
      "Name": "P9RdrService_58998",
      "DisplayName": "P9RdrService_58998",
      "Description": "Enables trigger-starting plan9 file servers.",
      "VietnameseName": "P9Rdr_58998",
      "VietnameseDescription": "Cho phép kích hoạt tự động các máy chủ tệp plan9. Hỗ trợ hệ thống tệp phân tán. Nếu tắt, các máy chủ tệp plan9 có thể không khởi động tự động.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PenService_58998",
      "DisplayName": "PenService_58998",
      "Description": "Pen Service",
      "VietnameseName": "Pen_58998",
      "VietnameseDescription": "Dịch vụ hỗ trợ bút stylus và thiết bị viết tay. Hỗ trợ nhập liệu bằng bút cho màn hình cảm ứng. Nếu tắt, bút stylus có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PimIndexMaintenanceSvc_58998",
      "DisplayName": "Contact Data_58998",
      "Description": "Indexes contact data for fast contact searching. If you stop or disable this service, contacts might be missing from your search results.",
      "VietnameseName": "Contact Data_58998",
      "VietnameseDescription": "Lập chỉ mục dữ liệu danh bạ để tìm kiếm nhanh. Hỗ trợ tìm kiếm liên hệ hiệu quả. Nếu tắt, danh bạ có thể không xuất hiện trong kết quả tìm kiếm.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "PrintWorkflowUserSvc_58998",
      "DisplayName": "PrintWorkflow_58998",
      "Description": "Provides support for Print Workflow applications. If you turn off this service, you may not be able to print successfully.",
      "VietnameseName": "PrintWorkflow_58998",
      "VietnameseDescription": "Cung cấp hỗ trợ cho ứng dụng Print Workflow. Hỗ trợ quy trình in ấn nâng cao. Nếu tắt, có thể không in được thành công.",
      "Category": "Printing",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "UdkUserSvc_58998",
      "DisplayName": "Udk User Service_58998",
      "Description": "Shell components service",
      "VietnameseName": "Udk User _58998",
      "VietnameseDescription": "Dịch vụ thành phần Shell. Hỗ trợ giao diện người dùng và thành phần hệ thống. Nếu tắt, giao diện người dùng có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Trung bình",
      "SafeToDisable": false
    },
    {
      "Name": "UnistoreSvc_58998",
      "DisplayName": "User Data Storage_58998",
      "Description": "Handles storage of structured user data, including contact info, calendars, messages, and other content. If you stop or disable this service, apps that use this data might not work correctly.",
      "VietnameseName": "User Data Storage_58998",
      "VietnameseDescription": "Lưu trữ và đồng bộ email, lịch và danh bạ. Nếu không dùng ứng dụng Mail hoặc đồng bộ hóa, có thể tắt.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "UserDataSvc_58998",
      "DisplayName": "User Data Access_58998",
      "Description": "Provides apps access to structured user data, including contact info, calendars, messages, and other content. If you stop or disable this service, apps that use this data might not work correctly.",
      "VietnameseName": "User Data Access_58998",
      "VietnameseDescription": "Cung cấp cho ứng dụng quyền truy cập dữ liệu người dùng có cấu trúc, bao gồm thông tin liên hệ, lịch, tin nhắn và nội dung khác. Nếu tắt, ứng dụng sử dụng dữ liệu này có thể không hoạt động đúng.",
      "Category": "System",
      "Impact": "Thấp",
      "SafeToDisable": true
    },
    {
      "Name": "webthreatdefusersvc_58998",
      "DisplayName": "Web Threat Defense User Service_58998",
      "Description": "Web Threat Defense User Service helps protect your computer by warning the user when unauthorized entities attempt to gain access to their credentials",
      "VietnameseName": "Web Threat Defense User _58998",
      "VietnameseDescription": "Lưu trữ và quản lý thông tin đăng nhập để xác thực người dùng và ứng dụng. Nếu tắt, quá trình xác thực có thể gặp lỗi.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    },
    {
      "Name": "WpnUserService_58998",
      "DisplayName": "Windows Push Notifications User Service_58998",
      "Description": "This service hosts Windows notification platform which provides support for local and push notifications. Supported notifications are tile, toast and raw.",
      "VietnameseName": "Windows Push Notifications User _58998",
      "VietnameseDescription": "Dịch vụ lưu trữ nền tảng thông báo Windows cung cấp hỗ trợ cho thông báo cục bộ và đẩy. Hỗ trợ thông báo tile, toast và raw. Nếu tắt, thông báo có thể không hoạt động.",
      "Category": "System",
      "Impact": "Cao",
      "SafeToDisable": false
    }
  ]
};
