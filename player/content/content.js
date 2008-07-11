var presentation1 = {
    title: "Demo presentation",
    author: "The french team",
    description: "This presentation is a demo of our <i>presentation player</i>.",
    creation_date: new Date(2008, 3, 20),
    master: {
		t: [{
            f: 'slide',
            direction: 'down'
        }, {
            f: 'slide',
            direction: 'up'
        }],			
		m1: {
			p: {
				backgroundColor: 'black'
			},
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
					color: 'white',
					fontSize: '160%',
					fontClass: 'G',
					top: '10%',
					left: '10%'
				},
				ul: {
					color: 'white',
					fontClass: 'G',
					top: '26%',
					left: '10%'
				}
			}
		}
	},
	slide: [{
        t: [null, null],
        p: {
			backgroundColor: 'black'
		},
		e: {
			ea: {
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
	        },
			e0: {
	            t: 'img',
	            c: {
					src: 'content/media/tQuery_logo.gif'
				},
	            p: {
	                top: '33%',
	                left: '19%',
	                width: '14%'
	            }
	        },
			e1: {
	            t: 'img',
	            c: {src: 'content/media/greyline.png'},
	            p: {
	                top: '50%',
	                left: '10%',
	                width: '80%',
	                height: '0.3%'
	            }
	        }, 
			e2: {
	        
	            t: "h2",
	            c: "jQuery",
	            p: {
	                top: '39%',
					left: '0%',
	                width: '100%',
	                fontSize: '230%',
	                textAlign: 'center',
					color: 'white',
					fontClass: 'A'
	            }
	        }, 
			e3: {
	            t: "p",
	            c: 	"BostonPHP - June 2008<br/>" +
	            	"John Resig (ejohn.org)",
	            p: {
	                top: '55%',
	                width: '100%',
	                textAlign: 'center',
					color: 'white',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'ea'
        },{
            o: 'e0'
        },{
            o: 'e1'
        }, {
            o: 'e2'
        }, {
            o: 'e3'
        }]
    }, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "What is jQuery?",
	            p: {
	            }
	        }, 
			e1: {
	            t: "ul",
	            c: 	"<li>An open source JavaScript library that<br />"+
	  				"simplifies the interaction between HTML<br />"+
					"and JavaScript.",
	            p: {
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
    }, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Keep Clean",
	            p: {
	            }
	        }, 
			e1: {
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
	        }
		},
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
        e: {
			e0: {        
	            t: "h2",
	            c: "Learn with screencasts",
	            p: {
	            }
	        }, 
			e1: {
	            t: "ul",
	            c: 	"http://www.youtube.com/v/8mwKq7_JlS8",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'G'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}, {
        m: 'm1',
		t: [null, null],
        e: {
			e0: {        
	            t: "h2",
	            c: "Test",
	            p: {
	            }
	        }, 
			e1: {
	            t: "p",
	            c: 	"Hello",
	            p: {
	                top: '26%',
	                left: '20%',
					width: '60%',
					height: '60%',
					fontClass: 'A'
	            }
	        }
		},
        a: [{
            o: 'e0'
        }, {
            o: 'e1'
        }]
	}]
};