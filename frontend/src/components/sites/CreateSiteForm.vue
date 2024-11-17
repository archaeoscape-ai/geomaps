<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { storeToRefs } from 'pinia'
import { useSiteStore } from '@/stores/SiteStore'
import { useMapStore } from '@/stores/MapStore'
import { transform } from 'ol/proj'
import FormInputField from '@/components/ui/input/FormInputField.vue'
import FormTextareaField from '@/components/ui/textarea/FormTextareaField.vue'
import FormCheckboxField from '@/components/ui/checkbox/FormCheckboxField.vue'
import FormSelectField from '@/components/ui/select/FormSelectField.vue'
import { useToast } from '@/components/ui/toast'
import Separator from '@/components/ui/separator/Separator.vue'
import { useLeftPanelStore } from '@/stores/LeftPanelStore'
import { LEFT_PANELS } from '@/helpers/constants'

const leftPanelStore = useLeftPanelStore()
const mapStore = useMapStore()
const { currentMap } = storeToRefs(mapStore)
const siteStore = useSiteStore()
const {
  selectedSite,
  siteTypes,
  isCreatingSite,
  siteMarker,
  isEditingSite,
  newSiteFeatureRef,
  siteLayerSourceRef,
  selectedSiteFeature,
  selectSiteInteractionRef,
} = storeToRefs(siteStore)
const { getSiteDetail } = siteStore

const isSubmitting = ref(false)
const { toast } = useToast()

onMounted(() => {
  siteStore.getSiteTypes()
})

const formSchema = toTypedSchema(
  z.object({
    english_name: z.string().min(1, { message: 'This field has to be filled' }),
    french_name: z.string().optional(),
    khmer_name: z.string().optional(),
    latitude: z.coerce.number().gte(-90).lte(90, { message: 'Invalid Latitude' }),
    longitude: z.coerce.number().gte(-180).lte(180, { message: 'Invalid Longitude' }),
    alternative_name: z.string().optional(),
    alternative_khmer_name: z.string().optional(),
    description: z.string().optional(),
    ik_id_starred: z.boolean().default(false).optional(),
    db_resolved: z.boolean().default(false).optional(),
    site_type: z.string().optional(),
    inventaire_khmere_id: z.string().optional(),
    monuments_hostoriques_id: z.string().optional(),
  }),
)

const initialFormValues = computed(() => ({
  english_name: selectedSite.value?.english_name || '',
  french_name: selectedSite.value?.french_name || '',
  khmer_name: selectedSite.value?.khmer_name || '',
  alternative_name: selectedSite.value?.alternative_name || '',
  alternative_khmer_name: selectedSite.value?.alternative_khmer_name || '',
  description: selectedSite.value?.description || '',
  ik_id_starred: selectedSite.value?.ik_id_starred || false,
  db_resolved: selectedSite.value?.db_resolved === 1,
  site_type: selectedSite.value?.site_type?.toString() || '',
  latitude: selectedSite.value?.location.coordinates[1] || '',
  longitude: selectedSite.value?.location.coordinates[0] || '',
}))

const form = useForm({
  validationSchema: formSchema,
  initialValues: initialFormValues.value,
})

const resetSiteCreationState = () => {
  isEditingSite.value = false
  isCreatingSite.value = false
  siteMarker.value = null
  leftPanelStore.setTab(LEFT_PANELS.IDENTIFY)
}

const setNewSiteAsSelected = (res) => {
  selectedSiteFeature.value = siteLayerSourceRef.value.getFeatureById(res.id)
  const selectedFeatures = selectSiteInteractionRef.value.select.getFeatures()
  selectedFeatures.clear()
  selectedFeatures.push(selectedSiteFeature.value)
}

const onSubmit = form.handleSubmit(async (values) => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true
    const data = {
      ...values,
      location: {
        type: 'Point',
        coordinates: [values.longitude, values.latitude],
      },
      db_resolved: values.db_resolved ? 1 : 0
    }

    if (isEditingSite.value && selectedSite.value) {
      await siteStore.updateSite(selectedSite.value.id, data)
      await getSiteDetail(selectedSite.value.id)
      toast({ description: 'Site updated!' })
    } else {
      if (!newSiteFeatureRef.value) {
        toast({ description: 'Please add a marker on the map.', variant: 'destructive' })
        return
      }

      const res = await siteStore.createSite(currentMap.value.id, data)
      setNewSiteAsSelected(res)
      newSiteFeatureRef.value.feature = null
      toast({ description: 'Site created!' })
    }

    resetSiteCreationState()
  } catch (error) {
    if (error.status === 400) {
      Object.entries(error.response.data).forEach(([field, message]) => {
        form.setFieldError(field, message)
      })
    } else {
      toast({ description: 'Could not save site!', variant: 'destructive' })
    }
  } finally {
    isSubmitting.value = false
  }
})

const setFieldValue = () => form.resetForm({ values: initialFormValues.value })

watch(isCreatingSite, (newValue) => {
  if (newValue) {
    form.resetForm({
      values: {
        english_name: '',
        french_name: '',
        khmer_name: '',
        alternative_name: '',
        alternative_khmer_name: '',
        description: '',
        ik_id_starred: false,
        site_type: '',
        latitude: '',
        longitude: '',
        db_resolved: false,
      },
    })
  } else {
    setFieldValue()
  }
})

watch(siteMarker, (newValue) => {
  if (newValue) {
    const [longitude, latitude] = transform(newValue, 'EPSG:3857', 'EPSG:4326')
    form.setFieldValue('latitude', latitude)
    form.setFieldValue('longitude', longitude)
  }
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <form @submit="onSubmit" class="flex flex-col gap-4">
      <FormSelectField name="site_type" label="Site Type" :options="siteTypes?.results" />
      <Separator />

      <FormInputField name="english_name" label="English Name" />
      <FormInputField name="french_name" label="French Name" />
      <FormInputField name="khmer_name" label="Khmer Name" />
      <FormInputField name="alternative_name" label="Alternative Name(s)" />
      <FormInputField name="alternative_khmer_name" label="Alternative Khmer Name(s)" />
      <Separator />

      <FormInputField name="latitude" label="Latitude" />
      <FormInputField name="longitude" label="Longitude" />
      <FormTextareaField name="description" label="Description" />
      <Separator />

      <FormCheckboxField name="ik_id_starred" label="IK ID Starred" />
      <FormCheckboxField name="db_resolved" label="Validated Record (2014 SDG Check)" />
      <FormInputField name="inventaire_khmere_id" label="Inventaire Khmere (IK) ID" />
      <FormInputField name="monuments_hostoriques_id" label="Monuments Historiques (MH) ID" />
      <Button type="submit" class="my-4 w-full" :disabled="isSubmitting">Save</Button>
    </form>
  </div>
</template>
