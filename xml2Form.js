autoGenId = 0;
legendAutoGenId = 0;
html = '';

function addNewFieldSet(tagName, prevElement) {
	var fieldsetNo = 'fieldsetNo_' +  legendAutoGenId;
	var newElement = document.createElement("fieldset");
	newElement.setAttribute("style", "margin: 10px 20px 10px 20px");
	newElement.setAttribute("tagName", tagName);
	newElement.setAttribute("id", fieldsetNo);
	newElement.innerHTML = '<legend style="font-weight: bold">' + tagName + '</legend>' +
		'<div><button onClick="document.getElementById(\''+fieldsetNo+'\').remove();">-</button></div>' +
		'<div>' +
		'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) nested set</button>' +
		'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) field</button>' +
		'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) attribute</button>' +
		'</div>';
	document.getElementById(prevElement).appendChild(newElement);
	legendAutoGenId += 1;
}

function removeField(elementId) {
	var element = document.querySelector("div[field-id="+elementId+"]");
	element.remove();
}

function addField(currentFieldSetId) {
	autoGenId += 1;
	var inputName = "changeMe";
	var inputValue = "";
	var inputId = 'inputNo_' + autoGenId;

	var newElement = document.createElement("div");
	newElement.setAttribute("style", "margin: 10px 20px 10px 20px");
	newElement.setAttribute("id", inputId);
	newElement.setAttribute("field-id", inputId);
	newElement.innerHTML =
		'<label for="' + inputId + '" style="display: inline-block; width: 150px">' + inputName + '</label>'
		+ '<input id="' + inputId + '" style="width:200px" name="' + inputName + '" type="text" value="' + inputValue + '"></input>'
		+'<button onClick="removeField(\''+inputId+'\')">-</button>';

	document.getElementById(currentFieldSetId).appendChild(newElement);
}

