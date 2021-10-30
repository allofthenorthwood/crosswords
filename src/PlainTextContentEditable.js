function PlainTextContentEditable({ value, onChange }) {
    let [tick, setTick] = useState(0);
    let ref = useRef(null);
  
    useEffect(() => {
      let div = ref.current;
      if (div.textContent !== value) {
        div.textContent = value;
      }
    }, [tick, value]);
  
    function handleChange(e) {
      let div = ref.current;
      let selection = window.getSelection().getRangeAt(0);
  
      let before = document.createRange();
      before.setStart(div, 0);
      before.setEnd(selection.startContainer, selection.startOffset);
  
      let after = document.createRange();
      after.setStart(selection.endContainer, selection.endOffset);
      after.setEnd(div, div.childNodes.length);
  
      let beforeText = before.toString();
      let selectionText = selection.toString();
      let afterText = after.toString();
  
      div.textContent = '';
      div.append(document.createTextNode(beforeText));
      let selectionTextNode = document.createTextNode(selectionText);
      div.append(selectionTextNode);
      div.append(document.createTextNode(afterText));
      selection.selectNode(selectionTextNode);
  
      setTick((tick) => tick + 1);
      onChange(beforeText + selectionText + afterText);
    }
    return <div contentEditable="true" onInput={handleChange} ref={ref}></div>;
  }
  