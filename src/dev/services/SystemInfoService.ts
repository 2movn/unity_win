import * as si from 'systeminformation';
import { exec } from 'child_process';
import { promisify } from 'util';
import { executePowerShellScript, executeCmdCommand } from './CommandHelper';

export interface SystemInfo {
  hostname: string;
  manufacturer: string;
  model: string;
  serial: string;
  uuid: string;
  sku: string;
  os: {
    platform: string;
    distro: string;
    release: string;
    arch: string;
    hostname: string;
    codename: string;
    kernel: string;
    build: string;
    servicepack: string;
    uefi: boolean;
  };
  serviceTag?: string | undefined;
  bios: {
    vendor: string;
    version: string;
    release: string;
    revision: string;
  };
}

export interface CpuInfo {
  manufacturer: string;
  brand: string;
  physicalCores: number;
  cores: number;
  speed: number;
  speedMax: number;
  socket: string;
  cache: {
    l1d: number;
    l1i: number;
    l2: number;
    l3: number;
  };
  flags: string[];
  virtualization: boolean;
  family: string;
  model: string;
  stepping: string;
  revision: string;
}

export interface MemoryInfo {
  total: number;
  used: number;
  free: number;
  active: number;
  available: number;
  swaptotal: number;
  swapused: number;
  swapfree: number;
  modules: Array<{
    size: number;
    bank: string;
    type: string;
    clockSpeed: number;
    formFactor: string;
    manufacturer: string;
    partNum: string;
    serialNum: string;
    voltageConfigured: number;
    voltageMin: number;
    voltageMax: number;
  }>;
}

export interface DiskInfo {
  size: number;
  used: number;
  available: number;
  fsType: string;
  mount: string;
  label: string;
  uuid: string;
  type: string;
}

export interface GpuInfo {
  model: string;
  vendor: string;
  vram: number;
  driverVersion: string;
  memory: number;
  cores: number;
  bus: string;
  pciBus: string;
  subDeviceId?: string;
  vramDynamic?: boolean;
  displays?: Array<{
    vendor: string;
    model: string;
    deviceName: string;
    main: boolean;
    builtin: boolean;
    connection: string;
    resolutionX: number;
    resolutionY: number;
    sizeX: number;
    sizeY: number;
    pixelDepth: number;
    currentResX: number;
    currentResY: number;
    positionX: number;
    positionY: number;
    currentRefreshRate: number;
  }>;
}

