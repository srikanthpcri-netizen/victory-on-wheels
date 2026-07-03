export const servicePricing: Record<string, number> = {
  "General Service": 2499,
  "Periodic Service": 3499,
  "Major Service": 6999,
  "Express Service": 1499,
  "Engine Oil Change": 1999,
  "Brake Service": 1799,
  "AC Service": 2499,
  "Battery Check": 499,
  "Battery Replacement": 999,
  "Wheel Alignment": 799,
  "Wheel Balancing": 999,
  "Tyre Rotation": 599,
  "Suspension Check": 799,
  "Computer Diagnostics": 999,
  Denting: 2999,
  Painting: 4999,
  "Accident Repair": 9999,
  "Insurance Claim Repair": 1999,
  "Foam Wash": 499,
  "Interior Detailing": 2499,
  "Exterior Detailing": 1999,
};

export const getServicePrice = (serviceType: string) => {
  return servicePricing[serviceType] || 999;
};
