const { getPdfOption, loadMyPdfOptionPresets } = require('../app/pdf-option/pdf-option-lib')
const assert = require('assert')

describe('default pdf options', done => {
  it('empty return default', done => {
    const result = getPdfOption('')
    assert.equal(result.format, 'A4')
    assert.equal(result.displayHeaderFooter, false)
    done()
  })
  it('not exists return default', done => {
    const result = getPdfOption('NotExistsPresetName')
    assert.equal(result.format, 'A4')
    done()
  })
  it('A4 in default presets', done => {
    const result = getPdfOption('A4')
    assert.equal(result.format, 'A4')
    done()
  })
  it('A3 in default presets', done => {
    const result = getPdfOption('A3')
    assert.equal(result.format, 'A3')
    done()
  })
})

const myPdfOptionPresets = loadMyPdfOptionPresets()
if (myPdfOptionPresets) {
  describe('my pdf options', () => {
    for (let key of Object.keys(myPdfOptionPresets)) {
      let preset = myPdfOptionPresets[key]
      let result = getPdfOption(key)
      for(let itemKey of Object.keys(preset)){
        it(`${itemKey} in ${key} and getPdfOption's result`, done => {
          assert.equal(preset[itemKey], result[itemKey])
          done()
        })
      }
    }
  })
}
