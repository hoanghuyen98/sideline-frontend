<template>
    <div class="min-h-screen bg-gray-100">
        <!-- Navbar -->
        <nav class="w-full bg-white shadow-md fixed top-0 left-0 z-50">
            <div class="px-4 py-3 flex justify-end items-center">
                <!-- Thông tin user -->
                <div class="flex items-center gap-4">
                    <span class="text-gray-700 font-medium">Xin chào, {{ username }}</span>
                    <button @click="logout"
                        class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md font-semibold transition-all duration-200 cursor-pointer">
                        Đăng xuất
                    </button>
                </div>
            </div>
        </nav>

        <!-- Nội dung chính -->
        <div class="min-h-screen bg-gray-100 px-4 pt-16 flex flex-col items-center space-y-8">
            <!-- Quản lí mail -->
            <div class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-8">
                <!-- Header -->
                <div class="text-center space-y-2">
                    <h1 class="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                        📧 Quản lý Mail
                    </h1>
                    <!-- Tabs -->
                    <div class="flex flex-col md:flex-row md:flex-nowrap justify-center gap-3 md:gap-5">
                        <label v-for="source in sources" :key="source.value"
                            class="inline-flex items-center gap-2 cursor-pointer whitespace-nowrap text-sm md:text-base font-semibold">
                            <input type="radio" :value="source.value" v-model="selectedSource"
                                class="form-radio text-blue-600 scale-110 md:scale-125 focus:ring-blue-500" />
                            {{ source.label }}
                        </label>
                    </div>
                </div>

                <!-- Form chọn loại mail -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block mb-1 text-sm font-medium">Chọn loại mail:</label>
                        <select v-model="selectedMailType"
                            class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400"
                            :disabled="isLoadingMailTypes">
                            <!-- Khi đang tải -->
                            <option v-if="isLoadingMailTypes" disabled value="">
                                ⏳ Đang tải danh sách loại mail...
                            </option>

                            <!-- Khi không có dữ liệu -->
                            <option v-else-if="!mailTypes.length" disabled value="">
                                ⚠️ Không có loại mail nào khả dụng
                            </option>

                            <!-- Khi có dữ liệu -->
                            <option v-else v-for="type in mailTypes" :key="type.id" :value="type.id">
                                {{ type.name }} - {{ type.price }}
                            </option>
                        </select>
                    </div>
                    <div>
                        <label class="block mb-1 text-sm font-medium">Số lượng:</label>
                        <input type="number" v-model="quantity" min="1"
                            class="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-400" />
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex flex-col md:flex-row items-center gap-3 mt-2 w-full">
                    <div class="w-full md:w-3/4">
                        <ButtonProcess @click="buyMail" title="Mua Mail" :isLoading="btnBuyMailLoading" />
                    </div>
                    <div class="w-auto md:w-1/4">
                        <ButtonProcess @click="deleteAllMail" title="Xóa Tất Cả Mail" :isLoading="btnDeleteMailLoading"
                            color_btn="red" />
                    </div>
                </div>

                <!-- Danh sách Mail -->
                <div v-for="(mail, index) in emails" :key="index"
                    class="flex flex-col md:flex-row justify-between items-center border px-3 py-2 rounded-md mb-2 text-sm shadow-sm"
                    :class="mail.isUsed ? 'bg-gray-100 text-gray-400 line-through opacity-60 pointer-events-none' : 'bg-white'">
                    <div class="flex flex-col md:flex-row gap-2">
                        <span :class="mail.isUsed ? 'text-gray-400' : 'font-bold text-purple-700'">
                            {{ index + 1 }}.
                        </span>
                        <span>{{ mail.email }} |</span>
                        <span class="font-mono">{{ mail.pass }}</span>
                    </div>
                    <div class="flex items-center flex-col md:flex-row md:items-center md:justify-start gap-2">
                        <!-- Copy Mail -->
                        <div class="flex gap-2">
                            <button @click="copyMail(mail)"
                                class="bg-gray-700 hover:bg-gray-800 text-white px-2 py-1 rounded cursor-pointer w-full md:w-auto"
                                :disabled="mail.isUsed">
                                {{ mail.copiedMail ? 'Đã copy!' : 'Copy Mail' }}
                            </button>

                            <!-- Get Auth Code -->
                            <button @click="getAuthCode(mail)"
                                class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded cursor-pointer w-full md:w-auto flex items-center justify-center gap-2"
                                :disabled="mail.isUsed || mail.isLoading">
                                <template v-if="mail.isLoading">
                                    <svg class="w-5 h-5 text-white" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                        <path
                                            d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                                            <animateTransform attributeName="transform" type="rotate" dur="0.75s"
                                                values="0 12 12;360 12 12" repeatCount="indefinite" />
                                        </path>
                                    </svg>
                                </template>
                                <template v-else>
                                    Get Auth Code
                                </template>
                            </button>
                        </div>
                        <!-- ✅ Code hiển thị -->
                        <div v-if="mail.code === ''">
                            <span class="text-red-500 text-sm">Không tìm thấy code nào.</span>
                        </div>

                        <div v-else-if="mail.code">
                            <div class="flex items-center gap-2 flex-wrap text-sm">
                                <span class="text-green-700 font-bold">Code: {{ mail.code }}</span>
                                <button @click="copyCodeAuth(mail)"
                                    class="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded">
                                    {{ copiedCodes[mail.email] ? 'Đã copy!' : 'Copy' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Công cụ nhanh -->
            <div class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-4 text-center">
                <h2 class="text-2xl font-bold flex justify-center items-center gap-2">
                    ⚙️ Công cụ nhanh
                </h2>
                <div class="flex justify-center gap-4 w-full">
                    <ButtonProcess @click="genPhoneExample" title="Lấy SĐT Mẫu" :isLoading="phoneBtnLoading"
                        color_btn="gray" />
                    <ButtonProcess @click="genPasswordExample" title="Lấy Mật Khẩu Mẫu" :isLoading="passBtnLoading"
                        color_btn="gray" />
                </div>

                <!-- ✅ Kết quả hiển thị bên dưới -->
                <div v-if="generatedPhone || generatedPass"
                    class="mt-6 border-t pt-4 space-y-3 text-gray-800 text-left">

                    <p class="font-semibold text-center">Kết quả đã tạo:</p>

                    <div v-if="generatedPhone" class="flex justify-between items-center bg-gray-50 p-2 rounded border">
                        <span>SĐT mẫu: {{ generatedPhone }}</span>
                        <button @click="copyText(generatedPhone)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                            Copy
                        </button>
                    </div>

                    <div v-if="generatedPass" class="flex justify-between items-center bg-gray-50 p-2 rounded border">
                        <span>Mật khẩu mẫu: {{ generatedPass }}</span>
                        <button @click="copyText(generatedPass)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
            <!-- Nhập Liệu Apple Mail & Proxy -->
            <form @submit.prevent="saveAppleData" class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-6">
                <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                    🍎 Nhập Liệu Apple Mail & Proxy
                </h2>

                <input v-model="appleMail" type="email" placeholder="Nhập Apple Mail" required
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                <input v-model="appleProxy" type="text" placeholder="Nhập IP Proxy (VD: 192.168.1.1)" required
                    class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                <ButtonProcess title="Lưu" :isLoading="isLoadingBtnSaveApple" type="submit" />

                <div v-if="savedAppleMail && savedAppleProxy" class="mt-4 border-t pt-4 space-y-3 text-gray-800">
                    <p class="font-semibold">Đã lưu thành công:</p>
                    <div class="flex justify-between items-center bg-gray-50 p-2 rounded border">
                        <span>Mail: {{ savedAppleMail }}</span>
                        <button @click="copyAppleMail(savedAppleMail)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                            {{ copiedAppleMail ? "Đã copy!" : "Copy" }}</button>
                    </div>
                    <div class="flex justify-between items-center bg-gray-50 p-2 rounded border">
                        <span>Proxy: {{ savedAppleProxy }}</span>
                        <button @click="copyAppleProxy(savedAppleProxy)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded">
                            {{ copiedAppleProxy ? "Đã copy!" : "Copy" }}</button>
                    </div>
                </div>
            </form>
            <!-- Nhập Liệu SĐT & API -->
            <div class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-4">
                <h2 class="text-2xl font-bold flex justify-center items-center gap-2 text-gray-800">
                    ✏️ Nhập Liệu SĐT & API
                </h2>

                <label class="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" v-model="isTextNow" class="w-5 h-5 rounded focus:ring-blue-300" />
                    <span class="text-gray-700">Chuyển sang nhập tài khoản TextNow?</span>
                </label>

                <!-- Form Pinger/Textfree -->
                <form v-if="!isTextNow" @submit.prevent="savePhoneData" class="space-y-3">
                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Phone:</label>
                        <input v-model="phone" type="text" placeholder="(234) 123-4567" @focus="clearPhoneExist"
                            pattern="^\(\d{3}\)\s\d{3}-\d{4}$" title="Định dạng phải là (234) 123-4567" :class="[
                                'w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-300',
                                isPhoneExist ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
                            ]" />
                        <p v-if="isPhoneExist" class="text-red-500 text-sm mt-1">
                            {{ messagePhoneInput }}
                        </p>
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Mail:</label>
                        <input v-model="mail" type="email" placeholder="Dán email đã sử dụng để tạo SĐT này" required
                            :class="[
                                'w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-300',
                                isMailExist ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
                            ]" />
                        <p v-if="isMailExist" class="text-red-500 text-sm mt-1">{{ messageMailInput }}</p>
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Provider:</label>
                        <input v-model="provider" type="text" placeholder="Pinger/Textfree" readonly
                            class="w-full p-3 border bg-gray-100 border-gray-300 rounded-md outline-none" />
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Batch:</label>
                        <textarea v-model="batch" rows="4" placeholder="Dán lệnh cURL batch" required :class="[
                            'w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-300',
                            isBatchExist ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
                        ]"></textarea>
                        <p v-if="isBatchExist" class="text-red-500 text-sm mt-1">{{ messageBatchInput }}</p>
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Message:</label>
                        <textarea v-model="message" rows="4" placeholder="Dán lệnh cURL message" required :class="[
                            'w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-300',
                            isMessageExist ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
                        ]"></textarea>
                        <p v-if="isMessageExist" class="text-red-500 text-sm mt-1">{{ messageMessageInput }}</p>
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Media:</label>
                        <textarea v-model="media" rows="4" placeholder="Dán lệnh media" required :class="[
                            'w-full p-3 border rounded-md outline-none focus:ring-2 focus:ring-blue-300',
                            isMediaExist ? 'border-red-500 bg-red-50 focus:ring-red-400' : 'border-gray-300'
                        ]"></textarea>
                        <p v-if="isMediaExist" class="text-red-500 text-sm mt-1">{{ messageMediaInput }}</p>
                    </div>

                    <ButtonProcess title="Lưu Dữ Liệu" :isLoading="isLoadingBtnAddPhone" type="submit" />
                </form>


                <!-- Form TextNow -->
                <form v-else @submit.prevent="saveTextNow" class="space-y-3">
                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Email:</label>
                        <input v-model="textNowEmail" type="text" placeholder="Dán email TextNow" required
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none" />
                    </div>

                    <div>
                        <label class="block font-medium mb-1 text-gray-700">Password:</label>
                        <input v-model="textNowPassword" type="text" placeholder="Dán mật khẩu TextNow" required
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 outline-none" />
                    </div>

                    <ButtonProcess title="Lưu Tài Khoản TextNow" :isLoading="isLoadingBtnTextNow" type="submit" />
                </form>
            </div>
            <!-- Thống kê SĐT Hôm Nay -->
            <div class="bg-white w-full max-w-5xl rounded-lg shadow-xl p-6 space-y-4 text-left mb-6">
                <!-- Tiêu đề -->
                <h2 class="text-2xl font-bold flex justify-center items-center gap-2 text-gray-800">
                    Thống kê SĐT Hôm Nay
                </h2>

                <!-- Dữ liệu -->
                <div class="space-y-2">
                    <p class="font-semibold">
                        SĐT Pinger (Hôm nay):
                        <span class="font-normal text-gray-700">{{ pinger_today }}</span>
                        <span class="text-sm text-gray-500">(H:{{ pinger_today_live }} / D:{{ pinger_today_die
                        }})</span>
                    </p>

                    <p class="font-semibold">
                        SĐT Pinger (Tháng):
                        <span class="font-normal text-gray-700">{{ pinger_month }}</span>
                    </p>

                    <hr class="border-gray-300">

                    <p class="font-semibold">
                        Tổng TK TextNow:
                        <span class="font-normal text-gray-700">{{ textnow_total }}</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiServices from '@/services/api.services'
