const { getPdfOption, loadMyPdfOptionPresets, pdfOptionPresets } = require('../app/pdf-option/pdf-option-lib')
const assert = require('assert')

describe('default pdf options', done => {
  const defaultOption = getPdfOption()
  it('empty return default', done => {
    const result = getPdfOption()
    assert.deepStrictEqual(result, defaultOption)
    done()
  })
  it('if key not exists return default', done => {
    const result = getPdfOption('NotExistsPresetName')
    assert.deepStrictEqual(result, defaultOption)
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

describe('"path" in option must be undefined not to save file', () => {
  for (let key of Object.keys(pdfOptionPresets)) {
    let result = getPdfOption(key)
    it(`${key}`, done => {
      assert.equal(result.path, undefined)
      done()
    })
  }
})


describe('myPdfOptionPresets', () => {
  const myPdfOptionPresets = loadMyPdfOptionPresets()
  if (!myPdfOptionPresets) {
    it.skip('skipped, myPdfOptionPresets is not set')
    return
  }
  for (let optionKey of Object.keys(myPdfOptionPresets)) {
    describe('optionKey exactry merged', () => {
      let myPreset = myPdfOptionPresets[optionKey]
      let result = getPdfOption(optionKey)
      for(let itemKey of Object.keys(myPreset)){
        it(`${itemKey} in ${optionKey} and getPdfOption's result`, done => {
          assert.equal(myPreset[itemKey], result[itemKey])
          done()
        })
      }
    })
  }
})
