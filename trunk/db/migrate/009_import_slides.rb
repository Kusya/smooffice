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
    Content.create(:json => '{"c":"","a":[{"o":"e700"},{"o":"e701"},{"o":"e702"}],"t":{"f":"null"},"e":[{"i":"e700","t":"p","c":"<p align=\"center\"><font face=\"arial\" size=\"3\"><b id=\"ext-gen919\"><font id=\"ext-gen867\">This is the title of our demo presentation</font></b></font></p>","p":{"left":"0.1%","fontSize":"100%","height":"5.91%","top":"5.94%","width":"99.6%","fontClass":"A"}},{"i":"e701","t":"p","c":"<p id=\"ext-gen866\" align=\"center\"><font id=\"ext-gen904\" face=\"arial\" size=\"3\">Slide 1</font></p>","p":{"left":"0.02%","fontSize":"100%","height":"5.65%","top":"0.83%","width":"99.8%","fontClass":"A"}},{"i":"e702","t":"img","c":{"src":"http://farm4.static.flickr.com/3176/2571457016_064561db6a.jpg"},"p":{"left":"9.6%","height":"80.91%","top":"12.81%","width":"80.48%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
    :of_slide => 1)
    Content.create(:json => '{"c":"","a":[{"o":"e839"},{"n":"click","o":"e840","p":{"f":"blind"}},{"o":"e841"},{"n":"click","o":"e842","p":{"f":"drop","direction":"right"}},{"o":"e843"},{"o":"e844"}],"t":{"f":"slide"},"e":[{"i":"e839","t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2571183758_73ef817ba6.jpg"},"p":{"left":"37.67%","height":"53.93%","top":"32.73%","width":"61.26%"}},{"i":"e840","t":"img","c":{"src":"http://farm4.static.flickr.com/3104/2568572631_a74c308311.jpg"},"p":{"left":"1.16%","height":"29.54%","top":"1.72%","width":"16.23%"}},{"i":"e841","t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2567875694_06c1b68af9.jpg"},"p":{"left":"1.36%","height":"30.89%","top":"32.55%","width":"34.89%"}},{"i":"e842","t":"img","c":{"src":"http://farm4.static.flickr.com/3269/2567240040_9fa3002e7e.jpg"},"p":{"left":"18.29%","height":"28.46%","top":"2.01%","width":"29.01%"}},{"i":"e843","t":"p","c":"<p id=\"ext-gen2070\"><font id=\"ext-gen811\" color=\"#ffffff\" face=\"arial\" size=\"6\">impressive</font></p>","p":{"left":"57.55%","fontSize":"100%","height":"10.3%","fontClass":"A","top":"11.56%","width":"33.87%"}},{"i":"e844","t":"p","c":"<p id=\"ext-gen1906\" align=\"center\"><font id=\"ext-gen785\" color=\"#ffffff\" face=\"arial\" size=\"5\">creative</font></p>","p":{"left":"8.45%","fontSize":"100%","height":"8.94%","fontClass":"A","top":"72.85%","width":"18.26%"}}],"p":{"backgroundColor":"#000000"}}',
    :of_slide => 2)
    Content.create(:json => '{"c":"","a":[{"o":"e845"},{"o":"e846"},{"o":"e847"},{"o":"e848"},{"o":"e849"},{"o":"e1543"}],"t":{"f":"null"},"e":[{"i":"e846","t":"p","c":"<p></p><div id=\"ext-gen859\" align=\"center\"><b id=\"ext-gen1484\"><font id=\"ext-gen1483\" face=\"arial\" size=\"3\">Wonderful photos !!!</font></b><br></div>","p":{"left":"17.3%","fontSize":"100%","height":"5.42%","fontClass":"A","width":"68.76%","top":"86.56%"}},{"i":"e845","t":"h3","c":"<div align=\"center\"><u><i><font id=\"ext-gen1280\" face=\"arial\" size=\"2\">Image</font></i></u></div>","p":{"left":"32.93%","fontSize":"100%","height":"4.88%","fontClass":"A","width":"33.47%","top":"6.69%"}},{"i":"e1543","t":"img","c":{"img":"http://farm4.static.flickr.com/3272/2658024195_e8610fe7e3_m.jpg","src":"http://farm4.static.flickr.com/3272/2658024195_e8610fe7e3.jpg"},"p":{"left":"23.94%","height":"51.76%","top":"18.55%","width":"51.72%"}},{"i":"e847","t":"img","c":{"src":"http://farm4.static.flickr.com/3079/2567882736_4f179f9064.jpg"},"p":{"left":"71.63%","height":"23.04%","width":"25.76%","top":"10.48%"}},{"i":"e848","t":"img","c":{"src":"http://farm4.static.flickr.com/3081/2571373465_1466d964ee.jpg"},"p":{"left":"2.82%","height":"24.12%","width":"24.75%","top":"54.84%"}}],"p":{"backgroundColor":"#FFFF99"}}',
    :of_slide => 3)
    Content.create(:json => '{"c":"","a":[{"o":"e850"},{"o":"e851"}],"t":{"f":"null"},"e":[{"i":"e850","t":"h3","c":"<h3 id=\"ext-gen1046\"><font face=\"arial\" size=\"4\">&nbsp;</font><font color=\"#0000ff\" face=\"arial\" size=\"4\">Voici</font><font face=\"arial\" size=\"4\"> une </font><font color=\"#ff0000\" face=\"arial\" size=\"4\">super</font><font face=\"arial\" size=\"4\"> <i id=\"ext-gen1045\">Google</i><b>Map</b></font> <br></h3>","p":{"left":"24.55%","fontSize":"100%","height":"6.23%","fontClass":"A","top":"1.34%","width":"50.1%"}},{"i":"e851","t":"map","c":{"markers":[],"center":{"x":3.33984375,"y":48.0487099428869},"zoom":5},"p":{"left":"9.61%","height":"81.03%","top":"9.48%","width":"80.73%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
    :of_slide => 4)
    Content.create(:json => '{"c":"","a":[{"o":"e1101"},{"o":"e1482"}],"t":{"f":"null"},"e":[{"i":"e1101","t":"p","c":"<p></p><p></p><p id=\"ext-gen1543\"><font face=\"arial\" size=\"3\">En </font><font id=\"ext-gen662\" face=\"arial\" size=\"3\">exclusivité</font><font face=\"arial\" size=\"3\">, la <b>naissance</b> d\'une </font><font color=\"#339966\" face=\"arial\" size=\"3\">highland</font><font face=\"arial\" size=\"3\"> cow</font><br></p>","p":{"left":"14.29%","fontSize":"100%","height":"5.65%","fontClass":"A","top":"5.11%","width":"69.82%"}},{"i":"e1482","t":"video","c":{"img":"http://s1.ytimg.com/vi/4S_kyBhsv4U/default.jpg","src":"http://www.youtube.com/v/4S_kyBhsv4U"},"p":{"left":"8.85%","height":"80.11%","width":"80.08%","top":"15.05%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
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
    Content.create(:json => '{"c":"","a":[{"o":"e693","p":{"f":"blind","duration":"1010"}},{"o":"e697","p":{"f":"clip"}},{"o":"e694","p":{"f":"fade"},"n":"50"},{"o":"e695","p":{"f":"fade"},"n":"click"},{"n":"120","o":"e696","p":{"f":"puff"}}],"t":{"f":"null"},"e":[{"i":"e693","t":"img","c":{"src":"/user_doc/cgonnet/media/bg.png"},"p":{"left":"0%","height":"100%","top":"0%","width":"100%"}},{"i":"e695","t":"span","c":"","p":{"left":"9.8%","fontSize":"100%","height":"1.63%","fontClass":"A","top":"49.73%","width":"80.93%","backgroundColor":"#808080"}},{"i":"e696","t":"h2","c":"<h2 align=\"center\"><font color=\"#ffffff\" face=\"verdana\" size=\"5\">jQuery</font></h2>","p":{"left":"0%","fontSize":"100%","height":"9.76%","fontClass":"A","top":"37.63%","width":"100%"}},{"i":"e697","t":"p","c":"<p></p><p id=\"ext-gen923\" align=\"center\"><font id=\"ext-gen922\" color=\"#ffffff\" face=\"arial\" size=\"2\">BostonPHP - June 2008<br>John Resig (ejohn.org)</font></p>","p":{"left":"-0.22%","fontSize":"100%","textAlign":"center","height":"9.21%","fontClass":"A","top":"54.33%","width":"100.41%"}},{"i":"e694","t":"img","c":{"src":"/user_doc/cgonnet/media/tQuery_logo.gif"},"p":{"left":"26.36%","height":"17.89%","top":"33.06%","width":"13.18%"}}],"p":{"backgroundColor":"#000000"}}',
    :of_slide => 6)
    Content.create(:json => '{"c":"","a":[{"o":"e693"},{"o":"e694"}],"t":{"f":"null"},"e":[{"i":"e693","t":"h2","c":"What is jQuery?","p":{"left":"10%","fontSize":"100%","height":"6.99%","fontClass":"A","width":"80.08%","top":"10%"}},{"i":"e694","t":"ul","c":"<li>An open source JavaScript library that<br />simplifies the interaction between HTML<br />and JavaScript.","p":{"left":"10%","fontSize":"100%","height":"10.75%","fontClass":"A","width":"80.08%","top":"26%"}}],"p":{}}',
    :of_slide => 7)
    Content.create(:json => '{"c":"","a":[{"o":"e695"},{"o":"e696"}],"t":{"f":"null"},"e":[{"i":"e695","t":"h2","c":"Keep Clean","p":{"left":"10%","fontSize":"100%","height":"6.99%","fontClass":"A","width":"80.08%","top":"10%"}},{"i":"e696","t":"ul","c":"<li>jQuery can rename \'$\':<br />var $jq = jQuery.noConflict();<br/>$jq(“div”).hide();<li>jQuery can even rename \'jQuery\' allowing<br />multiple copies to run side-by-side.<li>var $a = jQuery.noConflict(true);<br/>// load other version of jQuery$a(“div”).hide(); // still works!","p":{"left":"10%","fontSize":"100%","height":"25.27%","fontClass":"A","width":"80.08%","top":"26%"}}],"p":{}}',
    :of_slide => 8)
    
  end
  
  def self.down
  end
end
