/* eslint-disable @typescript-eslint/no-require-imports -- test stub */
const React = require("react");
function Link({ href, children, prefetch, replace, scroll, ...rest }) { void prefetch; void replace; void scroll; return React.createElement("a", { href: typeof href === "string" ? href : String(href), ...rest }, children); }
module.exports = Link; module.exports.default = Link; module.exports.__esModule = true;
