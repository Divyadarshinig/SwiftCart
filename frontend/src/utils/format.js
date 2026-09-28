// Indian Rupee formatter
// Usage: formatPrice(1499.5) => "₹1,499.50"

export const formatPrice = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};