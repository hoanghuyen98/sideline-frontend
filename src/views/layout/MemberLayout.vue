<template>
    <div class="h-screen flex flex-col font-inter text-gray-900">
        <div v-if="loadingStore.isLoading"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <button type="button" disabled class="bg-indigo-400 rounded-lg text-white font-bold">
                <div class="flex items-center justify-center m-2">
                    <div
                        class="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4">
                    </div>
                    <div class="ml-2">Processing...</div>
                </div>
            </button>
        </div>

        <div v-if="accountDisabled" class="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
            <div class="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
                <p class="text-red-600 font-semibold text-lg mb-3">{{ disabledMessage }}</p>

                <button @click="logout"
                    class="w-full bg-red-500 text-white p-2 rounded-lg font-medium hover:bg-red-600 cursor-pointer">
                    Logout
                </button>
            </div>
        </div>

        <header class="bg-[#07a94b] flex items-center justify-between h-[72px] px-6 text-white shadow-sm">
            <!-- Left section -->
            <div class="flex items-center gap-3">
                <div class="flex items-center gap-2">
                    <nav class="flex items-center gap-3 text-white">
                        <img src="https://messages.sidelline.com/assets/images/logo_light.svg" alt="Logo" class="h-8" />

                        <a href="#" class="text-white text-base font-medium border-b-2 border-white pb-0.5">Inbox</a>

                    </nav>
                </div>
            </div>

            <!-- Right section -->
            <div class="relative">
                <!-- Dropdown trigger -->
                <div @click="toggleDropdown"
                    class="flex items-center gap-1 cursor-pointer text-lg font-medium select-none">
                    {{ currentPhone }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 fill-current" viewBox="0 0 16 16">
                        <path
                            d="M3.204 5.21a.5.5 0 0 1 .707 0L8 9.293l4.089-4.083a.5.5 0 1 1 .707.707l-4.442 4.44a.5.5 0 0 1-.708 0L3.204 5.917a.5.5 0 0 1 0-.707z" />
                    </svg>
                </div>

                <!-- Dropdown menu -->
                <transition name="fade">
                    <div v-if="dropdownOpen"
                        class="absolute right-0 mt-2 w-64 bg-white text-gray-700 rounded-md shadow border text-sm z-50">
                        <div class="flex justify-between items-center px-4 py-2 hover:bg-gray-50">
                            <span>Desktop Notifications</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer" v-model="notificationsEnabled" />
                                <div
                                    class="w-10 h-5 bg-gray-300 peer-checked:bg-green-500 rounded-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:h-4 after:w-4 after:rounded-full after:transition-all peer-checked:after:translate-x-5">
                                </div>
                            </label>
                        </div>

                        <hr class="border-gray-100" />

                        <a href="#" class="block px-4 py-2 hover:bg-gray-50 transition">Mark All Messages as Read</a>

                        <hr class="border-gray-100" />

                        <a href="#" class="block px-4 py-2 hover:bg-gray-50 transition">Settings</a>
                        <a href="#" class="block px-4 py-2 hover:bg-gray-50 transition">Help</a>

                        <hr class="border-gray-100" />

                        <button @click="logout"
                            class="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-500 font-medium">
                            Log Out
                        </button>
                    </div>
                </transition>
            </div>
        </header>

        <!-- MAIN content -->
        <div class="flex flex-1 overflow-hidden bg-white"
            :class="accountDisabled ? 'pointer-events-none opacity-70 select-none' : ''">
            <router-view />
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useLoadingStore } from '@/stores/loadingStore'
import TokenService from '@/services/token.service'
import apiServices from "@/services/api.services";
import { useMessageStore } from '@/stores/messageStore'

const loadingStore = useLoadingStore()
const store = useMessageStore()
const dropdownOpen = ref(false)
const currentPhone = computed(() => {
    return TokenService.getCookieByKey('user_name') || 'User'
})
const notificationsEnabled = ref(false)
const accountDisabled = ref(false)
const disabledMessage = ref("")

const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value
}

const logout = () => {
    TokenService.clearAll()
    window.location.href = '/login'
}

const fetchUserInfo = async () => {
    try {
        loadingStore.show()
        const res = await apiServices.getUserInfo()
        if (res?.customer) {
            const phone = res.customer?.phones[0].phone
            if (res.customer?.phones[0].status !== "live") {
                accountDisabled.value = true
                disabledMessage.value = "Your account has been disabled. Please contact support."
            }
            await store.fetchInboxHistory(currentPhone.value)
        }
    } catch (err) {
        console.error("Failed to fetch user info:", err)
    } finally {
        loadingStore.hide()
    }
}


onMounted(async () => {
    await fetchUserInfo()
})

</script>

<style scoped>
.font-inter {
    font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto,
        'Helvetica Neue', Arial, sans-serif;
}

/* Hiệu ứng dropdown */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>