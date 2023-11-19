autoGenId = 0;
legendAutoGenId = 0;
html = '';
attrAutoGenId = 0;
jsonObject = {};
xmlString = '';

function addNewFieldSet(tagName, prevElement) {
	var fieldsetNo = 'fieldsetNo_' +  legendAutoGenId;
	var newElement = document.createElement("fieldset");
	newElement.setAttribute("style", "margin: 10px 20px 10px 20px");
	newElement.setAttribute("tagName", tagName);
	newElement.setAttribute("id", fieldsetNo);
	newElement.setAttribute("class", "fieldset");
	newElement.innerHTML = '<legend for="'+ fieldsetNo +'" style="font-weight: bold"><span>' + tagName + '</span>' +
	'<div>' +
	'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) set</button>' +
	'<button onclick="addField(\'' + fieldsetNo +'\')">(+) field</button>' +
	'<button onclick="addFieldSetAttribute(\'' + fieldsetNo +'\')">(+) attr</button>' +
	'<button onClick="document.getElementById(\''+fieldsetNo+'\').remove();">-</button>' +
	'</div>'+
	'</legend>' +

		'<div class="atts" fieldset-id="'+ fieldsetNo +'">' +
		'</div>';
	document.getElementById(prevElement).appendChild(newElement);
	legendAutoGenId += 1;
}

function clear() {
	autoGenId = 0;
	legendAutoGenId = 0;
	html = '';
}

function removeField(elementId) {
	var element = document.querySelector("div[field-id="+elementId+"]");
	element.remove();
}

function removeAttrFieldSet(elementId) {
	var element = document.querySelector("div[attrFieldSet-id="+elementId+"]");
	element.remove();
}

function removeAttrField(elementId) {
	var element = document.querySelector("div[attrField-id="+elementId+"]");
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
	newElement.setAttribute("class", "field");
	newElement.innerHTML =
		'<label for="' + inputId + '" style="display: inline-block; width: 150px">' + inputName + '</label>'
		+ '<input id="' + inputId + '" style="width:200px" name="' + inputName + '" type="text" value="' + inputValue + '"></input>'
		+'<div class="fieldBtnGroup">'
		+ '<button onclick="addFieldAttribute(\'' + inputId +'\')">(+) attr</button>'
		+'<button onClick="removeField(\''+inputId+'\')">-</button>'
	+'</div>'
	+'<div class="atts" field-id="'+ inputId +'"></div>';

	document.getElementById(currentFieldSetId).appendChild(newElement);
}

function addFieldSetAttribute(currentFieldSetId) {
	var element = document.querySelector("div[fieldset-id="+currentFieldSetId+"]");
	var newElement = document.createElement("div");
	newElement.setAttribute("class", "attrFieldSet");
	newElement.setAttribute("attrFieldSet-id", currentFieldSetId );
	newElement.innerHTML =
	'<label contenteditable="true" for="attrFieldSet_' + attrAutoGenId + '" style="padding-right: 10px">changeMe</label>'+
	'<input name="attrFieldSet_' + attrAutoGenId + '" value=""></input>' +
	'<button onClick="removeAttrFieldSet(\''+currentFieldSetId+'\')">-</button>';
	element.appendChild(newElement);
	attrAutoGenId++;
}

function addFieldAttribute(currentFieldId) {
	var element = document.querySelector("div[field-id="+currentFieldId+"][class=atts]");

	var newElement = document.createElement("div");
	newElement.setAttribute("class", "attrField");
	newElement.setAttribute("attrField-id", currentFieldId );
	newElement.innerHTML =
		'<label contenteditable="true" for="attrField_' + attrAutoGenId + '" style="padding-right: 10px">changeMe</label>'+
		'<input name="attrField_' + attrAutoGenId + '" value=""></input>' +
		'<button onClick="removeAttrField(\''+currentFieldId+'\')">-</button>';
	element.appendChild(newElement);
	attrAutoGenId++;
}

