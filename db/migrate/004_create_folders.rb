class CreateFolders < ActiveRecord::Migration
	def self.up
		create_table :folders do |t|
			t.column :title, :string
			t.column :parent_id, :integer
		end
	end
  	def self.down
		drop_table :folders
	end
end
