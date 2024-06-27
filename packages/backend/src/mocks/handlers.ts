import { http, HttpResponse } from 'msw'
import fs from 'node:fs'

export const handlers = [
  http.get('http://localhost', () => {
    // respond to them using this JSON response.
    const file = fs.readFileSync('./website.txt', 'utf8')
    console.log(file);

    return HttpResponse.text(file)
  }),
]