<template>
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl">
            <!-- Modal Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b border-gray-300">
                <h3 class="text-xl font-bold">Edit user</h3>
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
                        <label class="block text-sm font-medium text-gray-700 mb-1">Current Group</label>
                        <input :placeholder="formData.group_name" type="text" readonly
                            class="w-full border border-gray-300 bg-gray-100 rounded px-3 py-2" />
                    </div>
                    <div class="col-span-2 relative">
                        <label class="block text-sm font-medium text-gray-700 mb-1">Group</label>
                        <input type="text" v-model="formData.new_group" readonly @click="toggleDropdown"
                            class="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer bg-white"
                            placeholder="Select group" />
                        <!-- Dropdown list -->
                        <ul v-if="isOpen"
                            class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-md">
                            <li v-for="group in groups" :key="group.id" @click="selectGroup(group)"
                                class="px-3 py-2 hover:bg-gray-100 cursor-pointer">
                                {{ group.name }}
                            </li>
                        </ul>
                    </div>
                </div>
            </form>

            <!-- Modal Footer -->
            <div class="flex grid-row-2 justify-end px-6 py-4 border-t border-gray-300">
                <div class="flex w-1/2 justify-between gap-3">
                    <button type="button" @click="$emit('close')"
                        class="bg-gray-200 text-gray-700 hover:bg-gray-300 px-4 py-2 rounded-lg mr-2">
                        Cancel
                    </button>
                    <ButtonProcess @click="saveUser" title="Update" :isLoading="isBtnSaveLoading" />
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
    user: Object,
    groups: {
        type: Array,
        default: () => [],
    },
})

const isBtnSaveLoading = ref(false)

const formData = reactive({
    user_id: '',
    user_name: '',
    password: '',
    group_name: '',
    group_id: '',
    raw_password: '',
    new_password: '',
    new_group: ''
})

const isOpen = ref(false)

const toggleDropdown = () => {
    isOpen.value = !isOpen.value
}

const selectGroup = (group) => {
    formData.new_group = group.name;
    isOpen.value = false
}

// Đồng bộ user prop vào form khi modal mở
watch(
    () => props.user,
    (user) => {
        if (user) {
            formData.user_id = user.user_id,
                formData.user_name = user.user_name,
                formData.password = user.password,
                formData.group_name = user.group_name,
                formData.group_id = user.group_id,
                formData.raw_password = user.raw_password
        }
    },
    { immediate: true }
)

const saveUser = async () => {
    const { user_id, new_password, new_group, raw_password, group_name } = formData;

    if (!new_password && !new_group) {
        toast.warning("Vui lòng nhập mật khẩu mới hoặc chọn nhóm để cập nhật!", {
            timeout: 3000,
            position: "top-center",
        });
        return
    }
    const finalPassword = new_password || raw_password;
    const finalGroup = new_group || group_name;

    isBtnSaveLoading.value = true

    try {
        const response = await apiServices.putEditEmployee(
            user_id,
            finalPassword,
            finalGroup
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
