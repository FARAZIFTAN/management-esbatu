// Tier pricing calculation
export const calculatePrice = (quantity: number): number => {
  if (quantity <= 0) return 0;
  
  // Pricing tiers
  const tiers = [
    { quantity: 6, price: 10000 }, // Best value: Rp 10,000 for 6 pieces
    { quantity: 3, price: 5000 },  // Rp 5,000 for 3 pieces  
    { quantity: 1, price: 2000 }   // Rp 2,000 for 1 piece
  ];
  
  let totalPrice = 0;
  let remaining = quantity;
  
  for (const tier of tiers) {
    const packages = Math.floor(remaining / tier.quantity);
    if (packages > 0) {
      totalPrice += packages * tier.price;
      remaining -= packages * tier.quantity;
    }
  }
  
  return totalPrice;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};