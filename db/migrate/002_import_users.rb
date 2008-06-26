class ImportUsers < ActiveRecord::Migration
  require 'ftools'
	def self.up
    User.create(:lastname => "admin",
          :firstname => "admin",
          :email => "admin@admin.com",
          :name => "admin",
          :hashed_password => "92635c2e1a8fd4d704eec4f10367339aa851c511",
          :salt => "291497800.161968722230831",
          :mainfolder => '-1',
          :binfolder => '-2')
    User.create(:lastname => "BABE",
          :firstname => "Louis-Rémi",
          :email => "lrbabe@gmail.com",
          :name => "lrbabe",
          :hashed_password => "a9fce13ff4a20aae12b7ea51556514a9b7d2b7f9",
          :salt => "40620.09609234416904766",
          :mainfolder => '-3',
          :binfolder => '-4')
    User.create(:lastname => "GARNIER",
          :firstname => "Samuel",
          :email => "garnier.sam@gmail.com",
          :name => "sgarnier",
          :hashed_password => "97c3ba3afc1b4dcc824de195afff20c022b54645",
          :salt => "43260.15212445371511862",
          :mainfolder => '-5',
          :binfolder => '-6')
    User.create(:lastname => "GONNET",
          :firstname => "Clément",
          :email => "cgonnet87@gmail.com",
          :name => "cgonnet",
          :hashed_password => "7fed5f8ac2a31d022c6a26ad9b7e74beb8e35725",
          :salt => "45900.29405005032863374",
          :mainfolder => '-7',
          :binfolder => '-8')
	
	# Creating of User Docs
	File.makedirs("public/user_doc/admin/")
	File.makedirs("public/user_doc/lrbabe/")
	File.makedirs("public/user_doc/sgarnier/")
	File.makedirs("public/user_doc/cgonnet/")
	end

	def self.down
		User.delete_all
		# Deleting of User Docs
		FileUtils.rm_rf("public/user_doc/admin/")
		FileUtils.rm_rf("public/user_doc/lrbabe/")
		FileUtils.rm_rf("public/user_doc/sgarnier/")
		FileUtils.rm_rf("public/user_doc/cgonnet/")
	end
end
