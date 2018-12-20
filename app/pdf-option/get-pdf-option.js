const debug = require('debug')('hcepPdfServer:getPdfOption')
const defaultPdfOptionKey = process.env.HCEP_PDF_OPTION_KEY || 'A4'
const defaultPdfOptionPresets = require('./default-pdf-option-presets')
const { PdfOption } = require('./pdf-option')
const myPdfOptionPresetsFilePath = process.env.HCEP_MY_PDF_OPTION_PRESETS_FILE_PATH

let pdfOptionPresets = defaultPdfOptionPresets

if (myPdfOptionPresetsFilePath) {
  const mergeOptions = require('merge-options')
  const { myPdfOptionPresets } = require(myPdfOptionPresetsFilePath)
  pdfOptionPresets = mergeOptions(defaultPdfOptionPresets, myPdfOptionPresets)
}
debug('pdfOptionPresets:', pdfOptionPresets)

module.exports.getPdfOption = function (key) {
  if (!key) {
    debug('use defaultPdfOption:', defaultPdfOptionKey)
    key = defaultPdfOptionKey
  }
  if (!(key in pdfOptionPresets)) {
    console.error('key', key, ' is not exists in pdfOptionPresets')
    key = defaultPdfOptionKey
  }
  debug('use pdfOption', key)
  return new PdfOption(pdfOptionPresets[key])
}
