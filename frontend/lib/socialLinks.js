const sanitizePhone = (value = '') => value.replace(/[^\d]/g, '');

const whatsappNumber = sanitizePhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '');
const whatsappMessage = encodeURIComponent(
  process.env.NEXT_PUBLIC_WHATSAPP_TEXT || 'Hi, I need help with my order.'
);

export const socialLinks = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || '',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || '',
  whatsapp: whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : '',
};
