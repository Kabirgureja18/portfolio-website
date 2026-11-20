import { githubActivityHandler } from '../../server/github-activity.js'
import { adaptHandler } from '../_http.mjs'

export const handler = adaptHandler(githubActivityHandler)
