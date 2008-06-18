class IndexController < ApplicationController

	before_filter :authorize

	def get
    @firstname = User.find_by_id(session[:user_id])['firstname'].capitalize
    @lastname = User.find_by_id(session[:user_id])['lastname'].capitalize
	end
  
	private
	def authorize
		unless User.find_by_id(session[:user_id])
		session[:original_uri] = request.request_uri
		flash[:notice] = "Please log in"
		redirect_to(:controller => "user", :action => "login")
		end
	end
end
