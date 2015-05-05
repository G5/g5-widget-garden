require 'spec_helper'
require 'g5_component_garden'

describe G5ComponentGarden do
  before :each do
    stub_const("G5ComponentGarden::COMPONENT_PATH", "spec/support/components")
  end

  describe "all" do
    let(:components) { G5ComponentGarden.all }

    it "returns an Array" do
      components.should be_an_instance_of Array
    end
    it "returns an Array of components" do
      components.first.should be_an_instance_of HG5Component
    end
  end

  describe "find" do
    let(:component) { G5ComponentGarden.find("name-of-component") }

    it "returns a component" do
      component.should be_an_instance_of HG5Component
    end

    describe "#uid" do
      it "is an Url Property" do
        component.g5_uid.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the uid" do
        component.g5_uid.to_s.should == "name-of-component"
      end
    end

    describe "#name" do
      it "is a Text Property" do
        component.name.should be_an_instance_of Microformats2::Property::Text
      end

      it "contains the name" do
        component.name.to_s.should == "Name of Component"
      end
    end

    describe "#widget_id" do
      it "is a Text Property" do
        component.widget_id.should be_an_instance_of Microformats2::Property::Text
      end

      it "contains the name" do
        component.widget_id.to_s.should == "1"
      end
    end

    describe "#modified" do
      it "is a Text Property" do
        component.widget_id.should be_an_instance_of Microformats2::Property::Text
      end

      it "contains the time last modified" do
        component.modified.to_s.should == "Mon, 17 Nov 2014 17:59:45 UTC +00:00"
      end
    end

    describe "#photo" do
      it "is a Url Property" do
        component.photo.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the photo" do
        component.photo.to_s.should == "support/components/name-of-component/images/thumbnail.png"
      end
    end

    describe "#photos" do
      it "is an Array" do
        component.photos.should be_an_instance_of Array
      end

      it "contains the photo" do
        component.photos.first.to_s.should == "support/components/name-of-component/images/thumbnail.png"
      end
    end

    describe "#summary" do
      it "is a Text Property" do
        component.summary.should be_an_instance_of Microformats2::Property::Text
      end

      it "contains the summary" do
        component.summary.to_s.should == "What this component does/looks like"
      end

      it "contains a Popover description with HTML" do
        component.popover.should be_an_instance_of Microformats2::Property::Embedded
      end
    end

    describe "#targets" do
      it "is a Url Property" do
        component.g5_targets.first.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains a target UID" do
        component.g5_targets.first.to_s.should == "http://example.herokuapp.com/apps/1s7nay2b-storage-client"
      end
    end

    describe "#content" do
      it "is an Embedded Property" do
        component.content.should be_an_instance_of Microformats2::Property::Embedded
      end

      context "edit" do
        it "contains the edit form markup" do
          component.content.to_s.should include "Edit HTML goes here"
        end

        it "functions without any edit HTML" do
          G5ComponentGarden.stub(:edit_path => "/path/to/some/non/existant/file.html")
          component.content.to_s.should_not include "Edit HTML goes here"
        end
      end

      context "show" do
        it "contains the show markup" do
          component.content.to_s.should include "Show HTML goes here"
        end

        it "functions without any show HTML" do
          G5ComponentGarden.stub(:show_path => "/path/to/some/non/existant/file.html")
          component.content.to_s.should_not include "Show HTML goes here"
        end
      end
    end

    describe "#images" do
      it "is an Array" do
        component.g5_images.should be_an_instance_of Array
      end

      it "contains images" do
        component.g5_images.map(&:to_s).should include("support/components/name-of-component/images/test.png")
      end
    end

    describe "#stylesheets with multiple files" do
      it "is an Array" do
        component.g5_stylesheets.should be_an_instance_of Array
      end

      it "contains the stylesheets" do
        component.g5_stylesheets.map(&:to_s).should include "support/components/name-of-component/stylesheets/name-of-component.css"
      end
    end

    describe "#g5_edit_template" do
      it "is a Url Property" do
        component.g5_edit_template.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the edit path" do
        component.g5_edit_template.to_s.should eq "support/components/name-of-component/edit.html"
      end
    end

    describe "#g5_show_template" do
      it "is a Url Property" do
        component.g5_show_template.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the show path" do
        component.g5_show_template.to_s.should eq "support/components/name-of-component/show.html"
      end
    end

    describe "#g5_edit_javascript" do
      it "is a Url Property" do
        component.g5_edit_javascript.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the edit path" do
        component.g5_edit_javascript.to_s.should eq "support/components/name-of-component/javascripts/edit.js"
      end
    end

    describe "#g5_show_javascript" do
      it "is a Url Property" do
        component.g5_show_javascript.should be_an_instance_of Microformats2::Property::Url
      end

      it "contains the show path" do
        component.g5_show_javascript.to_s.should eq "support/components/name-of-component/javascripts/show.js"
      end
    end

    describe "#property groups" do
      subject {  component.g5_property_groups }

      it "is an Array" do
        subject.should be_an_instance_of Array
      end

      it "contains Embedded Properties" do
        subject.first.should be_an_instance_of Microformats2::Property::Embedded
      end

      describe "categories" do
        subject { component.g5_property_groups.first.format.categories }

        it "is an Array" do
          subject.should be_an_instance_of Array
        end

        it "contains the category" do
          subject.first.to_s.should == "Instance"
        end
      end

      describe "g5_properties" do
        it "is an Array" do
          component.g5_property_groups.first.format.g5_properties.should be_an_instance_of Array
        end

        describe "property attributes" do
          subject { component.g5_property_groups.first.format.g5_properties.first.format }

          it "contains the attribute" do
            subject.g5_name.to_s.should == "username"
          end

          it "is editable" do
            subject.g5_editable.should be_true
          end

          it "has a default value" do
            subject.g5_default_value.to_s.should == "Twitter Feed"
          end
        end
      end
    end
  end
end
