"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/pusher/auth/route";
exports.ids = ["app/api/pusher/auth/route"];
exports.modules = {

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("stream");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpusher%2Fauth%2Froute&page=%2Fapi%2Fpusher%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpusher%2Fauth%2Froute.ts&appDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpusher%2Fauth%2Froute&page=%2Fapi%2Fpusher%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpusher%2Fauth%2Froute.ts&appDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_tomas_Desktop_ImpostorGame_app_api_pusher_auth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/pusher/auth/route.ts */ \"(rsc)/./app/api/pusher/auth/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/pusher/auth/route\",\n        pathname: \"/api/pusher/auth\",\n        filename: \"route\",\n        bundlePath: \"app/api/pusher/auth/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\tomas\\\\Desktop\\\\ImpostorGame\\\\app\\\\api\\\\pusher\\\\auth\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_tomas_Desktop_ImpostorGame_app_api_pusher_auth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/pusher/auth/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZwdXNoZXIlMkZhdXRoJTJGcm91dGUmcGFnZT0lMkZhcGklMkZwdXNoZXIlMkZhdXRoJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGcHVzaGVyJTJGYXV0aCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUN0b21hcyU1Q0Rlc2t0b3AlNUNJbXBvc3RvckdhbWUlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q3RvbWFzJTVDRGVza3RvcCU1Q0ltcG9zdG9yR2FtZSZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDeUI7QUFDdEc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9pbXBvc3Rvci1nYW1lLz9jNDU1Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkM6XFxcXFVzZXJzXFxcXHRvbWFzXFxcXERlc2t0b3BcXFxcSW1wb3N0b3JHYW1lXFxcXGFwcFxcXFxhcGlcXFxccHVzaGVyXFxcXGF1dGhcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3B1c2hlci9hdXRoL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvcHVzaGVyL2F1dGhcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3B1c2hlci9hdXRoL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcdG9tYXNcXFxcRGVza3RvcFxcXFxJbXBvc3RvckdhbWVcXFxcYXBwXFxcXGFwaVxcXFxwdXNoZXJcXFxcYXV0aFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvcHVzaGVyL2F1dGgvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgb3JpZ2luYWxQYXRobmFtZSwgcGF0Y2hGZXRjaCwgIH07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFwcC1yb3V0ZS5qcy5tYXAiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpusher%2Fauth%2Froute&page=%2Fapi%2Fpusher%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpusher%2Fauth%2Froute.ts&appDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/pusher/auth/route.ts":
/*!**************************************!*\
  !*** ./app/api/pusher/auth/route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST),\n/* harmony export */   dynamic: () => (/* binding */ dynamic)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_pusher__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/pusher */ \"(rsc)/./lib/pusher.ts\");\n\n\nconst dynamic = \"force-dynamic\";\nasync function POST(request) {\n    try {\n        const { socket_id, channel_name } = await request.json();\n        // For private channels, authenticate the user\n        if (channel_name.startsWith(\"private-\")) {\n            const auth = _lib_pusher__WEBPACK_IMPORTED_MODULE_1__.pusherServer.authorizeChannel(socket_id, channel_name);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(auth);\n        }\n        // For public channels, just authorize\n        const auth = _lib_pusher__WEBPACK_IMPORTED_MODULE_1__.pusherServer.authorizeChannel(socket_id, channel_name);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(auth);\n    } catch (error) {\n        console.error(\"Pusher auth error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Authentication failed\"\n        }, {\n            status: 403\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3B1c2hlci9hdXRoL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBd0Q7QUFDWjtBQUVyQyxNQUFNRSxVQUFVLGdCQUFnQjtBQUVoQyxlQUFlQyxLQUFLQyxPQUFvQjtJQUM3QyxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFlBQVksRUFBRSxHQUFHLE1BQU1GLFFBQVFHLElBQUk7UUFFdEQsOENBQThDO1FBQzlDLElBQUlELGFBQWFFLFVBQVUsQ0FBQyxhQUFhO1lBQ3ZDLE1BQU1DLE9BQU9SLHFEQUFZQSxDQUFDUyxnQkFBZ0IsQ0FBQ0wsV0FBV0M7WUFDdEQsT0FBT04scURBQVlBLENBQUNPLElBQUksQ0FBQ0U7UUFDM0I7UUFFQSxzQ0FBc0M7UUFDdEMsTUFBTUEsT0FBT1IscURBQVlBLENBQUNTLGdCQUFnQixDQUFDTCxXQUFXQztRQUN0RCxPQUFPTixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDRTtJQUMzQixFQUFFLE9BQU9FLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLHNCQUFzQkE7UUFDcEMsT0FBT1gscURBQVlBLENBQUNPLElBQUksQ0FDdEI7WUFBRUksT0FBTztRQUF3QixHQUNqQztZQUFFRSxRQUFRO1FBQUk7SUFFbEI7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2ltcG9zdG9yLWdhbWUvLi9hcHAvYXBpL3B1c2hlci9hdXRoL3JvdXRlLnRzPzRhMDUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcclxuaW1wb3J0IHsgcHVzaGVyU2VydmVyIH0gZnJvbSAnQC9saWIvcHVzaGVyJztcclxuXHJcbmV4cG9ydCBjb25zdCBkeW5hbWljID0gJ2ZvcmNlLWR5bmFtaWMnO1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgeyBzb2NrZXRfaWQsIGNoYW5uZWxfbmFtZSB9ID0gYXdhaXQgcmVxdWVzdC5qc29uKCk7XHJcbiAgICBcclxuICAgIC8vIEZvciBwcml2YXRlIGNoYW5uZWxzLCBhdXRoZW50aWNhdGUgdGhlIHVzZXJcclxuICAgIGlmIChjaGFubmVsX25hbWUuc3RhcnRzV2l0aCgncHJpdmF0ZS0nKSkge1xyXG4gICAgICBjb25zdCBhdXRoID0gcHVzaGVyU2VydmVyLmF1dGhvcml6ZUNoYW5uZWwoc29ja2V0X2lkLCBjaGFubmVsX25hbWUpO1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oYXV0aCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIC8vIEZvciBwdWJsaWMgY2hhbm5lbHMsIGp1c3QgYXV0aG9yaXplXHJcbiAgICBjb25zdCBhdXRoID0gcHVzaGVyU2VydmVyLmF1dGhvcml6ZUNoYW5uZWwoc29ja2V0X2lkLCBjaGFubmVsX25hbWUpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGF1dGgpO1xyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdQdXNoZXIgYXV0aCBlcnJvcjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgIHsgZXJyb3I6ICdBdXRoZW50aWNhdGlvbiBmYWlsZWQnIH0sXHJcbiAgICAgIHsgc3RhdHVzOiA0MDMgfVxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuXHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwdXNoZXJTZXJ2ZXIiLCJkeW5hbWljIiwiUE9TVCIsInJlcXVlc3QiLCJzb2NrZXRfaWQiLCJjaGFubmVsX25hbWUiLCJqc29uIiwic3RhcnRzV2l0aCIsImF1dGgiLCJhdXRob3JpemVDaGFubmVsIiwiZXJyb3IiLCJjb25zb2xlIiwic3RhdHVzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/pusher/auth/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/pusher.ts":
/*!***********************!*\
  !*** ./lib/pusher.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   pusherServer: () => (/* binding */ pusherServer)\n/* harmony export */ });\nconst Pusher = __webpack_require__(/*! pusher */ \"(rsc)/./node_modules/pusher/lib/pusher.js\");\nconst pusherServer = new Pusher({\n    appId: process.env.PUSHER_APP_ID,\n    key: \"a8afa5181ccf9660f3e2\",\n    secret: process.env.PUSHER_SECRET,\n    cluster: \"eu\" || 0,\n    useTLS: true\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHVzaGVyLnRzIiwibWFwcGluZ3MiOiI7Ozs7QUFBQSxNQUFNQSxTQUFTQyxtQkFBT0EsQ0FBQztBQUVoQixNQUFNQyxlQUFlLElBQUlGLE9BQU87SUFDckNHLE9BQU9DLFFBQVFDLEdBQUcsQ0FBQ0MsYUFBYTtJQUNoQ0MsS0FBS0gsc0JBQWtDO0lBQ3ZDSyxRQUFRTCxRQUFRQyxHQUFHLENBQUNLLGFBQWE7SUFDakNDLFNBQVNQLElBQXNDLElBQUk7SUFDbkRTLFFBQVE7QUFDVixHQUFHIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaW1wb3N0b3ItZ2FtZS8uL2xpYi9wdXNoZXIudHM/OTAzMiJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBQdXNoZXIgPSByZXF1aXJlKCdwdXNoZXInKTtcclxuXHJcbmV4cG9ydCBjb25zdCBwdXNoZXJTZXJ2ZXIgPSBuZXcgUHVzaGVyKHtcclxuICBhcHBJZDogcHJvY2Vzcy5lbnYuUFVTSEVSX0FQUF9JRCEsXHJcbiAga2V5OiBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19QVVNIRVJfS0VZISxcclxuICBzZWNyZXQ6IHByb2Nlc3MuZW52LlBVU0hFUl9TRUNSRVQhLFxyXG4gIGNsdXN0ZXI6IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1BVU0hFUl9DTFVTVEVSIHx8ICdldScsXHJcbiAgdXNlVExTOiB0cnVlLFxyXG59KTtcclxuXHJcbiJdLCJuYW1lcyI6WyJQdXNoZXIiLCJyZXF1aXJlIiwicHVzaGVyU2VydmVyIiwiYXBwSWQiLCJwcm9jZXNzIiwiZW52IiwiUFVTSEVSX0FQUF9JRCIsImtleSIsIk5FWFRfUFVCTElDX1BVU0hFUl9LRVkiLCJzZWNyZXQiLCJQVVNIRVJfU0VDUkVUIiwiY2x1c3RlciIsIk5FWFRfUFVCTElDX1BVU0hFUl9DTFVTVEVSIiwidXNlVExTIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/pusher.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/tr46","vendor-chunks/tweetnacl","vendor-chunks/node-fetch","vendor-chunks/whatwg-url","vendor-chunks/pusher","vendor-chunks/event-target-shim","vendor-chunks/webidl-conversions","vendor-chunks/abort-controller","vendor-chunks/tweetnacl-util","vendor-chunks/is-base64"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fpusher%2Fauth%2Froute&page=%2Fapi%2Fpusher%2Fauth%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fpusher%2Fauth%2Froute.ts&appDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Ctomas%5CDesktop%5CImpostorGame&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();