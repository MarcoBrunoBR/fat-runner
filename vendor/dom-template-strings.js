'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function () {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = domify;
  } else {
    Node.prototype.dom = domify;
    Document.prototype.dom = domify;
  }

  /**
   * Just generates some kind-of-random ID. It just needs to be distinguishable from regular IDs
   * @return {string}  The generated ID
   */
  var counter = 0;
  function generateId() {
    counter++;
    return 'p-' + counter + '-' + Date.now();
  }

  /**
   * Receives a DOM Fragment and trim out whitespace-only children TextNodes
   * @param  {DocumentFragment} fragment   A DOM Fragment whose children will be trimmed
   * @return {Node}                        A DOM Node 
   */
  function trim(fragment) {
    var outerWhitespaceNodeReducer = function outerWhitespaceNodeReducer(_ref, currentNode) {
      var isLastOuterTextNodeFound = _ref.isLastOuterTextNodeFound,
          whitespaceNodes = _ref.whitespaceNodes;

      if (isLastOuterTextNodeFound) {
        return { isLastOuterTextNodeFound: true, whitespaceNodes: whitespaceNodes };
      } else {
        if (currentNode.nodeType === Node.TEXT_NODE) {
          if (currentNode.textContent.replace(/^\s+/, "")) {
            return { isLastOuterTextNodeFound: true, whitespaceNodes: whitespaceNodes };
          } else {
            whitespaceNodes.push(currentNode);
            return { isLastOuterTextNodeFound: false, whitespaceNodes: whitespaceNodes };
          }
        } else {
          return { isLastOuterTextNodeFound: true, whitespaceNodes: whitespaceNodes };
        }
      }
    };

    var _reduce = [].concat(_toConsumableArray(fragment.childNodes)).reduce(outerWhitespaceNodeReducer, {
      isLastOuterTextNodeFound: false,
      whitespaceNodes: []
    }),
        leftWhiteSpaceNodes = _reduce.whitespaceNodes;

    var _reduceRight = [].concat(_toConsumableArray(fragment.childNodes)).reduceRight(outerWhitespaceNodeReducer, {
      isLastOuterTextNodeFound: false,
      whitespaceNodes: []
    }),
        rightWhiteSpaceNodes = _reduceRight.whitespaceNodes;

    if (leftWhiteSpaceNodes.length) leftWhiteSpaceNodes.forEach(function (node) {
      return node.remove();
    });
    if (rightWhiteSpaceNodes.length) rightWhiteSpaceNodes.forEach(function (node) {
      return node.remove();
    });

    if (fragment.childNodes.length == 1) {
      var child = fragment.firstChild;
      fragment.removeChild(child);
      return child;
    } else {
      return fragment;
    }
  }

  /**
   * Generates an array of DOM Nodes
   * @param  {...any} partials   Might be anything. DOM Nodes are handled, arrays are iterated over and then handled, everything else just gets passed through
   * @return {Node[]}            An array of DOM Nodes
   */
  function generateNodes(doc) {
    // Array of placeholder IDs
    var placeholders = [];
    // Generate regular HTML string first
    function reducer(carry, partial) {
      if (partial && partial.nodeType == Node.DOCUMENT_FRAGMENT_NODE) {
        partial = partial.childNodes;
      }
      if (Array.isArray(partial)) {
        carry.concat(partial);
      } else if ((typeof partial === 'undefined' ? 'undefined' : _typeof(partial)) === 'object' && partial instanceof Node) {
        var id = generateId();
        placeholders.push({ id: id, node: partial });
        return carry.concat('<' + partial.nodeName + ' id="' + id + '"></' + partial.nodeName + '>');
      } else if (partial && typeof partial.item == "function" && typeof partial.length == "number") {
        return carry.concat(Array.prototype.reduce.call(partial, reducer, []));
      } else {
        return carry.concat(partial);
      }
    }

    for (var _len = arguments.length, partials = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      partials[_key - 1] = arguments[_key];
    }

    var html = partials.reduce(reducer, []).join('');

    // Wrap in temporary container node
    var template = doc.createElement('template');
    template.innerHTML = html;
    var container = template.content;

    // Replace placeholders with real Nodes
    placeholders.forEach(function (_ref2) {
      var id = _ref2.id,
          node = _ref2.node;

      var placeholder = container.querySelector(node.nodeName + '#' + id);
      placeholder.parentNode.replaceChild(node, placeholder);
    });
    return trim(container);
  }

  /**
   * A function that is suitable to be used as a function for tagged template strings
   * @param  {string[]}    strings  The literal parts of the template string
   * @param  {...values}   values   The interpolated parts of the template string
   * @return {Node[]}               An array of DOM Nodes
   */
  function taggedTemplateHandler(doc, strings) {
    for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      values[_key2 - 2] = arguments[_key2];
    }

    // Create an array that puts the values back in their place
    var arr = strings.reduce(function (carry, current, index) {
      return carry.concat(current, index + 1 === strings.length ? [] : values[index]);
    }, []);

    // Generate the Node array
    return generateNodes.apply(undefined, [doc].concat(_toConsumableArray(arr)));
  }

  function domify(strings) {
    var doc = document;
    if (this) {
      if (this.nodeType == Node.DOCUMENT_NODE) doc = this;else if (this.ownerDocument) doc = this.ownerDocument;
    }

    for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      values[_key3 - 1] = arguments[_key3];
    }

    return taggedTemplateHandler.apply(undefined, [doc, strings].concat(values));
  }
})();
