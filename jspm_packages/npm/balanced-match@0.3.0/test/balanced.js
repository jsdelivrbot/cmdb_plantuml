/* */ 
var test = require("tape");
var balanced = require("../index");
test('balanced', function(t) {
  t.deepEqual(balanced('{', '}', 'pre{in{nest}}post'), {
    start: 3,
    end: 12,
    pre: 'pre',
    body: 'in{nest}',
    post: 'post'
  });
  t.deepEqual(balanced('{', '}', '{{{{{{{{{in}post'), {
    start: 8,
    end: 11,
    pre: '{{{{{{{{',
    body: 'in',
    post: 'post'
  });
  t.deepEqual(balanced('{', '}', 'pre{body{in}post'), {
    start: 8,
    end: 11,
    pre: 'pre{body',
    body: 'in',
    post: 'post'
  });
  t.deepEqual(balanced('{', '}', 'pre}{in{nest}}post'), {
    start: 4,
    end: 13,
    pre: 'pre}',
    body: 'in{nest}',
    post: 'post'
  });
  t.deepEqual(balanced('{', '}', 'pre{body}between{body2}post'), {
    start: 3,
    end: 8,
    pre: 'pre',
    body: 'body',
    post: 'between{body2}post'
  });
  t.notOk(balanced('{', '}', 'nope'), 'should be notOk');
  t.deepEqual(balanced('<b>', '</b>', 'pre<b>in<b>nest</b></b>post'), {
    start: 3,
    end: 19,
    pre: 'pre',
    body: 'in<b>nest</b>',
    post: 'post'
  });
  t.deepEqual(balanced('<b>', '</b>', 'pre</b><b>in<b>nest</b></b>post'), {
    start: 7,
    end: 23,
    pre: 'pre</b>',
    body: 'in<b>nest</b>',
    post: 'post'
  });
  t.deepEqual(balanced('{{', '}}', 'pre{{{in}}}post'), {
    start: 3,
    end: 9,
    pre: 'pre',
    body: '{in}',
    post: 'post'
  });
  t.deepEqual(balanced('{{{', '}}', 'pre{{{in}}}post'), {
    start: 3,
    end: 8,
    pre: 'pre',
    body: 'in',
    post: '}post'
  });
  t.deepEqual(balanced('{', '}', 'pre{{first}in{second}post'), {
    start: 4,
    end: 10,
    pre: 'pre{',
    body: 'first',
    post: 'in{second}post'
  });
  t.deepEqual(balanced('<?', '?>', 'pre<?>post'), {
    start: 3,
    end: 4,
    pre: 'pre',
    body: '',
    post: 'post'
  });
  t.end();
});
