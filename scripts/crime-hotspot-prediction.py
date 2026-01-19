import json
import sys
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

def predict_crime_hotspots(crime_data, n_clusters=5):
    """
    Predict crime hotspots using K-Means clustering
    
    Args:
        crime_data: List of dicts with 'latitude' and 'longitude' keys
        n_clusters: Number of hotspot clusters to identify
    
    Returns:
        Dict containing hotspots and clustered crimes
    """
    try:
        if not crime_data or len(crime_data) < 2:
            return {
                "success": False,
                "error": "Insufficient data for clustering (need at least 2 data points)",
                "hotspots": [],
                "clustered_crimes": []
            }
        
        # Extract coordinates
        coordinates = np.array([[crime['latitude'], crime['longitude']] for crime in crime_data])
        
        # Standardize the data
        scaler = StandardScaler()
        scaled_coords = scaler.fit_transform(coordinates)
        
        # Apply K-Means clustering
        kmeans = KMeans(n_clusters=min(n_clusters, len(crime_data)), random_state=42, n_init=10)
        clusters = kmeans.fit_predict(scaled_coords)
        
        # Get hotspot centers (inverse transform to original scale)
        hotspot_centers = scaler.inverse_transform(kmeans.cluster_centers_)
        
        # Calculate crime density for each hotspot
        hotspots = []
        for idx, center in enumerate(hotspot_centers):
            cluster_crimes = [crime for crime, cluster in zip(crime_data, clusters) if cluster == idx]
            crime_count = len(cluster_crimes)
            risk_level = "Low" if crime_count <= 2 else ("Medium" if crime_count <= 5 else "High")
            
            hotspots.append({
                "id": str(idx),
                "latitude": float(center[0]),
                "longitude": float(center[1]),
                "crime_count": crime_count,
                "risk_level": risk_level,
                "crimes": [
                    {
                        "title": crime.get("title", "Unknown Crime"),
                        "category": crime.get("category", "other"),
                        "priority": crime.get("priority", "medium"),
                        "latitude": crime.get("latitude"),
                        "longitude": crime.get("longitude")
                    }
                    for crime in cluster_crimes
                ]
            })
        
        # Sort by crime count (descending)
        hotspots.sort(key=lambda x: x['crime_count'], reverse=True)
        
        # Add cluster assignment to original crimes
        clustered_crimes = []
        for crime, cluster_id in zip(crime_data, clusters):
            crime_with_cluster = crime.copy()
            crime_with_cluster['cluster_id'] = str(cluster_id)
            clustered_crimes.append(crime_with_cluster)
        
        return {
            "success": True,
            "hotspots": hotspots,
            "clustered_crimes": clustered_crimes,
            "total_clusters": len(hotspots),
            "total_crimes": len(crime_data)
        }
    
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "hotspots": [],
            "clustered_crimes": []
        }

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = json.loads(sys.stdin.read())
        crime_data = input_data.get('crimes', [])
        n_clusters = input_data.get('n_clusters', 5)
        
        # Run prediction
        result = predict_crime_hotspots(crime_data, n_clusters)
        
        # Output result as JSON
        print(json.dumps(result))
    
    except json.JSONDecodeError:
        print(json.dumps({
            "success": False,
            "error": "Invalid JSON input",
            "hotspots": [],
            "clustered_crimes": []
        }))
    except Exception as e:
        print(json.dumps({
            "success": False,
            "error": str(e),
            "hotspots": [],
            "clustered_crimes": []
        }))
