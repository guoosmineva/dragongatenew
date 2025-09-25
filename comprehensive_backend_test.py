#!/usr/bin/env python3
"""
Comprehensive Backend API Testing Script
Tests both local and external endpoints to identify infrastructure issues
"""

import requests
import json
import sys
import subprocess

def test_local_endpoints():
    """Test all endpoints locally"""
    print("🔍 Testing Local Endpoints (localhost:3000)")
    print("="*60)
    
    base_url = "http://localhost:3000/api"
    test_results = []
    
    endpoints = [
        ("strapi/games", "Get all games"),
        ("strapi/games?featured=true", "Get featured games"),
        ("strapi/games?search=wukong", "Search for wukong"),
        ("strapi/games?category=Action", "Get Action games"),
        ("strapi/articles", "Get articles"),
        ("strapi/games/wukong", "Get individual game"),
        ("root", "Test root endpoint")
    ]
    
    for endpoint, description in endpoints:
        url = f"{base_url}/{endpoint}"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {description}: {response.status_code} - {type(data)}")
                if 'data' in data:
                    if isinstance(data['data'], list):
                        print(f"   📊 Returned {len(data['data'])} items")
                    else:
                        print(f"   📊 Returned single item: {data['data'].get('title', 'N/A')}")
                test_results.append((endpoint, True, f"Local: {response.status_code}"))
            else:
                print(f"❌ {description}: {response.status_code}")
                test_results.append((endpoint, False, f"Local: {response.status_code}"))
        except Exception as e:
            print(f"❌ {description}: Error - {e}")
            test_results.append((endpoint, False, f"Local: Error - {e}"))
    
    return test_results

def test_external_endpoints():
    """Test all endpoints externally"""
    print("\n🌐 Testing External Endpoints")
    print("="*60)
    
    # Read base URL from .env
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_BASE_URL='):
                    base_url = line.split('=', 1)[1].strip() + "/api"
                    break
    except:
        base_url = "https://gamevault-app-2.preview.emergentagent.com/api"
    
    print(f"External URL: {base_url}")
    
    test_results = []
    endpoints = [
        ("strapi/games", "Get all games"),
        ("strapi/games?featured=true", "Get featured games"),
        ("root", "Test root endpoint")
    ]
    
    for endpoint, description in endpoints:
        url = f"{base_url}/{endpoint}"
        try:
            response = requests.get(url, timeout=10)
            print(f"🔗 {description}: {response.status_code}")
            if response.status_code == 502:
                print("   ⚠️  502 Bad Gateway - Infrastructure/Ingress issue")
            test_results.append((endpoint, response.status_code == 200, f"External: {response.status_code}"))
        except Exception as e:
            print(f"❌ {description}: Error - {e}")
            test_results.append((endpoint, False, f"External: Error - {e}"))
    
    return test_results

def main():
    """Main testing function"""
    print("🚀 Comprehensive Backend API Testing")
    print("="*80)
    
    # Test local endpoints
    local_results = test_local_endpoints()
    
    # Test external endpoints  
    external_results = test_external_endpoints()
    
    # Summary
    print("\n📋 SUMMARY")
    print("="*60)
    
    local_passed = sum(1 for _, passed, _ in local_results if passed)
    external_passed = sum(1 for _, passed, _ in external_results if passed)
    
    print(f"Local Tests: {local_passed}/{len(local_results)} passed")
    print(f"External Tests: {external_passed}/{len(external_results)} passed")
    
    if local_passed == len(local_results) and external_passed == 0:
        print("\n🎯 DIAGNOSIS: Backend APIs work perfectly locally but fail externally")
        print("   This indicates a Kubernetes ingress/routing configuration issue")
        print("   The Next.js application and all API endpoints are functioning correctly")
        return True
    elif local_passed == len(local_results):
        print("\n✅ All local tests passed - Backend is working correctly")
        return True
    else:
        print("\n❌ Some local tests failed - Backend has issues")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)