<template>
    <div class="flex flex-1 h-full">
        <!--  Sidebar trái -->
        <InboxSidebar />

        <!--  Khu vực chat -->
        <div class="flex-1 flex flex-col">
            <!-- ✅ Compose Button header -->
            <div class="flex justify-end p-4 border-b border-gray-200 bg-white">
                <button
                    class="border border-[#50b24a] text-[#50b24a] text-sm font-medium px-4 py-1.5 rounded hover:bg-[#50b24a] hover:text-white transition cursor-pointer"
                    @click="openCompose">
                    Compose
                </button>
            </div>

            <!-- Khi chưa chọn chat -->
            <div v-if="!phoneSelected && !isComposing"
                class="flex-1 flex flex-col justify-start items-center text-gray-500 text-center p-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-13 w-13 mb-2 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 10h.01M12 10h.01M16 10h.01M21 12.98A9 9 0 1111.02 3a9 9 0 019.98 9.98z" />
                </svg>
                <p class="text-center">
                    <span class="font-semibold text-gray-600">Welcome to Sideline</span><br />
                    Select a conversation from the left to start messaging
                </p>
            </div>

            <!-- ✅ Giao diện Compose Chat -->
            <div v-if="isComposing && !phoneSelected" class="flex flex-col h-full">
                <div class="border-b border-gray-200 bg-gray-50 p-4">
                    <div class="flex items-center justify-between">
                        <input v-model="newRecipient" type="text" placeholder="Name or Number"
                            class="flex-1 px-4 py-2 border border-blue-300 rounded-md text-gray-800 focus:ring-1 focus:ring-blue-400 focus:outline-none" />
                        <button @click="cancelCompose"
                            class="ml-3 text-gray-500 hover:text-gray-700 transition text-sm cursor-pointer">
                            Cancel
                        </button>
                    </div>
                </div>

                <!-- vùng chat -->
                <div class="flex-1 flex flex-col justify-between bg-white">
                    <div class="flex-1 overflow-y-auto p-4 text-gray-500 italic text-center">
                        Start a new conversation...
                    </div>

                    <!-- 💬 Chat Input -->
                    <div class="py-2 border-t border-gray-200 bg-white flex items-center gap-2">
                        <!-- Nút ➕ mở menu -->
                        <div class="relative py-4 pl-4">
                            <button @click="toggleAttachMenu"
                                class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition cursor-pointer duration-200 transform hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </button>

                            <!-- Dropdown menu -->
                            <transition name="fade">
                                <div v-if="showAttachMenu"
                                    class="absolute bottom-18 left-0 bg-white shadow-lg rounded-lg border border-gray-300 w-40 text-sm z-50">
                                    <input ref="fileInput" type="file" accept="image/*" class="hidden"
                                        @change="handleImageUploadNewMessage" />
                                    <button @click="triggerImageSelectNewMessage"
                                        class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                        <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        Photos
                                    </button>

                                    <button
                                        class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                        <svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        PDFs
                                    </button>

                                    <button
                                        class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                        <svg class="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg"
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M9 12h6m-6 4h6m-7-8h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" />
                                        </svg>
                                        Templates
                                    </button>
                                </div>
                            </transition>
                        </div>

                        <!-- Ô nhập -->
                        <textarea v-model="newMessage" rows="1" @keydown.enter.prevent="(e) => handleEnter(e, true)"
                            class="flex-1 px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#50b24a]"
                            placeholder="Type a message..."></textarea>

                        <!-- Gửi -->
                        <button type="button" @click="sendNewMessage" :disabled="isbtnSendLoading"
                            class="p-2 mr-6 rounded-full transition cursor-pointer flex items-center justify-center"
                            :class="[
                                isbtnSendLoading
                                    ? 'bg-green-400 text-white cursor-not-allowed opacity-70'
                                    : 'bg-gray-100 text-green-500 hover:bg-green-400'
                            ]">
                            <!-- Khi đang gửi: hiện spinner -->
                            <svg v-if="isbtnSendLoading" aria-hidden="true"
                                class="w-7 h-7 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
                                viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor" />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill" />
                            </svg>

                            <!-- Khi bình thường: hiện icon gửi -->
                            <svg v-else class="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Khi đã chọn chat -->
            <div v-else-if="phoneSelected" class="flex flex-col h-full overflow-hidden">
                <!-- Chat Messages -->
                <div ref="scrollContainer" class="flex-1 overflow-y-auto py-4 px-7 space-y-4 bg-gray-50 relative">
                    <div v-for="(msg, i) in groupedMessages" :key="i">
                        <!-- Hiển thị label ngày -->
                        <div v-if="msg.isLabel" class="flex justify-center my-4">
                            <span
                                class="px-4 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-full shadow-sm">
                                {{ msg.label }}
                            </span>
                        </div>

                        <!-- Hiển thị tin nhắn -->
                        <div v-else
                            :class="msg.direction === 'out' ? 'flex flex-col items-end' : 'flex flex-col items-start'">
                            <!-- ảnh -->
                            <div v-if="msg.image" class="mb-2 relative">
                                <!-- Ảnh -->
                                <img :src="msg.image"
                                    class="max-w-xs rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                                    :class="{ 'opacity-70': msg.status === statusMessage.sending }" />

                                <!-- Overlay loading -->
                                <div v-if="msg.status === statusMessage.sending"
                                    class="absolute inset-0 flex items-center justify-center bg-black/30 bg-opacity-40 rounded-lg">
                                    <svg aria-hidden="true" class="w-10 h-10 text-gray-200 animate-spin fill-blue-600"
                                        viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M100 50.5908C100 78.2051 77.6142 
                       100.591 50 100.591C22.3858 100.591 
                       0 78.2051 0 50.5908C0 22.9766 
                       22.3858 0.59082 50 0.59082C77.6142 
                       0.59082 100 22.9766 100 50.5908Z" fill="currentColor" />
                                        <path d="M93.9676 39.0409C96.393 38.4038 
                       97.8624 35.9116 97.0079 33.5539C95.2932 
                       28.8227 92.871 24.3692 89.8167 
                       20.348C85.8452 15.1192 80.8826 
                       10.7238 75.2124 7.41289C69.5422 
                       4.10194 63.2754 1.94025 56.7698 
                       1.05124C51.7666 0.367541 46.6976 
                       0.446843 41.7345 1.27873C39.2613 
                       1.69328 37.813 4.19778 38.4501 
                       6.62326C39.0873 9.04874 41.5694 
                       10.4717 44.0505 10.1071C47.8511 
                       9.54855 51.7191 9.52689 55.5402 
                       10.0491C60.8642 10.7766 65.9928 
                       12.5457 70.6331 15.2552C75.2735 
                       17.9648 79.3347 21.5619 82.5849 
                       25.841C84.9175 28.9121 86.7997 
                       32.2913 88.1811 35.8758C89.083 
                       38.2158 91.5421 39.6781 93.9676 
                       39.0409Z" fill="currentFill" />
                                    </svg>
                                </div>

                                <!-- Overlay lỗi -->
                                <div v-if="msg.status === statusMessage.failed"
                                    class="absolute inset-0 flex items-center justify-center bg-red-600 bg-opacity-100 rounded-lg">
                                    <span class="text-white text-sm font-medium">Gửi thất bại</span>
                                </div>
                            </div>

                            <!-- văn bản -->
                            <div v-else-if="msg.text && msg.text.trim() !== ''"
                                :class="[msg.direction === 'out' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800', msg.status === statusMessage.failed ? 'opacity-70 translate-y-[2px]' : '']"
                                class="p-3 rounded-lg max-w-3xl whitespace-pre-wrap break-normal">
                                {{ msg.text }}
                            </div>

                            <!-- thời gian -->
                            <div v-if="msg.status === statusMessage.sending"
                                class="text-xs mt-1 opacity-50 text-gray-500 text-right">
                                Sending...
                            </div>
                            <div v-else-if="msg.status === statusMessage.failed"
                                class="text-xs mt-1 opacity-50 text-red-500 text-right">
                                Failed to send
                            </div>
                            <div v-else class="text-xs mt-1 opacity-70"
                                :class="msg.direction === 'out' ? 'text-right' : 'text-left'">
                                {{ formatTime(msg.time) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Chat Input -->
                <!-- 💬 Chat Input -->
                <div class="py-2 border-t border-gray-200 bg-white flex items-center gap-2">
                    <!-- Nút ➕ mở menu -->
                    <div class="relative py-4 pl-4">
                        <button @click="toggleAttachMenu"
                            class="w-11 h-11 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 transition cursor-pointer duration-200 transform hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>

                        <!-- Dropdown menu -->
                        <transition name="fade">
                            <div v-if="showAttachMenu"
                                class="absolute bottom-18 left-0 bg-white shadow-lg rounded-lg border border-gray-300 w-40 text-sm z-50">
                                <input ref="fileInput" type="file" accept="image/*" class="hidden"
                                    @change="handleImageUpload" />
                                <button @click="triggerImageSelect"
                                    class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                    <svg class="w-5 h-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-6a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Photos
                                </button>

                                <button
                                    class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                    <svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    PDFs
                                </button>

                                <button
                                    class="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 cursor-pointer">
                                    <svg class="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M9 12h6m-6 4h6m-7-8h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" />
                                    </svg>
                                    Templates
                                </button>
                            </div>
                        </transition>
                    </div>

                    <!-- Ô nhập -->
                    <textarea v-model="message" rows="1" @keydown.enter.prevent="handleEnter"
                        class="flex-1 px-4 py-3 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-[#50b24a]"
                        placeholder="Type a message..."></textarea>

                    <!-- Gửi -->
                    <button type="button" @click="sendMessage"
                        class="p-2 mr-6 bg-gray-100 text-green-500 rounded-full hover:bg-green-400 transition cursor-pointer">
                        <svg class="w-7 h-7" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed, watch } from 'vue';
import InboxSidebar from '@/components/InboxSidebar.vue'
import { useMessageStore } from '@/stores/messageStore'
import { formatTime, groupMessagesByDate } from '@/ultis/extensions'
import { statusMessage } from '@/ultis/constants';
import TokenService from '@/services/token.service'
import apiServices from '@/services/api.services'
import { useToast } from "vue-toastification"

const store = useMessageStore()
const toast = useToast()

const phoneSelected = computed(() => store.selectedPhoneNumber || '')
const conversation = computed(() => {
    return store.dataMessage?.conversations?.[phoneSelected.value] || []
})
const currentPhone = computed(() => {
    return TokenService.getCookieByKey('user_name') || 'User'
})

const scrollContainer = ref(null)

const groupedMessages = computed(() => groupMessagesByDate(conversation.value || []))

const message = ref('');

const handleEnter = (event, isNew = false) => {
    if (!event.shiftKey) {
        if (isNew) {
            sendNewMessage()
        } else {
            sendMessage();
        }
    } else {
        // Shift + Enter để xuống dòng bình thường
        message.value += '\n';
    }
};

const sendMessage = async () => {
    const msg = message.value;
    if (!msg.trim()) {
        return
    };

    // Thêm message tạm thời với status: 'sending'
    const tempMessage = {
        direction: 'out',
        text: msg,
        image: null,
        time: new Date().toLocaleString('en-GB'),
        status: statusMessage.sending, // trạng thái tạm thời
    }
    store.dataMessage.conversations[phoneSelected.value].push(tempMessage);

    // Scroll xuống cuối
    await scrollToBottom()

    message.value = ''; // reset textarea
    try {
        const res = await apiServices.postSendMessage(currentPhone.value, phoneSelected.value, msg)
        if (res.status === "success") {
            tempMessage.status = statusMessage.success
            await store.fetchInboxHistory(currentPhone.value)

        } else {
            tempMessage.status = statusMessage.failed
            store.dataMessage.conversations[phoneSelected.value] = [...store.dataMessage.conversations[phoneSelected.value]]
        }
    } catch (error) {
        tempMessage.status = statusMessage.failed
        store.dataMessage.conversations[phoneSelected.value] = [...store.dataMessage.conversations[phoneSelected.value]]
    } finally {
        await scrollToBottom()
    }
}

// ----------- nut + ------------
const showAttachMenu = ref(false)

const toggleAttachMenu = () => {
    showAttachMenu.value = !showAttachMenu.value
}
// -----------------------------

// ------------ new message --------
const isComposing = ref(false)
const newRecipient = ref('')
const newMessage = ref('')
const isbtnSendLoading = ref(false)

const isValidPhone = (number) => {
    // Cho phép các ký tự: số, khoảng trắng, ngoặc, dấu +, dấu -
    // ❌ Nếu có chữ cái thì fail ngay
    if (/[a-zA-Z]/.test(number)) {
        return false
    }

    // ✅ Nếu chỉ chứa ký tự hợp lệ
    return true
}

const sendNewMessage = async () => {
    isbtnSendLoading.value = true
    const recipientNumber = newRecipient.value.trim()
    if (!recipientNumber) {
        toast.warning("Please enter recipient phone number", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        isbtnSendLoading.value = false
        return
    }

    if (!isValidPhone(recipientNumber)) {
        toast.warning("Please enter a valid phone number", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        isbtnSendLoading.value = false
        return
    }
    const msg = newMessage.value;
    if (!msg.trim()) {
        toast.warning("Please enter a message", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        isbtnSendLoading.value = false
        return
    };

    try {
        const response = await apiServices.postSendMessage(currentPhone.value, recipientNumber, msg)
        const res = response?.response
        const statusCode = response?.status
        const errMsg = res?.errMsg
        const sent_to_name = res?.sent_to_name
        if (statusCode === "success") {
            toast.success(`Message sent to ${sent_to_name} successfully!`, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
            await store.fetchInboxHistory(currentPhone.value)
            cancelCompose()
        } else {
            toast.error(`Send message error: ${errMsg || 'Unknown error'}`, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
            })
        }
    } catch (error) {
        toast.error(`Send message error: ${errMsg || 'Unknown error'}`, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
        })
    } finally {
        newRecipient.value = ''
        newMessage.value = '';
        isbtnSendLoading.value = false
    }
}

const openCompose = () => {
    isComposing.value = true
    store.selectedPhoneNumber = ''
    showAttachMenu.value = false
}

const cancelCompose = () => {
    isComposing.value = false      // Ẩn giao diện Compose
    newRecipient.value = ''        // Reset người nhận
    newMessage.value = ''          // Reset nội dung tin nhắn
    store.selectedPhoneNumber = '' // Bỏ chọn cuộc trò chuyện cũ
}

// ------ upload image chat -------
const fileInput = ref(null)

const triggerImageSelect = () => {
    fileInput.value?.click()
}

const handleImageUpload = async (event) => {
    toggleAttachMenu()
    const file = event.target.files[0]
    if (!file) return

    const phone = phoneSelected.value;

    const tempMessage = {
        direction: 'out',
        text: null,
        image: URL.createObjectURL(file),
        time: new Date().toISOString(),
        status: statusMessage.sending, // trạng thái tạm thời
    }
    store.dataMessage.conversations[phone].push(tempMessage);
    await scrollToBottom()
    try {
        const response = await apiServices.postSendMedia(currentPhone.value, phone, file)
        if (response.status === 'success') {
            URL.revokeObjectURL(tempMessage.image)
            tempMessage.image = response.uploaded_image_url
            tempMessage.status = statusMessage.success
            await scrollToBottom();
            await store.fetchInboxHistory(currentPhone.value)
        } else {
            tempMessage.status = statusMessage.failed
            store.dataMessage.conversations[phone] = [...store.dataMessage.conversations[phone]]
        }
    } catch (err) {
        tempMessage.status = statusMessage.failed
        store.dataMessage.conversations[phone] = [...store.dataMessage.conversations[phone]]
    } finally {
        event.target.value = ''
        fileInput.value = null
    }
}

const triggerImageSelectNewMessage = () => {
    fileInput.value?.click()
}

const handleImageUploadNewMessage = async (event) => {
    isbtnSendLoading.value = true
    toggleAttachMenu()
    const file = event.target.files[0]
    if (!file) {
        isbtnSendLoading.value = false
        return
    }

    const recipientNumber = newRecipient.value.trim()
    if (!recipientNumber) {
        toast.info("Please enter recipient phone number", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        isbtnSendLoading.value = false
        return
    }

    if (!isValidPhone(recipientNumber)) {
        toast.error("Please enter a valid phone number", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        isbtnSendLoading.value = false
        return
    }

    try {
        const response = await apiServices.postSendMedia(currentPhone.value, recipientNumber, file)
        const sent_to_name = response?.sent_to_name
        if (response.status === 'success') {
            toast.success(`Image sent to ${sent_to_name} successfully!`, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
            await store.fetchInboxHistory(currentPhone.value)
            cancelCompose()
        } else {
            toast.error(`Send image error: failed`, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: true,
                pauseOnFocusLoss: true,
                pauseOnHover: true,
            })
        }
    } catch (err) {
        toast.error(`Send image error: Unknown error`, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
        })
    } finally {
        newRecipient.value = ''
        event.target.value = ''
        fileInput.value = null
        isbtnSendLoading.value = false
    }
}


// --------------------------

const scrollToBottom = async () => {
    await nextTick()
    const el = scrollContainer.value
    if (el) {
        el.scrollTop = el.scrollHeight
    }
}

watch(conversation, async () => {
    await scrollToBottom()
}, { deep: true })

onMounted(async () => {
    await scrollToBottom()
})

</script>
<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>