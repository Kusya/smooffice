class CreateOrders < ActiveRecord::Migration
	def self.up
	    create_table :orders do |t|
			t.column :json, :string
			t.column :of_presentation, :integer
			t.timestamps
	    end
	end

	def self.down
	    drop_table :orders
	end
end
