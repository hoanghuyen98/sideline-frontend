<template>
    <div class="min-h-screen w-full bg-gray-100 px-4 pt-16 flex flex-col">
        <div class="py-4 space-y-6">
            <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6"> -->
            <!-- thống kê tổng quan -->
            <div class="bg-white w-full rounded-lg shadow-xl p-8 space-y-6">
                <div class="flex items-center justify-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600 flex-none shrink-0"
                        viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 012 0v1a1 1 0 01-2 0V6zm1 3a1 1 0 00-1 1v3a1 1 0 002 0v-3a1 1 0 00-1-1z"
                            clip-rule="evenodd" />
                    </svg>
                    <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        THỐNG KÊ TỔNG QUAN</h2>
                </div>
                <div class="flex gap-4 text-center">
                    <div v-for="item in report_stats" :key="item.label"
                        class="flex-1 bg-gray-100 rounded-lg p-3 shadow-lg">
                        <p class="text-2xl font-bold text-blue-500">{{ item.value.toLocaleString() }}</p>
                        <p class="text text-gray-600 font-semibold">{{ item.label }}</p>
                    </div>
                </div>
            </div>
            <!-- </div> -->

            <ReportMonth></ReportMonth>

            <div class="p-4 bg-white shadow-lg rounded-lg">
                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <!-- tạo nhóm nhân viên -->
                    <form @submit.prevent="createGroupUser"
                        class="self-start bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-6">
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-8 h-8 text-blue-600 flex-none shrink-0" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                                TẠO NHÓM NHÂN VIÊN
                            </h2>
                        </div>
                        <input v-model="group_user" type="text" placeholder="Tên nhóm" required
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                        <ButtonProcess title="Tạo nhóm" :isLoading="isBtnCreateGroupLoading" type="submit" />
                    </form>

                    <!-- form tạo nhân viên -->
                    <form @submit.prevent="createUser"
                        class="self-start bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-6">
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-8 h-8 text-blue-600 flex-none shrink-0" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                                TẠO TÀI KHOẢN NHÂN VIÊN
                            </h2>
                        </div>

                        <input v-model="username_employee" type="text" placeholder="Nhập username" required
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                        <input v-model="password_employee" type="text" placeholder="Nhập password" required
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                        <select v-model="selectedGroup"
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow bg-white">
                            <option value="">-- Nhóm nhân viên --</option>
                            <option v-for="group in groupList" :key="group.id" :value="group.name">
                                {{ group.name }}
                            </option>
                        </select>
                        <ButtonProcess title="Thêm nhân viên" :isLoading="isBtnCreateUserLoading" type="submit" />
                    </form>

                    <!-- form tạo khách hàng -->
                    <form @submit.prevent="createCustomer"
                        class="self-start bg-white w-full max-w-5xl rounded-lg shadow-xl p-8 space-y-6">
                        <div class="flex items-center justify-center gap-2">
                            <svg class="w-8 h-8 text-purple-600 flex-none shrink-0" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                                CẤP SĐT KHÁCH HÀNG
                            </h2>
                        </div>

                        <input v-model.number="customer_phone_buy" type="number" required
                            placeholder="Số lượng SĐT (mặc định là 0)"
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow" />
                        <ButtonProcess title="Thêm khách hàng" :isLoading="isBtnCreateCustomerLoading" type="submit"
                            color_btn="purple" />

                        <!-- Dropdown chọn ngày tạo -->
                        <select v-model="selectedHistory" @change="onSelectHistory"
                            class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-300 shadow bg-white">
                            <option value="">-- Các lần cấp số --</option>
                            <option v-for="(item, index) in historyAccount" :key="item.id" :value="item.id" :class="{
                                'text-gray-400': item.is_revoke
                            }">
                                {{ index + 1 }}. Ngày tạo: {{ formatLocal(item.created_at) }} - Số lượng: {{
                                    item.phone_count }}
                                <span v-if="item.is_revoke"> (Đã thu hồi)</span>
                            </option>
                        </select>

                        <!-- KẾT QUẢ SAU KHI TẠO -->
                        <div v-if="generatedAccounts && generatedAccounts.length"
                            class="mt-6 border-t pt-4 space-y-3 text-gray-800 text-left">
                            <div v-if="isRevokeSelected"
                                class="mt-3 p-3 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded">
                                Đã bị thu hồi - Các thao tác đã bị vô hiệu hóa
                            </div>
                            <!-- Header + nút copy all -->
                            <div class="flex items-center justify-between gap-4 flex-wrap">
                                <div class="flex items-center gap-2 font-semibold whitespace-nowrap">
                                    <span>Kết quả đã tạo</span>
                                    <span class="text-green-500 text-2xl font-bold">{{ generatedAccounts.length || 0
                                        }}</span>
                                </div>
                                <div class="flex gap-2 flex-wrap justify-end">
                                    <!-- Popup Confirm Reset -->
                                    <div v-if="showConfirmReset"
                                        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                                        <!-- Popup box -->
                                        <div
                                            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all scale-100">

                                            <h2 class="text-xl font-bold mb-3">Xác nhận reset mật khẩu?</h2>
                                            <p class="text-gray-600 dark:text-gray-300 mb-6">
                                                Bạn có chắc muốn reset mật khẩu cho
                                                <strong class="text-red-600">{{ generatedAccounts.length }}</strong> tài
                                                khoản?
                                            </p>

                                            <div class="flex justify-end space-x-4">
                                                <button @click="showConfirmReset = false"
                                                    class="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                    Hủy
                                                </button>

                                                <button @click="confirmReset"
                                                    class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 shadow cursor-pointer">
                                                    Xác nhận
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Popup Confirm THU HỒI -->
                                    <div v-if="showConfirmRevoke"
                                        class="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
                                        <div
                                            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all scale-100">

                                            <h2 class="text-xl font-bold mb-3">
                                                Xác nhận thu hồi?
                                            </h2>

                                            <p class="text-gray-600 dark:text-gray-300 mb-6">
                                                Bạn có chắc muốn <strong class="text-yellow-600">thu hồi {{
                                                    generatedAccounts.length }} tài khoản </strong>
                                                <br />
                                                <span class="text-sm text-gray-500">
                                                    (Tài khoản sẽ bị vô hiệu hóa và không thể sử dụng)
                                                </span>
                                            </p>

                                            <div class="flex justify-end space-x-4">
                                                <button @click="showConfirmRevoke = false"
                                                    class="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                    Hủy
                                                </button>

                                                <button @click="confirmRevokeAccount"
                                                    class="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600 shadow cursor-pointer">
                                                    Xác nhận thu hồi
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" @click="copyAllAccounts" :disabled="isRevokeSelected" :class="isRevokeSelected
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-700 cursor-pointer'"
                                        class="text-white px-4 py-2 rounded shadow">
                                        Copy All
                                    </button>
                                    <button type="button" @click="showConfirmReset = true" :disabled="isRevokeSelected"
                                        :class="isRevokeSelected
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-red-600 hover:bg-red-700 cursor-pointer'"
                                        class="text-white px-4 py-2 rounded shadow">
                                        Reset Password
                                    </button>
                                    <!-- THU HỒI -->
                                    <button type="button" @click="showConfirmRevoke = true"
                                        :disabled="isRevokeSelected || !selectedHistory" :class="isRevokeSelected
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-yellow-500 hover:bg-yellow-600 cursor-pointer'"
                                        class="text-white px-4 py-2 rounded shadow">
                                        Thu hồi
                                    </button>
                                </div>
                            </div>

                            <div class="max-h-[300px] md:max-h-[500px] lg:max-h-[700px] overflow-y-auto space-y-3 pr-2"
                                :class="{ 'opacity-50 pointer-events-none': isRevokeSelected }">
                                <div v-for="(account, index) in generatedAccounts" :key="index"
                                    class="bg-gray-50 border rounded p-3 space-y-2">
                                    <div class="flex justify-between items-center">
                                        <span class="font-semibold">SĐT: {{ account.username }}</span>
                                        <button @click="copyText(account.username)" type="button"
                                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">
                                            Copy
                                        </button>
                                    </div>

                                    <div class="flex justify-between items-center">
                                        <span class="font-semibold">Mật khẩu: {{ account.password }}</span>
                                        <button @click="copyText(account.password)" type="button"
                                            class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer">
                                            Copy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div class="grid grid-cols-1 2xl:grid-cols-2 gap-6">
                <!-- Danh sách nhân viên -->
                <div class="lg:row-span-2 bg-white w-full rounded-lg shadow-xl p-8 space-y-6">
                    <div class="flex items-center justify-center gap-2 mb-4">
                        <svg class="w-8 h-8 text-blue-600 flex-none shrink-0" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path fill-rule="evenodd"
                                d="M12 6a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-1.5 8a4 4 0 0 0-4 4 2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-3Zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293 3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2 4 4 0 0 0-4-4h-1.1a5.503 5.503 0 0 1-.471.762A5.998 5.998 0 0 1 19.5 18ZM4 7.5a3.5 3.5 0 0 1 5.477-2.889 5.5 5.5 0 0 0-2.796 6.293A3.501 3.501 0 0 1 4 7.5ZM7.1 12H6a4 4 0 0 0-4 4 2 2 0 0 0 2 2h.5a5.998 5.998 0 0 1 3.071-5.238A5.505 5.505 0 0 1 7.1 12Z"
                                clip-rule="evenodd" />
                        </svg>
                        <h2 class="text-2xl font-bold text-center flex items-center justify-center gap-2">
                            DANH SÁCH NHÂN VIÊN</h2>
                    </div>
                    <!-- table user -->
                    <div class="relative flex-1 overflow-y-auto">
                        <div v-if="isTableEmployeeLoading"
                            class="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-20">
                            <svg class="w-10 h-10 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor">
                                <path
                                    d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                                    <animateTransform attributeName="transform" type="rotate" dur="0.75s"
                                        values="0 12 12;360 12 12" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>
                        <table class="min-w-full table-fixed divide-y divide-gray-200 text-sm">
                            <thead class="bg-gray-100 text-gray-700 font-semibold">
                                <tr>
                                    <th class="px-4 py-2 text-left">TÊN</th>
                                    <th class="px-4 py-2 text-left">PASSWORD</th>
                                    <th class="px-4 py-2 text-left">GROUP</th>
                                    <th class="px-4 py-2 text-left">MAIL ĐÃ MUA</th>
                                    <th class="px-4 py-2 text-left">MAIL CHƯA SỬ DỤNG</th>
                                    <th class="px-4 py-2 text-left">HÀNH ĐỘNG</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="users.length === 0">
                                    <td colspan="6" class="text-center text-gray-500 py-4">
                                        <p class="font-bold">
                                            Không có nhân viên nào.
                                        </p>
                                    </td>
                                </tr>
                                <tr v-for="(user, index) in users" :key="user.user_id" v-if="users.length > 0"
                                    @click="handleRowClick($event, user, 'user')"
                                    class="border-b border-gray-200 hover:bg-blue-50 cursor-pointer">
                                    <td class="px-4 py-2">{{ user.user_name }}</td>
                                    <td class="px-4 py-2 max-w-[200px] truncate">{{ user.raw_password }}</td>
                                    <td class="px-4 py-2">{{ user.group_name }}</td>
                                    <td class="px-4 py-2">{{ user.group_name }}</td>
                                    <td class="px-4 py-2">{{ user.group_name }}</td>
                                    <td class="px-4 py-2 flex text-center space-x-2">
                                        <button @click.stop="copyAccount(user)"
                                            class="flex bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer">
                                            <svg class="w-4 h-4 text-white" aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                viewBox="0 0 24 24">
                                                <path stroke="currentColor" stroke-linecap="round"
                                                    stroke-linejoin="round" stroke-width="2"
                                                    d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-5-4v4h4V3h-4Z" />
                                            </svg>
                                            Copy
                                        </button>
                                        <button @click.stop="deleteEmployee(user)"
                                            :disabled="deletingEmployee === user.user_id"
                                            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold cursor-pointer"
                                            :class="deletingEmployee === user.user_id
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-red-500 hover:bg-red-600'">
                                            <svg v-if="deletingEmployee === user.user_id"
                                                class="animate-spin h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4"></circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                                            </svg>
                                            <span>
                                                {{ deletingEmployee === user.user_id ? '' : 'Xóa' }}
                                            </span>
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- Pagination -->
                    <div v-if="totalPagesEmployee > 1" class="flex flex-wrap justify-center items-center gap-2 mt-6">

                        <!-- Prev -->
                        <button @click="setPageEmployee(currentPageEmployee - 1)" :disabled="currentPageEmployee === 1"
                            class="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer">
                            ← Trước
                        </button>

                        <!-- Trang 1 -->
                        <button @click="setPageEmployee(1)" :class="[
                            'px-3 py-1 border rounded-md cursor-pointer',
                            currentPageEmployee === 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        ]">
                            1
                        </button>

                        <!-- Dấu ... bên trái -->
                        <span v-if="currentPageEmployee > 3" class="px-2">…</span>

                        <!-- Các trang dynamic -->
                        <button v-for="page in visibleEmployeePages" :key="page" @click="setPageEmployee(page)" :class="[
                            'px-3 py-1 border rounded-md cursor-pointer',
                            currentPageEmployee === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        ]">
                            {{ page }}
                        </button>

                        <!-- Dấu ... bên phải -->
                        <span v-if="currentPageEmployee < totalPagesEmployee - 2" class="px-2">…</span>

                        <!-- Trang cuối -->
                        <button v-if="totalPagesEmployee > 1" @click="setPageEmployee(totalPagesEmployee)" :class="[
                            'px-3 py-1 border rounded-md cursor-pointer',
                            currentPageEmployee === totalPagesEmployee
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        ]">
                            {{ totalPagesEmployee }}
                        </button>

                        <!-- Next -->
                        <button @click="setPageEmployee(currentPageEmployee + 1)"
                            :disabled="currentPageEmployee === totalPagesEmployee"
                            class="px-3 py-1 border rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 cursor-pointer">
                            Sau →
                        </button>
                    </div>
                </div>

                <CustomerTable ref="customerTableRef" />

                <!-- Danh sách khách hàng -->

            </div>
            <!-- Cài đặt Proxy -->
            <div class="bg-white w-full rounded-lg shadow-xl p-8 space-y-6">
                <div class="flex items-center justify-center gap-2 mb-2">
                    <svg class="w-8 h-8 text-green-600 flex-none shrink-0" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 18.5A2.493 2.493 0 0 1 7.51 20H7.5a2.468 2.468 0 0 1-2.4-3.154 2.98 2.98 0 0 1-.85-5.274 2.468 2.468 0 0 1 .92-3.182 2.477 2.477 0 0 1 1.876-3.344 2.5 2.5 0 0 1 3.41-1.856A2.5 2.5 0 0 1 12 5.5m0 13v-13m0 13a2.493 2.493 0 0 0 4.49 1.5h.01a2.468 2.468 0 0 0 2.4-3.154 2.98 2.98 0 0 0 .85-5.274 2.468 2.468 0 0 0-.92-3.182 2.477 2.477 0 0 0-1.876-3.344A2.5 2.5 0 0 0 14.5 3.5 2.5 2.5 0 0 0 12 5.5" />
                    </svg>
                    <h2 class="text-2xl font-bold text-center">CÀI ĐẶT PROXY</h2>
                </div>

                <!-- Format hướng dẫn -->
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 space-y-1">
                    <p class="font-semibold">📋 Format chuẩn (mỗi proxy một dòng):</p>
                    <code class="block bg-white border border-blue-100 rounded px-3 py-2 font-mono text-xs">http://username:password@host:port</code>
                    <p class="text-xs text-blue-600 mt-1">
                        Ví dụ: <span class="font-mono">http://myuser:mypass@104.25.34.12:12233</span>
                    </p>
                </div>

                <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <!-- Form cập nhật proxy -->
                    <div class="space-y-4">
                        <h3 class="font-semibold text-gray-700">Cập nhật Proxy US</h3>
                        <div class="space-y-1">
                            <input v-model="proxyInput" type="text" @input="proxyInputError = ''"
                                placeholder="http://username:password@host:port"
                                :class="proxyInputError
                                    ? 'border-red-400 bg-red-50 focus:ring-red-300'
                                    : 'border-gray-300 focus:ring-blue-300'"
                                class="w-full p-3 border rounded-md focus:ring-2 font-mono text-sm outline-none" />
                            <div v-if="proxyInputError" class="flex items-start gap-1.5 text-red-600 text-xs">
                                <span class="mt-0.5 shrink-0">⚠️</span>
                                <span>{{ proxyInputError }}</span>
                            </div>
                            <p class="text-xs text-gray-400">Format: <span class="font-mono">http://username:password@host:port</span></p>
                        </div>
                        <ButtonProcess title="Lưu Proxy" :isLoading="isBtnSaveProxyLoading" @click="saveProxy" />
                    </div>

                    <!-- Proxy hiện tại + Test -->
                    <div class="space-y-4">
                        <h3 class="font-semibold text-gray-700">Proxy US hiện tại</h3>

                        <div v-if="isProxyLoading" class="flex justify-center py-8">
                            <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor">
                                <path
                                    d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                                    <animateTransform attributeName="transform" type="rotate" dur="0.75s"
                                        values="0 12 12;360 12 12" repeatCount="indefinite" />
                                </path>
                            </svg>
                        </div>

                        <div v-else-if="!currentProxy"
                            class="text-center text-gray-400 py-8 border border-dashed border-gray-300 rounded-lg">
                            Chưa có proxy nào được cấu hình
                        </div>

                        <template v-else>
                            <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded px-4 py-3 gap-3">
                                <span class="font-mono text-sm text-gray-800 break-all">{{ currentProxy }}</span>
                                <button @click="copyText(currentProxy)"
                                    class="shrink-0 bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1.5 rounded cursor-pointer">
                                    Copy
                                </button>
                            </div>

                            <!-- Nút Test -->
                            <ButtonProcess title="Test Proxy" :isLoading="isTestingProxy" @click="testProxy"
                                color_btn="gray" />

                            <!-- Kết quả test -->
                            <div v-if="proxyTestResult" :class="proxyTestResult.status === 'success'
                                ? 'bg-green-50 border-green-300 text-green-800'
                                : 'bg-red-50 border-red-300 text-red-800'"
                                class="border rounded-lg px-4 py-3 text-sm space-y-1">
                                <p class="font-semibold">
                                    {{ proxyTestResult.status === 'success' ? '✅ Proxy hoạt động!' : '❌ Proxy lỗi!' }}
                                </p>
                                <template v-if="proxyTestResult.status === 'success'">
                                    <p>🌐 IP: <span class="font-mono font-bold">{{ proxyTestResult.ip }}</span></p>
                                    <p>🏳️ Country: <span class="font-semibold">{{ proxyTestResult.country }}</span></p>
                                    <p>🏢 Org: <span class="text-gray-700">{{ proxyTestResult.org }}</span></p>
                                </template>
                                <template v-else>
                                    <p>{{ proxyTestResult.message }}</p>
                                </template>
                            </div>
                        </template>

                        <p v-if="proxyUpdatedAt" class="text-xs text-gray-400">
                            Cập nhật lúc: {{ formatLocal(proxyUpdatedAt) }}
                        </p>
                    </div>
                </div>
            </div>

            <StaffModal :show="isModalOpen" :user="selectedUser" :groups="groupList" @close="isModalOpen = false"
                @save-success="refreshEmployee" />
            <!-- <CustomerModal :show="isModalOpenCustomer" :user="selectedCustomer" @close="isModalOpenCustomer = false"
                @save-success="refreshCustomer" /> -->
        </div>
    </div>
