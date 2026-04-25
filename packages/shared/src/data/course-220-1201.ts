import type { Domain, Video } from "../types/course.js";

export const DOMAINS_220_1201: Domain[] = [
  {
    id: "1",
    exam: "220-1201",
    name: "Mobile Devices",
    number: 1,
    percentage: 13,
    objectives: [
      {
        id: "1.1",
        description:
          "Given a scenario, install and configure laptop hardware and components.",
        subTopics: [
          "Hardware/device replacement (battery, keyboard, RAM, HDD/SSD, wireless cards)",
          "Physical privacy and security components",
        ],
      },
      {
        id: "1.2",
        description:
          "Compare and contrast the display components of mobile devices.",
        subTopics: [
          "Types of displays (LCD, OLED, etc.)",
          "Mobile device accessories and ports",
          "Connection methods (USB-C, Lightning, Bluetooth, NFC)",
        ],
      },
      {
        id: "1.3",
        description:
          "Given a scenario, set up and configure accessories and ports of mobile devices.",
        subTopics: [
          "Mobile device connectivity (Bluetooth, NFC, cellular, WiFi)",
          "Mobile device management (MDM)",
          "Mobile device synchronization",
        ],
      },
    ],
  },
  {
    id: "2",
    exam: "220-1201",
    name: "Networking",
    number: 2,
    percentage: 23,
    objectives: [
      {
        id: "2.1",
        description: "Compare and contrast TCP and UDP ports, protocols, and their purposes.",
        subTopics: [
          "Ports and protocols (HTTP/80, HTTPS/443, SSH/22, DNS/53, RDP/3389, etc.)",
          "TCP vs. UDP",
          "Connectionless vs. connection-oriented",
        ],
      },
      {
        id: "2.2",
        description: "Compare and contrast common networking hardware.",
        subTopics: [
          "Wireless standards (802.11a/b/g/n/ac/ax)",
          "Frequencies and channels",
          "Wireless encryption (WPA2, WPA3)",
        ],
      },
      {
        id: "2.3",
        description: "Given a scenario, install and configure a basic wired/wireless SOHO network.",
        subTopics: [
          "Network services (DNS, DHCP, NTP, file sharing, print services)",
          "Router/switch/AP configuration",
        ],
      },
      {
        id: "2.4",
        description: "Compare and contrast common networking services.",
        subTopics: [
          "DNS configuration",
          "DHCP",
          "VLANs and VPNs",
          "Network address translation (NAT)",
        ],
      },
      {
        id: "2.5",
        description: "Given a scenario, install and configure common networking devices.",
        subTopics: [
          "Routers, switches, access points",
          "Firewalls, modems",
          "Patch panels, PoE",
        ],
      },
      {
        id: "2.6",
        description: "Compare and contrast common network configuration concepts.",
        subTopics: [
          "IPv4 vs. IPv6",
          "Subnet masks, CIDR notation",
          "DHCP, static, APIPA addressing",
          "Default gateways",
        ],
      },
      {
        id: "2.7",
        description: "Compare and contrast Internet connection types and network types.",
        subTopics: [
          "Internet connection types (fiber, cable, DSL, satellite, cellular)",
          "Network types (LAN, WAN, PAN, MAN, SAN, WLAN)",
        ],
      },
      {
        id: "2.8",
        description: "Given a scenario, use networking tools.",
        subTopics: [
          "Crimpers, cable testers, loopback plugs",
          "WiFi analyzers, tone generators/probes",
          "Punchdown tools",
        ],
      },
    ],
  },
  {
    id: "3",
    exam: "220-1201",
    name: "Hardware",
    number: 3,
    percentage: 25,
    objectives: [
      {
        id: "3.1",
        description: "Explain basic cable types and their connectors, features, and purposes.",
        subTopics: [
          "Display types and attributes",
          "Resolution, brightness, response time",
        ],
      },
      {
        id: "3.2",
        description: "Given a scenario, install the appropriate RAM.",
        subTopics: [
          "Network cables (Cat 5/5e/6/6a/8)",
          "568A and 568B wiring standards",
          "Optical fiber (single-mode, multi-mode)",
          "Peripheral cables (USB types)",
          "Video cables (HDMI, DisplayPort, VGA, DVI)",
          "Storage cables (SATA, IDE)",
          "Adapters and converters",
          "Copper and fiber connectors",
        ],
      },
      {
        id: "3.3",
        description: "Given a scenario, select and install storage devices.",
        subTopics: [
          "RAM types (DDR3/DDR4/DDR5)",
          "DIMM, SO-DIMM form factors",
          "Memory technologies and channels",
        ],
      },
      {
        id: "3.4",
        description: "Given a scenario, install and configure motherboards, CPUs, and add-on cards.",
        subTopics: [
          "Storage devices (HDD, SSD, NVMe, M.2)",
          "RAID levels (0, 1, 5, 10)",
        ],
      },
      {
        id: "3.5",
        description: "Given a scenario, install or replace the appropriate power supply.",
        subTopics: [
          "Motherboard form factors (ATX, microATX, Mini-ITX)",
          "Expansion slots (PCIe)",
          "Motherboard connections and compatibility",
          "BIOS/UEFI settings",
          "HSM and TPM",
          "CPU features and sockets",
          "Expansion cards",
          "Cooling solutions",
        ],
      },
      {
        id: "3.6",
        description: "Given a scenario, deploy and configure multifunction devices/printers.",
        subTopics: [
          "Power supply types and connectors",
          "ATX, CPU, PCIe, SATA power",
          "Wattage and efficiency ratings",
        ],
      },
      {
        id: "3.7",
        description: "Given a scenario, install and replace printer consumables.",
        subTopics: [
          "Multifunction devices (print, scan, copy, fax)",
          "Device sharing and connectivity",
        ],
      },
      {
        id: "3.8",
        description: "Given a scenario, install and maintain printers.",
        subTopics: [
          "Laser printer maintenance",
          "Inkjet printers and maintenance",
          "Thermal printers and maintenance",
          "Impact printers and maintenance",
        ],
      },
    ],
  },
  {
    id: "4",
    exam: "220-1201",
    name: "Virtualization and Cloud Computing",
    number: 4,
    percentage: 11,
    objectives: [
      {
        id: "4.1",
        description: "Summarize cloud-computing concepts.",
        subTopics: [
          "Virtualization concepts",
          "Hypervisor types (Type 1, Type 2)",
          "Virtual machine resource requirements",
          "Virtualization services",
        ],
      },
      {
        id: "4.2",
        description: "Summarize virtualization concepts.",
        subTopics: [
          "Cloud models (IaaS, PaaS, SaaS, DaaS)",
          "Cloud deployment (public, private, hybrid, community)",
          "Cloud characteristics (elasticity, scalability, multitenancy)",
        ],
      },
    ],
  },
  {
    id: "5",
    exam: "220-1201",
    name: "Hardware and Network Troubleshooting",
    number: 5,
    percentage: 28,
    objectives: [
      {
        id: "5.1",
        description:
          "Given a scenario, apply the best practice methodology to resolve problems.",
        subTopics: [
          "Troubleshooting hardware issues",
          "POST codes, beep codes",
          "No power, overheating, BSOD",
          "Boot failures, performance issues",
        ],
      },
      {
        id: "5.2",
        description:
          "Given a scenario, troubleshoot problems related to motherboards, RAM, CPU, and power.",
        subTopics: [
          "Troubleshooting storage devices",
          "Drive not recognized, boot errors",
          "RAID failure, I/O errors",
        ],
      },
      {
        id: "5.3",
        description: "Given a scenario, troubleshoot and diagnose problems with storage drives and RAID arrays.",
        subTopics: [
          "Display issues",
          "No display, artifacts, flickering",
          "Resolution and color problems",
        ],
      },
      {
        id: "5.4",
        description:
          "Given a scenario, troubleshoot video, projector, and display issues.",
        subTopics: [
          "Mobile device troubleshooting",
          "Battery, touchscreen, connectivity issues",
        ],
      },
      {
        id: "5.5",
        description:
          "Given a scenario, troubleshoot common issues with mobile devices.",
        subTopics: [
          "Network connectivity issues",
          "IP conflicts, slow speeds",
          "Limited connectivity, DNS issues",
        ],
      },
      {
        id: "5.6",
        description: "Given a scenario, troubleshoot and resolve printer issues.",
        subTopics: [
          "Printer troubleshooting",
          "Paper jams, print quality issues",
          "Connectivity, driver problems",
        ],
      },
    ],
  },
];

