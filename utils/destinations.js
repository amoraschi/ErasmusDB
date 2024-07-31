import { readFileSync, writeFileSync } from 'fs'
import * as XLSX from 'xlsx'

const buffer = readFileSync('data/destinations.xlsx')
const workbook = XLSX.read(buffer, { type: 'buffer' })

const data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
  header: [
    'Proposal number',
    'Erasmus Code',
    'Pic',
    'OID',
    'Legal Name',
    'Street',
    'Post Cd',
    'City',
    'Country Cd',
    'Website Url',
    'Erasmus Eche Start',
    'Erasmus Eche End'
  ]
}).slice(1)

const dateFromNumber = (number) => {
  const date = new Date(1899, 11, 30)
  date.setDate(date.getDate() + number)

  return date
}

const dataTrimmed = data.map((item) => {
  return Object.keys(item).reduce((acc, key) => {
    return {
      ...acc,
      [key]: typeof item[key] === 'string' ? item[key].replace(/\s+/g, ' ').trim() : item[key]
    }
  }, {})
})

const dataWithUnderscoreKeys = dataTrimmed.map((item) => {
  return Object.keys(item).reduce((acc, key) => {
    return {
      ...acc,
      [key.replace(/\s+/g, '_').toLowerCase()]: item[key]
    }
  }, {})
})

const dataWithDates = dataWithUnderscoreKeys.map((item) => {
  return {
    ...item,
    // 'city': item['city'].toUpperCase(),
    // 'legal_name': item['legal_name'].toUpperCase(),
    // 'street': item['street'].toUpperCase(),
    'erasmus_eche_start': dateFromNumber(item['erasmus_eche_start']).getTime(),
    'erasmus_eche_end': dateFromNumber(item['erasmus_eche_end']).getTime()
  }
})

writeFileSync('data/destinations.json', JSON.stringify(dataWithDates, null, 2))
