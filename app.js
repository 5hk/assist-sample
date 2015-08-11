// requirejs configuration
requirejs.config({
    paths: {
        'text': 'lib/text/text'
    }
});

// main
require([
    'text!templates/scriptservice-syntax.json',
    'text!templates/messageformat-sample.json',
    'text!templates/javascript-snippet.json'
], function(serviceSyntax, messageFormatSyntax, snippet) {
    'use strict';

    // To Do Modification
    function convert2MsgFormat(messageSample) {
        var msg = JSON.parse(messageSample);
        var convertMsg = {
            "!name": "messageCode",
        }

        for (var i in msg.meta.childList) {
            var data = msg.meta.childList[i];

            convertMsg['$' + data.nickname + '$'] = {
                "!type": data.type || '',
                "!doc": data.desc || ''
            }
        }

        return convertMsg;
    }

    // Below CodeMirror

    function passAndHint(cm) {
        setTimeout(function() {
            cm.execCommand('autocomplete');
        }, 100);
        return CodeMirror.Pass;
    }

    function myHint(cm) {
        return CodeMirror.showHint(cm, CodeMirror.ternHint, {
            async: true
        });
    }

    CodeMirror.commands.autocomplete = function(cm) {
        CodeMirror.showHint(cm, myHint);
    }

    var editor = CodeMirror.fromTextArea(document.querySelector('#code'), {
        mode: 'javascript',
        theme: "monokai",
        styleActiveLine: true,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        extraKeys: {
            "'.'": passAndHint,
            "Ctrl-Space": "autocomplete",
            "Ctrl-I": function(cm) {
                CodeMirror.tern.getServer(cm).showType(cm);
            }
        },
        gutters: ["CodeMirror-linenumbers"]
    });

    CodeMirror.tern.addDef(JSON.parse(serviceSyntax));
    CodeMirror.tern.addDef(convert2MsgFormat(messageFormatSyntax));
    CodeMirror.templatesHint.addTemplates(JSON.parse(snippet));
});
