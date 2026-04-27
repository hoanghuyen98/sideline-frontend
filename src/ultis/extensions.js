import { isToday, isYesterday, format } from 'date-fns'

export function formatTime(dateStr) {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    // Nếu là hôm nay → chỉ hiển thị giờ:phút
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  // Nếu là ngày khác → hiển thị dd/mm hh:mm
  return date
    .toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', '')
}

export function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null

  for (const msg of messages) {
    const msgDate = safeParseDate(msg.time)
    if (!msgDate) {
      groups.push({ isLabel: false, ...msg })
      continue
    }

    const dateKey = msgDate.toDateString()

    if (dateKey !== currentDate) {
      currentDate = dateKey

      let label = ''
      if (isToday(msgDate)) label = 'Today'
      else if (isYesterday(msgDate)) label = 'Yesterday'
      else label = format(msgDate, 'dd/MM/yyyy')

      groups.push({ isLabel: true, label })
    }

    groups.push({ isLabel: false, ...msg })
  }

  return groups
}

export function formatLocal(dateStr) {
  if (!dateStr) return ''

  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false, // 24h
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function safeParseDate(value) {
  if (!value) return null
  const d = new Date(value)
  return isNaN(d.getTime()) ? null : d
}
