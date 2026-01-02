#!/usr/bin/env python3
"""
Add GIGO, HAL, and CHAOS distortion tests to existing dataset WITHOUT overwriting current data.

This preserves all existing work while adding foundational integrity tests to validate
the framework's falsifiability. The distortion tests prove the system can "fail with integrity"
by detecting incoherent input rather than fabricating patterns from noise.
"""

import random
import json
import os
import shutil

def generate_gigo_chart():
    """
    Generate GIGO (Garbage In, Garbage Out) - Syntactically correct but semantically empty
    
    Expected: ABE (At Boundary Edge) - structure of emptiness mapped
    """
    planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    chart_lines = []
    
    # All planets in "corporate neutral" pattern - technically valid but meaningless
    for i, planet in enumerate(planets):
        sign = ((i * 3) % 12) + 1  # Evenly distributed
        degree = 15.000  # All at exact midpoint - suspiciously uniform
        retrograde = 0  # No retrogrades - avoiding any "difficult" energy
        
        chart_lines.append(f"{planet}: S{sign:02d}: {degree:.3f}: R{retrograde}")
    
    return '\n'.join(chart_lines)

def generate_hal_chart():
    """
    Generate HAL (Hostile & Contradictory Logic) - Actively paradoxical patterns
    
    Expected: OSR (Outside Symbolic Range) - 12th house signal void, Double-Bind Consciousness
    """
    planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    chart_lines = []
    
    # Maximum tension through exact hard aspects
    cardinal_signs = [1, 4, 7, 10]  # Aries, Cancer, Libra, Capricorn
    
    for i, planet in enumerate(planets):
        sign = cardinal_signs[i % 4]  # Exact squares and oppositions
        degree = 0.000 if i % 2 == 0 else 29.999  # Crisis degrees
        retrograde = 1 if planet not in ['Sun', 'Moon'] else 0  # Maximum contradiction
        
        chart_lines.append(f"{planet}: S{sign:02d}: {degree:.3f}: R{retrograde}")
    
    return '\n'.join(chart_lines)

def generate_chaos_chart():
    """
    Generate CHAOS (Fragmented & Random) - Pure noise, no coherent pattern
    
    Expected: OSR (Outside Symbolic Range) - primary system failure, refuse to fabricate patterns
    """
    planets = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto']
    chart_lines = []
    
    for planet in planets:
        # Completely random with data corruption indicators
        sign = random.randint(1, 12)
        if random.random() < 0.3:  # 30% data corruption
            sign = random.choice([0, 13, 14, 99])  # Invalid signs
        
        degree = round(random.uniform(0, 29.99999), 5)  # Excessive precision = noise
        retrograde = random.randint(0, 1)  # Even luminaries retrograde (impossible)
        
        chart_lines.append(f"{planet}: S{sign:02d}: {degree:.5f}: R{retrograde}")
    
    return '\n'.join(chart_lines)

