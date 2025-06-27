<script setup>
import { useOffsetPagination } from '@vueuse/core'
import { computed, toRefs } from 'vue'
import Button from '@/components/ui/button/Button.vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const emit = defineEmits(['fetchData'])
const pageNeighbours = 1
const LEFT_PAGE = 'LEFT'
const RIGHT_PAGE = 'RIGHT'

const props = defineProps({
  totalRecords: { type: Number, required: true },
  page: { type: Number, required: false },
  pageSize: { type: Number, required: true },
})

const { totalRecords } = toRefs(props)

const { currentPage, pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
  total: totalRecords,
  page: props.page || 1,
  pageSize: props.pageSize,
  onPageChange: fetchData,
  onPageSizeChange: fetchData,
})

const pagesToShow = computed(() => {
  const { totalBlocks, startPage, endPage } = blockRange.value
  let pages = []
  if (pageCount.value > totalBlocks) {
    pages = range(startPage, endPage)
    pages = handleSpillOver(pages, startPage, endPage)
    pages = [1, ...pages, pageCount.value]
  } else {
    pages = range(1, pageCount.value)
  }

  return pages
})

const blockRange = computed(() => {
  const totalNumbers = pageNeighbours + 1
  const totalBlocks = totalNumbers + 1
  const startPage = Math.max(2, currentPage.value - pageNeighbours)
  const endPage = Math.min(pageCount.value - 1, currentPage.value + pageNeighbours)
  return { totalBlocks, startPage, endPage }
})

function fetchData({ currentPage, currentPageSize }) {
  emit('fetchData', { currentPage, currentPageSize })
}

function handleSpillOver(pages, startPage, endPage) {
  const hasLeftSpill = startPage > 2
  const hasRightSpill = pageCount.value - endPage > 1
  const spillOffset = pageNeighbours + 1 - pages.length

  if (hasLeftSpill && !hasRightSpill) {
    const extraPages = range(startPage - spillOffset, startPage - 1)
    return [LEFT_PAGE, ...extraPages, ...pages]
  } else if (!hasLeftSpill && hasRightSpill) {
    const extraPages = range(endPage + 1, endPage + spillOffset)
    return [...pages, ...extraPages, RIGHT_PAGE]
  } else if (hasLeftSpill && hasRightSpill) {
    return [LEFT_PAGE, ...pages, RIGHT_PAGE]
  }

  return pages
}

function range(from, to, step = 1) {
  let range = []
  for (let i = from; i <= to; i += step) {
    range.push(i)
  }
  return range
}
</script>

<template>
  <div class="flex items-center gap-2 text-sm font-semibold">
    <Button :disabled="isFirstPage" @click="prev" size="icon">
      <ChevronLeft />
    </Button>
    <template v-for="page in pagesToShow" :key="page">
      <span v-if="page === LEFT_PAGE" class=""> ... </span>
      <span v-else-if="page === RIGHT_PAGE" class=""> ... </span>
      <Button
        v-else
        :key="page"
        @click="currentPage = page"
        size="icon"
        :variant="currentPage === page ? 'default' : 'outline'"
      >
        {{ page }}
      </Button>
    </template>
    <Button :disabled="isLastPage" @click="next" size="icon">
      <ChevronRight />
    </Button>
  </div>
</template>
