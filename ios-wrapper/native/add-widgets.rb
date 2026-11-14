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
# the app also saves workouts to Apple Health
app_entitlements = entitlements.sub('</dict></plist>', "  <key>com.apple.developer.healthkit</key>\n  <true/>\n  <key>com.apple.developer.healthkit.access</key>\n  <array/>\n</dict></plist>")
File.write(File.join(ios, 'App', 'App.entitlements'), app_entitlements)

proj = Xcodeproj::Project.open(File.join(ios, 'App.xcodeproj'))
app = proj.targets.find { |t| t.name == 'App' } or abort 'no App target'

ext = proj.new_target(:app_extension, name, :ios, '16.2', nil, :swift)
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
  s['IPHONEOS_DEPLOYMENT_TARGET'] = '16.2'
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

# ── the Apple Watch app: a single-target watchOS app, embedded in the iPhone app
wname = 'LiftWatch'
wdest = File.join(ios, wname)
FileUtils.rm_rf(wdest)
FileUtils.cp_r(File.join(root, 'native', wname), wdest)
icons = File.join(wdest, 'Assets.xcassets', 'AppIcon.appiconset')
FileUtils.mkdir_p(icons)
FileUtils.cp(File.join(root, 'assets', 'icon-only.png'), File.join(icons, 'icon.png'))
File.write(File.join(icons, 'Contents.json'), '{"images":[{"filename":"icon.png","idiom":"universal","platform":"watchos","size":"1024x1024"}],"info":{"author":"xcode","version":1}}')
File.write(File.join(wdest, 'Assets.xcassets', 'Contents.json'), '{"info":{"author":"xcode","version":1}}')

watch = proj.new_target(:application, wname, :watchos, '9.0', nil, :swift)
wgrp = proj.main_group.new_group(wname, wname)
Dir[File.join(wdest, '*.swift')].sort.each { |f| watch.add_file_references([wgrp.new_reference(File.basename(f))]) }
assets = wgrp.new_reference('Assets.xcassets')
watch.resources_build_phase.add_file_reference(assets)
watch.build_configurations.each do |c|
  s = c.build_settings
  s['PRODUCT_BUNDLE_IDENTIFIER'] = "#{bundle}.watchkitapp"
  s['PRODUCT_NAME'] = '$(TARGET_NAME)'
  s['SDKROOT'] = 'watchos'
  s['SUPPORTED_PLATFORMS'] = 'watchos watchsimulator'
  s['TARGETED_DEVICE_FAMILY'] = '4'
  s['WATCHOS_DEPLOYMENT_TARGET'] = '9.0'
  s['SWIFT_VERSION'] = '5.0'
  s['DEVELOPMENT_TEAM'] = team
  s['CODE_SIGN_STYLE'] = 'Automatic'
  s['MARKETING_VERSION'] = version
  s['CURRENT_PROJECT_VERSION'] = build
  s['GENERATE_INFOPLIST_FILE'] = 'YES'
  s['INFOPLIST_KEY_CFBundleDisplayName'] = 'Lift'
  s['INFOPLIST_KEY_WKApplication'] = 'YES'
  s['INFOPLIST_KEY_WKCompanionAppBundleIdentifier'] = bundle
  s['ASSETCATALOG_COMPILER_APPICON_NAME'] = 'AppIcon'
  s['SKIP_INSTALL'] = 'YES'
  s['LD_RUNPATH_SEARCH_PATHS'] = '$(inherited) @executable_path/Frameworks'
end
wembed = app.new_copy_files_build_phase('Embed Watch Content')
wembed.symbol_dst_subfolder_spec = :products_directory
wembed.dst_path = '$(CONTENTS_FOLDER_PATH)/Watch'
wbf = wembed.add_file_reference(watch.product_reference, true)
wbf.settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
app.add_dependency(watch)

proj.save
puts "widgets added: #{bundle}.widgets, group #{group}"
