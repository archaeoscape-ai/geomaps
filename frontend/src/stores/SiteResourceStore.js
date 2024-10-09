import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as siteResourceService from '@/api-services/SiteResourceService'

export const useSiteResourceStore = defineStore('siteResource', () => {
  const isLoading = ref(false)

  const page = ref(0)
  const pageSize = ref(-1)
  const siteResources = ref(null)
  const isAddingResource = ref(false)

  const siteResourceTypes = ref(null)
  const individuals = ref(null)

  const updatingResource = ref(null)

  async function getSiteResourceTypes() {
    const params = {
      limit: -1,
      offset: 0,
    }
    siteResourceTypes.value = await siteResourceService.getSiteResourceTypes(params)
  }

  async function getIndividuals() {
    const params = {
      limit: -1,
      offset: 0,
    }
    individuals.value = await siteResourceService.getIndividuals(params)
  }

  async function getSiteResources(siteId) {
    if (isLoading.value) return

    try {
      const params = {
        limit: pageSize.value,
        offset: page.value,
      }
      siteResources.value = await siteResourceService.getSiteResources(siteId, params)
    } catch (err) {
      console.log(err)
    } finally {
      isLoading.value = false
    }
  }

  async function createSiteResource(siteId, data) {
    const res = await siteResourceService.createSiteResource(siteId, data)
    console.log(res)
    if (siteResources.value?.results) {
      siteResources.value.results.push(res)
    } else {
      siteResources.value = { ...siteResources.value, results: [res] }
    }
  }

  async function updateSiteResource(resourceId, data) {
    const res = await siteResourceService.updateSiteResource(resourceId, data)
    const index = siteResources.value.results.findIndex((resource) => resource.id === resourceId)
    if (index !== -1) {
      siteResources.value.results[index] = res
    }
  }

  async function deleteSiteResource(resourceId) {
    await siteResourceService.deleteSiteResource(resourceId)
    const index = siteResources.value.results.findIndex((resource) => resource.id === resourceId)
    if (index !== -1) {
      siteResources.value.results.splice(index, 1)
    }
  }

  return {
    page,
    pageSize,
    siteResources,
    siteResourceTypes,
    isAddingResource,
    individuals,
    updatingResource,

    getSiteResourceTypes,
    getSiteResources,
    updateSiteResource,
    createSiteResource,
    deleteSiteResource,
    getIndividuals,
  }
})
