<template>
    <div v-if="show" class="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
        <div class="relative p-4 w-full max-w-md max-h-full">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow-lg dark:bg-gray-700">
                <!-- Modal header -->
                <div
                    class="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200 dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                        New Message
                    </h3>
                    <button @click="close" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 1l6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>

                <!-- Modal body -->
                <div class="p-4 md:p-5">
                    <slot>
                        <form class="space-y-4" @submit.prevent="sendMessage">
                            <div>
                                <input v-model="phone"
                                    class="bg-gray-50 border border-gray-300 w-full p-2.5 text-sm rounded-lg"
                                    placeholder="e.g. 0912345678" required />
                            </div>
                            <div class="col-span-2">
                                <label for="description"
                                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Message</label>
                                <textarea v-model="message" rows="4"
                                    class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300"
                                    placeholder="Write message here"></textarea>
                            </div>
                            <button type="submit"
                                class="w-full text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg px-5 py-2.5 text-center">
                                SEND
                            </button>
                        </form>
                    </slot>
                </div>

                <!-- Modal footer (optional buttons) -->
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

const props = defineProps({
    show: { type: Boolean, default: false },
    buttons: { type: Array, default: () => [] } // [{ label, onClick, class }]
})

const phone = ref('')
const message = ref('')

const sendMessage = () => {
}

const emit = defineEmits(['update:show'])
const close = () => emit('update:show', false)
</script>
