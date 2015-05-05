# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
G5WidgetGarden::Application.initialize!

if Rails.env.development?
  Rails.logger = Le.new(ENV['LOGENTRIES_TOKEN'], debug: true)
else
  Rails.logger = Le.new(ENV['LOGENTRIES_TOKEN'])
end

