<script setup>
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import LogoIcon from '@/assets/logo-icon.svg?component'
import { LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/AuthStore'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useMapStore } from '@/stores/MapStore'
import { useRoute, useRouter } from 'vue-router'
import { sortBy } from 'lodash'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const mapStore = useMapStore()
const { listMaps } = storeToRefs(mapStore)

const currentIndex = ref(1)

watch(
  () => route.params.id,
  (id) => {
    currentIndex.value = Number.parseInt(id)
  },
  { immediate: true },
)

watch(currentIndex, () => {
  router.push({ name: 'home', params: { id: currentIndex.value } })
})
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button size="icon" variant="secondary">
        <LogoIcon />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="mr-4 w-56">
      <DropdownMenuLabel>{{ user?.email }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuRadioGroup v-model="currentIndex" class="max-h-[300px] overflow-auto">
        <DropdownMenuRadioItem
          :value="map.id"
          v-for="map in sortBy(listMaps.results, 'id')"
          :key="map.id"
        >
          {{ map.title }}
        </DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="authStore.logout">
        <div class="flex items-center gap-2">
          <LogOut size="16" />
          Log out
        </div>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
