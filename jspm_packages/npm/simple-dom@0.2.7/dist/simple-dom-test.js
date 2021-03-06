/* */ 
"format cjs";
(function() {
    "use strict";
    function simple$dom$document$node$$Node(nodeType, nodeName, nodeValue) {
      this.nodeType = nodeType;
      this.nodeName = nodeName;
      this.nodeValue = nodeValue;

      this.childNodes = new simple$dom$document$node$$ChildNodes(this);

      this.parentNode = null;
      this.previousSibling = null;
      this.nextSibling = null;
      this.firstChild = null;
      this.lastChild = null;
    }

    simple$dom$document$node$$Node.prototype._cloneNode = function() {
      return new simple$dom$document$node$$Node(this.nodeType, this.nodeName, this.nodeValue);
    };

    simple$dom$document$node$$Node.prototype.cloneNode = function(deep) {
      var node = this._cloneNode();

      if (deep) {
        var child = this.firstChild, nextChild = child;

        while (nextChild) {
          nextChild = child.nextSibling;
          node.appendChild(child.cloneNode(true));
          child = nextChild;
        }
      }

      return node;
    };

    simple$dom$document$node$$Node.prototype.appendChild = function(node) {
      if (node.nodeType === simple$dom$document$node$$Node.DOCUMENT_FRAGMENT_NODE) {
        simple$dom$document$node$$insertFragment(node, this, this.lastChild, null);
        return;
      }

      if (node.parentNode) { node.parentNode.removeChild(node); }

      node.parentNode = this;
      var refNode = this.lastChild;
      if (refNode === null) {
        this.firstChild = node;
        this.lastChild = node;
      } else {
        node.previousSibling = refNode;
        refNode.nextSibling = node;
        this.lastChild = node;
      }
    };

    function simple$dom$document$node$$insertFragment(fragment, newParent, before, after) {
      if (!fragment.firstChild) { return; }

      var firstChild = fragment.firstChild;
      var lastChild = firstChild;
      var node = firstChild;

      firstChild.previousSibling = before;
      if (before) {
        before.nextSibling = firstChild;
      } else {
        newParent.firstChild = firstChild;
      }

      while (node) {
        node.parentNode = newParent;
        lastChild = node;
        node = node.nextSibling;
      }

      lastChild.nextSibling = after;
      if (after) {
        after.previousSibling = lastChild;
      } else {
        newParent.lastChild = lastChild;
      }
    }

    simple$dom$document$node$$Node.prototype.insertBefore = function(node, refNode) {
      if (refNode == null) {
        return this.appendChild(node);
      }

      if (node.nodeType === simple$dom$document$node$$Node.DOCUMENT_FRAGMENT_NODE) {
        simple$dom$document$node$$insertFragment(node, this, refNode ? refNode.previousSibling : null, refNode);
        return;
      }

      node.parentNode = this;

      var previousSibling = refNode.previousSibling;
      if (previousSibling) {
        previousSibling.nextSibling = node;
        node.previousSibling = previousSibling;
      }else{
        node.previousSibling = null
      }

      refNode.previousSibling = node;
      node.nextSibling = refNode;

      if (this.firstChild === refNode) {
        this.firstChild = node;
      }
    };

    simple$dom$document$node$$Node.prototype.removeChild = function(refNode) {
      if (this.firstChild === refNode) {
        this.firstChild = refNode.nextSibling;
      }
      if (this.lastChild === refNode) {
        this.lastChild = refNode.previousSibling;
      }
      if (refNode.previousSibling) {
        refNode.previousSibling.nextSibling = refNode.nextSibling;
      }
      if (refNode.nextSibling) {
        refNode.nextSibling.previousSibling = refNode.previousSibling;
      }
      refNode.parentNode = null;
      refNode.nextSibling = null;
      refNode.previousSibling = null;
    };

    simple$dom$document$node$$Node.ELEMENT_NODE = 1;
    simple$dom$document$node$$Node.ATTRIBUTE_NODE = 2;
    simple$dom$document$node$$Node.TEXT_NODE = 3;
    simple$dom$document$node$$Node.CDATA_SECTION_NODE = 4;
    simple$dom$document$node$$Node.ENTITY_REFERENCE_NODE = 5;
    simple$dom$document$node$$Node.ENTITY_NODE = 6;
    simple$dom$document$node$$Node.PROCESSING_INSTRUCTION_NODE = 7;
    simple$dom$document$node$$Node.COMMENT_NODE = 8;
    simple$dom$document$node$$Node.DOCUMENT_NODE = 9;
    simple$dom$document$node$$Node.DOCUMENT_TYPE_NODE = 10;
    simple$dom$document$node$$Node.DOCUMENT_FRAGMENT_NODE = 11;
    simple$dom$document$node$$Node.NOTATION_NODE = 12;

    function simple$dom$document$node$$ChildNodes(node) {
      this.node = node;
    }

    simple$dom$document$node$$ChildNodes.prototype.item = function(index) {
      var child = this.node.firstChild;

      for (var i = 0; child && index !== i; i++) {
        child = child.nextSibling;
      }

      return child;
    };

    var simple$dom$document$node$$default = simple$dom$document$node$$Node;

    function $$document$element$$Element(tagName) {
      tagName = tagName.toUpperCase();

      this.nodeConstructor(1, tagName, null);
      this.attributes = [];
      this.tagName = tagName;
    }

    $$document$element$$Element.prototype = Object.create(simple$dom$document$node$$default.prototype);
    $$document$element$$Element.prototype.constructor = $$document$element$$Element;
    $$document$element$$Element.prototype.nodeConstructor = simple$dom$document$node$$default;

    $$document$element$$Element.prototype._cloneNode = function() {
      var node = new $$document$element$$Element(this.tagName);

      node.attributes = this.attributes.map(function(attr) {
        return { name: attr.name, value: attr.value, specified: attr.specified };
      });

      return node;
    };

    $$document$element$$Element.prototype.getAttribute = function(_name) {
      var attributes = this.attributes;
      var name = _name.toLowerCase();
      var attr;
      for (var i=0, l=attributes.length; i<l; i++) {
        attr = attributes[i];
        if (attr.name === name) {
          return attr.value;
        }
      }
      return '';
    };

    $$document$element$$Element.prototype.setAttribute = function(_name, _value) {
      var attributes = this.attributes;
      var name = _name.toLowerCase();
      var value;
      if (typeof _value === 'string') {
        value = _value;
      } else {
        value = '' + _value;
      }
      var attr;
      for (var i=0, l=attributes.length; i<l; i++) {
        attr = attributes[i];
        if (attr.name === name) {
          attr.value = value;
          return;
        }
      }
      attributes.push({
        name: name,
        value: value,
        specified: true // serializer compat with old IE
      });
    };

    $$document$element$$Element.prototype.removeAttribute = function(name) {
      var attributes = this.attributes;
      for (var i=0, l=attributes.length; i<l; i++) {
        var attr = attributes[i];
        if (attr.name === name) {
          attributes.splice(i, 1);
          return;
        }
      }
    };

    var $$document$element$$default = $$document$element$$Element;

    function $$document$text$$Text(text) {
      this.nodeConstructor(3, '#text', text);
    }

    $$document$text$$Text.prototype._cloneNode = function() {
      return new $$document$text$$Text(this.nodeValue);
    };

    $$document$text$$Text.prototype = Object.create(simple$dom$document$node$$default.prototype);
    $$document$text$$Text.prototype.constructor = $$document$text$$Text;
    $$document$text$$Text.prototype.nodeConstructor = simple$dom$document$node$$default;

    var $$document$text$$default = $$document$text$$Text;

    function $$document$comment$$Comment(text) {
      this.nodeConstructor(8, '#comment', text);
    }

    $$document$comment$$Comment.prototype._cloneNode = function() {
      return new $$document$comment$$Comment(this.nodeValue);
    };

    $$document$comment$$Comment.prototype = Object.create(simple$dom$document$node$$default.prototype);
    $$document$comment$$Comment.prototype.constructor = $$document$comment$$Comment;
    $$document$comment$$Comment.prototype.nodeConstructor = simple$dom$document$node$$default;

    var $$document$comment$$default = $$document$comment$$Comment;

    function $$document$raw$html$section$$RawHTMLSection(text) {
      this.nodeConstructor(-1, "#raw-html-section", text);
    }

    $$document$raw$html$section$$RawHTMLSection.prototype = Object.create(simple$dom$document$node$$default.prototype);
    $$document$raw$html$section$$RawHTMLSection.prototype.constructor = $$document$raw$html$section$$RawHTMLSection;
    $$document$raw$html$section$$RawHTMLSection.prototype.nodeConstructor = simple$dom$document$node$$default;

    var $$document$raw$html$section$$default = $$document$raw$html$section$$RawHTMLSection;

    function $$document$document$fragment$$DocumentFragment() {
      this.nodeConstructor(11, '#document-fragment', null);
    }

    $$document$document$fragment$$DocumentFragment.prototype._cloneNode = function() {
      return new $$document$document$fragment$$DocumentFragment();
    };

    $$document$document$fragment$$DocumentFragment.prototype = Object.create(simple$dom$document$node$$default.prototype);
    $$document$document$fragment$$DocumentFragment.prototype.constructor = $$document$document$fragment$$DocumentFragment;
    $$document$document$fragment$$DocumentFragment.prototype.nodeConstructor = simple$dom$document$node$$default;

    var $$document$document$fragment$$default = $$document$document$fragment$$DocumentFragment;

    function simple$dom$document$$Document() {
      this.nodeConstructor(9, '#document', null);
      this.documentElement = new $$document$element$$default('html');
      this.head = new $$document$element$$default('head');
      this.body = new $$document$element$$default('body');
      this.documentElement.appendChild(this.head);
      this.documentElement.appendChild(this.body);
      this.appendChild(this.documentElement);
    }

    simple$dom$document$$Document.prototype = Object.create(simple$dom$document$node$$default.prototype);
    simple$dom$document$$Document.prototype.constructor = simple$dom$document$$Document;
    simple$dom$document$$Document.prototype.nodeConstructor = simple$dom$document$node$$default;

    simple$dom$document$$Document.prototype.createElement = function(tagName) {
      return new $$document$element$$default(tagName);
    };

    simple$dom$document$$Document.prototype.createTextNode = function(text) {
      return new $$document$text$$default(text);
    };

    simple$dom$document$$Document.prototype.createComment = function(text) {
      return new $$document$comment$$default(text);
    };

    simple$dom$document$$Document.prototype.createRawHTMLSection = function(text) {
      return new $$document$raw$html$section$$default(text);
    };

    simple$dom$document$$Document.prototype.createDocumentFragment = function() {
      return new $$document$document$fragment$$default();
    };

    var simple$dom$document$$default = simple$dom$document$$Document;

    QUnit.module('Document');

    QUnit.test("creating a document node", function(assert) {
      var document = new simple$dom$document$$default();

      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
      assert.strictEqual(document.nodeType, 9, "document has node type of 9");
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeName
      assert.strictEqual(document.nodeName, "#document", "document node has the name #document");
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
      assert.strictEqual(document.nodeValue, null, "for the document itself, nodeValue returns null");
    });
    function simple$dom$html$serializer$$HTMLSerializer(voidMap) {
      this.voidMap = voidMap;
    }

    simple$dom$html$serializer$$HTMLSerializer.prototype.openTag = function(element) {
      return '<' + element.nodeName.toLowerCase() + this.attributes(element.attributes) + '>';
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.closeTag = function(element) {
      return '</' + element.nodeName.toLowerCase() + '>';
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.isVoid = function(element) {
      return this.voidMap[element.nodeName] === true;
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.attributes = function(namedNodeMap) {
      var buffer = '';
      for (var i=0, l=namedNodeMap.length; i<l; i++) {
        buffer += this.attr(namedNodeMap[i]);
      }
      return buffer;
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.escapeAttrValue = function(attrValue) {
      return attrValue.replace(/[&"]/g, function(match) {
        switch(match) {
          case '&':
            return '&amp;';
          case '\"':
            return '&quot;';
        }
      });
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.attr = function(attr) {
      if (!attr.specified) {
        return '';
      }
      if (attr.value) {
        return ' ' + attr.name + '="' + this.escapeAttrValue(attr.value) + '"';
      }
      return ' ' + attr.name;
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.escapeText = function(textNodeValue) {
      return textNodeValue.replace(/[&<>]/g, function(match) {
        switch(match) {
          case '&':
            return '&amp;';
          case '<':
            return '&lt;';
          case '>':
            return '&gt;';
        }
      });
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.text = function(text) {
      return this.escapeText(text.nodeValue);
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.rawHTMLSection = function(text) {
      return text.nodeValue;
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.comment = function(comment) {
      return '<!--'+comment.nodeValue+'-->';
    };

    simple$dom$html$serializer$$HTMLSerializer.prototype.serialize = function(node) {
      var buffer = '';
      var next;

      // open
      switch (node.nodeType) {
        case 1:
          buffer += this.openTag(node);
          break;
        case 3:
          buffer += this.text(node);
          break;
        case -1:
          buffer += this.rawHTMLSection(node);
          break;
        case 8:
          buffer += this.comment(node);
          break;
        default:
          break;
      }

      next = node.firstChild;
      if (next) {
        buffer += this.serialize(next);

        while(next = next.nextSibling) {
          buffer += this.serialize(next);
        }
      }

      if (node.nodeType === 1 && !this.isVoid(node)) {
        buffer += this.closeTag(node);
      }

      return buffer;
    };

    var simple$dom$html$serializer$$default = simple$dom$html$serializer$$HTMLSerializer;

    var simple$dom$void$map$$default = {
      AREA: true,
      BASE: true,
      BR: true,
      COL: true,
      COMMAND: true,
      EMBED: true,
      HR: true,
      IMG: true,
      INPUT: true,
      KEYGEN: true,
      LINK: true,
      META: true,
      PARAM: true,
      SOURCE: true,
      TRACK: true,
      WBR: true
    };

    var $$support$$document = (function (root){
      if (root.document) {
        return root.document;
      }
      return new simple$dom$document$$default();
    }(this));


    function $$support$$element(tagName, attrs) {
      var el = $$support$$document.createElement(tagName);
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
      for (var i=2; i<arguments.length; i++) {
        el.appendChild(arguments[i]);
      }
      return el;
    }

    function $$support$$fragment() {
      var frag = $$support$$document.createDocumentFragment();
      for (var i=0; i<arguments.length; i++) {
        frag.appendChild(arguments[i]);
      }
      return frag;
    }

    function $$support$$text(s) {
      return $$support$$document.createTextNode(s);
    }

    function $$support$$comment(s) {
      return $$support$$document.createComment(s);
    }

    function $$support$$html(s) {
      return $$support$$document.createRawHTMLSection(s);
    }

    QUnit.module('Element');

    // See http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-B63ED1A3
    QUnit.test("appending a document fragment appends the fragment's children and not the fragment itself", function(assert) {
      var document = new simple$dom$document$$default();

      var frag = document.createDocumentFragment();
      var elem = document.createElement('div');
      var body = document.body;

      assert.strictEqual(body.firstChild, null, "body has no children");

      frag.appendChild(elem);
      body.appendChild(frag);

      assert.strictEqual(body.firstChild.tagName, "DIV", "fragment's child is added as child of document");
    });

    // See http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-core.html#ID-B63ED1A3
    QUnit.test("appending a document fragment (via insertBefore) appends the fragment's children and not the fragment itself", function(assert) {
      var document = new simple$dom$document$$default();

      var frag = document.createDocumentFragment();
      var elem = document.createElement('div');
      var existing = document.createElement('main');
      var body = document.body;
      body.appendChild(existing);

      assert.strictEqual(body.firstChild.tagName, "MAIN", "sanity check: the main element was actually inserted");
      assert.strictEqual(body.lastChild.tagName, "MAIN", "sanity check: the main element was actually inserted");

      frag.appendChild(elem);
      body.insertBefore(frag, existing);

      assert.strictEqual(body.firstChild.tagName, "DIV", "The body's first child is now DIV");
      assert.strictEqual(body.lastChild.tagName, "MAIN", "The body's last child is now MAIN");
    });

    // http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-536297177
    QUnit.test("child nodes can be access via item()", function(assert) {
      var document = new simple$dom$document$$default();

      var parent = document.createElement('div');

      var child1 = document.createElement('p');
      var child2 = document.createElement('img');

      assert.strictEqual(parent.childNodes.item(0), null, "attempting to access an item that doesn't exist returns null");

      parent.appendChild(child1);
      parent.appendChild(child2);

      assert.strictEqual(parent.childNodes.item(0), child1);
      assert.strictEqual(parent.childNodes.item(1), child2);
      assert.strictEqual(parent.childNodes.item(2), null);

      parent.removeChild(child1);
      assert.strictEqual(parent.childNodes.item(0), child2);
      assert.strictEqual(parent.childNodes.item(1), null);

      parent.removeChild(child2);

      assert.strictEqual(parent.childNodes.item(0), null);
      assert.strictEqual(parent.childNodes.item(1), null);
    });

    QUnit.test("insertBefore can insert before the last child node", function(assert) {
      var document = new simple$dom$document$$default();

      var parent = document.createElement('div');

      var child1 = document.createElement('p');
      var child2 = document.createElement('img');
      var child3 = document.createElement('span');

      parent.appendChild(child1);
      parent.appendChild(child2);

      parent.insertBefore(child3, child2);

      assert.strictEqual(parent.childNodes.item(1), child3);
    });

    QUnit.test("cloneNode(true) recursively clones nodes", function(assert) {
      var parent = $$support$$element('div');

      var child1 = $$support$$element('p');
      var child2 = $$support$$element('img', { src: "hamster.png" });
      var child3 = $$support$$element('span');

      parent.appendChild(child1);
      parent.appendChild(child2);
      parent.appendChild(child3);

      var child11 = $$support$$text('hello');
      var child12 = $$support$$element('span');
      child12.appendChild($$support$$text(' world'));
      var child13 = $$support$$text('!');

      child1.appendChild(child11);
      child1.appendChild(child12);
      child1.appendChild(child13);

      var clone = parent.cloneNode(true);

      assert.notEqual(parent.firstChild, null);
      assert.notStrictEqual(clone.firstChild, parent.firstChild);

      var clone2 = parent.cloneNode(true);

      assert.notEqual(parent.firstChild, null);
      assert.notStrictEqual(clone2.firstChild, clone.firstChild);
      assert.notStrictEqual(clone2.firstChild, parent.firstChild);

      var actual = new simple$dom$html$serializer$$default(simple$dom$void$map$$default).serialize($$support$$fragment(clone));

      assert.equal(actual, '<div><p>hello<span> world</span>!</p><img src="hamster.png"><span></span></div>');
    });

    QUnit.test("head + metatags", function(assert) {
      var document = new simple$dom$document$$default();

      var meta = $$support$$element('meta', { name: "description", content: "something here" });
      var head = document.head;
      head.appendChild(meta);

      var actual = new simple$dom$html$serializer$$default(simple$dom$void$map$$default).serialize(head.firstChild);

      assert.strictEqual(head.firstChild.tagName, "META", "sanity check: the meta element was actually inserted");
      assert.equal(actual, '<meta name="description" content="something here">');
    });

    QUnit.test("setAttribute converts non strings", function (assert) {
      var document = new simple$dom$document$$default();

      var div = document.createElement('div');
      div.setAttribute('a', 0);
      assert.strictEqual(div.getAttribute('a'), '0');
      div.setAttribute('a', 1);
      assert.strictEqual(div.getAttribute('a'), '1');
      div.setAttribute('a', null);
      assert.strictEqual(div.getAttribute('a'), 'null');
      div.setAttribute('a', undefined);
      assert.strictEqual(div.getAttribute('a'), 'undefined');
      div.setAttribute('a', true);
      assert.strictEqual(div.getAttribute('a'), 'true');
      div.setAttribute('a', false);
      assert.strictEqual(div.getAttribute('a'), 'false');
    });

    QUnit.module('Node');

    QUnit.test("#insertBefore", function(assert) {
      var body = new simple$dom$document$node$$default(1, 'body');
      var div = new simple$dom$document$node$$default(1, 'div');
      var span = new simple$dom$document$node$$default(1, 'span');
      var ul = new simple$dom$document$node$$default(1, 'ul');
      span.previousSibling = new simple$dom$document$node$$default(1, 'p');
      body.appendChild(div);

      body.insertBefore(span, div);
      assert.strictEqual(span.parentNode, body, "nodes parent is set");
      assert.strictEqual(span.previousSibling, null, "nodes previous sibling is cleared");
      assert.strictEqual(span.nextSibling, div, "nodes next sibling is set");
      assert.strictEqual(div.previousSibling, span, "next sibling's previous sibling is set");
      assert.strictEqual(div.nextSibling, null, "next sibling's next sibling is set");
      assert.strictEqual(div.parentNode, body, "next sibling's parent is set");
      assert.strictEqual(body.firstChild, span, "parents first child is set");
      assert.strictEqual(body.lastChild, div, "parents last child is set");
    });
    function simple$dom$html$parser$$HTMLParser(tokenize, document, voidMap) {
      this.tokenize = tokenize;
      this.document = document;
      this.voidMap = voidMap;
      this.parentStack = [];
    }

    simple$dom$html$parser$$HTMLParser.prototype.isVoid = function(element) {
      return this.voidMap[element.nodeName] === true;
    };

    simple$dom$html$parser$$HTMLParser.prototype.pushElement = function(token) {
      var el = this.document.createElement(token.tagName);

      for (var i=0;i<token.attributes.length;i++) {
        var attr = token.attributes[i];
        el.setAttribute(attr[0], attr[1]);
      }

      if (this.isVoid(el)) {
        return this.appendChild(el);
      }

      this.parentStack.push(el);
    };

    simple$dom$html$parser$$HTMLParser.prototype.popElement = function(token) {
      var el = this.parentStack.pop();

      if (el.nodeName !== token.tagName.toUpperCase()) {
        throw new Error('unbalanced tag');
      }

      this.appendChild(el);
    };

    simple$dom$html$parser$$HTMLParser.prototype.appendText = function(token) {
      var text = this.document.createTextNode(token.chars);
      this.appendChild(text);
    };

    simple$dom$html$parser$$HTMLParser.prototype.appendComment = function(token) {
      var comment = this.document.createComment(token.chars);
      this.appendChild(comment);
    };

    simple$dom$html$parser$$HTMLParser.prototype.appendChild = function(node) {
      var parentNode = this.parentStack[this.parentStack.length-1];
      parentNode.appendChild(node);
    };

    simple$dom$html$parser$$HTMLParser.prototype.parse = function(html/*, context*/) {
      // TODO use context for namespaceURI issues
      var fragment = this.document.createDocumentFragment();
      this.parentStack.push(fragment);

      var tokens = this.tokenize(html);
      for (var i=0, l=tokens.length; i<l; i++) {
        var token = tokens[i];
        switch (token.type) {
          case 'StartTag':
            this.pushElement(token);
            break;
          case 'EndTag':
            this.popElement(token);
            break;
          case 'Chars':
            this.appendText(token);
            break;
          case 'Comment':
            this.appendComment(token);
            break;
        }
      }

      return this.parentStack.pop();
    };

    var simple$dom$html$parser$$default = simple$dom$html$parser$$HTMLParser;
    function $$utils$$isSpace(char) {
      return (/[\t\n\f ]/).test(char);
    }

    function $$utils$$isAlpha(char) {
      return (/[A-Za-z]/).test(char);
    }

    function $$utils$$preprocessInput(input) {
      return input.replace(/\r\n?/g, "\n");
    }
    function $$tokens$$StartTag(tagName, attributes, selfClosing) {
      this.type = 'StartTag';
      this.tagName = tagName || '';
      this.attributes = attributes || [];
      this.selfClosing = selfClosing === true;
    }

    function $$tokens$$EndTag(tagName) {
      this.type = 'EndTag';
      this.tagName = tagName || '';
    }

    function $$tokens$$Chars(chars) {
      this.type = 'Chars';
      this.chars = chars || "";
    }

    function $$tokens$$Comment(chars) {
      this.type = 'Comment';
      this.chars = chars || '';
    }

    function simple$html$tokenizer$tokenizer$$Tokenizer(input, entityParser) {
      this.input = $$utils$$preprocessInput(input);
      this.entityParser = entityParser;
      this.char = 0;
      this.line = 1;
      this.column = 0;

      this.state = 'data';
      this.token = null;
    }

    simple$html$tokenizer$tokenizer$$Tokenizer.prototype = {
      tokenize: function() {
        var tokens = [], token;

        while (true) {
          token = this.lex();
          if (token === 'EOF') { break; }
          if (token) { tokens.push(token); }
        }

        if (this.token) {
          tokens.push(this.token);
        }

        return tokens;
      },

      tokenizePart: function(string) {
        this.input += $$utils$$preprocessInput(string);
        var tokens = [], token;

        while (this.char < this.input.length) {
          token = this.lex();
          if (token) { tokens.push(token); }
        }

        this.tokens = (this.tokens || []).concat(tokens);
        return tokens;
      },

      tokenizeEOF: function() {
        var token = this.token;
        if (token) {
          this.token = null;
          return token;
        }
      },

      createTag: function(Type, char) {
        var lastToken = this.token;
        this.token = new Type(char);
        this.state = 'tagName';
        return lastToken;
      },

      addToTagName: function(char) {
        this.token.tagName += char;
      },

      selfClosing: function() {
        this.token.selfClosing = true;
      },

      createAttribute: function(char) {
        this._currentAttribute = [char.toLowerCase(), "", null];
        this.token.attributes.push(this._currentAttribute);
        this.state = 'attributeName';
      },

      addToAttributeName: function(char) {
        this._currentAttribute[0] += char;
      },

      markAttributeQuoted: function(value) {
        this._currentAttribute[2] = value;
      },

      finalizeAttributeValue: function() {
        if (this._currentAttribute) {
          if (this._currentAttribute[2] === null) {
            this._currentAttribute[2] = false;
          }
          this._currentAttribute = undefined;
        }
      },

      addToAttributeValue: function(char) {
        this._currentAttribute[1] = this._currentAttribute[1] || "";
        this._currentAttribute[1] += char;
      },

      createComment: function() {
        var lastToken = this.token;
        this.token = new $$tokens$$Comment();
        this.state = 'commentStart';
        return lastToken;
      },

      addToComment: function(char) {
        this.addChar(char);
      },

      addChar: function(char) {
        this.token.chars += char;
      },

      finalizeToken: function() {
        if (this.token.type === 'StartTag') {
          this.finalizeAttributeValue();
        }
        return this.token;
      },

      emitData: function() {
        this.addLocInfo(this.line, this.column - 1);
        var lastToken = this.token;
        this.token = null;
        this.state = 'tagOpen';
        return lastToken;
      },

      emitToken: function() {
        this.addLocInfo();
        var lastToken = this.finalizeToken();
        this.token = null;
        this.state = 'data';
        return lastToken;
      },

      addData: function(char) {
        if (this.token === null) {
          this.token = new $$tokens$$Chars();
          this.markFirst();
        }

        this.addChar(char);
      },

      markFirst: function(line, column) {
        this.firstLine = (line === 0) ? 0 : (line || this.line);
        this.firstColumn = (column === 0) ? 0 : (column || this.column);
      },

      addLocInfo: function(line, column) {
        if (!this.token) {
          return;
        }
        this.token.firstLine = this.firstLine;
        this.token.firstColumn = this.firstColumn;
        this.token.lastLine = (line === 0) ? 0 : (line || this.line);
        this.token.lastColumn = (column === 0) ? 0 : (column || this.column);
      },

      consumeCharRef: function() {
        return this.entityParser.parse(this);
      },

      lex: function() {
        var char = this.input.charAt(this.char++);

        if (char) {
          if (char === "\n") {
            this.line++;
            this.column = 0;
          } else {
            this.column++;
          }
          return this.states[this.state].call(this, char);
        } else {
          this.addLocInfo(this.line, this.column);
          return 'EOF';
        }
      },

      states: {
        data: function(char) {
          if (char === "<") {
            var chars = this.emitData();
            this.markFirst();
            return chars;
          } else if (char === "&") {
            this.addData(this.consumeCharRef() || "&");
          } else {
            this.addData(char);
          }
        },

        tagOpen: function(char) {
          if (char === "!") {
            this.state = 'markupDeclaration';
          } else if (char === "/") {
            this.state = 'endTagOpen';
          } else if ($$utils$$isAlpha(char)) {
            return this.createTag($$tokens$$StartTag, char.toLowerCase());
          }
        },

        markupDeclaration: function(char) {
          if (char === "-" && this.input.charAt(this.char) === "-") {
            this.char++;
            this.createComment();
          }
        },

        commentStart: function(char) {
          if (char === "-") {
            this.state = 'commentStartDash';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.addToComment(char);
            this.state = 'comment';
          }
        },

        commentStartDash: function(char) {
          if (char === "-") {
            this.state = 'commentEnd';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.addToComment("-");
            this.state = 'comment';
          }
        },

        comment: function(char) {
          if (char === "-") {
            this.state = 'commentEndDash';
          } else {
            this.addToComment(char);
          }
        },

        commentEndDash: function(char) {
          if (char === "-") {
            this.state = 'commentEnd';
          } else {
            this.addToComment("-" + char);
            this.state = 'comment';
          }
        },

        commentEnd: function(char) {
          if (char === ">") {
            return this.emitToken();
          } else {
            this.addToComment("--" + char);
            this.state = 'comment';
          }
        },

        tagName: function(char) {
          if ($$utils$$isSpace(char)) {
            this.state = 'beforeAttributeName';
          } else if (char === "/") {
            this.state = 'selfClosingStartTag';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.addToTagName(char);
          }
        },

        beforeAttributeName: function(char) {
          if ($$utils$$isSpace(char)) {
            return;
          } else if (char === "/") {
            this.state = 'selfClosingStartTag';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.createAttribute(char);
          }
        },

        attributeName: function(char) {
          if ($$utils$$isSpace(char)) {
            this.state = 'afterAttributeName';
          } else if (char === "/") {
            this.state = 'selfClosingStartTag';
          } else if (char === "=") {
            this.state = 'beforeAttributeValue';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.addToAttributeName(char);
          }
        },

        afterAttributeName: function(char) {
          if ($$utils$$isSpace(char)) {
            return;
          } else if (char === "/") {
            this.state = 'selfClosingStartTag';
          } else if (char === "=") {
            this.state = 'beforeAttributeValue';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.finalizeAttributeValue();
            this.createAttribute(char);
          }
        },

        beforeAttributeValue: function(char) {
          if ($$utils$$isSpace(char)) {
            return;
          } else if (char === '"') {
            this.state = 'attributeValueDoubleQuoted';
            this.markAttributeQuoted(true);
          } else if (char === "'") {
            this.state = 'attributeValueSingleQuoted';
            this.markAttributeQuoted(true);
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.state = 'attributeValueUnquoted';
            this.markAttributeQuoted(false);
            this.addToAttributeValue(char);
          }
        },

        attributeValueDoubleQuoted: function(char) {
          if (char === '"') {
            this.finalizeAttributeValue();
            this.state = 'afterAttributeValueQuoted';
          } else if (char === "&") {
            this.addToAttributeValue(this.consumeCharRef('"') || "&");
          } else {
            this.addToAttributeValue(char);
          }
        },

        attributeValueSingleQuoted: function(char) {
          if (char === "'") {
            this.finalizeAttributeValue();
            this.state = 'afterAttributeValueQuoted';
          } else if (char === "&") {
            this.addToAttributeValue(this.consumeCharRef("'") || "&");
          } else {
            this.addToAttributeValue(char);
          }
        },

        attributeValueUnquoted: function(char) {
          if ($$utils$$isSpace(char)) {
            this.finalizeAttributeValue();
            this.state = 'beforeAttributeName';
          } else if (char === "&") {
            this.addToAttributeValue(this.consumeCharRef(">") || "&");
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.addToAttributeValue(char);
          }
        },

        afterAttributeValueQuoted: function(char) {
          if ($$utils$$isSpace(char)) {
            this.state = 'beforeAttributeName';
          } else if (char === "/") {
            this.state = 'selfClosingStartTag';
          } else if (char === ">") {
            return this.emitToken();
          } else {
            this.char--;
            this.state = 'beforeAttributeName';
          }
        },

        selfClosingStartTag: function(char) {
          if (char === ">") {
            this.selfClosing();
            return this.emitToken();
          } else {
            this.char--;
            this.state = 'beforeAttributeName';
          }
        },

        endTagOpen: function(char) {
          if ($$utils$$isAlpha(char)) {
            this.createTag($$tokens$$EndTag, char.toLowerCase());
          }
        }
      }
    };

    var simple$html$tokenizer$tokenizer$$default = simple$html$tokenizer$tokenizer$$Tokenizer;
    function simple$html$tokenizer$entity$parser$$EntityParser(namedCodepoints) {
      this.namedCodepoints = namedCodepoints;
    }

    simple$html$tokenizer$entity$parser$$EntityParser.prototype.parse = function (tokenizer) {
      var input = tokenizer.input.slice(tokenizer.char);
      var matches = input.match(/^#(?:x|X)([0-9A-Fa-f]+);/);
      if (matches) {
        tokenizer.char += matches[0].length;
        return String.fromCharCode(parseInt(matches[1], 16));
      }
      matches = input.match(/^#([0-9]+);/);
      if (matches) {
        tokenizer.char += matches[0].length;
        return String.fromCharCode(parseInt(matches[1], 10));
      }
      matches = input.match(/^([A-Za-z]+);/);
      if (matches) {
        var codepoints = this.namedCodepoints[matches[1]];
        if (codepoints) {
          tokenizer.char += matches[0].length;
          for (var i = 0, buffer = ''; i < codepoints.length; i++) {
            buffer += String.fromCharCode(codepoints[i]);
          }
          return buffer;
        }
      }
    };

    var simple$html$tokenizer$entity$parser$$default = simple$html$tokenizer$entity$parser$$EntityParser;

    var simple$html$tokenizer$char$refs$min$$default = {
      quot: [34],
      amp: [38],
      apos: [39],
      lt: [60],
      gt: [62]
    };

    function test$parser$test$$tokenize(input) {
      // TODO: make Tokenizer take input on the tokenize method like tokenizePart
      // just init state, I'd rather pass in the tokenizer instance and call tokenize(input)
      var tokenizer = new simple$html$tokenizer$tokenizer$$default(input, new simple$html$tokenizer$entity$parser$$default(simple$html$tokenizer$char$refs$min$$default));
      return tokenizer.tokenize();
    }

    QUnit.module('Basic HTML parsing', {
      beforeEach: function() {
        this.parser = new simple$dom$html$parser$$default(test$parser$test$$tokenize, $$support$$document, simple$dom$void$map$$default);
      }
    });

    QUnit.test('simple parse', function (assert) {
      var fragment = this.parser.parse('<div>Hello</div>');
      assert.ok(fragment);

      var node = fragment.firstChild;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName.toLowerCase(), 'div');
      assert.ok(node.firstChild);
      assert.equal(node.firstChild.nodeType, 3);
      assert.equal(node.firstChild.nodeValue, 'Hello');
    });

    QUnit.test('nested parse', function (assert) {
      var fragment = this.parser.parse('text before<div>Hello</div>text between<div id=foo title="Hello World">World</div>text after');
      assert.ok(fragment);

      var node = fragment.firstChild;
      assert.ok(node);
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'text before');

      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName, 'DIV');
      assert.ok(node.firstChild);
      assert.equal(node.firstChild.nodeType, 3);
      assert.equal(node.firstChild.nodeValue, 'Hello');

      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'text between');

      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName, 'DIV');
      var expectedValues = {
        id: 'foo',
        title: 'Hello World'
      };
      assert.equal(node.attributes.length, 2);
      assert.equal(node.attributes[0].value, expectedValues[node.attributes[0].name]);
      assert.equal(node.attributes[1].value, expectedValues[node.attributes[1].name]);
      assert.equal(node.attributes.length, 2);
      assert.ok(node.firstChild);
      assert.equal(node.firstChild.nodeType, 3);
      assert.equal(node.firstChild.nodeValue, 'World');

      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'text after');
    });

    QUnit.test('void tags', function (assert) {
      var fragment = this.parser.parse('<div>Hello<br>World<img src="http://example.com/image.png"></div>');
      assert.ok(fragment);
      var node = fragment.firstChild;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName, 'DIV');
      node = node.firstChild;
      assert.ok(node);
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'Hello');
      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName, 'BR');
      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 3);
      assert.equal(node.nodeValue, 'World');
      node = node.nextSibling;
      assert.ok(node);
      assert.equal(node.nodeType, 1);
      assert.equal(node.nodeName, 'IMG');
      assert.equal(node.getAttribute('src'), 'http://example.com/image.png');
      assert.equal(node.nextSibling, null);
    });

    QUnit.module('Serializer', {
      beforeEach: function() {
        this.serializer = new simple$dom$html$serializer$$default(simple$dom$void$map$$default);
      }
    });

    QUnit.test('serializes single element correctly', function (assert) {
      var actual = this.serializer.serialize($$support$$element('div'));
      assert.equal(actual, '<div></div>');
    });

    QUnit.test('serializes element with attribute number value correctly', function (assert) {
      var actual = this.serializer.serialize($$support$$element('div', {"height": 500}));
      assert.equal(actual, '<div height="500"></div>');
    });

    QUnit.test('serializes single void element correctly', function (assert) {
      var actual = this.serializer.serialize($$support$$element('img', { src: 'foo' }));
      assert.equal(actual, '<img src="foo">');
    });

    QUnit.test('serializes complex tree correctly', function (assert) {
      var actual = this.serializer.serialize($$support$$fragment(
        $$support$$element('div', { id: 'foo' },
          $$support$$element('b', {},
            $$support$$text('Foo & Bar')
          ),
          $$support$$text('!'),
          $$support$$element('img', { src: 'foo' })
        )
      ));
      assert.equal(actual, '<div id="foo"><b>Foo &amp; Bar</b>!<img src="foo"></div>');
    });

    QUnit.test('does not serialize siblings of an element', function (assert) {
      var html = $$support$$element('html');
      var head = $$support$$element('head');
      var body = $$support$$element('body');

      head.appendChild($$support$$element('meta', { content: 'foo' }));
      head.appendChild($$support$$element('meta', { content: 'bar' }));

      html.appendChild(head);
      html.appendChild(body);

      var actual = this.serializer.serialize(head);
      assert.equal(actual, '<head><meta content="foo"><meta content="bar"></head>');

      actual = this.serializer.serialize(body);
      assert.equal(actual, '<body></body>');
    });

    // SimpleDOM supports an extension of the DOM API that allows inserting strings of
    // unparsed, raw HTML into the document. When the document is subsequently serialized,
    // the raw text of the HTML nodes is inserted into the HTML.
    //
    // This performance optimization allows users of SimpleDOM (like Ember's FastBoot) to insert
    // raw HTML snippets into the final serialized output without requiring a parsing and
    // reserialization round-trip.
    if (typeof window === 'undefined') {
      QUnit.test('serializes raw HTML', function(assert) {
        var actual = this.serializer.serialize($$support$$fragment(
          $$support$$element('div', { id: 'foo' },
            $$support$$text('<p></p>')
          )
        ));

        assert.equal(actual, '<div id="foo">&lt;p&gt;&lt;/p&gt;</div>');

        actual = this.serializer.serialize($$support$$fragment(
          $$support$$element('div', { id: 'foo' },
            $$support$$html('<p></p>')
          )
        ));

        assert.equal(actual, '<div id="foo"><p></p></div>');
      });
    }
}).call(this);

//# sourceMappingURL=simple-dom-test.js.map