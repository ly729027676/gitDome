<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<style>
  /*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */
html {
  line-height: 1.15; /* 1 */
  -webkit-text-size-adjust: 100%; /* 2 */
}

body {
  margin: 0;
}

h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */
}

pre {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

a {
  background-color: transparent;
}

abbr[title] {
  border-bottom: none; /* 1 */
  text-decoration: underline; /* 2 */
  text-decoration: underline dotted; /* 2 */
}

b,
strong {
  font-weight: bolder;
}

code,
kbd,
samp {
  font-family: monospace, monospace; /* 1 */
  font-size: 1em; /* 2 */
}

small {
  font-size: 80%;
}

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

img {
  border-style: none;
}

button,
input,
optgroup,
select,
textarea {
  font-family: inherit; /* 1 */
  font-size: 100%; /* 1 */
  line-height: 1.15; /* 1 */
  margin: 0; /* 2 */
}

button,
input { /* 1 */
  overflow: visible;
}

button,
select { /* 1 */
  text-transform: none;
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button;
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

fieldset {
  padding: 0.35em 0.75em 0.625em;
}

legend {
  box-sizing: border-box; /* 1 */
  color: inherit; /* 2 */
  display: table; /* 1 */
  max-width: 100%; /* 1 */
  padding: 0; /* 3 */
  white-space: normal; /* 1 */
}

progress {
  vertical-align: baseline;
}

textarea {
  overflow: auto;
}

[type="checkbox"],
[type="radio"] {
  box-sizing: border-box; /* 1 */
  padding: 0; /* 2 */
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto;
}

[type="search"] {
  -webkit-appearance: textfield; /* 1 */
  outline-offset: -2px; /* 2 */
}

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

::-webkit-file-upload-button {
  -webkit-appearance: button; /* 1 */
  font: inherit; /* 2 */
}

details {
  display: block;
}

summary {
  display: list-item;
}

template {
  display: none;
}

[hidden] {
  display: none;
}
/* css reset */
* {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
*::before,
*::after {
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}
body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, code, form, fieldset, legend, input, button, textarea, p, blockquote, th, td {
    margin: 0;
    padding: 0;
}
body {
    background: #fff;
    font-size: 14px;
    line-height: 1.42857143;
    font-family: "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
}
td, th, caption {
    font-size: 14px;
}
address, caption, cite, code, dfn, em, strong, th, var {
    font-style: normal;
    font-weight: normal;
}
a {
    color: #555;
    text-decoration: none;
}
a:hover {
    text-decoration: underline;
}
img {
    max-width: 100%;
    vertical-align: middle;
}
ol, ul, li {
    list-style: none;
}
input, textarea, select, button {
    font: 14px "Microsoft YaHei", "Arial", "黑体", "宋体", sans-serif;
}
table {
    border-collapse: collapse;
}
html {
    overflow-y: scroll;
}
.clearfix::before,
.clearfix::after {
    content: " ";
    display: table;
    clear: both;
}
.clearfix {
    *zoom: 1;
}
/* 重置浏览器滚动条样式 start*/  
::-webkit-scrollbar {  
  width: 10px;  
  height: 10px;  
  background-color: #F5F5F5;  
}  
/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track {  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.1);  
  background: #fff ;  
}  
/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb {  
  border-radius: 3px;  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);  
  background-color:rgba(64, 158, 255, 0.7);  
}  
::-webkit-scrollbar-thumb:hover {  
  border-radius: 3px;  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.1);  
  background-color:rgba(64, 158, 255, 1);  
}  
/* 重置浏览器滚动条样式 end*/  

/*公共类*/
.pull-left {
    float: left!important;
}
.pull-right {
    float: right!important;
}
.text-left {
    text-align: left!important;
}
.text-center {
    text-align: center!important;
}
.text-right {
    text-align: right!important;
}
.hidden {
    display: none!important;
}
</style>