import { useToast } from "vue-toastification"
import ButtonProcess from '@/components/ButtonProcess.vue'
import { useLoadingStore } from '@/stores/loadingStore'
import TokenService from '@/services/token.service'
import { providerMail } from "@/ultis/constants"

const toast = useToast()
const loadingStore = useLoadingStore()

const isTextNow = ref(false)

const username = ref("")

const logout = async () => {
    loadingStore.show()
    await apiServices.logOut()
    loadingStore.hide()
}

async function copyText(text) {
    try {
        if (!navigator.clipboard) throw new Error('Clipboard API không hỗ trợ')
        await navigator.clipboard.writeText(text)
        return true
    } catch (err) {
        return false
    }
}

//////////////// Quản lý Mail
const dongvanMail = ref([]) // [ {"id": 5, "name": "Hotmail TRUSTED [IMAP/POP3] (650)", "price": 650}]
const sellmmoMail = ref([])
const muaviewMail = ref([])
const muaviewMailThat = ref([])
const shopGmail = ref([])
const selectedSource = ref('dongvan')
const selectedMailType = ref('')
const quantity = ref(1)
const emails = ref([])
const copiedCodes = ref({})
const btnBuyMailLoading = ref(false)
const btnDeleteMailLoading = ref(false)
const sources = [
    { label: 'Mua từ DongVan', value: 'dongvan' },
    { label: 'Mua từ SellMMO', value: 'sellmmo' },
    { label: 'Mua từ ShopGmail', value: 'shopgmail' },
    { label: 'Gmail Ảo (MuaView)', value: 'muaview' },
    { label: 'Gmail Thật (MuaView)', value: 'muaview_that' },
]

