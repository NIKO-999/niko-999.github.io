#!/usr/bin/env ruby
# Adds the widget extension to the Xcode project that `cap add ios` just made, wires the
# App Group into both targets, and embeds the extension in the app.
# Run from ios-wrapper/ with: BUNDLE_ID=... TEAM_ID=... BUILD_NUMBER=... ruby native/add-widgets.rb
require 'xcodeproj'
require 'fileutils'

bundle = ENV.fetch('BUNDLE_ID')
team   = ENV.fetch('TEAM_ID')
build  = ENV.fetch('BUILD_NUMBER', '1')
version = ENV.fetch('MARKETING_VERSION', '1.1')
group  = "group.#{bundle}"
root   = File.expand_path('..', __dir__)
ios    = File.join(root, 'ios', 'App')
name   = 'LiftWidgets'

# the sources go inside the Xcode project folder
dest = File.join(ios, name)
FileUtils.rm_rf(dest)
FileUtils.cp_r(File.join(root, 'native', name), dest)
FileUtils.cp(File.join(root, 'capacitor-widget-bridge', 'ios', 'Sources', 'LiftWidgetsPlugin', 'LiftRestAttributes.swift'), dest)

entitlements = <<~PLIST
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0"><dict>
    <key>com.apple.security.application-groups</key>
    <array><string>#{group}</string></array>
  </dict></plist>
PLIST
File.write(File.join(dest, "#{name}.entitlements"), entitlements)
File.write(File.join(ios, 'App', 'App.entitlements'), entitlements)

proj = Xcodeproj::Project.open(File.join(ios, 'App.xcodeproj'))
app = proj.targets.find { |t| t.name == 'App' } or abort 'no App target'

ext = proj.new_target(:app_extension, name, :ios, '16.1', nil, :swift)
grp = proj.main_group.new_group(name, name)
Dir[File.join(dest, '*.swift')].sort.each { |f| ext.add_file_references([grp.new_reference(File.basename(f))]) }
grp.new_reference('Info.plist')
grp.new_reference("#{name}.entitlements")

ext.build_configurations.each do |c|
  s = c.build_settings
  s['PRODUCT_BUNDLE_IDENTIFIER'] = "#{bundle}.widgets"
  s['PRODUCT_NAME'] = '$(TARGET_NAME)'
  s['INFOPLIST_FILE'] = "#{name}/Info.plist"
  s['CODE_SIGN_ENTITLEMENTS'] = "#{name}/#{name}.entitlements"
  s['SWIFT_VERSION'] = '5.0'
  s['IPHONEOS_DEPLOYMENT_TARGET'] = '16.1'
  s['TARGETED_DEVICE_FAMILY'] = '1'
  s['DEVELOPMENT_TEAM'] = team
  s['CODE_SIGN_STYLE'] = 'Automatic'
  s['MARKETING_VERSION'] = version
  s['CURRENT_PROJECT_VERSION'] = build
  s['SKIP_INSTALL'] = 'YES'
  s['GENERATE_INFOPLIST_FILE'] = 'NO'
  s['LD_RUNPATH_SEARCH_PATHS'] = '$(inherited) @executable_path/Frameworks @executable_path/../../Frameworks'
end

# the app: entitlements, and the older deployment target it was already built for
grp_app = proj.main_group.find_subpath('App', false) || proj.main_group
grp_app.new_reference('App.entitlements') rescue nil
app.build_configurations.each do |c|
  c.build_settings['CODE_SIGN_ENTITLEMENTS'] = 'App/App.entitlements'
  c.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '15.0'
end

# embed the extension in the app and make the app depend on it
embed = app.new_copy_files_build_phase('Embed Foundation Extensions')
embed.symbol_dst_subfolder_spec = :plug_ins
bf = embed.add_file_reference(ext.product_reference, true)
bf.settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
app.add_dependency(ext)

proj.save
puts "widgets added: #{bundle}.widgets, group #{group}"
