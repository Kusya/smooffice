class CreateUsers < ActiveRecord::Migration
	def self.up
		create_table :users do |t|
			t.column :lastname,		:string
			t.column :firstname,		:string
			t.column :email,			:string
			t.column :name,			:string
			t.column :hashed_password,	:string
			t.column :salt,			:string
			t.column :mainfolder,		:integer
			t.column :binfolder,		:integer
		end
	end
  	def self.down
		drop_table :users
	end
end
