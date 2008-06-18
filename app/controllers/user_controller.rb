class UserController < ApplicationController

before_filter :authorize_user, :except => [:login, :logout, :add, :delete, :list, :csv_import]
before_filter :authorize_admin, :except => [:login, :logout, :modify, :home, :new_pwd]

	def add
		@user = User.new(params[:user])
		if request.post? and @user.save
			@bin_id = @user.id * (-2)
			@main_folder_id = @bin_id + 1
			@user.mainfolder = @main_folder_id
			@user.binfolder = @bin_id
			File.makedirs("user_doc/#{@user.name}")
			@user.save
			flash.now[:notice]="User #{@user.name} created"
			@user = User.new
		end
	end

	def delete
		if request.post?
			user = User.find(params[:id])
			user.destroy
			FileUtils.rm_rf("user_doc/#{user.name}")
		end
		redirect_to(:action => :list)
	end

	def modify
		@user = User.find(session[:user_id])

		if request.post? and @user.save
			@user.lastname = params[:user]['lastname']
			@user.firstname = params[:user]['firstname']
			@user.email = params[:user]['email']
			@user.name = params[:user]['name']
			@user.save
			flash.now[:notice]="User #{@user.name} modified"
			redirect_to(:controller => :index, :action => :get)	
		end
	end

	def home
	    @firstname = User.find_by_id(session[:user_id])['firstname'].capitalize
	    @lastname = User.find_by_id(session[:user_id])['lastname'].capitalize
	end


	def new_pwd
		@user = User.find(session[:user_id])
		if request.post?
			if (@user.hashed_password == Digest::SHA1.hexdigest(params[:old]['pass'] + "wibble" + @user.salt))
				if (params[:user]['password'] == params[:user]['password_confirmation'])
					@user.hashed_password = Digest::SHA1.hexdigest(params[:user]['password'] + "wibble" + @user.salt)
					@user.save
					redirect_to(:controller => :index, :action => :get)
					session[:pwdmodif] = "<h3> Your password have been modified! </h3>"
				else
					session[:error] = "<h3>Error : validation password!</h3>"
					session[:error] = "<h3>Error : check password!</h3>"
				end
			else
				session[:error] = "<h3>Error : Bad password!</h3>"
			end
		end
	end

	def login
		session[:user_id] = nil
		if request.post?
			user = User.authenticate(params[:name], params[:password])
			if user
				session[:user_id] = user.id
				uri = session[:original_uri]
				session[:original_uri] = nil
				redirect_to(uri || { :controller => "index", :action => "get" })
			else
				flash[:notice] = "Invalid user/password combination"
			end
		end
	end

	def logout
		session[:user_id] = nil
		flash[:notice] = "Logged out"
		redirect_to(:action => "login")
	end
  
	def list
		@all_users = User.find(:all)
	end

	require 'csv'
	
	def csv_import	
		if (params[:dump] != nil)
			@parsed_file = CSV::Reader.parse(params[:dump][:file])
			@nb_add = 0
			@parsed_file.each  do |row|
				user_i = User.new	
				user_i.lastname = row[0]
				user_i.firstname = row[1]
				user_i.email = row[2]
				user_i.name = row[3]	
				user_i.password=(row[4])
				user_i.save
				if (user_i.id != nil) # the user don't exist
					user_i.binfolder = user_i.id * (-2)
					user_i.mainfolder = user_i.binfolder + 1
					@nb_add += 1
					user_i.save
					puts "add " + user_i.firstname
				end				
			end
			
		end
	end
   
	
	private
	def authorize_admin
		unless User.find_by_id(session[:user_id]) and session[:user_id]==1
		session[:original_uri] = request.request_uri
		flash[:notice] = "Please log in as administrator"
		redirect_to(:controller => "index", :action => "get")
		end
	end

	def authorize_user
		unless User.find_by_id(session[:user_id])
		session[:original_uri] = request.request_uri
		flash[:notice] = "Please log in"
		redirect_to(:controller => "user", :action => "login")
		end
	end
end
