class ImportSlides < ActiveRecord::Migration
  def self.up
    Presentation.create(:title => 'First presentation',
    :description => 'It is the first presentation, there is not slide yet',
    :parent_id => '-7',
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
    Content.create(:json => '{"p":{"backgroundColor":"#FFFFFF"},"c":"","a":[{"o":"e1"},{"o":"e2"},{"o":"e3"}],"t":[null],"e":{"e1":{"t":"p","c":"<b><font id=\"ext-gen867\" size=\"2\">This is the title of our demo presentation</font></b>","p":{"left":"1.19%","fontSize":"100%","height":"6.03%","width":"67.93%","top":"6.67%"}},"e2":{"t":"p","c":"<font id=\"ext-gen904\" size=\"2\">Slide 1</font>","p":{"left":"1.19%","fontSize":"100%","height":"5.71%","width":"17.58%","top":"1.27%"}},"e3":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3176/2571457016_064561db6a.jpg"},"p":{"left":"9.6%","height":"80.95%","width":"80.52%","top":"12.81%"}}}}',
    :of_slide => 1)
    Content.create(:json => '{"p":{"backgroundColor":"#FFFFFF"},"c":"","a":[{"o":"e1"},{"o":"e2"},{"o":"e3"},{"o":"e4"},{"o":"e5"},{"o":"e5"},{"o":"e6"}],"t":[null],"e":{"e1":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2571183758_73ef817ba6.jpg"},"p":{"left":"37.67%","height":"53.99%","top":"32.73%","width":"61.11%"}},"e2":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3104/2568572631_a74c308311.jpg"},"p":{"left":"1.36%","height":"28.9%","top":"1.99%","width":"15.95%"}},"e3":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2567875694_06c1b68af9.jpg"},"p":{"left":"1.36%","height":"30.99%","top":"32.55%","width":"34.9%"}},"e4":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3269/2567240040_9fa3002e7e.jpg"},"p":{"left":"18.43%","height":"28.14%","top":"2.19%","width":"28.49%"}},"e5":{"t":"p","c":"<font id=\"ext-gen811\" size=\"6\">impressive</font>","p":{"left":"58.82%","fontSize":"100%","height":"10.08%","top":"11.27%","width":"33.76%"}},"e6":{"t":"p","c":"<font id=\"ext-gen785\" size=\"4\">creative</font>","p":{"left":"10.58%","fontSize":"100%","height":"8.94%","top":"70.65%","width":"18.23%"}}}}',
    :of_slide => 2)
    Content.create(:json => '{"p":{"backgroundColor":"#FFFFFF"},"c":"","t":[null],"a":[{"o":"e1"},{"o":"e2"},{"o":"e3"},{"o":"e4"},{"o":"e5"}],"e":{"e1":{"t":"h3","c":"This is the title of our demo presentation","p":{"top":"6.69%","left":"32.93%","height":"4.86%","width":"33.49%"}},"e2":{"t":"p","c":"<div id=\"ext-gen859\" align=\"center\">Title of our wonderful photos !!!<br></div>","p":{"top":"73.25%","left":"17.31%","height":"9.42%","width":"68.56%"}},"e3":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3079/2567882736_4f179f9064.jpg"},"p":{"top":"13.77%","left":"68.29%","height":"23.1%","width":"25.74%"}},"e4":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3081/2571373465_1466d964ee.jpg"},"p":{"top":"40%","left":"3.11%","height":"24.32%","width":"24.83%"}},"e5":{"t":"img","c":{"src":"http://farm4.static.flickr.com/3030/2567910845_bcb629bbe8.jpg"},"p":{"top":"20.55%","left":"29.2%","height":"38.3%","width":"38.5%"}}}}',
    :of_slide => 3)
    Content.create(:json => '{"p":{"backgroundColor":"#FFFFFF"},"c":"","t":[null],"a":[{"o":"e1"},{"o":"e2"}],"e":{"e1":{"t":"h3","c":"&nbsp;<font color=\"#0000ff\">Voici</font> une <font color=\"#ff0000\">super</font> <i>Google</i> <b>Map</b><br>","p":{"top":"2.09%","left":"26.17%","height":"5.63%","width":"37.94%"}},"e2":{"t":"map","c":{"markers":[],"center":{"x":3.33984375,"y":48.04870994288686},"zoom":5},"p":{"top":"9.48%","left":"9.61%","height":"81.01%","width":"80.65%"}}}}',
    :of_slide => 4)
    Content.create(:json => '{"p":{"backgroundColor":"#FFFFFF"},"c":"","t":[null],"a":[{"o":"e1"},{"o":"e2"}],"e":{"e1":{"t":"p","c":"<p></p><p>En <font id=\"ext-gen662\" size=\"3\">exclusivité</font>, la <b>naissance</b> d\'une <font color=\"#339966\" size=\"3\">highland</font> cow<br></p>","p":{"top":"4.3%","left":"19.54%","height":"7.85%","width":"59.2%"}},"e2":{"t":"video","c":{"src":"http://www.youtube.com/v/4S_kyBhsv4U"},"p":{"top":"15.29%","left":"4.31%","height":"80.76%","width":"92.03%"}}}}',
    :of_slide => 5)
    
    
    Presentation.create(:title => 'Demo presentation',
    :description => 'This presentation is a demo of our <i>presentation player</i>.',
    :parent_id => '-7',
    :last_order => 2,
    :author => 4)
    
    Order.create(:json => '[{"id":"slide-6"},{"id":"slide-7"},{"id":"slide-8"}]',
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
    
    #Presentation 2
    Content.create(:json => '{"t":[null],"p":{"backgroundColor":"#000000"},"e":{"ea":{"t":"img","c":{"src":"/user_doc/cgonnet/media/bg.png"},"p":{"top":"0%","left":"0%","width":"100%","height":"100%"}},"e0":{"t":"img","c":{"src":"/user_doc/cgonnet/media/tQuery_logo.gif"},"p":{"top":"33%","left":"19%","width":"14%","height":"10.5%"}},"e1":{"t":"span","c":"","p":{"top":"50%","left":"10%","width":"80%","height":"1%","backgroundColor":"#808080"}},"e2":{"t":"h2","c":"<h2 align=\"center\"><font color=\"#ffffff\" face=\"verdana\" size=\"5\">jQuery</font></h2>","p":{"top":"39%","left":"0%","width":"100%","fontSize":"250%"}},"e3":{"t":"p","c":"<p align=\"center\"><font size=\"2\" face=\"arial\" color=\"#ffffff\">BostonPHP - June 2008<br/>John Resig (ejohn.org)</font></p>","p":{"top":"55%","width":"100%","textAlign":"center"}}},"a":[{"o":"ea"},{"o":"e0"},{"o":"e1"},{"o":"e2"},{"o":"e3"}]}',
    :of_slide => 6)
    Content.create(:json => '{"t":[null],"e":{"e0":{"t":"h2","c":"What is jQuery?","p":{"top":"10%","left":"10%","fontSize":"200%"}},"e1":{"t":"ul","c":"<li>An open source JavaScript library that<br />simplifies the interaction between HTML<br />and JavaScript.","p":{"top":"26%","left":"10%"}}},"a":[{"o":"e0"},{"o":"e1"}]}',
    :of_slide => 7)
    Content.create(:json => '{"t":[null],"e":{"e0":{"t":"h2","c":"Keep Clean","p":{"top":"10%","left":"10%","fontSize":"200%"}},"e1":{"t":"ul","c":"<li>jQuery can rename \'$\':<br />var $jq = jQuery.noConflict();<br/>$jq(“div”).hide();<li>jQuery can even rename \'jQuery\' allowing<br />multiple copies to run side-by-side.<li>var $a = jQuery.noConflict(true);<br/>// load other version of jQuery$a(“div”).hide(); // still works!","p":{"top":"26%","left":"10%"}}},"a":[{"o":"e0"},{"o":"e1","f":"li:eq(2)","p":"hide"},{"o":"e1","n":"click"},{"o":"e1","f":"li:eq(2)","p":{"f":"fade"}}]}',
    :of_slide => 8)
    
  end
  
  def self.down
  end
end
