class CreatePresentations < ActiveRecord::Migration
	def self.up
		create_table :presentations do |t|
			t.column :title,		:string
			t.column :parent_id,	:integer
			t.column :description,	:string
			t.column :tags,			:string
			t.column :last_order, 	:integer
			t.column :author, 		:integer
			t.timestamps
		end
	end
  	def self.down
		drop_table :presentations
	end
end
