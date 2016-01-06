/* */ 
"format cjs";

/*
  Compilation for the browser
*/
riot.compile = (function () {

  var
    doc = window.document,
    promise,
    ready

  // Gets a .tag file via asynchronous http. Once received, runs the callback on it.
  function GET(url, fn, opts) {
    var req = new XMLHttpRequest()

    req.onreadystatechange = function() {
      if (req.readyState === 4 &&
         (req.status === 200 || !req.status && req.responseText.length))
        fn(req.responseText, opts, url)
    }
    req.open('GET', url, true)
    req.send('')
  }

  // Run the code generated by the compiler to call `riot.tag2`
  function globalEval(js) {
    var
      node = doc.createElement('script'),
      root = doc.documentElement

    node.text = js          // writes the code into our new `script` element
    root.appendChild(node)  // injects it to page, execution is immediate
    root.removeChild(node)  // tmpl created, the script is no longer required
  }

  // Compile all tags defined with `<script type="riot/tag">`` to JavaScript.
  // These can be inlined script definitions or external resources that load scripts
  // defined with src attribute.
  // After all scripts are compiled the given callback method is called.
  function compileScripts(fn, exopt) {
    var
      scripts = doc.querySelectorAll('script[type="riot/tag"]'),
      scriptsAmount = scripts.length

    function done() {
      promise.trigger('ready')    // signal we are done
      ready = true
      if (fn) fn()
    }

    function compileTag(src, opts, url) {
      var code = compile(src, opts)
      // Implements #1070 by @beders, for .tag files.
      if (url) code += '\n//# sourceURL=' + url + '.js'
      globalEval(code)
      if (!--scriptsAmount) done()
    }

    if (!scriptsAmount) done()
    else {
      for (var i = 0; i < scripts.length; ++i) {  // Array.prototype.map is heavy
        var
          script = scripts[i],
          opts = {template: script.getAttribute('template')},
          url = script.getAttribute('src')

        if (exopt) opts = extend(opts, exopt)
        url ? GET(url, compileTag, opts) : compileTag(script.innerHTML, opts)
      }
    }
  }

  //// Entry point -----

  return function (arg, fn, opts) {

    if (typeof arg === 'string') {
      // fix in both, compile was called here and in globalEval

      if (typeof fn === 'object') {
        opts = fn
        fn = false
      }

      if (/^\s*</.test(arg)) {          // this is a bit faster than trim()
        // returns the tag as a string, if `true` is given, do not execute.
        // `riot.compile(tag [, true][, options])`
        var js = compile(arg, opts)
        if (!fn) globalEval(js)
        return js
      }

      // Loads the url and compiles all tags after which the callback is called.
      // `riot.compile(url [, callback][, options])`
      GET(arg, function (str) {
        var js = compile(str, opts, arg)
        globalEval(js)
        if (fn) fn(js, str)
      })

    }
    else {

      // Compile all tags defined with `<script type="riot/tag">` to JavaScript.
      // `riot.compile([callback][, options])`

      // arg is the callback or the extra options object
      if (typeof arg === 'function') {
        opts = fn
        fn = arg
      }
      else {
        opts = arg
        fn = undefined
      }

      // all compiled
      if (ready)
        return fn && fn()

      // add to queue
      if (promise) {
        if (fn) promise.on('ready', fn)

      // grab riot/tag elements + load & execute them
      } else {
        promise = riot.observable()
        compileScripts(fn, opts)
      }
    }
  }

})()

// reassign mount methods -----
var mount = riot.mount

riot.mount = function(a, b, c) {
  var ret
  riot.compile(function() { ret = mount(a, b, c) })
  return ret
}