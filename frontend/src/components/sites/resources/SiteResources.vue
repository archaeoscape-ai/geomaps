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
import { FilePlus } from 'lucide-vue-next'
import Separator from '@/components/ui/separator/Separator.vue'
import IconTooltipButton from '@/components/ui/tooltip/IconTooltipButton.vue'
import { useSiteStore } from '@/stores/SiteStore'

const siteStore = useSiteStore()
const { isEditingSite } = storeToRefs(siteStore)

const siteResourceStore = useSiteResourceStore()
const { siteResources, updatingResource, isAddingResource } = storeToRefs(siteResourceStore)

function onEditResourceClick(resource) {
  updatingResource.value = resource
}

function addResources() {
  isEditingSite.value = false
  isAddingResource.value = true
}
</script>

<template>
  <div class="rounded-lg m-4 bg-white p-4 pb-4">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold">Linked Resources</h3>
      <IconTooltipButton
        tooltipText="Add resources"
        tooltipSide="bottom"
        @onBtnClick="addResources"
        btnClass="bg-white"
      >
        <FilePlus size="20" />
      </IconTooltipButton>
    </div>
    <Accordion
      type="multiple"
      collapsible
      orientation="horizontal"
      v-if="siteResources?.results.length > 0"
    >
      <AccordionItem
        :value="resource.id.toString()"
        v-for="resource in siteResources?.results"
        :key="resource.id"
        class="mt-2 rounded text-sm"
        orientation="horizontal"
      >
        <AccordionTrigger class="text-xs font-bold capitalize hover:no-underline">
          {{ resource.caption }}
        </AccordionTrigger>
        <AccordionContent class="text-xs">
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
          <Separator />
          <ResourceField label="Caption" :value="resource.caption" />
          <ResourceField label="Resource Type" :value="resource.resource_type" />
          <ResourceField label="Author" :value="resource.author" />
          <ResourceField label="Date" :value="resource.resource_date" />
          <ResourceField label="Added By" :value="resource.created_by" />
          <ResourceField label="Notes" :value="resource.notes" :showDivider="false" />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <div v-else class="my-16 flex items-center justify-center text-xs italic">
      No resources linked to the site.
    </div>
  </div>
</template>