export const VIDEOS_220_1201: Video[] = [
  // Domain 1 — Mobile Devices
  { id: "1.1-laptop-hardware", title: "Laptop Hardware", domainId: "1", objectiveId: "1.1", exam: "220-1201", youtubeId: "zODZ0i-Iark", order: 1 },
  { id: "1.2-connecting-mobile", title: "Connecting Mobile Devices", domainId: "1", objectiveId: "1.2", exam: "220-1201", youtubeId: "Iis2-_89YvQ", order: 2 },
  { id: "1.2-mobile-accessories", title: "Mobile Device Accessories", domainId: "1", objectiveId: "1.2", exam: "220-1201", youtubeId: "14iM8lLBS0c", order: 3 },
  { id: "1.3-mobile-networks", title: "Mobile Device Networks", domainId: "1", objectiveId: "1.3", exam: "220-1201", youtubeId: "1LADZLBV3vo", order: 4 },
  { id: "1.3-mobile-management", title: "Mobile Device Management", domainId: "1", objectiveId: "1.3", exam: "220-1201", youtubeId: "NhGi9M4JP7g", order: 5 },

  // Domain 2 — Networking
  { id: "2.1-intro-ip", title: "Introduction to IP", domainId: "2", objectiveId: "2.1", exam: "220-1201", youtubeId: "RRFjKXxYJdM", order: 6 },
  { id: "2.1-common-ports", title: "Common Ports", domainId: "2", objectiveId: "2.1", exam: "220-1201", youtubeId: "_qGlbfZ44hg", order: 7 },
  { id: "2.2-wireless-tech", title: "Wireless Network Technologies", domainId: "2", objectiveId: "2.2", exam: "220-1201", youtubeId: "aTuaEk5hnAs", order: 8 },
  { id: "2.3-network-services", title: "Network Services", domainId: "2", objectiveId: "2.3", exam: "220-1201", youtubeId: "Z-9mkqi2ELI", order: 9 },
  { id: "2.4-dns-config", title: "DNS Configuration", domainId: "2", objectiveId: "2.4", exam: "220-1201", youtubeId: "lAHqO9sDVy4", order: 10 },
  { id: "2.4-dhcp", title: "DHCP", domainId: "2", objectiveId: "2.4", exam: "220-1201", youtubeId: "HwUqCZFx6wk", order: 11 },
  { id: "2.4-vlans-vpns", title: "VLANs and VPNs", domainId: "2", objectiveId: "2.4", exam: "220-1201", youtubeId: "Z1wPgxsx4GI", order: 12 },
  { id: "2.5-network-devices", title: "Network Devices", domainId: "2", objectiveId: "2.5", exam: "220-1201", youtubeId: "0hd6_bx0ydo", order: 13 },
  { id: "2.6-ipv4-ipv6", title: "IPv4 and IPv6", domainId: "2", objectiveId: "2.6", exam: "220-1201", youtubeId: "yubEz-ZEVwY", order: 14 },
  { id: "2.6-assigning-ip", title: "Assigning IP Addresses", domainId: "2", objectiveId: "2.6", exam: "220-1201", youtubeId: "nU5ko6cQWmc", order: 15 },
  { id: "2.7-internet-types", title: "Internet Connection Types", domainId: "2", objectiveId: "2.7", exam: "220-1201", youtubeId: "iN2QnGFl06E", order: 16 },
  { id: "2.7-network-types", title: "Network Types", domainId: "2", objectiveId: "2.7", exam: "220-1201", youtubeId: "PBEXIMeqRNY", order: 17 },
  { id: "2.8-network-tools", title: "Network Tools", domainId: "2", objectiveId: "2.8", exam: "220-1201", youtubeId: "CHQQgjtrhYU", order: 18 },

  // Domain 3 — Hardware
  { id: "3.1-display-types", title: "Display Types", domainId: "3", objectiveId: "3.1", exam: "220-1201", youtubeId: "xOyialyd4JU", order: 19 },
  { id: "3.1-display-attributes", title: "Display Attributes", domainId: "3", objectiveId: "3.1", exam: "220-1201", youtubeId: "fmrWo8swzyU", order: 20 },
  { id: "3.2-network-cables", title: "Network Cables", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "29X5Ho3m2KU", order: 21 },
  { id: "3.2-568-colors", title: "568A and 568B Colors", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "1w42VC2_JYo", order: 22 },
  { id: "3.2-optical-fiber", title: "Optical Fiber", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "poQdq2APqic", order: 23 },
  { id: "3.2-peripheral-cables", title: "Peripheral Cables", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "JGuVE-3CvT4", order: 24 },
  { id: "3.2-video-cables", title: "Video Cables", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "FK1b4stA2hk", order: 25 },
  { id: "3.2-storage-cables", title: "Storage Cables", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "YM4pig2XYCo", order: 26 },
  { id: "3.2-adapters-converters", title: "Adapters and Converters", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "3GkSvmeuhe8", order: 27 },
  { id: "3.2-copper-connectors", title: "Copper Connectors", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "VO8C3lrWlVU", order: 28 },
  { id: "3.2-fiber-connectors", title: "Fiber Connectors", domainId: "3", objectiveId: "3.2", exam: "220-1201", youtubeId: "Qxbp-c23cYY", order: 29 },
  { id: "3.3-memory-overview", title: "An Overview of Memory", domainId: "3", objectiveId: "3.3", exam: "220-1201", youtubeId: "JylKt1N6o0I", order: 30 },
  { id: "3.3-memory-tech", title: "Memory Technologies", domainId: "3", objectiveId: "3.3", exam: "220-1201", youtubeId: "HU-qsVtpnM0", order: 31 },
  { id: "3.4-storage-devices", title: "Storage Devices", domainId: "3", objectiveId: "3.4", exam: "220-1201", youtubeId: "UfLNl8-c9VM", order: 32 },
  { id: "3.4-raid", title: "RAID", domainId: "3", objectiveId: "3.4", exam: "220-1201", youtubeId: "5E16qftlfRY", order: 33 },
  { id: "3.5-motherboards", title: "Motherboards", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "dbxM_LFMXpw", order: 34 },
  { id: "3.5-expansion-slots", title: "Motherboard Expansion Slots", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "QvPX1XJwJH8", order: 35 },
  { id: "3.5-connections", title: "Motherboard Connections", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "UjJwjjwa6Q0", order: 36 },
  { id: "3.5-compatibility", title: "Motherboard Compatibility", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "O5wA53NYv1M", order: 37 },
  { id: "3.5-bios", title: "The BIOS", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "TgUxAM8rjyg", order: 38 },
  { id: "3.5-bios-settings", title: "BIOS Settings", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "QfJkU0vD3gg", order: 39 },
  { id: "3.5-hsm-tpm", title: "HSM and TPM", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "qLSV_lpM_Mk", order: 40 },
  { id: "3.5-cpu-features", title: "CPU Features", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "4RPVQQd2sOM", order: 41 },
  { id: "3.5-expansion-cards", title: "Expansion Cards", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "KtipbKR8rqo", order: 42 },
  { id: "3.5-cooling", title: "Cooling", domainId: "3", objectiveId: "3.5", exam: "220-1201", youtubeId: "qC306MGytR8", order: 43 },
  { id: "3.6-computer-power", title: "Computer Power", domainId: "3", objectiveId: "3.6", exam: "220-1201", youtubeId: "gK0SYCnWoIM", order: 44 },
  { id: "3.7-multifunction-devices", title: "Multifunction Devices", domainId: "3", objectiveId: "3.7", exam: "220-1201", youtubeId: "ctAOL7WyEUY", order: 45 },
  { id: "3.8-laser-maintenance", title: "Laser Printer Maintenance", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "hp2DfL6KxwA", order: 46 },
  { id: "3.8-inkjet-printers", title: "Inkjet Printers", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "qIIiTWNnWuQ", order: 47 },
  { id: "3.8-inkjet-maintenance", title: "Inkjet Printer Maintenance", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "yRjKpaQQw1k", order: 48 },
  { id: "3.8-thermal-printers", title: "Thermal Printers", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "izk4zbSkUTg", order: 49 },
  { id: "3.8-thermal-maintenance", title: "Thermal Printer Maintenance", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "emKON9CAjks", order: 50 },
  { id: "3.8-impact-printers", title: "Impact Printers", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "wkSlTGmPlWU", order: 51 },
  { id: "3.8-impact-maintenance", title: "Impact Printer Maintenance", domainId: "3", objectiveId: "3.8", exam: "220-1201", youtubeId: "KCLqKxFsEOM", order: 52 },

  // Domain 4 — Virtualization and Cloud Computing
  { id: "4.1-virt-concepts", title: "Virtualization Concepts", domainId: "4", objectiveId: "4.1", exam: "220-1201", youtubeId: "xXOIdDWUNGU", order: 53 },
  { id: "4.1-virt-services", title: "Virtualization Services", domainId: "4", objectiveId: "4.1", exam: "220-1201", youtubeId: "wPB_C7hOY-8", order: 54 },
  { id: "4.2-cloud-models", title: "Cloud Models", domainId: "4", objectiveId: "4.2", exam: "220-1201", youtubeId: "KZxAY5ssUxc", order: 55 },
  { id: "4.2-cloud-characteristics", title: "Cloud Characteristics", domainId: "4", objectiveId: "4.2", exam: "220-1201", youtubeId: "XzNnFbY0dMQ", order: 56 },

  // Domain 5 — Hardware and Network Troubleshooting
  { id: "5.1-troubleshoot-hardware", title: "Troubleshooting Hardware", domainId: "5", objectiveId: "5.1", exam: "220-1201", youtubeId: "HgeURynWn_w", order: 57 },
  { id: "5.2-troubleshoot-storage", title: "Troubleshooting Storage Devices", domainId: "5", objectiveId: "5.2", exam: "220-1201", youtubeId: "aVIuyHCNPCE", order: 58 },
  { id: "5.3-troubleshoot-display", title: "Troubleshooting Display Issues", domainId: "5", objectiveId: "5.3", exam: "220-1201", youtubeId: "KXZu72i1eX8", order: 59 },
  { id: "5.4-troubleshoot-mobile", title: "Troubleshooting Mobile Devices", domainId: "5", objectiveId: "5.4", exam: "220-1201", youtubeId: "huQwiY4kiko", order: 60 },
  { id: "5.5-troubleshoot-networks", title: "Troubleshooting Networks", domainId: "5", objectiveId: "5.5", exam: "220-1201", youtubeId: "VBDS_kOHhVk", order: 61 },
  { id: "5.6-troubleshoot-printers", title: "Troubleshooting Printers", domainId: "5", objectiveId: "5.6", exam: "220-1201", youtubeId: "_BhO_nYod0o", order: 62 },
];

export const TOTAL_VIDEOS = VIDEOS_220_1201.length;

export function getVideosByDomain(domainId: string): Video[] {
  return VIDEOS_220_1201.filter((v) => v.domainId === domainId);
}

export function getVideosByObjective(objectiveId: string): Video[] {
  return VIDEOS_220_1201.filter((v) => v.objectiveId === objectiveId);
}

export function getDomain(domainId: string): Domain | undefined {
  return DOMAINS_220_1201.find((d) => d.id === domainId);
}
