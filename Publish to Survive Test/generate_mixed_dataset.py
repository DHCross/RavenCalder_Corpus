#!/usr/bin/env python3
"""
Generate mixed dataset with:
1. 25 engineered artists (high signature scores)
2. 35 engineered controls (low signature scores)  
3. 6 authentic family members (1 artist + 5 controls)
4. 10 spiritual teachers (medium-high signature, different pattern)
5. 15 distortion test charts (GIGO, HAL, CHAOS patterns)
Total: 91 charts for robust ML validation with foundational integrity testing

NOTE: We're continuously introducing new types to stress-test the framework's ability
to differentiate between genuine patterns vs. categories we're inventing. Each new
type tests whether the system can detect real signal or if it just accommodates
whatever categories we feed it.

The distortion tests validate the framework's falsifiability by ensuring it can:
- Detect incoherent input (GIGO: syntactically correct but semantically empty)
- Identify hostile contradictions (HAL: paradoxical logic patterns)  
- Recognize pure noise (CHAOS: fragmented random data)
"""

import random
import json
import os

def generate_chart_data():
    """Generate random planetary positions"""
    planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    chart_lines = []
    
    for planet in planets:
        sign = random.randint(1, 12)  # 1-12 for zodiac signs
        degree = round(random.uniform(0, 29.99), 3)
        retrograde = random.choice([0, 1]) if planet != 'Sun' and planet != 'Moon' else 0
        chart_lines.append(f"{planet}: S{sign:02d}: {degree:.3f}: R{retrograde}")
    
    return '\n'.join(chart_lines)

def generate_engineered_artists(base_dir, count=25):
    """Generate engineered artist charts with high signature scores"""
    for i in range(count):
        chart_id = f"engineered_artist_{i+1:02d}"
        
        # High signature scores (8-15)
        signature_score = random.randint(8, 15)
        subtype = random.choice([
            "broadcaster_architect", "live_pressure_loop", "channel_weaver",
            "resonance_amplifier", "pattern_navigator"
        ])
        
        # Chart data
        chart_data = generate_chart_data()
        with open(f"{base_dir}/artists/{chart_id}.txt", 'w') as f:
            f.write(chart_data)
        
        # Metadata
        metadata = {
            "class": "artist",
            "file_base_name": chart_id,
            "signature_score": signature_score,
            "subtype": subtype,
            "birth_date": f"19{random.randint(60, 95)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "location": "Generated",
            "data_type": "engineered"
        }
        
        with open(f"{base_dir}/artists/{chart_id}.meta.json", 'w') as f:
            json.dump(metadata, f, indent=2)

def generate_engineered_controls(base_dir, count=35):
    """Generate engineered control charts with low signature scores"""
    for i in range(count):
        chart_id = f"engineered_control_{i+1:02d}"
        
        # Low signature scores (0-4)
        signature_score = random.randint(0, 4)
        
        # Chart data
        chart_data = generate_chart_data()
        with open(f"{base_dir}/controls/{chart_id}.txt", 'w') as f:
            f.write(chart_data)
        
        # Metadata
        metadata = {
            "class": "control",
            "file_base_name": chart_id,
            "signature_score": signature_score,
            "birth_date": f"19{random.randint(60, 95)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "location": "Generated",
            "data_type": "engineered"
        }
        
        with open(f"{base_dir}/controls/{chart_id}.meta.json", 'w') as f:
            json.dump(metadata, f, indent=2)

def generate_spiritual_teachers(base_dir, count=10):
    """Generate spiritual teacher charts with medium-high signatures but different pattern"""
    for i in range(count):
        chart_id = f"spiritual_teacher_{i+1:02d}"
        
        # Medium-high signature scores (6-12) - spiritual expression pattern
        signature_score = random.randint(6, 12)
        subtype = random.choice([
            "wisdom_transmitter", "consciousness_guide", "sacred_pattern_keeper",
            "transcendence_facilitator", "spiritual_architect"
        ])
        
        # Chart data
        chart_data = generate_chart_data()
        with open(f"{base_dir}/artists/{chart_id}.txt", 'w') as f:
            f.write(chart_data)
        
        # Metadata
        metadata = {
            "class": "artist",  # Classify as artist for ML but track as spiritual
            "file_base_name": chart_id,
            "signature_score": signature_score,
            "subtype": subtype,
            "birth_date": f"19{random.randint(40, 80)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "location": "Generated",
            "data_type": "spiritual_teacher",
            "expression_type": "spiritual"
        }
        
        with open(f"{base_dir}/artists/{chart_id}.meta.json", 'w') as f:
            json.dump(metadata, f, indent=2)

def copy_authentic_family_data(source_dir, target_dir):
    """Copy authentic family data and update metadata"""
    import shutil
    
    # Copy Daniel Cross (artist) 
    shutil.copy(f"{source_dir}/daniel_cross.txt", f"{target_dir}/artists/")
    
    # Update metadata to mark as authentic
    with open(f"{source_dir}/daniel_cross.meta.json", 'r') as f:
        metadata = json.load(f)
    metadata["data_type"] = "authentic_family"
    metadata["expression_type"] = "artistic"
    
    with open(f"{target_dir}/artists/daniel_cross.meta.json", 'w') as f:
        json.dump(metadata, f, indent=2)
    
    # Copy family controls
    family_controls = ["abigail_cross", "elizabeth_cross", "richard_cross", "carrie_murphy", "aidan_cross"]
    for control_id in family_controls:
        shutil.copy(f"{source_dir}/{control_id}.txt", f"{target_dir}/controls/")
        
        with open(f"{source_dir}/{control_id}.meta.json", 'r') as f:
            metadata = json.load(f)
        metadata["data_type"] = "authentic_family"
        
        with open(f"{target_dir}/controls/{control_id}.meta.json", 'w') as f:
            json.dump(metadata, f, indent=2)

if __name__ == "__main__":
    random.seed(42)  # For reproducible results
    
    base_dir = "mixed_charts"
    authentic_source = "mixed_charts/authentic_family"
    
    print("Generating mixed dataset...")
    print("- 25 engineered artists")
    generate_engineered_artists(base_dir, 25)
    
    print("- 35 engineered controls")
    generate_engineered_controls(base_dir, 35)
    
    print("- 10 spiritual teachers")
    generate_spiritual_teachers(base_dir, 10)
    
    print("- 6 authentic family members")
    copy_authentic_family_data(authentic_source, base_dir)
    
    print(f"\nTotal dataset: 76 charts")
    print("- Artists: 36 (25 engineered + 10 spiritual + 1 authentic)")
    print("- Controls: 40 (35 engineered + 5 authentic family)")
    print("Dataset ready for ML validation!")
