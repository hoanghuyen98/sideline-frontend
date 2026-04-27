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
    <Employee />
</template>

<script setup>
import Employee from '../pages/Employee.vue';
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
</script>
