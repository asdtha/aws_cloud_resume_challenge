(function($) {

	var $window = $(window),
		$body = $('body'),
		$header = $('#header'),
		$titleBar = null,
		$nav = $('#nav'),
		$wrapper = $('#wrapper');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '1025px',  '1280px' ],
			medium:   [ '737px',   '1024px' ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ],
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Tweaks/fixes.

		// Polyfill: Object fit.
			if (!browser.canUse('object-fit')) {

				$('.image[data-position]').each(function() {

					var $this = $(this),
						$img = $this.children('img');

					// Apply img as background.
						$this
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', $this.data('position'))
							.css('background-size', 'cover')
							.css('background-repeat', 'no-repeat');

					// Hide img.
						$img
							.css('opacity', '0');

				});

			}

	// Header Panel.

		// Nav.
			var $nav_a = $nav.find('a');

			$nav_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$nav_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '5vh',
							bottom: '5vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($nav_a.filter('.active-locked').length == 0) {

										$nav_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		// Title Bar.
			$titleBar = $(
				'<div id="titleBar">' +
					'<a href="#header" class="toggle"></a>' +
					'<span class="title">' + $('#logo').html() + '</span>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$header
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right',
					target: $body,
					visibleClass: 'header-visible'
				});

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				if (breakpoints.active('<=medium'))
					return $titleBar.height();

				return 0;

			}
		});

})(jQuery);

//counter

const counter = document.querySelector(".counter");
async function updateCounter(){
	let response = await fetch("https://dv7ndtqitop4l7r6ypgpmakptm0mvuer.lambda-url.us-east-1.on.aws/");
 	let data = await response.json();
 	counter.innerHTML = `${data}`;
 }
 updateCounter();

//const counter = document.getElementById("viewCount");

// async function updateCounter() {
//   try {
//     let response = await fetch("https://dv7ndtqitop4l7r6ypgpmakptm0mvuer.lambda-url.us-east-1.on.aws/");
//     let data = await response.json();
//     counter.textContent = data;
//   } catch (error) {
//     counter.textContent = "Error fetching data";
//   }
// }

updateCounter();

const textElement = document.getElementById('dynamicText');
		const textsToType = ["Cloud Engineer", "AWS SAA", "DevOps Engineer"];
		let textIndex = 0;
		let charIndex = 0;
		let isDeleting = false;

		function typeText() {
			const currentText = textsToType[textIndex];

			if (isDeleting) {
				textElement.innerHTML = currentText.substring(0, charIndex);
				if (charIndex > 1) {
					charIndex--;
					setTimeout(typeText, 150);
				} else {
					isDeleting = false;
					textIndex = (textIndex + 1) % textsToType.length;
					setTimeout(typeText, 150);
				}
			} else {
				textElement.innerHTML = currentText.substring(0, charIndex + 1);
				if (charIndex < currentText.length) {
					charIndex++;
					setTimeout(typeText, 150);
				} else {
					isDeleting = true;
					setTimeout(typeText, 150);
				}
			}
		}

		typeText();
