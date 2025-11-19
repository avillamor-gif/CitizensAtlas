#!/bin/bash

echo "🚀 Deploying working localhost configuration to production..."
echo "=================================================="

# 1. Ensure we're on the main branch with latest changes
echo "📦 Preparing local files..."
git add .
git status

# 2. Check if there are any uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
    echo "📝 Found uncommitted changes, committing them..."
    git commit -m "Final production deployment - sync with working localhost"
else
    echo "✅ Working tree is clean"
fi

# 3. Push to GitHub (which triggers Vercel deployment)
echo "🔄 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Code pushed successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. Wait for Vercel to redeploy (usually takes 1-2 minutes)"
echo "2. Check deployment status at: https://vercel.com/dashboard"
echo "3. Test the site at: https://citizens-atlas.vercel.app"
echo ""
echo "🚨 If still not working, the issue is likely:"
echo "   - Missing environment variables in Vercel dashboard"
echo "   - Supabase RLS policies (which we already fixed)"
echo "   - Vercel build cache issues"
echo ""
echo "💡 To force a fresh deploy, you can:"
echo "   - Trigger a rebuild in Vercel dashboard"
echo "   - Or make a small change and push again"