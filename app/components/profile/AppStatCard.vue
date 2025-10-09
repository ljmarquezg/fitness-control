<script
    setup
    lang="ts"
>
const props = defineProps<{
  color: string;
  icon: string;
  editing?: boolean;
  modelValue?;
  label: string;
  placeholder?: string;
  trailing?: boolean;
  trailingLabel: string | number;
  unit: string | number;
  value: string | number;
}>();
const emit = defineEmits(['update:modelValue']);
const classNames = computed(() => `${props.color} p-3 w-16 h-16 rounded-xl bg-opacity-10 group-hover:scale-110 transition-transform`);
</script>

<template>
  <UCard class="p-0 hover:shadow-lg border-0 hover:border-primary/30 overflow-hidden relative">
    <div class="flex flex-col justify-items-start mb-3">
      <div :class="classNames">
        <UIcon
            :name="props.icon"
            class="size-10"
        />
      </div>

      <template v-if="props.editing">
        <UFormField
            :label="$t(label)"
            name="height"
            class="mt-2 text-xs text-muted"
        >
          <UInput
              :model-value="props.modelValue"
              type="number"
              :placeholder="props.placeholder"
              class="mt-2"
              @update:model-value="emit('update:modelValue', $event)"
          >
            <template
                v-if="props.trailing"
                #trailing
            >
              <div
                  id="character-count"
                  class="text-xs text-muted tabular-nums"
                  aria-live="polite"
                  role="status"
              >
                {{ $t(trailingLabel) }}
              </div>
            </template>
          </UInput>
        </UFormField>
      </template>

      <template v-else>
        <p class="text-2xl font-bold mt-4 flex items-baseline">
          {{ props.value || '—' }}
          <span class="text-base font-normal text-muted-foreground ml-1">{{ props.unit }}</span>
        </p>
        <p class="text-sm text-muted-foreground dark:text-muted">{{ $t(props.label) }}</p>
      </template>
    </div>
  </UCard>
</template>

<style scoped>

</style>