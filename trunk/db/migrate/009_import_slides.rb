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
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"blind"}],"e":[{"i":"e700","t":"p","c":"<p align=\"center\"><font face=\"arial\" size=\"3\"><b id=\"ext-gen919\"><font id=\"ext-gen867\">This is the title of our demo presentation</font></b></font></p>","p":{"left":"0.1%","fontSize":"100%","height":"5.91%","top":"5.94%","width":"99.6%","fontClass":"A"}},{"i":"e701","t":"p","c":"<p id=\"ext-gen866\" align=\"center\"><font id=\"ext-gen904\" face=\"arial\" size=\"3\">Slide 1</font></p>","p":{"left":"0.02%","fontSize":"100%","height":"5.65%","top":"0.83%","width":"99.8%","fontClass":"A"}},{"i":"e702","t":"img","c":{"src":"http://farm4.static.flickr.com/3176/2571457016_064561db6a.jpg"},"p":{"left":"9.6%","height":"80.91%","top":"12.81%","width":"80.48%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
    :of_slide => 1)
    Content.create(:json => '{"c":"","a":[{"o":{"delay":0,"duration":400,"effect":"fade"},"type":"show","id":"e840","trigger":"click"},{"o":{"delay":"500","duration":400,"effect":"puff"},"type":"show","id":"e842","trigger":"after"},{"o":{"delay":"400","duration":"1000","effect":"drop"},"type":"show","id":"e843","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":"400","effect":"slide"},"type":"show","id":"e841","trigger":"click"},{"o":{"delay":"500","horizFirst":true,"duration":400,"effect":"fold"},"type":"show","id":"e839","trigger":"after"},{"o":{"delay":"500","direction":"down","duration":"1000","effect":"drop"},"type":"show","id":"e844","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":400,"effect":"slide"},"type":"hide","id":"e840","trigger":"click"},{"o":{"delay":0,"direction":"down","duration":400,"effect":"slide"},"type":"hide","id":"e842","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":"1000","effect":"slide"},"type":"hide","id":"e843","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":400,"effect":"slide"},"type":"hide","id":"e841","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":400,"effect":"slide"},"type":"hide","id":"e839","trigger":"after"},{"o":{"delay":0,"direction":"down","duration":"1000","effect":"slide"},"type":"hide","id":"e844","trigger":"after"}],"t":[{"f":"null"},{"f":"fade"}],"e":[{"i":"e839","t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2571183758_73ef817ba6.jpg"},"p":{"left":"37.67%","height":"53.93%","top":"32.73%","width":"61.26%"}},{"i":"e840","t":"img","c":{"src":"http://farm4.static.flickr.com/3104/2568572631_a74c308311.jpg"},"p":{"left":"1.16%","height":"29.54%","top":"1.72%","width":"16.23%"}},{"i":"e841","t":"img","c":{"src":"http://farm4.static.flickr.com/3090/2567875694_06c1b68af9.jpg"},"p":{"left":"1.36%","height":"30.89%","top":"32.55%","width":"34.89%"}},{"i":"e842","t":"img","c":{"src":"http://farm4.static.flickr.com/3269/2567240040_9fa3002e7e.jpg"},"p":{"left":"18.29%","height":"28.46%","top":"2.01%","width":"29.01%"}},{"i":"e843","t":"p","c":"<p id=\"ext-gen2070\"><font id=\"ext-gen811\" color=\"#ffffff\" face=\"arial\" size=\"6\">impressive</font></p>","p":{"left":"57.55%","fontSize":"100%","height":"10.3%","fontClass":"A","top":"11.56%","width":"33.87%"}},{"i":"e844","t":"p","c":"<p id=\"ext-gen1906\" align=\"center\"><font id=\"ext-gen785\" color=\"#ffffff\" face=\"arial\" size=\"5\">creative</font></p>","p":{"left":"8.45%","fontSize":"100%","height":"8.94%","fontClass":"A","top":"72.85%","width":"18.26%"}}],"p":{"backgroundColor":"#000000"}}',
    :of_slide => 2)
    Content.create(:json => '{"c":"","a":[{"type":"show","o":{"delay":0,"duration":400,"direction":"left","effect":"slide"},"id":"e1478","trigger":"click"},{"type":"show","o":{"delay":0,"duration":400,"direction":"horizontal","effect":"blind"},"id":"e1639","trigger":"click"},{"o":{"opacity":"0.5","delay":"1000","duration":400,"effect":"fade"},"type":"animate","id":"e1400","trigger":"after"},{"o":{"opacity":"0.5","delay":"0","duration":400,"effect":"fade"},"type":"animate","id":"e1214","trigger":"after"},{"type":"show","o":{"delay":"0","duration":400,"effect":"fade"},"id":"e1522","trigger":"after"}],"t":[{"f":"null"},{"f":"null"}],"e":[{"i":"e1400","t":"img","c":{"img":"http://farm4.static.flickr.com/3234/2711822806_5c3d2b4593_m.jpg","src":"http://farm4.static.flickr.com/3234/2711822806_5c3d2b4593.jpg"},"p":{"left":"0%","height":"80%","width":"100%","top":"0%"}},{"i":"e1639","t":"p","c":"<div align=\"center\"><font id=\"ext-gen1622\" color=\"#ffffff\" size=\"3\"><font id=\"ext-gen1621\" face=\"arial\">Lorem ipsum dolor sit amet, consectetuer adipisci elit. Habeat omnia et praeter et facete nescio et sed sint et graece vitium civibus hic, minus conturbamur ultimum, in interdictum sabinum modo ipsa ipsi de dolores laetitiam, huc si tu unum natura, stoici etiamsi nihil, nihil aut esse fieri graecos a omne et propter voluptas.. Ut rem e quod, possit.. Se aut modo et vero, in atomus quae, locupletiorem hoc et putat inquam eventurum esse summa bona quae suum oporteat et rem, qui aut quod quae, partitio involuta quos.. Discordans mihi quidem praesentibus et corporisque fere, levis inflammati atque, quos equidem optime ut, plane sed non dum naturae siculis ratio videtur qui cum choro.<br></font></font><font color=\"#ffffff\" face=\"arial\" size=\"3\"><br></font></div><div style=\"-moz-user-select: none;\" id=\"ext-gen1480\" class=\"x-resizable-handle x-resizable-handle-east x-unselectable\"></div>","p":{"left":"9.86%","fontSize":"100%","height":"33.74%","fontClass":"A","width":"79.92%","top":"24.87%"}},{"i":"e1478","t":"p","c":"<p align=\"center\"><font id=\"ext-gen1203\" color=\"#ff6600\" face=\"arial\" size=\"11\"><b id=\"ext-gen1202\">My title</b></font></p>","p":{"left":"9.67%","fontSize":"100%","height":"11.13%","fontClass":"A","width":"80.57%","top":"9.56%"}},{"i":"e1214","t":"img","c":{"img":"http://farm4.static.flickr.com/3236/2712522312_5c01cca34d_m.jpg","src":"http://farm4.static.flickr.com/3236/2712522312_5c01cca34d.jpg"},"p":{"left":"-0.13%","height":"27.83%","width":"100.26%","top":"72.17%"}},{"i":"e1522","t":"img","c":{"img":"http://farm4.static.flickr.com/3050/2713474266_619428212c_m.jpg","src":"http://farm4.static.flickr.com/3050/2713474266_619428212c.jpg"},"p":{"left":"6.91%","height":"85.04%","width":"86.31%","top":"7.83%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
    :of_slide => 3)
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"fade"}],"e":[{"i":"e850","t":"h3","c":"<h3 id=\"ext-gen1046\"><font face=\"arial\" size=\"4\">&nbsp;</font><font color=\"#0000ff\" face=\"arial\" size=\"4\">Voici</font><font face=\"arial\" size=\"4\"> une </font><font color=\"#ff0000\" face=\"arial\" size=\"4\">super</font><font face=\"arial\" size=\"4\"> <i id=\"ext-gen1045\">Google</i><b>Map</b></font> <br></h3>","p":{"left":"24.55%","fontSize":"100%","height":"6.23%","fontClass":"A","top":"1.34%","width":"50.1%"}},{"i":"e851","t":"map","c":{"markers":[],"center":{"x":3.33984375,"y":48.0487099428869},"zoom":5},"p":{"left":"9.61%","height":"81.03%","top":"9.48%","width":"80.73%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
    :of_slide => 4)
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"fade"}],"e":[{"i":"e1101","t":"p","c":"<p></p><p></p><p id=\"ext-gen1543\"><font face=\"arial\" size=\"3\">En </font><font id=\"ext-gen662\" face=\"arial\" size=\"3\">exclusivité</font><font face=\"arial\" size=\"3\">, la <b>naissance</b> d\'une </font><font color=\"#339966\" face=\"arial\" size=\"3\">highland</font><font face=\"arial\" size=\"3\"> cow</font><br></p>","p":{"left":"14.29%","fontSize":"100%","height":"5.65%","fontClass":"A","top":"5.11%","width":"69.82%"}},{"i":"e1482","t":"video","c":{"img":"http://s1.ytimg.com/vi/4S_kyBhsv4U/default.jpg","src":"http://www.youtube.com/v/4S_kyBhsv4U"},"p":{"left":"8.85%","height":"80.11%","width":"80.08%","top":"15.05%"}}],"p":{"backgroundColor":"#FFFFFF"}}',
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
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"null"}],"e":[{"i":"e693","t":"img","c":{"src":"/user_doc/cgonnet/media/bg.png"},"p":{"left":"0%","height":"100%","top":"0%","width":"100%"}},{"i":"e695","t":"span","c":"","p":{"left":"9.8%","fontSize":"100%","height":"1.63%","fontClass":"A","top":"49.73%","width":"80.93%","backgroundColor":"#808080"}},{"i":"e696","t":"h2","c":"<h2 align=\"center\"><font color=\"#ffffff\" face=\"verdana\" size=\"5\">jQuery</font></h2>","p":{"left":"0%","fontSize":"100%","height":"9.76%","fontClass":"A","top":"37.63%","width":"100%"}},{"i":"e697","t":"p","c":"<p></p><p id=\"ext-gen923\" align=\"center\"><font id=\"ext-gen922\" color=\"#ffffff\" face=\"arial\" size=\"2\">BostonPHP - June 2008<br>John Resig (ejohn.org)</font></p>","p":{"left":"-0.22%","fontSize":"100%","textAlign":"center","height":"9.21%","fontClass":"A","top":"54.33%","width":"100.41%"}},{"i":"e694","t":"img","c":{"src":"/user_doc/cgonnet/media/tQuery_logo.gif"},"p":{"left":"26.36%","height":"17.89%","top":"33.06%","width":"13.18%"}}],"p":{"backgroundColor":"#000000"}}',
    :of_slide => 6)
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"null"}],"e":[{"i":"e693","t":"h2","c":"What is jQuery?","p":{"left":"10%","fontSize":"100%","height":"6.99%","fontClass":"A","width":"80.08%","top":"10%"}},{"i":"e694","t":"ul","c":"<li>An open source JavaScript library that<br />simplifies the interaction between HTML<br />and JavaScript.","p":{"left":"10%","fontSize":"100%","height":"10.75%","fontClass":"A","width":"80.08%","top":"26%"}}],"p":{}}',
    :of_slide => 7)
    Content.create(:json => '{"c":"","a":[],"t":[{"f":"null"},{"f":"null"}],"e":[{"i":"e695","t":"h2","c":"Keep Clean","p":{"left":"10%","fontSize":"100%","height":"6.99%","fontClass":"A","width":"80.08%","top":"10%"}},{"i":"e696","t":"ul","c":"<li>jQuery can rename \'$\':<br />var $jq = jQuery.noConflict();<br/>$jq(“div”).hide();<li>jQuery can even rename \'jQuery\' allowing<br />multiple copies to run side-by-side.<li>var $a = jQuery.noConflict(true);<br/>// load other version of jQuery$a(“div”).hide(); // still works!","p":{"left":"10%","fontSize":"100%","height":"25.27%","fontClass":"A","width":"80.08%","top":"26%"}}],"p":{}}',
    :of_slide => 8)
    
  end
  
  def self.down
  end
end
