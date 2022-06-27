const {
  randomNum
} = require('./util')
// 匹配不包括换行的所以字符
const reg_mark = /^(.+?)\s/
// 匹配以 # 开头的字符
const reg_sharp = /^\#/
// 匹配以 - 开头的字符
const reg_crossbar = /^\-/
// 匹配以 数字 开头的字符
const reg_number = /^\d/

function createTreel(_mdArr) {
  let _htmlPool = {}
  let _lastMark = ''
  let _key = 0
  // 循环每一项（数组每一项）
  _mdArr.forEach(mdFragment => {
    // console.log(mdFragment)
    // 通过match()，获得正则匹配的reg_mark，并返回
    const matched = mdFragment.match(reg_mark);
    // console.log(matched)
    if (matched) {
      const mark = matched[1]
      const input = matched.input
      console.log(matched, 'matched')
      // 判断是否是 # 开头的
      if (reg_sharp.test(mark)) {
        // console.log(mark,'mark')
        const tag = `h${mark.length}`;
        const tagContent = input.replace(reg_mark, '')
        // console.log(tag, tagContent)
        if (_lastMark === mark) {
          _htmlPool[`${tag}-${_key}`].tags = [..._htmlPool[`${tag}-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
        } else {
          _lastMark = mark
          _key = randomNum();
          _htmlPool[`${tag}-${_key}`] = {
            type: 'single',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }

      if (reg_crossbar.test(mark)) {
        // console.log(matched)
        const tagContent = input.replace(reg_mark, '');
        const tag = 'li';

        if (reg_crossbar.test(_lastMark)) {
          _htmlPool[`ul-${_key}`].tags = [..._htmlPool[`ul-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
        } else {
          _lastMark = mark
          _key = randomNum();
          _htmlPool[`ul-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }

      if (reg_number.test(mark)) {
        const tagContent = input.replace(reg_number, '')
        const tag = 'li'

        if (reg_number.test(_lastMark)) {
          _htmlPool[`ol-${_key}`].tags = [..._htmlPool[`ol-${_key}`].tags, `<${tag}>${tagContent}</${tag}>`]
        } else {
          _lastMark = mark;
          _key = randomNum();

          _htmlPool[`ol-${_key}`] = {
            type: 'wrap',
            tags: [`<${tag}>${tagContent}</${tag}>`]
          }
        }
      }
    }
  });
  return _htmlPool

}

function compileHTML(_mdContentArray) {
  const _htmlPool = createTreel(_mdContentArray)
  // sconsole.log(_htmlPool)
  let _htmlStr = ''
  let item

  for (let k in _htmlPool) {
    // console.log(k, _htmlPool[k])
    item = _htmlPool[k]
    if (item.type === 'single') {
      item.tags.forEach((tag) => {
        _htmlStr += tag;
      })
    } else if (item.type === 'wrap') {
      // console.log(item.tags,'2')
      let _list = `<${k.split('-')[0]}>`

      item.tags.forEach((tag) => {
        _list += tag;
      })

      _list += `</${k.split('-')[0]}>`
      _htmlStr += _list
    }
  }
  return _htmlStr

}

module.exports = {
  compileHTML
}

// {
//     'h1-1626856207419': { type: 'single', tags: [ '<h1>这是一个h1的标题\r</h1>' ] },
//     'ul-1626856207993': {
//       type: 'wrap',
//       tags: [
//         '<li>这个一个ul 列表的第一项\r</li>',
//         '<li>这个一个ul 列表的第一项\r</li>',
//         '<li>这个一个ul 列表的第一项\r</li>',
//         '<li>这个一个ul 列表的第一项\r</li>'
//       ]
//     },
//     'h2-1626856207560': { type: 'single', tag: [ '<h2>这是一个h2的标题\r</h2>' ] },
//     'ol-1626856207336': {
//       type: 'wrap',
//       tags: [
//         '<li>. 这个一个ol 列表的第一项\r</li>',
//         '<li>. 这个一个ol 列表的第一项\r</li>',
//         '<li>. 这个一个ol 列表的第一项\r</li>',
//         '<li>. 这个一个ol 列表的第一项</li>'
//       ]
//     }
//   }