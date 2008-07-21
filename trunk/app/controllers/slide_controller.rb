class SlideController < ApplicationController
#########################
	def save
		params[:id] = params[:id][6, params[:id].size]
		
		slide = Slide.find_by_id(params[:id])
		
		content_old = Content.find_by_id(slide.last_content)
		
		if (content_old != params[:content])
			content = Content.new
			content.json = params[:content]
			content.save
			
			
			slide.last_content = content.id
			slide.save
			
			content.of_slide = slide.id
			content.save
		else
			puts "No need to update."
		end
		
	end
#########################
	def create
		presentation_id = params[:id][13, params[:id].size]
		
		@slide = Slide.new
		@slide.in_presentation = presentation_id
		@slide.save
		
		content = Content.new
		content.json = '{"c":"","a":[{"o":"e1478"},{"o":"e1639"}],"t":{"f":"null"},"e":[{"i":"e1478","t":"p","c":"<p align=\"center\"><font face=\"arial\" size=\"11\"><b>Title</b></font></p>","p":{"top":"10%","left":"10%","width":"80%","height":"10%","fontClass":"A","fontSize":"200%"}},{"i":"e1639","t":"p","c":"<font face=\"arial\" size=\"3\">Text</font>","p":{"top":"25%","left":"10%","width":"80%","height":"65%","fontClass":"A","fontSize":"100%"}}],"p":{"backgroundColor":"#FFFFFF"}}'
		content.of_slide = @slide.id
		content.save
		@slide.last_content = content.id
		@slide.original_slide = true
		@slide.save
    @content = content.json
	end
end