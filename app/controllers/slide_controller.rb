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
		content.json = "{}"
		content.of_slide = @slide.id
		content.save
		
		@slide.last_content = content.id
		@slide.original_slide = true
		@slide.save
	end
end