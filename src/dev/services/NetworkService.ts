import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import { executeCmdCommand, executePowerShellScript } from './CommandHelper';

export interface NetworkInterface {
  name: string;
  description: string;
  mac: string;
  ip: string;
  netmask: string;
  gateway: string;
  dns: string[];
  dhcp: boolean;
  status: 'up' | 'down';
}

export interface NetworkConfig {
  interface: string;
  ip: string;
  netmask: string;
  gateway: string;
  dns: string[];
  dhcp: boolean;
}

export interface WifiProfile {
  name: string;
  ssid: string;
  authentication: string;
  cipher: string;
  securityKey: string;
}

export interface NetworkConnectionInfo {
  isConnected: boolean;
  publicIP?: string;
  publicIPv6?: string;
  localIP?: string;
  status?: string;
  message?: string;
  continent?: string;
  continentCode?: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  district?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  timezoneOffset?: number;
  currency?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
  query?: string;
  responseTime?: number;
  error?: string;
}

export interface DnsConfig {
  primary: string;
  secondary?: string;
  ipv6?: {
    primary: string;
    secondary?: string;
  };
}

export interface SpeedTestServer {
  count: number;
  serverID: number;
  serverName: string;
  latitude: string;
  longitude: string;
  download_url: string;
  upload_url: string;
  ping_url: string;
  country: string;
  distance: string;
  default: boolean;
}

export interface SpeedTestServerList {
  serverList: SpeedTestServer[];
}

export interface SpeedTestResult {
  singleThread: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  };
  multiThread: {
    downloadSpeed: number;
    uploadSpeed: number;
    latency: number;
    jitter: number;
  };
  serverUsed?: string;
  testDuration: number;
}

export interface ProxyConfig {
  enabled: boolean;
  server: string;
  port: number;
  username?: string;
  password?: string;
  bypass?: string[];
}

export interface NetworkOptimization {
  disableIPv6: boolean;
  optimizeTCP: boolean;
  increaseBufferSize: boolean;
  disableNagle: boolean;
  optimizeDNS: boolean;
}

export class NetworkService {
  async getNetworkInterfaces(): Promise<NetworkInterface[]> {
    try {
      const { stdout } = await executeCmdCommand('netsh interface ip show config');
      const interfaces: NetworkInterface[] = [];
      
      // Parse network interfaces from netsh output
      const lines = stdout.split('\n');
      let currentInterface: Partial<NetworkInterface> = {};
      
      for (const line of lines) {
        if (line.includes('Configuration for interface')) {
          if (currentInterface.name) {
            interfaces.push(currentInterface as NetworkInterface);
          }
          currentInterface = {
            name: line.split('"')[1] || '',
            status: 'up'
          };
        } else if (line.includes('DHCP enabled:')) {
          currentInterface.dhcp = line.includes('Yes');
        } else if (line.includes('IP Address:')) {
          currentInterface.ip = line.split(':')[1]?.trim() || '';
        } else if (line.includes('Subnet Prefix:')) {
          currentInterface.netmask = line.split(':')[1]?.trim() || '';
        } else if (line.includes('Default Gateway:')) {
          currentInterface.gateway = line.split(':')[1]?.trim() || '';
        }
      }
      
      if (currentInterface.name) {
        interfaces.push(currentInterface as NetworkInterface);
      }
      
      return interfaces;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin mạng:', error);
      throw error;
    }
  }

