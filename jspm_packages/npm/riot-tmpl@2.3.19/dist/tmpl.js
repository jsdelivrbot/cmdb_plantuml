/* */ 
"format cjs";
/* riot-tmpl v2.3.19, @license MIT, (c) 2015 Muut Inc. + contributors */
;(function (window) {
  'use strict'              // eslint-disable-line

  /**
   * @module brackets
   *
   * `brackets         ` Returns a string or regex based on its parameter
   * `brackets.settings` Mirrors the `riot.settings` object (use brackets.set in new code)
   * `brackets.set     ` Change the current riot brackets
   */

  var brackets = (function (UNDEF) {

    var
      REGLOB  = 'g',

      MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
      STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

      S_QBSRC = STRINGS.source + '|' +
        /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
        /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

      DEFAULT = '{ }',

      FINDBRACES = {
        '(': RegExp('([()])|'   + S_QBSRC, REGLOB),
        '[': RegExp('([[\\]])|' + S_QBSRC, REGLOB),
        '{': RegExp('([{}])|'   + S_QBSRC, REGLOB)
      }

    var
      cachedBrackets = UNDEF,
      _regex,
      _pairs = []

    function _loopback(re) { return re }

    function _rewrite(re, bp) {
      if (!bp) bp = _pairs
      return new RegExp(
        re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
      )
    }

    function _create(pair) {
      var
        cvt,
        arr = pair.split(' ')

      if (pair === DEFAULT) {
        arr[2] = arr[0]
        arr[3] = arr[1]
        cvt = _loopback
      }
      else {
        if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
          throw new Error('Unsupported brackets "' + pair + '"')
        }
        arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '))
        cvt = _rewrite
      }
      arr[4] = cvt(arr[1].length > 1 ? /{[\S\s]*?}/ : /{[^}]*}/, arr)
      arr[5] = cvt(/\\({|})/g, arr)
      arr[6] = cvt(/(\\?)({)/g, arr)
      arr[7] = RegExp('(\\\\?)(?:([[({])|(' + arr[3] + '))|' + S_QBSRC, REGLOB)
      arr[8] = pair
      return arr
    }

    function _reset(pair) {
      if (!pair) pair = DEFAULT

      if (pair !== _pairs[8]) {
        _pairs = _create(pair)
        _regex = pair === DEFAULT ? _loopback : _rewrite
        _pairs[9] = _regex(/^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/)
        _pairs[10] = _regex(/(^|[^\\]){=[\S\s]*?}/)
        _brackets._rawOffset = _pairs[0].length
      }
      cachedBrackets = pair
    }

    function _brackets(reOrIdx) {
      return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _pairs[reOrIdx]
    }

    _brackets.split = function split(str, tmpl, _bp) {
      // istanbul ignore next: _bp is for the compiler
      if (!_bp) _bp = _pairs

      var
        parts = [],
        match,
        isexpr,
        start,
        pos,
        re = _bp[6]

      isexpr = start = re.lastIndex = 0

      while (match = re.exec(str)) {

        pos = match.index

        if (isexpr) {

          if (match[2]) {
            re.lastIndex = skipBraces(match[2], re.lastIndex)
            continue
          }

          if (!match[3])
            continue
        }

        if (!match[1]) {
          unescapeStr(str.slice(start, pos))
          start = re.lastIndex
          re = _bp[6 + (isexpr ^= 1)]
          re.lastIndex = start
        }
      }

      if (str && start < str.length) {
        unescapeStr(str.slice(start))
      }

      return parts

      function unescapeStr(str) {
        if (tmpl || isexpr)
          parts.push(str && str.replace(_bp[5], '$1'))
        else
          parts.push(str)
      }

      function skipBraces(ch, pos) {
        var
          match,
          recch = FINDBRACES[ch],
          level = 1
        recch.lastIndex = pos

        while (match = recch.exec(str)) {
          if (match[1] &&
            !(match[1] === ch ? ++level : --level)) break
        }
        return match ? recch.lastIndex : str.length
      }
    }

    _brackets.hasExpr = function hasExpr(str) {
      return _brackets(4).test(str)
    }

    _brackets.loopKeys = function loopKeys(expr) {
      var m = expr.match(_brackets(9))
      return m ?
        { key: m[1], pos: m[2], val: _pairs[0] + m[3].trim() + _pairs[1] } : { val: expr.trim() }
    }

    _brackets.array = function array(pair) {
      return _create(pair || cachedBrackets)
    }

    var _settings
    function _setSettings(o) {
      var b
      o = o || {}
      b = o.brackets
      Object.defineProperty(o, 'brackets', {
        set: _reset,
        get: function () { return cachedBrackets },
        enumerable: true
      })
      _settings = o
      _reset(b)
    }
    Object.defineProperty(_brackets, 'settings', {
      set: _setSettings,
      get: function () { return _settings }
    })

    /* istanbul ignore next: in the node version riot is not in the scope */
    _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
    _brackets.set = _reset

    _brackets.R_STRINGS = STRINGS
    _brackets.R_MLCOMMS = MLCOMMS
    _brackets.S_QBLOCKS = S_QBSRC

    return _brackets

  })()

  /**
   * @module tmpl
   *
   * tmpl          - Root function, returns the template value, render with data
   * tmpl.hasExpr  - Test the existence of a expression inside a string
   * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
   */

  var tmpl = (function () {

    var _cache = {}

    function _tmpl(str, data) {
      if (!str) return str

      return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
    }

    _tmpl.isRaw = function (expr) {
      return expr[brackets._rawOffset] === "="
    }

    _tmpl.haveRaw = function (src) {
      return brackets(10).test(src)
    }

    _tmpl.hasExpr = brackets.hasExpr

    _tmpl.loopKeys = brackets.loopKeys

    _tmpl.errorHandler = null

    function _logErr(err, ctx) {

      if (_tmpl.errorHandler) {

        err.riotData = {
          tagName: ctx && ctx.root && ctx.root.tagName,
          _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
        }
        _tmpl.errorHandler(err)
      }
    }

    function _create(str) {

      var expr = _getTmpl(str)
      if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

      return new Function('E', expr + ';')
    }

    var
      RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
      RE_QBMARK = /\x01(\d+)~/g

    function _getTmpl(str) {
      var
        qstr = [],
        expr,
        parts = brackets.split(str.replace(/\u2057/g, '"'), 1)

      if (parts.length > 2 || parts[0]) {
        var i, j, list = []

        for (i = j = 0; i < parts.length; ++i) {

          expr = parts[i]

          if (expr && (expr = i & 1 ?

                _parseExpr(expr, 1, qstr) :

                '"' + expr
                  .replace(/\\/g, '\\\\')
                  .replace(/\r\n?|\n/g, '\\n')
                  .replace(/"/g, '\\"') +
                '"'

            )) list[j++] = expr

        }

        expr = j < 2 ? list[0] :
               '[' + list.join(',') + '].join("")'
      }
      else {

        expr = _parseExpr(parts[1], 0, qstr)
      }

      if (qstr[0])
        expr = expr.replace(RE_QBMARK, function (_, pos) {
          return qstr[pos]
            .replace(/\r/g, '\\r')
            .replace(/\n/g, '\\n')
        })

      return expr
    }

    var
      CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/,
      RE_BRACE = /,|([[{(])|$/g

    function _parseExpr(expr, asText, qstr) {

      if (expr[0] === "=") expr = expr.slice(1)

      expr = expr
            .replace(RE_QBLOCK, function (s, div) {
              return s.length > 2 && !div ? '\x01' + (qstr.push(s) - 1) + '~' : s
            })
            .replace(/\s+/g, ' ').trim()
            .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

      if (expr) {
        var
          list = [],
          cnt = 0,
          match

        while (expr &&
              (match = expr.match(CS_IDENT)) &&
              !match.index
          ) {
          var
            key,
            jsb,
            re = /,|([[{(])|$/g

          expr = RegExp.rightContext
          key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

          while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

          jsb  = expr.slice(0, match.index)
          expr = RegExp.rightContext

          list[cnt++] = _wrapExpr(jsb, 1, key)
        }

        expr = !cnt ? _wrapExpr(expr, asText) :
            cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
      }
      return expr

      function skipBraces(jsb, re) {
        var
          match,
          lv = 1,
          ir = jsb === '(' ? /[()]/g : jsb === '[' ? /[[\]]/g : /[{}]/g

        ir.lastIndex = re.lastIndex
        while (match = ir.exec(expr)) {
          if (match[0] === jsb) ++lv
          else if (!--lv) break
        }
        re.lastIndex = lv ? expr.length : ir.lastIndex
      }
    }

    // istanbul ignore next: not both
    var JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').'
    var JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g

    function _wrapExpr(expr, asText, key) {
      var tb

      expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
        if (mvar) {
          pos = tb ? 0 : pos + match.length

          if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
            match = p + '("' + mvar + JS_CONTEXT + mvar
            if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
          }
          else if (pos)
            tb = !/^(?=(\.[$\w]+))\1(?:[^.[(]|$)/.test(s.slice(pos))
        }
        return match
      })

      if (tb) {
        expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
      }

      if (key) {

        expr = (tb ?
            'function(){' + expr + '}.call(this)' : '(' + expr + ')'
          ) + '?"' + key + '":""'
      }
      else if (asText) {

        expr = 'function(v){' + (tb ?
            expr.replace('return ', 'v=') : 'v=(' + expr + ')'
          ) + ';return v||v===0?v:""}.call(this)'
      }

      return expr
    }

    // istanbul ignore next: compatibility fix for beta versions
    _tmpl.parse = function (s) { return s }

    return _tmpl

  })()

  tmpl.version = brackets.version = 'v2.3.19'

  /* istanbul ignore else */
  if (typeof module === 'object' && module.exports) {
    module.exports = {
      'tmpl': tmpl, 'brackets': brackets
    }
  }
  else if (typeof define === 'function' && typeof define.amd !== 'undefined') {
    define(function () {
      return {
        'tmpl': tmpl, 'brackets': breackets
      }
    })
  }
  else if (window) {
    window.tmpl = tmpl
    window.brackets = brackets
  }

})(typeof window === 'object' ? /* istanbul ignore next */ window : void 0) // eslint-disable-line no-void