</template>

<script setup>
import ButtonProcess from '@/components/ButtonProcess.vue'
import { ref, computed, onMounted } from 'vue'
import StaffModal from '@/components/StaffModal.vue'
import apiServices from '@/services/api.services'
import { useToast } from "vue-toastification"
import ReportMonth from "@/components/admin/ReportMonth.vue"
import CustomerTable from '@/components/admin/CustomerTable.vue'
import { formatLocal } from "@/ultis/extensions"
import { useLoadingStore } from '@/stores/loadingStore'

const loadingStore = useLoadingStore()
const baseUrl = import.meta.env.VITE_DOMAIN_WEB;
const toast = useToast()

async function copyText(text) {
    try {
        if (!navigator.clipboard) throw new Error('Clipboard API không hỗ trợ')
        await navigator.clipboard.writeText(text)
        toast.success('Đã copy', {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false
        })
        return true
    } catch (err) {
        console.error('Copy failed', err)
        return false
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

// -------------- tạo tài khoản nhân viên ---------
const isBtnCreateUserLoading = ref(false)
const username_employee = ref('')
const password_employee = ref('')
const selectedGroup = ref('')
const groupList = ref([]);

const createUser = async () => {
    isBtnCreateUserLoading.value = true
    try {
        const response = await apiServices.postCreateEmployee(username_employee.value, password_employee.value, selectedGroup.value)
        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
            username_employee.value = ''
            password_employee.value = ''
            selectedGroup.value = ''
            currentPageEmployee.value = 1
            await fetchListEmployee()
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
        }
    } catch (err) {
        toast.error(err, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } finally {
        isBtnCreateUserLoading.value = false
    }
}
// -------------------------------------------

// -----------------tạo nhóm nhân viên-----------
const group_user = ref()
const isBtnCreateGroupLoading = ref(false)
const createGroupUser = async () => {
    isBtnCreateGroupLoading.value = true
    try {
        const response = await apiServices.postCreateGroup(group_user.value)
        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
        }
    } catch (err) {
        toast.error(err, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } finally {
        isBtnCreateGroupLoading.value = false
    }
}
// ---------------------------------------------

// ---------------- tạo tài khoản khách hàng -----
const isBtnCreateCustomerLoading = ref(false)
const customer_phone_buy = ref(null)
const generatedAccounts = ref([]);
const isBtnCustomerHistoryLoading = ref(false)
const customerTableRef = ref(null)
const historyAccount = ref([])
const selectedHistory = ref('')

const createCustomer = async () => {
    if (!customer_phone_buy.value) {
        customer_phone_buy.value = 0
    }
    isBtnCreateCustomerLoading.value = true
    try {
        const response = await apiServices.postAutoCreateCustomer(customer_phone_buy.value)
        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
            generatedAccounts.value = response.data;
            await customerTableRef.value?.fetchListCustomer()
            customer_phone_buy.value = null
        } else {
            toast.error(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            })
        }
    } catch (err) {
        console.log(err)
        toast.error(err, {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } finally {
        isBtnCreateCustomerLoading.value = false
        selectedHistory.value = ''
    }
}

const selectedHistoryItem = computed(() => {
    return historyAccount.value.find(
        item => item.id === selectedHistory.value
    )
})

const isRevokeSelected = computed(() => {
    return selectedHistoryItem.value?.is_revoke === true
})

const onSelectHistory = () => {
    const selected = historyAccount.value.find(item => item.id === selectedHistory.value)
    generatedAccounts.value = selected?.created_list || []
}

const fetchCustomerHistory = async () => {
    try {
        const response = await apiServices.getCustomerAssignHistory()
        if (response?.status === 'success') {
            historyAccount.value = response?.data
        }
    } catch (err) {
        console.log(err)
    }
}

const copyAllAccounts = async () => {
    if (isRevokeSelected.value) {
        toast.warning("Không thể copy vì lịch sử đã bị thu hồi!", {
            timeout: 3000,
            position: "top-center",
        })
        return
    }

    if (!generatedAccounts.value || !generatedAccounts.value.length) {
        toast.info("Không có tài khoản nào để copy!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
        return
    }

    const textToCopy = generatedAccounts.value
        .map(acc => `${acc.username}|${acc.password}|${baseUrl}/`)
        .join("\n")

    try {
        await navigator.clipboard.writeText(textToCopy)
        toast.success("Đã copy toàn bộ tài khoản!", {
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

const showConfirmReset = ref(false);
const showConfirmRevoke = ref(false)

const confirmReset = () => {
    showConfirmReset.value = false;
    resetAllPasswords();
};

const confirmRevokeAccount = async () => {
    showConfirmRevoke.value = false
    revokeAccount();
}

const resetAllPasswords = async () => {
    if (isRevokeSelected.value) {
        toast.warning("Không thể reset mật khẩu vì lịch sử đã bị thu hồi!", {
            timeout: 3000,
            position: "top-center",
        })
        return
    }

    if (!generatedAccounts.value.length) {
        toast.info("Không có khách hàng nào để reset password", { timeout: 3000, position: "top-center" });
        return;
    }

    if (!selectedHistory.value) {
        toast.info("Vui lòng chọn lịch sử trước khi reset", { timeout: 3000, position: "top-center" });
        return;
    }

    const customer_names = generatedAccounts.value.map(acc => acc.username);
    const history_id = selectedHistory.value;

    loadingStore.show();

    try {
        // 1) Gửi request tạo task
        const res = await apiServices.postResetPassword(customer_names, history_id);

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

        // 2) Poll trạng thái Celery mỗi 2 giây
        const pollInterval = setInterval(async () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > maxTime) {
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
                    clearInterval(pollInterval);
                    toast.error("Tác vụ lỗi!", { timeout: 3000, position: "top-center" });
                    loadingStore.hide()
                    return;
                }

                if (statusRes.status === "success") {
                    clearInterval(pollInterval);

                    const resetData = statusRes.data;

                    // 3) MERGE dữ liệu trả về từ backend
                    resetData.forEach(item => {
                        const idx = generatedAccounts.value.findIndex(c => c.username === item.username);
                        if (idx !== -1) {
                            generatedAccounts.value[idx] = {
                                ...generatedAccounts.value[idx],
                                username: item.username || generatedAccounts.value[idx].username,
                                password: item.new_password || generatedAccounts.value[idx].password,
                                raw_password: item.new_password || generatedAccounts.value[idx].raw_password,
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
}

const revokeAccount = async () => {
    if (isRevokeSelected.value) {
        toast.warning("", {
            timeout: 3000,
            position: "top-center",
        })
        return
    }

    if (!generatedAccounts.value.length) {
        toast.info("Không có khách hàng nào để reset password", { timeout: 3000, position: "top-center" });
        return;
    }

    if (!selectedHistory.value) {
        toast.info("Vui lòng chọn lịch sử trước khi reset", { timeout: 3000, position: "top-center" });
        return;
    }

    const customer_names = generatedAccounts.value.map(acc => acc.username);
    const history_id = selectedHistory.value;

    loadingStore.show();

    try {
        // 1) Gửi request tạo task
        const res = await apiServices.postRevokeAccount(customer_names, history_id);

        if (!res?.task_id) {
            toast.error("Không khởi tạo được tác vụ!", {
                timeout: 3000,
                position: "top-center",
            });
            loadingStore.hide()
            return;
        }

        const taskId = res.task_id;

        toast.info("Thu hồi tài khoản... Vui lòng chờ", {
            timeout: 3000,
            position: "top-center",
        });

        const startTime = Date.now(); // quy đổi ra số nguyên
        const maxTime = 3 * 60 * 1000; // 3 min

        // 2) Poll trạng thái Celery mỗi 2 giây
        const pollInterval = setInterval(async () => {
            const elapsed = Date.now() - startTime;
            if (elapsed > maxTime) {
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
                    clearInterval(pollInterval);
                    toast.error("Tác vụ lỗi!", { timeout: 3000, position: "top-center" });
                    loadingStore.hide()
                    return;
                }

                if (statusRes.status === "success") {
                    clearInterval(pollInterval);
                    toast.success(`Đã thu hồi tài khoản!`, {
                        timeout: 3000,
                        position: "top-center",
                    });
                    await fetchCustomerHistory()
                    generatedAccounts.value = []
                    selectedHistory.value = ""
                    loadingStore.hide()
                }
            } catch (e) {
                console.log(e)
                clearInterval(pollInterval);
                toast.error("Không thể kiểm tra trạng thái thu hồi tài khoản!", {
                    timeout: 3000,
                    position: "top-center",
                });
                loadingStore.hide()
            }
        }, 2000);
    } catch (error) {
        console.log(error)
        toast.error("Không thể thu hồi tài khoản!", {
            timeout: 3000,
            position: "top-center",
        });
        loadingStore.hide()
    }
}
// -----------------------------------------------

// ---------- danh sách nhân viên ---------------
const selectedUser = ref(null)
const isModalOpen = ref(false)

const openModalUser = (user) => {
    selectedUser.value = user
    isModalOpen.value = true
}

const fetchListGroup = async () => {
    try {
        const response = await apiServices.getListGroup()
        if (response) {
            groupList.value = response
        }
    } catch (err) {
    }
}
const users = ref([])
// Điều khiển phân trang
const currentPageEmployee = ref(1)
const itemsPerPageEmployee = 10
const totalEmployee = ref(0)
const nextPageUrlEmployee = ref()
const prevPageUrlEmployee = ref()
const totalPagesEmployee = ref(0)
const isTableEmployeeLoading = ref(false)

const setPageEmployee = async (page) => {
    currentPageEmployee.value = page
    await fetchListEmployee(page)
}

const fetchListEmployee = async (page = 1) => {
    try {
        isTableEmployeeLoading.value = true
        const response = await apiServices.getListEmployee(page)
        if (response?.results) {
            users.value = response.results.data.map(u => ({
                user_id: u.id,
                user_name: u.username,
                password: u.password,
                group_name: u.group_name,
                group_id: u.group_id,
                raw_password: u.raw_password
            }));

            if (response.count) {
                totalEmployee.value = response.count
                totalPagesEmployee.value = Math.ceil(totalEmployee.value / itemsPerPageEmployee)
            }

            nextPageUrlEmployee.value = response.next
            prevPageUrlEmployee.value = response.previous
        }
    } catch (err) { } finally {
        isTableEmployeeLoading.value = false
    }
}

const visibleEmployeePages = computed(() => {
    const total = totalPagesEmployee.value;
    const current = currentPageEmployee.value;
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

const deletingEmployee = ref(null)

const deleteEmployee = async (user) => {
    deletingEmployee.value = user.user_id
    try {
        const response = await apiServices.deleteEmployee(user.user_id)
        if (response?.status === 'success') {
            toast.success(response?.message, {
                timeout: 3000,
                position: "top-center",
                closeOnClick: false,
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
            await fetchListEmployee();
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
        toast.error(err?.response?.data?.message || "Xoá nhân viên thất bại!", {
            timeout: 3000,
            position: "top-center",
            closeOnClick: false,
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        })
    } finally {
        deletingEmployee.value = null // tắt trạng thái xoá
    }
}

const refreshEmployee = async () => {
    await fetchListEmployee()
}
// ----------------------------------------------

// ---------------------- report -----------------
const tong_sdt = ref(0)
const healthy_sdt = ref(0)
const disabled_sdt = ref(0)
const da_cap_cho_user = ref(0)
const dang_cho_cap = ref(0)

const report_stats = ref([])

const fetchReportOverview = async () => {
    try {
        const response = await apiServices.getReportOverview()
        if (response?.status === 'success') {
            const data = response.data

            tong_sdt.value = data.tong_sdt
            healthy_sdt.value = data.healthy_sdt
            disabled_sdt.value = data.disabled_sdt
            da_cap_cho_user.value = data.da_cap_cho_user
            dang_cho_cap.value = data.dang_cho_cap

            report_stats.value = [
                { label: 'Tổng SĐT', value: data.tong_sdt },
                { label: 'SĐT Healthy', value: data.healthy_sdt },
                { label: 'SĐT Bị Disabled', value: data.disabled_sdt },
                { label: 'Đã Cấp Cho User', value: data.da_cap_cho_user },
                { label: 'Đang Chờ Cấp', value: data.dang_cho_cap },
            ]
        }
    } catch (err) {
    }
}

// ---------------------------------------------
const handleRowClick = (event, item, type) => {
    const selectedText = window.getSelection().toString()

    // Nếu có chọn text hoặc không phải click đơn (vd: double click)
    if (selectedText || event.detail !== 1) return

    if (type === 'user') {
        openModalUser(item)
    } else if (type === 'customer') {
        openModalCustomer(item)
    }
}

// -------------------- Proxy Setting --------------------
const proxyInput = ref('')
const currentProxy = ref('')
const proxyUpdatedAt = ref(null)
const isProxyLoading = ref(false)
const isBtnSaveProxyLoading = ref(false)
const isTestingProxy = ref(false)
const proxyTestResult = ref(null)
const proxyInputError = ref('')

const validateProxy = (value) => {
    if (!value) return 'Vui lòng nhập proxy!'

    if (!value.startsWith('http://') && !value.startsWith('https://')) {
        return 'Thiếu prefix — phải bắt đầu bằng "http://" hoặc "https://"'
    }

    // Tách phần sau http(s)://
    const withoutScheme = value.replace(/^https?:\/\//, '')

    if (!withoutScheme.includes('@')) {
        return 'Thiếu phần "username:password@" trước địa chỉ host'
    }

    const atIdx = withoutScheme.lastIndexOf('@')
    const credentials = withoutScheme.slice(0, atIdx)
    const hostPort = withoutScheme.slice(atIdx + 1)

    if (!credentials.includes(':')) {
        return 'Thiếu dấu ":" giữa username và password (VD: myuser:mypass)'
    }

    const [username, ...passParts] = credentials.split(':')
    const password = passParts.join(':')

    if (!username) return 'Username không được để trống'
    if (!password) return 'Password không được để trống'

    if (!hostPort.includes(':')) {
        return 'Thiếu port — format host phải là "host:port" (VD: 104.25.34.12:8080)'
    }

    const lastColon = hostPort.lastIndexOf(':')
    const host = hostPort.slice(0, lastColon)
    const port = hostPort.slice(lastColon + 1)

    if (!host) return 'Địa chỉ host không được để trống'

    if (!/^\d+$/.test(port)) {
        return `Port không hợp lệ: "${port}" — port phải là số nguyên (VD: 10000)`
    }

    const portNum = parseInt(port)
    if (portNum < 1 || portNum > 65535) {
        return `Port ${portNum} nằm ngoài phạm vi hợp lệ (1 - 65535)`
    }

    return ''
}

const fetchProxySetting = async () => {
    isProxyLoading.value = true
    try {
        const response = await apiServices.getProxySetting()
        if (response?.status === 'success') {
            currentProxy.value = response.proxy_us || ''
            proxyUpdatedAt.value = response.updated_at || null
        }
    } catch (err) {
        console.log(err)
    } finally {
        isProxyLoading.value = false
    }
}

const saveProxy = async () => {
    const value = proxyInput.value.trim()
    const error = validateProxy(value)
    if (error) {
        proxyInputError.value = error
        return
    }
    proxyInputError.value = ''

    isBtnSaveProxyLoading.value = true
    try {
        const response = await apiServices.putProxySetting(value)
        if (response?.status === 'success') {
            toast.success('Lưu proxy thành công!', { timeout: 3000, position: 'top-center' })
            proxyInput.value = ''
            currentProxy.value = response.proxy_us || value
            proxyUpdatedAt.value = response.updated_at || null
            proxyTestResult.value = null
        } else {
            toast.error('Lưu proxy thất bại!', { timeout: 3000, position: 'top-center' })
        }
    } catch (err) {
        toast.error('Lỗi khi lưu proxy!', { timeout: 3000, position: 'top-center' })
    } finally {
        isBtnSaveProxyLoading.value = false
    }
}

const testProxy = async () => {
    isTestingProxy.value = true
    proxyTestResult.value = null
    try {
        const response = await apiServices.postTestProxy()
        proxyTestResult.value = response
    } catch (err) {
        proxyTestResult.value = { status: 'error', message: 'Không thể kết nối tới server!' }
    } finally {
        isTestingProxy.value = false
    }
}
// -------------------------------------------------------

onMounted(async () => {
    await fetchReportOverview()
    await fetchListEmployee()
    await fetchListGroup()
    await fetchCustomerHistory()
    await fetchProxySetting()
})
</script>