class CreateSlides < ActiveRecord::Migration
	def self.up
	    create_table :slides do |t|
			t.column :in_presentation,	:integer
			t.column :last_content,		:integer
			t.column :original_slide,	:boolean
	    end
	end
####################################################
	def self.down
	    drop_table :slides
	end
end
