#!/usr/bin/env python3
"""
Backend API Testing Script for Game Catalog API with PostgreSQL Database
Tests all API endpoints including new PostgreSQL-based endpoints and admin functionality
"""

import requests
import json
import sys
import os
from urllib.parse import urljoin

# Get base URL from environment
def get_base_url():
    """Get the base URL for API testing"""
    try:
        with open('/app/.env', 'r') as f:
            for line in f:
                if line.startswith('NEXT_PUBLIC_BASE_URL='):
                    base_url = line.split('=', 1)[1].strip()
                    return f"{base_url}/api"
    except Exception as e:
        print(f"Error reading .env file: {e}")
    
    # Fallback to localhost for testing
    return "http://localhost:3000/api"

BASE_URL = get_base_url()
print(f"Testing API at: {BASE_URL}")

# Admin credentials for testing
ADMIN_EMAIL = "admin@gamevault.com"
ADMIN_PASSWORD = "GameVault2025!"
admin_token = None

def test_api_endpoint(endpoint, method="GET", expected_status=200, description="", data=None, headers=None):
    """Test an API endpoint and return the response"""
    url = urljoin(BASE_URL + "/", endpoint)
    print(f"\n{'='*60}")
    print(f"Testing: {description}")
    print(f"Method: {method}")
    print(f"URL: {url}")
    if headers:
        print(f"Headers: {headers}")
    if data:
        print(f"Data: {json.dumps(data, indent=2)}")
    print(f"{'='*60}")
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=10, headers=headers)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=10, headers=headers)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=10, headers=headers)
        elif method == "DELETE":
            response = requests.delete(url, timeout=10, headers=headers)
        else:
            print(f"❌ Unsupported method: {method}")
            return None, None
            
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == expected_status:
            print("✅ Status code matches expected")
        else:
            print(f"❌ Expected status {expected_status}, got {response.status_code}")
            
        # Try to parse JSON response
        try:
            json_data = response.json()
            print(f"Response JSON structure: {type(json_data)}")
            if isinstance(json_data, dict):
                print(f"JSON keys: {list(json_data.keys())}")
                if 'data' in json_data:
                    print(f"Data type: {type(json_data['data'])}")
                    if isinstance(json_data['data'], list):
                        print(f"Data length: {len(json_data['data'])}")
                        if json_data['data']:
                            print(f"First item keys: {list(json_data['data'][0].keys()) if json_data['data'] else 'No items'}")
            return response, json_data
        except json.JSONDecodeError:
            print(f"❌ Response is not valid JSON: {response.text[:200]}")
            return response, None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None, None

def authenticate_admin():
    """Authenticate admin user and get token"""
    global admin_token
    print("\n" + "="*80)
    print("ADMIN AUTHENTICATION")
    print("="*80)
    
    auth_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    response, data = test_api_endpoint("admin/login", method="POST", expected_status=200, 
                                     description="Admin login", data=auth_data)
    
    if response and data and 'token' in data:
        admin_token = data['token']
        print(f"✅ Admin authentication successful")
        print(f"Token: {admin_token[:20]}...")
        return True
    else:
        print("❌ Admin authentication failed")
        return False

def validate_game_structure(game):
    """Validate that a game object has the expected structure"""
    required_fields = ['id', 'documentId', 'title', 'description', 'category', 'downloadUrl', 'slug', 'featured', 'downloads']
    missing_fields = []
    
    for field in required_fields:
        if field not in game:
            missing_fields.append(field)
    
    if missing_fields:
        print(f"❌ Missing required fields: {missing_fields}")
        return False
    else:
        print("✅ Game structure is valid")
        return True