function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
document.addEventListener("DOMContentLoaded", function(){
	
	var parser = new DOMParser();

	if (document.getElementById('submitter1')) {
		document.getElementById('submitter1').addEventListener('click', function() {
			var doc = document.getElementById('xmlDoc').value;
			var xmlDoc = parser.parseFromString(doc,'text/xml');
			var xml = xml2Form(xmlDoc);
			document.getElementById('result').innerHTML = xml;
		});
	}

	if (document.getElementById('submitter2')) {
		document.getElementById('submitter2').addEventListener('click', function () {
			var htmlForm = document.getElementById('result').firstElementChild;
			//debugger;
			var xml = form2Xml(htmlForm);

			var xmlDoc = parser.parseFromString(xml, 'text/xml');
			var xmlText = new XMLSerializer().serializeToString(xmlDoc);
			document.getElementById('xmlResult').value = formatXML(xmlText, '  ');
		});
	}

	if (document.getElementById('xmlToJson')) {
		document.getElementById('xmlToJson').addEventListener('click', function() {
			var doc = document.getElementById('xmlDoc').value;
			var xmlDoc = parser.parseFromString(doc,'text/xml');
			var json = xml2json(xmlDoc);

			//var result = combineSameKeyToArray(json)
			document.getElementById('jsonResult').value = JSON.stringify(JSON.parse(json));
		});
	}

	if (document.getElementById('jsonToXmlBtn')) {
		document.getElementById('jsonToXmlBtn').addEventListener('click', function() {
			var doc = document.getElementById('jsonInput').value;
			var jsonObject = JSON.parse(doc);
			var xml = json2xml(jsonObject);

			//var result = combineSameKeyToArray(json)
			document.getElementById('xmlResult').value = xmlString;
		});
	}
	if (document.getElementById('json2formbtn')) {
		document.getElementById('json2formbtn').addEventListener('click', function() {
			var doc = document.getElementById('jsonInput').value;
			json2Form(doc);
			document.getElementById('jsonFormResult').innerHTML = html;
		});
	}

	if (document.getElementById('form2jsonbtn')) {
		document.getElementById('form2jsonbtn').addEventListener('click', function () {
			var htmlForm = document.getElementById('jsonFormResult').firstElementChild;
			//debugger;
			var jsonString = form2Json(htmlForm);
			document.getElementById('jsonFromFormResult').value = jsonString;
		});
	}



	function xml2Form(xmlDoc) {
		clear();

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
					'<legend for="'+ fieldsetNo +'" style="font-weight: bold"><span>' + xmlElem.nodeName+'</span>';

				html += '<div style="display: inline-block">' +
					'<button onclick="addNewFieldSet(\'' + "changeMyName\'" +", \'" + fieldsetNo +'\')">(+) set</button>' +
					'<button onclick="addField(\'' + fieldsetNo +'\')">(+) field</button>' +
					'<button onclick="addFieldSetAttribute(\'' + fieldsetNo +'\')">(+) attr</button>' +
					'<button onClick="document.getElementById(\''+fieldsetNo+'\').remove();">-</button>' +
					'</div>'+
					'</legend>';



				var atts = xmlElem.attributes;
				html += '<div class="atts" fieldset-id="'+ fieldsetNo +'">'
				if (atts.length > 0) {

					for (var att, i = 0, atts, n = atts.length; i < n; i++){
						att = atts[i];
						html += '<div class="attrFieldSet" attrFieldSet-id="'+ fieldsetNo +'">'
						html += '<label contenteditable="true" for="' + att.nodeName + '" style="padding-right: 10px">' + att.nodeName + '</label>';
						html += '<input name="' + att.nodeName + '" value="'+ att.nodeValue + '"></input>';
						html += '<button onClick="removeAttrFieldSet(\''+fieldsetNo+'\')">-</button>';
						html += '</div>';
					}

				}
				html += '</div>'
				xml_to_html(xmlElem.firstElementChild);
				html += '</fieldset>';
				if (xmlElem.nextElementSibling) {
					xml_to_html(xmlElem.nextElementSibling);
				}
			} else {
				html += generateInput(xmlElem);
				if (xmlElem.nextElementSibling) {
					xml_to_html(xmlElem.nextElementSibling);
				}
			}
		}
		return html;
	}

	function xml2json(xmlDoc) {
		clear();
		jsonObject = '{'
		if (xmlDoc.documentElement.nodeName == 'jsonRoot' && xmlDoc.documentElement.childNodes.length > 0) {

			xml_to_json(xmlDoc.documentElement.firstElementChild);
		} else if (xmlDoc.documentElement.nodeName != 'jsonRoot' && xmlDoc.documentElement.childNodes.length > 0) {
			xml_to_json(xmlDoc.documentElement);
		}

		function handleArrayChild(xmlElem, isLastChild) {

			if (xmlElem.firstElementChild) {
					jsonObject += ' { ';
					xml_to_json(xmlElem.firstElementChild);
					if (!isLastChild) {
						if (jsonObject && jsonObject.charAt(jsonObject.length - 1) != ',') {
							jsonObject += ',';
						}

					}
			} else {
				jsonObject += generateJsonArrayElement(xmlElem);
			}
		}

		function xml_to_json(xmlElem) {
			if (!xmlElem) {

				return;
			}
			if (xmlElem.firstElementChild) {
				if (isArray(xmlElem)) {
					jsonObject += '"' + xmlElem.nodeName + '": [ ';
					var index = 0;
					for (let child in xmlElem.children) {
						debugger;
						var isLastChild = index == xmlElem.children.length - 1;
						handleArrayChild(xmlElem.children[child], isLastChild);
						if (index == xmlElem.children.length - 1) {
							break;
						}
						index++;
					}
					jsonObject += ']';
					jsonObject += '}';
					if (xmlElem.parentElement && xmlElem.parentElement.nextElementSibling) {
						jsonObject += ',';
					}

				} else {
					jsonObject += '"' + xmlElem.nodeName + '": { ';
					xml_to_json(xmlElem.firstElementChild);
					if (xmlElem.nextElementSibling) {

						xml_to_json(xmlElem.nextElementSibling);

					} else {
						jsonObject += '}';
					}
				}

			} else {

					jsonObject += generateJsonField(xmlElem);
					if (xmlElem.nextElementSibling) {
						xml_to_json(xmlElem.nextElementSibling);
					} else {
						jsonObject += '}';
						if (xmlElem.parentElement && xmlElem.parentElement.nextElementSibling) {
							jsonObject += ',';
						}
						return;
					}


			}
		}
		return jsonObject;
	}

	function form2Json(htmlForm) {
		var xmlString = form2Xml(htmlForm);
		var xmlDoc = parser.parseFromString(xmlString,'text/xml');
		return xml2json(xmlDoc);
	}

	function json2xml(data) {

		json_to_xml('jsonRoot', data);
		function json_to_xml(key, data) {
			if (Array.isArray(data)) {
				xmlString += '<' + key + '>'
				debugger;
				for (const property in data) {
					json_to_xml('item', data[property]);
				}
				xmlString += '</' + key + '>'
			} else if (data instanceof Object) {
				xmlString +='<' + key + '>'
				debugger;
				for (const property in data) {
					json_to_xml(property, data[property]);
				}
				xmlString +='</' + key + '>'
			} else {
				xmlString +='<' + key + '>' + data + '</' + key + '>'
				console.log(data);
			}
		}
	}

	function json2Form(jsonString) {
		var jsonObject = JSON.parse(jsonString);
		json2xml(jsonObject);
		var xmlDoc = parser.parseFromString(xmlString,'text/xml');
		xml2Form(xmlDoc);
	}

	function generateJsonArrayElement(xmlElem) {
		var fieldValue = xmlElem.innerHTML;
		var fieldName = xmlElem.nodeName;
		var input = '';
		if (xmlElem.nextElementSibling) {
			input = '"' + fieldValue + '",'
		} else {
			input = '"' + fieldValue + '"'
		}
		return input;
	}

	function isArray(xmlElem) {
		var childList = xmlElem.children;
		if (childList && childList.length > 1 && childList[0].nodeName == childList[childList.length-1].nodeName) {
			return true;
		}
		return false;
	}

	function generateJsonField(xmlElem) {
		var fieldValue = xmlElem.innerHTML;
		var fieldName = xmlElem.nodeName;
		var input = '';
		if (xmlElem.nextElementSibling) {
			input = '"' + fieldName + '":"' + fieldValue + '",'
		} else {
			input = '"' + fieldName + '":"' + fieldValue + '"'
		}

		return input;
	}

	function generateInput(xmlElem) {
		var inputValue = xmlElem.innerHTML;
		var inputName = xmlElem.nodeName;
		autoGenId += 1;
		var inputId = 'inputNo_' + autoGenId;
		var input = '<div class="field" field-id="'+ inputId +'" tagName="' + inputName + '">'
					+ '<label for="' + inputId + '" style="display: inline-block; width: 150px">' + inputName + '</label>'
					+ '<input id="' + inputId + '" style="width:200px" name="' + inputName + '" type="text" value="' + inputValue + '"></input>'
			+'<div class="fieldBtnGroup">'
			+ '<button onclick="addFieldAttribute(\'' + inputId +'\')">(+) attr</button>'
			+'<button onClick="removeField(\''+inputId+'\')">-</button>'
			+'</div>';

		var atts = xmlElem.attributes;
		var attrhtml = '<div class="atts" field-id="'+ inputId +'">'
		if (atts.length > 0) {
			for (var att, i = 0, atts, n = atts.length; i < n; i++){
				att = atts[i];
				attrhtml += '<div class="attrField" attrField-id="'+inputId+'">'
				attrhtml += '<label contenteditable="true" for="' + att.nodeName + '" style="padding-right: 10px">' + att.nodeName + '</label>';
				attrhtml += '<input name="' + att.nodeName + '" value="'+ att.nodeValue + '"></input>';
				attrhtml += '<button onClick="removeAttrField(\''+inputId+'\')">-</button>';
				attrhtml += '</div>';
			}
		}
		attrhtml += '</div>'
		input += attrhtml;
		input += '</div>';
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

					if (htmlForm.tagName == "FIELDSET" && htmlForm.firstElementChild) {
						atts = htmlForm.firstElementChild.nextElementSibling;
					} else if (htmlForm.childNodes[3] && htmlForm.childNodes[3].getAttribute("class") == ("atts")) {
						atts = htmlForm.childNodes[3];
					}
					if (atts && atts.getAttribute('class') == 'atts') {
						atts.childNodes.forEach((element, index) => {
							xml += ' ' + element.children[0].outerText + '="' + element.children[1].getAttribute("value") +'"';
							console.log(element.children[1].nodeName);
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
			tagName = element.querySelectorAll('LEGEND[for="' + element.getAttribute('id') +'"] > span')[0].outerText;
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
