require 'highline/import'
require "active_support/all"

namespace :dev do 
  desc "Builds widget configuration markup."
    task :option_markup => :environment do
      option_list = []
      @continue = :yes
      while @continue == :yes
        config = {}

        name = ask("Configuration Name: ") { |q| q.default = "none" }
        default_value = ask("Default Value: ")

        choose do |menu|
          menu.prompt = "Options: "
          menu.choices(:url_encode, :none) do |chosen|
            @option = chosen != :none ? "| #{chosen} " : "" 
          end
        end

        config[:name] = name
        config[:config_name] = name.downcase.parameterize.underscore
        config[:default_value] = default_value
        config[:option] = @option

        option_list << config

        choose do |menu|
          menu.prompt = "Add Another Option? "
          menu.choices(:yes, :no) do |chosen|
            @continue = chosen 
          end
        end
                
      end

      edit_markup = option_list.inject("") do |html, config|
        html << edit_markup(config)
      end

      index_markup = option_list.inject("") do |html, config|
        html << index_markup(config)
      end

      puts "========Edit Markup======="
      puts edit_markup
      puts "=======Index Markup======="
      puts index_markup
   end

   def edit_markup(config)
     %Q(
<div class="form-field">
  {{ widget.#{config[:config_name]}.id_hidden_field }}
  <label for="{{ widget.#{config[:config_name]}.value_field_id }}" >
    #{config[:name]}
  </label>
  <input type="text"
    placeholder="#{config[:default_value]}"
    id="{{ widget.#{config[:config_name]}.value_field_id }}"
    name="{{ widget.#{config[:config_name]}.value_field_name }}"
    value="{{ widget.#{config[:config_name]}.value #{config[:option]}}}"
  />
</div>
     )
   end

   def index_markup(config)
     %Q(
<dd class="e-g5-property h-g5-property">
  <dl>
    <dt>#{config[:name]}</dt>
    <dd class="p-g5-name">#{config[:config_name]}</dd>
    <dt>Editable</dt>
    <dd class="p-g5-editable">true</dd>
    <dt>Default Value</dt>
    <dd class="p-g5-default-value">#{config[:default_value]}</dd>
  </dl>
</dd>
      )
   end

end
