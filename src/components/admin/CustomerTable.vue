<template>
    <!-- Danh sách khách hàng -->
    <div class="lg:row-span-2 bg-white w-full rounded-lg shadow-xl p-8 space-y-6">
        <div class="flex items-center justify-center gap-2 mb-4">
            <svg class="w-8 h-8 text-purple-600 flex-none shrink-0" xmlns="http://www.w3.org/2000/svg"
                fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd"
                    d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                    clip-rule="evenodd" />
            </svg>
            <h2 class="text-2xl font-bold">DANH SÁCH KHÁCH HÀNG</h2>
        </div>
        <!-- Page size -->
        <div class="relative">
            <div class="flex justify-between items-center mb-4">
                <!-- ACTION BAR -->
                <div class="flex gap-3">
                    <button @click="copyAllSelected" :class="[
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold shadow transition',
                        selectedCustomers.length === 0
                            ? 'bg-blue-300 text-white pointer-events-none cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                    ]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-copy-icon lucide-copy">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        Copy tất cả ({{ selectedCustomers.length }})
                    </button>

                    <button @click="resetPasswordAll" :disabled="selectedCustomers.length <= 0" :class="[
                        'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold shadow transition',
                        selectedCustomers.length === 0
                            ? 'bg-orange-300 text-white pointer-events-none cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 text-white cursor-pointer'
                    ]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-rotate-ccw-key-icon lucide-rotate-ccw-key">
                            <path d="m14.5 9.5 1 1" />
                            <path d="m15.5 8.5-4 4" />
                            <path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                            <circle cx="10" cy="14" r="2" />
                        </svg>
                        Reset pass ({{ selectedCustomers.length }})
                    </button>
                </div>

                <!-- Select page size -->
                <div class="flex items-center">
                    <label class="mr-2 font-semibold text-sm text-gray-600">Số dòng mỗi trang:</label>
                    <select v-model="pageSizeCustomer" @change="changePageSizeCustomer"
                        class="border border-gray-300 px-3 py-1 rounded-md text-sm bg-white focus:outline-none cursor-pointer">
                        <option :value="10">10</option>
                        <option :value="20">20</option>
                        <option :value="50">50</option>
                        <option :value="100">100</option>
                        <option :value="200">200</option>
                    </select>
                </div>
            </div>

            <!-- Loading table-->
            <div v-if="isTableCustomerLoading"
                class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
                <svg class="w-10 h-10 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor">
                    <path
                        d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                        <animateTransform attributeName="transform" type="rotate" dur="0.75s" values="0 12 12;360 12 12"
                            repeatCount="indefinite" />
                    </path>
                </svg>
            </div>
            <!-- HEADER (cố định) -->
            <div
                class="grid grid-cols-[50px_1.2fr_1fr_0.8fr_1fr_1fr] bg-gray-100 text-gray-700 font-bold text-sm uppercase sticky top-0 z-10 items-center">

                <!-- CHECK ALL -->
                <div class="px-4 py-2">
                    <input type="checkbox" v-model="selectAll" class="scale-150">
                </div>

                <div class="px-4 py-2">Tên</div>
                <div class="px-4 py-2">Password</div>
                <div class="px-4 py-2">Trạng thái</div>
                <div class="px-4 py-2">Ngày tạo</div>
                <div class="px-4 py-2">Hành động</div>
            </div>

            <!-- BODY (scroll) -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-200 text-sm">

                <!-- Empty -->
                <div v-if="customers.length === 0" class="text-center py-6 font-bold text-gray-500">
                    Không có khách hàng nào.
                </div>

                <!-- Rows -->
                <div v-for="customer in customers" :key="customer.customer_id"
                    class="grid grid-cols-[50px_1.2fr_1fr_0.8fr_1fr_1fr] hover:bg-blue-50 cursor-pointer items-center"
                    @click="handleRowClick($event, customer, 'customer')">
                    <!-- CHECKBOX -->
                    <div class="px-4 py-2">
                        <input type="checkbox" :value="customer.customer_name" v-model="selectedCustomers"
                            class="scale-150" @click.stop>
                    </div>
                    <!-- TÊN -->
                    <div class="px-4 py-2">{{ customer.customer_name }}</div>

                    <!-- PASS -->
                    <div class="px-4 py-2 truncate max-w-[200px]">
                        {{ customer.raw_password }}
                    </div>

                    <!-- TRẠNG THÁI -->
                    <div class="px-4 py-2 font-bold" :class="{
                        'text-green-600': customer?.phones?.[0]?.status === 'live',
                        'text-orange-500': customer?.phones?.[0]?.status === 'die_use',
                        'text-gray-400': customer?.phones?.[0]?.status === 'lock',
                        'text-red-600': customer?.phones?.[0]?.status === 'die'
                    }">
                        {{ customer?.phones?.[0]?.status || '-' }}
                    </div>

                    <!-- NGÀY TẠO -->
                    <div class="px-4 py-2 truncate max-w-[200px]">
                        {{ formatLocal(customer?.phones?.[0]?.created_at) }}
                    </div>

                    <!-- HÀNH ĐỘNG -->
                    <div class="flex items-center px-4 py-2 gap-2">
                        <button @click.stop="copyAccount(customer)"
                            class="flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer">
                            <svg class="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-5-4v4h4V3h-4Z" />
                            </svg>
                            Copy
                        </button>

                        <button @click.stop="deleteCustomer(customer)"
                            :disabled="deletingCustomer === customer.customer_id"
                            class="text-white px-3 py-1 rounded-md text-xs font-semibold" :class="deletingCustomer === customer.customer_id
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-500 hover:bg-red-600 cursor-pointer'">
                            <svg v-if="deletingCustomer === customer.customer_id"
                                class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0..." />
                            </svg>
                            <span v-else>Xóa</span>
                        </button>
                    </div>
                </div>
            </div>
            <!-- Pagination -->
            <div v-if="totalPagesCustomer > 1" class="flex flex-wrap justify-center items-center gap-2 mt-6">

                <!-- Prev -->
                <button @click="setPageCustomer(currentPageCustomer - 1)" :disabled="currentPageCustomer === 1"
                    class="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer">
                    ← Trước
                </button>

                <!-- Trang 1 -->
                <button @click="setPageCustomer(1)" :class="[
                    'px-3 py-1 border rounded-md cursor-pointer',
                    currentPageCustomer === 1
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                ]">
                    1
                </button>

                <!-- Dấu ... bên trái -->
                <span v-if="currentPageCustomer > 3" class="px-2">…</span>

                <!-- Các trang dynamic -->
                <button v-for="page in visibleCustomerPages" :key="page" @click="setPageCustomer(page)" :class="[
                    'px-3 py-1 border rounded-md cursor-pointer',
                    currentPageCustomer === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                ]">
                    {{ page }}
                </button>

                <!-- Dấu ... bên phải -->
                <span v-if="currentPageCustomer < totalPagesCustomer - 2" class="px-2">…</span>

                <!-- Trang cuối -->
                <button v-if="totalPagesCustomer > 1" @click="setPageCustomer(totalPagesCustomer)" :class="[
                    'px-3 py-1 border rounded-md cursor-pointer',
                    currentPageCustomer === totalPagesCustomer
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                ]">
                    {{ totalPagesCustomer }}
                </button>

                <!-- Next -->
                <button @click="setPageCustomer(currentPageCustomer + 1)"
                    :disabled="currentPageCustomer === totalPagesCustomer"
                    class="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer">
                    Sau →
                </button>
            </div>
        </div>
    </div>
    <CustomerModal :show="isModalOpenCustomer" :user="selectedCustomer" @close="isModalOpenCustomer = false"
        @save-success="refreshCustomer" />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CustomerModal from '@/components/CustomerModal.vue'
