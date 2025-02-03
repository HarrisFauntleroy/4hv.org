# frozen_string_literal: true

source "https://rubygems.org"
ruby "3.4.1"

# -------- Core Rails --------
gem "rails", ">= 7.1.3.2", "< 7.3"
# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false
# Use pg as the database for Active Record
gem "pg", "~> 1.1"
# Use the Puma web server [https://github.com/puma/puma]
gem "puma", ">= 5.0"
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: %i[mswin mswin64 mingw x64_mingw jruby]

# -------- Frontend & Asset Pipeline --------
# Replace the asset pipeline with Propshaft
gem "sprockets-rails"
# Use JavaScript with ESM import maps [https://github.com/rails/importmap-rails]
gem "importmap-rails"
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem "jbuilder"

# -------- Hotwire Stack --------
# Hotwire's SPA-like page accelerator [https://turbo.hotwired.dev]
gem "turbo-rails"
# Hotwire's modest JavaScript framework [https://stimulus.hotwired.dev]
gem "stimulus-rails"

# -------- Authentication & Authorization --------
gem "devise", "~> 4.9"
gem "pundit"

# -------- UI Components & Pagination --------
gem "view_component", "~> 3.12"
gem "kaminari"
gem "pagy", "~> 8.4"

# -------- Security & Best Practices --------
gem "secure_headers"
gem "strong_migrations"

# -------- Code Formatting --------
gem "erb-formatter", "~> 0.7.2"

# Development & Test Environment
group :development, :test do
 # Debugging
 gem "byebug"
 gem "debug", platforms: %i[mri mswin mswin64 mingw x64_mingw]

 # Testing
 gem "factory_bot_rails"
 gem "faker"
 gem "pundit-matchers"
 gem "rails-controller-testing"
 gem "rspec"
 gem "rspec-rails"

 # Code Quality
 gem "bullet"
 gem "reek"
 gem "rails_best_practices"
 gem "fasterer"

 # Rubocop & Extensions
 gem "rubocop"
 gem "rubocop-capybara"
 gem "rubocop-factory_bot"
 gem "rubocop-i18n"
 gem "rubocop-performance"
 gem "rubocop-rails"
 gem "rubocop-rake"
 gem "rubocop-rspec"
 gem "rubocop-rspec_rails"
 gem "rubocop-thread_safety"
 gem "rubocop-rails-omakase"
end

group :development do
 # Code Analysis & Documentation
 gem "annotate"
 gem "solargraph"
 gem "solargraph-rails"

 # Security Analysis
 gem "brakeman"
 gem "bundler-audit"

 # Development Tools
 gem "web-console"
 gem "i18n-tasks", "~> 1.0.13"
 gem "rails_live_reload"
end

group :test do
 # Integration Testing
 gem "capybara"
 gem "selenium-webdriver"
 gem "webdrivers"

 # Test Helpers & Coverage
 gem "shoulda-matchers", "~> 6.0"
 gem "simplecov", require: false
 gem "simplecov-formatter-badge", require: false
end

# -------- Commented out gems --------
# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"
