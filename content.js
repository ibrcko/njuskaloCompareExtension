chrome.extension.onMessage.addListener(function (message) {
    if (message.type = 'poruka') {

        var query = findXpath("(//tbody/tr/td)[1]") + "+" + findXpath("(//tbody/tr/td)[2]");


        chrome.runtime.sendMessage({query:query});


    }
});

function findXpath(pXpath) {


    var evalResult = document.evaluate(pXpath, document, null, 0, null);
    var resultValue = '';
    switch (evalResult.resultType) {
        case 1:
            resultValue = evalResult.numberValue.toString();
            break;
        case 2:
            resultValue = evalResult.stringValue;
            break;
        case 3:
            resultValue = evalResult.booleanValue.toString();
            break;
        default:
            var selectedNode = evalResult.iterateNext();
            if (!selectedNode) {
                return null;
            } else if (selectedNode.textContent) {
                resultValue = selectedNode.textContent;
            } else if (selectedNode.innerText) {
                resultValue = selectedNode.innerText;
            } else if (selectedNode.value) {
                resultValue = selectedNode.value;
            } else if (selectedNode.text) {
                resultValue = selectedNode.text;
            } else {
                return null;
            }
    }
    return resultValue.replace(/[\t\r\n ]+/gim, ' ').replace(/^[\t\r\n ]+|[\t\r\n ]+$/gim, '');
}

