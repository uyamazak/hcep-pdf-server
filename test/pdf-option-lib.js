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
    for (let presetName of Object.keys(myPdfOptionPresets)) {
      let preset = myPdfOptionPresets[presetName]
      let result = getPdfOption(presetName)
      for(let itemKey of Object.keys(preset)){
        it(`${itemKey} in ${presetName} is matched`, done => {
          assert.equal(preset[itemKey], result[itemKey])
          done()
        })
      }
    }
  })
} else {
  console.log('myPdfOptionPresets is not set')
}