def main():
    """Main testing function"""
    print("🚀 Starting Backend API Testing - PostgreSQL Database Integration")
    print(f"Base URL: {BASE_URL}")
    
    test_results = []
    
    # =================================
    # NEW POSTGRESQL-BASED API TESTS
    # =================================
    
    # Test 1: GET /api/games - Return all games from PostgreSQL database
    print("\n" + "="*80)
    print("TEST 1: GET /api/games - Return all 13 games from PostgreSQL database")
    print("="*80)
    
    response, data = test_api_endpoint("games", expected_status=200, description="Get all games from PostgreSQL")
    if response and data:
        if 'data' in data and isinstance(data['data'], list):
            games_count = len(data['data'])
            print(f"✅ Returned {games_count} games from database")
            if games_count == 13:
                print("✅ Correct number of games (13) returned from database")
                test_results.append(("GET /api/games", True, f"Returned {games_count} games from PostgreSQL"))
            else:
                print(f"⚠️  Expected 13 games, got {games_count}")
                test_results.append(("GET /api/games", True, f"Returned {games_count} games (expected 13)"))
            
            if games_count > 0:
                print(f"Sample game: {data['data'][0]['title']}")
                validate_game_structure(data['data'][0])
        else:
            print("❌ Response doesn't have expected 'data' array structure")
            test_results.append(("GET /api/games", False, "Invalid response structure"))
    else:
        test_results.append(("GET /api/games", False, "Request failed"))
    
    # Test 2: GET /api/games?featured=true - Return featured games from database
    print("\n" + "="*80)
    print("TEST 2: GET /api/games?featured=true - Return featured games from database")
    print("="*80)
    
    response, data = test_api_endpoint("games?featured=true", expected_status=200, description="Get featured games from PostgreSQL")
    if response and data:
        if 'data' in data and isinstance(data['data'], list):
            featured_games = data['data']
            print(f"✅ Returned {len(featured_games)} featured games from database")
            
            # Verify all returned games are featured
            all_featured = all(game.get('featured', False) for game in featured_games)
            if all_featured:
                print("✅ All returned games are marked as featured")
                test_results.append(("GET /api/games?featured=true", True, f"Returned {len(featured_games)} featured games"))
            else:
                print("❌ Some returned games are not marked as featured")
                test_results.append(("GET /api/games?featured=true", False, "Non-featured games in results"))
        else:
            print("❌ Response doesn't have expected 'data' array structure")
            test_results.append(("GET /api/games?featured=true", False, "Invalid response structure"))
    else:
        test_results.append(("GET /api/games?featured=true", False, "Request failed"))
    
    # Test 3: GET /api/games?search=wukong - Search in database
    print("\n" + "="*80)
    print("TEST 3: GET /api/games?search=wukong - Search in database")
    print("="*80)
    
    response, data = test_api_endpoint("games?search=wukong", expected_status=200, description="Search for 'wukong' in database")
    if response and data:
        if 'data' in data and isinstance(data['data'], list):
            search_results = data['data']
            print(f"✅ Returned {len(search_results)} games matching 'wukong' from database")
            
            # Verify search results contain 'wukong' in title
            if search_results:
                found_wukong = any('wukong' in game.get('title', '').lower() for game in search_results)
                if found_wukong:
                    print("✅ Search results contain games with 'wukong' in title")
                    print(f"Found games: {[game['title'] for game in search_results]}")
                    test_results.append(("GET /api/games?search=wukong", True, f"Found {len(search_results)} matching games"))
                else:
                    print("❌ Search results don't contain 'wukong' in title")
                    test_results.append(("GET /api/games?search=wukong", False, "Search results don't match query"))
            else:
                print("❌ No search results returned")
                test_results.append(("GET /api/games?search=wukong", False, "No search results"))
        else:
            print("❌ Response doesn't have expected 'data' array structure")
            test_results.append(("GET /api/games?search=wukong", False, "Invalid response structure"))
    else:
        test_results.append(("GET /api/games?search=wukong", False, "Request failed"))
    
    # Test 4: GET /api/games?category=Action - Filter by category in database
    print("\n" + "="*80)
    print("TEST 4: GET /api/games?category=Action - Filter by category in database")
    print("="*80)
    
    response, data = test_api_endpoint("games?category=Action", expected_status=200, description="Get Action category games from database")
    if response and data:
        if 'data' in data and isinstance(data['data'], list):
            action_games = data['data']
            print(f"✅ Returned {len(action_games)} Action games from database")
            
            # Verify all returned games are in Action category
            all_action = all(game.get('category') == 'Action' for game in action_games)
            if all_action:
                print("✅ All returned games are in Action category")
                print(f"Action games: {[game['title'] for game in action_games]}")
                test_results.append(("GET /api/games?category=Action", True, f"Returned {len(action_games)} Action games"))
            else:
                print("❌ Some returned games are not in Action category")
                test_results.append(("GET /api/games?category=Action", False, "Non-Action games in results"))
        else:
            print("❌ Response doesn't have expected 'data' array structure")
            test_results.append(("GET /api/games?category=Action", False, "Invalid response structure"))
    else:
        test_results.append(("GET /api/games?category=Action", False, "Request failed"))
    
    # Test 5: GET /api/games/wukong - Get single game by slug from database
    print("\n" + "="*80)
    print("TEST 5: GET /api/games/wukong - Get single game by slug from database")
    print("="*80)
    
    response, data = test_api_endpoint("games/wukong", expected_status=200, description="Get individual game by slug from database")
    if response and data:
        if 'data' in data and isinstance(data['data'], dict):
            game = data['data']
            print(f"✅ Returned individual game from database: {game.get('title', 'No title')}")
            if validate_game_structure(game):
                test_results.append(("GET /api/games/wukong", True, "Individual game retrieved from database"))
            else:
                test_results.append(("GET /api/games/wukong", False, "Invalid game structure"))
        else:
            print("❌ Response doesn't have expected 'data' object structure")
            test_results.append(("GET /api/games/wukong", False, "Invalid response structure"))
    else:
        test_results.append(("GET /api/games/wukong", False, "Request failed"))
    
    # =================================
    # ADMIN AUTHENTICATION TESTS
    # =================================
    
    # Test 6: POST /api/admin/login - Admin authentication
    print("\n" + "="*80)
    print("TEST 6: POST /api/admin/login - Admin authentication")
    print("="*80)
    
    auth_success = authenticate_admin()
    if auth_success:
        test_results.append(("POST /api/admin/login", True, "Admin authentication successful"))
    else:
        test_results.append(("POST /api/admin/login", False, "Admin authentication failed"))
    
    # =================================
    # ADMIN PROTECTED ENDPOINTS TESTS
    # =================================
    
    if admin_token:
        # Test 7: GET /api/admin/games - Get games for authenticated admin
        print("\n" + "="*80)
        print("TEST 7: GET /api/admin/games - Get games for authenticated admin")
        print("="*80)
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        response, data = test_api_endpoint("admin/games", expected_status=200, 
                                         description="Get games for admin", headers=headers)
        if response and data:
            if 'data' in data and isinstance(data['data'], list):
                admin_games_count = len(data['data'])
                print(f"✅ Admin retrieved {admin_games_count} games from database")
                test_results.append(("GET /api/admin/games", True, f"Admin retrieved {admin_games_count} games"))
            else:
                print("❌ Response doesn't have expected 'data' array structure")
                test_results.append(("GET /api/admin/games", False, "Invalid response structure"))
        else:
            test_results.append(("GET /api/admin/games", False, "Request failed"))
        
        # Test 8: POST /api/admin/games - Create new game (requires admin token)
        print("\n" + "="*80)
        print("TEST 8: POST /api/admin/games - Create new game (requires admin token)")
        print("="*80)
        
        new_game_data = {
            "title": "Test Game for API Testing",
            "description": "A test game created during API testing",
            "category": "Test",
            "downloadUrl": "https://example.com/test-game.zip",
            "slug": "test-game-api-testing",
            "featured": False,
            "downloads": 0
        }
        
        headers = {"Authorization": f"Bearer {admin_token}"}
        response, data = test_api_endpoint("admin/games", method="POST", expected_status=200,
                                         description="Create new game as admin", 
                                         data=new_game_data, headers=headers)
        if response and data:
            if 'message' in data and 'data' in data:
                print(f"✅ Successfully created new game: {data['data'].get('title', 'Unknown')}")
                test_results.append(("POST /api/admin/games", True, "New game created successfully"))
            else:
                print("❌ Response doesn't have expected structure")
                test_results.append(("POST /api/admin/games", False, "Invalid response structure"))
        else:
            test_results.append(("POST /api/admin/games", False, "Request failed"))
    
    else:
        print("\n❌ Skipping admin protected endpoint tests - no admin token")
        test_results.append(("GET /api/admin/games", False, "Skipped - no admin token"))
        test_results.append(("POST /api/admin/games", False, "Skipped - no admin token"))
    
    # Test 9: Test unauthorized access to admin endpoints
    print("\n" + "="*80)
    print("TEST 9: GET /api/admin/games - Test unauthorized access")
    print("="*80)
    
    response, data = test_api_endpoint("admin/games", expected_status=401, 
                                     description="Test unauthorized access to admin endpoint")
    if response and response.status_code == 401:
        print("✅ Correctly returned 401 for unauthorized access")
        test_results.append(("GET /api/admin/games (unauthorized)", True, "Correctly returned 401"))
    else:
        print("❌ Did not return 401 for unauthorized access")
        test_results.append(("GET /api/admin/games (unauthorized)", False, "Did not return 401"))
    
    # Print final summary
    print("\n" + "="*80)
    print("🏁 FINAL TEST SUMMARY - PostgreSQL Database Integration")
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
        print("🎉 All tests passed! PostgreSQL database integration is working correctly.")
        return True
    else:
        print("⚠️  Some tests failed. Check the details above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)