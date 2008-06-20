class ImportSlides < ActiveRecord::Migration
  def self.up
    Presentation.create(:title => 'First presentation',
    :description => 'It is the first presentation, there is not slide yet',
    :parent_id => '-1',
    :last_order => 1,
    :author => 4)
    Order.create(:json => '[{"id":"slide-1"},{"id":"slide-2"},{"id":"slide-3"},{"id":"slide-4"},{"id":"slide-5"}]',
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
    Slide.create(:in_presentation => 1,
                 :last_content => 5,
                 :original_slide => true)
    
    #Presentation 1
    Content.create(:json => '{"c":"","t":[null,null],"a":[{"o":0},{"o":1}],"e":[{"t":"h3","c":"This is the title of our demo presentation","p":{"top":"5.28%","left":"0.59%","height":"3.44%","width":"58.31%"}},{"t":"p","c":"Slide 1","p":{"top":"1.32%","left":"0.79%","height":"2.5%","width":"28.1%"}},{"t":"img","c":"http://farm4.static.flickr.com/3176/2571457016_064561db6a.jpg","p":{"top":"12.81%","left":"9.6%","height":"80.94%","width":"80.56%"}}]}',
    :of_slide => 1)
    Content.create(:json => '{"c":"","t":[null,null],"a":[{"o":0},{"o":1}],"e":[{"t":"img","c":"http://farm4.static.flickr.com/3090/2571183758_73ef817ba6.jpg","p":{"top":"32.73%","left":"37.67%","height":"54.06%","width":"61.12%"}},{"t":"img","c":"http://farm4.static.flickr.com/3104/2568572631_a74c308311.jpg","p":{"top":"1.99%","left":"1.36%","height":"28.75%","width":"15.93%"}},{"t":"img","c":"http://farm4.static.flickr.com/3090/2567875694_06c1b68af9.jpg","p":{"top":"32.55%","left":"1.36%","height":"30.94%","width":"34.89%"}},{"t":"img","c":"http://farm4.static.flickr.com/3269/2567240040_9fa3002e7e.jpg","p":{"top":"2.19%","left":"18.43%","height":"28.13%","width":"28.34%"}},{"t":"p","c":"<font id=\"ext-gen811\" size=\"5\">impressive</font>","p":{"top":"11.56%","left":"59.02%","height":"20%","width":"37.94%"}},{"t":"p","c":"<font size=\"4\">creative</font>","p":{"top":"71.25%","left":"11.01%","height":"10.63%","width":"19.2%"}}]}',
    :of_slide => 2)
    Content.create(:json => '{"c":"","t":[null,null],"a":[{"o":0},{"o":1}],"e":[{"t":"h3","c":"This is the title of our demo presentation","p":{"top":"6.69%","left":"32.93%","height":"4.86%","width":"33.49%"}},{"t":"p","c":"<div id=\"ext-gen859\" align=\"center\">Title of our wonderful photos !!!<br></div>","p":{"top":"73.25%","left":"17.31%","height":"9.42%","width":"68.56%"}},{"t":"img","c":"http://farm4.static.flickr.com/3079/2567882736_4f179f9064.jpg","p":{"top":"13.77%","left":"68.29%","height":"23.1%","width":"25.74%"}},{"t":"img","c":"http://farm4.static.flickr.com/3081/2571373465_1466d964ee.jpg","p":{"top":"40%","left":"3.11%","height":"24.32%","width":"24.83%"}},{"t":"img","c":"http://farm4.static.flickr.com/3030/2567910845_bcb629bbe8.jpg","p":{"top":"20.55%","left":"29.2%","height":"38.3%","width":"38.5%"}}]}',
    :of_slide => 3)
    Content.create(:json => '{"c":"","t":[null,null],"a":[{"o":0},{"o":1}],"e":[{"t":"h3","c":"&nbsp;<font color=\"#0000ff\">Voici</font> une <font color=\"#ff0000\">super</font> <i>Google</i> <b>Map</b><br>","p":{"top":"2.09%","left":"26.17%","height":"5.63%","width":"37.94%"}},{"t":"map","c":{"markers":[],"center":{"x":3.33984375,"y":48.04870994288686},"zoom":5},"p":{"top":"9.48%","left":"9.61%","height":"81.01%","width":"80.65%"}}]}',
    :of_slide => 4)
    Content.create(:json => '{"c":"","t":[null,null],"a":[{"o":0},{"o":1}],"e":[{"t":"p","c":"<p></p><p>En <font id=\"ext-gen662\" size=\"3\">exclusivité</font>, la <b>naissance</b> d\'une <font color=\"#339966\" size=\"3\">highland</font> cow<br></p>","p":{"top":"4.3%","left":"19.54%","height":"7.85%","width":"59.2%"}},{"t":"video","c":"http://www.youtube.com/v/4S_kyBhsv4U","p":{"top":"15.29%","left":"4.31%","height":"80.76%","width":"92.03%"}}]}',
    :of_slide => 5)
    
    
    
    
    Presentation.create(:title => 'Demo presentation',
    :description => 'This presentation is a demo of our <i>presentation player</i>.',
    :parent_id => '-1',
    :last_order => 2,
    :author => 2)
    
    Order.create(:json => '[{"id":"slide-6"},{"id":"slide-7"},{"id":"slide-8"},{"id":"slide-9"},{"id":"slide-10"},{"id":"slide-11"},{"id":"slide-12"},{"id":"slide-13"},{"id":"slide-14"},{"id":"slide-15"}]',
    :of_presentation => 2)
    
    Slide.create(:in_presentation => 2,
                 :last_content => 6,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 7,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 8,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 9,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 10,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 11,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 12,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 13,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 14,
                 :original_slide => true)
    Slide.create(:in_presentation => 2,
                 :last_content => 15,
                 :original_slide => true)
    
    #Presentation 2
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"What\'s next in<br/>jQuery and JavaScript?","p":{"width":"75%","height":"20%","top":"65%","left":"5%","fontSize":"150%"}},{"t":"h4","c":"John Resig - May 2008","p":{"width":"40%","height":"13%","top":"87%","left":"5%","fontSize":"50%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 6)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"video","c":"http://www.youtube.com/v/c2pmVwFryV8","p":{"width":"56%","height":"56%","top":"5%","left":"5%"}}],"a":[{"o":0}]}',
    :of_slide => 7)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"jQuery: Next","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>jQuery Core<ul><li><small>1.2.4 and 1.3</small></li></ul></li><li>jQuery UI<ul><li><small>1.5</small></li></ul></li><li><strong>jQuery Project</strong></li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 8)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"jQuery Core: 1.2.4","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Coming Mid-May</li><li>Merging Dimensions.js</li><li>Speed Improvements:<ul><li>Event Handlers</li><li>Drag &amp; Drop - 3x faster</li></ul></li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 9)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"jQuery Core: 1.3","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Coming this Summer</li><li>Speed Improvements:<ul><li>Selector Engine</li><li>DOM manipulation</li></ul></li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 10)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"jQuery UI: 1.5","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Complete Overhaul of 1.0</li><li>Tons of demos, examples</li><li>New web site</li><li>Enchant<ul><li>Brand new</li><li>Animation library</li></ul></li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 11)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"jQuery: Project","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Fall jQuery Conference</li><li>New logo/brand<ul><li>T-shirts</li></ul></li><li>New web site</li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 12)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"Browsers: Next","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Speed Improvements:<ul><li>getElementsByClassName</li><li>querySelectorAll</li></ul></li><li>ARIA (Accessible Ajax)</li><li>CSS 3 (Finally have :not()!)</li><li>postMessage()</li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 13)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"JavaScript 1.9","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>More JavaScript 2</li><li>No syntax changes</li><li>CSS 3 (Finally have :not()!)</li><li>Low-hanging fruit:<ul><li>Native JSON</li><li>Function.prototype.bind</li><li>ISO Date() parsing</li></ul></li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 14)
    Content.create(:json => '{"t":[null,null],"e":[{"t":"h3","c":"What to fix?","p":{"width":"90%","height":"15%","top":"5%","left":"5%","fontSize":"150%"}},{"t":"ul","c":"<li>Standards Need Help<ul><li>Build on library precedent</li><li>Optimize for usability</li></ul></li><li>Need &lt;video/&gt; and &lt;audio/&gt; codecs</li>","p":{"width":"80%","height":"70%","top":"20%","left":"10%"}}],"a":[{"o":0},{"o":1}]}',
    :of_slide => 15)
    
  end
  
  def self.down
  end
end
