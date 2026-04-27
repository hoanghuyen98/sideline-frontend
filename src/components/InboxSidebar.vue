<template>
    <aside class="w-90 border-r border-gray-200 bg-white flex flex-col">
        <!-- Header -->
        <div class="flex justify-between items-center p-4 border-b border-gray-100">
            <h2 class="text-2xl font-semibold">Inbox</h2>


            <div class="flex items-center gap-2">
                <!-- 🔄 Reload -->
                <button @click="refreshInbox"
                    class="p-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition cursor-pointer"
                    title="Reload">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12.793 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L14.086 7H12.5C8.952 7 6 9.952 6 13.5S8.952 20 12.5 20s6.5-2.952 6.5-6.5a1 1 0 1 1 2 0c0 4.652-3.848 8.5-8.5 8.5S4 18.152 4 13.5 7.848 5 12.5 5h1.586l-1.293-1.293a1 1 0 0 1 0-1.414z"
                            fill="currentColor" />
                    </svg>
                </button>

                <!-- ✏️ Edit -->
                <button class="border border-gray-300 text-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-50">
                    Edit
                </button>
            </div>
        </div>

        <!-- Conversation List -->
        <div class="flex-1 overflow-y-auto p-4">
            <div v-for="contact in contacts" :key="contact.phone" @click="select(contact.phone)"
                class="flex items-center justify-between hover:bg-blue-100 px-3 py-2 rounded-lg transition cursor-pointer"
                :class="{ 'bg-blue-200 font-semibold': selectLocal === contact.phone }">
                <div class="flex flex-1 min-w-0 items-center gap-3">
                    <!-- avatar -->
                    <div class="hidden sm:flex w-10 h-10 shrink-0 rounded-full bg-gray-200 items-center justify-center">
                        <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                    </div>
                    <!-- content message -->
                    <div class="flex-1 min-w-0">
                        <div class="font-semibold text-gray-900 truncate text-sm sm:text-base max-w-full">
                            {{ contact.name || 'Unknow' }}</div>
                        <div class="hidden sm:flex text-sm text-gray-500 items-center gap-1 truncate">
                            <template v-if="lastMessage(contact.phone)?.image">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4 4 4 4-4 6 6z" />
                                </svg>
                                <span class="truncate">Image</span>
                            </template>
                            <template v-else>
                                <span class="truncate">{{ lastMessage(contact.phone)?.text || 'No message' }}</span>
                            </template>
                        </div>
                    </div>
                </div>
                <!-- Right: Time -->
                <div class="text-xs text-gray-500 whitespace-nowrap shrink-0 pl-2 hidden sm:block">
                    {{ formatTime(lastMessage(contact.phone)?.time) }}
                </div>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useMessageStore } from '@/stores/messageStore'
import { formatTime } from '@/ultis/extensions'
import TokenService from '@/services/token.service'
import { useLoadingStore } from '@/stores/loadingStore'

const store = useMessageStore()
const selectLocal = ref()
const loadingStore = useLoadingStore()

const conversations = computed(() => store.dataMessage?.conversations || {})

const reversedConversations = computed(() => {
    const conv = conversations.value
    if (!conv) return {}

    // Lấy key theo thứ tự và đảo ngược
    const reversedKeys = Object.keys(conv).reverse()
    const result = {}
    for (const key of reversedKeys) {
        result[key] = conv[key]
    }
    return result
})

const contacts = computed(() => {
  const contactList = store.dataMessage?.contacts || []
  const reversed = reversedConversations.value

  return Object.keys(reversed).map(phone => {
    const found = contactList.find(c => c.phone === phone)
    return found || { phone, name: phone }
  })
})


const currentPhone = computed(() => {
    return TokenService.getCookieByKey('user_name') || 'User'
})

const selectedPhone = computed({
    get: () => store.selectedPhoneNumber,
    set: (v) => (store.selectedPhoneNumber = v),
})

function select(phone) {
    selectLocal.value = phone
    selectedPhone.value = phone
    // nếu muốn: load thêm history cho phone này
    // await store.fetchInboxHistory(phone)
}

const refreshInbox = async() => {
    if (currentPhone.value) {
        loadingStore.show()
        await store.fetchInboxHistory(currentPhone.value)
        loadingStore.hide()
    } else {
        // fallback nếu chưa chọn số nào
        // ví dụ: gọi store.fetchInboxOverview()
    }
}

function lastMessage(phone) {
    return conversations.value?.[phone]?.at(-1) || null
}

watch(
  () => store.selectedPhoneNumber,
  (newVal, oldVal) => {
    if (!newVal) {
      // nếu bên ngoài reset selectedPhoneNumber
      selectLocal.value = ''
    } else {
      // nếu được chọn lại thì đồng bộ
      selectLocal.value = newVal
    }
  },
  { immediate: true }
)

</script>