const showListMail = async () => {
    try {
        const responseListMail = await apiServices.getPurchasedMails()
        if (responseListMail?.status === 'success' && Array.isArray(responseListMail.mails)) {
            emails.value = responseListMail.mails.map(mail => ({
                email: mail.email,
                pass: mail.password,
                refresh_token: mail.refresh_token,
                client_id: mail.client_id,
                provider: mail.provider,
                code: null,
                isUsed: mail.is_used || false,
                copiedMail: false,
                isLoading: false,
            }))
        }
    } catch (err) { }
}

const buyMail = async () => {
    try {
        btnBuyMailLoading.value = true
        if (!selectedMailType.value) {
            toast.warning('Vui lòng chọn loại mail!', {
                timeout: 3000,
                position: "top-center",
            })
            return;
        }
        // tìm mail object theo id
        let mail = mailTypes.value.find(m => m.id === selectedMailType.value);
        if (!mail) {
            toast.warning('Loại mail không hợp lệ!', {
                timeout: 3000,
                position: "top-center",
            });
            return;
        }
        // xác định provider theo source
        const providerMap = {
            dongvan: 'dongvan',
            sellmmo: 'sellmmo',
            muaview: 'muaview',
            muaview_that: 'muaview_that',
            shopgmail: 'shopgmail',

        };
        const provider = providerMap[selectedSource.value];

        const product_id = mail.id; // product_id = id của mail đã chọn
        const product_name = mail.name;
        const response = await apiServices.postBuyMail(product_id, provider, quantity.value, product_name)
        if (response?.status === "success") {
            await showListMail()
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
        }
    } catch (err) {
        toast.error("Lỗi mua mail", {
            timeout: 3000,
            position: "top-center",
        })
    } finally {
        btnBuyMailLoading.value = false
    }
}

