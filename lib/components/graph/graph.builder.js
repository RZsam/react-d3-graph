"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true,
});
exports.buildNodeProps = exports.buildLinkProps = undefined;

var _extends =
    Object.assign ||
    function(target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
/**
 * @module Graph/builder
 * @description
 * Offers a series of methods that isolate the way graph elements are built (nodes and links mainly).
 */

var _graph = require("./graph.const");

var _graph2 = _interopRequireDefault(_graph);

var _link = require("../link/link.helper");

var _marker = require("../marker/marker.helper");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Get the correct node opacity in order to properly make decisions based on context such as currently highlighted node.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @returns {number} the opacity value for the given node.
 * @memberof Graph/builder
 */
function _getNodeOpacity(node, highlightedNode, highlightedLink, config) {
    var highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    var someNodeHighlighted = !!(
        highlightedNode ||
        (highlightedLink && highlightedLink.source && highlightedLink.target)
    );
    var opacity = void 0;

    if (someNodeHighlighted && config.highlightDegree === 0) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else if (someNodeHighlighted) {
        opacity = highlight ? config.node.opacity : config.highlightOpacity;
    } else {
        opacity = node.opacity || config.node.opacity;
    }

    return opacity;
}

/**
 * Build some Link properties based on given parameters.
 * @param  {Object} link - the link object for which we will generate properties.
 * @param  {Object.<string, Object>} nodes - same as {@link #graphrenderer|nodes in renderGraph}.
 * @param  {Object.<string, Object>} links - same as {@link #graphrenderer|links in renderGraph}.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} linkCallbacks - same as {@link #graphrenderer|linkCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns an object that aggregates all props for creating respective Link component instance.
 * @memberof Graph/builder
 */
function buildLinkProps(link, nodes, links, config, linkCallbacks, highlightedNode, highlightedLink, transform) {
    var source = link.source,
        target = link.target;

    var x1 = (nodes[source] && nodes[source].x) || 0;
    var y1 = (nodes[source] && nodes[source].y) || 0;
    var x2 = (nodes[target] && nodes[target].x) || 0;
    var y2 = (nodes[target] && nodes[target].y) || 0;

    var d = (0, _link.buildLinkPathDefinition)(
        { source: { x: x1, y: y1 }, target: { x: x2, y: y2 } },
        config.link.type
    );

    var mainNodeParticipates = false;

    switch (config.highlightDegree) {
        case 0:
            break;
        case 2:
            mainNodeParticipates = true;
            break;
        default:
            // 1st degree is the fallback behavior
            mainNodeParticipates = source === highlightedNode || target === highlightedNode;
            break;
    }

    var reasonNode = mainNodeParticipates && nodes[source].highlighted && nodes[target].highlighted;
    var reasonLink =
        source === (highlightedLink && highlightedLink.source) &&
        target === (highlightedLink && highlightedLink.target);
    var highlight = reasonNode || reasonLink;

    var opacity = link.opacity || config.link.opacity;

    if (highlightedNode || (highlightedLink && highlightedLink.source)) {
        opacity = highlight ? config.link.opacity : config.highlightOpacity;
    }

    var stroke = link.color || config.link.color;

    if (highlight) {
        stroke =
            config.link.highlightColor === _graph2.default.KEYWORDS.SAME
                ? config.link.color
                : config.link.highlightColor;
    }

    var strokeWidth = (link.strokeWidth || config.link.strokeWidth) * (1 / transform);

    if (config.link.semanticStrokeWidth) {
        var linkValue = links[source][target] || links[target][source] || 1;

        strokeWidth += (linkValue * strokeWidth) / 10;
    }

    var markerId = config.directed ? (0, _marker.getMarkerId)(highlight, transform, config) : null;

    var t = 1 / transform;

    var fontSize = null;
    var fontColor = null;
    var fontWeight = null;
    var label = null;

    if (config.link.renderLabel) {
        label = link[config.link.labelProperty];
        fontSize = link.fontSize || config.link.fontSize;
        fontColor = link.fontColor || config.link.fontColor;
        fontWeight = highlight ? config.link.highlightFontWeight : config.link.fontWeight;
    }

    return {
        markerId: markerId,
        d: d,
        source: source,
        target: target,
        strokeWidth: strokeWidth,
        stroke: stroke,
        label: label,
        mouseCursor: config.link.mouseCursor,
        fontColor: fontColor,
        fontSize: fontSize * t,
        fontWeight: fontWeight,
        className: _graph2.default.LINK_CLASS_NAME,
        opacity: opacity,
        onClickLink: linkCallbacks.onClickLink,
        onRightClickLink: linkCallbacks.onRightClickLink,
        onMouseOverLink: linkCallbacks.onMouseOverLink,
        onMouseOutLink: linkCallbacks.onMouseOutLink,
    };
}

/**
 * Build some Node properties based on given parameters.
 * @param  {Object} node - the node object for whom we will generate properties.
 * @param  {Object} config - same as {@link #graphrenderer|config in renderGraph}.
 * @param  {Function[]} nodeCallbacks - same as {@link #graphrenderer|nodeCallbacks in renderGraph}.
 * @param  {string} highlightedNode - same as {@link #graphrenderer|highlightedNode in renderGraph}.
 * @param  {Object} highlightedLink - same as {@link #graphrenderer|highlightedLink in renderGraph}.
 * @param  {number} transform - value that indicates the amount of zoom transformation.
 * @returns {Object} returns object that contain Link props ready to be feeded to the Link component.
 * @memberof Graph/builder
 */
function buildNodeProps(node, config) {
    var nodeCallbacks = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var highlightedNode = arguments[3];
    var highlightedLink = arguments[4];
    var transform = arguments[5];

    var highlight =
        node.highlighted ||
        node.id === (highlightedLink && highlightedLink.source) ||
        node.id === (highlightedLink && highlightedLink.target);
    var opacity = _getNodeOpacity(node, highlightedNode, highlightedLink, config);

    var fill = node.color || config.node.color;

    if (highlight && config.node.highlightColor !== _graph2.default.KEYWORDS.SAME) {
        fill = config.node.highlightColor;
    }

    var stroke = node.strokeColor || config.node.strokeColor;

    if (highlight && config.node.highlightStrokeColor !== _graph2.default.KEYWORDS.SAME) {
        stroke = config.node.highlightStrokeColor;
    }

    var label = node[config.node.labelProperty] || node.id;

    if (typeof config.node.labelProperty === "function") {
        label = config.node.labelProperty(node);
    }

    var strokeWidth = node.strokeWidth || config.node.strokeWidth;

    if (highlight && config.node.highlightStrokeWidth !== _graph2.default.KEYWORDS.SAME) {
        strokeWidth = config.node.highlightStrokeWidth;
    }

    var t = 1 / transform;
    var nodeSize = node.size || config.node.size;
    var fontSize = highlight ? config.node.highlightFontSize : config.node.fontSize;
    var dx = fontSize * t + nodeSize / 100 + 1.5;
    var svg = node.svg || config.node.svg;
    var fontColor = node.fontColor || config.node.fontColor;

    return _extends({}, node, {
        className: _graph2.default.NODE_CLASS_NAME,
        cursor: config.node.mouseCursor,
        cx: (node && node.x) || "0",
        cy: (node && node.y) || "0",
        fill: fill,
        fontColor: fontColor,
        fontSize: fontSize * t,
        dx: dx,
        fontWeight: highlight ? config.node.highlightFontWeight : config.node.fontWeight,
        id: node.id,
        label: label,
        onClickNode: nodeCallbacks.onClickNode,
        onRightClickNode: nodeCallbacks.onRightClickNode,
        onMouseOverNode: nodeCallbacks.onMouseOverNode,
        onMouseOut: nodeCallbacks.onMouseOut,
        opacity: opacity,
        renderLabel: config.node.renderLabel,
        size: nodeSize * t,
        stroke: stroke,
        strokeWidth: strokeWidth * t,
        svg: svg,
        type: node.symbolType || config.node.symbolType,
        viewGenerator: node.viewGenerator || config.node.viewGenerator,
        overrideGlobalViewGenerator: !node.viewGenerator && node.svg,
    });
}

exports.buildLinkProps = buildLinkProps;
exports.buildNodeProps = buildNodeProps;
