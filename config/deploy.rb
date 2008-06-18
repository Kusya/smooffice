require 'mongrel_cluster/recipes'

set :application, "netshow"
set :repository,  "http://92.243.7.238/svn/webshow/trunk"
set :deploy_to, "/var/rails/#{application}"
#set :user, "root"
# Thew new way of telling capistrano 2.1 to use export rather than checkout
set :deploy_via, :export
set :runner, "root"
set :mongrel_conf, "#{deploy_to}/current/config/mongrel_cluster.yml"

role :app, "92.243.7.238"
role :web, "92.243.7.238"
role :db,  "92.243.7.238", :primary => true

namespace :deploy do
  task :restart do
    restart_mongrel_cluster
  end
end
