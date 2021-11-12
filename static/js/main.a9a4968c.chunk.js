(this.webpackJsonpcrosswords=this.webpackJsonpcrosswords||[]).push([[0],{23:function(e,n,t){},29:function(e,n,t){"use strict";t.r(n);var r,c,o,i,a,l,d,s,u,b=t(1),f=t.n(b),j=t(14),x=t.n(j),p=(t(23),t(2)),h=t(12),O=t(4),g=t(5),v=t(3),w=t(8),m=t(0);function y(e){var n=e.wordList,t=e.grid,r=e.updateClue,c=e.editable,o=n.filter((function(e){return"x"===e.direction})),i=n.filter((function(e){return"y"===e.direction}));return Object(m.jsx)(Q,{children:Object(m.jsxs)(V,{children:[Object(m.jsx)(k,{title:"Across",clues:o,grid:t,updateClue:r,editable:c}),Object(m.jsx)(k,{title:"Down",clues:i,grid:t,updateClue:r,editable:c})]})})}function k(e){var n=e.title,t=e.clues,r=e.grid,c=e.updateClue,o=e.editable;return Object(m.jsxs)(X,{children:[Object(m.jsx)(Z,{children:n}),t.map((function(e,n){return Object(m.jsxs)(_,{children:[Object(m.jsx)(ee,{children:r[e.y][e.x].cellNumber}),o?Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(ne,{children:e.word}),Object(m.jsx)($,{value:e.clue,placeholder:"[Clue needed]",onChange:function(n){return c(e,n.target.value)}})]}):Object(m.jsx)(te,{children:e.clue})]},n)}))]})}var C,D,S,L,z,W,A,E,H,M,N,P,R,B,F,J,U,I,q,T,K,Y,G,Q=v.a.div(r||(r=Object(p.a)(["\n  width: 100%;\n  overflow-y: scroll;\n"]))),V=v.a.div(c||(c=Object(p.a)(["\n  width: 100%;\n  height: 100px;\n"]))),X=v.a.div(o||(o=Object(p.a)(["\n  padding: 5px;\n  border-top: 1px solid #eee;\n"]))),Z=v.a.h1(i||(i=Object(p.a)(["\n  font-size: 0.75em;\n  text-transform: uppercase;\n  margin: 0;\n  margin-bottom: 5px;\n"]))),$=v.a.input(a||(a=Object(p.a)(["\n  padding: 5px;\n  margin: 2px;\n  display: block;\n  ::placeholder,\n  ::-webkit-input-placeholder {\n    color: #ccc;\n  }\n"]))),_=v.a.div(l||(l=Object(p.a)(["\n  margin-bottom: 10px;\n"]))),ee=v.a.span(d||(d=Object(p.a)(["\n  font-weight: bold;\n  font-size: 0.75em;\n  display: inline-block;\n  vertical-align: top;\n  margin-right: 0.25em;\n"]))),ne=v.a.span(s||(s=Object(p.a)(["\n  text-transform: uppercase;\n  font-size: 0.9em;\n"]))),te=v.a.div(u||(u=Object(p.a)(["\n  font-size: 0.9em;\n"]))),re=t(18);function ce(e,n){for(var t=[],r=0;r<n;r++){for(var c=[],o=0;o<n;o++)c.push({x:o,y:r,chars:new Set,cellNumber:null,wordHereAcross:null,wordHereDown:null,allWordsHere:new Set,nextCellAcross:null,nextCellDown:null,previousCellAcross:null,previousCellDown:null});t.push(c)}var i,a=Object(re.a)(e);try{for(a.s();!(i=a.n()).done;)for(var l=i.value,d=l.x,s=l.y,u=l.direction,b=l.word,f="x"===u?1:0,j="y"===u?1:0,x=0;x<b.length;x++){var p=t[s+x*j];if(null!=p&&null!=p[d+x*f]){var h=p[d+x*f];0===x&&("x"===u?h.wordHereAcross=l:h.wordHereDown=l),h.chars.add(b[x]),h.allWordsHere.add(l)}}}catch(z){a.e(z)}finally{a.f()}for(var O=1,g=null,v=null,w=0;w<n;w++)for(var m=0;m<n;m++){var y=t[w][m];(y.wordHereAcross||y.wordHereDown)&&(y.cellNumber=O++),y.chars.size&&(v?(v.nextCellAcross=y,y.previousCellAcross=v):g=y,v=y)}g&&(g.previousCellAcross=v,v.nextCellAcross=g);for(var k=null,C=null,D=0;D<n;D++)for(var S=0;S<n;S++){var L=t[S][D];L.chars.size&&(C?(C.nextCellDown=L,L.previousCellDown=C):k=L,C=L)}return k&&(k.previousCellDown=C,C.nextCellDown=k),t}function oe(e){var n=e.draftDirection,t=e.setDraftDirection;return Object(m.jsxs)(ve,{children:[Object(m.jsxs)(me,{onClick:function(){return t("x")},selected:"x"===n,leftMost:!0,unclickable:"x"===n,children:["Across ","\u2794"]}),Object(m.jsxs)(me,{onClick:function(){return t("y")},rightMost:!0,selected:"y"===n,unclickable:"y"===n,children:["Down ",Object(m.jsx)(we,{children:"\u2794"})]}),Object(m.jsxs)(ye,{children:[Object(m.jsx)(ke,{children:"Swap with Enter"}),Object(m.jsx)(Ce,{val:"enter",children:"\u23ce"})]})]})}function ie(e){var n=e.selected,t=e.wordLists,r=e.select,c=e.remove,o=e.duplicate,i=e.children;return Object(m.jsxs)(Me,{children:[t.map((function(e,t){return Object(m.jsxs)(Ne,{onClick:function(){n!==t&&r(t)},selected:n===t,children:["Crossword #",t," (",e.length," word",1===e.length?"":"s",")",n===t&&Object(m.jsxs)(m.Fragment,{children:[Object(m.jsx)(Pe,{onClick:function(n){n.stopPropagation();var t=new URL(window.location.href);t.hash="#".concat(btoa(JSON.stringify(e))),navigator.clipboard.writeText(t)},children:"(Copy URL)"}),Object(m.jsx)(Pe,{onClick:function(e){e.stopPropagation(),c(t)},children:"(Delete)"}),Object(m.jsx)(Pe,{onClick:function(e){e.stopPropagation(),o(t)},children:"(Duplicate)"})]})]},t)})),i]})}function ae(e){var n=e.inputRef,t=e.gridSize,r=e.draftWord,c=e.setDraftWord,o=e.draftDirection,i=e.setDraftDirection,a=e.currentlySaved,l=e.saveWordList;return Object(m.jsxs)(je,{children:[Object(m.jsxs)(xe,{children:[Object(m.jsxs)(pe,{children:[Object(m.jsx)(ge,{value:r,onChange:function(e){return function(e){e.target.value=e.target.value.replace(/[^\w]/g,"").toUpperCase(),c(e.target.value)}(e)},placeholder:"Enter a new word...",ref:n}),Object(m.jsx)(Oe,{error:r.length>t,empty:0===r.length,children:r.length})]}),Object(m.jsxs)(ye,{children:[Object(m.jsx)(ke,{children:"Clear with Escape"}),Object(m.jsx)(Ce,{children:"ESC"})]})]}),Object(m.jsx)(oe,{setDraftDirection:i,draftDirection:o}),Object(m.jsxs)(ve,{minWidth:"100px",children:[Object(m.jsx)(me,{onClick:l,fullWidth:!0,unclickable:a,children:"Save"}),Object(m.jsx)(ye,{children:Object(m.jsx)(ke,{children:a?"\u2714 Saved":"\u2716 Unsaved"})})]})]})}function le(e){var n,t,r=e.draftWord,c=e.draftDirection,o=e.removeWord,i=e.commitWord,a=e.grid,l=Object(b.useState)(null),d=Object(g.a)(l,2),s=d[0],u=d[1],f=null;if(s){var j=s.x,x=s.y,p=a[x][j].wordHereAcross,h=a[x][j].wordHereDown;f="x"===c?null!==p&&void 0!==p?p:h:null!==h&&void 0!==h?h:p}r?(n=null,t=!f||f.direction!==c):(n=f,t=!1);return Object(m.jsx)(Se,{children:a.map((function(e,l){return Object(m.jsx)(Le,{children:e.map((function(e,d){var b=e.chars,f=e.allWordsHere;function j(e){var n=e.word,t=e.direction,r=e.x,c=e.y,o=Object(O.a)(n);return"x"===t&&c===l?o[d-r]:"y"===t&&r===d?o[l-c]:void 0}var x=!1,p="";return f.has(n)&&(x=!0,p=j(n)),s&&(p=j({word:r,direction:c,x:s.x,y:s.y})||""),Object(m.jsx)(ze,{onMouseEnter:function(){return function(e,n){u({x:e,y:n})}(d,l)},onMouseLeave:function(){u(null)},interactable:t||x,placeable:r.length>0&&t,holdingWord:r.length>0,modifiable:x,hover:x&&!r.length,hasLetter:b.size||p,onClick:function(){n?o(n):t&&i(d,l)},children:Object(m.jsxs)(We,{children:[Object(m.jsx)(He,{children:a[l][d].cellNumber}),Object(w.uniq)([].concat(Object(O.a)(Object(w.sortBy)(Object(O.a)(b))),Object(O.a)(p))).map((function(e){return Object(m.jsx)(Ae,{error:b.size>1||b.size>0&&e===p&&!b.has(p),draft:e===p,children:e},e)}))]})},d)}))},l)}))})}function de(e){var n=e.draftDirection,t=e.grid,r=Object(b.useRef)(null);function c(e,t,r){"Backspace"===e.key&&function(e,t,r){if(0!==e.target.value.length)return void(e.target.value="");e.preventDefault();var c=o(t,r,n,!0);c&&(c.value=c.value.slice(0,-1))}(e,t,r),"ArrowLeft"===e.key&&o(t,r,"x",!0),"ArrowRight"===e.key&&o(t,r,"x",!1),"ArrowUp"===e.key&&o(t,r,"y",!0),"ArrowDown"===e.key&&o(t,r,"y",!1)}function o(e,n,c,o){var i=t[n][e],a=null;a=o?"x"===c?i.previousCellAcross:i.previousCellDown:"x"===c?i.nextCellAcross:i.nextCellDown;var l=r.current.querySelector('[name="cellinput-'.concat(a.x,"-").concat(a.y,'"]'));return null!==l&&l.focus(),l}return Object(m.jsx)(Se,{ref:r,children:t.map((function(e,o){return Object(m.jsx)(Le,{children:e.map((function(e,i){var a=e.chars.size>0;return Object(m.jsx)(ze,{onMouseEnter:function(){},onMouseLeave:function(){},hasLetter:a,children:Object(m.jsxs)(We,{children:[Object(m.jsx)(He,{children:t[o][i].cellNumber}),a>0&&Object(m.jsx)(Ee,{name:"cellinput-".concat(i,"-").concat(o),onChange:function(e){return function(e,c,o){var i=e.target,a=i.value,l=i.selectionStart,d=a.charAt(l-1);if(/[\w]/.test(d)){e.target.value=d.toUpperCase();var s=t[o][c],u="x"===n?s.nextCellAcross:s.nextCellDown,b=r.current.querySelector('[name="cellinput-'.concat(u.x,"-").concat(u.y,'"]'));null!==b&&(b.focus(),b.selectionStart=b.selectionEnd=0)}else e.target.value=""}(e,i,o)},onKeyDown:function(e){return c(e,i,o)}})]})},i)}))},o)}))})}function se(e,n){var t=Object(b.useState)((function(){var t=localStorage.getItem(e);return JSON.parse(t)||n})),r=Object(g.a)(t,2),c=r[0],o=r[1];return Object(b.useEffect)((function(){localStorage.setItem(e,JSON.stringify(c))}),[e,c]),[c,o]}function ue(){var e,n=Object(b.useRef)(null),t=Object(b.useState)(!0),r=Object(g.a)(t,2),c=r[0],o=r[1],i=Object(b.useState)("x"),a=Object(g.a)(i,2),l=a[0],d=a[1],s=Object(b.useState)(""),u=Object(g.a)(s,2),f=u[0],j=u[1],x=Object(b.useState)(""),p=Object(g.a)(x,2),v=p[0],k=p[1],C=se("wordList",[]),D=Object(g.a)(C,2),S=D[0],L=D[1],z=se("currentWordListIdx",0),W=Object(g.a)(z,2),A=W[0],E=W[1],H=se("savedWordLists",[]),M=Object(g.a)(H,2),N=M[0],P=M[1];e=!c,Object(b.useEffect)((function(){window.onbeforeunload=null,e&&(window.onbeforeunload=function(){return!0})}),[e]);Object(b.useEffect)((function(){function e(e){"Enter"===e.code&&(e.preventDefault(),d("x"===l?"y":"x")),"Escape"===e.code&&(e.preventDefault(),j(""))}return document.body.addEventListener("keydown",e),function(){return document.body.removeEventListener("keydown",e)}}),[l]),Object(b.useEffect)((function(){N[A]?L(N[A]):(o(!0),P((function(e){return[].concat(Object(O.a)(e),[[]])})),L([]))}),[N,A,L,P]);var R=function(e){c?E(e):alert("You have unsaved changes")},B=function(e){o(!1),L(e)},F=Object(b.useMemo)((function(){return ce(S,15)}),[S,15]);return Object(m.jsxs)(fe,{children:[Object(m.jsx)(ae,{inputRef:n,gridSize:15,draftWord:f,setDraftWord:j,draftDirection:l,setDraftDirection:d,currentlySaved:c,saveWordList:function(){o(!0),P((function(e){return e[A]?e.map((function(e,n){return n===A?S:e})):[].concat(Object(O.a)(e),[[]])}))}}),Object(m.jsxs)(De,{children:[Object(m.jsx)(le,{draftWord:f,draftDirection:l,removeWord:function(e){B(S.filter((function(n){return n!==e}))),j(e.word),k(e.clue),d(e.direction)},commitWord:function(e,t){!function(e,n,t,r,c){B((function(o){return Object(w.sortBy)([].concat(Object(O.a)(o),[{x:e,y:n,direction:t,word:r,clue:c}]),(function(e){return e.y}),(function(e){return e.x}))}))}(e,t,l,f,v),j(""),k(""),n.current.focus()},grid:F}),Object(m.jsx)(y,{wordList:S,grid:F,updateClue:function(e,n){B((function(t){return Object(w.sortBy)(t.map((function(t){return t.word===e.word&&t.x===e.x&&t.y===e.y?Object(h.a)(Object(h.a)({},t),{},{clue:n}):t})),(function(e){return e.y}),(function(e){return e.x}))}))},editable:!0})]}),Object(m.jsx)(ie,{wordLists:N,selected:A,saved:c,select:R,remove:function(e){A===e?(E(0),P((function(n){return[].concat(Object(O.a)(n.slice(0,e)),Object(O.a)(n.slice(e+1)))}))):c||alert("Please save before making changes")},duplicate:function(e){A===e?(E(0),P((function(n){return[].concat(Object(O.a)(n.slice(0,e)),Object(O.a)(n.slice(e,e+1)),Object(O.a)(n.slice(e)))}))):c||alert("Please save before making changes")},children:Object(m.jsx)(me,{onClick:function(){R(N.length)},children:"New Crossword"})})]})}function be(e){var n=e.wordList,t=e.gridSize,r=Object(b.useState)("x"),c=Object(g.a)(r,2),o=c[0],i=c[1],a=Object(b.useMemo)((function(){return ce(n,t)}),[n,t]);return Object(m.jsxs)(fe,{children:[Object(m.jsx)(je,{children:Object(m.jsx)(oe,{setDraftDirection:i,draftDirection:o})}),Object(m.jsxs)(De,{children:[Object(m.jsx)(de,{draftDirection:o,grid:a}),Object(m.jsx)(y,{wordList:n,grid:a,editable:!1})]})]})}var fe=v.a.div(C||(C=Object(p.a)(["\n  font-size: 16px;\n"]))),je=v.a.div(D||(D=Object(p.a)(["\n  display: flex;\n  padding: 5px;\n"]))),xe=v.a.div(S||(S=Object(p.a)(["\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  flex-grow: 1;\n"]))),pe=v.a.div(L||(L=Object(p.a)(["\n  display: flex;\n  flex-direction: row;\n  align-items: stretch;\n"]))),he="3px",Oe=v.a.div(z||(z=Object(p.a)(["\n  font-weight: bold;\n  padding: 4px;\n  width: 2em;\n  background: #eee;\n  border: 1px solid #999;\n  border-radius: 0 "," "," 0;\n  border-left: none;\n  color: ",";\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"])),he,he,(function(e){return e.error?"red":e.empty?"#ddd":"#555"})),ge=v.a.input(W||(W=Object(p.a)(["\n  flex-grow: 1;\n  padding: 6px 7px;\n  letter-spacing: 3px;\n  border-radius: "," 0 0 ",";\n  border: 1px solid #999;\n  z-index: 2;\n  ::placeholder,\n  ::-webkit-input-placeholder {\n    color: #ccc;\n    letter-spacing: initial;\n  }\n  :focus {\n    border: 1px solid #1a8fbf;\n    box-shadow: 0 0 1px 2px #1a8fbf;\n    outline: none;\n  }\n"])),he,he),ve=v.a.div(A||(A=Object(p.a)(["\n  text-align: center;\n  margin-left: 10px;\n  min-width: ",";\n"])),(function(e){return e.minWidth||"none"})),we=v.a.span(E||(E=Object(p.a)(["\n  transform: rotate(90deg);\n  display: inline-block;\n"]))),me=v.a.button(H||(H=Object(p.a)(["\n  background: ",";\n  color: ",";\n  border: 1px solid ",";\n  width: ",";\n  border-radius: ",";\n  padding: 7px;\n  cursor: ",";\n  :hover {\n    background: ",";\n  }\n"])),(function(e){return e.selected?"#4cc7f9":e.unclickable?"#ccc":"#eee"}),(function(e){return e.selected?"black":e.unclickable?"#888":"black"}),(function(e){return e.selected?"#1a8fbf":"#ccc"}),(function(e){return e.fullWidth?"100%":"inherit"}),(function(e){return e.rightMost?"0 10px 10px 0":e.leftMost?"10px 0 0 10px":"10px"}),(function(e){return e.unclickable?"default":"pointer"}),(function(e){return e.selected?"#4cc7f9":e.unclickable?"#ccc":"#ddd"})),ye=v.a.div(M||(M=Object(p.a)(["\n  font-color: #999;\n  padding: 5px;\n  font-size: 0.5em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n"]))),ke=v.a.span(N||(N=Object(p.a)(["\n  margin-right: 5px;\n"]))),Ce=v.a.span(P||(P=Object(p.a)(["\n  font-color: #999;\n  padding: 3px 5px 10px ",";\n  display: inline-block;\n  background: #eee;\n\n  height: 0.5em;\n  border: 1px solid #999;\n  font-size: 1em;\n  border-radius: 3px;\n  vertical-align: middle;\n"])),(function(e){return"enter"===e.val?"10px":"5px"})),De=v.a.div(R||(R=Object(p.a)(["\n  display: flex;\n  align-items: stretch;\n"]))),Se=v.a.div(B||(B=Object(p.a)(["\n  display: flex;\n  flex-direction: column;\n  gap: 1px;\n  background: #7b7a87;\n  border: 1px solid #7b7a87;\n"]))),Le=v.a.div(F||(F=Object(p.a)(["\n  display: flex;\n  flex-direction: row;\n  gap: 1px;\n"]))),ze=v.a.div(J||(J=Object(p.a)(["\n  cursor: ",";\n  background: ",";\n"])),(function(e){return e.holdingWord&&!e.placeable?"not-allowed":e.holdingWord?"grabbing":e.interactable?"grab":"default"}),(function(e){return e.modifiable&&e.hover?"#eee":e.hasLetter?"#fff":"black"})),We=v.a.div(U||(U=Object(p.a)(["\n  width: 1.5em;\n  height: 1.5em;\n  text-align: center;\n  position: relative;\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  justify-content: center;\n  text-transform: uppercase;\n"]))),Ae=v.a.div(I||(I=Object(p.a)(["\n  color: ",";\n  font-weight: ",";\n  padding-top: 0.4em;\n  width: 100%;\n  box-sizing: border-box;\n"])),(function(e){return e.error?"red":null}),(function(e){return e.draft?"bold":""})),Ee=v.a.input(q||(q=Object(p.a)(["\n  width: 100%;\n  position: absolute;\n  background: transparent;\n  text-align: center;\n  box-sizing: border-box;\n  top: 0;\n  left: 0;\n  border: 0px;\n  font-size: 1em;\n  padding: 0;\n  padding-top: 0.4em;\n  caret-color: transparent;\n\n  :focus {\n    border: 0px;\n    box-shadow: 0 0 1px 1px #1a8fbf;\n    outline: none;\n    background: #4cc7f9;\n  }\n"]))),He=v.a.span(T||(T=Object(p.a)(["\n  position: absolute;\n  top: 0px;\n  left: 1px;\n  font-size: 0.5em;\n  z-index: 2;\n"]))),Me=v.a.div(K||(K=Object(p.a)(["\n  padding: 10px;\n"]))),Ne=v.a.div(Y||(Y=Object(p.a)(["\n  padding: 10px;\n  background: ",";\n  color: ",";\n  border: 1px solid ",";\n  cursor: ",";\n  :hover {\n    background: ",";\n  }\n"])),(function(e){return e.selected?"#4cc7f9":"#eee"}),(function(e){return e.selected,"black"}),(function(e){return e.selected?"#1a8fbf":"#eee"}),(function(e){return e.selected?"default":"pointer"}),(function(e){return e.selected?"#4cc7f9":"#ddd"})),Pe=v.a.button(G||(G=Object(p.a)(["\n  background: none;\n  border: none;\n  color: #1a8fbf;\n  text-decoration: underline;\n  cursor: pointer;\n  padding: 0px 10px;\n  :hover {\n    color: #fff;\n  }\n"]))),Re=function(){var e=function(){var e=Object(b.useState)(window.location.hash),n=Object(g.a)(e,2),t=n[0],r=n[1];return Object(b.useEffect)((function(){function e(){r(window.location.hash)}return window.addEventListener("hashchange",e),function(){window.removeEventListener("hashchange",e)}}),[]),t}();if(e){var n=JSON.parse(atob(e.slice(1)));return Object(m.jsx)(be,{wordList:n,gridSize:15})}return Object(m.jsx)(ue,{})},Be=function(e){e&&e instanceof Function&&t.e(3).then(t.bind(null,30)).then((function(n){var t=n.getCLS,r=n.getFID,c=n.getFCP,o=n.getLCP,i=n.getTTFB;t(e),r(e),c(e),o(e),i(e)}))};x.a.render(Object(m.jsx)(f.a.StrictMode,{children:Object(m.jsx)(Re,{})}),document.getElementById("root")),Be()}},[[29,1,2]]]);
//# sourceMappingURL=main.a9a4968c.chunk.js.map