class YoutubeController < ApplicationController
	require 'youtube'
	
	def search
		videos = [] 		# Contains all the pictures
		@ArrayToJson = [] 	# Contains the "videos" and will be ready to convert into Json in the view
		
		if (params[:limit] == nil)	# Number of pictures per page
			params[:limit] = "8"
			puts "Warning: Empty parameter => limit (default value => 8)"
		end
		if (params[:tags] == nil or params[:tags] == "")  # Tags of the search
			params[:tags] = "dog"
			puts "Warning: Empty parameter => tags (default value => most recent pitcures)"
		end
		if (params[:start] == nil)  # Index of image
			params[:start] = "0" 
			puts "Warning: Empty parameter => start (default value => first page)"
		end
		
		no_page = (params[:start].to_i / params[:limit].to_i + 1).to_i
		
		youtube = YouTube::Client.new '0i9I6rABbIk'
		
		begin
			collection = youtube.videos_by_tag(params[:tags], no_page.to_s, params[:limit])
		rescue
		end
		list_videos = collection[:list_videos]

		list_videos.each do |video|
			begin
				details = youtube.video_details(video['id'])
				url_embed = video['url'].delete('?').sub('=', '/')
				elt = { :title => "#{video['title']}", :url => "#{url_embed}", :thumbnail => "#{details.thumbnail_url}", :author => "#{details.author}", :description => "#{details.description}", :length => "#{details.length_seconds}", :rating => "#{details.rating_avg}" }
				videos.push(elt) 
			rescue
			end
		end
		@ArrayToJson = { :totalCount => collection[:total_result], :videos => videos }
	end
end