require "spec_helper"

describe "components_path" do
  before do
    visit components_path
  end

  it "displays G5 Widget Garden" do
    expect(page).to have_content "G5 Widget Garden"
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

    it "has a summary" do
      all(".h-g5-component").each do |widget|
        expect(widget.find(".p-summary")).to be_present
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
  end

end
