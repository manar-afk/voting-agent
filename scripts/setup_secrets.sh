#!/bin/bash
# setup_secrets.sh
# Run this script using Google Cloud Shell or when gcloud is installed locally.

# Replace with your actual project ID
PROJECT_ID="your-gcp-project-id"

echo "Setting up GCP Secret Manager for Voter-saathi..."

# 1. Vertex AI / Gemini API Key
echo -n "Enter your Vertex AI / Gemini API Key: "
read -s VERTEX_API_KEY
echo ""
echo -n "$VERTEX_API_KEY" | gcloud secrets create VITE_VERTEX_API_KEY \
    --data-file=- \
    --replication-policy="automatic" \
    --project="$PROJECT_ID"

# 2. Firebase API Key
echo -n "Enter your Firebase API Key: "
read -s FIREBASE_API_KEY
echo ""
echo -n "$FIREBASE_API_KEY" | gcloud secrets create VITE_FIREBASE_API_KEY \
    --data-file=- \
    --replication-policy="automatic" \
    --project="$PROJECT_ID"

# 3. Google Maps API Key
echo -n "Enter your Google Maps API Key: "
read -s MAPS_API_KEY
echo ""
echo -n "$MAPS_API_KEY" | gcloud secrets create VITE_MAPS_API_KEY \
    --data-file=- \
    --replication-policy="automatic" \
    --project="$PROJECT_ID"

echo "Secrets successfully created in Secret Manager."
echo "You can now bind these to your Cloud Run service using the --update-secrets flag."
