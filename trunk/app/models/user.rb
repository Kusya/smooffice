require 'digest/sha1'
class User < ActiveRecord::Base

	validates_presence_of :lastname
	validates_presence_of :firstname
	validates_presence_of :email
	validates_presence_of :name
	validates_uniqueness_of :name
	attr_accessor :password_confirmation
	validates_confirmation_of :password

	def validate
		errors.add_to_base("Missing password") if hashed_password.blank?
	end
	
	def self.authenticate(name, password)
		user = self.find_by_name(name)
		if user
			expected_password = encrypted_password(password, user.salt)
			if user.hashed_password != expected_password
				user = nil
			end
		end
		user
	end
	
	# 'password' is a virtual attribute
	def password
		@password
	end
	
	def password=(pwd)
		@password = pwd
		create_new_salt
		self.hashed_password = User.encrypted_password(self.password, self.salt)
	end
	
	private
	def self.encrypted_password(password, salt)
		string_to_hash = password + "wibble" + salt # 'wibble' makes it harder to guess
		Digest::SHA1.hexdigest(string_to_hash)
	end
	
	def create_new_salt
		self.salt = self.object_id.to_s + rand.to_s
	end
end
