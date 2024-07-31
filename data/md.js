import { readFileSync, writeFileSync } from 'fs'

const countries = JSON.parse(readFileSync('data/countries.json', 'utf8'))
const readme = readFileSync('README.md', 'utf8')
const start = readme.indexOf('<!-- LIST BEGIN -->') + 19
const end = readme.indexOf('<!-- LIST END -->')

const data = JSON.parse(readFileSync('data/destinations.json', 'utf8'))

// const list = data.map((item) => {
//   const url = item.website_url?.startsWith('http') ? item.website_url : `//${item.website_url}`

//   return `
//   <h4>
//     ${item.website_url != null ? `<a href="${url}">` : ''}
//       ${item.legal_name}
//     ${item.website_url != null ? '</a>' : ''}
//   </h4>
//   ${item.city.toUpperCase()}, ${item.country_cd}
//   \n---`
// }).join('\n')

// const updatedReadme = `${readme.slice(0, start)}\n${list}\n${readme.slice(end)}`
// writeFileSync('README.md', updatedReadme)

const codes = new Set(data.map((item) => item.country_cd))
const list = Array.from(codes).sort((a, b) => countries[a].localeCompare(countries[b])).map((code) => {
  const url = `/${code}`

  return `
  <p align="center">
    <a href="${url}">
      ${countries[code]}
    </a>
  </p>`
}).join('\n')

const updatedReadme = `${readme.slice(0, start)}\n${list}\n${readme.slice(end)}`
writeFileSync('README.md', updatedReadme)
