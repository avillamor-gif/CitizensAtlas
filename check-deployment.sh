#!/bin/bash
# Check if latest changes are deployed to Vercel

echo "🔍 Checking deployment status..."
echo ""

# Get latest local commit
LOCAL_COMMIT=$(git log -1 --pretty=format:"%h - %s")
echo "📝 Latest local commit:"
echo "   $LOCAL_COMMIT"
echo ""

# Get latest GitHub commit
echo "🌐 Latest GitHub commit:"
GITHUB_COMMIT=$(curl -s "https://api.github.com/repos/albertobvillamor-dev/Citizens-Atlas/commits/main" | jq -r '(.sha[:7] + " - " + .commit.message)')
echo "   $GITHUB_COMMIT"
echo ""

# Check if they match
LOCAL_SHA=$(echo $LOCAL_COMMIT | cut -d' ' -f1)
GITHUB_SHA=$(echo $GITHUB_COMMIT | cut -d' ' -f1)

if [ "$LOCAL_SHA" = "$GITHUB_SHA" ]; then
    echo "✅ Local and GitHub are in sync!"
else
    echo "⚠️  Local and GitHub are NOT in sync. Did you push?"
fi
echo ""

# Check Vercel deployment
echo "🚀 Checking Vercel..."
echo "   Dashboard: https://vercel.com/avillamors-projects/citizens-atlas/deployments"
echo "   Live site: https://citizens-atlas.vercel.app/"
echo ""
echo "💡 To see latest changes:"
echo "   1. Hard refresh: Shift + Reload in browser"
echo "   2. Or add ?v=$(date +%s) to URL"
