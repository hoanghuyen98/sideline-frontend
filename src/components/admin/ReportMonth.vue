<template>
    <div class="p-4 bg-white shadow-lg rounded-lg">
        <!-- TIÊU ĐỀ -->
        <div class="flex items-center justify-center gap-2 mb-4">
            <svg class="w-8 h-8 text-blue-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24"
                height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
            </svg>
            <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                THỐNG KÊ THEO THỜI GIAN
            </h2>
        </div>

        <!-- 🔥 PHẦN CHỌN KHOẢNG THỜI GIAN -->
        <div class="rounded-lg p-4 flex flex-wrap items-end gap-4">
            <div class="flex flex-col">
                <label class="text-gray-600 text-sm mb-1">Từ ngày:</label>
                <input type="date" v-model="startDate"
                    class="border border-gray-200 px-3 py-2 rounded-md min-w-[180px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-400 hover:bg-white transition-all duration-200" />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-600 text-sm mb-1">Đến ngày:</label>
                <input type="date" v-model="endDate"
                    class="border border-gray-200 px-3 py-2 rounded-md min-w-[180px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none hover:border-blue-400 hover:bg-white transition-all duration-200" />
            </div>

            <button @click="filterData"
                :disabled="is_loading"
                class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold shadow cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">
                Lấy dữ liệu
            </button>
        </div>

        <!-- =================== 3 BẢNG THỐNG KÊ ==================== -->
        <div class="grid grid-cols-1 2xl:grid-cols-3 gap-6">
            <!-- ===================== Bảng 1: Thống kê theo nhân viên ===================== -->
            <div class="shadow-lg rounded-lg p-6 border border-gray-100 w-full flex flex-col max-h-[600px]">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    📊 Thống kê theo Nhân Viên
                </h2>

                <!-- HEADER (fixed) -->
                <div class="grid grid-cols-7 bg-gray-100 text-gray-700 uppercase text-xs font-bold sticky top-0 z-20">
                    <div class="px-4 py-2">Ngày nhập</div>
                    <div class="px-4 py-2">Nhân viên</div>
                    <div class="px-4 py-2">Tổng SĐT</div>
                    <div class="px-4 py-2">Healthy</div>
                    <div class="px-4 py-2">Tổng Disabled</div>
                    <div class="px-4 py-2">Disabled (lúc nhập)</div>
                    <div class="px-4 py-2">Disabled (sau khi dùng)</div>
                </div>

                <!-- BODY (scroll) -->
                <div class="overflow-y-auto divide-y divide-gray-200 flex-1">
                    <div v-for="(row, idx) in employeeStats" :key="idx"
                        class="grid grid-cols-7 hover:bg-blue-50 text-sm">
                        <div class="px-4 py-2">{{ row.date }}</div>
                        <div class="px-4 py-2">{{ row.employee }}</div>
                        <div class="px-4 py-2 font-semibold">{{ row.total }}</div>
                        <div class="px-4 py-2 text-green-600 font-semibold">{{ row.healthy }}</div>
                        <div class="px-4 py-2 text-red-600 font-semibold">{{ row.disabled_total }}</div>
                        <div class="px-4 py-2">{{ row.disabled_input }}</div>
                        <div class="px-4 py-2">{{ row.disabled_after }}</div>
                    </div>
                </div>

                <!-- FOOTER (fixed at bottom) -->
                <div class="grid grid-cols-7 bg-gray-100 font-bold sticky bottom-0 z-20">
                    <div class="px-4 py-2 col-span-2 text-center">TỔNG CỘNG</div>
                    <div class="px-4 py-2">{{ sumEmployee.total_sdt }}</div>
                    <div class="px-4 py-2">{{ sumEmployee.healthy }}</div>
                    <div class="px-4 py-2">{{ sumEmployee.total_disabled }}</div>
                    <div class="px-4 py-2">{{ sumEmployee.disabled_at_import }}</div>
                    <div class="px-4 py-2">{{ sumEmployee.disabled_after_use }}</div>
                </div>
            </div>

            <!-- ===================== Bảng 2: Thống kê theo nhóm (Chữ cái đầu) ===================== -->
            <div class="shadow-lg rounded-lg p-6 border-gray-100 border flex flex-col max-h-[600px]">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    🔠 Thống kê theo Nhóm
                </h2>

                <!-- HEADER -->
                <div class="grid grid-cols-6 bg-gray-100 text-gray-700 uppercase text-xs font-bold sticky top-0 z-20">
                    <div class="px-4 py-2">Nhóm</div>
                    <div class="px-4 py-2">Tổng SĐT (%)</div>
                    <div class="px-4 py-2">Healthy</div>
                    <div class="px-4 py-2">Tổng Disabled</div>
                    <div class="px-4 py-2">Disabled (lúc nhập)</div>
                    <div class="px-4 py-2">Disabled (sau khi dùng)</div>
                </div>

                <!-- BODY -->
                <div class="overflow-y-auto divide-y divide-gray-200 flex-1">
                    <div v-for="(g, i) in groupStats" :key="i"
                        class="grid grid-cols-6 hover:bg-blue-50 text-sm">
                        <div class="px-4 py-2 font-semibold">{{ g.nhom }}</div>

                        <div class="px-4 py-2">
                            {{ g.tong_sdt }}
                            <span class="text-gray-500 text-xs ml-1">({{ g.ty_le }}%)</span>
                        </div>

                        <div class="px-4 py-2 text-green-600 font-bold">{{ g.healthy }}</div>
                        <div class="px-4 py-2 text-red-600 font-bold">{{ g.tong_disabled }}</div>
                        <div class="px-4 py-2">{{ g.disabled_luc_nhap }}</div>
                        <div class="px-4 py-2">{{ g.disabled_sau_khi_dung }}</div>
                    </div>
                </div>
            </div>


            <!-- ===================== Bảng 3: Thống kê nhóm đã cấp ===================== -->
            <div class="shadow-lg rounded-lg p-6 border-gray-100 border">
                <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
                    👥 Thống kê theo Nhóm (Đã cấp)
                </h2>

                <div class="max-h-[600px] overflow-y-auto w-full overflow-x-auto">
                    <table class="min-w-full text-sm">
                        <thead class="bg-gray-100 text-gray-700 uppercase text-xs">
                            <tr>
                                <th class="px-4 py-2 text-left">Nhóm (tên)</th>
                                <th class="px-4 py-2 text-left">SĐT đã cấp</th>
                                <th class="px-4 py-2 text-left">Tỷ lệ (%)</th>
                                <th class="px-4 py-2 text-left">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, idx) in groupStats_sold" :key="idx"
                                class="border-b border-gray-200 hover:bg-blue-50">
                                <td class="px-4 py-2 font-semibold">{{ item.nhom }}</td>
                                <td class="px-4 py-2">{{ item.sdt_da_cap }}</td>
                                <td class="px-4 py-2 text-blue-600 font-semibold">{{ item.ty_le }}%</td>
                                <td class="px-4 py-2">
                                    <button
                                        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md shadow">
                                        💰 Thanh toán
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted } from "vue"
import { useToast } from "vue-toastification"
import apiServices from '@/services/api.services'

