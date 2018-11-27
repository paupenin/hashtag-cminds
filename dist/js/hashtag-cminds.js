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

      this.setCaretPos(this.getElementValue().length); // Show Taglist if in valid tag

      this.checkTaglist();
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
    key: "findTags",
    value: function findTags(value) {
      var _this3 = this;

      if (!this.op.tags) return null;
      value = value.substr(1);
      return this.op.tags.filter(function (tag) {
        if (_this3.op.case) {
          return tag.tag.startsWith(value);
        }

        return tag.tag.toLowerCase().startsWith(value.toLowerCase());
      });
    }
  }, {
    key: "bindContentEditable",
    value: function bindContentEditable() {
      var _this4 = this;

      this.ce.addEventListener("input", function () {
        _this4.setContent(_this4.ce.innerText);

        _this4.createContentTags();

        _this4.checkTaglist();

        _this4.trigger('change', _this4, _this4.el, _this4.getElementValue());
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
    key: "getCaretNode",
    value: function getCaretNode() {
      return document.getSelection().getRangeAt(0).startContainer.parentElement;
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
      } // End of content


      if (!node) {
        node = nodes[nodes.length - 1];
        position = node.length;
      } // Set cursor position


      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(node, position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }, {
    key: "setCaretPosAfterNode",
    value: function setCaretPosAfterNode(node) {
      this.ce.focus();
      if (!node) return; // Find textnode

      if (node.nodeType != 3) node = node.childNodes[0];
      var position = node.length; // Set cursor position

      var sel = window.getSelection();
      var range = document.createRange();
      range.setStart(node, position);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    /**
     * Tag List functions
     */

  }, {
    key: "checkTaglist",
    value: function checkTaglist() {
      this.hideTaglist();
      var node = this.getCaretNode();

      if (node && node.nodeName == 'SPAN') {
        var tags = this.findTags(node.innerText);

        if (tags.length > 0) {
          this.showTaglist(node, tags);
        }
      }
    }
  }, {
    key: "showTaglist",
    value: function showTaglist(element, tags) {
      var _this5 = this;

      this.hideTaglist();
      this.tl = document.createElement('ul');
      this.tl.setAttribute('class', 'hashtag-cminds-tag-list');
      this.tl.style.top = element.getBoundingClientRect().top + 'px';
      this.tl.style.left = element.getBoundingClientRect().left + 'px';
      tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.innerHTML = tag.tag;
        li.style.background = tag.color ? tag.color : _this5.op.color;
        li.addEventListener("click", function () {
          _this5.selectTaglist(element, tag);
        }, false);

        _this5.tl.appendChild(li);
      });
      document.body.appendChild(this.tl);
      this.trigger('dropdown.show', this, this.el, this.tl);
    }
  }, {
    key: "hideTaglist",
    value: function hideTaglist() {
      if (this.tl) {
        document.body.removeChild(this.tl);
        delete this.tl;
        this.trigger('dropdown.hide', this, this.el);
      }
    }
  }, {
    key: "selectTaglist",
    value: function selectTaglist(element, tag) {
      element.innerHTML = '#' + tag.tag;
      element.style.background = tag.color ? tag.color : this.op.color;
      this.hideTaglist();
      this.setCaretPosAfterNode(element);
      this.trigger('dropdown.select', this, this.el, element, tag);
    }
    /**
     * Events
     */

  }, {
    key: "on",
    value: function on(name, callback) {
      if (!this.events) this.events = {};
      if (!this.events[name]) this.events[name] = [];
      this.events[name].push(callback);
    }
  }, {
    key: "trigger",
    value: function trigger(name) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      if (!this.events || !this.events[name]) return;
      this.events[name].forEach(function (event) {
        event.apply(void 0, args);
      });
    }
  }]);

  return hashtagHelper;
}();

window.hashtagCM = function (element, options) {
  return new hashtagHelper(element, options);
};