export function buildWhatsAppUrl(whatsappNumber: string | undefined, message: string): string {
  if (!whatsappNumber) return '#';
  const digitsOnly = whatsappNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}