const toast = useToast()

const employeeStats = ref([])
const sumEmployee = ref({})

const groupStats = ref([])
const groupStats_sold = ref([])


// =======================
// 🔥 RANGE FILTER STATE
// =======================
const startDate = ref("")
const endDate = ref("")
const is_loading = ref(false)

const fetchAllReports = async (start_date, end_date) => {
    try {
        is_loading.value = true
        const [
            empRes,
            groupRes,
            soldRes
        ] = await Promise.all([
            apiServices.getEmployeeReportOfDate(start_date, end_date),
            apiServices.getGroupReportOfDate(start_date, end_date),
            apiServices.getGroupSoldReportOfDate(start_date, end_date)
        ])

        // ============================
        // 📌 XỬ LÝ EMPLOYEE REPORT
        // ============================
        const empData = empRes.results
        if (empData?.status === "success") {
            employeeStats.value = empData.data.records.map(item => ({
                date: item.ngay,
                employee: item.nhan_vien,
                total: item.tong_sdt,
                healthy: item.healthy,
                disabled_total: item.tong_disabled,
                disabled_input: item.disabled_luc_nhap,
                disabled_after: item.disabled_sau_khi_dung
            }))
            sumEmployee.value = empData.data.summary
        }

        // ============================
        // 📌 XỬ LÝ GROUP REPORT
        // ============================

        if (groupRes?.status === "success") {
            groupStats.value = groupRes.data.records.map(item => ({
                nhom: item.nhom,
                tong_sdt: item.tong_sdt,
                healthy: item.healthy,
                tong_disabled: item.tong_disabled,
                total_lock_phone: item.total_lock_phone,
                disabled_luc_nhap: item.disabled_luc_nhap,
                disabled_sau_khi_dung: item.disabled_sau_khi_dung,
                ty_le: item.ty_le
            }))
        }

        // ============================
        // 📌 XỬ LÝ GROUP SOLD REPORT
        // ============================
        if (soldRes?.status === "success") {
            groupStats_sold.value = soldRes.data.records.map(item => ({
                nhom: item.nhom,
                sdt_da_cap: item.sdt_da_cap,
                ty_le: item.ty_le
            }))
        }

    } catch (err) {
        toast.error("Lỗi khi tải báo cáo! " + err.message)
    } finally {
        is_loading.value = false
    }
}

const filterData = async () => {
    if (!startDate.value || !endDate.value) {
        toast.info("Vui lòng chọn đầy đủ khoảng thời gian!")
        return
    }

    await fetchAllReports(startDate.value, endDate.value)
}

onMounted(async () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, "0")
    const dd = String(today.getDate()).padStart(2, "0")

    const todayStr = `${yyyy}-${mm}-${dd}`

    startDate.value = todayStr
    endDate.value = todayStr

    await fetchAllReports(startDate.value, endDate.value)
})
</script>
<style scoped>
</style>