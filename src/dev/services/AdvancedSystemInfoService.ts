import * as si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';
import { executePowerShellScript } from './CommandHelper';

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
  command: string;
}

export interface NetworkConnection {
  protocol: string;
  localAddress: string;
  localPort: string;
  remoteAddress: string;
  remotePort: string;
  state: string;
  pid: number;
}

export interface InstalledApp {
  name: string;
  version: string;
  publisher: string;
  installDate: string;
  size: string;
}

export interface WindowsFeature {
  name: string;
  displayName: string;
  state: string;
  description: string;
}

export interface SystemPerformance {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  temperature: number;
}

export class AdvancedSystemInfoService {
  // Lấy thông tin chi tiết về processes
  async getProcessesInfo(): Promise<ProcessInfo[]> {
    try {
      const processes = await si.processes();
      return processes.list.map(proc => ({
        pid: proc.pid,
        name: proc.name,
        cpu: proc.cpu,
        memory: proc.memRss,
        command: proc.command
      }));
    } catch (error) {
      console.error('Lỗi khi lấy thông tin processes:', error);
      throw error;
    }
  }

  // Lấy thông tin kết nối mạng
  async getNetworkConnections(): Promise<NetworkConnection[]> {
    try {
      const result = await executePowerShellScript(`Get-NetTCPConnection | Where-Object {$_.State -eq 'Listen' -or $_.State -eq 'Established'} | Select-Object Protocol, LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess | ConvertTo-Json`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin network connections:', error);
      throw error;
    }
  }

  // Lấy danh sách ứng dụng đã cài đặt
  async getInstalledApps(): Promise<InstalledApp[]> {
    try {
      // Sử dụng registry để tránh kích hoạt MSI reconfiguration từ Win32_Product
      const ps = `
        $paths = @(
          'HKLM:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
          'HKLM:\\SOFTWARE\\WOW6432Node\\Microsoft\\Windows\\CurrentVersion\\Uninstall',
          'HKCU:\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall'
        )
        $apps = @()
        foreach ($p in $paths) {
          if (Test-Path $p) {
            Get-ChildItem $p | ForEach-Object {
              $dn = (Get-ItemProperty $_.PSPath -ErrorAction SilentlyContinue)
              if ($dn -and $dn.DisplayName) {
                $apps += [PSCustomObject]@{
                  Name = $dn.DisplayName
                  Version = $dn.DisplayVersion
                  Vendor = $dn.Publisher
                  InstallDate = $dn.InstallDate
                  InstallLocation = $dn.InstallLocation
                  EstimatedSize = $dn.EstimatedSize
                }
              }
            }
          }
        }
        $apps | ConvertTo-Json
      `;
      const result = await executePowerShellScript(ps);
      const data = result.stdout?.trim() ? JSON.parse(result.stdout) : [];
      return (Array.isArray(data) ? data : [data]).map((a: any) => ({
        name: a.Name || 'Unknown',
        version: a.Version || 'N/A',
        publisher: a.Vendor || 'N/A',
        installDate: a.InstallDate || '',
        size: a.EstimatedSize ? `${Math.round((a.EstimatedSize as number) / 1024)} MB` : 'N/A'
      }));
    } catch (error) {
      console.error('Lỗi khi lấy thông tin installed apps:', error);
      throw error;
    }
  }

  // Lấy thông tin Windows Features
  async getWindowsFeatures(): Promise<WindowsFeature[]> {
    try {
      const result = await executePowerShellScript(`Get-WindowsFeature | Where-Object {$_.InstallState -eq 'Installed'} | Select-Object Name, DisplayName, InstallState, Description | ConvertTo-Json`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin Windows Features:', error);
      throw error;
    }
  }

  // Lấy thông tin performance real-time
  async getSystemPerformance(): Promise<SystemPerformance> {
    try {
      const [cpu, mem, disk, temp] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.cpuTemperature()
      ]);

      const diskUsage = disk.length > 0 ? 
        ((disk[0].used / disk[0].size) * 100) : 0;

      return {
        cpuUsage: cpu.currentLoad,
        memoryUsage: ((mem.used / mem.total) * 100),
        diskUsage: diskUsage,
        networkUsage: 0, // Cần implement riêng
        temperature: temp.main || 0
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin performance:', error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết về hardware
  async getDetailedHardwareInfo() {
    try {
      const [cpu, mem, disk, gpu, network, os] = await Promise.all([
        si.cpu(),
        si.mem(),
        si.diskLayout(),
        si.graphics(),
        si.networkInterfaces(),
        si.osInfo()
      ]);

      return {
        cpu: {
          ...cpu,
          cache: {
            l1d: cpu.cache.l1d,
            l1i: cpu.cache.l1i,
            l2: cpu.cache.l2,
            l3: cpu.cache.l3
          },
          flags: cpu.flags,
          virtualization: cpu.virtualization
        },
        memory: {
          ...mem,
          modules: (mem as any).modules?.map((module: any) => ({
            ...module,
            sizeGB: (module.size / 1024 / 1024 / 1024).toFixed(2)
          })) || []
        },
        disk: disk.map(d => ({
          ...d,
          sizeGB: (d.size / 1024 / 1024 / 1024).toFixed(2),
          temperature: d.temperature || 0
        })),
        gpu: gpu.controllers.map(g => ({
          ...g,
          vramGB: g.vram ? (g.vram / 1024).toFixed(2) : 'N/A'
        })),
        network: network.map(n => ({
          ...n,
          speed: n.speed || 'Unknown',
          duplex: n.duplex || 'Unknown'
        })),
        os: {
          ...os,
          platform: os.platform,
          distro: os.distro,
          release: os.release,
          arch: os.arch,
          hostname: os.hostname,
          uptime: (os as any).uptime || 0
        }
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hardware chi tiết:', error);
      throw error;
    }
  }

  // Lấy thông tin về services đang chạy
  async getRunningServices(): Promise<any[]> {
    try {
      const result = await executePowerShellScript(`Get-Service | Where-Object {$_.Status -eq 'Running'} | Select-Object Name, DisplayName, Status, StartType, Description | ConvertTo-Json`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin running services:', error);
      throw error;
    }
  }

  // Lấy thông tin về drivers
  async getDriversInfo(): Promise<any[]> {
    try {
      const result = await executePowerShellScript(`Get-WmiObject -Class Win32_PnPSignedDriver | Where-Object {$_.DeviceName -ne $null} | Select-Object DeviceName, DeviceID, DriverVersion, Manufacturer | ConvertTo-Json"`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin drivers:', error);
      throw error;
    }
  }

  // Lấy thông tin về event logs
  async getEventLogs(level: string = 'Error', count: number = 10): Promise<any[]> {
    try {
      const result = await executePowerShellScript(`Get-EventLog -LogName System -EntryType ${level} -Newest ${count} | Select-Object TimeGenerated, Source, Message | ConvertTo-Json`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin event logs:', error);
      throw error;
    }
  }

  // Lấy thông tin về registry
  async getRegistryInfo(path: string): Promise<any> {
    try {
      const result = await executePowerShellScript(`Get-ItemProperty -Path '${path}' | ConvertTo-Json`);
      
      return JSON.parse(result.stdout);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin registry:', error);
      throw error;
    }
  }

  // Lấy thông tin chi tiết về network interfaces
  async getNetworkInterfaces(): Promise<any[]> {
    try {
      // Lấy thông tin cơ bản từ systeminformation
      const networkInterfaces = await si.networkInterfaces();

      // Lấy thông tin chi tiết bằng PowerShell
      const psCommand = `$interfaces = @(); Get-NetAdapter | ForEach-Object { $adapter = $_; $ipConfig = Get-NetIPConfiguration -InterfaceIndex $adapter.ifIndex -ErrorAction SilentlyContinue; $ipv4 = $ipConfig.IPv4Address | Where-Object {$_.AddressFamily -eq 2} | Select-Object -First 1; $gateway = $ipConfig.IPv4DefaultGateway | Select-Object -First 1; $dnsServers = @(); $primaryDNS = $null; $secondaryDNS = $null; try { $dnsConfig = Get-DnsClientServerAddress -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue; if ($dnsConfig -and $dnsConfig.ServerAddresses) { $dnsServers = @($dnsConfig.ServerAddresses); if ($dnsServers.Count -gt 0) { $primaryDNS = $dnsServers[0]; if ($dnsServers.Count -gt 1) { $secondaryDNS = $dnsServers[1]; } } } } catch { Write-Host "Error getting DNS for $($adapter.Name): $_"; } $dhcpEnabled = $false; if ($ipv4) { $dhcpConfig = Get-NetIPInterface -InterfaceIndex $adapter.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue; $dhcpEnabled = $dhcpConfig.Dhcp -eq 'Enabled'; } $interface = [PSCustomObject]@{ Name = $adapter.Name; InterfaceDescription = $adapter.InterfaceDescription; Status = $adapter.Status; MacAddress = $adapter.MacAddress; LinkSpeed = $adapter.LinkSpeed; MediaType = $adapter.MediaType; PhysicalMediaType = $adapter.PhysicalMediaType; InterfaceType = $adapter.InterfaceType; IPAddress = if ($ipv4) { $ipv4.IPAddress } else { $null }; SubnetMask = if ($ipv4) { $ipv4.PrefixLength } else { $null }; Gateway = if ($gateway) { $gateway.NextHop } else { $null }; DNSServers = if ($dnsServers.Count -gt 0) { $dnsServers -join ',' } else { $null }; PrimaryDNS = $primaryDNS; SecondaryDNS = $secondaryDNS; DHCPEnabled = $dhcpEnabled; MTU = $adapter.MTU; Duplex = $adapter.Duplex; AdminStatus = $adapter.AdminStatus; InterfaceIndex = $adapter.ifIndex; InterfaceGuid = $adapter.InterfaceGuid; }; $interfaces += $interface; }; $interfaces | ConvertTo-Json -Depth 3`;
      
      const { stdout, stderr } = await executePowerShellScript(`${psCommand}`);
      
      console.log('PowerShell stdout:', stdout);
      console.log('PowerShell stderr:', stderr);

      let psInterfaces = [];
      try {
        if (stdout.trim()) {
          psInterfaces = JSON.parse(stdout);
          if (!Array.isArray(psInterfaces)) {
            psInterfaces = [psInterfaces];
          }
        }
      } catch (parseError) {
        console.error('Error parsing PowerShell output:', parseError);
        console.error('Raw output:', stdout);
        psInterfaces = [];
      }

      // Kết hợp thông tin từ cả hai nguồn
      const combinedInterfaces = await Promise.all(networkInterfaces.map(async (siInterface: any) => {
        // Tìm interface tương ứng từ PowerShell dựa trên tên hoặc description
        const psInterface = psInterfaces.find((ps: any) => 
          ps.Name === siInterface.iface || 
          ps.InterfaceDescription === siInterface.ifaceName ||
          ps.Name === siInterface.ifaceName
        );
        
        console.log('PowerShell interface data:', psInterface);
        
        // Xử lý DNS servers
        let dnsServers = [];
        let primaryDNS = 'N/A';
        
        if (psInterface?.DNSServers) {
          dnsServers = psInterface.DNSServers.split(',').filter(dns => dns.trim() !== '');
          primaryDNS = psInterface.PrimaryDNS || dnsServers[0] || 'N/A';
        } else if (psInterface?.PrimaryDNS) {
          primaryDNS = psInterface.PrimaryDNS;
          dnsServers = [primaryDNS];
        }
        
        // Fallback: nếu không lấy được DNS từ PowerShell, thử lấy từ ipconfig
        if (primaryDNS === 'N/A' && siInterface.ip4) {
          try {
            // Lấy DNS từ ipconfig bằng cách parse toàn bộ output
            const { stdout: ipconfigOutput } = await executePowerShellScript('ipconfig /all');
            if (ipconfigOutput) {
              const lines = ipconfigOutput.split('\n');
              const interfaceIndex = lines.findIndex(line => line.includes(siInterface.iface));
              if (interfaceIndex !== -1) {
                // Tìm dòng DNS Servers trong phạm vi 20 dòng sau interface
                for (let i = interfaceIndex; i < Math.min(interfaceIndex + 20, lines.length); i++) {
                  const line = lines[i];
                  if (line.toLowerCase().includes('dns servers')) {
                    const dnsMatch = line.match(/dns servers[^:]*:\s*([^\r\n]+)/i);
                    if (dnsMatch) {
                      primaryDNS = dnsMatch[1].trim();
                      dnsServers = [primaryDNS];
                      break;
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error getting DNS from ipconfig:', error);
          }
        }
        
        // Helper function để chuyển đổi InterfaceType từ số sang string
        const getInterfaceTypeString = (type: number): string => {
          const typeMap: { [key: number]: string } = {
            6: 'Ethernet',
            71: 'WiFi',
            53: 'VPN',
            24: 'Loopback',
            23: 'Tunnel',
            131: 'Virtual'
          };
          return typeMap[type] || 'Unknown';
        };
        
        // Helper function để chuyển đổi AdminStatus từ số sang string
        const getAdminStatusString = (status: number): string => {
          return status === 1 ? 'Up' : 'Down';
        };
        
        return {
          name: siInterface.iface,
          description: siInterface.iface,
          ipAddress: psInterface?.IPAddress || siInterface.ip4 || 'N/A',
          subnetMask: psInterface?.SubnetMask ? `/${psInterface.SubnetMask}` : (siInterface.ip4subnet || 'N/A'),
          gateway: psInterface?.Gateway || 'N/A',
          dns: primaryDNS,
          status: psInterface?.Status?.toLowerCase() || siInterface.operstate || 'unknown',
          type: this.determineInterfaceType(psInterface?.MediaType, psInterface?.PhysicalMediaType, siInterface.iface),
          macAddress: psInterface?.MacAddress || siInterface.mac || 'N/A',
          speed: psInterface?.LinkSpeed || (siInterface.speed ? `${siInterface.speed} Mbps` : 'N/A'),
          duplex: psInterface?.Duplex || 'N/A',
          mtu: psInterface?.MTU || 'N/A',
          dhcpEnabled: psInterface?.DHCPEnabled || siInterface.dhcp || false,
          dnsServers: dnsServers,
          ipv6Address: siInterface.ip6 || 'N/A',
          adapterName: psInterface?.InterfaceDescription || siInterface.ifaceName || siInterface.iface,
          interfaceType: psInterface?.InterfaceType ? getInterfaceTypeString(psInterface.InterfaceType) : 'Unknown',
          physicalAddress: psInterface?.MacAddress || siInterface.mac || 'N/A',
          adminStatus: psInterface?.AdminStatus ? getAdminStatusString(psInterface.AdminStatus) : 'Unknown',
          promiscuousMode: false,
          hardwareInterface: false,
          mediaType: psInterface?.MediaType || 'N/A',
          physicalMediaType: psInterface?.PhysicalMediaType || 'N/A',
          linkSpeed: psInterface?.LinkSpeed || 'N/A',
          interfaceIndex: psInterface?.InterfaceIndex || 'N/A',
          interfaceGuid: psInterface?.InterfaceGuid || 'N/A',
          interfaceDescription: psInterface?.InterfaceDescription || 'N/A',
          macAddressFormatted: psInterface?.MacAddress || siInterface.mac || 'N/A',
          ipAddressFormatted: psInterface?.IPAddress || siInterface.ip4 || 'N/A',
          gatewayFormatted: psInterface?.Gateway || 'N/A',
          dnsFormatted: primaryDNS
        };
      }));
      
      return combinedInterfaces;
      
    } catch (error) {
      console.error('Lỗi khi lấy thông tin network interfaces:', error);
      // Fallback: trả về thông tin cơ bản từ systeminformation
      try {
        const networkInterfaces = await si.networkInterfaces();
        return networkInterfaces.map((iface: any) => ({
          name: iface.iface,
          description: iface.iface,
          ipAddress: iface.ip4 || 'N/A',
          subnetMask: iface.ip4subnet || 'N/A',
          gateway: 'N/A',
          dns: 'N/A',
          status: iface.operstate || 'unknown',
          type: this.determineInterfaceType(null, null, iface.iface),
          macAddress: iface.mac || 'N/A',
          speed: iface.speed ? `${iface.speed} Mbps` : 'N/A',
          duplex: 'N/A',
          mtu: 'N/A',
          dhcpEnabled: iface.dhcp || false,
          dnsServers: [],
          ipv6Address: iface.ip6 || 'N/A',
          adapterName: iface.ifaceName || iface.iface,
          interfaceType: 'Unknown',
          physicalAddress: iface.mac || 'N/A',
          adminStatus: 'Unknown',
          promiscuousMode: false,
          hardwareInterface: false,
          mediaType: 'N/A',
          physicalMediaType: 'N/A',
          linkSpeed: 'N/A',
          interfaceIndex: 'N/A',
          interfaceGuid: 'N/A',
          interfaceDescription: 'N/A',
          macAddressFormatted: iface.mac || 'N/A',
          ipAddressFormatted: iface.ip4 || 'N/A',
          gatewayFormatted: 'N/A',
          dnsFormatted: 'N/A'
        }));
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        return [];
      }
    }
  }

  // Helper method để xác định loại interface
  private determineInterfaceType(mediaType: string, physicalMediaType: string, interfaceName: string): string {
    const name = interfaceName?.toLowerCase() || '';
    const media = mediaType?.toLowerCase() || '';
    const physical = physicalMediaType?.toLowerCase() || '';
    
    if (name.includes('ethernet') || media.includes('ethernet') || physical.includes('ethernet')) {
      return 'Ethernet';
    }
    if (name.includes('wifi') || name.includes('wireless') || name.includes('wi-fi') || 
        media.includes('wireless') || physical.includes('wireless')) {
      return 'WiFi';
    }
    if (name.includes('bluetooth') || media.includes('bluetooth') || physical.includes('bluetooth')) {
      return 'Bluetooth';
    }
    if (name.includes('loopback') || name.includes('lo')) {
      return 'Loopback';
    }
    if (name.includes('vpn') || name.includes('tunnel')) {
      return 'VPN';
    }
    if (name.includes('virtual') || name.includes('vmware') || name.includes('hyper-v')) {
      return 'Virtual';
    }
    
    return 'Unknown';
  }

  // Cleanup
  async cleanup(): Promise<void> {
    // Không cần cleanup vì không dùng PowerShell instance
  }
} 