  async testNetworkConnection(): Promise<NetworkConnectionInfo> {
    const startTime = Date.now();
    
    try {
      console.log('🔍 Testing network connection...');
      
      // Test basic connectivity first
      await executeCmdCommand('ping -n 1 8.8.8.8');
      
      // Get local IP
      const localIP = await this.getLocalIP();
      
      // Get public IP and detailed info from free APIs
      const publicInfo = await this.getPublicIPInfo();
      
      const responseTime = Date.now() - startTime;
      
      return {
        isConnected: true,
        publicIP: publicInfo.ip,
        publicIPv6: publicInfo.ipv6,
        localIP: localIP,
        timezone: publicInfo.timezone,
        country: publicInfo.country,
        city: publicInfo.city,
        region: publicInfo.region,
        regionName: publicInfo.regionName,
        isp: publicInfo.isp,
        org: publicInfo.org,
        as: publicInfo.as,
        asname: publicInfo.asname,
        latitude: publicInfo.latitude,
        longitude: publicInfo.longitude,
        timezoneOffset: publicInfo.timezoneOffset,
        responseTime: responseTime,
        zip: publicInfo.zip,
        countryCode: publicInfo.countryCode,
        continent: publicInfo.continent,
        continentCode: publicInfo.continentCode,
        district: publicInfo.district,
        currency: publicInfo.currency,
        reverse: publicInfo.reverse,
        mobile: publicInfo.mobile,
        proxy: publicInfo.proxy,
        hosting: publicInfo.hosting,
        query: publicInfo.query
      };
      
    } catch (error) {
      console.error('❌ Network connection test failed:', error);
      return {
        isConnected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
    }
  }

  private async getLocalIP(): Promise<string> {
    try {
      const { stdout } = await executeCmdCommand('ipconfig');
      const lines = stdout.split('\n');
      
      for (const line of lines) {
        if (line.includes('IPv4 Address') && !line.includes('169.254')) {
          const match = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
          if (match) {
            return match[1];
          }
        }
      }
      return 'N/A';
    } catch (error) {
      console.error('Error getting local IP:', error);
      return 'N/A';
    }
  }

  private async getPublicIPInfo(): Promise<any> {
    try {
      // Lấy IPv4 từ ipify.org
      const ipv4Response = await this.makeHttpRequest('api.ipify.org', '/?format=json');
      const ipv4Data = JSON.parse(ipv4Response);

      
      // Lấy IPv6 từ ipify.org (nếu có)
      let ipv6Data = null;
      try {
        const ipv6Response = await this.makeHttpRequest('api64.ipify.org', '/?format=json');
        ipv6Data = JSON.parse(ipv6Response);

      } catch (error) {
        console.log('⚠️ IPv6 not available');
      }
      
      // Lấy thông tin chi tiết từ ip-api.com với fields cụ thể
      const detailedResponse = await this.makeHttpRequest('pro.ip-api.com', '/json?key=2NjTrQVUwRiEKHG&fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting,query');
      const detailedData = JSON.parse(detailedResponse);

      return {
        ip: ipv4Data.ip,
        ipv6: ipv6Data?.ip || null,
        status: detailedData.status,
        message: detailedData.message,
        continent: detailedData.continent,
        continentCode: detailedData.continentCode,
        country: detailedData.country,
        countryCode: detailedData.countryCode,
        region: detailedData.region,
        regionName: detailedData.regionName,
        city: detailedData.city,
        district: detailedData.district,
        zip: detailedData.zip,
        latitude: detailedData.lat,
        longitude: detailedData.lon,
        timezone: detailedData.timezone,
        timezoneOffset: detailedData.offset,
        currency: detailedData.currency,
        isp: detailedData.isp,
        org: detailedData.org,
        as: detailedData.as,
        asname: detailedData.asname,
        reverse: detailedData.reverse,
        mobile: detailedData.mobile,
        proxy: detailedData.proxy,
        hosting: detailedData.hosting,
        query: detailedData.query
      };
      
    } catch (error) {
      console.error('Error getting public IP info:', error);
      // Fallback to simple IP check
      return this.getPublicIPInfoFallback();
    }
  }

  private async makeHttpRequest(hostname: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: hostname,
        port: 443,
        path: path,
        method: 'GET',
        timeout: 10000
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          resolve(data);
        });
      });

      req.on('error', (error) => {
        console.error(`Error requesting ${hostname}:`, error);
        reject(error);
      });

      req.on('timeout', () => {
        console.log(`⏰ Timeout for ${hostname}`);
        req.destroy();
        reject(new Error(`Timeout for ${hostname}`));
      });

      req.end();
    });
  }

  private async getPublicIPInfoFallback(): Promise<any> {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'httpbin.org',
        port: 443,
        path: '/ip',
        method: 'GET',
        timeout: 5000
      };

      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const info = JSON.parse(data);
            console.log('✅ Fallback IP info received:', info);
            resolve({
              ip: info.origin,
              ipv6: null,
              timezone: 'Unknown',
              country: 'Unknown',
              city: 'Unknown',
              region: 'Unknown',
              isp: 'Unknown',
              org: 'Unknown',
              as: 'Unknown',
              latitude: 0,
              longitude: 0,
              timezoneOffset: 0,
              zip: '',
              countryCode: '',
              regionCode: ''
            });
          } catch (error) {
            console.error('Error parsing fallback IP info:', error);
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        console.error('Error requesting fallback IP info:', error);
        reject(error);
      });

      req.on('timeout', () => {
        console.log('⏰ Fallback API timeout');
        req.destroy();
        reject(new Error('All APIs timeout'));
      });

      req.end();
    });
  }

  async configureNetwork(config: NetworkConfig): Promise<boolean> {
    try {
      if (config.dhcp) {
        // Cấu hình DHCP
        await executeCmdCommand(`netsh interface ip set address "${config.interface}" dhcp`);
        await executeCmdCommand(`netsh interface ip set dns "${config.interface}" dhcp`);
      } else {
        // Cấu hình IP tĩnh
        await executeCmdCommand(`netsh interface ip set address "${config.interface}" static ${config.ip} ${config.netmask} ${config.gateway}`);
        
        // Cấu hình DNS
        if (config.dns.length > 0) {
          await executeCmdCommand(`netsh interface ip set dns "${config.interface}" static ${config.dns[0]}`);
          if (config.dns.length > 1) {
            await executeCmdCommand(`netsh interface ip add dns "${config.interface}" ${config.dns[1]} index=2`);
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Lỗi khi cấu hình mạng:', error);
      throw error;
    }
  }

  async backupWifiProfiles(): Promise<string> {
    try {
      // Lấy danh sách WiFi profiles
      const { stdout } = await executeCmdCommand('netsh wlan show profiles');
      const profiles: WifiProfile[] = [];
      
      const lines = stdout.split('\n');
      for (const line of lines) {
        if (line.includes('All User Profile')) {
          const profileName = line.split(':')[1]?.trim();
          if (profileName) {
            try {
              const { stdout: profileInfo } = await executeCmdCommand(`netsh wlan show profile name="${profileName}" key=clear`);
              
              const profile: WifiProfile = {
                name: profileName,
                ssid: profileName,
                authentication: '',
                cipher: '',
                securityKey: ''
              };
              
              const profileLines = profileInfo.split('\n');
              for (const pLine of profileLines) {
                if (pLine.includes('Authentication')) {
                  profile.authentication = pLine.split(':')[1]?.trim() || '';
                } else if (pLine.includes('Cipher')) {
                  profile.cipher = pLine.split(':')[1]?.trim() || '';
                } else if (pLine.includes('Key Content')) {
                  profile.securityKey = pLine.split(':')[1]?.trim() || '';
                }
              }
              
              profiles.push(profile);
            } catch (error) {
              console.log(`Không thể lấy thông tin profile: ${profileName}`);
            }
          }
        }
      }
      
      // Tạo file backup
      const backupDir = path.join(os.homedir(), 'Desktop', 'WiFi_Backup');
      await fs.ensureDir(backupDir);
      
      const backupFile = path.join(backupDir, `wifi_profiles_${new Date().toISOString().split('T')[0]}.json`);
      await fs.writeJson(backupFile, profiles, { spaces: 2 });
      
      // Tạo script khôi phục
      const restoreScript = this.generateWifiRestoreScript(profiles);
      const scriptFile = path.join(backupDir, 'restore_wifi.bat');
      await fs.writeFile(scriptFile, restoreScript);
      
      return backupDir;
    } catch (error) {
      console.error('Lỗi khi sao lưu WiFi:', error);
      throw error;
    }
  }

  private generateWifiRestoreScript(profiles: WifiProfile[]): string {
    let script = '@echo off\n';
    script += 'echo Restoring WiFi profiles...\n\n';
    
    for (const profile of profiles) {
      script += `netsh wlan add profile filename="profile_${profile.name}.xml"\n`;
    }
    
    script += '\necho WiFi profiles restored successfully!\n';
    script += 'pause\n';
    
    return script;
  }

  async flushDns(): Promise<boolean> {
    try {
      await executeCmdCommand('ipconfig /flushdns');
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa cache DNS:', error);
      throw error;
    }
  }

  async resetNetwork(): Promise<boolean> {
    try {
      await executeCmdCommand('netsh winsock reset');
      await executeCmdCommand('netsh int ip reset');
      return true;
    } catch (error) {
      console.error('Lỗi khi reset mạng:', error);
      throw error;
    }
  }

  // DNS Management
  async setCustomDNS(interfaceName: string, dnsConfig: DnsConfig): Promise<boolean> {
    try {
      // Set IPv4 DNS
      if (dnsConfig.primary) {
        await executeCmdCommand(`netsh interface ip set dns "${interfaceName}" static ${dnsConfig.primary}`);
      }
      
      if (dnsConfig.secondary) {
        await executeCmdCommand(`netsh interface ip add dns "${interfaceName}" ${dnsConfig.secondary} index=2`);
      }
      
      // Set IPv6 DNS if provided
      if (dnsConfig.ipv6?.primary) {
        await executeCmdCommand(`netsh interface ipv6 set dns "${interfaceName}" static ${dnsConfig.ipv6.primary}`);
      }
      
      if (dnsConfig.ipv6?.secondary) {
        await executeCmdCommand(`netsh interface ipv6 add dns "${interfaceName}" ${dnsConfig.ipv6.secondary} index=2`);
      }
      
      return true;
    } catch (error) {
      console.error('Lỗi khi cài đặt DNS:', error);
      throw error;
    }
  }

  async setPresetDNS(interfaceName: string, preset: string): Promise<boolean> {
    const dnsPresets: Record<string, DnsConfig> = {
      'cloudflare': {
        primary: '1.1.1.1',
        secondary: '1.0.0.1',
        ipv6: {
          primary: '2606:4700:4700::1111',
          secondary: '2606:4700:4700::1001'
        }
      },
      'google': {
        primary: '8.8.8.8',
        secondary: '8.8.4.4',
        ipv6: {
          primary: '2001:4860:4860::8888',
          secondary: '2001:4860:4860::8844'
        }
      },
      'opendns': {
        primary: '208.67.222.222',
        secondary: '208.67.220.220',
        ipv6: {
          primary: '2620:119:35::35',
          secondary: '2620:119:53::53'
        }
      },
      'adguard': {
        primary: '94.140.14.14',
        secondary: '94.140.15.15',
        ipv6: {
          primary: '2a10:50c0::ad1:ff',
          secondary: '2a10:50c0::ad2:ff'
        }
      },
      'quad9': {
        primary: '9.9.9.9',
        secondary: '149.112.112.112',
        ipv6: {
          primary: '2620:fe::fe',
          secondary: '2620:fe::9'
        }
      },
      'norton': {
        primary: '199.85.126.10',
        secondary: '199.85.127.10'
      },
      'cleanbrowsing': {
        primary: '185.228.168.9',
        secondary: '185.228.169.9'
      },
      'alternate': {
        primary: '76.76.19.19',
        secondary: '76.76.2.0'
      }
    };

    const config = dnsPresets[preset];
    if (!config) {
      throw new Error(`Không tìm thấy preset DNS: ${preset}`);
    }

    return await this.setCustomDNS(interfaceName, config);
  }

  async clearDNS(interfaceName: string): Promise<boolean> {
    try {
      // Reset to DHCP DNS
      await executeCmdCommand(`netsh interface ip set dns "${interfaceName}" dhcp`);
      await executeCmdCommand(`netsh interface ipv6 set dns "${interfaceName}" dhcp`);
      return true;
    } catch (error) {
      console.error('Lỗi khi xóa DNS:', error);
      throw error;
    }
  }

  // IPv6 Management
  async disableIPv6(): Promise<boolean> {
    try {
      // Disable IPv6 on all interfaces
      await executeCmdCommand('netsh interface ipv6 set global ipv6=disabled');
      await executeCmdCommand('netsh interface ipv6 set interface "Local Area Connection" ipv6=disabled');
      await executeCmdCommand('netsh interface ipv6 set interface "Wi-Fi" ipv6=disabled');
      return true;
    } catch (error) {
      console.error('Lỗi khi tắt IPv6:', error);
      throw error;
    }
  }

  async enableIPv6(): Promise<boolean> {
    try {
      // Enable IPv6 on all interfaces
      await executeCmdCommand('netsh interface ipv6 set global ipv6=enabled');
      await executeCmdCommand('netsh interface ipv6 set interface "Local Area Connection" ipv6=enabled');
      await executeCmdCommand('netsh interface ipv6 set interface "Wi-Fi" ipv6=enabled');
      return true;
    } catch (error) {
      console.error('Lỗi khi bật IPv6:', error);
      throw error;
    }
  }

  async getIPv6Status(): Promise<boolean> {
    try {
      const { stdout } = await executeCmdCommand('netsh interface ipv6 show global');
      return !stdout.includes('IPv6 = Disabled');
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái IPv6:', error);
      return false;
    }
  }

  // Network Optimization
  async optimizeNetwork(optimization: NetworkOptimization): Promise<boolean> {
    try {
      if (optimization.disableIPv6) {
        await this.disableIPv6();
      }

      if (optimization.optimizeTCP) {
        // Optimize TCP settings
        await executeCmdCommand('netsh int tcp set global autotuninglevel=normal');
        await executeCmdCommand('netsh int tcp set global chimney=enabled');
        await executeCmdCommand('netsh int tcp set global ecncapability=enabled');
        await executeCmdCommand('netsh int tcp set global timestamps=enabled');
      }

      if (optimization.increaseBufferSize) {
        // Increase network buffer size
        await executeCmdCommand('netsh int tcp set global rss=enabled');
        await executeCmdCommand('netsh int tcp set global maxsynretransmissions=2');
      }

      if (optimization.disableNagle) {
        // Không có tham số 'nagle' trong netsh. Giữ chỗ, không thực thi sai lệnh.
        // Có thể thực hiện qua Registry nếu cần nhưng tránh thay đổi hệ thống mặc định ở bản an toàn.
      }

      if (optimization.optimizeDNS) {
        // Trả về DHCP DNS cho tất cả adapter khả dụng thay vì hardcode tên
        try {
          const { stdout } = await executeCmdCommand('netsh interface show interface');
          const lines = stdout.split('\n');
          const names: string[] = [];
          for (const line of lines) {
            const match = line.match(/Enabled\s+\w+\s+\w+\s+(.*)$/);
            if (match && match[1]) {
              const name = match[1].trim();
              if (name && name !== 'Interface Name') names.push(name);
            }
          }
          for (const name of names) {
            try { await executeCmdCommand(`netsh interface ip set dns "${name}" dhcp`); } catch {}
            try { await executeCmdCommand(`netsh interface ipv6 set dns "${name}" dhcp`); } catch {}
          }
        } catch {}
      }

      return true;
    } catch (error) {
      console.error('Lỗi khi tối ưu mạng:', error);
      throw error;
    }
  }

  // Proxy Management
  async setProxy(config: ProxyConfig): Promise<boolean> {
    try {
      if (config.enabled) {
        const proxyString = `${config.server}:${config.port}`;
        await executeCmdCommand(`netsh winhttp set proxy ${proxyString}`);
        
        // Set proxy for specific protocols if needed
        if (config.username && config.password) {
          // Note: Windows doesn't support username/password in netsh
          console.log('Username/password proxy requires manual configuration');
        }
        
        if (config.bypass && config.bypass.length > 0) {
          const bypassList = config.bypass.join(';');
          await executeCmdCommand(`netsh winhttp set proxy ${proxyString} bypass-list="${bypassList}"`);
        }
      } else {
        await executeCmdCommand('netsh winhttp reset proxy');
      }
      
      return true;
    } catch (error) {
      console.error('Lỗi khi cài đặt proxy:', error);
      throw error;
    }
  }

  async getProxyStatus(): Promise<{ enabled: boolean; server?: string; bypass?: string[] }> {
    try {
      const { stdout } = await executeCmdCommand('netsh winhttp show proxy');
      
      if (stdout.includes('Direct access')) {
        return { enabled: false };
      }
      
      const serverMatch = stdout.match(/Proxy Server\(s\):\s*(.+)/);
      const bypassMatch = stdout.match(/Bypass List:\s*(.+)/);
      
      return {
        enabled: true,
        server: serverMatch?.[1]?.trim(),
        bypass: bypassMatch?.[1]?.split(';').map(s => s.trim())
      };
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái proxy:', error);
      return { enabled: false };
    }
  }

  // Get SpeedSmart servers from API
  async getSpeedTestServers(): Promise<SpeedTestServer[]> {
    try {
      console.log('🌐 Lấy danh sách server từ SpeedSmart API...');
      
      const response = await fetch('https://speedsmart.net/resources/2.0/serversJSON.php');
      const data: SpeedTestServerList = await response.json();
      
      // Filter and sort servers by distance (closer to Vietnam first)
      const vietnamServers = data.serverList.filter(server => 
        server.country === 'vn' || 
        server.country === 'sg' || 
        server.country === 'hk' || 
        server.country === 'id' ||
        server.country === 'bd' ||
        server.country === 'in' ||
        server.country === 'kr' ||
        server.country === 'jp'
      );
      
      // Sort by distance (ascending)
      vietnamServers.sort((a, b) => {
        const distanceA = parseFloat(a.distance.replace(' mi', ''));
        const distanceB = parseFloat(b.distance.replace(' mi', ''));
        return distanceA - distanceB;
      });
      
      console.log(`📡 Tìm thấy ${vietnamServers.length} server gần Việt Nam`);
      vietnamServers.slice(0, 5).forEach(server => {
        console.log(`  - ${server.serverName} (${server.country.toUpperCase()}) - ${server.distance}`);
      });
      
      return vietnamServers;
    } catch (error) {
      console.error('❌ Lỗi khi lấy danh sách server:', error);
      // Fallback to default servers
      return [
        {
          count: 0,
          serverID: 41,
          serverName: "Ho Chi Minh City, VN",
          latitude: "10.775976",
          longitude: "106.695133",
          download_url: "https://hcm.speedsmart.net/download_data.php",
          upload_url: "https://hcm.speedsmart.net/upload.php",
          ping_url: "https://hcm.speedsmart.net/ping.txt",
          country: "vn",
          distance: "0 mi",
          default: true
        },
        {
          count: 1,
          serverID: 9,
          serverName: "Singapore",
          latitude: "1.701",
          longitude: "103.822",
          download_url: "https://sg.speedsmart.net/download_data.php",
          upload_url: "https://sg.speedsmart.net/upload.php",
          ping_url: "https://sg.speedsmart.net/ping.txt",
          country: "sg",
          distance: "1061 km",
          default: false
        }
      ];
    }
  }

  // Network Speed Test - Enhanced version with Single & Multi-thread
  async testNetworkSpeed(selectedServerID?: number): Promise<SpeedTestResult> {
    try {
      console.log('🌐 Bắt đầu test tốc độ mạng với SpeedSmart servers...');
      
      // Get available servers
      const servers = await this.getSpeedTestServers();
      let selectedServer: SpeedTestServer;
      
      if (selectedServerID) {
        selectedServer = servers.find(s => s.serverID === selectedServerID) || servers[0];
      } else {
        // Use closest server (first in sorted list)
        selectedServer = servers[0];
      }
      
      console.log(`🎯 Sử dụng server: ${selectedServer.serverName} (${selectedServer.distance})`);
      
      const testStartTime = Date.now();
      
      // Test latency to selected server (common for both)
      console.log('🏓 Testing latency...');
      const latencyResults = await this.testServerLatency(selectedServer.ping_url);
      const latency = latencyResults.latency;
      const jitter = latencyResults.jitter;

      // Test Single-Thread Speed
      console.log('🔄 Testing Single-Thread Speed...');
      const singleThreadResults = await this.testSingleThreadSpeed(selectedServer);
      
      // Test Multi-Thread Speed  
      console.log('⚡ Testing Multi-Thread Speed...');
      const multiThreadResults = await this.testMultiThreadSpeed(selectedServer);

      const testDuration = Date.now() - testStartTime;

      console.log(`📊 Speed test results with ${selectedServer.serverName}:`);
      console.log(`🔄 Single-Thread - Download: ${singleThreadResults.downloadSpeed} Mbps, Upload: ${singleThreadResults.uploadSpeed} Mbps`);
      console.log(`⚡ Multi-Thread - Download: ${multiThreadResults.downloadSpeed} Mbps, Upload: ${multiThreadResults.uploadSpeed} Mbps`); 
      console.log(`🏓 Latency: ${latency} ms, Jitter: ${jitter} ms`);

      return {
        singleThread: {
          downloadSpeed: singleThreadResults.downloadSpeed,
          uploadSpeed: singleThreadResults.uploadSpeed,
          latency,
          jitter
        },
        multiThread: {
          downloadSpeed: multiThreadResults.downloadSpeed,
          uploadSpeed: multiThreadResults.uploadSpeed,
          latency,
          jitter
        },
        serverUsed: selectedServer.serverName,
        testDuration: Math.round(testDuration / 1000)
      };
    } catch (error) {
      console.error('❌ Lỗi khi test tốc độ mạng:', error);
      return {
        singleThread: {
          downloadSpeed: 0,
          uploadSpeed: 0,
          latency: 0,
          jitter: 0
        },
        multiThread: {
          downloadSpeed: 0,
          uploadSpeed: 0,
          latency: 0,
          jitter: 0
        },
        serverUsed: 'Error',
        testDuration: 0
      };
    }
  }

  // Test Single-Thread Speed
  private async testSingleThreadSpeed(server: SpeedTestServer): Promise<{ downloadSpeed: number; uploadSpeed: number }> {
    console.log('🔄 Testing single-thread speed...');
    
    try {
      // Test download single-thread
      const downloadSpeed = await this.testSingleThreadDownload(server);
      
      // Test upload single-thread  
      const uploadSpeed = await this.testSingleThreadUpload(server);
      
      return {
        downloadSpeed: Math.round(downloadSpeed * 100) / 100,
        uploadSpeed: Math.round(uploadSpeed * 100) / 100
      };
    } catch (error) {
      console.error('Lỗi khi test single-thread:', error);
      return { downloadSpeed: 0, uploadSpeed: 0 };
    }
  }

  // Test Multi-Thread Speed
  private async testMultiThreadSpeed(server: SpeedTestServer): Promise<{ downloadSpeed: number; uploadSpeed: number }> {
    console.log('⚡ Testing multi-thread speed...');
    
    try {
      // Test download multi-thread (parallel connections)
      const downloadSpeed = await this.testMultiThreadDownload(server);
      
      // Test upload multi-thread (parallel connections)
      const uploadSpeed = await this.testMultiThreadUpload(server);
      
      return {
        downloadSpeed: Math.round(downloadSpeed * 100) / 100,
        uploadSpeed: Math.round(uploadSpeed * 100) / 100
      };
    } catch (error) {
      console.error('Lỗi khi test multi-thread:', error);
      return { downloadSpeed: 0, uploadSpeed: 0 };
    }
  }

  private async testServerLatency(pingUrl: string): Promise<{ latency: number; jitter: number }> {
    try {
      console.log('🏓 Testing latency to SpeedSmart server...');
      
      // Extract hostname from ping URL
      const url = new URL(pingUrl);
      const hostname = url.hostname;
      
      return await this.testLatency(hostname);
    } catch (error) {
      console.error('Lỗi khi test server latency:', error);
      return { latency: 0, jitter: 0 };
    }
  }

  // Single-Thread Download Test
  private async testSingleThreadDownload(server: SpeedTestServer): Promise<number> {
    console.log('📥 Testing single-thread download speed...');
    
    const singleThreadScript = `
      try {
        Write-Host "Starting single-thread download test..."
        
        $downloadUrl = "${server.download_url}"
        Write-Host "Server: ${server.serverName}"
        
        $speeds = @()
          $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
        
        # Single connection, 20-second test with large data
        $testStartTime = [System.Diagnostics.Stopwatch]::StartNew()
        $testDuration = 10000  # 10 seconds for accurate measurement
        $testCount = 0
        $totalDownloaded = 0
        
        Write-Host "🔄 Single-thread test for 10 seconds..."
        
        while ($testStartTime.ElapsedMilliseconds -lt $testDuration) {
          try {
            $testCount++
              $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $data = $webClient.DownloadData($downloadUrl)
              $stopwatch.Stop()
              
            $elapsedSeconds = $stopwatch.ElapsedMilliseconds / 1000
            $totalDownloaded += $data.Length
            
            if ($elapsedSeconds -gt 0 -and $data.Length -gt 0) {
              $speedMbps = ($data.Length * 8) / ($elapsedSeconds * 1000000)
              $speeds += $speedMbps
              Write-Host "Test #$testCount - $speedMbps Mbps (Downloaded: $([math]::Round($totalDownloaded/1MB, 2)) MB)"
            }
            
            # Stop if we've downloaded enough data (target ~1GB for single-thread)
            if ($totalDownloaded -gt 1000MB) { break }
            
            Start-Sleep -Milliseconds 500
            
            } catch {
            Write-Host "Test #$testCount failed - $_"
          }
          
          if ($testStartTime.ElapsedMilliseconds -ge $testDuration) { break }
        }
        
        $webClient.Dispose()
        
        if ($speeds.Count -gt 0) {
          $sortedSpeeds = $speeds | Sort-Object
          $medianSpeed = $sortedSpeeds[[math]::Floor($speeds.Count / 2)]
          Write-Host "🔄 Single-thread median: $medianSpeed Mbps"
          Write-Output $medianSpeed
          } else {
          Write-Output "0"
        }
      } catch {
        Write-Host "Single-thread download error: $_"
        Write-Output "0"
      }
    `;

    try {
      const { stdout: result } = await executePowerShellScript(singleThreadScript);
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const speed = parseFloat(lastLine) || 0;
      console.log('🔄 Single-thread download:', speed, 'Mbps');
      return speed;
    } catch (error) {
      console.log('Single-thread download failed:', error);
      return 0;
    }
  }

  // Multi-Thread Download Test
  private async testMultiThreadDownload(server: SpeedTestServer): Promise<number> {
    console.log('⚡ Testing multi-thread download speed...');
    
    const multiThreadScript = `
      try {
        Write-Host "Starting multi-thread download test..."
        
        $downloadUrl = "${server.download_url}"
        Write-Host "Server: ${server.serverName}"
        
        $speeds = @()
        $jobs = @()
        $threadCount = 10  # 10 parallel connections for maximum throughput
        
        Write-Host "⚡ Multi-thread test with $threadCount connections for 10 seconds..."
        
        # Create script block for parallel execution
        $scriptBlock = {
          param($url, $threadId)
          
          try {
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            
            $testStartTime = [System.Diagnostics.Stopwatch]::StartNew()
            $testDuration = 10000  # 10 seconds for fast download test
            $threadSpeeds = @()
            $testCount = 0
            $totalDownloaded = 0
            
            while ($testStartTime.ElapsedMilliseconds -lt $testDuration) {
              try {
                $testCount++
              $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                $data = $webClient.DownloadData($url)
              $stopwatch.Stop()
              
                $elapsedSeconds = $stopwatch.ElapsedMilliseconds / 1000
                $totalDownloaded += $data.Length
                
                if ($elapsedSeconds -gt 0 -and $data.Length -gt 0) {
                  $speedMbps = ($data.Length * 8) / ($elapsedSeconds * 1000000)
                  $threadSpeeds += $speedMbps
                  Write-Host "Thread $threadId Test #$testCount - $speedMbps Mbps (Downloaded: $([math]::Round($totalDownloaded/1MB, 2)) MB)"
                }
                
                # Stop if we've downloaded enough data (target ~1GB total across all threads)
                if ($totalDownloaded -gt 100MB) { break }
                
                Start-Sleep -Milliseconds 200
                
              } catch {
                Write-Host "Thread $threadId Test #$testCount failed: $_"
              }
              
              if ($testStartTime.ElapsedMilliseconds -ge $testDuration) { break }
            }
            
            $webClient.Dispose()
            
            if ($threadSpeeds.Count -gt 0) {
              $avgSpeed = ($threadSpeeds | Measure-Object -Average).Average
              Write-Host "Thread $threadId average: $avgSpeed Mbps"
              return $avgSpeed
              } else {
              return 0
              }
            
            } catch {
            Write-Host "Thread $threadId error: $_"
            return 0
          }
        }
        
        # Start parallel jobs
        for ($i = 1; $i -le $threadCount; $i++) {
          $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $downloadUrl, $i
          $jobs += $job
        }
        
        # Wait for all jobs to complete
        $results = $jobs | Wait-Job | Receive-Job
        $jobs | Remove-Job
        
        # Calculate total speed (sum of all threads)
        $totalSpeed = ($results | Measure-Object -Sum).Sum
        Write-Host "⚡ Multi-thread total: $totalSpeed Mbps"
        Write-Output $totalSpeed
        
        } catch {
        Write-Host "Multi-thread download error: $_"
          Write-Output "0"
        }
      `;

    try {
      const { stdout: result } = await executePowerShellScript(multiThreadScript, 60000); // 60 seconds timeout
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const speed = parseFloat(lastLine) || 0;
      console.log('⚡ Multi-thread download:', speed, 'Mbps');
      return speed;
    } catch (error) {
      console.log('Multi-thread download failed:', error);
      return 0;
    }
  }

  // Single-Thread Upload Test
  private async testSingleThreadUpload(server: SpeedTestServer): Promise<number> {
    console.log('📤 Testing single-thread upload speed...');
    
    const singleUploadScript = `
      try {
        Write-Host "Starting single-thread upload test..."
        
        $uploadUrl = "${server.upload_url}"
        Write-Host "Server: ${server.serverName}"
        
        # Create test data (100MB for single-thread to reach 1GB target)
        $testData = [System.Text.Encoding]::UTF8.GetBytes("x" * 100000000)  # 100MB chunks
        Write-Host "Test data size: $([math]::Round($testData.Length/1MB, 2)) MB"
        
        $speeds = @()
        
        # Single connection, 20-second test
        $testStartTime = [System.Diagnostics.Stopwatch]::StartNew()
        $testDuration = 10000  # 10 seconds for upload test
        $testCount = 0
        $totalUploaded = 0
        
        Write-Host "🔄 Single-thread upload for 20 seconds..."
        
        while ($testStartTime.ElapsedMilliseconds -lt $testDuration) {
          try {
            $testCount++
            $webClient = New-Object System.Net.WebClient
            $webClient.Headers.Add("Content-Type", "application/octet-stream")
            $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
            
            $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
            $response = $webClient.UploadData($uploadUrl, "POST", $testData)
            $stopwatch.Stop()
            
            $elapsedSeconds = $stopwatch.ElapsedMilliseconds / 1000
            $totalUploaded += $testData.Length
            
            if ($elapsedSeconds -gt 0) {
              $speedMbps = ($testData.Length * 8) / ($elapsedSeconds * 1000000)
              $speeds += $speedMbps
              Write-Host "Test #$testCount - $speedMbps Mbps (Uploaded: $([math]::Round($totalUploaded/1MB, 2)) MB)"
            }
            
            $webClient.Dispose()
            
            # Stop if we've uploaded enough data (target ~1GB for single-thread)
            if ($totalUploaded -gt 1000MB) { break }
            
            Start-Sleep -Milliseconds 1000
            
          } catch {
            Write-Host "Test #$testCount failed - $_"
          }
          
          if ($testStartTime.ElapsedMilliseconds -ge $testDuration) { break }
        }
        
        if ($speeds.Count -gt 0) {
          $sortedSpeeds = $speeds | Sort-Object
          $medianSpeed = $sortedSpeeds[[math]::Floor($speeds.Count / 2)]
          Write-Host "🔄 Single-thread upload median: $medianSpeed Mbps"
          Write-Output $medianSpeed
        } else {
          Write-Output "0"
        }
      } catch {
        Write-Host "Single-thread upload error: $_"
        Write-Output "0"
      }
    `;

    
    
    try {
      const { stdout: result } = await executePowerShellScript(singleUploadScript);
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const speed = parseFloat(lastLine) || 0;
      console.log('🔄 Single-thread upload:', speed, 'Mbps');
      return speed;
      } catch (error) {
      console.log('Single-thread upload failed:', error);
      return 0;
    }
  }

  // Multi-Thread Upload Test
  private async testMultiThreadUpload(server: SpeedTestServer): Promise<number> {
    console.log('⚡ Testing multi-thread upload speed...');
    
    const multiUploadScript = `
      try {
        Write-Host "Starting multi-thread upload test..."
        
        $uploadUrl = "${server.upload_url}"
        Write-Host "Server: ${server.serverName}"
        
        # Create test data (100MB per thread for 1GB total target)
        $testData = [System.Text.Encoding]::UTF8.GetBytes("x" * 100000000)  # 100MB per thread
        Write-Host "Test data size per thread: $([math]::Round($testData.Length/1MB, 2)) MB"
        
        $threadCount = 10  # 10 parallel upload connections for maximum throughput
        $jobs = @()
        
        Write-Host "⚡ Multi-thread upload with $threadCount connections for 10 seconds..."
        
        # Create script block for parallel upload
        $scriptBlock = {
          param($url, $data, $threadId)
          
          try {
            $testStartTime = [System.Diagnostics.Stopwatch]::StartNew()
            $testDuration = 10000  # 10 seconds for upload test test
            $threadSpeeds = @()
            $testCount = 0
            $totalUploaded = 0
            
            while ($testStartTime.ElapsedMilliseconds -lt $testDuration) {
              try {
                $testCount++
                $webClient = New-Object System.Net.WebClient
                $webClient.Headers.Add("Content-Type", "application/octet-stream")
                $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                
                $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
                $response = $webClient.UploadData($url, "POST", $data)
                $stopwatch.Stop()
                
                $elapsedSeconds = $stopwatch.ElapsedMilliseconds / 1000
                $totalUploaded += $data.Length
                
                if ($elapsedSeconds -gt 0) {
                  $speedMbps = ($data.Length * 8) / ($elapsedSeconds * 1000000)
                  $threadSpeeds += $speedMbps
                  Write-Host "Thread $threadId Test #$testCount - $speedMbps Mbps (Uploaded: $([math]::Round($totalUploaded/1MB, 2)) MB)"
                }
                
                $webClient.Dispose()
                
                # Stop if we've uploaded enough data (target ~1GB total across all threads)
                if ($totalUploaded -gt 100MB) { break }
                
                Start-Sleep -Milliseconds 500
                
              } catch {
                Write-Host "Thread $threadId Test #$testCount failed: $_"
              }
              
              if ($testStartTime.ElapsedMilliseconds -ge $testDuration) { break }
            }
            
            if ($threadSpeeds.Count -gt 0) {
              $avgSpeed = ($threadSpeeds | Measure-Object -Average).Average
              Write-Host "Thread $threadId average: $avgSpeed Mbps"
              return $avgSpeed
            } else {
              return 0
            }
            
          } catch {
            Write-Host "Thread $threadId error: $_"
            return 0
          }
        }
        
        # Start parallel upload jobs
        for ($i = 1; $i -le $threadCount; $i++) {
          $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $uploadUrl, $testData, $i
          $jobs += $job
        }
        
        # Wait for all jobs and sum results
        $results = $jobs | Wait-Job | Receive-Job
        $jobs | Remove-Job
        
        $totalSpeed = ($results | Measure-Object -Sum).Sum
        Write-Host "⚡ Multi-thread upload total: $totalSpeed Mbps"
        Write-Output $totalSpeed
        
      } catch {
        Write-Host "Multi-thread upload error: $_"
        Write-Output "0"
      }
    `;

    try {
      const { stdout: result } = await executePowerShellScript(multiUploadScript, 60000); // 60 seconds timeout
      const lines = result.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const speed = parseFloat(lastLine) || 0;
      console.log('⚡ Multi-thread upload:', speed, 'Mbps');
      return speed;
    } catch (error) {
      console.log('Multi-thread upload failed:', error);
      return 0;
    }
  }

  private async testLatency(host: string): Promise<{ latency: number; jitter: number }> {
    try {
      const { stdout: pingResult } = await executeCmdCommand(`ping -n 10 ${host}`);
      console.log('Ping result:', pingResult);
      
      const latencyMatch = pingResult.match(/Average = (\d+)ms/);
      const latency = latencyMatch ? parseInt(latencyMatch[1]) : 0;

      // Calculate jitter from ping results with better precision
      const timeMatches = pingResult.match(/time=(\d+)ms/g);
      let jitter = 0;
      if (timeMatches && timeMatches.length > 1) {
        const times = timeMatches.map(match => parseInt(match.replace('time=', '').replace('ms', '')));
        const differences = [];
        for (let i = 1; i < times.length; i++) {
          differences.push(Math.abs(times[i] - times[i-1]));
        }
        if (differences.length > 0) {
          jitter = differences.reduce((sum, diff) => sum + diff, 0) / differences.length;
        }
      }

      return { latency, jitter };
    } catch (error) {
      console.error('Lỗi khi test latency:', error);
      return { latency: 0, jitter: 0 };
    }
  }

  // Get current DNS settings
  async getCurrentDNS(interfaceName: string): Promise<DnsConfig> {
    try {
      const { stdout } = await executeCmdCommand(`netsh interface ip show dns "${interfaceName}"`);
      const lines = stdout.split('\n');
      
      const dnsConfig: DnsConfig = { primary: 'Unknown' };
      
      for (const line of lines) {
        if (line.includes('DNS servers configured through DHCP')) {
          // DHCP DNS
          return { primary: 'DHCP' };
        } else if (line.includes('Statically Configured DNS Servers')) {
          const dnsMatch = line.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g);
          if (dnsMatch) {
            dnsConfig.primary = dnsMatch[0];
            if (dnsMatch[1]) {
              dnsConfig.secondary = dnsMatch[1];
            }
          }
        }
      }
      
      return dnsConfig;
    } catch (error) {
      console.error('Lỗi khi lấy cài đặt DNS:', error);
      return { primary: 'Unknown' };
    }
  }
} 