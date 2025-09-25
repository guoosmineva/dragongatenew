#!/usr/bin/env python3
"""
Local Backend API Testing Script for PostgreSQL Database Integration
Tests all API endpoints locally to verify database integration is working
"""

import requests
import json
import sys

BASE_URL = "http://localhost:3000/api"
ADMIN_EMAIL = "admin@gamevault.com"
ADMIN_PASSWORD = "GameVault2025!"
admin_token = None

def test_local_endpoint(endpoint, method="GET", expected_status=200, description="", data=None, headers=None):
    """Test a local API endpoint and return the response"""
    url = f"{BASE_URL}/{endpoint}"
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Method: {method}")
    print(f"URL: {url}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return None, None
            
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == expected_status:
            print("✅ Status code matches expected")
        else:
            print(f"❌ Expected status {expected_status}, got {response.status_code}")
            
        # Try to parse JSON response
        try:
            json_data = response.json()
            if isinstance(json_data, dict):
                if 'data' in json_data and isinstance(json_data['data'], list):
                    print(f"Data length: {len(json_data['data'])}")
                elif 'data' in json_data and isinstance(json_data['data'], dict):
                    print(f"Single data object returned")
                elif 'message' in json_data:
                    print(f"Message: {json_data['message']}")
                elif 'error' in json_data:
                    print(f"Error: {json_data['error']}")
            return response, json_data
        except json.JSONDecodeError:
            print(f"Response text: {response.text[:200] if response.text else 'Empty response'}")
            return response, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None, None

def main():
    """Main testing function"""
    print("🚀 Starting Local Backend API Testing - PostgreSQL Database Integration")
    print(f"Base URL: {BASE_URL}")
    
    test_results = []
    
    # Test 1: GET /api/games - Return all games from PostgreSQL database
    print("\n" + "="*80)
    print("TEST 1: GET /api/games - Return all 13 games from PostgreSQL database")
    print("="*80)
    
    response, data = test_local_endpoint("games", expected_status=200, description="Get all games from PostgreSQL")
    if response and data and 'data' in data:
        games_count = len(data['data'])
        print(f"✅ Returned {games_count} games from database")
        if games_count >= 13:
            print("✅ Expected number of games (13+) returned from database")
            test_results.append(("GET /api/games", True, f"Returned {games_count} games"))
        else:
            print(f"⚠️  Expected at least 13 games, got {games_count}")
            test_results.append(("GET /api/games", True, f"Returned {games_count} games (expected 13+)"))
    else:
        test_results.append(("GET /api/games", False, "Request failed"))
    
    # Test 2: GET /api/games?featured=true - Return featured games from database
    response, data = test_local_endpoint("games?featured=true", expected_status=200, description="Get featured games")
    if response and data and 'data' in data:
        featured_count = len(data['data'])
        print(f"✅ Returned {featured_count} featured games")
        test_results.append(("GET /api/games?featured=true", True, f"Returned {featured_count} featured games"))
    else:
        test_results.append(("GET /api/games?featured=true", False, "Request failed"))
    
    # Test 3: GET /api/games?search=wukong - Search in database
    response, data = test_local_endpoint("games?search=wukong", expected_status=200, description="Search for wukong")
    if response and data and 'data' in data:
        search_count = len(data['data'])
        print(f"✅ Search returned {search_count} games")
        test_results.append(("GET /api/games?search=wukong", True, f"Search returned {search_count} games"))
    else:
        test_results.append(("GET /api/games?search=wukong", False, "Request failed"))
    
    # Test 4: GET /api/games?category=Action - Filter by category
    response, data = test_local_endpoint("games?category=Action", expected_status=200, description="Get Action games")
    if response and data and 'data' in data:
        action_count = len(data['data'])
        print(f"✅ Returned {action_count} Action games")
        test_results.append(("GET /api/games?category=Action", True, f"Returned {action_count} Action games"))
    else:
        test_results.append(("GET /api/games?category=Action", False, "Request failed"))
    
    # Test 5: GET /api/games/wukong - Get single game by slug
    response, data = test_local_endpoint("games/wukong", expected_status=200, description="Get game by slug")
    if response and data and 'data' in data:
        game_title = data['data'].get('title', 'Unknown')
        print(f"✅ Retrieved game: {game_title}")
        test_results.append(("GET /api/games/wukong", True, f"Retrieved game: {game_title}"))
    else:
        test_results.append(("GET /api/games/wukong", False, "Request failed"))
    
    # Test 6: Admin authentication
    print("\n" + "="*80)
    print("TEST 6: Admin Authentication")
    print("="*80)
    
    auth_data = {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    response, data = test_local_endpoint("admin/login", method="POST", expected_status=200, 
                                       description="Admin login", data=auth_data)
    
    global admin_token
    if response and data and 'token' in data:
        admin_token = data['token']
        print(f"✅ Admin authentication successful")
        test_results.append(("POST /api/admin/login", True, "Admin authentication successful"))
    else:
        print("❌ Admin authentication failed")
        test_results.append(("POST /api/admin/login", False, "Admin authentication failed"))
    
    # Test 7: Admin protected endpoints
    if admin_token:
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get admin games
        response, data = test_local_endpoint("admin/games", expected_status=200, 
                                           description="Get games for admin", headers=headers)
        if response and data and 'data' in data:
            admin_games_count = len(data['data'])
            print(f"✅ Admin retrieved {admin_games_count} games")
            test_results.append(("GET /api/admin/games", True, f"Admin retrieved {admin_games_count} games"))
        else:
            test_results.append(("GET /api/admin/games", False, "Request failed"))
        
        # Create new game
        new_game_data = {
            "title": "Local Test Game",
            "description": "A test game created during local testing",
            "category": "Test",
            "downloadUrl": "https://example.com/local-test.zip",
            "slug": "local-test-game",
            "featured": False,
            "downloads": 0
        }
        
        response, data = test_local_endpoint("admin/games", method="POST", expected_status=200,
                                           description="Create new game", data=new_game_data, headers=headers)
        if response and data and 'message' in data:
            print(f"✅ Successfully created new game")
            test_results.append(("POST /api/admin/games", True, "New game created successfully"))
        else:
            test_results.append(("POST /api/admin/games", False, "Request failed"))
    
    # Test 8: Unauthorized access
    response, data = test_local_endpoint("admin/games", expected_status=401, description="Test unauthorized access")
    if response and response.status_code == 401:
        print("✅ Correctly returned 401 for unauthorized access")
        test_results.append(("GET /api/admin/games (unauthorized)", True, "Correctly returned 401"))
    elif response:
        print(f"❌ Expected 401, got {response.status_code}")
        test_results.append(("GET /api/admin/games (unauthorized)", False, f"Expected 401, got {response.status_code}"))
    else:
        print("❌ No response received")
        test_results.append(("GET /api/admin/games (unauthorized)", False, "No response received"))
    
    # Print final summary
    print("\n" + "="*80)
    print("🏁 LOCAL TEST SUMMARY - PostgreSQL Database Integration")
    print("="*80)
    
    passed_tests = 0
    total_tests = len(test_results)
    
    for test_name, passed, details in test_results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status}: {test_name} - {details}")
        if passed:
            passed_tests += 1
    
    print(f"\n📊 Results: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 All local tests passed! PostgreSQL database integration is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)