function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
document.addEventListener("DOMContentLoaded", function(){
	
	var parser = new DOMParser();

	document.getElementById('submitter1').addEventListener('click', function() {
		var doc = document.getElementById('xmlDoc').value;
		var xmlDoc = parser.parseFromString(doc,'text/xml');
		var xml = xml2Form(xmlDoc);
		document.getElementById('result').innerHTML = xml;
	});

	document.getElementById('submitter2').addEventListener('click', function() {
		var htmlForm = document.getElementById('result').firstElementChild;
		//debugger;
		var xml = form2Xml(htmlForm);

		var xmlDoc = parser.parseFromString(xml,'text/xml');
		var xmlText = new XMLSerializer().serializeToString(xmlDoc);
		document.getElementById('xmlResult').value = formatXML(xmlText, '  ');
	});

	function xml2Form(xmlDoc) {
		if (xmlDoc.documentElement.childNodes.length > 0) {
			xml_to_html(xmlDoc.documentElement);
		}

		function xml_to_html(xmlElem) {
			if (!xmlElem) {
				return;
			}
			legendAutoGenId += 1;
			if (xmlElem.firstElementChild) {
				var fieldsetNo = 'fieldsetNo_' +  legendAutoGenId;
				html += '<fieldset id="' + fieldsetNo + '" contenteditable="true" style="margin: 10px 20px 10px 20px" tagName="' + xmlElem.nodeName + '">' +
					'<legend for="'+ fieldsetNo +'" style="font-weight: bold">' + xmlElem.nodeName + '</legend>';

				html += '<div>' +
					'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) nested set</button>' +
					'<button onclick="addField(\'' + fieldsetNo +'\')">(+) field</button>' +
					'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) attribute</button>' +
					'<button onClick="document.getElementById(\''+fieldsetNo+'\').remove();">-</button>' +
					'</div>';

				var atts = xmlElem.attributes;
				if (atts.length > 0) {
					html += '<div class="atts">'
					for (var att, i = 0, atts, n = atts.length; i < n; i++){
						att = atts[i];
						html += '<div class="attrField">'
						html += '<label contenteditable="true" for="' + att.nodeName + '" style="padding-right: 10px">' + att.nodeName + '</label>';
						html += '<input name="' + att.nodeName + '" value="'+ att.nodeValue + '"></input>';
						html += '</div>';
					}
					html += '</div>'
				}
				xml_to_html(xmlElem.firstElementChild);
				html += '</fieldset>';
				if (xmlElem.nextElementSibling) {
					xml_to_html(xmlElem.nextElementSibling);
				}
			} else {
				html += generateInput(xmlElem.nodeName, xmlElem.innerHTML);
				if (xmlElem.nextElementSibling) {
					xml_to_html(xmlElem.nextElementSibling);
				}
			}
		}
		return html;
	}

	function generateInput(inputName, inputValue) {
		autoGenId += 1;
		var inputId = 'inputNo_' + autoGenId;
		var input = '<div class="field" field-id="'+ inputId +'" tagName="' + inputName + '">'
					+ '<label for="' + inputId + '" style="display: inline-block; width: 150px">' + inputName + '</label>'
					+ '<input id="' + inputId + '" style="width:200px" name="' + inputName + '" type="text" value="' + inputValue + '"></input>'
					+'<button onClick="removeField(\''+inputId+'\')">-</button>'
					+'</div>';
		return input;
	}

	function form2Xml(htmlForm) {
		var xml = '';
		if (htmlForm.childNodes.length > 0) {
			html_to_xml(htmlForm);
		}
		function html_to_xml(htmlForm) {
			if (!htmlForm) {
				return;
			}

			if (htmlForm.firstElementChild) {
				// skip to next tag if element is attribute list input
				if (htmlForm.getAttribute('class') == 'atts') {
					html_to_xml(htmlForm.nextElementSibling);
					return;
				}
				var tagName = getTagName(htmlForm);

				if (tagName != "") {
					xml += '<' + tagName;

					// get attributes list input of current element
					var atts = null;

					if (htmlForm.firstElementChild) {
						atts = htmlForm.firstElementChild.nextElementSibling;
					}
					if (atts && atts.getAttribute('class') == 'atts') {
						atts.childNodes.forEach((element, index) => {
							xml += ' ' + element.children[1].getAttribute("name") + '="' + element.children[1].getAttribute("value") +'"';
						});
					}

					xml += '>';
					html_to_xml(htmlForm.firstElementChild);

					xml += '</' + tagName + '>';
				}

				if (htmlForm.nextElementSibling) {
					html_to_xml(htmlForm.nextElementSibling);
				}

			} else {
				if (htmlForm.nextElementSibling) {
					html_to_xml(htmlForm.nextElementSibling);
				}
				if (htmlForm.nodeName == 'LABEL' || htmlForm.nodeName == 'LEGEND') {
					return xml;
				}
				xml += escapeHtml(htmlForm.value);
			}
		}
		return xml;
	}

	function getTagName(element) {
		var tagName = "";
		if (element.tagName == "DIV"  && element.getAttribute("class") == "field") {
			tagName = element.querySelector('label[for="' + element.getAttribute('field-id') +'"]').outerText;
		} else if (element.tagName == "FIELDSET") {
			tagName = element.querySelector('LEGEND[for="' + element.getAttribute('id') +'"]').outerText;
		}
		return tagName;
	}

	function formatXML(xml, tab) {
		var nl = '\n';
		var formatted = '', indent = '';
		const nodes = xml.slice(1, -1).split(/>\s*</);
		if (nodes[0][0] == '?') {
			formatted += '<' + nodes.shift() + '>' + nl;
		}
		for (let i = 0; i < nodes.length; i++) {
			const node = nodes[i];
			if (node[0] == '/') {
				indent = indent.slice(tab.length);
			}
			formatted += indent + '<' + node + '>' + nl;
			if (node[0] != '/' && node[node.length - 1] != '/' && node.indexOf('</') == -1) {
				indent += tab;
			}
		}
		return formatted;
	}

	function escapeHtml(unsafe) {
		if (unsafe) {
			return unsafe
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;")
				.replace(/"/g, "&quot;")
				.replace(/'/g, "&#039;");
		}
		return '';
	}
});
