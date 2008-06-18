class CreateContents < ActiveRecord::Migration
	def self.up
	    create_table :contents do |t|
			t.column :json, :text
			t.column :of_slide, :integer
			t.timestamps
	    end
	end

	def self.down
		drop_table :contents
	end
end
