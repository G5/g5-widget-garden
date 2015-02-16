require "microformats2"

module G5ComponentGarden
  COMPONENT_PATH = "public/static/components/"
  META = JSON.parse File.read('.gitmeta')

  class << self
    def last_modified
      # used in production for http conditional get caching
      # every deploy creates this directory
      # so the mtime is updated after a deploy
      FileUtils.touch(COMPONENT_PATH) if Rails.env.development?
      File.new(COMPONENT_PATH).mtime.utc
    end

    def all
      # each directory in public/components is a component
      components = file_paths(COMPONENT_PATH, "*")
      # parse from directory each one and return them as an Array
      components.map do |component_directory|
        parse_from_directory(component_directory)
      end
    end

    def find(slug)
      # look for directory in public/components with name slug
      component = file_paths(COMPONENT_PATH, slug).first
      # parse from directory
      parse_from_directory(component)
    end

    def parse_from_directory(directory)
      # assign name, summary, and preview from index.html
      component = Microformats2.parse(File.join(directory, "index.html")).g5_components.first
      relative_directory = get_directory(directory)

      # assign uid as slug from directory name for now
      uid = directory.split("/").last
      component.add_property("u-g5-uid", uid)
      component.add_property("p-modified", get_directory_timestamp(directory))

      thumbnail_path = "#{relative_directory}/images/thumbnail.png"
      component.add_property("u-photo", thumbnail_path)

      component.add_property("u-g5-edit_template", edit_path(relative_directory))
      component.add_property("u-g5-show_template", show_path(relative_directory))

      add_javascripts(component, directory, relative_directory)

      e_content = merge_edit_and_show_markup(directory)
      component.add_property("e-content", e_content)

      assemble_component_assets(component, directory)
    end

    def add_javascripts(component, directory, relative_directory)
      if File.exist?(edit_javascript_path(directory))
        component.add_property("u-g5-edit_javascript", edit_javascript_path(relative_directory))
      end
      if File.exist?(show_javascript_path(directory))
        component.add_property("u-g5-show_javascript", show_javascript_path(relative_directory))
      end
    end

    def edit_javascript_path(directory)
      "#{directory}/javascripts/edit.js"
    end

    def show_javascript_path(directory)
      "#{directory}/javascripts/show.js"
    end

    def edit_path(directory)
      "#{directory}/edit.html"
    end

    def show_path(directory)
      "#{directory}/show.html"
    end

    def assemble_component_assets(component, directory)
      component_assets = file_basenames(directory, "*").select{ |f| ['stylesheets', 'images'].include?(f) }
      component_assets.each do |component_asset|
        folder = component_asset.singularize
        file_paths_without_public(directory, component_asset, "*").each do |file|
          component.add_property("u-g5-#{folder}", file)
        end
      end
      component
    end

    def file_basenames(*path)
      Dir[File.join(path)].map { |d| File.basename(d) }
    end

    def file_paths(*path)
      Dir[File.join(path)].map { |d| File.path(d) }
    end

    def file_paths_without_public(*path)
      Dir[File.join(path)].map { |d| File.path(d).split("/")[1..-1].join("/") }
    end

    def get_directory(directory)
      directory.split("/")[1..-1].join("/")
    end

    def get_directory_timestamp(directory)
      Time.zone.at(META[directory]['mtime'])
    end

    def merge_edit_and_show_markup(directory)
      markup = ""
      if File.exist?(edit_path(directory))
        markup << "<!-- BEGIN EDIT FORM MARKUP -->\n" +
                  get_html(edit_path(directory))      +
                  "\n<!-- END EDIT FORM MARKUP -->\n\n"
      end

      if File.exist?(show_path(directory))
        markup << "<!-- BEGIN SHOW MARKUP -->\n" +
                  get_html(show_path(directory)) +
                  "\n<!-- END SHOW MARKUP -->"
      end

      markup
    end

    def get_html(file)
      open(file).read
    end

  end # class << self
end