// Formats a price in INR using the Indian lakh/crore convention,
// e.g. 6500000 -> "₹65.0 L", 28500000 -> "₹2.85 Cr"
export function formatINR(value) {
  const n = Number(value) || 0;
  if (n >= 1_00_00_000) {
    return `₹${trimZero(n / 1_00_00_000)} Cr`;
  }
  if (n >= 1_00_000) {
    return `₹${trimZero(n / 1_00_000)} L`;
  }
  return `₹${formatIndianGroups(n)}`;
}

function trimZero(num) {
  return Number(num.toFixed(2)).toString();
}

// Groups digits the Indian way: 12,34,567 instead of 1,234,567
export function formatIndianGroups(value) {
  const n = Math.round(Number(value) || 0);
  const isNegative = n < 0;
  const str = Math.abs(n).toString();

  if (str.length <= 3) return (isNegative ? "-" : "") + str;

  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");

  return `${isNegative ? "-" : ""}${grouped},${last3}`;
}

export function formatArea(sqft) {
  const n = Number(sqft) || 0;
  return `${formatIndianGroups(n)} sqft`;
}

export function timeAgo(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString.replace(" ", "T") + "Z");
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.round(diffDay / 30);
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${Math.round(diffMonth / 12)}y ago`;
}
