# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ForumComponent, type: :component do
  let(:user) { create(:user) }
  let(:category) { create(:category, user:) }
  let(:forum) { create(:forum, user:, category:) }
end