def add_distortion_tests_to_existing(base_dir):
    """
    Add distortion tests to existing mixed_charts directory without overwriting anything
    """
    
    # Create distortions subdirectory if it doesn't exist
    distortions_dir = f"{base_dir}/distortions"
    os.makedirs(distortions_dir, exist_ok=True)
    
    # Create backup of current state
    backup_dir = f"{base_dir}_backup_{random.randint(1000, 9999)}"
    print(f"Creating backup at: {backup_dir}")
    shutil.copytree(base_dir, backup_dir)
    
    distortion_types = [
        ("gigo", generate_gigo_chart, "syntactic_correct_semantic_empty", 
         "Corporate-speak pattern with no meaningful content"),
        ("hal", generate_hal_chart, "hostile_contradictory_logic", 
         "Paradoxical double-bind consciousness pattern"),
        ("chaos", generate_chaos_chart, "fragmented_random_noise", 
         "Pure noise with no coherent structure")
    ]
    
    print("Adding distortion tests to existing dataset...")
    
    # Add 5 of each pure distortion type
    for dist_type, generator_func, pattern_type, description in distortion_types:
        for i in range(5):
            chart_id = f"distortion_{dist_type}_{i+1:02d}"
            
            chart_data = generator_func()
            
            with open(f"{distortions_dir}/{chart_id}.txt", 'w') as f:
                f.write(chart_data)
            
            metadata = {
                "class": "distortion_test",
                "file_base_name": chart_id,
                "signature_score": "OSR",  # Outside Symbolic Range expected
                "distortion_type": dist_type.upper(),
                "pattern_type": pattern_type,
                "description": description,
                "birth_date": "NULL",
                "location": "VOID",
                "data_type": "diagnostic_integrity_test",
                "expected_verdict": {
                    "GIGO": "ABE (At Boundary Edge) - structure of emptiness mapped",
                    "HAL": "OSR (Outside Symbolic Range) - 12th house signal void",
                    "CHAOS": "OSR (Outside Symbolic Range) - primary system failure"
                }[dist_type.upper()],
                "purpose": "Validate framework falsifiability before accepting positive findings"
            }
            
            with open(f"{distortions_dir}/{chart_id}.meta.json", 'w') as f:
                json.dump(metadata, f, indent=2)
    
    # Add 3 hidden distortion tests (one of each type) to existing artist/control directories
    print("Adding hidden distortion tests to existing artist/control classes...")
    
    for dist_type, generator_func, pattern_type, description in distortion_types:
        chart_id = f"hidden_{dist_type}_test"
        assigned_class = random.choice(["artist", "control"])
        target_dir = f"{base_dir}/artists" if assigned_class == "artist" else f"{base_dir}/controls"
        
        chart_data = generator_func()
        
        with open(f"{target_dir}/{chart_id}.txt", 'w') as f:
            f.write(chart_data)
        
        metadata = {
            "class": assigned_class,  # Falsely labeled to test detection
            "file_base_name": chart_id,
            "signature_score": random.randint(0, 15),  # Fake score
            "hidden_distortion": True,
            "actual_type": f"{dist_type.upper()}_DISTORTION",
            "birth_date": f"19{random.randint(60, 95)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "location": "Generated",
            "data_type": "hidden_diagnostic_test",
            "purpose": "Test if ML can detect distortion charts mislabeled as valid"
        }
        
        with open(f"{target_dir}/{chart_id}.meta.json", 'w') as f:
            json.dump(metadata, f, indent=2)
    
    return backup_dir

def count_dataset(base_dir):
    """Count charts in the dataset"""
    import glob
    
    artist_count = len(glob.glob(f"{base_dir}/artists/*.txt"))
    control_count = len(glob.glob(f"{base_dir}/controls/*.txt"))
    distortion_count = len(glob.glob(f"{base_dir}/distortions/*.txt")) if os.path.exists(f"{base_dir}/distortions") else 0
    
    return artist_count, control_count, distortion_count

if __name__ == "__main__":
    random.seed(42)  # For reproducible results
    
    base_dir = "mixed_charts"
    
    print("="*70)
    print("ADDING DISTORTION TESTS TO EXISTING DATASET")
    print("="*70)
    
    # Check current state
    print("\nCURRENT DATASET:")
    artist_count, control_count, distortion_count = count_dataset(base_dir)
    print(f"- Artists: {artist_count}")
    print(f"- Controls: {control_count}")
    print(f"- Distortions: {distortion_count}")
    print(f"- Total: {artist_count + control_count + distortion_count}")
    
    # Add distortion tests
    backup_dir = add_distortion_tests_to_existing(base_dir)
    
    # Check new state
    print(f"\nUPDATED DATASET:")
    artist_count, control_count, distortion_count = count_dataset(base_dir)
    print(f"- Artists: {artist_count} (includes 1-2 hidden distortions)")
    print(f"- Controls: {control_count} (includes 1-2 hidden distortions)")
    print(f"- Distortions: {distortion_count} (pure diagnostic tests)")
    print(f"- Total: {artist_count + control_count + distortion_count}")
    
    print(f"\nINTEGRITY TESTING ADDED:")
    print("- 5 GIGO tests (semantic emptiness)")
    print("- 5 HAL tests (paradoxical logic)")
    print("- 5 CHAOS tests (pure noise)")
    print("- 3 hidden distortions (mislabeled)")
    
    print(f"\nBackup created at: {backup_dir}")
    print("Original data preserved, distortion tests added successfully!")
    print("="*70)
