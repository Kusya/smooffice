class FileController < ApplicationController
  #####################################################
  require "ftools"
  #####################################################
  
  def do
      if params[:cmd] == "rename"
        @result = rename 
      elsif params[:cmd] == "get"
        @result = get
      elsif params[:cmd] == "newdir"
        @result = newdir
      elsif params[:cmd] == "delete"
        @result = delete
      elsif params[:cmd] == "upload"
        @result = upload
      end
    end
    
    def rename
      begin
        username = User.find(session[:user_id]).name
        newname = "user_doc/#{username}#{params[:newname][4,params[:newname].size]}"
        oldname = "user_doc/#{username}#{params[:oldname][4,params[:oldname].size]}"
        File.rename(oldname, newname)
        result = { :success => true }
      rescue
        result = { :success => false, :error => "Cannot rename file #{oldname} to #{newname}" }
      end
      result
    end
    def get
      ###################
      puts "do/get :"
      ###################
      
      files = [] 		# Contains all the files and the directories
      
      # Get the username, it's the name of the user root path.
      username = User.find(session[:user_id]).name
      
      # Test error with the parameter path
      if (params[:path] == nil or params[:path] == "") # there is no parameter 
        puts "	There isn't parameter, you gonna be redirected to the root path."
      elsif ((params[:path] =~ /[.]/) != nil) # there is a point in the path (forbidden)
        puts "	Point in the path is forbidden, you gonna be redirected to the root path."
      else
        if ( params[:path] == "root" )
          puts "	Go to root path."
          params[:path] = "/"
        elsif ( params[:path] =~ /root/ )
          params[:path] = "#{params[:path][4,params[:path].size]}/"
        end
        # Completing of the path
        absolute_path = "user_doc/#{username}#{params[:path]}"
        relative_path = params[:path]
        
        # Normally, the path is corect now but we never know...
        if File.exist?(absolute_path)
          puts "	#{absolute_path} : This file exist."
        else
          puts "	The file doesn't exist, you gonna be redirected to your root path."
          absolute_path = "user_doc/#{username}/"
        end
        
        puts params[:path]
        
        # Opening of the directory
        begin
          directory = Dir.open(absolute_path)
        rescue
          puts "	Can't open the file."
        end
        
        wrong_file = [".", ".."]
        
        # Delete the parent and the directoy itself
        dir_list = directory.sort - wrong_file
        
        # Scanning of the directory
        dir_list.each { |file|
          # What kind of file there is
          case File.ftype(absolute_path+file)
            when "directory"
            file = { :id => "#{relative_path+file}/", :text => file, :iconcls => "folder", :disabled => false, :leaf => false} # Creating of a directory (ready to be convert into a json file
            when "file"
            extension = file[file.size - 3, file.size]
            file = { :id => "#{relative_path+file}", :text => file, :iconCls => "file-#{extension}", :disabled => false, :leaf => true, :qtip => "Size: 1047552"} #Creating of a file (ready to be convert into a json file
          end
          files.push(file) # Adding of the file or the directory
        }
      end
      files
    end
    def newdir
      username = User.find(session[:user_id]).name
      path = "user_doc/#{username}#{params[:dir][4, params[:dir].size]}/"
      
      begin
        if ( ( path =~ /[.]/ ) != nil ) # there is a point in the path (forbidden)
          puts "	Point in the path is forbidden."
          result = { :success => false, :error => "Cannot create directory: #{params[:dir][4, params[:dir].size]}" }
        else
          File.makedirs( path )
          result = { :success => true }
        end
      rescue
        result = { :success => false, :error => "Cannot create directory: #{params[:dir][4, params[:dir].size]}" }
      end
      result
    end
    
    def delete
      username = User.find(session[:user_id]).name
      
      path = "user_doc/#{username}#{params[:file][4, params[:file].size]}"
      
      case File.ftype(path)
        when "directory"
        path = "#{path}/"
        Dir.unlink path
        when "file"
        File.unlink path
      end
      
      result = { :success => true }
    end
    
    #####################################################
    def save_file
      puts "save_file :"
      username = User.find(session[:user_id]).name
      
      begin
        File.open("user_doc/#{username}/#{params[:file].original_filename}", "wb") { |file| 
          file.write(params[:file].read)
        }
      rescue
        puts "	Error : can't copy the file one." 
      end
      
      redirect_to :action => 'upload'
    end
    #####################################################
    
    def upload
      puts "upload : #{params[:UPLOAD_IDENTIFIER]}"
      begin
        save_file
        result = { :success => true }
      rescue
         result={ :success => false, :error=>"I don't no !" }
    end
    
    end
    #####################################################
    
    def progress
      puts "progress for : #{params[:UPLOAD_IDENTIFIER]}"
      result = { :success => true }
    end
  end
