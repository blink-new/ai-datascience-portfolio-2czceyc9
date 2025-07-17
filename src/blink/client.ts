import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'ai-datascience-portfolio-2czceyc9',
  authRequired: false // Public portfolio - auth only needed for admin panel
})

export { blink }