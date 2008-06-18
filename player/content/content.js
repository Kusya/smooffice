var presentation1 = {
    title: "Demo presentation",
    author: "The french team",
    description: "This presentation is a demo of our <i>presentation player</i>.",
    creation_date: new Date(2008, 3, 20),

    master : {
		p: {
			backgroundColor: '#888',
			color: 'white'
		},
        t: [
			{
                f: 'slide',
				direction: 'down'
            },{
                f: 'slide',
				direction: 'up'
            }
		],
        e: {
		},
        a: {
			f: 'fade'
		}
    },
	slide: [
		{
			t: [
				null,
				null
			],
            e: [
                {

                    t: "h3",
                    c: "What's next in<br/>jQuery and JavaScript?",
					p: {
						width: '75%',
						height: '20%',
						top: '65%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "h4",
                    c: "John Resig - May 2008",
					p: {
						width: '40%',
	                    height: '13%',
	                    top: '87%',
	                    left: '5%',
						fontSize: '50%'
					}
                }
            ],
            a: [
                {
                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {

                    t: "video",
                    c: "http://www.youtube.com/v/c2pmVwFryV8",
					p: {
						width: '56%',
						height: '56%',
						top: '5%',
	                    left: '5%'
					}
                }
            ],
            a: [
                {
                    o: 0
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {
                    t: "h3",
                    c: "jQuery: Next",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}

                },
				{

                    t: "ul",
                    c: 	"<li>jQuery Core<ul><li><small>1.2.4 and 1.3</small></li></ul></li>"+
						"<li>jQuery UI<ul><li><small>1.5</small></li></ul></li>"+
						"<li><strong>jQuery Project</strong></li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'

					}
                }
            ],

            a: [
                {
                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [

                {

                    t: "h3",
                    c: "jQuery Core: 1.2.4",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}

                },

				{
                    t: "ul",
                    c: 	"<li>Coming Mid-May</li>"+
						"<li>Merging Dimensions.js</li>"+
						"<li>Speed Improvements:<ul><li>Event Handlers</li><li>Drag &amp; Drop - 3x faster</li></ul></li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}

                }
            ],
            a: [
                {
                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],

            e: [
                {
                    t: "h3",
                    c: "jQuery Core: 1.3",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "ul",
                    c: 	"<li>Coming this Summer</li>"+
						"<li>Speed Improvements:<ul><li>Selector Engine</li><li>DOM manipulation</li></ul></li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}
                }
            ],
            a: [

                {

                    o: 0
                },
                {
                    o: 1


                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {
                    t: "h3",
                    c: "jQuery UI: 1.5",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "ul",
                    c: 	"<li>Complete Overhaul of 1.0</li>"+
						"<li>Tons of demos, examples</li>"+
						"<li>New web site</li>"+
						"<li>Enchant<ul><li>Brand new</li><li>Animation library</li></ul></li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}
                }
            ],
            a: [

                {
                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {

                    t: "h3",
                    c: "jQuery: Project",
					p: {

						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{

                    t: "ul",
                    c: 	"<li>Fall jQuery Conference</li>"+
						"<li>New logo/brand<ul><li>T-shirts</li></ul></li>"+
						"<li>New web site</li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'

					}
                }

            ],
            a: [
                {
                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {
                    t: "h3",
                    c: "Browsers: Next",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "ul",
                    c: 	"<li>Speed Improvements:<ul><li>getElementsByClassName</li><li>querySelectorAll</li></ul></li>"+
						"<li>ARIA (Accessible Ajax)</li>"+
						"<li>CSS 3 (Finally have :not()!)</li>"+
						"<li>postMessage()</li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}
                }

            ],
            a: [
                {

                    o: 0
                },
                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {
                    t: "h3",
                    c: "JavaScript 1.9",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "ul",
                    c: 	"<li>More JavaScript 2</li>"+
						"<li>No syntax changes</li>"+
						"<li>CSS 3 (Finally have :not()!)</li>"+
						"<li>Low-hanging fruit:<ul><li>Native JSON</li><li>Function.prototype.bind</li><li>ISO Date() parsing</li></ul></li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}
                }
            ],
            a: [
                {
                    o: 0

                },

                {
                    o: 1
                }
            ]
        },
		{
			t: [
				null,
				null
			],
            e: [
                {
                    t: "h3",
                    c: "What to fix?",
					p: {
						width: '90%',
						height: '15%',
						top: '5%',
	                    left: '5%',
						fontSize: '150%'
					}
                },
				{
                    t: "ul",
                    c: 	"<li>Standards Need Help<ul><li>Build on library precedent</li><li>Optimize for usability</li></ul></li>"+
						"<li>Need &lt;video/&gt; and &lt;audio/&gt; codecs</li>",
					p: {
						width: '80%',
	                    height: '70%',
	                    top: '20%',
	                    left: '10%'
					}

                }

            ],
            a: [
                {
                    o: 0
                },
                {
                    o: 1
                }
            ]

        }
	]
};