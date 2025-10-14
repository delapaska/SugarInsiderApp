#!/usr/bin/env python3

import json
import subprocess
import uuid
import sys
import os

def add_bundle_to_xcode_project():
    try:
        # Get current project structure
        result = subprocess.run(['plutil', '-convert', 'json', '-o', '-', 'SugarInsiderApp.xcodeproj/project.pbxproj'],
                               capture_output=True, text=True)

        if result.returncode != 0:
            print(f"❌ Failed to convert pbxproj to JSON: {result.stderr}")
            return False

        project = json.loads(result.stdout)

        # Generate UUIDs for the bundle file
        file_ref_uuid = str(uuid.uuid4()).replace('-', '').upper()[:24]
        build_file_uuid = str(uuid.uuid4()).replace('-', '').upper()[:24]

        # Find the main target and source group
        main_target_uuid = None
        sources_group_uuid = None

        for uuid_key, obj in project['objects'].items():
            if obj.get('isa') == 'PBXNativeTarget' and obj.get('name') == 'SugarInsiderApp':
                main_target_uuid = uuid_key
            elif obj.get('isa') == 'PBXGroup' and obj.get('name') == 'SugarInsiderApp':
                sources_group_uuid = uuid_key

        if not main_target_uuid or not sources_group_uuid:
            print("❌ Could not find main target or source group")
            return False

        # Check if main.jsbundle already exists
        for uuid_key, obj in project['objects'].items():
            if (obj.get('isa') == 'PBXFileReference' and
                obj.get('name') == 'main.jsbundle'):
                print("✅ main.jsbundle already exists in project")
                return True

        # Add file reference
        project['objects'][file_ref_uuid] = {
            'isa': 'PBXFileReference',
            'lastKnownFileType': 'text',
            'name': 'main.jsbundle',
            'path': 'main.jsbundle',
            'sourceTree': '<group>'
        }

        # Add build file
        project['objects'][build_file_uuid] = {
            'isa': 'PBXBuildFile',
            'fileRef': file_ref_uuid
        }

        # Add to source group
        if 'children' not in project['objects'][sources_group_uuid]:
            project['objects'][sources_group_uuid]['children'] = []
        project['objects'][sources_group_uuid]['children'].append(file_ref_uuid)

        # Add to resources build phase
        resources_phase_found = False
        for uuid_key, obj in project['objects'].items():
            if (obj.get('isa') == 'PBXResourcesBuildPhase' and
                uuid_key in project['objects'][main_target_uuid]['buildPhases']):
                if 'files' not in obj:
                    obj['files'] = []
                obj['files'].append(build_file_uuid)
                resources_phase_found = True
                break

        if not resources_phase_found:
            print("❌ Could not find Resources build phase")
            return False

        # Convert back to plist and save
        json_str = json.dumps(project, indent=2)
        with open('temp_project.json', 'w') as f:
            f.write(json_str)

        # Convert back to plist
        result = subprocess.run(['plutil', '-convert', 'xml1', '-o',
                                'SugarInsiderApp.xcodeproj/project.pbxproj', 'temp_project.json'])

        if result.returncode != 0:
            print("❌ Failed to convert JSON back to plist")
            return False

        # Cleanup
        subprocess.run(['rm', '-f', 'temp_project.json'])

        print(f"✅ Added main.jsbundle to Xcode project (FileRef: {file_ref_uuid})")

        # Also add assets folder if it exists
        if add_assets_folder_to_project(project, sources_group_uuid, main_target_uuid):
            print("✅ Added assets folder to Xcode project")

        # Convert back to plist and save again with assets
        json_str = json.dumps(project, indent=2)
        with open('temp_project.json', 'w') as f:
            f.write(json_str)

        # Convert back to plist
        result = subprocess.run(['plutil', '-convert', 'xml1', '-o',
                                'SugarInsiderApp.xcodeproj/project.pbxproj', 'temp_project.json'])

        if result.returncode != 0:
            print("❌ Failed to convert JSON back to plist")
            return False

        # Cleanup
        subprocess.run(['rm', '-f', 'temp_project.json'])

        return True

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def add_assets_folder_to_project(project, sources_group_uuid, main_target_uuid):
    """Add assets folder to Xcode project if it exists"""
    try:
        # Check if assets folder exists (check both current dir and parent dir)
        assets_path = None
        if os.path.exists('assets'):
            assets_path = 'assets'
        elif os.path.exists('../assets'):
            assets_path = '../assets'
        elif os.path.exists('../../assets'):
            assets_path = '../../assets'

        if not assets_path:
            print("ℹ️ Assets folder not found in current, parent, or grandparent directory, skipping")
            return False

        print(f"📁 Found assets at: {assets_path}")

        # Count assets for logging
        asset_count = 0
        for root, dirs, files in os.walk(assets_path):
            asset_count += len([f for f in files if f.endswith(('.png', '.jpg', '.jpeg'))])

        print(f"📦 Found {asset_count} image assets in assets folder")

        # Check if assets folder is already in project
        for uuid_key, obj in project['objects'].items():
            if (obj.get('isa') == 'PBXFileReference' and
                obj.get('path') == 'assets' and
                obj.get('lastKnownFileType') == 'folder'):
                print("✅ Assets folder already exists in project")
                return True

        # Generate UUID for assets folder
        assets_ref_uuid = str(uuid.uuid4()).replace('-', '').upper()[:24]
        assets_build_uuid = str(uuid.uuid4()).replace('-', '').upper()[:24]

        # Add assets folder reference (use relative path for Xcode project)
        # For Xcode, we always want to reference as 'assets' regardless of where we found it
        project['objects'][assets_ref_uuid] = {
            'isa': 'PBXFileReference',
            'lastKnownFileType': 'folder',
            'name': 'assets',
            'path': 'assets',
            'sourceTree': '<group>'
        }

        # Add build file for assets folder
        project['objects'][assets_build_uuid] = {
            'isa': 'PBXBuildFile',
            'fileRef': assets_ref_uuid
        }

        # Add to source group
        if 'children' not in project['objects'][sources_group_uuid]:
            project['objects'][sources_group_uuid]['children'] = []
        if assets_ref_uuid not in project['objects'][sources_group_uuid]['children']:
            project['objects'][sources_group_uuid]['children'].append(assets_ref_uuid)

        # Add to resources build phase for proper inclusion in .ipa
        resources_phase_found = False
        for uuid_key, obj in project['objects'].items():
            if (obj.get('isa') == 'PBXResourcesBuildPhase' and
                uuid_key in project['objects'][main_target_uuid]['buildPhases']):
                if 'files' not in obj:
                    obj['files'] = []
                if assets_build_uuid not in obj['files']:
                    obj['files'].append(assets_build_uuid)
                    resources_phase_found = True
                    break

        if not resources_phase_found:
            print("⚠️ Could not find Resources build phase for assets")

        print(f"✅ Added assets folder to Xcode project (FileRef: {assets_ref_uuid}, BuildFile: {assets_build_uuid})")
        print(f"📁 This includes {asset_count} image assets")
        return True

    except Exception as e:
        print(f"❌ Error adding assets folder: {str(e)}")
        return False

if __name__ == "__main__":
    success = add_bundle_to_xcode_project()
    sys.exit(0 if success else 1)