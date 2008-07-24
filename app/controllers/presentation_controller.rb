class PresentationController < ApplicationController
  #####################
  require 'json'  	
  #####################
  def add
    if (params[:parent_id] != nil and params[:title] != nil and params[:description] != nil)
      @NewPres = Presentation.new
      @NewPres.title = params[:title]
      @NewPres.description = params[:description]
      @NewPres.parent_id = get_parent_id(params[:parent_id])
      @NewPres.tags = params[:tags]
      @NewPres.save
      
      newOrder = Order.new
      newOrder.of_presentation = @NewPres.id
      newOrder.save
      
      newSlide = Slide.new
      newSlide.in_presentation = @NewPres.id
      newSlide.save
      
      json = { :id => "slide-#{newSlide.id}" }
      json_array = []
      json_array.push(json)
      newOrder.json = json_array.to_json
      newOrder.save
      
      newContent = Content.new
      newContent.json = '{"c":"","a":[],"t":{"f":"null"},"e":[{"i":"e1478","t":"p","c":"<p align=\"center\"><font face=\"arial\" size=\"11\"><b>Title</b></font></p>","p":{"top":"24.35%","left":"10%","width":"80%","height":"10%","fontClass":"A","fontSize":"200%"}},{"i":"e1639","t":"p","c":"<div align=\"center\"><font face=\"arial\" size=\"6\">Sub-title</font></div>","p":{"top":"40%","left":"10%","width":"80%","height":"30%","fontClass":"A","fontSize":"150%"}}],"p":{"backgroundColor":"#FFFFFF"}}'
      newContent.of_slide = newSlide.id
      newContent.save
      
      newSlide.last_content = newContent.id
      newSlide.original_slide = true
      newSlide.save
      
      @NewPres.last_order = newOrder.id
      @NewPres.author = User.find_by_id([session[:user_id]])['id']
      @NewPres.save
    end
  end
  ####################################################
  def delete
    puts params[:p_id][13, params[:p_id].size]
    
    if (present_id = params[:p_id][13, params[:p_id].size])
      present = Presentation.find_by_id(present_id)
      
      slides = Slide.find(:all,
                          :conditions => "in_presentation = #{present_id}")
      slides.each do |slide|
        contents = Content.find(:all,
                                :conditions => "of_slide = #{slide.id}")
        contents.each do |content|
          content.destroy
        end
        slide.destroy
      end
      orders = Order.find(:all,
                          :conditions => "of_presentation = #{present.id}")
      orders.each do |order|
        order.destroy
      end
      present.destroy
    end
  end
  ####################################################
  def modify
    if (params[:id] != nil and presentation_id = params[:id][13, params[:id].size])
      presentation = Presentation.find_by_id(presentation_id)
      if (params[:title] != nil)
        presentation.title = params[:title]
      end
      if (params[:description] != nil)
        presentation.description = params[:description]
      end
      if (params[:tags] != nil)
        presentation.tags = params[:tags]
      end
      presentation.save
    end
  end
  ####################################################
  def move
    if (params[:id] != nil)
      if (@Present_id = params[:id][13, params[:id].size])
        if (params[:parent_id] != nil and @Parent_id = get_parent_id(params[:parent_id]))
          if (@Present = Presentation.find_by_id(@Present_id))
            @Present.parent_id = @Parent_id
            @Present.save
          end
        end
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
  def get_slides(present_id = params[:id])
    order_id = Presentation.find_by_id(present_id[13, present_id.size])['last_order']
    json_order = Order.find_by_id(order_id)['json']
    
    array_order = JSON.parse(json_order)
    
    @slides_to_json = []
    
    array_order.each { |slide_id|
      
      slide = Slide.find_by_id(slide_id["id"][6,slide_id["id"].size])
      slide_content = Content.find_by_id(slide.last_content)
      
      content_json = JSON.parse(slide_content.json)
      content_json[:id] = "slide-#{slide.id}"			
      @slides_to_json.push(content_json)
    }
    @slides_to_json
  end
  ####################################################
  def show
    if (params[:id] != nil)
      if (present_id = params[:id][13, params[:id].size])
        if (presentation = Presentation.find_by_id(present_id))
          if (user = User.find_by_id(presentation.author))
            name = "#{user.lastname} #{user.firstname}"
            @presentation_json = { 	:title => presentation.title, 
              :author => name,
              :description => presentation.description,
              :created_at => "#{presentation.created_at}",
              :updated_at => "#{presentation.updated_at}",
              :master => {:t=>{
                  :f=> 'fade'
                }},
              :slide => get_slides}
          end
        end
      end
    end
    @presentation_json.to_json
  end
  ######################################################
  def slides_order
    presentation = Presentation.find_by_id(params[:id][13, params[:id].size])
    
    order = Order.new
    order.json = params[:order]	
    order.of_presentation = presentation.id
    order.save
    
    presentation.last_order = order.id
    presentation.save
  end
end