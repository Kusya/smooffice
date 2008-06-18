class FlickrController < ApplicationController
##############################################################
	def search
	
		# Declarations
		images = [] 		# Contains all the pictures
		@ArrayToJson = [] 	# Contains the "images" and will be ready to convert into Json in the view
		
		if (params[:limit] == nil)	# Number of pictures per page
			params[:limit] = "8"
			puts "Warning: Empty parameter => limit (default value => 8)"
		end
		if (params[:tags] == nil or params[:tags] == "")  # Tags of the search
			params[:tags] = " "
			puts "Warning: Empty parameter => tags (default value => most recent videos)"
		end
		if (params[:start] == nil)  # Index of image
			params[:start] = "0" 
			puts "Warning: Empty parameter => start (default value => first page)"
		end
			
		no_page = (params[:start].to_i / params[:limit].to_i + 1).to_i
		
		flickr = Flickr.new '7314213e6fe1573f822e9af63e7aaeb0'
		
		begin
			photo_set = flickr.photos(:license => "1,2,3,4,5,6",
										:tags => "#{params[:tags]}", 
										:per_page => "#{params[:limit]}",
										:page => "#{no_page}")
		rescue
			total = 0
		else
			i = 0
			
			collection = photo_set[:collection]
			total = photo_set[:total]

			while (i < collection.length) # Browse the collection
				begin # Sometimes, several pictures return some bugs so we don't display them
					elt = { :thumbnail => "#{collection[i].source('Small')}", :url => "#{collection[i].source}", :title => "#{collection[i].title}", :license => "#{collection[i].license}"}
					images.push(elt)
				rescue
				end
				i += 1
			end
		end
		@ArrayToJson = { :totalCount => total, :images => images }
	end
##############################################################
end
