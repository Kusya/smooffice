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
					fontSize: '200%'
				},
				ul: {
					color: 'white',
					fontSize: '120%'
				}
			}
		}
	},
	slide: [{
        t: [null, null],
        p: {
			backgroundColor: 'black',
			color: 'white'
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
	            t: 'span',
	            c: '',
	            p: {
	                top: '50%',
	                left: '10%',
	                width: '80%',
	                height: '1%',
	                backgroundColor: '#808080'
	            }
	        }, 
			e2: {
	        
	            t: "h2",
	            c: "jQuery",
	            p: {
	                top: '39%',
					left: '0%',
	                width: '100%',
	                fontSize: '250%',
	                textAlign: 'center'
	            }
	        }, 
			e3: {
	            t: "p",
	            c: 	"BostonPHP - June 2008<br/>" +
	            	"John Resig (ejohn.org)",
	            p: {
	                top: '55%',
	                width: '100%',
	                textAlign: 'center'
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
	                top: '10%',
	                left: '10%',
	                fontSize: '200%'
	            }
	        }, 
			e1: {
	            t: "ul",
	            c: 	"<li>An open source JavaScript library that<br />"+
	  				"simplifies the interaction between HTML<br />"+
					"and JavaScript.",
	            p: {
	                top: '26%',
	                left: '10%'
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
	                top: '10%',
	                left: '10%',
	                fontSize: '200%'
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
	                top: '26%',
	                left: '10%'
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
    }]
};