const deleteAllMail = async () => {
    btnDeleteMailLoading.value = true
    try {
        const response = await apiServices.deleteAllMails()
        if (response?.status == "success") {
            await showListMail()
            toast.success('Delete all Mail thành công!', {
                timeout: 3000,
                position: "top-center",
            })
        } else {
            toast.error('Delete all Mail thất bại', {
                timeout: 3000,
                position: "top-center",
            })
        }
    } catch (err) { } finally {
        btnDeleteMailLoading.value = false
    }
}

const mailTypes = computed(() => {
    if (selectedSource.value === 'dongvan') {
        return dongvanMail.value
    } else if (selectedSource.value === 'sellmmo') {
        return sellmmoMail.value
    } else if (selectedSource.value === 'muaview') {
        return muaviewMail.value
    } else if (selectedSource.value === 'muaview_that') {
        return muaviewMailThat.value
    } else if (selectedSource.value === 'shopgmail') {
        return shopGmail.value
    }
    
    return []
})

const copyMail = async (mail) => {
    await copyText(mail.email)
    mail.copiedMail = true
    setTimeout(() => (mail.copiedMail = false), 2000)
}

const getAuthCode = async (mail) => {
    mail.isLoading = true
    try {
        const response = await apiServices.postGetAuthCode(mail.provider, mail.email, mail.refresh_token, mail.client_id)
        if (response?.status == "success") {
            mail.code = response?.auth_code
        } else {
            mail.code = ""
        }
    } catch (err) {
        toast.error("Lỗi get AuthCode", {
            timeout: 3000,
            position: "top-center",
        })
        mail.code = ""
    } finally {
        mail.isLoading = false
    }
}

