import { contactHandler } from '../../server/contact.js'
import { adaptHandler } from '../_http.mjs'

export const handler = adaptHandler(contactHandler())
