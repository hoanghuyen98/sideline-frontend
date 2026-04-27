<template>
    <div v-if="loadingStore.isLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
        <button type="button" disabled class="bg-indigo-400 rounded-lg text-white font-bold">
            <div class="flex items-center justify-center m-2">
                <div class="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4">
                </div>
                <div class="ml-2">Processing...</div>
            </div>
        </button>
    </div>
    <!-- Navbar -->
    <nav class="w-full bg-white shadow-md fixed top-0 left-0 z-50">
        <div class="px-6 py-3 flex justify-end items-center">
            <!-- Thông tin user -->
            <div class="flex items-center gap-4">
                <span class="text-gray-700 font-medium">Xin chào, {{ username || 'Unknow' }}</span>
                <button @click="logout"
                    class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold transition-all duration-200 cursor-pointer">
                    Đăng xuất
                </button>
            </div>
        </div>
    </nav>
    <Admin />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Admin from '../pages/Admin.vue';
import { useLoadingStore } from '@/stores/loadingStore'
import TokenService from '@/services/token.service'
import apiServices from '@/services/api.services'

const loadingStore = useLoadingStore()

const username = ref("")

onMounted(async () => {
    username.value = TokenService.getCookieByKey("user_name") || "Unknown"
})

const logout = async () => {
    loadingStore.show()
    await apiServices.logOut()
    loadingStore.hide()
}
</script>