const copyCodeAuth = async (mail) => {
    if (!mail?.code) return

    await copyText(mail.code)

    copiedCodes.value[mail.email] = true

    setTimeout(() => {
        copiedCodes.value[mail.email] = false
    }, 2000)
}
////////////////////////////////////

/////////////// Công cụ nhanh
const generatedPhone = ref('')
const generatedPass = ref('')
const phoneCopied = ref(false)
const passCopied = ref(false)
const phoneBtnLoading = ref(false)
const passBtnLoading = ref(false)
const makePhone = () => {
    let s = ''
    for (let i = 0; i < 9; i++) {
        // random từ 1 đến 9
        s += String(Math.floor(Math.random() * 9) + 1)
    }
    return s
}

const genPhoneExample = async () => {
    phoneBtnLoading.value = true
    phoneCopied.value = false
    const phone = makePhone()
    generatedPhone.value = phone
    const ok = await copyText(phone)
    phoneBtnLoading.value = false

    if (ok) {
        phoneCopied.value = true
        // reset trạng thái sau 2s
        setTimeout(() => {
            phoneCopied.value = false
        }, 2000)
        toast.success('Copy mẫu SĐT thành công!', {
            timeout: 3000,
            position: "top-center",
        })
    } else {
        toast.error('Không thể lấy mẫu SĐT', {
            timeout: 3000,
            position: "top-center",
        })
    }
}

const genPasswordExample = async () => {
    passBtnLoading.value = true
    passCopied.value = false
    const pwd = 'Asdfghjkl123!@#'
    generatedPass.value = pwd
    const ok = await copyText(pwd)
    passBtnLoading.value = false

    if (ok) {
        passCopied.value = true
        setTimeout(() => {
            passCopied.value = false
        }, 2000)
        toast.success('Copy mẫu Mật Khẩu thành công!', {
            timeout: 3000,
            position: "top-center",
        })
    } else {
        toast.error('Không thể lấy mẫu mật khẩu', {
            timeout: 3000,
            position: "top-center",
        })
    }
}
/////////////////////////////////////////////////////

////////// Nhập Liệu Apple Mail & Proxy
const appleMail = ref('')
const appleProxy = ref('')
const savedAppleMail = ref('')
const savedAppleProxy = ref('')
const copiedAppleProxy = ref(false)
const copiedAppleMail = ref(false)
const isLoadingBtnSaveApple = ref(false)

const saveAppleData = async () => {
    savedAppleMail.value = appleMail.value
    savedAppleProxy.value = appleProxy.value
    isLoadingBtnSaveApple.value = true
    try {
        const response = await apiServices.postSaveAppleMail(appleMail.value, appleProxy.value)
        if (response?.status === "success") {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
        }
    } catch (e) {
        toast.error('Lỗi lưu Apple Mail & Proxy!', {
            timeout: 3000,
            position: "top-center",
        })
    } finally {
        appleMail.value = ''
        appleProxy.value = ''
        isLoadingBtnSaveApple.value = false
    }
}

const copyAppleMail = async (text) => {
    if (!text) return
    await copyText(text)
    copiedAppleMail.value = true
    setTimeout(() => (copiedAppleMail.value = false), 2000)
}

const copyAppleProxy = async (text) => {
    if (!text) return
    await copyText(text)
    copiedAppleProxy.value = true
    setTimeout(() => (copiedAppleProxy.value = false), 2000)
}

///////////////////////////////////////////////////

/////////////////// Nhập Liệu SĐT & API
const phone = ref('')
const mail = ref('')
const provider = ref('Pinger/Textfree')
const batch = ref('')
const message = ref('')
const media = ref('')
const isLoadingBtnAddPhone = ref(false)

