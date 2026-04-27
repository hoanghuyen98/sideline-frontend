<template>
  <div class="min-h-screen flex flex-col bg-white text-gray-900 font-inter">
    <!-- Top Bar -->
    <header class="bg-[#50b24a] h-18 flex items-center px-8 shadow-sm">
      <img src="https://messages.sidelline.com/assets/images/logo_light.svg" alt="Logo" class="h-8" />
    </header>

    <!-- Center -->
    <main class="flex-1 flex justify-center items-start py-12">
      <div class="w-full max-w-lg bg-white rounded-lg shadow p-8 sm:p-10">
        <!-- Title -->
        <h1 class="text-center text-2xl font-bold mb-6">
          Text online from your Sidelline number
        </h1>

        <!-- Alert lỗi -->
        <div v-if="errorMessage" class="p-3.5 mb-4 text-sm text-red-800 bg-red-100 rounded-md" role="alert"
          aria-live="polite">
          {{ errorMessage }}
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-700">Username or Mobile Number</label>
            <input v-model="username" type="text" id="username" placeholder="Nhập tài khoản hoặc số điện thoại" required
              class="bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3" />
          </div>

          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <!-- <input v-model="password" type="password" id="password" placeholder="Nhập mật khẩu" required
              class="bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3" /> -->
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" id="password"
                placeholder="Nhập mật khẩu" required
                class="bg-gray-100 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-3 pr-10" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                tabindex="-1">
                <span v-if="showPassword">🙈</span>
                <span v-else>👁️</span>
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center text-sm">
            <label class="flex items-center cursor-pointer">
              <input type="checkbox" v-model="remember"
                class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500" />
              <span class="ml-2 text-gray-600">Keep me logged in</span>
            </label>

            <a href="#" class="text-green-600 font-semibold hover:underline">Forgot Password?</a>
          </div>

          <button type="submit" :disabled="isLoading"
            class="w-full text-lg font-semibold text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 rounded-lg px-5 py-3 text-center disabled:bg-gray-400 disabled:cursor-not-allowed">
            {{ isLoading ? "Logging in..." : "Login" }}
          </button>
        </form>

        <div class="text-center text-green-600 font-semibold mt-6">
          Don't have a Sidelline account? Sign up!
        </div>

        <div class="border-t border-gray-200 my-8"></div>

        <div class="text-center text-gray-500 mb-3">
          For extra features, get Sidelline on your mobile device
        </div>

        <!-- Store Badges -->
        <div class="flex justify-center gap-4">
          <div class="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 shadow text-sm font-semibold">
            <div class="w-7 h-7 bg-white text-black flex items-center justify-center rounded-md font-bold">
              
            </div>
            <div class="leading-tight text-left">
              <div class="text-[10px] opacity-70">Download on the</div>
              <div>App Store</div>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-black text-white rounded-lg px-4 py-2.5 shadow text-sm font-semibold">
            <div class="w-7 h-7 bg-white text-black flex items-center justify-center rounded-md font-bold">
              ▶
            </div>
            <div class="leading-tight text-left">
              <div class="text-[10px] opacity-70">GET IT ON</div>
              <div>Google Play</div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="mt-10 bg-gray-100 px-6 py-4 text-gray-600 text-sm rounded-lg">
          <div class="flex justify-between flex-wrap items-center gap-2 border-b border-gray-200 pb-2 mb-2">
            <div class="space-x-4">
              <a href="#" class="hover:underline">About Us</a>
              <a href="#" class="hover:underline">Privacy</a>
              <a href="#" class="hover:underline">Contact Us</a>
              <a href="#" class="hover:underline">Help</a>
            </div>
            <div class="flex gap-2">
              <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                X
              </div>
              <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-bold">
                f
              </div>
            </div>
          </div>

          <div class="text-xs text-gray-400 leading-snug">
            © 2025 Pinger, Inc. All rights reserved. The Sidelline name,
            associated trade marks and logos are trade marks of Pinger, Inc. or
            related entities.
            <br />
            This site is protected by reCAPTCHA and the Google
            <u>Privacy Policy</u> and <u>Terms of Service</u> apply.
          </div>
        </footer>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useRouter } from 'vue-router'
import { roleUser } from "@/ultis/constants";
import apiServices from "@/services/api.services";
import TokenService from "@/services/token.service"

const router = useRouter()

const username = ref("");
const password = ref("");
const remember = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const showPassword = ref(false);

const handleSubmit = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true
  try {
    const response = await apiServices.postLogin({
      username: username.value,
      password: password.value,
    });
    if (response?.access && response?.refresh) {
      const token = response.access
      const refresh = response.refresh
      const role = response.role
      const user_name = response.username
      TokenService.setCookieByKeyValue("access_token", token)
      TokenService.setCookieByKeyValue("refresh_token", refresh)
      TokenService.setCookieByKeyValue("role", role)
      TokenService.setCookieByKeyValue("user_name", user_name)

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 150))

      if (role === roleUser.customer) {
        router.push("/member");
      } else if (role === roleUser.staff) {
        router.push('/employee');
      } else if (role === roleUser.admin) {
        router.push('/manager')
      }
    } else {
      errorMessage.value = ''
      successMessage.value = ''
      errorMessage.value = 'Tên đăng nhập/số điện thoại hoặc mật khẩu không đúng.'
    }
  } catch (error) {
    errorMessage.value = "Tên đăng nhập/số điện thoại hoặc mật khẩu không đúng.";
  } finally {
    isLoading.value = false
  }
};
</script>

<style scoped>
.font-inter {
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
</style>
