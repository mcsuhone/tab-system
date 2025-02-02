import { utils, writeFile } from 'xlsx'

export function exportToExcel<T extends object>(data: T[], fileName: string) {
  const worksheet = utils.json_to_sheet(data)
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Data')
  writeFile(workbook, `${fileName}.xlsx`, { compression: true })
}
