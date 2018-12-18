const debug = require('debug')('hcepPdfServer:getPdfOption')
const defaultPdfOptionKey = process.env.HCEP_PDF_OPTION_KEY || 'A4'
const { PdfOption } = require('./pdf-option')

const defaultPdfOptions = {
  A3: new PdfOption({
    format: 'A3'
  }),
  A3Full: new PdfOption({
    format: 'A3',
    margin: '0mm'
  }),
  A3Landscape: new PdfOption({
    format: 'A3',
    landscape: true
  }),
  A3LandscapeFull: new PdfOption({
    format: 'A3',
    landscape: true,
    margin: '0mm'
  }),
  A4: new PdfOption({
    format: 'A4'
  }),
  A4Full: new PdfOption({
    format: 'A4',
    margin: '0mm'
  }),
  A4Landscape: new PdfOption({
    format: 'A4',
    landscape: true
  }),
  A4LandscapeFull: new PdfOption({
    format: 'A4',
    landscape: true,
    margin: '0mm'
  })
}

let pdfOptions = defaultPdfOptions
const myOptionsFilePath = process.env.HCEP_MY_PDF_OPTIONS_FILE_PATH || null
if (myOptionsFilePath) {
  const mergeOptions = require('merge-options')
  const { myPdfOptions } = require(myOptionsFilePath)
  pdfOptions = mergeOptions(defaultPdfOptions, myPdfOptions)
}
debug('pdfOptions:', pdfOptions)

module.exports.getPdfOption = function (key) {
  if (!key) {
    debug('use defaultPdfOption:', defaultPdfOptionKey)
    return pdfOptions[defaultPdfOptionKey]
  }
  if (key in pdfOptions) {
    debug('use pdfOption', key)
    return pdfOptions[key]
  } else {
    console.error('key', key, ' is not exists in pdfOptions')
    return pdfOptions[defaultPdfOptionKey]
  }
}
