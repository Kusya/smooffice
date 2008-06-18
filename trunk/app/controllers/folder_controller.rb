class FolderController < ApplicationController
#######################################################################
	def add  # Add an empty folder
		@NewFold = Folder.new
		@NewFold.parent_id = get_parent_id(params[:parent_id])
		@NewFold.title = params[:title]
		@NewFold.save
	end
#######################################################################
	def delete # Delete a folder and that it contains too
		if ( params[:id] != nil )
			folder_id = params[:id][7, params[:id].size]
			puts folder_id
			if (folder = Folder.find_by_id(folder_id)) # Delete the folder
				destroy_rec(folder_id)
				folder.destroy
			end
		end
	end
#######################################################################
	def move # Move the folder into a other
		@Folder_id = params[:id][7, params[:id].size]
		@Parent_id = get_parent_id(params[:parent_id])

		if (@Folder_id != @Parent_id)  # A folder can't be move into himself
			@Folder = Folder.find_by_id(@Folder_id)
			@Folder.parent_id = @Parent_id
			@Folder.save
		end
	end
#######################################################################
	def modify # Change the title
		@Folder_id = params[:idd][7, params[:idd].size]
		@Folder = Folder.find_by_id(@Folder_id)
		
		if (params[:title] != nil)
			@Folder.title = params[:title]
			@Folder.save
		end
	end
#######################################################################
	def destroy_rec(folder) # scan recursivly the folder and delete
		#######################################
		# Get presentations in
		childs = Presentation.find(:all,
									:conditions => "parent_id = #{folder}"
									)
		childs.each do |child| # Delete the presentation
			render_component :controller => "presentation", :action => "delete", :params => { "p_id" => "presentation-#{child.id}" } 
		end
		#####################################################

		# Get folders in
		underFolders = Folder.find(:all,
									:conditions => "parent_id = #{folder}"
									)
									
			
		underFolders.each do |folder| # Delete the under folder
			destroy_rec(folder.id)
			folder.destroy
		end
	end
#######################################################################
	def scan(folder) 
		#####################################################
		@jsonResult = [] 
		
		# Get presentations in
		@Childs = Presentation.find(:all,
									:conditions => "parent_id = #{folder}"
									)
		@Childs.each do |child|	
			@jsonResult.push({ :id => "presentation-#{child.id}",
							   :text => child.title,
							   :created_at => "#{child.created_at.strftime("%d/%m/%Y %H:%M:%S")}",
							   :updated_at => "#{child.updated_at.strftime("%d/%m/%Y %H:%M:%S")}",
							   :description => child.description,
							   :tags => child.tags,
							   :leaf => true,
							   :iconCls => 'presentation-icon' })
		end
		#####################################################
		# Get folders in
		@UnderFolders = Folder.find(:all,
									:conditions => "parent_id = #{folder}"
									)
									
		
		@UnderFolders.each do |@folder|
			@jsonResult.push({ :id => "folder-#{@folder.id}",
							   :text => @folder.title })
		end
	end
####################################################
	def get_all
		if (params[:node] != nil)
			if (params[:node] == "root")
				@jsonResult = []
				@jsonResult.push( { :id => "my-presentations",
									:text =>"My Presentations",
									:cls => "folder-node",
									:expanded => true,
									:draggable => false } )
								
				@jsonResult.push( { :id => "trash-node",
									:text => "Trash",
									:iconCls => "trash-icon-empty",
									:cls => "folder-node",
									:expanded => true,
									:rendered => true,
									:allowDrag => false,
									:qtip => "Drop your useless files here" } )
			else # If you want explor a folder
				@folder = get_parent_id(params[:node])
				scan(@folder)
			end
		end
	end
####################################################
	def get_parent_id(name_id)
		if (name_id == "my-presentations")
			parent_id = User.find_by_id(session[:user_id])['mainfolder']
		elsif (name_id == "trash-node")
			parent_id = User.find_by_id(session[:user_id])['binfolder']
		else
			parent_id = name_id[7, name_id.size]
		end
	end
####################################################	
end