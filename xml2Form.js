autoGenId = 0;

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
		document.getElementById('xmlResult').value = formatXML(xmlText, '	');
	});

	function xml2Form(xmlDoc) {
		var html = '';
		if (xmlDoc.documentElement.childNodes.length > 0) {
			xml_to_html(xmlDoc.documentElement);
		}
		function xml_to_html(xmlElem) {
			if (!xmlElem) {
				return;
			}
			if (xmlElem.firstElementChild) {
				html += '<fieldset style="margin: 10px 20px 10px 20px" tagName="' + xmlElem.nodeName + '"><legend style="font-weight: bold">' + xmlElem.nodeName + '</legend>';
				var atts = xmlElem.attributes;
				if (atts.length > 0) {
					html += '<div class="atts">'
					for (var att, i = 0, atts, n = atts.length; i < n; i++){
						att = atts[i];
						html += '<div class="attrField">'
						html += '<label for="' + att.nodeName + '" style="padding-right: 10px">' + att.nodeName + '</label>';
						html += '<input name="' + att.nodeName + '" value="'+ att.nodeValue + '">';
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
		var input = '<div class="field" tagName="' + inputName + '">'
					+ '<label for="inputNo_' + autoGenId + '" style="display: inline-block; width: 150px">' + inputName + '</label>'
					+ '<input id="inputNo_' + autoGenId + '" style="float: right; width:300px" name="' + inputName + '" type="text" value="' + inputValue + '">'
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

				xml += '<' + htmlForm.getAttribute('tagName');

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
				xml += '</' + htmlForm.getAttribute('tagName') + '>';
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