export class SystemInfoService {
  async getSystemInfo(): Promise<SystemInfo> {
    try {
      const [system, os, bios] = await Promise.all([
        si.system(),
        si.osInfo(),
        si.bios()
      ]);

      
      // Lấy Service Tag bằng PowerShell (an toàn hơn)
      let serviceTag: string | undefined;
      try {
        const { stdout } = await executePowerShellScript('Get-WmiObject -Class Win32_BIOS | Select-Object -ExpandProperty SerialNumber');
        serviceTag = stdout.trim() || undefined;
      } catch (error) {
        console.log('Không thể lấy Service Tag (có thể bình thường):', error);
      }

      return {
        hostname: (system as any).hostname || os.hostname,
        manufacturer: system.manufacturer,
        model: system.model,
        serial: system.serial,
        uuid: system.uuid,
        sku: system.sku,
        os: {
          platform: os.platform,
          distro: os.distro,
          release: os.release,
          arch: os.arch,
          hostname: os.hostname,
          codename: os.codename,
          kernel: os.kernel,
          build: os.build,
          servicepack: os.servicepack,
          uefi: os.uefi
        },
        serviceTag,
        bios: {
          vendor: bios.vendor,
          version: bios.version,
          release: (bios as any).release || '',
          revision: bios.revision
        }
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin hệ thống:', error);
      throw error;
    }
  }

  async getCpuInfo(): Promise<CpuInfo> {
    try {
      const cpu = await si.cpu();
      return {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        physicalCores: cpu.physicalCores,
        cores: cpu.cores,
        speed: cpu.speed,
        speedMax: cpu.speedMax,
        socket: cpu.socket,
        cache: {
          l1d: cpu.cache.l1d,
          l1i: cpu.cache.l1i,
          l2: cpu.cache.l2,
          l3: cpu.cache.l3
        },
        flags: Array.isArray(cpu.flags) ? cpu.flags : [cpu.flags],
        virtualization: cpu.virtualization,
        family: cpu.family,
        model: cpu.model,
        stepping: cpu.stepping,
        revision: cpu.revision
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin CPU:', error);
      throw error;
    }
  }

  async getMemoryInfo(): Promise<MemoryInfo> {
    try {
      const [mem, memLayout] = await Promise.all([
        si.mem(),
        si.memLayout()
      ]);

      return {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        active: mem.active,
        available: mem.available,
        swaptotal: mem.swaptotal,
        swapused: mem.swapused,
        swapfree: mem.swapfree,
        modules: memLayout.map(module => ({
          size: module.size,
          bank: module.bank,
          type: module.type,
          clockSpeed: module.clockSpeed || 0,
          formFactor: module.formFactor,
          manufacturer: module.manufacturer,
          partNum: module.partNum,
          serialNum: module.serialNum,
          voltageConfigured: (module as any).voltageConfigured || 0,
          voltageMin: (module as any).voltageMin || 0,
          voltageMax: (module as any).voltageMax || 0
        }))
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin RAM:', error);
      throw error;
    }
  }

  async getDiskInfo(): Promise<DiskInfo[]> {
    try {
      const fsSize = await si.fsSize();

      return fsSize.map(fs => ({
        size: fs.size,
        used: fs.used,
        available: fs.available,
        fsType: fs.type,
        mount: fs.mount,
        label: fs.mount,
        uuid: fs.mount,
        type: fs.type
      }));
    } catch (error) {
      console.error('Lỗi khi lấy thông tin ổ cứng:', error);
      throw error;
    }
  }

  async getGpuInfo(): Promise<GpuInfo[]> {
    try {
      const gpu = await si.graphics();

      
      // Lấy thông tin chi tiết bằng PowerShell
      let detailedGpuInfo: any[] = [];
      try {
        const { stdout } = await executePowerShellScript('Get-WmiObject -Class Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, VideoProcessor, PNPDeviceID, VideoMemoryType | ConvertTo-Json');
        detailedGpuInfo = JSON.parse(stdout);
        if (!Array.isArray(detailedGpuInfo)) {
          detailedGpuInfo = [detailedGpuInfo];
        }

      } catch (psError) {
        console.error('Lỗi khi lấy thông tin GPU chi tiết:', psError);
      }
      
      return gpu.controllers.map((controller, index) => {
        const psInfo = detailedGpuInfo[index] || {};
        
        return {
          model: controller.model || psInfo.Name || 'Unknown',
          vendor: controller.vendor || 'Unknown',
          vram: controller.vram || (psInfo.AdapterRAM ? Math.round(psInfo.AdapterRAM / 1024 / 1024) : 0),
          driverVersion: psInfo.DriverVersion || controller.driverVersion || 'N/A',
          memory: controller.vram || (psInfo.AdapterRAM ? Math.round(psInfo.AdapterRAM / 1024 / 1024) : 0),
          cores: controller.cores || 0,
          bus: controller.bus || 'Unknown',
          pciBus: controller.pciBus || psInfo.PNPDeviceID || 'Unknown',
          subDeviceId: controller.subDeviceId,
          vramDynamic: controller.vramDynamic,
          displays: gpu.displays
        };
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin GPU:', error);
      // Fallback: thử lấy bằng PowerShell
      try {
        const { stdout } = await executePowerShellScript('Get-WmiObject -Class Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion, VideoProcessor, PNPDeviceID | ConvertTo-Json');
        const gpuData = JSON.parse(stdout);

        
        if (Array.isArray(gpuData)) {
          return gpuData.map((gpu: any) => ({
            model: gpu.Name || 'Unknown',
            vendor: 'Unknown',
            vram: gpu.AdapterRAM ? Math.round(gpu.AdapterRAM / 1024 / 1024) : 0,
            driverVersion: gpu.DriverVersion || 'N/A',
            memory: gpu.AdapterRAM ? Math.round(gpu.AdapterRAM / 1024 / 1024) : 0,
            cores: 0,
            bus: 'Unknown',
            pciBus: gpu.PNPDeviceID || 'Unknown',
            subDeviceId: undefined,
            vramDynamic: undefined,
            displays: []
          }));
        } else {
          return [{
            model: gpuData.Name || 'Unknown',
            vendor: 'Unknown',
            vram: gpuData.AdapterRAM ? Math.round(gpuData.AdapterRAM / 1024 / 1024) : 0,
            driverVersion: gpuData.DriverVersion || 'N/A',
            memory: gpuData.AdapterRAM ? Math.round(gpuData.AdapterRAM / 1024 / 1024) : 0,
            cores: 0,
            bus: 'Unknown',
            pciBus: gpuData.PNPDeviceID || 'Unknown',
            subDeviceId: undefined,
            vramDynamic: undefined,
            displays: []
          }];
        }
      } catch (psError) {
        console.error('Lỗi khi lấy thông tin GPU bằng PowerShell:', psError);
        return [{
          model: 'Unknown GPU',
          vendor: 'Unknown',
          vram: 0,
          driverVersion: 'N/A',
          memory: 0,
          cores: 0,
          bus: 'Unknown',
          pciBus: 'Unknown',
          subDeviceId: undefined,
          vramDynamic: undefined,
          displays: []
        }];
      }
    }
  }

  async getDetailedSystemInfo() {
    try {
      const [system, cpu, memory, disk, gpu, network, os, bios] = await Promise.all([
        this.getSystemInfo(),
        this.getCpuInfo(),
        this.getMemoryInfo(),
        this.getDiskInfo(),
        this.getGpuInfo(),
        si.networkInterfaces(),
        si.osInfo(),
        si.bios()
      ]);

      return {
        system,
        cpu,
        memory,
        disk,
        gpu,
        network,
        os,
        bios
      };
    } catch (error) {
      console.error('Lỗi khi lấy thông tin chi tiết hệ thống:', error);
      throw error;
    }
  }
} 