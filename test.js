const unified = require('unified')
const parser = require('remark-parse')
const stringify = require('remark-stringify')
const { test } = require('tap')

const codeblocks = require('.')

test('remark-code-blocks', t => {
  const mixLang = '```\nconst a = 42\n```\n\n```go\nfmt.Println("Hi")\n```'
  const noLang = '```\nconst a = 42\n```'
  const processor = unified()
    .use(parser)
    .use(stringify)

  t.test('it should work without options', it => {
    let p = processor().use(codeblocks)

    it.ok(
      p.processSync(noLang).data.codeblocks,
      'it should create a `codeblocks` property in vfile.data'
    )

    it.ok(
      Array.isArray(p.processSync(noLang).data.codeblocks._),
      'it should create a `_` property in `codeblocks` for nodes with no lang'
    )
    it.end()
  })

  t.test('it should change prop name in VFile.data based options.name', it => {
    let p = processor().use(codeblocks, { name: 'code' })
    it.ok(
      p.processSync(noLang).data.code,
      'it should change name for property'
    )
    it.end()
  })

  t.test('it should only select code nodes with specified lang from options', it => {
    let p = processor().use(codeblocks, { name: 'code', lang: 'go' })
    it.ok(
      Array.isArray(p.processSync(mixLang).data.code),
      'When lang options is specified store in array'
    )
    it.ok(
      p.processSync(mixLang).data.code[0] === 'fmt.Println("Hi")',
      'it should only select one language'
    )
    it.end()
  })

  t.end()
})
