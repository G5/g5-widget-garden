require "spec_helper"

describe "components_path" do
  before do
    visit components_path
  end

  it "displays G5 Widget Garden" do
    expect(page).to have_content "G5 Widget Garden"
  end

  it "has widgets marked up as .h-g5-component" do
    expect(all(".h-g5-component").length).not_to eq(0)
  end

  describe "every widget" do
    it "has a name" do
      all(".h-g5-component").each do |widget|
        expect(widget.find("h2.p-name")).to be_present
      end
    end

    it "has a uid" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".u-uid")).to be_present
      end
    end

    it "has a widget_id" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".p-widget-id")).to be_present
      end
    end

    it "has a summary" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".p-summary")).to be_present
      end
    end

    it "has a popover" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".e-popover")).to be_present
      end
    end

    it "has a photo" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".u-photo")).to be_present
      end
    end

    it "has content" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".e-content")).to be_present
      end
    end

    it "has settings" do
      all(".h-g5-component").each do |widget|
        expect(widget.all(".e-g5-property-group.h-g5-property-group")).to be_present
      end
    end

    it "has all widget_id are unique" do
      expect(all(".p-widget-id").map(&:text).uniq.length).to eq(all(".h-g5-component").length)
    end
  end

  describe "some widgets" do
    it "have targets" do
      pending "implement this spec when a widget goes live with targets"
      expect(all(".hg5component .ug5target").length).not_to eq(0)
    end

    it "have stylesheets" do
      expect(all(".h-g5-component .u-g5-stylesheet").length).not_to eq(0)
    end

    it "have show-javascripts" do
      expect(all(".h-g5-component .u-g5-show-javascript").length).not_to eq(0)
    end

    it "have lib-javascripts" do
      expect(all(".h-g5-component .u-g5-lib-javascript").length).not_to eq(0)
    end
  end

  describe "g5 internal widgets" do
    let(:g5_internal_widgets) do
      all(".h-g5-component .p-widget-type", text: "G5 Internal").map do |widget|
        widget.find(:xpath, "..").first(".p-name").text
      end
    end

  end
end
