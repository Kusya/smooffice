# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of ActiveRecord to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 9) do

  create_table "contents", :force => true do |t|
    t.text     "json"
    t.integer  "of_slide"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "folders", :force => true do |t|
    t.string  "title"
    t.integer "parent_id"
  end

  create_table "orders", :force => true do |t|
    t.string   "json"
    t.integer  "of_presentation"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "presentations", :force => true do |t|
    t.string   "title"
    t.integer  "parent_id"
    t.string   "description"
    t.string   "tags"
    t.integer  "last_order"
    t.integer  "author"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "slides", :force => true do |t|
    t.integer "in_presentation"
    t.integer "last_content"
    t.boolean "original_slide"
  end

  create_table "tags", :force => true do |t|
    t.integer "presentation_id"
    t.string  "value"
  end

  create_table "users", :force => true do |t|
    t.string  "lastname"
    t.string  "firstname"
    t.string  "email"
    t.string  "name"
    t.string  "hashed_password"
    t.string  "salt"
    t.integer "mainfolder"
    t.integer "binfolder"
  end

end
