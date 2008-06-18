var presentation1 = {
    title: "Demo presentation",
    author: "The french team",
    description: "This presentation is a demo of our <i>presentation player</i>.",
    creation_date: new Date(2008, 3, 20),
    slide: [
        { 
            transition: [
				{ 
	                fx: 'fade'
	            },{ 
	                fx: 'slide'
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}                  
                }            
            ] 
        },
		{
            transition: [
				{
	                fx: 'slide'
	            },{
	                fx: 'drop'
	            }
			],
            animation: [
                {
                    on_element: 0
                },
                {
                    on_element: 1
                }
            ],
            element: [
                {
                    type: "presentation_title",
                    content: "This is the title of our demo presentation",
					property: {
						width: 90,
	                    height: 25,
	                    top: 25,
	                    left: 5
					}
                },
				{
                    type: "presentation_subtitle",
                    content: "A presentation by the French team !",
					property: {
						width: 70,
	                    height: 25,
	                    top: 55,
	                    left: 15
					}
                }
            ]
        },
		{
            transition: [
				{
	                fx: 'drop'
	                
	            },{
	                fx: 'fade'
	                
	            }
			],
            animation: [
                {
                    on_element: 0
                }
            ],
            element: [
                {
                    type: "presentation_title",
                    content: "This is the title of our demo presentation",
					property: {
						width: 90,
	                    height: 25,
	                    top: 25,
	                    left: 5
					}
                }
            ]
        },
		{
            transition: [
				{
	                fx: 'blind'
	            },{
	                fx: 'clip'
	            }
			],
            animation: [
                {
                    on_element: 0
                },
                {
                    on_element: 1
                }
            ],
            element: [
                {
                    type: "presentation_title",
                    content: "This is the title of our demo presentation",
					property: {
						width: 90,
	                    height: 25,
	                    top: 25,
	                    left: 5
					}
                },
				{
                    type: "presentation_subtitle",
                    content: "A presentation by the french team !",
					property: {
						width: 70,
	                    height: 25,
	                    top: 55,
	                    left: 15
					}
                }
            ]
        },
		{
            transition: [
				{
	                fx: 'clip'
	            },{
	                fx: 'drop'
	            }
			],
            animation: [
                {
                    on_element: 0
                }
            ],
            element: [
                {
                    type: "presentation_title",
                    content: "This is the title of our demo presentation",
					property: {
						width: 90,
	                    height: 25,
	                    top: 25,
	                    left: 5
					}
                }
            ]
        },
		{ 
            transition: [
				{ 
	                fx: 'drop'
	            },{ 
	                fx: 'fold'
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }, 
                { 
                    on_element: 1
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}
                },
				{ 
                    type: "presentation_subtitle", 
                    content: "A presentation by the french team !",
					property: {
						width: 70, 
	                    height: 25, 
	                    top: 55, 
	                    left: 15
					}          
                }               
            ] 
        },
		{ 
            transition: [
				{ 
	                fx: 'fold'
	            },{ 
	                fx: 'scale'
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}        
                }            
            ] 
        },
		{ 
            transition: [
				{ 
	                fx: 'scale'
	            },{ 
	                fx: 'slide'
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }, 
                { 
                    on_element: 1
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}       
                },
				{ 
                    type: "presentation_subtitle", 
                    content: "A presentation by the french team !",
					property:{
						width: 70, 
	                    height: 25, 
	                    top: 55, 
	                    left: 15
					}         
                }               
            ] 
        },
		{ 
            transition: [
				{ 
	                fx: 'slide'
	            },{ 
	                fx: 'puff'
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}        
                }            
            ] 
        },
		{ 
            transition: [
				{ 
	                fx: 'puff'
	            },{ 
	                fx: "fade"
	            }
			], 
            animation: [ 
                { 
                    on_element: 0
                }, 
                { 
                    on_element: 1
                }
            ], 
            element: [ 
                { 
                    type: "presentation_title", 
                    content: "This is the title of our demo presentation",
					property: {
						width: 90, 
	                    height: 25, 
	                    top: 25, 
	                    left: 5
					}        
                },
				{ 
                    type: "presentation_subtitle", 
                    content: "A presentation by the french team !",
					property: {
						width: 70, 
	                    height: 25, 
	                    top: 55, 
	                    left: 15
					}          
                }               
            ] 
        }
    ] 
};