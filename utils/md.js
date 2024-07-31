import { mkdirSync, readFileSync, writeFileSync } from 'fs'

const countries = JSON.parse(readFileSync('data/countries.json', 'utf8'))
const readme = readFileSync('README.md', 'utf8')
const start = readme.indexOf('<!-- LIST BEGIN -->') + 19
const end = readme.indexOf('<!-- LIST END -->')

const data = JSON.parse(readFileSync('data/destinations.json', 'utf8'))

const codes = new Set(data.map((item) => item.country_cd))
const countriesGroupedCode = data.reduce((acc, item) => {
  if (!acc[item.country_cd]) {
    acc[item.country_cd] = []
  }

  acc[item.country_cd].push(item)

  return acc
}, {})

const list = Array.from(codes).sort((a, b) => countries[a].localeCompare(countries[b])).map((code) => {
  const url = `/countries/${code}.md`

  return (
`<p>
  <a href="${url}">
    ${code} - ${countries[code]} (${countriesGroupedCode[code].length})
  </a>
</p>`
  )
}).join('\n')

const updatedReadme = `${readme.slice(0, start)}\n${list}\n${readme.slice(end)}`
writeFileSync('README.md', updatedReadme)

codes.forEach((code) => {
  const list = countriesGroupedCode[code].map((item) => {
    const url = item.website_url?.startsWith('http') ? item.website_url : `//${item.website_url}`

    return `<h4>${item.website_url != null ? `<a href="${url}">` : ''}${item.erasmus_code} - ${item.legal_name.toUpperCase()}${item.website_url != null ? '</a>' : ''}</h4>\n${item.city.toUpperCase()}, ${item.country_cd}\n\n${new Date(item.erasmus_eche_start).toLocaleDateString()} - ${new Date(item.erasmus_eche_end).toLocaleDateString()}\n\n---`
  }).join('\n')

  const content = `<h3 align="center">Institutions in ${countries[code]}</h3>\n\n${list}`

  writeFileSync(`countries/${code}.md`, content)
})
