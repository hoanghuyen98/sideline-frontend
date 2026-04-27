import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import apiServices from '@/services/api.services'

const CACHE_KEY = 'inbox_cache'
const CACHE_TIMESTAMP_KEY = 'inbox_cache_timestamp'
const CACHE_TTL = 0.5 * 60 * 1000 // (ms)

export const useMessageStore = defineStore('messageStore', () => {
  const selectedPhoneNumber = ref(null)
  const dataMessage = reactive({
    contacts: [],
    conversations: {},
  })

  const saveCache = () => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataMessage))
      sessionStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (e) {
    }
  }

  const loadCache = () => {
    const cache = sessionStorage.getItem(CACHE_KEY)
    const timestamp = sessionStorage.getItem(CACHE_TIMESTAMP_KEY)

    if (!cache || !timestamp) return false

    try {
      const data = JSON.parse(cache)
      if (Date.now() - Number(timestamp) < CACHE_TTL) {
        Object.assign(dataMessage, data)
        return true
      }
    } catch (err) {
      clearCache()
    }
    return false
  }

  const clearCache = () => {
    sessionStorage.removeItem(CACHE_KEY)
    sessionStorage.removeItem(CACHE_TIMESTAMP_KEY)
    dataMessage.contacts = []
    dataMessage.conversations = {}
  }

  const fetchInboxHistory = async (phone_number, force = false) => {
    // const cacheOk = loadCache()
    // if (!force && cacheOk) return // Nếu cache hợp lệ thì bỏ qua API

    try {
      const response = await apiServices.getInboxHistory(phone_number)
      if (response && response.results) {
        Object.assign(dataMessage, response.results)
        saveCache()
      } else {
        dataMessage.contacts = []
        dataMessage.conversations = {}
      }
    } catch (error) {
    }
  }

  return {
    selectedPhoneNumber,
    dataMessage,
    fetchInboxHistory,
    clearCache,
  }
})

// dataMessage = {
//   results: {
//     contacts: [
//       {
//         phone: '14143483232',
//         name: '(414) 348-3232',
//       },
//       {
//         phone: '18573675730',
//         name: '(857) 367-5730',
//       },
//     ],
//     conversations: {
//       14143483232: [
//         {
//           direction: 'out',
//           text: 'B',
//           image:
//             'https://pingerprod01usw2-pb-mmspics.s3.amazonaws.com/communications/2198368894/2025/68fe0805c377f5.65217786.png',
//           time: '2025-10-26 11:37:42.180269',
//         },
//         {
//           direction: 'out',
//           text: 'asdfsdf',
//           image:
//             'https://pingerprod01usw2-pb-mmspics.s3.amazonaws.com/communications/2198368894/2025/68fe0805c377f5.65217786.png',
//           time: '2025-10-29 18:36:37.828657',
//         },
//       ],
//       16307796196: [
//         {
//           direction: 'out',
//           text: "Uncle, it's been a long time since I contacted you. How are you?",
//           image: null,
//           time: '2025-10-29 15:22:34.715301',
//         },
//       ],
//     },
//   },
// }
