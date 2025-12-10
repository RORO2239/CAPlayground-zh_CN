// iOS device resolutions data
// Source: https://iosref.com/res

export interface DeviceSpec {
  name: string;
  width: number;
  height: number;
  category: 'iPhone' | 'iPad' | 'iPod touch';
}

export const devices: DeviceSpec[] = [
  // iPhone
  { name: 'iPhone 16 Pro Max', width: 440, height: 956, category: 'iPhone' },
  { name: 'iPhone 16 Pro', width: 402, height: 874, category: 'iPhone' },
  { name: 'iPhone 16 Plus', width: 430, height: 932, category: 'iPhone' },
  { name: 'iPhone 16', width: 393, height: 852, category: 'iPhone' },
  { name: 'iPhone 15 Pro Max', width: 430, height: 932, category: 'iPhone' },
  { name: 'iPhone 15 Pro', width: 393, height: 852, category: 'iPhone' },
  { name: 'iPhone 15 Plus', width: 430, height: 932, category: 'iPhone' },
  { name: 'iPhone 15', width: 393, height: 852, category: 'iPhone' },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932, category: 'iPhone' },
  { name: 'iPhone 14 Pro', width: 393, height: 852, category: 'iPhone' },
  { name: 'iPhone 14 Plus', width: 428, height: 926, category: 'iPhone' },
  { name: 'iPhone 14', width: 390, height: 844, category: 'iPhone' },
  { name: 'iPhone 13 Pro Max', width: 428, height: 926, category: 'iPhone' },
  { name: 'iPhone 13 Pro', width: 390, height: 844, category: 'iPhone' },
  { name: 'iPhone 13', width: 390, height: 844, category: 'iPhone' },
  { name: 'iPhone 13 mini', width: 375, height: 812, category: 'iPhone' },
  { name: 'iPhone 12 Pro Max', width: 428, height: 926, category: 'iPhone' },
  { name: 'iPhone 12 Pro', width: 390, height: 844, category: 'iPhone' },
  { name: 'iPhone 12', width: 390, height: 844, category: 'iPhone' },
  { name: 'iPhone 12 mini', width: 375, height: 812, category: 'iPhone' },
  { name: 'iPhone 11 Pro Max', width: 414, height: 896, category: 'iPhone' },
  { name: 'iPhone 11 Pro', width: 375, height: 812, category: 'iPhone' },
  { name: 'iPhone 11', width: 414, height: 896, category: 'iPhone' },
  { name: 'iPhone XS Max', width: 414, height: 896, category: 'iPhone' },
  { name: 'iPhone XS', width: 375, height: 812, category: 'iPhone' },
  { name: 'iPhone XR', width: 414, height: 896, category: 'iPhone' },
  { name: 'iPhone X', width: 375, height: 812, category: 'iPhone' },
  { name: 'iPhone 8 Plus', width: 414, height: 736, category: 'iPhone' },
  { name: 'iPhone 8', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone 7 Plus', width: 414, height: 736, category: 'iPhone' },
  { name: 'iPhone 7', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone 6s Plus', width: 414, height: 736, category: 'iPhone' },
  { name: 'iPhone 6s', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone 6 Plus', width: 414, height: 736, category: 'iPhone' },
  { name: 'iPhone 6', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone SE (3rd generation)', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone SE (2nd generation)', width: 375, height: 667, category: 'iPhone' },
  { name: 'iPhone SE (1st generation)', width: 320, height: 568, category: 'iPhone' },
  { name: 'iPhone 5s', width: 320, height: 568, category: 'iPhone' },
  { name: 'iPhone 5c', width: 320, height: 568, category: 'iPhone' },
  { name: 'iPhone 5', width: 320, height: 568, category: 'iPhone' },
  { name: 'iPhone 4s', width: 320, height: 480, category: 'iPhone' },
  { name: 'iPhone 4', width: 320, height: 480, category: 'iPhone' },
  { name: 'iPhone 3GS', width: 320, height: 480, category: 'iPhone' },
  { name: 'iPhone 3G', width: 320, height: 480, category: 'iPhone' },
  { name: 'iPhone (1st generation)', width: 320, height: 480, category: 'iPhone' },

  // iPad
  { name: 'iPad Pro 13-inch (M4)', width: 1032, height: 1376, category: 'iPad' },
  { name: 'iPad Pro 11-inch (M4)', width: 834, height: 1210, category: 'iPad' },
  { name: 'iPad Air 13-inch (M2)', width: 1032, height: 1376, category: 'iPad' },
  { name: 'iPad Air 11-inch (M2)', width: 834, height: 1210, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (6th generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 11-inch (4th generation)', width: 834, height: 1194, category: 'iPad' },
  { name: 'iPad (10th generation)', width: 820, height: 1180, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (5th generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 11-inch (3rd generation)', width: 834, height: 1194, category: 'iPad' },
  { name: 'iPad Air (5th generation)', width: 820, height: 1180, category: 'iPad' },
  { name: 'iPad (9th generation)', width: 810, height: 1080, category: 'iPad' },
  { name: 'iPad mini (6th generation)', width: 744, height: 1133, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (4th generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 11-inch (2nd generation)', width: 834, height: 1194, category: 'iPad' },
  { name: 'iPad (8th generation)', width: 810, height: 1080, category: 'iPad' },
  { name: 'iPad Air (4th generation)', width: 820, height: 1180, category: 'iPad' },
  { name: 'iPad (7th generation)', width: 810, height: 1080, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (3rd generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 11-inch (1st generation)', width: 834, height: 1194, category: 'iPad' },
  { name: 'iPad Air (3rd generation)', width: 834, height: 1112, category: 'iPad' },
  { name: 'iPad mini (5th generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad (6th generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (2nd generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 10.5-inch', width: 834, height: 1112, category: 'iPad' },
  { name: 'iPad (5th generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad Pro 12.9-inch (1st generation)', width: 1024, height: 1366, category: 'iPad' },
  { name: 'iPad Pro 9.7-inch', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad mini 4', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad Air 2', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad mini 3', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad Air', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad mini 2', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad (4th generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad mini (1st generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad (3rd generation)', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad 2', width: 768, height: 1024, category: 'iPad' },
  { name: 'iPad (1st generation)', width: 768, height: 1024, category: 'iPad' },

  // iPod touch
  { name: 'iPod touch (7th generation)', width: 320, height: 568, category: 'iPod touch' },
  { name: 'iPod touch (6th generation)', width: 320, height: 568, category: 'iPod touch' },
  { name: 'iPod touch (5th generation)', width: 320, height: 568, category: 'iPod touch' },
  { name: 'iPod touch (4th generation)', width: 320, height: 480, category: 'iPod touch' },
  { name: 'iPod touch (3rd generation)', width: 320, height: 480, category: 'iPod touch' },
  { name: 'iPod touch (2nd generation)', width: 320, height: 480, category: 'iPod touch' },
  { name: 'iPod touch (1st generation)', width: 320, height: 480, category: 'iPod touch' },
];

export function getDevicesByCategory(category: DeviceSpec['category']): DeviceSpec[] {
  return devices.filter(d => d.category === category);
}

export function getDeviceByName(name: string): DeviceSpec | undefined {
  return devices.find(d => d.name === name);
}
