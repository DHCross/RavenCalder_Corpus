#!/usr/bin/env python3
"""
Raven AI Protocols Validator
Validates the 20-document context configuration for GPT systems
"""

import yaml
import os
import sys

def validate_raven_protocols():
    """Validate the raven_ai_protocols.yaml configuration"""
    
    base_path = "/home/runner/work/RavenCalder_Corpus/RavenCalder_Corpus"
    config_file = os.path.join(base_path, "raven_ai_protocols.yaml")
    
    if not os.path.exists(config_file):
        print("❌ raven_ai_protocols.yaml not found")
        return False
    
    try:
        with open(config_file, 'r') as f:
            config = yaml.safe_load(f)
        
        raven_config = config['raven_ai_protocols']
        
        print("=== Raven AI Protocols Validation ===")
        print(f"✅ Configuration version: {raven_config['version']}")
        print(f"✅ Max context files: {raven_config['gpt_optimization']['max_context_files']}")
        
        # Validate file counts
        priority_docs = raven_config['priority_documents']
        tier1_files = priority_docs['tier_1_foundational']
        tier2_files = priority_docs['tier_2_operational']
        tier3_files = priority_docs['tier_3_diagnostic']
        
        tier1_count = len(tier1_files)
        tier2_count = len(tier2_files)
        tier3_count = len(tier3_files)
        total_count = tier1_count + tier2_count + tier3_count
        
        print(f"\n=== File Distribution ===")
        print(f"Tier 1 (Foundational): {tier1_count} files")
        print(f"Tier 2 (Operational): {tier2_count} files")
        print(f"Tier 3 (Diagnostic): {tier3_count} files")
        print(f"Total: {total_count} files")
        
        if total_count == 20:
            print("✅ Perfect 20-file configuration!")
        else:
            print(f"⚠️ Expected 20 files, found {total_count}")
            return False
        
        # Validate file existence
        print(f"\n=== File Existence Check ===")
        missing_files = []
        
        all_files = tier1_files + tier2_files + tier3_files
        
        for i, file_path in enumerate(all_files, 1):
            full_path = os.path.join(base_path, file_path)
            if os.path.exists(full_path):
                print(f"{i:2d}. ✅ {file_path}")
            else:
                print(f"{i:2d}. ❌ {file_path} - NOT FOUND")
                missing_files.append(file_path)
        
        if missing_files:
            print(f"\n❌ {len(missing_files)} files missing:")
            for file_path in missing_files:
                print(f"   - {file_path}")
            return False
        else:
            print(f"\n✅ All {total_count} files exist and are accessible")
        
        print(f"\n=== Validation Summary ===")
        print("✅ Configuration is valid and ready for GPT context use")
        print("✅ All priority files exist")
        print("✅ 20-document limit respected")
        
        return True
        
    except Exception as e:
        print(f"❌ Error validating configuration: {e}")
        return False

if __name__ == "__main__":
    success = validate_raven_protocols()
    sys.exit(0 if success else 1)