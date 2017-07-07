$.fn.counter = function(options) {
	return this.each(function() {
		var element = $(this);

		var settings = $.extend({
			start: 0,
			end : null,
			timer : 2000 
		},options);

		var countStart = settings.start ?  parseInt(element.data('start')) : settings.start;
		var countEnd = settings.end == null ?  parseInt(element.data('end')) : settings.end;
		var timer = element.data('timer') ?  parseInt(element.data('timer')) : settings.timer;
		var delay =  timer/((countStart < countEnd) ? (countEnd - countStart)/5: (countStart - countEnd)/5) ;

		var counter = function() {
			if(countStart < countEnd){
				countStart = countStart+ 5;
				element.text(countStart);
			}else {
				element.text(countEnd);
				clearInterval(t);
				return;
			}


		}

		

		var t =setInterval(counter, delay);
	});

};		

