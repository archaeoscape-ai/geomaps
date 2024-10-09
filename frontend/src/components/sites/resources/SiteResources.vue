<script setup>
import { storeToRefs } from 'pinia'
import { useSiteResourceStore } from '@/stores/SiteResourceStore'
import ResourceField from '@/components/sites/resources/ResourceField.vue'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Pencil } from 'lucide-vue-next'

const siteResourceStore = useSiteResourceStore()
const { siteResources, updatingResource } = storeToRefs(siteResourceStore)

function onEditResourceClick(resource) {
  updatingResource.value = resource
}
</script>

<template>
  <div class="mt-4">
    <h2 class="px-4 font-semibold">Linked Resources</h2>
    <Accordion type="multiple" collapsible orientation="horizontal">
      <AccordionItem
        :value="resource.id.toString()"
        v-for="resource in siteResources.results"
        :key="resource.id"
        class="mt-2 px-4 text-sm"
        orientation="horizontal"
      >
        <AccordionTrigger class="hover:no-underline">{{ resource.caption }}</AccordionTrigger>
        <AccordionContent>
          <div class="grid grid-cols-2 items-center gap-2 break-words py-1">
            <div class="font-semibold">
              Resource ID [<button
                class="text-blue-500 underline"
                @click="() => onEditResourceClick(resource)"
              >
                Edit</button
              >]
            </div>
            <div>{{ resource.id }}</div>
          </div>
          <ResourceField label="Caption" :value="resource.caption" />
          <ResourceField label="Resource Type" :value="resource.resource_type" />
          <ResourceField label="Author" :value="resource.author" />
          <ResourceField label="Date" :value="resource.resource_date" />
          <ResourceField label="Added By" :value="resource.created_by" />
          <ResourceField label="Notes" :value="resource.notes" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>
