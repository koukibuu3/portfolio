#!/bin/bash

echo "Copying notes directory for static serving..."

# Check if notes directory exists
if [ ! -d "notes" ]; then
    echo "Warning: Notes directory not found. Creating empty structure."
    mkdir -p notes/Article/Assets
    echo "# No articles available" > notes/Article/README.md
fi

# Vercel環境では、publicディレクトリへのコピーは避ける
# 代わりに、APIルートでファイルを直接提供する

echo "Notes directory handling complete"