import apiServices from '@/services/api.services'
import { useToast } from "vue-toastification"
import { formatLocal } from "@/ultis/extensions"
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
const toast = useToast()
const isModalOpenCustomer = ref(false)
const selectedCustomer = ref(null)
const pageSizeCustomer = ref(10)
const selectedCustomers = ref([])
const selectAll = ref(false)
const baseUrl = import.meta.env.VITE_DOMAIN_WEB;
const changePageSizeCustomer = async () => {
    currentPageCustomer.value = 1

    // reset
    selectAll.value = false
    selectedCustomers.value = []

    await fetchListCustomer(1)
}

watch(selectAll, (val) => {
    if (val) {
        // chọn tất cả customer_id trên trang hiện tại
        selectedCustomers.value = customers.value.map(c => c.customer_name)
    } else {
        // bỏ chọn hết
        selectedCustomers.value = []
    }
})

const copyAllSelected = async () => {
    if (!selectedCustomers.value.length) {
        toast.info("Không có khách hàng nào được chọn!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        return
    }

    // Lấy danh sách customer được chọn
    const selectedList = customers.value.filter(c =>
        selectedCustomers.value.includes(c.customer_name)
    )

    // Format giống copyAllAccounts
    const textToCopy = selectedList
        .map(c => `${c.customer_name}|${c.raw_password}|${baseUrl}/`)
        .join("\n")

    try {
        await navigator.clipboard.writeText(textToCopy)

        toast.success("Đã copy tất cả tài khoản đã chọn!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } catch (err) {
        console.error("Copy selected failed", err)

        toast.error("Không thể copy danh sách đã chọn!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    }
}

const resetPasswordAll = async () => {
    if (!selectedCustomers.value.length) {
        toast.info("Không có khách hàng nào được chọn!", {
            timeout: 3000,
            position: "top-center",
        });
        return;
    }

    loadingStore.show()

    try {
        // 1) Gửi request tạo task
        const res = await apiServices.postResetPassword(selectedCustomers.value);

        if (!res?.task_id) {
            toast.error("Không khởi tạo được tác vụ!", {
                timeout: 3000,
                position: "top-center",
            });
            loadingStore.hide()
            return;
        }

        const taskId = res.task_id;

        toast.info("Đang reset mật khẩu... Vui lòng chờ", {
            timeout: 3000,
            position: "top-center",
        });

        const startTime = Date.now(); // quy đổi ra số nguyên
        const maxTime = 3 * 60 * 1000; // 3 min
        let isDone = false

        // 2) Poll trạng thái Celery mỗi 2 giây
        const pollInterval = setInterval(async () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > maxTime) {
                isDone = true
                clearInterval(pollInterval);
                toast.warning(`Timeout!!! > ${maxTime}`, { timeout: 3000, position: "top-center" });
                loadingStore.hide();
                return;
            }

            try {
                const statusRes = await apiServices.getTaskResetPassword(taskId)
                if (statusRes.status === "pending" || statusRes.status === "running") {
                    return; // tiếp tục poll
                }

                if (statusRes.status === "error") {
                    isDone = true
                    clearInterval(pollInterval);
                    toast.error("Tác vụ lỗi!", { timeout: 3000, position: "top-center" });
                    loadingStore.hide()
                    return;
                }

                if (statusRes.status === "success") {
                    isDone = true
                    clearInterval(pollInterval);

                    const resetData = statusRes.data;

                    // 3) MERGE dữ liệu trả về từ backend
                    resetData.forEach(item => {
                        const idx = customers.value.findIndex(c => c.customer_id === item.customer_id);
                        if (idx !== -1) {
                            customers.value[idx] = {
                                ...customers.value[idx],
                                customer_name: item.username || customers.value[idx].customer_name,
                                raw_password: item.new_password || customers.value[idx].raw_password,
                                password: item.password || customers.value[idx].password,
                                phone_assigned_count: item.phone_assigned_count ?? customers.value[idx].phone_assigned_count,
                                phones: item.phones || customers.value[idx].phones,
                            };
                        }
                    });

                    toast.success(`Đã reset mật khẩu cho ${resetData.length} khách hàng!`, {
                        timeout: 3000,
                        position: "top-center",
                    });

                    loadingStore.hide()
                }
            } catch (e) {
                isDone = true
                console.log(e)
                clearInterval(pollInterval);
                toast.error("Không thể kiểm tra trạng thái tác vụ reset mật khẩu!", {
                    timeout: 3000,
                    position: "top-center",
                });
                loadingStore.hide()
            }
        }, 2000);
    } catch (error) {
        console.log(error)
        toast.error("Không thể reset mật khẩu!", {
            timeout: 3000,
            position: "top-center",
        });
        loadingStore.hide()
    }
};

const openModalCustomer = (user) => {
    selectedCustomer.value = user
    isModalOpenCustomer.value = true
}

const refreshCustomer = async () => {
    await fetchListCustomer(1)
}

const customers = ref([])
// Điều khiển phân trang
const currentPageCustomer = ref(1)
const totalCustomer = ref(0)
const totalPagesCustomer = ref(0)
const nextPageUrl = ref(null)
const prevPageUrl = ref(null)
const isTableCustomerLoading = ref(false)

const setPageCustomer = async (page) => {
    currentPageCustomer.value = page
    // RESET chọn khi đổi trang
    selectAll.value = false
    selectedCustomers.value = []

    await fetchListCustomer(page)
}

const fetchListCustomer = async (page) => {
    try {
        isTableCustomerLoading.value = true
        const response = await apiServices.getListCustomer(page, pageSizeCustomer.value)
        if (response?.results) {
            customers.value = response.results.data.map(u => ({
                customer_id: u.id,
                customer_name: u.username,
                password: u.password,
                raw_password: u.raw_password,
                phone_assigned_count: u.phone_assigned_count,
                phones: u.phones
            }));

            // reset select-all sau khi load page mới
            selectAll.value = false
            selectedCustomers.value = []

            if (response.count) {
                totalCustomer.value = response.count
                totalPagesCustomer.value = Math.ceil(totalCustomer.value / pageSizeCustomer.value)
            }

            nextPageUrl.value = response.next
            prevPageUrl.value = response.previous
        }
    } catch (err) { } finally {
        isTableCustomerLoading.value = false
    }
}

const visibleCustomerPages = computed(() => {
    const total = totalPagesCustomer.value;
    const current = currentPageCustomer.value;
    let pages = [];

    if (total <= 5) {
        // Nếu ít trang thì show hết (2 → total-1)
        for (let i = 2; i < total; i++) pages.push(i);
        return pages;
    }

    // --- CASE 1: đang ở trang đầu (1) ---
    if (current === 1) {
        return [2, 3];  // luôn có 1, 2, 3
    }

    // --- CASE 2: trang = 2 ---
    if (current === 2) {
        return [2, 3, 4];
    }

    // --- CASE 3: trang = 3 ---
    if (current === 3) {
        return [2, 3, 4, 5];
    }

    // --- CASE gần cuối ---
    if (current === total - 1) {
        return [total - 3, total - 2, total - 1];
    }

    if (current === total) {
        return [total - 2, total - 1];
    }

    // --- CASE giữa ---
    return [current - 1, current, current + 1];
});

const deletingCustomer = ref(null)

const deleteCustomer = async (customer) => {
    deletingCustomer.value = customer.customer_id
    try {
        const response = await apiServices.deleteCustomer(customer.customer_id)
        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
            await fetchListCustomer();
        } else {
            // Nếu API trả về lỗi dạng hợp lệ nhưng không throw
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    } catch (err) {
        toast.error(err?.response?.data?.message || "Xoá khách hàng thất bại!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } finally {
        deletingCustomer.value = null // tắt trạng thái xoá
    }
}

const handleRowClick = (event, item, type) => {
    const selectedText = window.getSelection().toString()

    // Nếu có chọn text hoặc không phải click đơn (vd: double click)
    if (selectedText || event.detail !== 1) return

    if (type === 'customer') {
        openModalCustomer(item)
    }
}

const copyAccount = async (user) => {
    if (!user) {
        toast.info("Không có tài khoản nào để copy!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        return
    }

    const username = user.user_name || user.customer_name
    const password = user.raw_password

    if (!username || !password) {
        toast.warning("Không thể copy: Thiếu tài khoản hoặc mật khẩu!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        return
    }

    const textToCopy = `${username}|${password}|${baseUrl}/`

    try {
        await navigator.clipboard.writeText(textToCopy)
        toast.success(`Đã copy account ${username}`, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } catch (err) {
        console.error("Copy all failed", err)
        toast.error("Không thể copy toàn bộ!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    }
}

defineExpose({ fetchListCustomer })

onMounted(async () => {
    await fetchListCustomer()
})
</script>