<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <!-- Modal Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-300">
                <h3 class="text-xl font-bold">Edit customer</h3>
                <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                    &times;
                </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="$emit('save', formData)" class="p-6 space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">User Name</label>
                        <input type="text" readonly :placeholder="formData.user_name"
                            class="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input :placeholder="formData.raw_password" type="text" readonly
                            class="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input v-model="formData.new_password" type="text"
                            class="w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Phone total</label>
                        <input :placeholder="formData.phone_assigned_count" readonly
                            class="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Buy more phone</label>
                        <input v-model="formData.add_phone" type="number" placeholder="Thêm số lượng"
                            class="w-full border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <!-- <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Phones</label>
                        <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                            <ul class="space-y-2">
                                <li v-for="(phone, index) in formData.phones" :key="index"
                                    class="flex justify-between items-center bg-gray-50 border border-gray-100 rounded px-3 py-2">
                                    <span class="font-medium text-gray-800">{{ phone.phone_number }}</span>
                                    <span :class="phone.status === 'active' ? 'text-green-600' : 'text-red-500'"
                                        class="text-sm capitalize">
                                        {{ phone.status }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div> -->
                </div>
            </form>

            <!-- Modal Footer -->
            <div class="flex grid-row-2 justify-end px-6 py-4 border-t border-gray-300">
                <div class="flex w-1/2 justify-between gap-3">
                    <button type="button" @click="$emit('close')"
                        class="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg mr-2">
                        Cancel
                    </button>
                    <ButtonProcess @click="saveCustomer" title="Update" :isLoading="isBtnSaveLoading" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'
import ButtonProcess from '@/components/ButtonProcess.vue'
import apiServices from '@/services/api.services'
import { useToast } from 'vue-toastification'

const toast = useToast()
const emit = defineEmits(['close', 'save-success'])

const props = defineProps({
    show: Boolean,
    user: Object
})

const isBtnSaveLoading = ref(false)

const formData = reactive({
    user_id: '',
    user_name: '',
    password: '',
    raw_password: '',
    new_password: '',
    phone_assigned_count: '',
    add_phone: ''
})

// Đồng bộ user prop vào form khi modal mở
watch(
    () => props.user,
    (user) => {
        if (user) {
            formData.user_id = user.customer_id,
                formData.user_name = user.customer_name,
                formData.password = user.password,
                formData.raw_password = user.raw_password,
                formData.phone_assigned_count = user.phone_assigned_count
            formData.phones = user.phones
        }
    },
    { immediate: true }
)

const saveCustomer = async () => {
    const { user_id, new_password, raw_password, add_phone } = formData;

    if (!new_password && !add_phone) {
        toast.warning("Vui lòng nhập mật khẩu mới hoặc thêm số lượng điện thoại!", {
            timeout: 3000,
            position: "top-center",
        });
        return
    }
    const finalPassword = new_password || raw_password;
    const count_phone = add_phone || 0

    isBtnSaveLoading.value = true

    try {
        const response = await apiServices.putEditCustomer(
            user_id,
            finalPassword,
            count_phone
        )

        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
            emit("save-success");
            emit("close");
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
            })
        }
    } catch (err) {
        toast.error(err, {
            timeout: 3000,
            position: "top-center",
        })
    } finally {
        isBtnSaveLoading.value = false
    }
};
</script>
