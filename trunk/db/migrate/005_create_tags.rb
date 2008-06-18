class CreateTags < ActiveRecord::Migration
  def self.up
    create_table :tags do |t|
		t.column :presentation_id, :integer
		t.column :value, :string
    end
  end

  def self.down
    drop_table :tags
  end
end
