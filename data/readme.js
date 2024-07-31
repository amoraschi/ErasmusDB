import { readFileSync, writeFileSync } from 'fs'

const readme = readFileSync('README.md', 'utf8')
const start = readme.indexOf('<!-- LIST BEGIN -->') + 19
const end = readme.indexOf('<!-- LIST END -->')

const data = JSON.parse(readFileSync('data/destinations.json', 'utf8'))

const list = data.map((item) => {
  return `<h4><a href="${item.website_url}">${item.legal_name}</a></h4>\n${item.city}, ${item.country_cd}\n\n---\n`
}).join('\n')

const updatedReadme = `${readme.slice(0, start)}\n${list}\n${readme.slice(end)}`
writeFileSync('README.md', updatedReadme)
