export default defineAppConfig({
  ui: {
    formField: {
      slots: {
        root: '',
        wrapper: '',
        labelWrapper: 'flex content-center items-center justify-between',
        label: 'block font-medium text-default w-full',
        container: 'mt-1 relative',
        description: 'text-muted',
        error: 'mt-2 text-error',
        hint: 'text-muted',
        help: 'mt-2 text-muted'
      },
      variants: {
        required: {
          true: {
            label: 'after:content-[\'*\'] after:ms-0.5 after:text-error'
          }
        }
      },
      defaultVariants: {
        size: 'xl'
      }
    },
    input: {
      defaultVariants: {
        size: 'xl'
      },
      slots: {
        root: 'w-full',
      },
    },
    card: {
      slots: {
        root: ' class="w-full p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700"',
        header: 'p-4 sm:px-6',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6'
      },
      /*variants: {
        variant: {
          solid: {
            root: 'bg-inverted text-inverted'
          },
          outline: {
            root: 'bg-default ring ring-default divide-y divide-default'
          },
          soft: {
            root: 'bg-elevated/50 divide-y divide-default'
          },
          subtle: {
            root: 'bg-elevated/50 ring ring-default divide-y divide-default'
          }
        }
      },*/
      defaultVariants: {
        variant: 'outline'
      }
    },
    button: {
      slots: {
        base: ['cursor-pointer']
      }
    }
  }
});

export const toasterConfiguration = {
  position: 'bottom-right',
  expand: true,
  duration: 5000,
  hoverPause: true,
  progress: true
};
