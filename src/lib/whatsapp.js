const STORE_PHONE = import.meta.env.VITE_STORE_WHATSAPP || '+213XXXXXXXXX'

export function buildOrderMessage({ name, phone, city, address, apartment, notes, items, total, t }) {
  const itemLines = items
    .map(item => {
      const lang = localStorage.getItem('language') || 'en'
      const productName = item.product[`name_${lang}`] || item.product.name_en
      return `- ${productName} x${item.quantity} (${item.selectedVolume}) — ${item.product.price * item.quantity} MAD`
    })
    .join('\n')

  const fullAddress = apartment ? `${address}, ${apartment}, ${city}` : `${address}, ${city}`

  const message = `${t('whatsapp.new_order')}
${t('whatsapp.name')}: ${name}
${t('whatsapp.phone')}: ${phone}
${t('whatsapp.address')}: ${fullAddress}

${t('whatsapp.items')}:
${itemLines}

${t('whatsapp.total')}: ${total} MAD
${notes ? `${t('whatsapp.notes')}: ${notes}` : ''}`

  return message.trim()
}

export function openWhatsApp(message) {
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${STORE_PHONE}?text=${encoded}`, '_blank')
}
