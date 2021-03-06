/* */ 
var path = require("path"),
    fs = require("fs");
var fixtures = __dirname,
    expected = path.join(fixtures, 'js');
function have(mod, req) {
  if (compiler.parsers._req(mod, req))
    return true;
  console.error('\tnot installed locally: ' + compiler.parsers._modname(req || mod) + ' alias "' + mod + '"');
  return false;
}
function cat(dir, filename) {
  return fs.readFileSync(path.join(dir, filename), 'utf8');
}
function normalize(str) {
  var n = str.search(/[^\n]/);
  if (n < 0)
    return '';
  if (n > 0)
    str = str.slice(n);
  n = str.search(/\n+$/);
  return ~n ? str.slice(0, n) : str;
}
function testParser(name, opts, save) {
  var file = name + (opts.type ? '.' + opts.type : ''),
      str1 = cat(fixtures, file + '.tag'),
      str2 = cat(expected, file + '.js');
  js = compiler.compile(str1, opts || {}, path.join(fixtures, file + '.tag'));
  if (save)
    fs.writeFile(path.join(expected, file + '_out.js'), js, function(err) {
      if (err)
        throw err;
    });
  expect(normalize(js)).to.be(normalize(str2));
}
describe('HTML parsers', function() {
  this.timeout(12000);
  function testStr(str, resStr, opts) {
    expect(compiler.html(str, opts || {})).to.be(resStr);
  }
  it('jade', function() {
    if (have('jade') && have('coffee')) {
      testParser('test.jade', {template: 'jade'});
      testParser('slide.jade', {template: 'jade'});
    }
  });
  describe('Custom parser in expressions', function() {
    var opts = {
      parser: function(str) {
        return '@' + str;
      },
      expr: true
    };
    it('don\'t touch format before run parser, compact & trim after (2.3.0)', function() {
      testStr('<a href={\na\r\n}>', '<a href="{@ a}">', opts);
      testStr('<a>{\tb\n }</a>', '<a>{@\tb}</a>', opts);
    });
    it('plays with the custom parser', function() {
      testStr('<a href={a}>', '<a href="{@a}">', opts);
      testStr('<a>{ b }</a>', '<a>{@ b}</a>', opts);
    });
    it('plays with quoted values', function() {
      testStr('<a href={ "a" }>', '<a href="{@ \u2057a\u2057}">', opts);
      testStr('<a>{"b"}</a>', '<a>{@\u2057b\u2057}</a>', opts);
    });
    it('remove the last semi-colon', function() {
      testStr('<a href={ a; }>', '<a href="{@ a}">', opts);
      testStr('<a>{ b ;}</a>', '<a>{@ b}</a>', opts);
    });
    it('prefixing the expression with "^" prevents the parser (2.3.0)', function() {
      testStr('<a href={^ a }>', '<a href="{a}">', opts);
      testStr('<a>{^ b }</a>', '<a>{b}</a>', opts);
    });
  });
});
describe('JavaScript parsers', function() {
  function _custom(js) {
    return 'var foo';
  }
  this.timeout(30000);
  it('complex tag structure', function() {
    if (have('none')) {
      testParser('complex', {});
    } else
      expect().fail('parsers.js must have a "none" property');
  });
  it('javascript (root container)', function() {
    testParser('test', {expr: true});
  });
  it('javascript (comment hack)', function() {
    testParser('test-alt', {expr: true});
  });
  it('mixed riotjs and javascript types', function() {
    if (have('javascript')) {
      testParser('mixed-js', {});
    } else
      expect().fail('parsers.js must have a "javascript" property');
  });
  it('coffeescript', function() {
    if (have('coffee')) {
      testParser('test', {
        type: 'coffee',
        expr: true
      });
    }
  });
  it('livescript', function() {
    if (have('livescript')) {
      testParser('test', {type: 'livescript'});
    }
  });
  it('typescript', function() {
    if (have('typescript')) {
      testParser('test', {type: 'typescript'});
    }
  });
  it('es6', function() {
    if (have('es6')) {
      testParser('test', {type: 'es6'});
    }
  });
  it('babel', function() {
    if (have('babel')) {
      testParser('test', {type: 'babel'});
    }
  });
  it('coffee with shorthands (fix #1090)', function() {
    if (have('coffee')) {
      testParser('test-attr', {
        type: 'coffee',
        expr: true
      });
    }
  });
  it('custom js parser', function() {
    compiler.parsers.js.custom = _custom;
    testParser('test', {type: 'custom'});
  });
});
describe('Style parsers', function() {
  this.timeout(12000);
  compiler.parsers.css.postcss = function(tag, css, opts) {
    return require("postcss")([require("autoprefixer")]).process(css).css;
  };
  it('default style', function() {
    testParser('style', {});
  });
  it('scoped styles', function() {
    testParser('style.scoped', {});
  });
  it('stylus', function() {
    if (have('stylus')) {
      testParser('stylus', {});
    }
  });
  it('sass, indented 2, margin 0', function() {
    if (have('sass')) {
      testParser('sass', {});
    }
  });
  it('scss, indented 2, margin 0', function() {
    if (have('scss')) {
      testParser('scss', {});
    }
  });
  it('custom style options', function() {
    if (have('sass')) {
      testParser('sass.options', {});
    }
  });
  it('custom parser using postcss + autoprefixer', function() {
    if (have('postcss', 'postcss')) {
      testParser('postcss', {});
    }
  });
  it('less', function() {
    if (have('less')) {
      testParser('less', {});
    }
  });
  it('mixing CSS blocks with different type', function() {
    testParser('mixed-css', {});
  });
  it('the style option for setting the CSS parser (v2.3.13)', function() {
    var source = ['<style-option>', '  <style>', '    p {top:0}', '  </style>', '</style-option>'].join('\n'),
        result;
    compiler.parsers.css.myParser2 = function(t, s) {
      return s.replace(/\bp\b/g, 'P');
    };
    result = compiler.compile(source, {style: 'myParser2'});
    expect(result).to.contain('P {top:0}');
  });
});
describe('Other', function() {
  it('unknown HTML template parser throws an error', function() {
    var str1 = cat(fixtures, 'test.tag');
    expect(compiler.compile).withArgs(str1, {template: 'unknown'}).to.throwError();
  });
  it('unknown JS & CSS parsers throws an error', function() {
    var str1 = cat(fixtures, 'test.tag'),
        str2 = ['<error>', "<style type='unknown'>p{top:0}</style>", '</error>'].join('\n');
    expect(compiler.compile).withArgs(str1, {type: 'unknown'}).to.throwError();
    expect(compiler.compile).withArgs(str2).to.throwError();
    expect(have('unknown')).to.be(false);
  });
  it('using different brackets', function() {
    testParser('brackets', {brackets: '${ }'});
  });
  it('emiting raw html through the `=` flag, with parser', function() {
    compiler.parsers.js.rawhtml = function(js) {
      return js.replace(/"/g, '&quot;');
    };
    testParser('raw', {
      type: 'rawhtml',
      expr: true
    });
  });
});
