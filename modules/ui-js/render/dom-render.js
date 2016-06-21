// Generated by CoffeeScript 1.10.0
var ArrayObserver, DOM, DOMRender, Event, HTMLRender, MutationObserver, Selection, animationFrame;

animationFrame = require('ui-js/polyfill/animation-frame');

ArrayObserver = require('ui-js/data-bind/array-observer');

MutationObserver = require('ui-js/dom/core/mutation-observer');

HTMLRender = require('./html-render');

Event = require('ui-js/dom/core/event');

Selection = require('./selection');

DOM = require('ui-js/dom');

module.exports = DOMRender = (function() {
  function DOMRender(nodeRoot, container) {
    this.nodeRoot = nodeRoot;
    this.container = container != null ? container : document.body;
    this.mutationsObserver = new MutationObserver(this.nodeRoot);
    this.realRoot = null;
    this.htmlRender = new HTMLRender(this.nodeRoot);
    this.selection = new Selection();
    this.range = document.createRange();
    this.init();
    this.frame();
    this.initHandlers();
    return;
  }

  DOMRender.prototype.init = function() {
    var renderResult;
    renderResult = this.renderNode(this.nodeRoot);
    this.container.innerHTML = renderResult.html;
    this.realRoot = this.container.children[0];
    this.linkRenderResult(this.realRoot, renderResult);
  };

  DOMRender.prototype.frame = function() {
    if (this.mutationsObserver.has) {
      this.renderUpdates();
    }
    animationFrame((function(_this) {
      return function() {
        return _this.frame();
      };
    })(this));
  };

  DOMRender.prototype.renderNode = function(node, shadowOnly) {
    if (shadowOnly == null) {
      shadowOnly = false;
    }
    return this.htmlRender.renderNode(node, shadowOnly);
  };

  DOMRender.prototype.renderUpdates = function() {
    var mutations;
    mutations = this.mutationsObserver["yield"]();
    this.selection.save();
    mutations.forEach((function(_this) {
      return function(mutation, node) {
        return _this.updateNode(mutation, node);
      };
    })(this));
    this.selection.restore();
  };

  DOMRender.prototype.updateNode = function(mutation, node) {
    var realNode;
    if (node.host) {
      node = node.host;
    }
    realNode = node.realNode;
    switch (node.nodeType) {
      case 'text':
        this.updateText(node, realNode);
        break;
      case 'comment':
        this.updateComment(node, realNode);
        break;
      case 'element':
        this.updateElement(node, realNode, mutation);
    }
  };

  DOMRender.prototype.getHost = function(node) {
    var context;
    context = node;
    while (context) {
      if (context.host) {
        return context.host;
      }
      context = context.parent || context.shadowRoot;
    }
    return null;
  };

  DOMRender.prototype.updateText = function(node, realNode) {
    realNode.nodeValue = node.value;
  };

  DOMRender.prototype.updateComment = function(node, realNode) {
    if (!realNode) {
      return;
    }
    realNode.nodeValue = node.value;
  };

  DOMRender.prototype.updateElement = function(node, realNode, mutation) {
    var host, isContent;
    isContent = node.tag === 'content';
    if (mutation.childrenChanged || isContent) {
      if (host = this.getHost(node)) {
        this.updateChildren(host, host.realNode, true);
      } else {
        this.updateChildren(node, node.realNode);
      }
    }
    if (isContent) {
      return;
    }
    mutation.changedAttrs.forEach(function(name) {
      return realNode.setAttribute(name, node.attrs[name]);
    });
    mutation.removedAttrs.forEach(function(name) {
      return realNode.removeAttribute(name, node.attrs[name]);
    });
    mutation.changedStyles.forEach(function(name) {
      return realNode.style[name] = node.style[name];
    });
    if (node.tag === 'input') {
      if (mutation.wasReset) {
        this.resetInputValue(node, realNode);
      } else if (mutation.valueChanged) {
        this.updateInputValue(node, realNode);
      }
    }
  };

  DOMRender.prototype.updateInputValue = function(node, realNode) {
    var prop;
    prop = (function() {
      switch (node.type) {
        case 'checkbox':
          return 'checked';
        default:
          return 'value';
      }
    })();
    realNode[prop] = node.value;
  };

  DOMRender.prototype.resetInputValue = function(node, realNode) {
    var tmp;
    tmp = realNode.type;
    realNode.type = 'text';
    this.updateInputValue(node, realNode);
    realNode.type = tmp;
    this.updateInputModel(node, realNode);
  };

  DOMRender.prototype.updateInputModel = function(node, realNode) {
    var prop;
    if (node.type === 'file') {
      node.setFiles(realNode.files);
      return;
    }
    prop = (function() {
      switch (node.type) {
        case 'checkbox':
          return 'checked';
        default:
          return 'value';
      }
    })();
    node.value = realNode[prop];
  };

  DOMRender.prototype.updateChildren = function(node, realNode, needChildren, renderResult) {
    var child, childRenderResult, i, index, j, len, len1, newChildNodes, oldChildNodes, oldRenderResult, realChild, ref, splice, splices;
    if (needChildren == null) {
      needChildren = false;
    }
    renderResult = renderResult || this.renderNode(node, true);
    oldRenderResult = realNode.renderResult;
    realNode.renderResult = renderResult;
    oldChildNodes = oldRenderResult.children.map(function(re) {
      return re.node;
    });
    newChildNodes = renderResult.children.map(function(re) {
      return re.node;
    });
    splices = ArrayObserver.diff(newChildNodes, oldChildNodes);
    for (i = 0, len = splices.length; i < len; i++) {
      splice = splices[i];
      if (splice.removed.length) {
        this.removeChildSplice(realNode, splice);
      }
      if (splice.addedCount) {
        this.insertChildSplice(newChildNodes, realNode, splice);
      }
    }
    if (needChildren) {
      ref = renderResult.children;
      for (index = j = 0, len1 = ref.length; j < len1; index = ++j) {
        childRenderResult = ref[index];
        child = childRenderResult.node;
        realChild = realNode.childNodes[index];
        this.updateChildren(child, realChild, true, childRenderResult);
      }
    }
  };

  DOMRender.prototype.removeChildSplice = function(realNode, splice) {
    var count, index, realChild;
    index = splice.index;
    count = splice.removed.length;
    while (count--) {
      realChild = realNode.childNodes[index];
      realNode.removeChild(realChild);
    }
  };

  DOMRender.prototype.insertChildSplice = function(newChildNodes, realNode, splice) {
    var fragment, relChild;
    fragment = this.createSpliceFragment(newChildNodes, splice);
    relChild = realNode.childNodes[splice.index];
    realNode.insertBefore(fragment, relChild);
  };

  DOMRender.prototype.createSpliceFragment = function(newChildNodes, splice) {
    var child, fragment, from, html, i, index, j, len, realChild, ref, ref1, renderResult, renderResults, to;
    html = '';
    renderResults = [];
    from = splice.index;
    to = from + splice.addedCount;
    for (index = i = ref = from, ref1 = to; ref <= ref1 ? i < ref1 : i > ref1; index = ref <= ref1 ? ++i : --i) {
      child = newChildNodes[index];
      renderResult = this.renderNode(child);
      renderResults.push(renderResult);
      html += renderResult.html;
    }
    fragment = this.range.createContextualFragment(html);
    this.splitTextNodes(fragment, {
      children: renderResults
    });
    for (index = j = 0, len = renderResults.length; j < len; index = ++j) {
      renderResult = renderResults[index];
      realChild = fragment.childNodes[index];
      this.linkRenderResult(realChild, renderResult);
    }
    return fragment;
  };

  DOMRender.prototype.linkRenderResult = function(realNode, renderResult) {
    var childRenderResult, i, index, len, node, realChild, ref;
    if (realNode.childNodes.length !== renderResult.children.length) {
      this.splitTextNodes(realNode, renderResult);
    }
    node = renderResult.node;
    node.init(realNode);
    realNode.renderResult = renderResult;
    if (node.tag === 'input') {
      this.updateInputValue(node, realNode);
    }
    ref = renderResult.children;
    for (index = i = 0, len = ref.length; i < len; index = ++i) {
      childRenderResult = ref[index];
      realChild = realNode.childNodes[index];
      this.linkRenderResult(realChild, childRenderResult);
    }
  };

  DOMRender.prototype.splitTextNodes = function(realNode, renderResult) {
    var fragment, i, len, ref, relText, startIndex, textGroup;
    ref = this.createCloseTextNodes(renderResult);
    for (i = 0, len = ref.length; i < len; i++) {
      textGroup = ref[i];
      startIndex = textGroup.startIndex;
      fragment = textGroup.fragment;
      relText = realNode.childNodes[startIndex];
      realNode.insertBefore(fragment, relText);
      realNode.removeChild(relText);
    }
  };

  DOMRender.prototype.createCloseTextNodes = function(renderResult) {
    var closeTextGroups, fragment, index, nextType, startIndex, text, textNode, type, types;
    types = renderResult.children.map(function(child) {
      return child.node.nodeType;
    });
    closeTextGroups = [];
    index = 0;
    while (type = types[index]) {
      nextType = types[index + 1];
      if (type === 'text' && nextType === 'text') {
        fragment = document.createDocumentFragment();
        startIndex = index;
        while (types[index] === 'text') {
          text = renderResult.children[index];
          textNode = document.createTextNode(text.node.value);
          fragment.appendChild(textNode);
          index++;
        }
        closeTextGroups.push({
          fragment: fragment,
          startIndex: startIndex
        });
      }
      index++;
    }
    return closeTextGroups;
  };

  DOMRender.prototype.initHandlers = function() {
    var eventName, fn, i, len, ref;
    ref = this.getEventNames();
    fn = (function(_this) {
      return function(eventName) {
        return _this.container.addEventListener(eventName, function(realEvent) {
          var realNode, ref1, virtualNode;
          realNode = realEvent.target;
          virtualNode = (ref1 = realNode.renderResult) != null ? ref1.node : void 0;
          if (virtualNode && (eventName === 'input' || eventName === 'change')) {
            _this.updateInputModel(virtualNode, realNode);
          }
          return _this.emitEvent(eventName, realNode, virtualNode, realEvent);
        }, true);
      };
    })(this);
    for (i = 0, len = ref.length; i < len; i++) {
      eventName = ref[i];
      fn(eventName);
    }
  };

  DOMRender.prototype.emitEvent = function(eventName, realNode, virtualNode, realEvent) {
    var event, realContext, ref, virtualTarget;
    realContext = realNode;
    while (realContext) {
      virtualTarget = (ref = realContext.renderResult) != null ? ref.node : void 0;
      if (virtualTarget && virtualTarget.hasEventHandlers(eventName)) {
        event = new Event(eventName, virtualNode, virtualTarget, realContext, realEvent);
        event.emit();
        if (event.stopped) {
          return;
        }
      }
      realContext = realContext.parentNode;
    }
  };

  DOMRender.prototype.getEventNames = function() {
    var eventName, eventNames, key;
    eventNames = [];
    for (key in document) {
      if (!(key.indexOf('on') === 0)) {
        continue;
      }
      eventName = key.slice(2);
      eventNames.push(eventName);
    }
    return eventNames;
  };

  return DOMRender;

})();

//# sourceMappingURL=dom-render.js.map