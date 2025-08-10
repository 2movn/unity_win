declare module 'systeminformation' {
  export interface CpuData {
    manufacturer: string;
    brand: string;
    physicalCores: number;
    cores: number;
    speed: number;
    speedMax: number;
    socket: string;
    family: string;
    model: string;
    stepping: string;
    revision: string;
    cache: {
      l1d: number;
      l1i: number;
      l2: number;
      l3: number;
    };
    flags: string[];
    virtualization: boolean;
  }

  export interface MemData {
    total: number;
    used: number;
    free: number;
    active: number;
    available: number;
    swaptotal: number;
    swapused: number;
    swapfree: number;
    modules?: any[];
  }

  export interface MemLayoutData {
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
  }

  export interface DiskLayoutData {
    device: string;
    type: string;
    name: string;
    size: number;
    temperature?: number;
  }

  export interface GraphicsData {
    controllers: Array<{
      vendor: string;
      model: string;
      bus: string;
      vram?: number;
      vramDynamic?: boolean;
      driverVersion?: string;
      cores?: number;
      pciBus?: string;
      subDeviceId?: string;
    }>;
    displays?: any[];
  }

  export interface NetworkInterfaceData {
    iface: string;
    ifaceName?: string;
    ip4?: string;
    ip4subnet?: string;
    ip6?: string;
    mac?: string;
    internal: boolean;
    virtual: boolean;
    operstate?: string;
    type?: string;
    duplex?: string;
    mtu?: number;
    speed?: number;
    dhcp?: boolean;
  }

  export interface OsData {
    platform: string;
    distro: string;
    release: string;
    codename: string;
    arch: string;
    hostname: string;
    fqdn: string;
    codepage: string;
    logofile: string;
    serial: string;
    build: string;
    servicepack: string;
    uefi: boolean;
    kernel: string;
  }

  export interface SystemData {
    manufacturer: string;
    model: string;
    version: string;
    serial: string;
    uuid: string;
    sku: string;
    virtual: boolean;
  }

  export interface BiosData {
    vendor: string;
    version: string;
    releaseDate: string;
    revision: string;
  }

  export interface ProcessData {
    pid: number;
    name: string;
    cpu: number;
    memRss: number;
    command: string;
  }

  export interface ProcessList {
    all: number;
    running: number;
    blocked: number;
    sleeping: number;
    list: ProcessData[];
  }

  export interface CurrentLoadData {
    avgLoad: number;
    currentLoad: number;
    currentLoadUser: number;
    currentLoadSystem: number;
    currentLoadNice: number;
    currentLoadIdle: number;
    currentLoadIowait: number;
    currentLoadIrq: number;
    currentLoadSoftirq: number;
    currentLoadSteal: number;
    currentLoadGuest: number;
    currentLoadGuestNice: number;
    rawCurrentLoad: number;
    rawCurrentLoadUser: number;
    rawCurrentLoadSystem: number;
    rawCurrentLoadNice: number;
    rawCurrentLoadIdle: number;
    rawCurrentLoadIowait: number;
    rawCurrentLoadIrq: number;
    rawCurrentLoadSoftirq: number;
    rawCurrentLoadSteal: number;
    rawCurrentLoadGuest: number;
    rawCurrentLoadGuestNice: number;
    cpus: any[];
  }

  export interface CpuTemperatureData {
    main: number;
    cores: number[];
    max: number;
    socket: number[];
    chipset: number;
  }

  export interface FsSizeData {
    fs: string;
    type: string;
    size: number;
    used: number;
    available: number;
    use: number;
    mount: string;
  }

  export function cpu(): Promise<CpuData>;
  export function mem(): Promise<MemData>;
  export function memLayout(): Promise<MemLayoutData[]>;
  export function diskLayout(): Promise<DiskLayoutData[]>;
  export function graphics(): Promise<GraphicsData>;
  export function networkInterfaces(): Promise<NetworkInterfaceData[]>;
  export function osInfo(): Promise<OsData>;
  export function system(): Promise<SystemData>;
  export function bios(): Promise<BiosData>;
  export function processes(): Promise<ProcessList>;
  export function currentLoad(): Promise<CurrentLoadData>;
  export function cpuTemperature(): Promise<CpuTemperatureData>;
  export function fsSize(): Promise<FsSizeData[]>;
} 