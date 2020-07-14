$('#terminal').on('keyup', '.user_input', function(e) {
	if (e.keyCode == 13) {
		index = -2;
		indexChanged = false;
		var values = $(this).val().trim().split(' ');
		$(this).attr('disabled', 'disabled');
		if (values[0] == '') {
			appendResponse('Fill command first!');
			appendInput();
		} else {
			if (values[0] == 'open') {
				setAction(2, 'openLink', values[1]);
			} else if (values[0] == 'search') {
				let keyword = values[1].replace('-', ' ');
				setAction(2, 'search', keyword);
			} else if (values[0] == 'say') {
				setAction(2, 'appendResponse', values[1]);
			} else if (values[0] == 'look') {
				sendAjax('api/index.php', {
					job: values[0],
					table: values[1]
				}, 2, "title");
			} else if (values[0] == 'look_at') {
				sendAjax('api/index.php', {
					job: values[0],
					table: values[1],
					keyword: values[2]
				}, 3, "title|description");
			} else if (values[0] == 'clear') {
				setAction(1, 'clear');
			} else {
				appendResponse('"'+values[0]+'" is not recognized as an internal command!');
				appendInput();
			}
		}
	}

	function setAction(length, action, params) {
		if (values.length == length) {
			switch(action) {
				case 'openLink':
					appendResponse('Opening...');
					openLink(params);
					break;
				case 'appendResponse':
					appendResponse(params);
					break;
				case 'clear':
					clear();
					break;
				case 'search':
					appendResponse('Searching...');
					appendResponse('Opening...');
					search(params);
					break;
				default:
					appendResponse(params);
			}
			appendInput();
		} else {
			if (action !== 'clear') {
				appendResponse('"'+values[0]+'" Expects parameter '+ (length - 1) +' to be resource!');
				appendInput();
			}
		}
	}

	function sendAjax(url, data, length, params, delimiter = " - ") {
		if (values.length == length) {
			$.post(url, data, function(result) {
					for (let i = 0; i < result.length; i++) {
						switch(params) {
							case "title":
								appendResponse(result[i].title);
								break;
							case "title|description":
								appendResponse(result[i].title + delimiter + result[i].description);
								break;
							case "description":
								appendResponse(result[i].description);
								break;
						}
					}
					appendInput();
				}
			);
		} else {
			appendResponse('"'+values[0]+'" Expects parameter '+ (length - 1) +' to be resource!');
			appendInput();
		}
	}
});

function appendResponse(message) {
	$('#terminal').append(`
			<div class="bot_output">`+message+`</div>
	`);
}

function appendInput() {
	$('#terminal').append(`
		<span>$admin : <input class="user_input" placeholder="_" autofocus></span>
	`);
	$('.user_input').focus();
}

function openLink(link) {
	window.open("http://"+link, '_blank');
}

function search(keyword) {
	window.open("https://www.google.com/search?q=" + keyword, '_blank');
}

let index = -2;
indexChanged = false;

$('#terminal').keydown(function(e) {
	if (e.keyCode == 38) {
		travelDom('-');
		indexChanged = true;
	} else if (e.keyCode == 40) {
		travelDom('+');
	}
});

function travelDom(sign) {
	if (indexChanged == true && sign == '+') {
		index++;
	} else if (indexChanged == true && sign == '-') {
		index--;
	}
	data = $('.user_input').eq(index).val();
	$('.user_input').last().val(data)
	indexChanged = true;
}

function clear() {
	userInputLength = $('span').length;
	for (let i = -2; i >= -userInputLength; i--) {
		$('span').eq(i).hide();
	}
	botOutputLength = $('.bot_output').length;
	for (let i = -1; i >= -botOutputLength; i--) {
		$('.bot_output').eq(i).hide();
	}
}
