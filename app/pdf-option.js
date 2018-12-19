const mergeOptions = require('merge-options')
const defaultMargin = process.env.HCEP_DEFAULT_MARGIN || '18mm'
/**
 * PdfOption more detail
 * https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#pagepdfoptions
 *
 */
class PdfOption {
  defaultOptions() {
    /**
     Since this application does not save the generated PDF to the disk,
     'path' should not be set.
    */
    return {
      scale: 1,
      displayHeaderFooter: false,
      headerTemplate: '',
      footerTemplate: '',
      printBackground: true,
      landscape: false,
      pageRanges: '',
      format: '',
      width: '',
      height: '',
      margin: defaultMargin,
      marginTop: '',
      marginRight: '',
      marginBottom: '',
      marginLeft: '',
      preferCSSPageSize: true
    }
  }

  constructor(options) {
    options = mergeOptions(this.defaultOptions(), options)
    this.scale = options.scale
    this.displayHeaderFooter = options.displayHeaderFooter
    this.headerTemplate = options.headerTemplate
    this.footerTemplate = options.footerTemplate
    this.printBackground = options.printBackground
    this.landscape = options.landscape
    this.pageRanges = options.pageRanges
    this.format = options.format
    this.width = options.width
    this.height = options.height
    this.margin = {
      top: options.marginTop || options.margin,
      right: options.marginRight || options.margin,
      bottom: options.marginBottom || options.margin,
      left: options.marginLeft || options.margin
    }
    this.preferCSSPageSize = options.preferCSSPageSize
  }
}
module.exports.PdfOption = PdfOption
