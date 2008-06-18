class ImportSlides < ActiveRecord::Migration
	def self.up
		Presentation.create(:title => 'First presentation',
							:description => 'It is the first presentation, there is not slide yet',
							:parent_id => '-1',
							:last_order => 1,
							:author => 1)
		Order.create(:json => "[{\"id\":\"slide-1\"},{\"id\":\"slide-2\"},{\"id\":\"slide-3\"},{\"id\":\"slide-4\"}]",
					 :of_presentation => 1)
           
    Slide.create(:in_presentation => 1,
           :last_content => 1,
           :original_slide => true)
    Slide.create(:in_presentation => 1,
           :last_content => 2,
           :original_slide => true)
    Slide.create(:in_presentation => 1,
           :last_content => 3,
           :original_slide => true)
    Slide.create(:in_presentation => 1,
           :last_content => 4,
           :original_slide => true)
           
    #Presentation 1
    Content.create(:json => '{"comment":"","animation":[{"effect":null,"hsa":1,"parameters":{},"on_element":0,"next_on":null}],"transition":[{"effect":"fold","parameters":{}},{"effect":"clip","parameters":{}}],"element":[{"type":"text","content":"<h3>This is the title of our demo presentation</h3>","top":"5.28%","left":"0.59%","height":"3.44%","width":"58.31%"},{"type":"text","content":"Slide 1","top":"1.32%","left":"0.79%","height":"2.5%","width":"28.1%"},{"type":"image","url":"http://farm4.static.flickr.com/3176/2571457016_064561db6a.jpg","top":"12.81%","left":"9.6%","height":"80.94%","width":"80.56%"}]}',
             :of_slide => 1)
    Content.create(:json => '{"comment":"","animation":[],"transition":[],"element":[{"type":"image","url":"http://farm4.static.flickr.com/3090/2571183758_73ef817ba6.jpg","top":"32.73%","left":"37.67%","height":"54.06%","width":"61.12%"},{"type":"image","url":"http://farm4.static.flickr.com/3104/2568572631_a74c308311.jpg","top":"1.99%","left":"1.36%","height":"28.75%","width":"15.93%"},{"type":"image","url":"http://farm4.static.flickr.com/3090/2567875694_06c1b68af9.jpg","top":"32.55%","left":"1.36%","height":"30.94%","width":"34.89%"},{"type":"image","url":"http://farm4.static.flickr.com/3269/2567240040_9fa3002e7e.jpg","top":"2.19%","left":"18.43%","height":"28.13%","width":"28.34%"},{"type":"text","content":"<font id=\"ext-gen811\" size=\"5\">impressive</font>","top":"11.56%","left":"59.02%","height":"20%","width":"37.94%"},{"type":"text","content":"<font size=\"4\">creative</font>","top":"71.25%","left":"11.01%","height":"10.63%","width":"19.2%"}]}',
             :of_slide => 2)
    Content.create(:json => '{"comment":"","animation":[{"effect":null,"hsa":1,"parameters":{},"on_element":0,"next_on":null}],"transition":[{"effect":"fold","parameters":{}},{"effect":"clip","parameters":{}}],"element":[{"type":"text","content":"<h3>This is the title of our demo presentation</h3>","top":"6.69%","left":"32.93%","height":"4.86%","width":"33.49%"},{"type":"text","content":"<div id=\"ext-gen859\" align=\"center\">Title of our wonderful photos !!!<br></div>","top":"73.25%","left":"17.31%","height":"9.42%","width":"68.56%"},{"type":"image","url":"http://farm4.static.flickr.com/3079/2567882736_4f179f9064.jpg","top":"13.77%","left":"68.29%","height":"23.1%","width":"25.74%"},{"type":"image","url":"http://farm4.static.flickr.com/3081/2571373465_1466d964ee.jpg","top":"40%","left":"3.11%","height":"24.32%","width":"24.83%"},{"type":"image","url":"http://farm4.static.flickr.com/3030/2567910845_bcb629bbe8.jpg","top":"20.55%","left":"29.2%","height":"38.3%","width":"38.5%"}]}',
             :of_slide => 3)
    Content.create(:json => '{"comment":"","animation":[],"transition":[],"element":[{"type":"text","content":"&nbsp;<font color=\"#0000ff\">Voici</font> une <font color=\"#ff0000\">super</font> <i>Google</i> <b>Map</b><br>","top":"2.09%","left":"26.17%","height":"5.63%","width":"37.94%"},{"type":"map","top":"10%","left":"10%","height":"80%","width":"79.86%"}]}',
             :of_slide => 4)
             
             
            
            
    Presentation.create(:title => 'Demo presentation',
              :description => 'This presentation is a demo of our <i>presentation player</i>.',
              :parent_id => '-1',
              :last_order => 2,
			  :author => 1)
              
		Order.create(:json => "[{\"id\":\"slide-4\"},{\"id\":\"slide-5\"},{\"id\":\"slide-6\"}]",
					 :of_presentation => 2)
           
    Slide.create(:in_presentation => 2,
           :last_content => 4,
           :original_slide => true)
    Slide.create(:in_presentation => 2,
           :last_content => 5,
           :original_slide => true)
    Slide.create(:in_presentation => 2,
           :last_content => 6,
           :original_slide => true)
          
     
    #Presentation 2
    Content.create(:json => '{
      t: [
        null,
        null
      ],
            e: [
                {
                    t: "h3",
                    c: "What\'s next in<br/>jQuery and JavaScript?",
          p: {
            width: "90%",
            height: "20%",
            top:"65%",
            left: "5%",
            fontSize: "150%"
          }
                },
        {
                    t: "h4",
                    c: "John Resig - May 2008",
          p: {
            width: "40%",
            height: "13%",
            top: "87%",
            left: "5%",
            fontSize: "50%"
          }
                }
            ],
            a: [
                {
                    on_element: 0
                },
                {
                    on_element: 1
                }
            ]
        }',
             :of_slide => 2)
    Content.create(:json => '{
      t: [
        {
          fx: "explode"
        },
        null
      ],
            e: [
                {
                    t: "h3",
                    c: "jQuery: Next",
          p: {
            width: "90%",
            height:"15%",
            top: "5%",
                      left: "5%",
            fontSize: "150%"
          }
                },
        {
                    t: "ul",
                    c:  "<li>jQuery Core<ul><li><small>1.2.4 and 1.3</small></li></ul></li>"+
            "<li>jQuery UI<ul><li><small>1.5</small></li></ul></li>"+
            "<li><strong>jQuery Project</strong></li>",
          p: {
            width: "80%",
                      height: "70%",
                      top: "20%",
                      left: "10%"
          }
                }
            ],
            a: [
                {
                    on_element: 0
                },
                {
                    on_element: 1
                }
            ]
        }',
             :of_slide => 2)
    Content.create(:json => '{
      t: [
        null,
        null
      ],
            e: [
                {
                    t: "h3",
                    c: "jQuery Core: 1.2.4",
          p: {
            width: "90%",
            height: "15%",
            top: "5%",
                      left: "5%",
            fontSize: "150%"
          }
                },
        {
                    t: "ul",
                    c:  "<li>Coming Mid-May</li>"+
            "<li>Merging Dimensions.js</li>"+
            "<li>Speed Improvements:<ul><li>Event Handlers</li><li>Drag &amp; Drop - 3x faster</li></ul></li>",
          p: {
            width: "80%",
                      height: "70%",
                      top: "20%",
                      left: "10%"
          }
                }
            ],
            a: [
                {
                    on_element: 0
                },
                {
                    on_element: 1
                }
            ]
        }',
             :of_slide => 2)
             
             
	end

	def self.down
	end
end
