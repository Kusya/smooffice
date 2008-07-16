var presentation1 = {
    title: "Demo presentation",
    author: "The french team",
    description: "This presentation is a demo of our <i>presentation player</i>.",
    creation_date: new Date(2008, 3, 20),
    master: {
		t: [{
            f: 'scale',
            scale: 'textbox'
        }, {
            f: 'scale',
            scale: 'textbox'
        }],
		m1: {
			b: [{
	            t: 'img',
	            c: {
					src: 'content/media/bg.png'
				},
	            p: {
	                top: '0%',
	                left: '0%',
	                width: '100%',
	                height: '100%'
	            }
	        }, {
	            t: 'img',
	            c: {src: 'content/media/greyline.png'},
	            p: {
	                top: '19%',
	                left: '10%',
	                width: '80%',
	                height: '0.3%'
	            }
	        }],
			e: {
				h2: {
					color: '#fff',
					fontSize: '160%',
					fontClass: 'G',
					top: '10%',
					left: '10%'
				},
				ul: {
					color: '#fff',
					fontClass: 'G',
					top: '26%',
					left: '10%'
				}
			}
		},
		m2: {
			b: [{
	            t: 'img',
	            c: {
					src: 'content/media/bg.png'
				},
	            p: {
	                top: '0%',
	                left: '0%',
	                width: '100%',
	                height: '100%'
	            }
	        },{
	            t: 'img',
	            c: {src: 'content/media/greyline.png'},
	            p: {
	                top: '50%',
	                left: '10%',
	                width: '80%',
	                height: '0.3%'
	            }
	        }],
			e: {
				h2: {
					color: '#fff',
					fontClass: 'G',
					fontSize: '230%',
					textAlign: 'center',
					top: '37%',
					left: '10%',
					width: '80%'
				},
				p: {
					color: '#fff',
					fontClass: 'G',
					textAlign: 'center',
					top: '55%',
					left: '20%',
					width: '60%'
				}
			}
		},
		m3: {
			b: [{
	            t: 'img',
	            c: {
					src: 'content/media/bg.png'
				},
	            p: {
	                top: '0%',
	                left: '0%',
	                width: '100%',
	                height: '100%'
	            }
	        }],
			e: {
				p: {
					color: '#fff',
					fontClass: 'G',
					fontSize: '180%',
					textAlign: 'center',
					top: '15%',
					left: '10%',
					width: '80%'
				},
				span: {
					color: '#fff',
					fontClass: 'V',
					width: '80%'
				}
			}
		}
	},
	slide: [{
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "google map test!",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "map",
	            c: 	{x: 0, y: 0, zoom: 14},
	            p: {
                    top: '20%',
                    left: '20%',
                    width: '60%',
                    height: '60%'
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
    }, {
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "youtube test!",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "video",
	            c: 	{
                    src: "http://www.youtube.com/v/iDuo1_PyO-4",
                    img: "http://i.ytimg.com/vi/iDuo1_PyO-4/default.jpg"
                },
	            p: {
                    top: '20%',
                    left: '20%',
                    width: '60%',
                    height: '60%'
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
    }, {
        m: 'm2',
		t: [null, null],
        p: {},
		e: [{
				i: 'e0',
	            t: 'img',
	            c: {
					src: 'content/media/tQuery_logo.gif'
				},
	            p: {
	                top: '37%',
	                left: '19%',
	                width: '11%'
	            }
	        }, {
	        	i: 'e2',
	            t: "h2",
	            c: "jQuery",
	            p: {
	            }
	        }, {
				i: 'e3',
	            t: "p",
	            c: 	"BostonPHP - June 2008<br/>" +
	            	"John Resig (ejohn.org)",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e2'
        }, {
            o: 'e3'
        }]
    }, {
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "What is jQuery?",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "ul",
	            c: 	"<li>An open source JavaScript library that<br />"+
	  				"simplifies the interaction between HTML<br />"+
					"and JavaScript.",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
    }, {
		t: [null, null],
		p: {},
        e: [{
				i: 'e00',
	            t: 'img',
	            c: {
					src: 'content/media/bg.png'
				},
	            p: {
	                top: '0%',
	                left: '0%',
	                width: '100%',
	                height: '100%'
	            }
	        }, {
				i: 'e0',
	            t: "h2",
	            c: "The Focus of jQuery",
	            p: {
					color: '#fff',
					fontSize: '180%',
					fontClass: 'G',
					textAlign: 'center',
					top: '15%',
					left: '10%',
					width: '80%'
	            }
	        }, {
				i: 'ea',
	            t: 'img',
	            c: {src: 'content/media/greyline.png'},
	            p: {
	                top: '35%',
	                left: '30%',
	                width: '40%',
	                height: '0.3%'
	            }
	        }, {
				i: 'e1',
	            t: "p",
	            c: 	"Find Some Elements.",
	            p: {
					color: '#fff',
					fontClass: 'G',
					fontSize: '90%',
	                top: '45%',
	                left: '10%',
					width: '50%'
	            }
	        }, {
				i: 'e10',
	            t: "p",
	            c: 	"Do something with them",
	            p: {
					color: '#fff',
					fontClass: 'G',
					fontSize: '90%',
	                top: '45%',
	                left: '47%',
					width: '50%'
	            }
	        }, {
				i: 'e2',
	            t: "p",
	            c: 	"$('div').addClass('special');",
	            p: {
					color: '#fff',
					fontClass: 'G',
					fontSize: '150%',
					textAlign: 'center',
	                top: '55%',
	                left: '10%',
					width: '80%'
	            }
	        }, {
				i: 'e3',
	            t: "p",
	            c: 	"jQuery Object",
	            p: {
					color: '#fff',
					fontClass: 'G',
	                top: '70%',
	                left: '20%',
					width: '80%'
	            }
	        }, {
				i: 'eb',
	            t: 'img',
	            c: {src: 'content/media/closure.png'},
	            p: {
	                top: '51%',
	                left: '17%',
	                width: '15%',
	                height: '5%'
	            }
	        }, {
				i: 'ec',
	            t: 'img',
	            c: {src: 'content/media/closure.png'},
	            p: {
	                top: '51%',
	                left: '53%',
	                width: '15%',
	                height: '5%'
	            }
	        }, {
				i: 'ef',
	            t: 'img',
	            c: {src: 'content/media/arrow.png'},
	            p: {
	                top: '64%',
	                left: '16%',
	                width: '4%',
	                height: '8%'
	            }
	        }],
        a: [{
            o: 'e00'
        },{
            o: 'e0'
        }, {
            o: 'ea'
        }, {
            o: 'e2',
			n: 'click'
        }, {
            o: 'e1',
			p: {
				f: 'puff'
			}
        }, {
			o: 'eb',
			p: {
				f: 'fade'
			},
			n: 'click'
		}, {
            o: 'e10',
			p: {
				f: 'puff'
			}
        }, {
			o: 'ec',
			p: {
				f: 'fade'
			},
			n: 'click'
		}, {
            o: 'e3',
			p: {
				f: 'puff'
			}
        }, {
			o: 'ef',
			p: {
				f: 'fade'
			}
		}]
	}, {
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "Keep Clean",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "ul",
	            c: 	"<li>jQuery can rename '$':<br />"+
	  				"var $jq = jQuery.noConflict();<br/>"+
					"$jq(“div”).hide();"+
					"<li>jQuery can even rename 'jQuery' allowing<br />"+
					"multiple copies to run side-by-side."+
					"<li>var $a = jQuery.noConflict(true);<br/>"+
					"// load other version of jQuery"+
					"$a(“div”).hide(); // still works!",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1',
			f: 'li:eq(2)',
			p: 'hide'
        }, {
            o: 'e1',
			n: 'click'
        }, {
            o: 'e1',
			f: 'li:eq(2)',
			p: {
				f: 'fade'
			}
        }]
    }, {
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "Find Some Elements",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "ul",
	            c: 	"<li>Full CSS 1-3 Support"+
					"<li>Better CSS Support than most browsers",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm3',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "p",
	            c: "$('div')",
	            p: {
	            }
	        }, {
				i: 'e1',
	            t: "p",
	            c: "$('#body')",
	            p: {
	            }
	        }, {
				i: 'e2',
	            t: "p",
	            c: "$('div.contents p')",
	            p: {
	            }
	        }, {
				i: 'e3',
	            t: "p",
	            c: "$('#body > div')",
	            p: {
	            }
	        }, {
				i: 'e4',
	            t: "p",
	            c: "$('div[class]')",
	            p: {
	            }
	        }, {
				i: 'e5',
	            t: "p",
	            c: "$('div:has(div)')",
	            p: {
	            }
	        }, {
				i: 'e6',
				t: "span",
				c: '&lt;div id="body"&gt;',
				p: {
					top: '35%',
					left: '25%'
				}
			}, {
				i: 'e7',
				t: "span",
				c: '&lt;/div&gt;',
				p: {
					top: '83%',
					left: '25%'
				}
			}, {
				i: 'e8',
				t: "span",
				c: '&lt;h2&gt;Some Header&lt;/h2&gt;',
				p: {
					top: '43%',
					left: '31%'
				}
			}, {
				i: 'e9',
				t: "span",
				c: '&lt;div class="contents"&gt;',
				p: {
					top: '51%',
					left: '31%'
				}
			}, {
				i: 'e10',
				t: "span",
				c: '&lt;/div&gt;',
				p: {
					top: '75%',
					left: '31%'
				}
			}, {
				i: 'e11',
				t: "span",
				c: '&lt;p&gt;...&lt;/p&gt;',
				p: {
					top: '59%',
					left: '37%'
				}
			}, {
				i: 'e12',
				t: "span",
				c: '&lt;p&gt;...&lt;/p&gt;',
				p: {
					top: '67%',
					left: '37%'
				}
			}],
        a: [{
            o: 'e6'
        },{
            o: 'e8'
        },{
            o: 'e9'
        },{
            o: 'e10'
        },{
            o: 'e11'
        },{
            o: 'e12'
        }, {
            o: 'e7',
			n: 'click'
        }, {
            o: 'e0',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e6',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e9',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e10',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e7',
			p: {
				color: '#ff00c5'
			},
			n: 'click'
        }, {
            o: 'e0',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e6',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e9',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e10',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e7',
			p: {
				color: '#fff'
			},
			n: 0
        }, {
            o: 'e1',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e6',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e7',
			p: {
				color: '#ff00c5'
			},
			n: 'click'
        }, {
            o: 'e1',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e6',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e7',
			p: {
				color: '#fff'
			},
			n: 0
        }, {
            o: 'e2',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e11',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e12',
			p: {
				color: '#ff00c5'
			},
			n: 'click'
        }, {
            o: 'e2',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e11',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e12',
			p: {
				color: '#fff'
			},
			n: 0
        }, {
            o: 'e3',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e9',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e10',
			p: {
				color: '#ff00c5'
			},
			n: 'click'
        }, {
            o: 'e3',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e9',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e10',
			p: {
				color: '#fff'
			},
			n: 0
        }, {
            o: 'e4',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e9',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e10',
			p: {
				color: '#ff00c5'
			},
			n: 'click'
        }, {
            o: 'e4',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e9',
			p: {
				color: '#fff'
			}
        }, {
            o: 'e10',
			p: {
				color: '#fff'
			},
			n: 0
        }, {
            o: 'e5',
			p: { f: 'puff' },
			n: 0
        }, {
            o: 'e6',
			p: {
				color: '#ff00c5'
			}
        }, {
            o: 'e7',
			p: {
				color: '#ff00c5'
			}
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: [{
				i: 'e0',
	            t: "h2",
	            c: "Do something with them",
	            p: {
	            }
	        }, {
	            i: 'e1',
	            t: "ul",
	            c: 	"<li>DOM Manipulation <span style=\"font-size:80%\">(append, prepend, remove)</span>"+
					"<li>Events <span style=\"font-size:80%\">(click, hover, toggle)</span>"+
					"<li>Effects <span style=\"font-size:80%\">(hide, show, slideDown, fadeOut)</span>"+
					"<li>AJAX <span style=\"font-size:80%\">(load, get, post)</span>",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: [{
	            i: 'e0',
	            t: "h2",
	            c: "DOM Manipulation",
	            p: {
	            }
	        }, {
	            i: 'e1',
	            t: "ul",
	            c: 	"<li><ul>$('a[target=_blank]')"+
					"<li style=\"list-style-type: none; font-size: 100%;\">.append('&lt;img src=\"new.png\"/&gt;');</ul>"+
					"<li><ul>$('#body').css({"+
					"<li style=\"list-style-type: none; font-size: 100%;\">border: '1px solid green',"+
					"<li style=\"list-style-type: none; font-size: 100%;\">height: '40px'</ul>"+
					"<li style=\"list-style-type: none;\">});",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: [{
	            i: 'e0',
	            t: "h2",
	            c: "Events",
	            p: {
	            }
	        }, {
	            i: 'e1',
	            t: "ul",
	            c: 	"<li><ul>$('form').submit(function() {"+
					"<li style=\"list-style-type: none; font-size: 100%;\"><ul>if ($('input#name').val() == '' {"+
					"<li style=\"list-style-type: none; font-size: 100%;\">$('span.help').show();"+
					"<li style=\"list-style-type: none; font-size: 100%;\">return false;</ul>"+
					"<li style=\"list-style-type: none; font-size: 100%;\">}</ul>"+
					"<li style=\"list-style-type: none;\">});"+
					"<li><ul>$('a#open').click(function() {"+
					"<li style=\"list-style-type: none; font-size: 100%;\">$('#menu').show();"+
					"<li style=\"list-style-type: none; font-size: 100%;\">return false;</ul>"+
					"<li style=\"list-style-type: none;\">});",
	            p: {
	            }
	        }],
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}]
};