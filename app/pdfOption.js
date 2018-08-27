const debug = require('debug')('hcepPdfOptions')
const defaultMargin = process.env.HCEP_DEFAULT_MARGIN || '18mm'
const defaultPdfOptionKey = process.env.HCEP_PDF_OPTION_KEY || 'A4'
/**
 * PdfOption more detail
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
 */
class PdfOption {
  constructor(options) {
    this.format = options.format
    this.landscape = options.landscape || false
    this.printBackground = typeof options.printBackground !== 'undefined' ? options.printBackground : true
    this.displayHeaderFooter = options.displayHeaderFooter || false
    this.margin = {
      top: options.marginTop || options.margin || defaultMargin,
      right: options.marginRight || options.margin || defaultMargin,
      bottom: options.marginBottom || options.margin || defaultMargin,
      left: options.marginLeft || options.margin || defaultMargin
    }
  }
}

const pdfOptions = {
  'A3': new PdfOption({ 'format': 'A3' }),
  'A3Full': new PdfOption({ 'format': 'A3', margin: '0mm' }),
  'A3Landscape': new PdfOption({ 'format': 'A3', landscape: true }),
  'A3LandscapeFull': new PdfOption({ 'format': 'A3', landscape: true, margin: '0mm' }),
  'A4': new PdfOption({ 'format': 'A4' }),
  'A4Full': new PdfOption({ 'format': 'A4', margin: '0mm' }),
  'A4Landscape': new PdfOption({ 'format': 'A4', landscape: true }),
  'A4LandscapeFull': new PdfOption({ 'format': 'A4', landscape: true, margin: '0mm' })
}

const getPdfOption = function (key) {
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
module.exports = {
  PdfOption: PdfOption,
  getPdfOption: getPdfOption,
  pdfOptions: pdfOptions
}
