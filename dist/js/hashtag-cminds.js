"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Hashtag helper for Collective Minds Radiology
 */
var hashtagHelper =
/*#__PURE__*/
function () {
  function hashtagHelper(element, options) {
    _classCallCheck(this, hashtagHelper);

    this.setOptions(options);
    this.setElement(element);
    this.init();
  }

  _createClass(hashtagHelper, [{
    key: "setOptions",
    value: function setOptions(options) {
      if (_typeof(options) != 'object') options = {};
      var defaults = {
        "case": false,
        "color": '#e2e3e5',
        "tags": null
      };
      this.op = _objectSpread({}, defaults, options);
    }
  }, {
    key: "setElement",
    value: function setElement(element) {
      if (typeof element == 'string') {
        element = document.querySelector(element);
      }

      this.el = element;
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
      this.el.value = content;
    }
  }, {
    key: "init",
    value: function init() {
      this.createContentEditable();
      this.createContentTags();
      this.bindContentEditable(); // Position Caret at end

      this.setCaretPos(this.getElementValue().length - 1);
    }
    /**
     * Content Editable functions
     */

  }, {
    key: "createContentEditable",
    value: function createContentEditable() {
      this.ce = document.createElement('div');
      this.ce.setAttribute('class', this.el.getAttribute('class') + ' hashtag-cminds-content-editable');
      this.ce.setAttribute('style', this.el.getAttribute('style'));
      this.ce.setAttribute('contenteditable', "true");
      this.el.parentElement.appendChild(this.ce);
    }
  }, {
    key: "createContentTags",
    value: function createContentTags() {
      var content = this.getHtmlContent();

      if (this.normalize(content) != this.normalize(this.getContentValue())) {
        var caret_position = this.getCaretPos();
        this.ce.innerHTML = content;
        this.setCaretPos(caret_position);
      }
    }
  }, {
    key: "normalize",
    value: function normalize(string) {
      return string.replace(/\s/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ');
    }
  }, {
    key: "getElementValue",
    value: function getElementValue() {
      return this.el.value;
    }
  }, {
    key: "getContentValue",
    value: function getContentValue() {
      return this.ce.innerHTML;
    }
  }, {
    key: "getHtmlContent",
    value: function getHtmlContent() {
      return '<div>' + this.getHtmlTags().replace(/\n/g, '</div><div>') + '</div>'.replace(/<div><\/div>/g, '');
    }
  }, {
    key: "getHtmlTags",
    value: function getHtmlTags() {
      var _this = this;

      return this.getElementValue().replace(/(#[\w\-&]*)/g, function (str, match) {
        var tag = _this.findTag(match);

        var color = tag && tag.color ? tag.color : _this.op.color;
        return "<span style=\"background: ".concat(color, "\">").concat(match, "</span>");
      });
    }
  }, {
    key: "findTag",
    value: function findTag(value) {
      var _this2 = this;

      if (!this.op.tags) return null;
      value = value.substr(1);
      return this.op.tags.find(function (tag) {
        if (_this2.op.case) {
          return tag.tag == value;
        }

        return tag.tag.toLowerCase() == value.toLowerCase();
      });
    }
  }, {
    key: "bindContentEditable",
    value: function bindContentEditable() {
      var _this3 = this;

      this.ce.addEventListener("input", function () {
        _this3.setContent(_this3.ce.innerText);

        _this3.createContentTags();
      }, false);
    }
    /**
     * Caret position
     */

  }, {
    key: "getAllTextnodes",
    value: function getAllTextnodes() {
      var n,
          a = [],
          walk = document.createTreeWalker(this.ce, NodeFilter.SHOW_TEXT, null, false);

      while (n = walk.nextNode()) {
        a.push(n);
      }

      return a;
    }
  }, {
    key: "getCaretPos",
    value: function getCaretPos() {
      this.ce.focus();

      var _range = document.getSelection().getRangeAt(0);

      var range = _range.cloneRange();

      range.selectNodeContents(this.ce);
      range.setEnd(_range.endContainer, _range.endOffset);
      return range.toString().length;
    }
  }, {
    key: "setCaretPos",
    value: function setCaretPos(position) {
      this.ce.focus();
      if (position <= 0) return; // Get node element

      var node,
          nodes = this.getAllTextnodes();

      for (var i in nodes) {
        if (position - nodes[i].length > 0) {
          position -= nodes[i].length;
        } else {
          node = nodes[i];
          break;
        }
      }

      if (!node) return; // Set cursor position

      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(node, position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }]);

  return hashtagHelper;
}();

window.hashtagCM = function (element, options) {
  return new hashtagHelper(element, options);
};