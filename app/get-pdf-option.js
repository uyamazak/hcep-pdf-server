const debug = require('debug')('hcepPdfServer:getPdfOption')
const defaultPdfOptionKey = process.env.HCEP_PDF_OPTION_KEY || 'A4'
const { PdfOption } = require('./pdf-option')

const defaultPdfOptions = {
  A3: {
    format: 'A3'
  },
  A3Full: {
    format: 'A3',
    margin: '0mm'
  },
  A3Landscape: {
    format: 'A3',
    landscape: true
  },
  A3LandscapeFull: {
    format: 'A3',
    landscape: true,
    margin: '0mm'
  },
  A4: {
    format: 'A4'
  },
  A4Full: {
    format: 'A4',
    margin: '0mm'
  },
  A4Landscape: {
    format: 'A4',
    landscape: true
  },
  A4LandscapeFull: {
    format: 'A4',
    landscape: true,
    margin: '0mm'
  }
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
    key = defaultPdfOptionKey
  }
  if (!(key in pdfOptions)) {
    console.error('key', key, ' is not exists in pdfOptions')
    key = defaultPdfOptionKey
  }
  debug('use pdfOption', key)
  return new PdfOption(pdfOptions[key])
}
