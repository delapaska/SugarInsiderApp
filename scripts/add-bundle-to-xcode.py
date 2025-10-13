#!/usr/bin/env python3

import json
import subprocess
import uuid
import sys

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
        return True

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = add_bundle_to_xcode_project()
    sys.exit(0 if success else 1)