const isPhoneExist = ref(false)
const isMailExist = ref(false)
const isBatchExist = ref(false)
const isMessageExist = ref(false)
const isMediaExist = ref(false)
const messagePhoneInput = ref('')
const messageMailInput = ref('')
const messageBatchInput = ref('')
const messageMessageInput = ref('')
const messageMediaInput = ref('')

const encodeBase64 = (text) => {
    try {
        return btoa(encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode('0x' + p1)
        ));
    } catch (e) {
        return "";
    }
}

const savePhoneData = async () => {
    isLoadingBtnAddPhone.value = true
    isPhoneExist.value = false
    isMailExist.value = false
    isBatchExist.value = false
    isMessageExist.value = false
    isMediaExist.value = false
    messagePhoneInput.value = ''
    messageMailInput.value = ''
    messageBatchInput.value = ''
    messageMessageInput.value = ''
    messageMediaInput.value = ''

    loadingStore.show()

    try {
        const encodedBatch = encodeBase64(batch.value)
        const encodedMessage = encodeBase64(message.value)
        const encodedMedia = encodeBase64(media.value)

        const response = await apiServices.postAddPhone(
            phone.value,
            mail.value,
            provider.value,
            encodedBatch,
            encodedMessage,
            encodedMedia
        )

        if (response?.status !== 'success') {
            toast.error(`${response?.message || "Không khởi tạo được tác vụ!"}`, {
                timeout: 3000,
                position: "top-center",
            });

            const detail = response.detail || {}
            if ('phone' in detail) { isPhoneExist.value = true; messagePhoneInput.value = detail.phone[0] }
            if ('mail' in detail) { isMailExist.value = true; messageMailInput.value = detail.mail[0] }
            if ('batch' in detail) { isBatchExist.value = true; messageBatchInput.value = detail.batch[0] }
            if ('message' in detail) { isMessageExist.value = true; messageMessageInput.value = detail.message[0] }
            if ('media' in detail) { isMediaExist.value = true; messageMediaInput.value = detail.media[0] }

            isLoadingBtnAddPhone.value = false
            loadingStore.hide()
            return;
        }

        if (!response?.task_id) {
            toast.error("Không khởi tạo được tác vụ!", {
                timeout: 3000,
                position: "top-center",
            });
            isLoadingBtnAddPhone.value = false
            loadingStore.hide()
            return;
        }

        toast.info("Đang lưu dữ liệu... Vui lòng chờ", {
            timeout: 3000,
            position: "top-center",
        });

        const taskId = response.task_id
        const startTime = Date.now() // quy đổi ra số nguyên
        const maxTime = 30 * 1000 // 30s
        let isDone = false

        const pollInterval = setInterval(async () => {
            if (isDone) return
            const elapsed = Date.now() - startTime
            if (elapsed > maxTime) {
                isDone = true
                clearInterval(pollInterval)
                toast.warning("Timeout!", { timeout: 3000, position: "top-center" })
                isLoadingBtnAddPhone.value = false
                loadingStore.hide()
                return
            }

            try {
                const statusRes = await apiServices.getTaskAddPhoneStatus(taskId)

                if (statusRes.status === "pending" || statusRes.status === "running") {
                    return
                }

                if (statusRes.status === "success") {
                    isDone = true
                    clearInterval(pollInterval)
                    toast.success(statusRes.message || "Thêm số thành công!", { timeout: 3000, position: "top-center" })
                    phone.value = ''
                    mail.value = ''
                    batch.value = ''
                    message.value = ''
                    media.value = ''
                    await fetchSummary()
                    await showListMail()
                    isLoadingBtnAddPhone.value = false
                    loadingStore.hide()
                    return

                } else if (statusRes.status === "error") {
                    isDone = true
                    clearInterval(pollInterval);
                    toast.error(statusRes.message || "Task thêm SĐT lỗi!", { timeout: 3000, position: "top-center" })
                    isLoadingBtnAddPhone.value = false
                    loadingStore.hide()
                    return
                }

            } catch (err) {
                isDone = true
                console.log(err)
                clearInterval(pollInterval)
                toast.error("Không thể kiểm tra trạng thái task thêm SĐT!", { timeout: 3000, position: "top-center" })
                isLoadingBtnAddPhone.value = false
                loadingStore.hide()
            }
        }, 2000)
    } catch (err) {
        console.log(err)
        toast.error('Lỗi không thể lưu sđt & API', {
            timeout: 3000,
            position: "top-center",
        })
        isLoadingBtnAddPhone.value = false
        loadingStore.hide()
    }
}

const clearPhoneExist = () => {
    isPhoneExist.value = false
}
///////////////////////////////////////////

//////////////////////// Nhập Liệu SĐT & API text now
const textNowEmail = ref('')
const textNowPassword = ref('')
const isLoadingBtnTextNow = ref(false)

const saveTextNow = async () => {
    isLoadingBtnTextNow.value = true
    if (!textNowEmail.value.trim() || !textNowPassword.value.trim()) {
        isLoadingBtnTextNow.value = false
        return
    }
    try {
        const response = await apiServices.postSaveTextNow(
            textNowEmail.value, textNowPassword.value
        )
        if (response?.status === "success") {
            toast.success(response?.message, {
                timeout: 3000,
                position: 'top-center',
            })
            // Reset form
            textNowEmail.value = ''
            textNowPassword.value = ''
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: 'top-center',
            })
        }
    } catch (err) {
        toast.error('Lỗi kết lưu textnow', {
            timeout: 3000,
            position: "top-center",
        })
    } finally {
        isLoadingBtnTextNow.value = false
    }
}

/////////////////// Thống kê SĐT Hôm Nay
const pinger_today = ref(0)
const pinger_today_die = ref(0)
const pinger_today_live = ref(0)
const pinger_month = ref(0)
const textnow_total = ref(0)

const fetchSummary = async () => {
    try {
        const response = await apiServices.getEmployeePhoneSummary()
        if (response?.status === "success") {
            pinger_month.value = response.data.pinger_month
            pinger_today.value = response.data.pinger_today
            pinger_today_live.value = response.data.pinger_today_live
            pinger_today_die.value = response.data.pinger_today_die
            textnow_total.value = response.data.textnow_total
        }
    } catch (err) { } finally { }
}
/////////////////////////////////////////////
const isLoadingMailTypes = ref(true)
onMounted(async () => {
    username.value = TokenService.getCookieByKey("user_name") || "Unknown"

    try {
        const [listMail, summary, appleMailRes, dongvanRes, sellmmoRes, muaviewRes, muaviewthatRes, shopgmailRes] = await Promise.all([
            showListMail(),
            fetchSummary(),
            apiServices.getAppleMail(),
            apiServices.getMailCatagories(providerMail.dongvan),
            apiServices.getMailCatagories(providerMail.sellmmo),
            apiServices.getMailCatagories(providerMail.muaview),
            apiServices.getMailCatagories(providerMail.muaview_that),
            apiServices.getMailCatagories(providerMail.shopgmail)
        ])
        if (dongvanRes?.status === 'success') {
            dongvanMail.value = dongvanRes?.categories?.data
        } else {
            toast.warning("Không có dữ liệu từ Dongvan!", {
                timeout: 3000,
                position: "top-center",
            })
        }

        if (sellmmoRes?.status === 'success') {
            sellmmoMail.value = sellmmoRes?.categories?.data
        } else {
            toast.warning("Không có dữ liệu từ SellMMO!", {
                timeout: 3000,
                position: "top-center",
            })
        }

        if (muaviewRes?.status === 'success') {
            muaviewMail.value = muaviewRes?.categories?.data
        } else {
            toast.warning("Không có dữ liệu từ SellMMO!", {
                timeout: 3000,
                position: "top-center",
            })
        }

        if (muaviewthatRes?.status === 'success') {
            muaviewMailThat.value = muaviewthatRes?.categories?.data
        } else {
            toast.warning("Không có dữ liệu từ SellMMO!", {
                timeout: 3000,
                position: "top-center",
            })
        }

        if (shopgmailRes?.status === 'success') {
            shopGmail.value = shopgmailRes?.categories?.data
        } else {
            toast.warning("Không có dữ liệu từ SellMMO!", {
                timeout: 3000,
                position: "top-center",
            })
        }

        if (appleMailRes?.status === 'success') {
            savedAppleMail.value = appleMailRes?.data?.mail
            savedAppleProxy.value = appleMailRes?.data?.proxy_ip
        }
    } catch (err) { } finally {
        isLoadingMailTypes.value = false
    }
})
</script>
